/**
 * Pure utility functions extracted from UI code for testability.
 */

/**
 * Map detection category to color for visualization.
 * @param {string} cat - Category name
 * @returns {string} Hex color code
 */
export function colorForCategory(cat) {
	switch (cat) {
		case 'safety_issue': return '#ff5b5b';
		case 'facility_asset': return '#5bd1ff';
		case 'progress': return '#a1ff5b';
		case 'object': return '#ffd05b';
		default: return '#cccccc';
	}
}

/**
 * Extract and parse JSON from Gemini API response.
 * Handles both clean JSON and JSON wrapped in markdown code blocks.
 * @param {object} resp - Gemini API response object
 * @returns {object} Parsed JSON data
 * @throws {Error} If no text JSON found or JSON is invalid
 */
export function extractJSONFromResponse(resp) {
	// Expect JSON as text in first candidate part
	const c = resp?.candidates?.[0];
	const parts = c?.content?.parts || [];
	const textPart = parts.find(p => typeof p.text === 'string');
	if (!textPart) throw new Error('No text JSON found in response.');
	// Some responses may wrap JSON in backticks by mistake; strip if needed
	const raw = textPart.text.trim().replace(/^```json\s*|\s*```$/g, '');

	try {
		return JSON.parse(raw);
	} catch (err) {
		const cleaned = cleanupPartialMaskJson(raw);
		if (cleaned !== raw) {
			try {
				return JSON.parse(cleaned);
			} catch (secondErr) {
				throw secondErr;
			}
		}
		throw err;
	}
}

function cleanupPartialMaskJson(raw) {
	if (typeof raw !== 'string' || raw.length === 0) return raw;
	const maskKeyToken = '"mask"';
	let result = raw;
	let searchIndex = 0;
	let changed = false;

	while (searchIndex < result.length) {
		const keyIndex = result.indexOf(maskKeyToken, searchIndex);
		if (keyIndex === -1) break;

		let cursor = keyIndex + maskKeyToken.length;
		while (cursor < result.length && /\s/.test(result[cursor])) cursor++;
		if (cursor >= result.length || result[cursor] !== ':') {
			searchIndex = cursor;
			continue;
		}
		cursor++;
		while (cursor < result.length && /\s/.test(result[cursor])) cursor++;

		const { start, end, terminated } = findJsonValueRange(result, cursor);
		if (start >= result.length) break;

		const valueSnippet = result.slice(start, end);
		const containsMaskSentinel = valueSnippet.includes('start_of_mask');
		const valueLooksBroken = !terminated;
		if (containsMaskSentinel || valueLooksBroken) {
			result = `${result.slice(0, start)}null${result.slice(end)}`;
			changed = true;
			searchIndex = start + 4; // length of 'null'
			continue;
		}

		searchIndex = end;
	}

	if (!changed) return raw;

	return autoCloseJson(result);
}

function findJsonValueRange(source, startIndex) {
	const len = source.length;
	let idx = startIndex;
	while (idx < len && /\s/.test(source[idx])) idx++;
	const valueStart = idx;
	if (idx >= len) {
		return { start: valueStart, end: len, terminated: false };
	}

	const firstChar = source[idx];
	if (firstChar === '"') {
		idx++;
		let escaped = false;
		while (idx < len) {
			const ch = source[idx];
			if (escaped) {
				escaped = false;
			} else if (ch === '\\') {
				escaped = true;
			} else if (ch === '"') {
				idx++;
				return { start: valueStart, end: idx, terminated: true };
			}
			idx++;
		}
		return { start: valueStart, end: len, terminated: false };
	}

	if (firstChar === '{' || firstChar === '[') {
		const stack = [firstChar === '{' ? '}' : ']'];
		idx++;
		let inString = false;
		let escaped = false;
		while (idx < len && stack.length > 0) {
			const ch = source[idx];
			if (inString) {
				if (escaped) {
					escaped = false;
				} else if (ch === '\\') {
					escaped = true;
				} else if (ch === '"') {
					inString = false;
				}
			} else {
				if (ch === '"') {
					inString = true;
				} else if (ch === '{') {
					stack.push('}');
				} else if (ch === '[') {
					stack.push(']');
				} else if ((ch === '}' || ch === ']') && stack[stack.length - 1] === ch) {
					stack.pop();
				}
			}
			idx++;
		}
		return { start: valueStart, end: idx, terminated: stack.length === 0 };
	}

	while (idx < len && !/[\s,}\]]/.test(source[idx])) idx++;
	const terminated = idx < len;
	return { start: valueStart, end: idx, terminated };
}

