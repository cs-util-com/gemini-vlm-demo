/* istanbul ignore file */

export const AEC_PROMPT = `
Detect objects and return a JSON object with items that each include a "label", "box_2d" in [y0, x0, y1, x1] normalized to 0-1000, an optional "mask" (base64-encoded PNG probability map), and an optional array of "points" with [y, x] pairs normalized to 0-1000.

Categorize findings across FOUR categories:
1) General objects (e.g., ladder, scaffold, duct, rebar, crane hook).
2) Facility assets (e.g., exit sign, fire extinguisher, panel/valve).
3) Safety issues (e.g., missing PPE, unguarded edge, ladder angle > 75°, blocked exit).
4) Progress/scene insights (e.g., "drywall phase ~70%", "MEP rough-in present", "finishes started").

For safety items, set category "safety_issue" and include severity (low/medium/high).
Limit to 25 items. Respond with JSON only—no prose, no code fences.
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
					category: { type: "string" },
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
					severity: { type: "string" }
				},
				required: ["label", "box_2d"]
			}
		}
	},
	required: ["items"]
};
