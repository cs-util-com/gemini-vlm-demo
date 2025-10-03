/* istanbul ignore file */

import { AEC_PROMPT, RESPONSE_SCHEMA } from './aec-schema.js';
import {
        toCanvasBox,
        toCanvasPolygon,
        ensureCoordSystem,
        ensureCoordOrigin,
        toCanvasPoint
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

const DETECTION_COLORS = [
        '#E6194B',
        '#3C89D0',
        '#3CB44B',
        '#FFE119',
        '#911EB4',
        '#42D4F4',
        '#F58231',
        '#F032E6',
        '#BFEF45',
        '#469990'
];
const MASK_BASE_ALPHA = 0.45;

// ---------- Helpers ----------
function logJson(obj, note) {
        jsonOut.textContent = formatJsonOutput(obj, note);
}

function hexToRgb(hex) {
        const normalized = hex?.startsWith('#') ? hex.slice(1) : hex;
        if (!normalized || normalized.length !== 6) return { r: 255, g: 255, b: 255 };
        const r = parseInt(normalized.slice(0, 2), 16);
        const g = parseInt(normalized.slice(2, 4), 16);
        const b = parseInt(normalized.slice(4, 6), 16);
        return {
                r: Number.isFinite(r) ? r : 255,
                g: Number.isFinite(g) ? g : 255,
                b: Number.isFinite(b) ? b : 255
        };
}

function ensureMaskDataUrl(maskBase64) {
        if (typeof maskBase64 !== 'string') return null;
        const trimmed = maskBase64.trim();
        if (!trimmed) return null;
        return trimmed.startsWith('data:') ? trimmed : `data:image/png;base64,${trimmed}`;
}

async function createTintedMaskCanvas(maskBase64, color) {
        const src = ensureMaskDataUrl(maskBase64);
        if (!src) return null;

        const image = await new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error('Failed to load mask image data'));
                img.src = src;
        });

        const canvasEl = document.createElement('canvas');
        canvasEl.width = image.width;
        canvasEl.height = image.height;
        const maskCtx = canvasEl.getContext('2d', { willReadFrequently: true });
        if (!maskCtx) return null;

        maskCtx.imageSmoothingEnabled = false;
        maskCtx.drawImage(image, 0, 0);
        const imageData = maskCtx.getImageData(0, 0, canvasEl.width, canvasEl.height);
        const data = imageData.data;
        const { r, g, b } = hexToRgb(color);

        for (let i = 0; i < data.length; i += 4) {
                const alpha = data[i];
                data[i] = r;
                data[i + 1] = g;
                data[i + 2] = b;
                data[i + 3] = alpha;
        }

        maskCtx.putImageData(imageData, 0, 0);
        return canvasEl;
}

