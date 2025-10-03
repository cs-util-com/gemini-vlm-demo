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
import { downscaleImageForGemini } from './image-utils.js';
import {
	renderReportUI,
	setupReportInteractions
} from './report-ui.js';
import {
	createSession,
	updateImageStatus,
	isSessionComplete,
	calculateSessionAggregates,
	exportSessionCSV,
	exportSessionJSON
} from './session-manager.js';
import {
	renderSessionSummary,
	renderImageSectionHeader
} from './session-report-ui.js';

// ---------- UI Elements ----------
const apiKeyEl = document.getElementById('apiKey');
const modelEl  = document.getElementById('model');
const fileEl   = document.getElementById('file');
const dropzone = document.getElementById('dropzone');
const canvas   = document.getElementById('canvas');
const ctx      = canvas.getContext('2d');
const reportWrap = document.getElementById('reportWrap');
const jsonOut  = document.getElementById('jsonOut');
const progressWrap = document.getElementById('progressWrap');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const progressPercent = document.getElementById('progressPercent');
const thumbnailGallery = document.getElementById('thumbnailGallery');

const STORAGE_KEY = 'geminiApiKey';
const MAX_IMAGES = 20;
const CONCURRENCY_LIMIT = 10;

let currentSession = null;
let currentImageIndex = 0;
let imageBitmaps = {}; // Store bitmaps by imageId
let naturalW = 0, naturalH = 0;
let highlightedDetectionId = null;
let isAnalyzing = false;
let pendingApiKeyAnalysis = false;

// ---------- Helpers ----------
function logJson(obj, note) {
	jsonOut.textContent = formatJsonOutput(obj, note);
}

function clearReport() {
	reportWrap.innerHTML = '';
}

