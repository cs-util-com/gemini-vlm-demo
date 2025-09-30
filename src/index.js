/* istanbul ignore file */

// ---------- AEC Prompt (kept concise; schema carries most constraints) ----------
const AEC_PROMPT = `
You are an AEC computer-vision assistant.
Return findings strictly matching the provided response schema across FOUR categories:
1) General objects (e.g., ladder, scaffold, duct, rebar, crane hook).
2) Facility assets (e.g., exit sign, fire extinguisher, panel/valve).
3) Safety issues (e.g., missing PPE, unguarded edge, ladder angle > 75°, blocked exit).
4) Progress/scene insights (e.g., "drywall phase ~70%", "MEP rough-in present", "finishes started").

Geometry:
- Use bbox (pixel coords, top-left origin) when localizable.
- Use polygon only when a box would be misleading.
- For whole-image findings (e.g., overall progress), use no geometry under detections (prefer global_insights).

Safety:
- For safety items, set category: "safety_issue" and fill safety.{isViolation, severity, rule}.

Progress:
- For per-region progress, set category: "progress" and fill progress.{phase, percentComplete, notes}.
- For overall progress, prefer global_insights (no geometry).

Attributes:
- Add useful metadata as {name, valueNum|valueStr|valueBool, unit?}, e.g., {name:"ladder_angle_deg", valueNum:68, unit:"deg"}.

Aggregates:
- Ensure aggregates.countsByLabel & countsByCategory match detections.

Coordinates:
- Set image.coordSystem explicitly to "pixel" if your numbers are pixels,
	or "normalized_0_1000" if you follow Google’s 0..1000 normalization.
Be conservative; reflect uncertainty in confidence. Output ONLY JSON (no prose).
`.trim();

// ---------- Unified AEC Schema (REST response_schema object) ----------
const RESPONSE_SCHEMA = {
	type: "object",
	properties: {
		image: {
			type: "object",
			properties: {
				width: { type: "number", nullable: true },
				height: { type: "number", nullable: true },
				fileName: { type: "string", nullable: true },
				coordSystem: { type: "string", enum: ["pixel", "normalized_0_1000"], nullable: true }
			},
			nullable: true
		},
		detections: {
			type: "array",
			items: {
				type: "object",
				properties: {
					id: { type: "string" },
					label: { type: "string" },
					category: { type: "string", enum: ["object","facility_asset","safety_issue","progress","other"] },
					confidence: { type: "number" },
					bbox: {
						type: "object",
						properties: { x:{type:"number"}, y:{type:"number"}, width:{type:"number"}, height:{type:"number"} },
						required: ["x","y","width","height"],
						nullable: true
					},
					polygon: {
						type: "array",
						items: { type:"object", properties:{ x:{type:"number"}, y:{type:"number"} }, required:["x","y"] },
						nullable: true
					},
					safety: {
						type: "object",
						properties: {
							isViolation: { type: "boolean", nullable: true },
							severity: { type: "string", enum: ["low","medium","high"], nullable: true },
							rule: { type: "string", nullable: true }
						},
						nullable: true
					},
					progress: {
						type: "object",
						properties: {
							phase: { type: "string", nullable: true },
							percentComplete: { type: "number", nullable: true },
							notes: { type: "string", nullable: true }
						},
						nullable: true
					},
					attributes: {
						type: "array",
						items: {
							type: "object",
							properties: {
								name: { type: "string" },
								valueStr: { type: "string", nullable: true },
								valueNum: { type: "number", nullable: true },
								valueBool: { type: "boolean", nullable: true },
								unit: { type: "string", nullable: true }
							},
							required: ["name"]
						},
						nullable: true
					},
					useCaseTags: { type: "array", items: { type:"string" }, nullable: true },
					relationships: {
						type: "array",
						items: { type:"object", properties:{ type:{type:"string"}, targetId:{type:"string"} }, required:["type","targetId"] },
						nullable: true
					}
				},
				required: ["id","label","category","confidence"]
			}
		},
		global_insights: {
			type: "array",
			items: {
				type: "object",
				properties: {
					name: { type: "string" },
					category: { type:"string", enum:["progress","safety_issue","facility_asset","object","other"] },
					description: { type: "string" },
					confidence: { type: "number" },
					metrics: {
						type: "array",
						items: { type:"object", properties:{ key:{type:"string"}, value:{type:"number"}, unit:{type:"string",nullable:true} }, required:["key","value"] },
						nullable: true
					},
					relatedDetectionIds: { type:"array", items:{type:"string"}, nullable: true },
					region: {
						type: "object",
						properties: {
							bbox: {
								type: "object",
								properties: { x:{type:"number"}, y:{type:"number"}, width:{type:"number"}, height:{type:"number"} },
								required: ["x","y","width","height"],
								nullable: true
							}
						},
						nullable: true
					}
				},
				required: ["name","category","description","confidence"]
			}
		},
		aggregates: {
			type: "object",
			properties: {
				countsByLabel: {
					type: "array",
					items: {
						type: "object",
						properties: {
							label: { type: "string" },
							count: { type: "number" }
						},
						required: ["label", "count"]
					}
				},
				countsByCategory: {
					type: "array",
					items: {
						type: "object",
						properties: {
							category: { type: "string" },
							count: { type: "number" }
						},
						required: ["category", "count"]
					}
				}
			}
		}
	},
	required: ["detections","global_insights","aggregates"]
};

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
