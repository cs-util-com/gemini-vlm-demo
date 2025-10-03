/* istanbul ignore file */

export const AEC_PROMPT = `
Detect objects in this image and return a JSON object with an "items" array.
Each item should include:
- "label": descriptive text label
- "box_2d": bounding box as [ymin, xmin, ymax, xmax] normalized to 0-1000
- "mask": (optional) base64-encoded PNG probability map for segmentation
- "points": (optional) array of significant points as [y, x] pairs normalized to 0-1000

Limit to 25 items. Return JSON only—no prose, no code fences.
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
					mask: { type: "string", nullable: true },
					points: {
						type: "array",
						items: {
							type: "array",
							items: { type: "number" }
						},
						nullable: true
					}
				},
				required: ["label", "box_2d"]
			}
		}
	},
	required: ["items"]
};
