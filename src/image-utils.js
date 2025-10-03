export const IMAGE_PREPROCESS_DEFAULTS = Object.freeze({
	targetShortSide: 960,
	minShortSide: 720,
	maxLongSide: 1600,
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
	if (!Number.isFinite(width) || width <= 0) {
		throw new Error('Invalid width: must be a positive finite number');
	}
	if (!Number.isFinite(height) || height <= 0) {
		throw new Error('Invalid height: must be a positive finite number');
	}

	const cfg = { ...IMAGE_PREPROCESS_DEFAULTS, ...options };
	const shortSide = Math.min(width, height);
	const longSide = Math.max(width, height);
	const withinShortTarget = shortSide <= cfg.targetShortSide;
	const withinLongTarget = !cfg.maxLongSide || longSide <= cfg.maxLongSide;

	if (cfg.allowUpscale === false && shortSide < cfg.minShortSide) {
		return {
			scale: 1,
			width: Math.round(width),
			height: Math.round(height),
			resized: false,
			strategy: 'no-op-small-input'
		};
	}

	if (withinShortTarget && withinLongTarget) {
		return {
			scale: 1,
			width: Math.round(width),
			height: Math.round(height),
			resized: false,
			strategy: 'no-op-already-within-target'
		};
	}

	const candidates = [];
	if (!withinShortTarget) {
		candidates.push(cfg.targetShortSide / shortSide);
	}
	if (!withinLongTarget && cfg.maxLongSide) {
		candidates.push(cfg.maxLongSide / longSide);
	}
	if (candidates.length === 0) {
		candidates.push(1);
	}

	const positive = candidates.filter(v => Number.isFinite(v) && v > 0);
	let scale = positive.length > 0 ? Math.min(...positive, 1) : 1;

	// Ensure we don't shrink below the configured minimum short side when possible
	const minScale = cfg.minShortSide / shortSide;
	if (cfg.minShortSide && Number.isFinite(minScale) && minScale > 0 && shortSide * scale < cfg.minShortSide) {
		scale = Math.max(scale, minScale);
	}

	if (cfg.allowUpscale === false && scale > 1) {
		scale = 1;
	}

	scale = Math.min(scale, 1);

	if (scale >= 0.999) {
		return {
			scale: 1,
			width: Math.round(width),
			height: Math.round(height),
			resized: false,
			strategy: 'no-op-target-achieved'
		};
	}

	const targetWidth = Math.max(1, Math.round(width * scale));
	const targetHeight = Math.max(1, Math.round(height * scale));

	let strategy = 'downscale-short-side';
	if (!withinLongTarget && withinShortTarget) {
		strategy = 'downscale-long-side';
	} else if (!withinLongTarget && !withinShortTarget) {
		strategy = 'downscale-dual-axis';
	}

	return {
		scale,
		width: targetWidth,
		height: targetHeight,
		resized: true,
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
	} catch (err) {
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
	const sourceBytes = typeof file.size === 'number' ? file.size : null;

	const source = await loadImageSource(file);
	const resize = computeResizeDimensions(source.width, source.height, cfg);

	let blob = file;
	let effectiveMime = file.type || cfg.outputFormat;
	let resized = resize.resized;
	let converted = null;
	let conversionError = null;

	if (resize.resized) {
		try {
			const canvas = document.createElement('canvas');
			canvas.width = resize.width;
			canvas.height = resize.height;

			const ctx = canvas.getContext('2d', { alpha: false });
			source.draw(ctx, resize.width, resize.height);

			converted = await canvasToBlob(canvas, cfg.outputFormat, cfg.quality);
		} catch (err) {
			conversionError = err;
		}
	}

	source.cleanup();

	if (resize.resized && converted) {
		if (cfg.preferSmallerBytes && sourceBytes != null && converted.size >= sourceBytes) {
			blob = file;
			resized = false;
			effectiveMime = file.type || cfg.outputFormat;
		} else {
			blob = converted;
			effectiveMime = converted.type || cfg.outputFormat || file.type;
		}
	} else if (conversionError) {
		resized = false;
	}

	const targetWidth = resized ? resize.width : source.width;
	const targetHeight = resized ? resize.height : source.height;
	const targetBytes = typeof blob.size === 'number' ? blob.size : null;
	const footprint = estimateTileFootprint(targetWidth, targetHeight, cfg.tileSize);

	const ratio = sourceBytes && targetBytes ? targetBytes / sourceBytes : null;
	const warnings = [];
	if (footprint.totalTiles > 4) {
		warnings.push('Image spans more than four 768px tiles; consider cropping regions of interest for higher fidelity.');
	}
	if (targetBytes != null && targetBytes > 18 * 1024 * 1024) {
		warnings.push('Inline payload is approaching the 20 MB limit. Consider additional compression or the Files API.');
	}
	if (!resized && resize.resized && conversionError) {
		warnings.push(`Failed to downscale image: ${conversionError.message}`);
	}

	return {
		blob,
		mimeType: effectiveMime,
		resized,
		sourceWidth: source.width,
		sourceHeight: source.height,
		targetWidth,
		targetHeight,
		sourceBytes,
		targetBytes,
		scale: resized ? resize.scale : 1,
		strategy: resize.strategy,
		footprint,
		tileSize: cfg.tileSize,
		estimatedTokens: footprint.estimatedTokens,
		compressionRatio: ratio,
		warnings
	};
}
