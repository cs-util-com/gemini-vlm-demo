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
	return JSON.parse(raw);
}

/**
 * Calculate display scale to fit image within viewport constraints.
 * @param {number} naturalWidth - Original image width
 * @param {number} viewportWidth - Available viewport width
 * @param {number} padding - Padding to subtract from viewport (default: 60)
 * @returns {number} Scale factor (1.0 = no scaling, <1.0 = scale down)
 */
export function calculateDisplayScale(naturalWidth, viewportWidth, padding = 60) {
	if (typeof naturalWidth !== 'number' || !Number.isFinite(naturalWidth) || naturalWidth <= 0) {
		throw new Error('Invalid naturalWidth: must be positive finite number');
	}
	if (typeof viewportWidth !== 'number' || !Number.isFinite(viewportWidth) || viewportWidth <= 0) {
		throw new Error('Invalid viewportWidth: must be positive finite number');
	}
	if (typeof padding !== 'number' || !Number.isFinite(padding) || padding < 0) {
		throw new Error('Invalid padding: must be non-negative finite number');
	}
	
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
        if (typeof naturalWidth !== 'number' || !Number.isFinite(naturalWidth) || naturalWidth <= 0) {
                throw new Error('Invalid naturalWidth: must be positive finite number');
        }
        if (typeof naturalHeight !== 'number' || !Number.isFinite(naturalHeight) || naturalHeight <= 0) {
                throw new Error('Invalid naturalHeight: must be positive finite number');
        }

        // Ensure image metadata exists for downstream geometry helpers
        if (!parsed.image) parsed.image = {};
        if (parsed.image.width == null)  parsed.image.width  = naturalWidth;
        if (parsed.image.height == null) parsed.image.height = naturalHeight;
        if (!parsed.image.coordSystem) parsed.image.coordSystem = 'normalized_0_1000';

        // Normalize top-level collections
        const items = Array.isArray(parsed.items)
                ? parsed.items
                : Array.isArray(parsed.detections)
                        ? parsed.detections.map(det => ({
                                id: det.id,
                                label: det.label,
                                box_2d: det.bbox,
                                mask: det.mask,
                                points: Array.isArray(det.points)
                                        ? det.points.map(pt => Array.isArray(pt) ? pt : [pt.y, pt.x])
                                        : undefined
                        }))
                        : [];
        parsed.items = items.map((item) => ({ ...item }));

        // Derive legacy detection objects so the existing UI continues to work
        const detections = parsed.items.map((item, index) => {
                const label = item.label ?? `item_${index + 1}`;
                const bbox = Array.isArray(item.box_2d) && item.box_2d.length === 4
                        ? item.box_2d.map(num => Number.isFinite(num) ? num : Number(num))
                        : null;
                const points = Array.isArray(item.points)
                        ? item.points
                                .filter(point => Array.isArray(point) && point.length === 2 && point.every(Number.isFinite))
                                .map(([y, x]) => ({ x, y }))
                        : [];

                return {
                        id: item.id ?? `det_${index + 1}`,
                        label,
                        category: item.category ?? 'object',
                        confidence: typeof item.confidence === 'number' ? item.confidence : null,
                        bbox,
                        box_2d: bbox,
                        mask: typeof item.mask === 'string' && item.mask.trim() ? item.mask.trim() : null,
                        points,
                        attributes: Array.isArray(item.attributes) ? item.attributes : undefined,
                        safety: item.safety,
                        progress: item.progress
                };
        });

        parsed.detections = detections;
        if (!Array.isArray(parsed.global_insights)) parsed.global_insights = [];

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
