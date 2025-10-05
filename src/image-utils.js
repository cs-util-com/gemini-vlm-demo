export const IMAGE_PREPROCESS_DEFAULTS = Object.freeze({
	targetShortSide: 640,
	minShortSide: 512,
	maxLongSide: 1280,
	tileSize: 768,
	outputFormat: 'image/webp',
	quality: 0.85,
	allowUpscale: false,
	preferSmallerBytes: true
});

/**
 * Compute resize dimensions for an image while keeping aspect ratio.
 * Downscales only when the shorter side exceeds the configured target.
 *
 * @param {number} width - Original image width in pixels
 * @param {number} height - Original image height in pixels
 * @param {object} [options]
 * @param {number} [options.targetShortSide=960] - Preferred max length for shorter side
 * @param {number} [options.minShortSide=720] - Minimum length to preserve on shorter side when downscaling
 * @returns {{
 *   scale: number,
 *   width: number,
 *   height: number,
 *   resized: boolean,
 *   strategy: string
 * }}
 */
export function computeResizeDimensions(width, height, options = {}) {
	validateDimension(width, 'width');
	validateDimension(height, 'height');

	const cfg = { ...IMAGE_PREPROCESS_DEFAULTS, ...options };
	const metrics = buildResizeMetrics(width, height, cfg);
	const decision = decideResizeStrategy(metrics, cfg);

	if (decision.type === 'noop') {
		return createResizeResult(width, height, 1, false, decision.strategy);
	}

	const scale = finalScaleFor(metrics, cfg, decision.candidates);
	if (scale >= 0.999) {
		return createResizeResult(width, height, 1, false, 'no-op-target-achieved');
	}

	const { targetWidth, targetHeight } = computeScaledDimensions(width, height, scale);
	const strategy = selectStrategy(metrics.withinShortTarget, metrics.withinLongTarget);
	return {
		scale,
		width: targetWidth,
		height: targetHeight,
		resized: true,
		strategy
	};
}

function validateDimension(value, label) {
	if (!Number.isFinite(value) || value <= 0) {
		throw new Error(`Invalid ${label}: must be a positive finite number`);
	}
}

function buildResizeMetrics(width, height, cfg) {
	const shortSide = Math.min(width, height);
	const longSide = Math.max(width, height);
	return {
		width,
		height,
		shortSide,
		longSide,
		withinShortTarget: shortSide <= cfg.targetShortSide,
		withinLongTarget: !cfg.maxLongSide || longSide <= cfg.maxLongSide
	};
}

function decideResizeStrategy(metrics, cfg) {
	if (cfg.allowUpscale === false && metrics.shortSide < cfg.minShortSide) {
		return { type: 'noop', strategy: 'no-op-small-input' };
	}

	if (metrics.withinShortTarget && metrics.withinLongTarget) {
		return { type: 'noop', strategy: 'no-op-already-within-target' };
	}

	return {
		type: 'resize',
		candidates: gatherScaleCandidates(metrics, cfg)
	};
}

function gatherScaleCandidates(metrics, cfg) {
	const values = [];
	if (!metrics.withinShortTarget) {
		values.push(cfg.targetShortSide / metrics.shortSide);
	}
	if (!metrics.withinLongTarget && cfg.maxLongSide) {
		values.push(cfg.maxLongSide / metrics.longSide);
	}
	return values.length > 0 ? values : [1];
}

function finalScaleFor(metrics, cfg, candidates) {
	const base = selectPositiveScale(candidates);
	const withMinShortSide = enforceMinShortSide(base, metrics.shortSide, cfg.minShortSide);
	const noUpscale = cfg.allowUpscale === false ? Math.min(withMinShortSide, 1) : withMinShortSide;
	return Math.min(noUpscale, 1);
}

function selectPositiveScale(candidates) {
	const positive = candidates.filter(v => Number.isFinite(v) && v > 0);
	return positive.length > 0 ? Math.min(...positive, 1) : 1;
}

