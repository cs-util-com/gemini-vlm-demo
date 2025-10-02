/* istanbul ignore file */

import { AEC_PROMPT, RESPONSE_SCHEMA } from './aec-schema.js';
import {
	toCanvasBox,
	toCanvasPolygon,
	ensureCoordSystem,
	ensureCoordOrigin
} from './geometry.js';
import {
	colorForCategory,
	extractJSONFromResponse,
	calculateDisplayScale,
	formatJsonOutput,
	extractBase64FromDataUrl,
	prepareDetectionData
} from './ui-utils.js';
import {
	renderReportUI,
	setupReportInteractions
} from './report-ui.js';
import {
	createSession,
	calculateSessionAggregates,
	updateSessionStatus,
	getSessionProgress
} from './session.js';
import { processBatch } from './batch-processor.js';
import { exportSessionJSON, exportSessionCSV, downloadFile } from './export.js';

// ---------- UI Elements ----------
const apiKeyEl = document.getElementById('apiKey');
const modelEl  = document.getElementById('model');
const fileEl   = document.getElementById('file');
const dropzone = document.getElementById('dropzone');
const canvas   = document.getElementById('canvas');
const ctx      = canvas.getContext('2d');
const reportWrap = document.getElementById('reportWrap');
const jsonOut  = document.getElementById('jsonOut');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');
const gallery = document.getElementById('gallery');

const STORAGE_KEY = 'geminiApiKey';
const MAX_IMAGES = 20;

// Session state
let currentSession = null;
let isAnalyzing = false;
let pendingApiKeyAnalysis = false;

// Legacy single-image state (for backwards compatibility)
let currentFile = null;
let currentImageBitmap = null;
let currentDetections = [];
let currentParsedData = null;
let naturalW = 0, naturalH = 0;
let highlightedDetectionId = null;
let analysisQueued = false;

// ---------- Helpers ----------
function logJson(obj, note) {
	jsonOut.textContent = formatJsonOutput(obj, note);
}

function clearReport() {
	reportWrap.innerHTML = '';
}

// ---------- Multi-Image Functions ----------

async function handleMultipleFiles(files) {
	const fileArray = Array.from(files);
	
	if (fileArray.length > MAX_IMAGES) {
		logJson({ error: `Maximum ${MAX_IMAGES} images allowed. You selected ${fileArray.length}.` }, 'Error');
		return;
	}

	const apiKey = apiKeyEl.value.trim();
	if (!apiKey) {
		pendingApiKeyAnalysis = true;
		logJson({ message: `${fileArray.length} images loaded. Enter your API key to start analysis.` });
		return;
	}

	pendingApiKeyAnalysis = false;
	await analyzeMultipleImages(fileArray);
}