function autoCloseJson(source) {
	const stack = [];
	let inString = false;
	let escaped = false;
	for (let i = 0; i < source.length; i++) {
		const ch = source[i];
		if (inString) {
			if (escaped) {
				escaped = false;
			} else if (ch === '\\') {
				escaped = true;
			} else if (ch === '"') {
				inString = false;
			}
			continue;
		}
		if (ch === '"') {
			inString = true;
			continue;
		}
		if (ch === '{') {
			stack.push('}');
			continue;
		}
		if (ch === '[') {
			stack.push(']');
			continue;
		}
		if ((ch === '}' || ch === ']') && stack.length > 0 && stack[stack.length - 1] === ch) {
			stack.pop();
		}
	}

	if (stack.length === 0) return source;
	let suffix = '';
	for (let i = stack.length - 1; i >= 0; i--) {
		suffix += stack[i];
	}
	return source + suffix;
}

function assertFiniteNumber(value, name, { allowZero = false } = {}) {
	const isNumber = typeof value === 'number' && Number.isFinite(value);
	if (!isNumber) {
		throw new Error(`Invalid ${name}: must be ${allowZero ? 'non-negative' : 'positive'} finite number`);
	}
	if (!allowZero && value <= 0) {
		throw new Error(`Invalid ${name}: must be positive finite number`);
	}
	if (allowZero && value < 0) {
		throw new Error(`Invalid ${name}: must be non-negative finite number`);
	}
}

/**
 * Calculate display scale to fit image within viewport constraints.
 * @param {number} naturalWidth - Original image width
 * @param {number} viewportWidth - Available viewport width
 * @param {number} padding - Padding to subtract from viewport (default: 60)
 * @returns {number} Scale factor (1.0 = no scaling, <1.0 = scale down)
 */
export function calculateDisplayScale(naturalWidth, viewportWidth, padding = 60) {
	assertFiniteNumber(naturalWidth, 'naturalWidth');
	assertFiniteNumber(viewportWidth, 'viewportWidth');
	assertFiniteNumber(padding, 'padding', { allowZero: true });

	const maxW = Math.min(viewportWidth - padding, naturalWidth);
	return maxW / naturalWidth;
}

/**
 * Format JSON output with optional note header.
 * @param {object} obj - Object to stringify
 * @param {string} [note] - Optional note to prepend
 * @returns {string} Formatted JSON string
 */
export function formatJsonOutput(obj, note) {
	const head = note ? `// ${note}\n` : '';
	return head + JSON.stringify(obj, null, 2);
}

/**
 * Parse base64 data URL to extract the base64 content.
 * @param {string} dataUrl - Data URL string (e.g., "data:image/jpeg;base64,ABC123...")
 * @returns {string} Base64 content without the data URL prefix
 * @throws {Error} If dataUrl format is invalid
 */
export function extractBase64FromDataUrl(dataUrl) {
	if (typeof dataUrl !== 'string') {
		throw new Error('Invalid dataUrl: must be a string');
	}
	const parts = dataUrl.split(',');
	if (parts.length < 2) {
		throw new Error('Invalid dataUrl format: expected "data:mime;base64,content"');
	}
	return parts[1];
}

/**
 * Validate and prepare detection data for rendering.
 * Ensures required image metadata is present.
 * @param {object} parsed - Parsed detection response
 * @param {number} naturalWidth - Original image width
 * @param {number} naturalHeight - Original image height
 * @returns {object} Enhanced detection data with guaranteed image dimensions
 */
export function prepareDetectionData(parsed, naturalWidth, naturalHeight) {
	if (!parsed || typeof parsed !== 'object') {
		throw new Error('Invalid parsed data: must be an object');
	}
	assertFiniteNumber(naturalWidth, 'naturalWidth');
	assertFiniteNumber(naturalHeight, 'naturalHeight');

	const image = parsed.image ?? (parsed.image = {});
	if (image.width == null) {
		image.width = naturalWidth;
	}
	if (image.height == null) {
		image.height = naturalHeight;
	}

	return parsed;
}

/**
 * Safely escape HTML special characters.
 * @param {string} text - Raw text content to escape
 * @returns {string} Escaped HTML string
 */