function drawOverlays() {
	if (!currentSession || currentImageIndex >= currentSession.images.length) return;

	const currentImage = currentSession.images[currentImageIndex];
	const imageId = currentImage.imageId;
	const bitmap = imageBitmaps[imageId];
	const result = currentImage.result;

	if (!bitmap || !result) return;

	// Redraw base image
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

	const detections = Array.isArray(result.detections) ? result.detections : [];
	const scaleX = canvas.width / naturalW;
	const scaleY = canvas.height / naturalH;
	const coordSystem = ensureCoordSystem(result, 'normalized_0_1000');
	const coordOrigin = ensureCoordOrigin(result, 'top-left');

	for (const d of detections) {
		const isHighlighted = highlightedDetectionId === d.id;
		const color = colorForCategory(d.category);
		const label = `${d.label ?? 'item'}${typeof d.confidence === 'number' ? ` (${(d.confidence*100).toFixed(0)}%)` : ''}`;

		// Draw with extra emphasis if highlighted
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
				naturalW,
				naturalH,
				coordOrigin,
				canvas.width,
				canvas.height
			);
			if (b) {
				if (isHighlighted) {
					ctx.lineWidth = 4;
				}
				drawBox(b, label, color);
			}
		}
		if (Array.isArray(d.polygon) && d.polygon.length >= 3) {
			const pts = toCanvasPolygon(d.polygon, coordSystem, scaleX, scaleY, naturalW, naturalH, coordOrigin);
			if (pts) {
				if (isHighlighted) {
					ctx.lineWidth = 4;
				}
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
	naturalW = bmp.width;
	naturalH = bmp.height;
	// Fit to viewport width but keep full resolution internally
	const scale = calculateDisplayScale(naturalW, window.innerWidth);
	canvas.width  = Math.round(naturalW * scale);
	canvas.height = Math.round(naturalH * scale);
	// Draw scaled image
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
	return bmp;
}

function showProgress() {
	progressWrap.classList.remove('hidden');
}

function hideProgress() {
	progressWrap.classList.add('hidden');
}

function updateProgress(current, total) {
	const percent = total > 0 ? Math.round((current / total) * 100) : 0;
	progressBar.style.width = `${percent}%`;
	progressPercent.textContent = `${percent}%`;
	progressText.textContent = `Analyzing ${current} of ${total} images...`;
}

function renderThumbnails() {
	if (!currentSession) return;

	thumbnailGallery.innerHTML = '';
	thumbnailGallery.classList.remove('hidden');

	for (let i = 0; i < currentSession.images.length; i++) {
		const img = currentSession.images[i];
		const thumb = document.createElement('div');
		thumb.className = `thumbnail ${i === currentImageIndex ? 'active' : ''}`;
		thumb.dataset.imageIndex = i;

		// Create thumbnail from file
		const reader = new FileReader();
		reader.onload = (e) => {
			const imgEl = document.createElement('img');
			imgEl.src = e.target.result;
			thumb.appendChild(imgEl);
		};
		reader.readAsDataURL(img.file);

		// Status badge
		const status = document.createElement('div');
		status.className = `thumbnail-status ${img.status}`;
		status.textContent = img.status;
		thumb.appendChild(status);

		// Label
		const label = document.createElement('div');
		label.className = 'thumbnail-label';
		label.textContent = img.fileName;
		thumb.appendChild(label);

		// Click handler
		thumb.addEventListener('click', () => switchToImage(i));

		thumbnailGallery.appendChild(thumb);
	}
}

function updateThumbnailStatus(imageIndex) {
	if (!currentSession) return;

	const thumb = thumbnailGallery.querySelector(`[data-image-index="${imageIndex}"]`);
	if (!thumb) return;

	const img = currentSession.images[imageIndex];
	const statusEl = thumb.querySelector('.thumbnail-status');
	if (statusEl) {
		statusEl.className = `thumbnail-status ${img.status}`;
		statusEl.textContent = img.status;
	}
}

async function switchToImage(index) {
	if (!currentSession || index < 0 || index >= currentSession.images.length) return;

	currentImageIndex = index;
	const img = currentSession.images[index];

	// Update thumbnail active state
	thumbnailGallery.querySelectorAll('.thumbnail').forEach((el, i) => {
		el.classList.toggle('active', i === index);
	});

	// Load bitmap if needed
	if (!imageBitmaps[img.imageId]) {
		try {
			imageBitmaps[img.imageId] = await drawImage(img.file);
		} catch (err) {
			logJson({ error: `Failed to load image: ${err.message}` }, 'Error');
			return;
		}
	} else {
		// Redraw existing bitmap
		const bmp = imageBitmaps[img.imageId];
		naturalW = bmp.width;
		naturalH = bmp.height;
		const scale = calculateDisplayScale(naturalW, window.innerWidth);
		canvas.width = Math.round(naturalW * scale);
		canvas.height = Math.round(naturalH * scale);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
	}

	highlightedDetectionId = null;

	drawOverlays();

	// Scroll to image section in report
	const section = document.getElementById(`image-section-${img.imageId}`);
	if (section) {
		section.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
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
	const preprocessResult = await downscaleImageForGemini(file);
	const { blob, ...preprocess } = preprocessResult;
	const base64 = await toBase64(blob);
	const mimeType = preprocess.mimeType || blob.type || file.type || 'image/jpeg';
	preprocess.base64Length = base64.length;

	const parts = [
		{ inline_data: { mime_type: mimeType, data: base64 } },
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
		const data = await post(snake);
		return { data, preprocess };
	} catch (e1) {
		// Retry with camelCase schema fields if the first fails
		try {
			const data = await post(camel);
			return { data, preprocess };
		} catch (e2) {
			const err = new Error(`Gemini call failed.\nFirst: ${e1.message}\nThen: ${e2.message}`);
			err.preprocess = preprocess;
			throw err;
		}
	}
}

// extractJSONFromResponse is now imported from ui-utils.js

async function analyzeImageBatch(files) {
	const apiKey = apiKeyEl.value.trim();
	const model  = modelEl.value.trim() || 'gemini-2.5-pro';

	if (!apiKey) {
		logJson({ error: 'Missing API key' }, 'Error');
		return;
	}

	if (files.length === 0) {
		logJson({ error: 'No images selected' }, 'Error');
		return;
	}

	if (files.length > MAX_IMAGES) {
		logJson({ error: `Maximum ${MAX_IMAGES} images allowed. You selected ${files.length}.` }, 'Error');
		return;
	}

	persistApiKey(apiKey);
	pendingApiKeyAnalysis = false;
	isAnalyzing = true;

	clearReport();
	imageBitmaps = {};
	currentImageIndex = 0;

	// Create session
	currentSession = createSession(files);

	// Show progress and thumbnails
	showProgress();
	updateProgress(0, currentSession.totalImages);
	renderThumbnails();

	logJson({ status: `Starting batch analysis of ${files.length} image(s)...` });

	// Process images with concurrency limit
	const queue = [...currentSession.images];
	const inProgress = new Set();
	let completed = 0;

	async function processNext() {
		if (queue.length === 0) return;

		const image = queue.shift();
		inProgress.add(image.imageId);

		try {
			// Update status to analyzing
			updateImageStatus(currentSession, image.imageId, 'analyzing');
			updateThumbnailStatus(currentSession.images.indexOf(image));

			// Analyze image
			const { data: resp, preprocess } = await callGeminiREST({ apiKey, model, file: image.file });
			const parsed = extractJSONFromResponse(resp);

			// Load bitmap for this image
			const bitmap = await createImageBitmap(image.file);
			imageBitmaps[image.imageId] = bitmap;

			prepareDetectionData(parsed, bitmap.width, bitmap.height);
			if (!parsed.image) parsed.image = {};
			parsed.image.preprocessing = preprocess;
			image.preprocessing = preprocess;

			const coordSystem = ensureCoordSystem(parsed, 'normalized_0_1000');
			ensureCoordOrigin(parsed, 'top-left');
			if (parsed.image.coordSystem == null) parsed.image.coordSystem = coordSystem;

			// Update status to completed
			updateImageStatus(currentSession, image.imageId, 'completed', parsed);
			updateThumbnailStatus(currentSession.images.indexOf(image));

			completed++;
			updateProgress(completed, currentSession.totalImages);

		} catch (err) {
			// Update status to error
			if (err && err.preprocess) {
				image.preprocessing = err.preprocess;
			}
			updateImageStatus(currentSession, image.imageId, 'error', null, err);
			updateThumbnailStatus(currentSession.images.indexOf(image));

			completed++;
			updateProgress(completed, currentSession.totalImages);
		} finally {
			inProgress.delete(image.imageId);
		}

		// Process next if available
		if (queue.length > 0) {
			await processNext();
		}
	}

	// Start concurrent processing
	const workers = [];
	for (let i = 0; i < Math.min(CONCURRENCY_LIMIT, files.length); i++) {
		workers.push(processNext());
	}

	await Promise.all(workers);

	// All images processed
	isAnalyzing = false;
	hideProgress();

	if (isSessionComplete(currentSession)) {
		// Calculate aggregates
		currentSession.sessionAggregates = calculateSessionAggregates(currentSession);

		// Switch to first completed image
		const firstCompleted = currentSession.images.findIndex(img => img.status === 'completed');
		if (firstCompleted >= 0) {
			await switchToImage(firstCompleted);
		}

		// Render session report
		renderSessionReport();

		logJson({ 
			status: 'Batch analysis complete',
			completed: currentSession.completedImages,
			failed: currentSession.failedImages,
			totalDetections: currentSession.sessionAggregates.totalDetections
		}, 'Session Complete');
	}
}

function renderSessionReport() {
	if (!currentSession || !currentSession.sessionAggregates) return;

	let html = '';

	// Session summary
	html += renderSessionSummary(currentSession);

	// Per-image sections
	for (let i = 0; i < currentSession.images.length; i++) {
		const img = currentSession.images[i];
		
		if (img.status === 'completed' && img.result) {
			html += renderImageSectionHeader(img.imageId, img.fileName, i + 1);
			html += '<div style="margin: 0 20px;">';
			html += renderReportUI(img.result);
			html += '</div>';
		} else if (img.status === 'error') {
			html += renderImageSectionHeader(img.imageId, img.fileName, i + 1);
			html += `<div style="margin: 16px 20px; padding: 16px; background: #1a0f0f; border: 1px solid #4a2020; border-radius: 8px; color: #ff4444;">
				<strong>Analysis failed:</strong> ${escapeHtml(img.error?.message || 'Unknown error')}
			</div>`;
		}
	}

	reportWrap.innerHTML = html;

	// Setup interactions for all image sections
	for (const img of currentSession.images) {
		if (img.status === 'completed' && img.result) {
			const detections = Array.isArray(img.result.detections) ? img.result.detections : [];
			setupReportInteractions(
				reportWrap,
				detections,
				(detection) => {
					highlightedDetectionId = detection.id;
					drawOverlays();
				},
				() => {
					highlightedDetectionId = null;
					drawOverlays();
				}
			);
		}
	}

	// Enable navigation via safety issue chips
	reportWrap.querySelectorAll('.safety-image-chip').forEach(chip => {
		if (chip.dataset.navBound === 'true') return;
		chip.dataset.navBound = 'true';
		chip.addEventListener('click', () => {
			const imageId = chip.dataset.imageId;
			if (!imageId) return;
			const targetIndex = currentSession.images.findIndex(img => img.imageId === imageId);
			if (targetIndex >= 0) {
				switchToImage(targetIndex);
			}
		});
	});

	// Setup export buttons
	const exportCSVBtn = document.getElementById('exportCSV');
	const exportJSONBtn = document.getElementById('exportJSON');

	if (exportCSVBtn) {
		exportCSVBtn.addEventListener('click', () => {
			const csv = exportSessionCSV(currentSession);
			downloadFile(csv, `session_${currentSession.sessionId}.csv`, 'text/csv');
		});
	}

	if (exportJSONBtn) {
		exportJSONBtn.addEventListener('click', () => {
			const json = exportSessionJSON(currentSession);
			downloadFile(json, `session_${currentSession.sessionId}.json`, 'application/json');
		});
	}
}

function downloadFile(content, fileName, mimeType) {
	const blob = new Blob([content], { type: mimeType });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = fileName;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

function escapeHtml(text) {
	const div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}

async function handleFileSelection(files) {
	if (!files || files.length === 0) return;

	const apiKey = apiKeyEl.value.trim();
	if (!apiKey) {
		pendingApiKeyAnalysis = true;
		logJson({ message: `${files.length} image(s) loaded. Enter your API key to start analysis.` });
		return;
	}

	pendingApiKeyAnalysis = false;
	await analyzeImageBatch(files);
}

// ---------- Event wiring ----------
dropzone.addEventListener('click', () => fileEl.click());

dropzone.addEventListener('dragover', e => { e.preventDefault(); setDrag(true); });
dropzone.addEventListener('dragleave', () => setDrag(false));
dropzone.addEventListener('drop', async e => {
	e.preventDefault();
	setDrag(false);
	const files = Array.from(e.dataTransfer.files || []).filter(f => f.type.startsWith('image/'));
	if (files.length > 0) {
		await handleFileSelection(files);
	}
});

fileEl.addEventListener('change', async e => {
	const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));
	if (files.length > 0) {
		await handleFileSelection(files);
		e.target.value = '';
	}
});

apiKeyEl.addEventListener('input', async e => {
	const value = e.target.value;
	persistApiKey(value);
	if (pendingApiKeyAnalysis && value.trim() && !isAnalyzing) {
		pendingApiKeyAnalysis = false;
		if (currentSession) {
			const files = currentSession.images.map(img => img.file);
			await analyzeImageBatch(files);
		}
	}
});

// Keyboard navigation for images
document.addEventListener('keydown', e => {
	if (!currentSession || isAnalyzing) return;
	
	if (e.key === 'ArrowLeft') {
		e.preventDefault();
		const prev = currentImageIndex - 1;
		if (prev >= 0) switchToImage(prev);
	} else if (e.key === 'ArrowRight') {
		e.preventDefault();
		const next = currentImageIndex + 1;
		if (next < currentSession.images.length) switchToImage(next);
	}
});

// ---------- Initial message ----------
logJson({ message: 'Drop or click to choose images (max 20). Analysis starts automatically.' });