async function attachVisualAssetsToDetections(detections) {
        if (!Array.isArray(detections)) return;

        const tasks = detections.map(async (det, index) => {
                const color = DETECTION_COLORS[index % DETECTION_COLORS.length];
                det.displayColor = color;

                if (det.mask) {
                        try {
                                const tinted = await createTintedMaskCanvas(det.mask, color);
                                if (tinted) {
                                        Object.defineProperty(det, 'maskCanvas', {
                                                value: tinted,
                                                enumerable: false,
                                                configurable: false,
                                                writable: false
                                        });
                                }
                        } catch (err) {
                                console.warn('Failed to decode segmentation mask', err);
                        }
                }
        });

        await Promise.allSettled(tasks);
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
                const color = d.displayColor || colorForCategory(d.category);
                const label = `${d.label ?? 'item'}${typeof d.confidence === 'number' ? ` (${(d.confidence*100).toFixed(0)}%)` : ''}`;

                const box = d.bbox ? toCanvasBox(
                        d.bbox,
                        coordSystem,
                        scaleX,
                        scaleY,
                        naturalW,
                        naturalH,
                        coordOrigin,
                        canvas.width,
                        canvas.height
                ) : null;

                if (d.maskCanvas && box) {
                        drawMask(d.maskCanvas, box, isHighlighted);
                }

                if (Array.isArray(d.points) && d.points.length > 0) {
                        let pointIndex = 0;
                        for (const pt of d.points) {
                                const canvasPoint = toCanvasPoint(pt, coordSystem, scaleX, scaleY, naturalW, naturalH, coordOrigin);
                                if (!canvasPoint) continue;
                                const pointLabel = !box && (pointIndex === 0)
                                        ? (d.points.length > 1 ? `${label} • ${pointIndex + 1}` : label)
                                        : null;
                                drawPointMarker(canvasPoint, pointLabel, color, isHighlighted);
                                pointIndex++;
                        }
                }

                if (Array.isArray(d.polygon) && d.polygon.length >= 3) {
                        const pts = toCanvasPolygon(d.polygon, coordSystem, scaleX, scaleY, naturalW, naturalH, coordOrigin);
                        if (pts) {
                                if (isHighlighted) {
                                        ctx.save();
                                        ctx.shadowColor = color;
                                        ctx.shadowBlur = 15;
                                        ctx.lineWidth = 4;
                                        drawPolygon(pts, label, color);
                                        ctx.restore();
                                } else {
                                        drawPolygon(pts, label, color);
                                }
                        }
                }

                if (box) {
                        if (isHighlighted) {
                                ctx.save();
                                ctx.shadowColor = color;
                                ctx.shadowBlur = 15;
                                ctx.lineWidth = 4;
                                drawBox(box, label, color);
                                ctx.restore();
                        } else {
                                drawBox(box, label, color);
                        }
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

function drawMask(maskCanvas, box, isHighlighted) {
        if (!maskCanvas || !box) return;
        ctx.save();
        ctx.globalAlpha = isHighlighted ? Math.min(1, MASK_BASE_ALPHA + 0.2) : MASK_BASE_ALPHA;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(maskCanvas, box.x, box.y, box.width, box.height);
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

function drawPointMarker(point, label, color, isHighlighted) {
        if (!point) return;
        ctx.save();
        ctx.lineWidth = isHighlighted ? 3 : 2;
        ctx.fillStyle = color;
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(point.x, point.y, isHighlighted ? 6 : 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        if (label) {
                drawLabelBox(point.x + 6, point.y - 6, label);
        }
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

        const modelInput = model?.trim() || 'models/gemini-2.5-flash';
        const modelId = modelInput.startsWith('models/') ? modelInput : `models/${modelInput}`;
        const modelPath = modelId.replace(/^models\//, '');

        // Build two payload flavors: snake_case (REST-preferred) and camelCase (fallback)
        const snake = {
                contents: [{ parts }],
                generationConfig: {
                        temperature: 0.5,
                        response_mime_type: "application/json",
                        response_schema: RESPONSE_SCHEMA,
                        thinking_config: { thinking_budget: 0 }
                }
        };
        const camel = {
                contents: [{ parts }],
                generationConfig: {
                        temperature: 0.5,
                        responseMimeType: "application/json",
                        responseSchema: RESPONSE_SCHEMA,
                        thinkingConfig: { thinkingBudget: 0 }
                }
        };

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelPath)}:generateContent`;
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
        const model  = modelEl.value.trim() || 'models/gemini-2.5-flash';

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

                        const prepared = prepareDetectionData(parsed, bitmap.width, bitmap.height);
                        await attachVisualAssetsToDetections(prepared.detections);
                        if (!prepared.image) prepared.image = {};
                        prepared.image.preprocessing = preprocess;
                        image.preprocessing = preprocess;

                        const coordSystem = ensureCoordSystem(prepared, 'normalized_0_1000');
                        ensureCoordOrigin(prepared, 'top-left');
                        if (prepared.image.coordSystem == null) prepared.image.coordSystem = coordSystem;

                        // Update status to completed
                        updateImageStatus(currentSession, image.imageId, 'completed', prepared);
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
