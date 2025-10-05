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
    case 'safety_issue':
      return '#ff5b5b';
    case 'facility_asset':
      return '#5bd1ff';
    case 'progress':
      return '#a1ff5b';
    case 'object':
      return '#ffd05b';
    default:
      return '#cccccc';
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
  const textPart = parts.find((p) => typeof p.text === 'string');
  if (!textPart) throw new Error('No text JSON found in response.');
  // Some responses may wrap JSON in backticks by mistake; strip if needed
  const raw = textPart.text.trim().replace(/^```json\s*|\s*```$/g, '');

  try {
    return JSON.parse(raw);
  } catch (err) {
    const cleaned = cleanupPartialMaskJson(raw);
    if (cleaned !== raw) {
      return JSON.parse(cleaned);
    }
    throw err;
  }
}

function cleanupPartialMaskJson(raw) {
  if (typeof raw !== 'string' || raw.length === 0) return raw;
  let result = raw;
  let index = 0;
  let mutated = false;

  while (index < result.length) {
    const keyIndex = result.indexOf('"mask"', index);
    if (keyIndex === -1) break;
    const colonIndex = findColonAfter(result, keyIndex + 6);
    if (colonIndex === -1) {
      index = keyIndex + 6;
      continue;
    }
    const valueStart = skipWhitespace(result, colonIndex + 1);
    const range = findJsonValueRange(result, valueStart);
    if (shouldNullifyMaskValue(result, range)) {
      result = replaceSegment(result, range.start, range.end, 'null');
      mutated = true;
      index = range.start + 4;
    } else {
      index = Math.max(range.end, valueStart + 1);
    }
  }

  return mutated ? autoCloseJson(result) : raw;
}

function findColonAfter(source, startIndex) {
  const len = source.length;
  let idx = skipWhitespace(source, startIndex);
  while (idx < len) {
    if (source[idx] === ':') return idx;
    if (!/\s/.test(source[idx])) break;
    idx++;
  }
  return -1;
}

function skipWhitespace(source, fromIndex) {
  let idx = fromIndex;
  while (idx < source.length && /\s/.test(source[idx])) idx++;
  return idx;
}

function shouldNullifyMaskValue(source, range) {
  if (range.start >= source.length) return false;
  const snippet = source.slice(range.start, range.end);
  return snippet.includes('start_of_mask') || !range.terminated;
}

function replaceSegment(source, start, end, replacement) {
  return `${source.slice(0, start)}${replacement}${source.slice(end)}`;
}

function findJsonValueRange(source, startIndex) {
  const valueStart = skipWhitespace(source, startIndex);
  if (valueStart >= source.length) {
    return { start: valueStart, end: source.length, terminated: false };
  }
  const firstChar = source[valueStart];
  if (firstChar === '"') {
    return scanStringValue(source, valueStart);
  }
  if (firstChar === '{' || firstChar === '[') {
    return scanContainerValue(
      source,
      valueStart,
      firstChar === '{' ? '}' : ']'
    );
  }
  return scanPrimitiveValue(source, valueStart);
}

function scanStringValue(source, start) {
  let idx = start + 1;
  let escaped = false;
  while (idx < source.length) {
    const ch = source[idx];
    if (escaped) {
      escaped = false;
    } else if (ch === '\\') {
      escaped = true;
    } else if (ch === '"') {
      return { start, end: idx + 1, terminated: true };
    }
    idx++;
  }
  return { start, end: source.length, terminated: false };
}

function scanContainerValue(source, start, closingChar) {
  const state = {
    stack: [closingChar],
    idx: start + 1,
    inString: false,
    escaped: false,
  };
  while (state.idx < source.length && state.stack.length > 0) {
    updateContainerState(state, source[state.idx]);
    state.idx++;
  }
  return { start, end: state.idx, terminated: state.stack.length === 0 };
}

function updateContainerState(state, ch) {
  if (state.inString) {
    handleStringState(state, ch);
    return;
  }
  if (ch === '"') {
    state.inString = true;
    return;
  }
  if (ch === '{') {
    state.stack.push('}');
    return;
  }
  if (ch === '[') {
    state.stack.push(']');
    return;
  }
  if (
    (ch === '}' || ch === ']') &&
    state.stack[state.stack.length - 1] === ch
  ) {
    state.stack.pop();
  }
}

function handleStringState(state, ch) {
  if (state.escaped) {
    state.escaped = false;
    return;
  }
  if (ch === '\\') {
    state.escaped = true;
    return;
  }
  if (ch === '"') {
    state.inString = false;
  }
}

function scanPrimitiveValue(source, start) {
  let idx = start;
  while (idx < source.length && !/[\s,}\]]/.test(source[idx])) idx++;
  return { start, end: idx, terminated: idx < source.length };
}

function autoCloseJson(source) {
  const pendingClosers = collectPendingClosers(source);
  return pendingClosers.length > 0 ? source + pendingClosers.join('') : source;
}