function enforceMinShortSide(scale, shortSide, minShortSide) {
	if (!minShortSide) return scale;
	const minScale = minShortSide / shortSide;
	if (!Number.isFinite(minScale) || minScale <= 0) {
		return scale;
	}
	return shortSide * scale < minShortSide ? Math.max(scale, minScale) : scale;
}

function computeScaledDimensions(width, height, scale) {
	return {
		targetWidth: Math.max(1, Math.round(width * scale)),
		targetHeight: Math.max(1, Math.round(height * scale))
	};
}

function selectStrategy(withinShortTarget, withinLongTarget) {
	if (!withinLongTarget && withinShortTarget) {
		return 'downscale-long-side';
	}
	if (!withinLongTarget && !withinShortTarget) {
		return 'downscale-dual-axis';
	}
	return 'downscale-short-side';
}

function createResizeResult(width, height, scale, resized, strategy) {
	return {
		scale,
		width: Math.round(width),
		height: Math.round(height),
		resized,
		strategy
	};
}

/**
 * Estimate the number of 768x768-equivalent tiles Gemini will tokenize.
 *
 * @param {number} width - Image width in pixels
 * @param {number} height - Image height in pixels
 * @param {number} [tileSize=768] - Tiling edge length in pixels
 * @returns {{ tilesAcross: number, tilesDown: number, totalTiles: number, estimatedTokens: number }}
 */
export function estimateTileFootprint(width, height, tileSize = IMAGE_PREPROCESS_DEFAULTS.tileSize) {
	if (!Number.isFinite(width) || width <= 0) {
		throw new Error('Invalid width: must be a positive finite number');
	}
	if (!Number.isFinite(height) || height <= 0) {
		throw new Error('Invalid height: must be a positive finite number');
	}
	if (!Number.isFinite(tileSize) || tileSize <= 0) {
		throw new Error('Invalid tileSize: must be a positive finite number');
	}

	const tilesAcross = Math.max(1, Math.ceil(width / tileSize));
	const tilesDown = Math.max(1, Math.ceil(height / tileSize));
	const totalTiles = tilesAcross * tilesDown;
	const estimatedTokens = totalTiles * 258;

	return { tilesAcross, tilesDown, totalTiles, estimatedTokens };
}

async function canvasToBlob(canvas, mimeType, quality) {
	if (typeof canvas.convertToBlob === 'function') {
		return canvas.convertToBlob({ type: mimeType, quality });
	}

	return new Promise((resolve, reject) => {
		canvas.toBlob(blob => {
			if (blob) {
				resolve(blob);
			} else {
				reject(new Error('Canvas toBlob failed to produce a blob'));
			}
		}, mimeType, quality);
	});
}

async function loadImageSource(blob) {
	try {
		const bitmap = await createImageBitmap(blob);
		return {
			width: bitmap.width,
			height: bitmap.height,
			draw: (ctx, w, h) => ctx.drawImage(bitmap, 0, 0, w, h),
			cleanup: () => {
				if (typeof bitmap.close === 'function') {
					bitmap.close();
				}
			}
		};
	} catch {
		const { image, revoke } = await loadHtmlImage(blob);
		return {
			width: image.naturalWidth,
			height: image.naturalHeight,
			draw: (ctx, w, h) => ctx.drawImage(image, 0, 0, w, h),
			cleanup: revoke
		};
	}
}

function loadHtmlImage(blob) {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(blob);
		const image = new Image();
		image.onload = () => {
			resolve({
				image,
				revoke: () => {
					URL.revokeObjectURL(url);
					image.onload = null;
					image.onerror = null;
				}
			});
		};
		image.onerror = (e) => {
			URL.revokeObjectURL(url);
			reject(e);
		};
		image.src = url;
	});
}

/**
 * Downscale and compress an image prior to sending it to Gemini.
 * Applies a short-side heuristic to keep requests within a few tiles.
 *
 * @param {File|Blob} file - Source image file selected by the user
 * @param {object} [options] - Override default behavior (primarily for tests)
 * @returns {Promise<object>} Metadata describing the preprocessing and the blob to upload
 */
