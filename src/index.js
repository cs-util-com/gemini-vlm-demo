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
	prepareDetectionData,
	escapeHtml
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

		// Draw segmentation mask if present
		if (d.mask) {
			drawMask(d.mask, d.bbox, coordSystem, scaleX, scaleY, naturalW, naturalH, coordOrigin, color);
		}

		// Draw bounding box
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
		
		// Draw points if present
		if (Array.isArray(d.points) && d.points.length > 0) {
			drawPoints(d.points, coordSystem, scaleX, scaleY, naturalW, naturalH, coordOrigin, color);
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

function drawMask(maskData, bbox, coordSystem, scaleX, scaleY, naturalW, naturalH, coordOrigin, color) {
	if (!maskData || !bbox) return;
	
	try {
		// Create a temporary image to load the mask
		const img = new Image();
		img.onload = () => {
			// Get the bounding box position
			const boxRect = toCanvasBox(bbox, coordSystem, scaleX, scaleY, naturalW, naturalH, coordOrigin, canvas.width, canvas.height);
			if (!boxRect) return;
			
			// Create a temporary canvas for the mask
			const tempCanvas = document.createElement('canvas');
			tempCanvas.width = img.width;
			tempCanvas.height = img.height;
			const tempCtx = tempCanvas.getContext('2d');
			
			// Draw mask to temp canvas
			tempCtx.drawImage(img, 0, 0);
			
			// Get pixel data
			const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
			const data = imageData.data;
			
			// Parse color (e.g., "#3B68FF" or "rgb(59, 104, 255)")
			let r = 59, g = 104, blue = 255;
			if (color.startsWith('#')) {
				r = parseInt(color.substr(1, 2), 16);
				g = parseInt(color.substr(3, 2), 16);
				blue = parseInt(color.substr(5, 2), 16);
			} else if (color.startsWith('rgb')) {
				const match = color.match(/\d+/g);
				if (match && match.length >= 3) {
					r = parseInt(match[0]);
					g = parseInt(match[1]);
					blue = parseInt(match[2]);
				}
			}
			
			// Apply color to mask (alpha from mask grayscale)
			for (let i = 0; i < data.length; i += 4) {
				const alpha = data[i]; // Use red channel as alpha
				data[i] = r;
				data[i + 1] = g;
				data[i + 2] = blue;
				data[i + 3] = alpha;
			}
			
			tempCtx.putImageData(imageData, 0, 0);
			
			// Draw the colored mask onto the main canvas
			ctx.save();
			ctx.globalAlpha = 0.5;
			ctx.drawImage(tempCanvas, 0, 0, img.width, img.height, boxRect.x, boxRect.y, boxRect.width, boxRect.height);
			ctx.restore();
		};
		
		// Handle both data URIs and base64 strings
		if (maskData.startsWith('data:')) {
			img.src = maskData;
		} else {
			img.src = `data:image/png;base64,${maskData}`;
		}
	} catch (err) {
		console.warn('Failed to draw mask:', err);
	}
}

function drawPoints(points, coordSystem, scaleX, scaleY, naturalW, naturalH, coordOrigin, color) {
	if (!points || points.length === 0) return;
	
	ctx.save();
	ctx.fillStyle = color;
	ctx.strokeStyle = '#ffffff';
	ctx.lineWidth = 2;
	
	for (const point of points) {
		// Point format is [y, x] normalized to 0-1000
		if (!Array.isArray(point) || point.length < 2) continue;
		
		const [y, x] = point;
		
		// Convert from normalized coordinates to canvas pixels
		let canvasX, canvasY;
		if (coordSystem === 'normalized_0_1000') {
			canvasX = (x / 1000) * naturalW * scaleX;
			canvasY = (y / 1000) * naturalH * scaleY;
		} else {
			canvasX = x * scaleX;
			canvasY = y * scaleY;
		}
		
		// Draw a circle for each point
		ctx.beginPath();
		ctx.arc(canvasX, canvasY, 6, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
	}
	
	ctx.restore();
}

// colorForCategory is now imported from ui-utils.js

function convertNewResponseToOldFormat(newResponse) {
	// Convert new response format {items: [...]} to old format {detections: [...], global_insights: [...]}
	if (!newResponse || !newResponse.items || !Array.isArray(newResponse.items)) {
		return { detections: [], global_insights: [] };
	}

	const detections = newResponse.items.map((item, index) => {
		// Convert box_2d [y0, x0, y1, x1] to bbox [ymin, xmin, ymax, xmax]
		const bbox = item.box_2d || null;
		
		// Generate ID if not present
		const id = item.id || `det_${index}`;
		
		// Map category - default to "object" if not specified
		let category = 'object';
		if (item.category) {
			const cat = item.category.toLowerCase();
			if (['object', 'facility_asset', 'safety_issue', 'progress', 'other'].includes(cat)) {
				category = cat;
			}
		}
		
		// Detect safety issues based on keywords or explicit category
		if (category === 'safety_issue' || item.severity) {
			category = 'safety_issue';
		}
		
		const detection = {
			id,
			label: item.label || 'item',
			category,
			confidence: item.confidence || 0.8,
			bbox
		};
		
		// Add safety info if present
		if (category === 'safety_issue') {
			detection.safety = {
				isViolation: true,
				severity: item.severity || 'medium',
				rule: null
			};
		}
		
		// Store mask and points for later visualization
		if (item.mask) {
			detection.mask = item.mask;
		}
		if (item.points && Array.isArray(item.points)) {
			detection.points = item.points;
		}
		
		return detection;
	});
	
	return {
		detections,
		global_insights: [],
		image: {
			coordSystem: 'normalized_0_1000'
		}
	};
}

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
			response_schema: RESPONSE_SCHEMA,
			temperature: 0.5,
			thinking_config: { thinking_budget: 0 }
		}
	};
	const camel = {
		contents: [{ parts }],
		generationConfig: {
			responseMimeType: "application/json",
			responseSchema: RESPONSE_SCHEMA,
			temperature: 0.5,
			thinkingConfig: { thinkingBudget: 0 }
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
	const model  = modelEl.value.trim() || 'gemini-2.5-flash';

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
			const rawParsed = extractJSONFromResponse(resp);
			
			// Convert new format to old format
			const parsed = convertNewResponseToOldFormat(rawParsed);

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