export function escapeHtml(text) {
	if (text == null) return '';
	const str = String(text);
	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;'
	};
	return str.replace(/[&<>"']/g, char => map[char]);
}

function isLikelyBase64String(value) {
	if (typeof value !== 'string') return false;
	const trimmed = value.trim();
	if (trimmed.length < 32) return false;
	if (!/^[A-Za-z0-9+/=\s]+$/.test(trimmed)) return false;
	return trimmed.replace(/\s+/g, '').length % 4 === 0;
}

function toDataUrl(base64, mime = 'image/png') {
	if (typeof base64 !== 'string' || base64.length === 0) return null;
	return base64.startsWith('data:') ? base64 : `data:${mime};base64,${base64}`;
}

function gatherMaskAssetMap(parsed) {
	if (!parsed || typeof parsed !== 'object') return null;
	const collected = {};
	const addEntries = (obj) => {
		if (!obj || typeof obj !== 'object') return;
		for (const [key, value] of Object.entries(obj)) {
			if (collected[key] === undefined) {
				collected[key] = value;
			}
		}
	};

	addEntries(parsed.maskAssets);
	addEntries(parsed.mask_assets);
	addEntries(parsed.maskResources);
	addEntries(parsed.mask_resources);
	addEntries(parsed.maskData);
	addEntries(parsed.mask_data);
	addEntries(parsed.masks);
	addEntries(parsed.segmentationMasks);
	addEntries(parsed.segmentation_masks);

	if (parsed.assets && typeof parsed.assets === 'object') {
		addEntries(parsed.assets.maskAssets);
		addEntries(parsed.assets.mask_assets);
		addEntries(parsed.assets.masks);
		addEntries(parsed.assets.segmentationMasks);
		addEntries(parsed.assets.segmentation_masks);
	}

	return Object.keys(collected).length > 0 ? collected : null;
}

function normalizeStringAsset(asset, fallbackMime) {
	if (typeof asset !== 'string' || asset.length === 0) return null;
	if (asset.startsWith('data:')) return asset;
	return isLikelyBase64String(asset) ? toDataUrl(asset, fallbackMime) : null;
}

function normalizeInlineDataAsset(asset, fallbackMime) {
	const inline = asset.inline_data || asset.inlineData;
	if (!inline || typeof inline !== 'object') return null;
	const data = inline.data || inline.base64 || inline.bytes;
	if (typeof data !== 'string' || data.length === 0) return null;
	const mime = inline.mime_type || inline.mimeType || fallbackMime;
	return toDataUrl(data, mime);
}

function normalizeDirectDataAsset(asset, fallbackMime) {
	const directKeys = ['data', 'base64', 'bytes', 'png', 'png_base64', 'pngBase64'];
	for (const key of directKeys) {
		const value = asset[key];
		if (typeof value !== 'string' || value.length === 0) continue;
		if (value.startsWith('data:')) return value;
		if (isLikelyBase64String(value)) {
			const mime = asset.mime_type || asset.mimeType || fallbackMime;
			return toDataUrl(value, mime);
		}
	}
	return null;
}

function normalizeUrlAsset(asset) {
	const url = asset.url || asset.uri || asset.href;
	return typeof url === 'string' && url.length > 0 ? url : null;
}

function normalizeMaskAssetValue(asset, fallbackMime = 'image/png') {
	if (!asset) return null;
	if (typeof asset === 'string') {
		return normalizeStringAsset(asset, fallbackMime);
	}
	if (typeof asset !== 'object') return null;
	return normalizeInlineDataAsset(asset, fallbackMime)
		|| normalizeDirectDataAsset(asset, fallbackMime)
		|| normalizeUrlAsset(asset);
}

function resolveMaskValue(maskValue, maskAssets) {
	if (!maskValue) return null;
	if (typeof maskValue === 'string') {
		const normalized = normalizeStringAsset(maskValue);
		if (normalized) {
			return normalized;
		}
		const asset = maskAssets?.[maskValue];
		return normalizeMaskAssetValue(asset);
	}
	if (typeof maskValue === 'object') {
		return normalizeMaskAssetValue(maskValue);
	}
	return null;
}

/**
 * Transform new simplified response format (items array) to legacy format (detections/global_insights).
 * This allows the UI code to work with the simplified schema while maintaining backwards compatibility.
 * @param {object} parsed - Response with 'items' array
 * @returns {object} Transformed response with 'detections' and 'global_insights'
 */
export function transformResponseFormat(parsed) {
	if (!parsed || typeof parsed !== 'object') {
		return parsed;
	}
	
	// If already in new format with 'items', transform it
	if (Array.isArray(parsed.items)) {
		const maskAssets = gatherMaskAssetMap(parsed);
		const detections = parsed.items.map((item, idx) => {
			const detection = {
				id: `det_${idx}`,
				label: item.label || 'unknown',
				category: item.category || 'object',
				confidence: typeof item.confidence === 'number' ? item.confidence : 0.8,
				bbox: Array.isArray(item.box_2d) && item.box_2d.length === 4 ? item.box_2d : null
			};
			
			// Add mask if present
			const resolvedMask = resolveMaskValue(item.mask, maskAssets);
			if (resolvedMask) {
				detection.mask = resolvedMask;
			}
			
			// Add points if present
			if (Array.isArray(item.points) && item.points.length > 0) {
				detection.points = item.points;
			}
			
			return detection;
		});
		const transformed = {
			image: parsed.image || { coordSystem: 'normalized_0_1000' },
			detections,
			global_insights: []
		};
		if (maskAssets) {
			transformed.maskAssets = maskAssets;
		}
		
		return transformed;
	}
	
	// Otherwise return as-is (already in legacy format)
	return parsed;
}