export async function downscaleImageForGemini(file, options = {}) {
	if (!(file instanceof Blob)) {
		throw new Error('Invalid file: expected a File or Blob');
	}

	const cfg = { ...IMAGE_PREPROCESS_DEFAULTS, ...options };
	const sourceBytes = getBlobSize(file);
	const { source, resize } = await loadSourceAndPlanResize(file, cfg);
	const { converted, error } = await attemptResizeConversion(source, resize, cfg);
	const payload = choosePayloadBlob(file, converted, resize, cfg, sourceBytes, error);
	const summary = buildPreprocessSummary({
		source,
		resize,
		cfg,
		payload,
		sourceBytes,
		conversionError: error
	});

	source.cleanup();
	return summary;
}

function getBlobSize(blob) {
	return typeof blob.size === 'number' ? blob.size : null;
}

async function loadSourceAndPlanResize(file, cfg) {
	const source = await loadImageSource(file);
	const resize = computeResizeDimensions(source.width, source.height, cfg);
	return { source, resize };
}

async function attemptResizeConversion(source, resize, cfg) {
	if (!resize.resized) {
		return { converted: null, error: null };
	}
	try {
		const canvas = document.createElement('canvas');
		canvas.width = resize.width;
		canvas.height = resize.height;

		const ctx = canvas.getContext('2d', { alpha: false });
		source.draw(ctx, resize.width, resize.height);

		const blob = await canvasToBlob(canvas, cfg.outputFormat, cfg.quality);
		return { converted: blob, error: null };
	} catch (error) {
		return { converted: null, error };
	}
}

function choosePayloadBlob(originalFile, convertedBlob, resize, cfg, sourceBytes, conversionError) {
	const baseMime = originalFile.type || cfg.outputFormat;
	if (!resize.resized || !convertedBlob) {
		return {
			blob: originalFile,
			mimeType: baseMime,
			resized: false,
			discardReason: conversionError ? 'conversion-error' : null
		};
	}

	if (cfg.preferSmallerBytes && sourceBytes != null && convertedBlob.size >= sourceBytes) {
		return {
			blob: originalFile,
			mimeType: baseMime,
			resized: false,
			discardReason: 'larger-than-source'
		};
	}

	return {
		blob: convertedBlob,
		mimeType: convertedBlob.type || cfg.outputFormat || originalFile.type,
		resized: true,
		discardReason: null
	};
}

function buildPreprocessSummary({ source, resize, cfg, payload, sourceBytes, conversionError }) {
	const targetWidth = payload.resized ? resize.width : source.width;
	const targetHeight = payload.resized ? resize.height : source.height;
	const targetBytes = getBlobSize(payload.blob);
	const footprint = estimateTileFootprint(targetWidth, targetHeight, cfg.tileSize);
	const compressionRatio = sourceBytes && targetBytes ? targetBytes / sourceBytes : null;
	const warnings = collectPreprocessWarnings({
		footprint,
		targetBytes,
		conversionError,
		resize,
		payload
	});

	return {
		blob: payload.blob,
		mimeType: payload.mimeType,
		resized: payload.resized,
		sourceWidth: source.width,
		sourceHeight: source.height,
		targetWidth,
		targetHeight,
		sourceBytes,
		targetBytes,
		scale: payload.resized ? resize.scale : 1,
		strategy: resize.strategy,
		footprint,
		tileSize: cfg.tileSize,
		estimatedTokens: footprint.estimatedTokens,
		compressionRatio,
		warnings
	};
}

function collectPreprocessWarnings({ footprint, targetBytes, conversionError, resize, payload }) {
	const warnings = [];
	if (footprint.totalTiles > 4) {
		warnings.push('Image spans more than four 768px tiles; consider cropping regions of interest for higher fidelity.');
	}
	if (targetBytes != null && targetBytes > 18 * 1024 * 1024) {
		warnings.push('Inline payload is approaching the 20 MB limit. Consider additional compression or the Files API.');
	}
	if (!payload.resized && resize.resized && conversionError) {
		warnings.push(`Failed to downscale image: ${conversionError.message}`);
	}
	if (!payload.resized && payload.discardReason === 'larger-than-source') {
		warnings.push('Downscaled image exceeded original file size; kept original bytes instead.');
	}
	return warnings;
}
