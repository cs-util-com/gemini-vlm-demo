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

// ---------- UI Elements ----------
const apiKeyEl = document.getElementById('apiKey');
const modelEl  = document.getElementById('model');
const fileEl   = document.getElementById('file');
const pickBtn  = document.getElementById('pickBtn');
const runBtn   = document.getElementById('runBtn');
const dropzone = document.getElementById('dropzone');
const canvas   = document.getElementById('canvas');
const ctx      = canvas.getContext('2d');
const reportWrap = document.getElementById('reportWrap');
const jsonOut  = document.getElementById('jsonOut');

const STORAGE_KEY = 'geminiApiKey';

let currentFile = null;
let currentImageBitmap = null;
let currentDetections = [];
let currentParsedData = null;
let naturalW = 0, naturalH = 0;
let highlightedDetectionId = null;

// ---------- Helpers ----------
function logJson(obj, note) {
	jsonOut.textContent = formatJsonOutput(obj, note);
}

function clearReport() {
	reportWrap.innerHTML = '';
}

function drawOverlays() {
	if (!currentImageBitmap || !currentParsedData) return;

	// Redraw base image
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(currentImageBitmap, 0, 0, canvas.width, canvas.height);

	const scaleX = canvas.width / naturalW;
	const scaleY = canvas.height / naturalH;
	const coordSystem = ensureCoordSystem(currentParsedData, 'normalized_0_1000');
	const coordOrigin = ensureCoordOrigin(currentParsedData, 'top-left');

	for (const d of currentDetections) {
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

// ---------- Event wiring ----------
pickBtn.addEventListener('click', () => fileEl.click());

dropzone.addEventListener('dragover', e => { e.preventDefault(); setDrag(true); });
dropzone.addEventListener('dragleave', () => setDrag(false));
dropzone.addEventListener('drop', async e => {
	e.preventDefault(); setDrag(false);
	const f = e.dataTransfer.files?.[0];
	if (f) {
		currentFile = f;
		await drawImage(f);
		logJson({ message: 'Image ready. Click "Analyze" to run the model.' });
	}
});

fileEl.addEventListener('change', async e => {
	const f = e.target.files?.[0];
	if (f) {
		currentFile = f;
		await drawImage(f);
		logJson({ message: 'Image ready. Click "Analyze" to run the model.' });
	}
});

apiKeyEl.addEventListener('input', e => {
	persistApiKey(e.target.value);
});

runBtn.addEventListener('click', async () => {
	const apiKey = apiKeyEl.value.trim();
	const model  = modelEl.value.trim() || 'gemini-2.5-pro';
	persistApiKey(apiKey);
	if (!apiKey) return logJson({ error: 'Missing API key' }, 'Error');
	if (!currentFile) return logJson({ error: 'No image selected' }, 'Error');

	// Clear previous results
	clearReport();
	currentDetections = [];
	currentParsedData = null;
	highlightedDetectionId = null;

	// Redraw base image before overlays
	if (currentImageBitmap) {
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.drawImage(currentImageBitmap, 0, 0, canvas.width, canvas.height);
	}

	logJson({ status: 'Calling Gemini…' });

	try {
		const resp = await callGeminiREST({ apiKey, model, file: currentFile });
		const parsed = extractJSONFromResponse(resp);

		// Fill in image.width/height if missing (helps downstream)
		prepareDetectionData(parsed, naturalW, naturalH);

		// Gemini's standard: normalized_0_1000 with top-left origin
		const coordSystem = ensureCoordSystem(parsed, 'normalized_0_1000');
		const coordOrigin = ensureCoordOrigin(parsed, 'top-left');
		if (parsed.image.coordSystem == null) parsed.image.coordSystem = coordSystem;

		// Store current data
		currentParsedData = parsed;
		currentDetections = Array.isArray(parsed.detections) ? parsed.detections : [];

		// Draw initial overlays
		drawOverlays();

		// Render interactive report
		const reportHtml = renderReportUI(
			parsed,
			(detection) => {
				highlightedDetectionId = detection.id;
				drawOverlays();
			},
			(detection) => {
				highlightedDetectionId = null;
				drawOverlays();
			}
		);
		reportWrap.innerHTML = reportHtml;

		// Setup interactions
		setupReportInteractions(
			reportWrap,
			currentDetections,
			(detection) => {
				highlightedDetectionId = detection.id;
				drawOverlays();
			},
			(detection) => {
				highlightedDetectionId = null;
				drawOverlays();
			}
		);

		// Show full JSON (including any global_insights that don't map to boxes)
		logJson(parsed, 'Model JSON');

	} catch (err) {
		clearReport();
		logJson({ error: String(err?.message || err) }, 'Error');
	}
});

// ---------- Initial message ----------
logJson({ message: 'Drop an image or choose a file, then click "Analyze".' });