async function analyzeMultipleImages(files) {
	if (isAnalyzing) return;
	isAnalyzing = true;

	// Create session
	currentSession = createSession(files);
	
	// Hide dropzone, show progress bar and gallery
	dropzone.style.display = 'none';
	progressBar.style.display = 'block';
	gallery.style.display = 'block';
	clearReport();

	// Render gallery
	renderGallery();

	// Load image bitmaps
	for (const img of currentSession.images) {
		try {
			img.bitmap = await createImageBitmap(img.file);
			img.naturalWidth = img.bitmap.width;
			img.naturalHeight = img.bitmap.height;
		} catch (err) {
			img.error = `Failed to load image: ${err.message}`;
			img.status = 'error';
		}
		updateGalleryThumb(img.id);
	}

	// Display first image
	if (currentSession.images.length > 0) {
		await displaySessionImage(0);
	}

	// Process all images
	const apiKey = apiKeyEl.value.trim();
	const model = modelEl.value.trim() || 'gemini-2.5-pro';

	await processBatch(
		currentSession.images.filter(img => img.status === 'queued'),
		async (img) => {
			img.status = 'analyzing';
			updateProgress();
			updateGalleryThumb(img.id);

			const resp = await callGeminiREST({ apiKey, model, file: img.file });
			const parsed = extractJSONFromResponse(resp);
			prepareDetectionData(parsed, img.naturalWidth, img.naturalHeight);

			const coordSystem = ensureCoordSystem(parsed, 'normalized_0_1000');
			ensureCoordOrigin(parsed, 'top-left');
			if (parsed.image.coordSystem == null) parsed.image.coordSystem = coordSystem;

			img.parsedData = parsed;
			img.detections = Array.isArray(parsed.detections) ? parsed.detections : [];
			img.status = 'completed';

			return parsed;
		},
		(img, result, error) => {
			if (error) {
				img.error = String(error?.message || error);
				img.status = 'error';
			}
			updateProgress();
			updateGalleryThumb(img.id);
			
			// Redraw active image if it's the one that just completed
			if (currentSession.activeImageIndex === currentSession.images.indexOf(img)) {
				drawOverlaysForSession();
			}
		}
	);

	// All done - calculate aggregates and show report
	currentSession.status = updateSessionStatus(currentSession);
	currentSession.sessionAggregates = calculateSessionAggregates(currentSession);

	progressBar.style.display = 'none';

	// Render session report
	const reportHtml = renderReportUI(null, currentSession);
	reportWrap.innerHTML = reportHtml;

	// Setup interactions
	const activeImg = currentSession.images[currentSession.activeImageIndex];
	if (activeImg && activeImg.status === 'completed') {
		setupReportInteractions(
			reportWrap,
			activeImg.detections,
			(detection) => {
				highlightedDetectionId = detection.id;
				drawOverlaysForSession();
			},
			() => {
				highlightedDetectionId = null;
				drawOverlaysForSession();
			}
		);
	}

	// Setup export buttons
	const exportJSONBtn = document.getElementById('exportJSON');
	const exportCSVBtn = document.getElementById('exportCSV');
	
	if (exportJSONBtn) {
		exportJSONBtn.addEventListener('click', () => {
			const json = exportSessionJSON(currentSession);
			downloadFile(json, `session_${currentSession.sessionId}.json`, 'application/json');
		});
	}
	
	if (exportCSVBtn) {
		exportCSVBtn.addEventListener('click', () => {
			const csv = exportSessionCSV(currentSession);
			downloadFile(csv, `session_${currentSession.sessionId}.csv`, 'text/csv');
		});
	}

	logJson({ message: `Analysis complete. ${currentSession.sessionAggregates.totalDetections} detections across ${currentSession.images.filter(img => img.status === 'completed').length} images.` });
	isAnalyzing = false;
}

function renderGallery() {
	gallery.innerHTML = '';
	currentSession.images.forEach((img, index) => {
		const thumb = document.createElement('div');
		thumb.className = 'gallery-thumb';
		thumb.id = `thumb-${img.id}`;
		if (index === currentSession.activeImageIndex) {
			thumb.classList.add('active');
		}

		const imgEl = document.createElement('img');
		imgEl.className = 'gallery-thumb-img';
		if (img.bitmap) {
			imgEl.src = createThumbnailDataUrl(img.bitmap);
		}

		const nameEl = document.createElement('div');
		nameEl.className = 'gallery-thumb-name';
		nameEl.textContent = img.filename;

		const statusEl = document.createElement('div');
		statusEl.className = `gallery-thumb-status ${img.status}`;
		statusEl.id = `status-${img.id}`;
		statusEl.textContent = img.status;

		thumb.appendChild(imgEl);
		thumb.appendChild(nameEl);
		thumb.appendChild(statusEl);

		thumb.addEventListener('click', () => {
			displaySessionImage(index);
		});

		gallery.appendChild(thumb);
	});
}

function updateGalleryThumb(imageId) {
	const img = currentSession.images.find(i => i.id === imageId);
	if (!img) return;

	const statusEl = document.getElementById(`status-${imageId}`);
	if (statusEl) {
		statusEl.className = `gallery-thumb-status ${img.status}`;
		statusEl.textContent = img.status;
	}
}

