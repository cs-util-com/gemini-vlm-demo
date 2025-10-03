/* istanbul ignore file */

export const AEC_PROMPT = `
Detect all visible objects, equipment, safety issues, and facility assets in this construction/AEC image.
Return a JSON object with an "items" array where each item includes:
- "label": descriptive text label
- "box_2d": bounding box as [ymin, xmin, ymax, xmax] normalized 0-1000
- "mask": optional base64-encoded PNG segmentation mask
- "points": optional array of key points as [y, x] pairs normalized 0-1000
- "category": one of "object", "safety_issue", "facility_asset", "progress"
- "confidence": 0-1 confidence score

Include boxes, masks, and points when available. Limit to 25 items. Output ONLY JSON, no prose, no code fences.
`.trim();

export const RESPONSE_SCHEMA = {
	type: "object",
	properties: {
		items: {
			type: "array",
			items: {
				type: "object",
				properties: {
					label: { type: "string" },
					box_2d: {
						type: "array",
						items: { type: "number" }
					},
					mask: { type: "string" },
					points: {
						type: "array",
						items: {
							type: "array",
							items: { type: "number" }
						}
					},
					category: { type: "string" },
					confidence: { type: "number" }
				},
				required: ["label", "box_2d"]
			}
		}
	},
	required: ["items"]
};