function collectPendingClosers(source) {
  const state = { stack: [], inString: false, escaped: false };
  for (let i = 0; i < source.length; i++) {
    updateContainerState(state, source[i]);
  }
  return state.stack.reverse();
}

function assertFiniteNumber(value, name, { allowZero = false } = {}) {
  const isNumber = typeof value === 'number' && Number.isFinite(value);
  if (!isNumber) {
    throw new Error(
      `Invalid ${name}: must be ${allowZero ? 'non-negative' : 'positive'} finite number`
    );
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
export function calculateDisplayScale(
  naturalWidth,
  viewportWidth,
  padding = 60
) {
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
    throw new Error(
      'Invalid dataUrl format: expected "data:mime;base64,content"'
    );
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
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, (char) => map[char]);
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
  const directKeys = [
    'data',
    'base64',
    'bytes',
    'png',
    'png_base64',
    'pngBase64',
  ];
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
  return (
    normalizeInlineDataAsset(asset, fallbackMime) ||
    normalizeDirectDataAsset(asset, fallbackMime) ||
    normalizeUrlAsset(asset)
  );
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
    const detections = parsed.items.map((item, idx) =>
      createDetectionFromItem(item, idx, maskAssets)
    );
    const globalInsights = Array.isArray(parsed.global_insights)
      ? parsed.global_insights.map((insight, idx) =>
          createInsightFromEntry(insight, idx)
        )
      : [];

    const transformed = {
      image: parsed.image || { coordSystem: 'normalized_0_1000' },
      detections,
      global_insights: globalInsights,
    };
    if (maskAssets) {
      transformed.maskAssets = maskAssets;
    }

    return transformed;
  }

  // Otherwise return as-is (already in legacy format)
  return parsed;
}

function createDetectionFromItem(item, index, maskAssets) {
  const labelInfo = extractDetectionLabels(item);
  const detection = buildDetectionSkeleton(item, labelInfo, index);
  applyOptionalDetectionFields(detection, item, maskAssets);
  return detection;
}

function extractDetectionLabels(item) {
  const labels = Array.isArray(item.labels)
    ? item.labels
        .map((label) => (typeof label === 'string' ? label.trim() : ''))
        .filter(Boolean)
    : [];
  return {
    all: labels,
    primary:
      labels[0] || (typeof item.label === 'string' ? item.label : 'unknown'),
  };
}

function buildDetectionSkeleton(item, labelInfo, index) {
  return {
    id: item.id || `det_${index}`,
    label: labelInfo.primary,
    labels: labelInfo.all.length > 0 ? labelInfo.all : undefined,
    labelAliases: labelInfo.all.length > 1 ? labelInfo.all.slice(1) : undefined,
    category: item.category || 'object',
    confidence: typeof item.confidence === 'number' ? item.confidence : 0.8,
    bbox:
      Array.isArray(item.box_2d) && item.box_2d.length === 4
        ? item.box_2d
        : null,
  };
}

function applyOptionalDetectionFields(target, item, maskAssets) {
  const resolvedMask = resolveMaskValue(item.mask, maskAssets);
  if (resolvedMask) {
    target.mask = resolvedMask;
  }
  copyIfObject(target, 'safety', item.safety);
  copyIfObject(target, 'progress', item.progress);
  copyIfNonEmptyArray(target, 'attributes', item.attributes);
  copyIfNonEmptyArray(target, 'relationships', item.relationships);
}

function copyIfObject(target, key, value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    target[key] = value;
  }
}

function copyIfNonEmptyArray(target, key, value) {
  if (Array.isArray(value) && value.length > 0) {
    target[key] = value;
  }
}

function createInsightFromEntry(insight, index) {
  const labelInfo = extractInsightLabels(insight);
  const base = buildInsightSkeleton(insight, labelInfo, index);
  return assignInsightMetrics(base, insight.metrics);
}

function extractInsightLabels(insight) {
  const labels = Array.isArray(insight.labels)
    ? insight.labels
        .map((label) => (typeof label === 'string' ? label.trim() : ''))
        .filter(Boolean)
    : [];
  return {
    list: labels,
    primary:
      labels[0] ||
      (typeof insight.name === 'string' ? insight.name.trim() : ''),
  };
}

function buildInsightSkeleton(insight, labelInfo, index) {
  return {
    id: insight.id || `ins_${index}`,
    name: labelInfo.primary || `Insight ${index + 1}`,
    labels: labelInfo.list.length > 0 ? labelInfo.list : undefined,
    labelAliases:
      labelInfo.list.length > 1 ? labelInfo.list.slice(1) : undefined,
    description:
      typeof insight.description === 'string' ? insight.description : '',
    category: insight.category || 'other',
    confidence:
      typeof insight.confidence === 'number' ? insight.confidence : 0.8,
  };
}

function assignInsightMetrics(target, metrics) {
  target.metrics = Array.isArray(metrics) ? metrics : [];
  return target;
}