async function displaySessionImage(index) {
	if (!currentSession || index < 0 || index >= currentSession.images.length) return;

	currentSession.activeImageIndex = index;
	const img = currentSession.images[index];

	// Update gallery active state
	document.querySelectorAll('.gallery-thumb').forEach((thumb, i) => {
		thumb.classList.toggle('active', i === index);
	});

	// Draw image
	if (img.bitmap) {
		currentImageBitmap = img.bitmap;
		naturalW = img.naturalWidth;
		naturalH = img.naturalHeight;
		currentDetections = img.detections || [];
		currentParsedData = img.parsedData;

		const scale = calculateDisplayScale(naturalW, window.innerWidth);
		canvas.width = Math.round(naturalW * scale);
		canvas.height = Math.round(naturalH * scale);

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(img.bitmap, 0, 0, canvas.width, canvas.height);

		drawOverlaysForSession();
	}
}

function drawOverlaysForSession() {
	if (!currentSession || !currentImageBitmap) return;

	const img = currentSession.images[currentSession.activeImageIndex];
	if (!img || img.status !== 'completed') return;

	drawOverlaysForData(img.bitmap, img.parsedData, img.detections, img.naturalWidth, img.naturalHeight);
}

function updateProgress() {
	if (!currentSession) return;

	const progress = getSessionProgress(currentSession);
	progressText.textContent = `Analyzing ${progress.done} of ${progress.total} images...`;
	progressFill.style.width = `${progress.percentage}%`;
	progressFill.textContent = `${progress.percentage}%`;
}

function createThumbnailDataUrl(bitmap) {
	const thumbCanvas = document.createElement('canvas');
	const thumbCtx = thumbCanvas.getContext('2d');
	const maxHeight = 80;
	const scale = maxHeight / bitmap.height;
	thumbCanvas.width = bitmap.width * scale;
	thumbCanvas.height = maxHeight;
	thumbCtx.drawImage(bitmap, 0, 0, thumbCanvas.width, thumbCanvas.height);
	return thumbCanvas.toDataURL('image/jpeg', 0.7);
}

function drawOverlays() {
	if (!currentImageBitmap || !currentParsedData) return;
	drawOverlaysForData(currentImageBitmap, currentParsedData, currentDetections, naturalW, naturalH);
}

function drawOverlaysForData(bitmap, parsedData, detections, natW, natH) {
	if (!bitmap || !parsedData) return;

	// Redraw base image
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

	const scaleX = canvas.width / natW;
	const scaleY = canvas.height / natH;
	const coordSystem = ensureCoordSystem(parsedData, 'normalized_0_1000');
	const coordOrigin = ensureCoordOrigin(parsedData, 'top-left');

	for (const d of detections) {
		const isHighlighted = highlightedDetectionId === d.id;
		const color = colorForCategory(d.category);
		const label = `${d.label ?? 'item'}${typeof d.confidence === 'number' ? ` (${(d.confidence*100).toFixed(0)}%)` : ''}`;

		if (isHighlighted) {
			ctx.save();
			ctx.shadowColor = color;
			ctx.shadowBlur = 15;
		}

		if (d.bbox) {
			const b = toCanvasBox(
				d.bbox,
				coordSystem,
				scaleX,
				scaleY,
				natW,
				natH,
				coordOrigin,
				canvas.width,
				canvas.height
			);
			if (b) {
				if (isHighlighted) ctx.lineWidth = 4;
				drawBox(b, label, color);
			}
		}
		if (Array.isArray(d.polygon) && d.polygon.length >= 3) {
			const pts = toCanvasPolygon(d.polygon, coordSystem, scaleX, scaleY, natW, natH, coordOrigin);
			if (pts) {
				if (isHighlighted) ctx.lineWidth = 4;
				drawPolygon(pts, label, color);
			}
		}

		if (isHighlighted) {
			ctx.restore();
		}
	}
}

function getStoredApiKey() {
	try {
		return globalThis.localStorage?.getItem(STORAGE_KEY) || '';
	} catch {
		return '';
	}
}

function persistApiKey(value) {
	try {
		const trimmed = value.trim();
		if (trimmed) {
			globalThis.localStorage?.setItem(STORAGE_KEY, trimmed);
		} else {
			globalThis.localStorage?.removeItem(STORAGE_KEY);
		}
	} catch {
		// Ignore storage errors (private mode, quotas, etc.)
	}
}

