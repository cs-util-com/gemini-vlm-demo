/* istanbul ignore file */

import { AEC_PROMPT, RESPONSE_SCHEMA } from './aec-schema.js';

// ---------- UI Elements ----------
const apiKeyEl = document.getElementById('apiKey');
const modelEl  = document.getElementById('model');
const fileEl   = document.getElementById('file');
const pickBtn  = document.getElementById('pickBtn');
const runBtn   = document.getElementById('runBtn');
const dropzone = document.getElementById('dropzone');
const canvas   = document.getElementById('canvas');
const ctx      = canvas.getContext('2d');
const jsonOut  = document.getElementById('jsonOut');

let currentFile = null;
let currentImageBitmap = null;
let naturalW = 0, naturalH = 0;

// ---------- Helpers ----------
function logJson(obj, note) {
	const head = note ? `// ${note}\n` : '';
	jsonOut.textContent = head + JSON.stringify(obj, null, 2);
}

function toBase64(file) {
	return new Promise((res, rej) => {
		const r = new FileReader();
		r.onload = () => res(String(r.result).split(',')[1]); // drop "data:mime;base64,"
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
	const maxW = Math.min(window.innerWidth - 60, naturalW);
	const scale = maxW / naturalW;
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

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

// Convert bbox coords to canvas pixels given coordSystem + display scale
function toCanvasBox(b, coordSystem, displayScaleX, displayScaleY, imgW, imgH) {
	if (!b) return null;
	let { x, y, width, height } = b;
	if (coordSystem === 'normalized_0_1000') {
		x = (x / 1000) * imgW;
		y = (y / 1000) * imgH;
		width  = (width  / 1000) * imgW;
		height = (height / 1000) * imgH;
	}
	// Scale to displayed canvas
	x *= displayScaleX; y *= displayScaleY;
	width *= displayScaleX; height *= displayScaleY;
	// Clamp to canvas
	x = clamp(x, 0, canvas.width); y = clamp(y, 0, canvas.height);
	width = clamp(width, 0, canvas.width - x); height = clamp(height, 0, canvas.height - y);
	return { x, y, width, height };
}

function toCanvasPolygon(poly, coordSystem, displayScaleX, displayScaleY, imgW, imgH) {
	if (!Array.isArray(poly)) return null;
	return poly.map(p => {
		let { x, y } = p;
		if (coordSystem === 'normalized_0_1000') {
			x = (x / 1000) * imgW;
			y = (y / 1000) * imgH;
		}
		return { x: x * displayScaleX, y: y * displayScaleY };
	});
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

function colorForCategory(cat) {
	switch (cat) {
		case 'safety_issue': return '#ff5b5b';
		case 'facility_asset': return '#5bd1ff';
		case 'progress': return '#a1ff5b';
		case 'object': return '#ffd05b';
		default: return '#cccccc';
	}
}

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

function extractJSONFromResponse(resp) {
	// Expect JSON as text in first candidate part
	const c = resp?.candidates?.[0];
	const parts = c?.content?.parts || [];
	const textPart = parts.find(p => typeof p.text === 'string');
	if (!textPart) throw new Error('No text JSON found in response.');
	// Some responses may wrap JSON in backticks by mistake; strip if needed
	const raw = textPart.text.trim().replace(/^```json\s*|\s*```$/g, '');
	return JSON.parse(raw);
}

function ensureCoordSystem(res, fallback = 'pixel') {
	// Return coordSystem to use for drawing
	const cs = res?.image?.coordSystem;
	return (cs === 'pixel' || cs === 'normalized_0_1000') ? cs : fallback;
}

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

runBtn.addEventListener('click', async () => {
	const apiKey = apiKeyEl.value.trim();
	const model  = modelEl.value.trim() || 'gemini-2.5-pro';
	if (!apiKey) return logJson({ error: 'Missing API key' }, 'Error');
	if (!currentFile) return logJson({ error: 'No image selected' }, 'Error');

	// Redraw base image before overlays
	if (currentImageBitmap) {
		const scaleX = canvas.width / naturalW;
		const scaleY = canvas.height / naturalH;
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.drawImage(currentImageBitmap, 0, 0, canvas.width, canvas.height);
	}

	logJson({ status: 'Calling Gemini…' });

	try {
		const resp = await callGeminiREST({ apiKey, model, file: currentFile });
		const parsed = extractJSONFromResponse(resp);

		// Fill in image.width/height if missing (helps downstream)
		if (!parsed.image) parsed.image = {};
		if (parsed.image.width == null)  parsed.image.width  = naturalW;
		if (parsed.image.height == null) parsed.image.height = naturalH;

		const coordSystem = ensureCoordSystem(parsed, 'pixel');

		// Draw detections
		const scaleX = canvas.width / naturalW;
		const scaleY = canvas.height / naturalH;

		const dets = Array.isArray(parsed.detections) ? parsed.detections : [];
		for (const d of dets) {
			const color = colorForCategory(d.category);
			const label = `${d.label ?? 'item'}${typeof d.confidence === 'number' ? ` (${(d.confidence*100).toFixed(0)}%)` : ''}`;

			if (d.bbox) {
				const b = toCanvasBox(d.bbox, coordSystem, scaleX, scaleY, naturalW, naturalH);
				if (b) drawBox(b, label, color);
			}
			if (Array.isArray(d.polygon) && d.polygon.length >= 3) {
				const pts = toCanvasPolygon(d.polygon, coordSystem, scaleX, scaleY, naturalW, naturalH);
				if (pts) drawPolygon(pts, label, color);
			}
		}

		// Show full JSON (including any global_insights that don't map to boxes)
		logJson(parsed, 'Model JSON');

	} catch (err) {
		logJson({ error: String(err?.message || err) }, 'Error');
	}
});

// ---------- Initial message ----------
logJson({ message: 'Drop an image or choose a file, then click "Analyze".' });
