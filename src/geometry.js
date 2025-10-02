import { clamp } from './math.js';

/**
 * Convert Gemini's [ymin, xmin, ymax, xmax] format to {x, y, width, height}
 * Gemini uses: top-left origin, y-first order, normalized 0-1000
 */
function parseGeminiBbox(bbox) {
	if (!Array.isArray(bbox) || bbox.length !== 4) return null;
	const [ymin, xmin, ymax, xmax] = bbox;
	if (![ymin, xmin, ymax, xmax].every(Number.isFinite)) return null;
	
	return {
		x: xmin,
		y: ymin,
		width: Math.max(0, xmax - xmin),
		height: Math.max(0, ymax - ymin)
	};
}

export function toCanvasBox(
	b,
	coordSystem,
	displayScaleX,
	displayScaleY,
	imgW,
	imgH,
	origin = 'top-left',
	canvasWidth,
	canvasHeight
) {
	// If b is an array, it's Gemini's [ymin, xmin, ymax, xmax] format
	const box = Array.isArray(b) ? parseGeminiBbox(b) : b;
	
	const normalized = normalizeBox(box, coordSystem, imgW, imgH);
	if (!normalized) return null;

	const oriented = orientBox(normalized, origin, imgH);
	const scaled = scaleBox(oriented, displayScaleX, displayScaleY);
	return clampBox(scaled, canvasWidth, canvasHeight);
}

export function toCanvasPolygon(
	poly,
	coordSystem,
	displayScaleX,
	displayScaleY,
	imgW,
	imgH,
	origin = 'top-left'
) {
	if (!Array.isArray(poly)) return null;

	const scaledPoints = poly
		.map(point => normalizePoint(point, coordSystem, imgW, imgH))
		.map(point => orientPoint(point, origin, imgH))
		.map(point => scalePoint(point, displayScaleX, displayScaleY))
		.filter(Boolean);

	return scaledPoints.length >= 3 ? scaledPoints : null;
}

export function ensureCoordSystem(res, fallback = 'normalized_0_1000') {
	const cs = res?.image?.coordSystem;
	return (cs === 'pixel' || cs === 'normalized_0_1000') ? cs : fallback;
}

export function ensureCoordOrigin(res, fallback = 'top-left') {
	const match = collectOrigins(res).find(isValidOrigin);
	return match ?? fallback;
}

function normalizeBox(box, coordSystem, imgW, imgH) {
	if (!box) return null;
	const { x, y, width, height } = box;
	if (![x, y, width, height].every(Number.isFinite)) return null;

	if (coordSystem !== 'normalized_0_1000' || !Number.isFinite(imgW) || !Number.isFinite(imgH)) {
		return { x, y, width, height };
	}

	return {
		x: (x / 1000) * imgW,
		y: (y / 1000) * imgH,
		width: (width / 1000) * imgW,
		height: (height / 1000) * imgH
	};
}

function orientBox(box, origin, imgH) {
	if (origin !== 'bottom-left' || !Number.isFinite(imgH)) {
		return box;
	}
	return {
		...box,
		y: imgH - (box.y + box.height)
	};
}

function scaleBox(box, scaleX, scaleY) {
	const sx = Number.isFinite(scaleX) ? scaleX : 1;
	const sy = Number.isFinite(scaleY) ? scaleY : 1;
	return {
		x: box.x * sx,
		y: box.y * sy,
		width: box.width * sx,
		height: box.height * sy
	};
}

function clampBox(box, canvasWidth, canvasHeight) {
	if (!Number.isFinite(canvasWidth) || !Number.isFinite(canvasHeight)) {
		return box;
	}
	const x = clamp(box.x, 0, canvasWidth);
	const y = clamp(box.y, 0, canvasHeight);
	const width = clamp(box.width, 0, canvasWidth - x);
	const height = clamp(box.height, 0, canvasHeight - y);
	return { x, y, width, height };
}

function normalizePoint(point, coordSystem, imgW, imgH) {
	if (!point) return null;
	let { x, y } = point;
	if (!(Number.isFinite(x) && Number.isFinite(y))) return null;

	if (coordSystem === 'normalized_0_1000' && Number.isFinite(imgW) && Number.isFinite(imgH)) {
		x = (x / 1000) * imgW;
		y = (y / 1000) * imgH;
	}

	return { x, y };
}

function orientPoint(point, origin, imgH) {
	if (!point) return null;
	if (origin !== 'bottom-left' || !Number.isFinite(imgH)) return point;
	return { x: point.x, y: imgH - point.y };
}

function scalePoint(point, scaleX, scaleY) {
	if (!point) return null;
	const sx = Number.isFinite(scaleX) ? scaleX : 1;
	const sy = Number.isFinite(scaleY) ? scaleY : 1;
	return { x: point.x * sx, y: point.y * sy };
}

function isValidOrigin(origin) {
	return origin === 'top-left' || origin === 'bottom-left';
}

function collectOrigins(res) {
	const origins = [];
	if (res?.image) {
		origins.push(res.image.coordOrigin, res.image.origin, res.image.coordinateOrigin);
	}
	if (Array.isArray(res?.detections)) {
		origins.push(...res.detections.map(det => det?.coordOrigin));
	}
	return origins;
}