const storedApiKey = getStoredApiKey();
if (storedApiKey) {
	apiKeyEl.value = storedApiKey;
}

function toBase64(file) {
	return new Promise((res, rej) => {
		const r = new FileReader();
		r.onload = () => res(extractBase64FromDataUrl(String(r.result)));
		r.onerror = rej;
		r.readAsDataURL(file);
	});
}

async function drawImage(file) {
	const bmp = await createImageBitmap(file);
	currentImageBitmap = bmp;
	naturalW = bmp.width;
	naturalH = bmp.height;
	// Fit to viewport width but keep full resolution internally
	const scale = calculateDisplayScale(naturalW, window.innerWidth);
	canvas.width  = Math.round(naturalW * scale);
	canvas.height = Math.round(naturalH * scale);
	// Draw scaled image
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
	return { scaleX: scale, scaleY: scale };
}

function setDrag(drag) {
	dropzone.classList.toggle('drag', !!drag);
}

function drawLabelBox(x, y, text) {
	ctx.save();
	ctx.font = '12px ui-sans-serif, system-ui, -apple-system';
	const pad = 4;
	const metrics = ctx.measureText(text);
	const w = metrics.width + pad*2;
	const h = 16 + pad*2;
	ctx.fillStyle = 'rgba(0,0,0,0.6)';
	ctx.fillRect(x, Math.max(0, y - h), w, h);
	ctx.fillStyle = '#ffffff';
	ctx.fillText(text, x + pad, Math.max(12 + (y - h) + pad, 12));
	ctx.restore();
}

function drawBox(b, label, color) {
	ctx.save();
	ctx.lineWidth = 2;
	ctx.strokeStyle = color;
	ctx.strokeRect(b.x, b.y, b.width, b.height);
	drawLabelBox(b.x, b.y, label);
	ctx.restore();
}

function drawPolygon(points, label, color) {
	if (!points || points.length < 3) return;
	ctx.save();
	ctx.lineWidth = 2;
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(points[0].x, points[0].y);
	for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
	ctx.closePath();
	ctx.stroke();
	// Label near first vertex
	drawLabelBox(points[0].x, points[0].y, label);
	ctx.restore();
}

// colorForCategory is now imported from ui-utils.js

async function callGeminiREST({ apiKey, model, file }) {
	const base64 = await toBase64(file);
	const parts = [
		{ inline_data: { mime_type: file.type || 'image/jpeg', data: base64 } },
		{ text: AEC_PROMPT }
	];

	// Build two payload flavors: snake_case (REST-preferred) and camelCase (fallback)
	const snake = {
		contents: [{ parts }],
		generationConfig: {
			response_mime_type: "application/json",
			response_schema: RESPONSE_SCHEMA
		}
	};
	const camel = {
		contents: [{ parts }],
		generationConfig: {
			responseMimeType: "application/json",
			responseSchema: RESPONSE_SCHEMA
		}
	};

	const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
	async function post(body) {
		const r = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-goog-api-key': apiKey
			},
			body: JSON.stringify(body)
		});
		const data = await r.json().catch(() => ({}));
		if (!r.ok) {
			const msg = (data && (data.error?.message || data.candidates?.[0]?.finishReason)) || `HTTP ${r.status}`;
			throw new Error(msg);
		}
		return data;
	}

	try {
		return await post(snake);
	} catch (e1) {
		// Retry with camelCase schema fields if the first fails
		try {
			return await post(camel);
		} catch (e2) {
			throw new Error(`Gemini call failed.\nFirst: ${e1.message}\nThen: ${e2.message}`);
		}
	}
}

// extractJSONFromResponse is now imported from ui-utils.js

async function analyzeCurrentImage({ silentOnMissingKey = false } = {}) {
	const apiKey = apiKeyEl.value.trim();
	const model  = modelEl.value.trim() || 'gemini-2.5-pro';

	if (!apiKey) {
		if (!silentOnMissingKey) {
			logJson({ error: 'Missing API key' }, 'Error');
		}
		return;
	}

	if (!currentFile) {
		if (!silentOnMissingKey) {
			logJson({ error: 'No image selected' }, 'Error');
		}
		return;
	}

	persistApiKey(apiKey);
	pendingApiKeyAnalysis = false;

	if (isAnalyzing) {
		analysisQueued = true;
		return;
	}

	isAnalyzing = true;
	analysisQueued = false;

	clearReport();
	currentDetections = [];
	currentParsedData = null;
	highlightedDetectionId = null;

	if (currentImageBitmap) {
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.drawImage(currentImageBitmap, 0, 0, canvas.width, canvas.height);
	}

	logJson({ status: 'Calling Gemini…' });

	try {
		const resp = await callGeminiREST({ apiKey, model, file: currentFile });
		const parsed = extractJSONFromResponse(resp);

		prepareDetectionData(parsed, naturalW, naturalH);

		const coordSystem = ensureCoordSystem(parsed, 'normalized_0_1000');
		ensureCoordOrigin(parsed, 'top-left');
		if (parsed.image.coordSystem == null) parsed.image.coordSystem = coordSystem;

		currentParsedData = parsed;
		currentDetections = Array.isArray(parsed.detections) ? parsed.detections : [];

		drawOverlays();

		const reportHtml = renderReportUI(parsed);
		reportWrap.innerHTML = reportHtml;

		setupReportInteractions(
			reportWrap,
			currentDetections,
			(detection) => {
				highlightedDetectionId = detection.id;
				drawOverlays();
			},
			() => {
				highlightedDetectionId = null;
				drawOverlays();
			}
		);

		logJson(parsed, 'Model JSON');
	} catch (err) {
		clearReport();
		logJson({ error: String(err?.message || err) }, 'Error');
	} finally {
		isAnalyzing = false;
		if (analysisQueued) {
			analysisQueued = false;
			await analyzeCurrentImage({ silentOnMissingKey: true });
		}
	}
}

async function handleFileSelection(file) {
	if (!file) return;

	currentFile = file;
	currentParsedData = null;
	currentDetections = [];
	highlightedDetectionId = null;
	analysisQueued = false;

	try {
		await drawImage(file);
	} catch (err) {
		logJson({ error: `Failed to load image: ${String(err?.message || err)}` }, 'Error');
		return;
	}

	clearReport();

	const apiKey = apiKeyEl.value.trim();
	if (!apiKey) {
		pendingApiKeyAnalysis = true;
		logJson({ message: 'Image loaded. Enter your API key to start analysis.' });
		return;
	}

	pendingApiKeyAnalysis = false;
	await analyzeCurrentImage({ silentOnMissingKey: true });
}

// ---------- Event wiring ----------
dropzone.addEventListener('click', () => fileEl.click());

dropzone.addEventListener('dragover', e => { e.preventDefault(); setDrag(true); });
dropzone.addEventListener('dragleave', () => setDrag(false));
dropzone.addEventListener('drop', async e => {
	e.preventDefault();
	setDrag(false);
	const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
	
	if (files.length === 0) return;
	
	if (files.length === 1) {
		await handleFileSelection(files[0]);
	} else {
		await handleMultipleFiles(files);
	}
});

fileEl.addEventListener('change', async e => {
	const files = Array.from(e.target.files);
	if (files.length === 0) return;
	
	if (files.length === 1) {
		await handleFileSelection(files[0]);
	} else {
		await handleMultipleFiles(files);
	}
	e.target.value = '';
});

apiKeyEl.addEventListener('input', async e => {
	const value = e.target.value;
	persistApiKey(value);
	if (pendingApiKeyAnalysis && value.trim() && !isAnalyzing) {
		pendingApiKeyAnalysis = false;
		if (currentFile) {
			await analyzeCurrentImage({ silentOnMissingKey: true });
		} else if (currentSession) {
			await analyzeMultipleImages(currentSession.images.map(img => img.file));
		}
	}
});

// ---------- Initial message ----------
logJson({ message: 'Drop or click to choose images (up to 20). Analysis runs automatically.' });
