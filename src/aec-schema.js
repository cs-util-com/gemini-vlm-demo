/* istanbul ignore file */

export const AEC_PROMPT = `
Detect the most relevant objects, equipment, safety issues, facility assets, and progress indicators in this construction/AEC image.
Return a JSON object with an "items" array (maximum 20 entries). Each item must include:
- "labels": array of strings ordered from most specific to most general (e.g., ["bag of cement from Company X", "cement", "building material"]). Always include at least one label.
- "category": one of "object", "facility_asset", "safety_issue", "progress" (use the best fit for the detection).
- "confidence": detection confidence between 0 and 1.
- "box_2d": bounding box as [ymin, xmin, ymax, xmax] normalized 0-1000 with a top-left origin.
- "masks": array of base64-encoded PNG segmentation masks aligned to the same region (minItems: 1). Every detection must include at least one segmentation mask; choose the highest-quality mask when multiple are available.
- Optional context objects when relevant:
	- "safety": { "isViolation": boolean?, "severity": "low"|"medium"|"high"?, "rule": string? }
	- "progress": { "phase": string, "percentComplete": number, "notes": string? } — for any detection labeled with category "progress", always provide a best-effort {phase, percentComplete} estimate (0-100) even if approximate.
	- "attributes": array of { "name": string, "valueStr"?: string, "valueNum"?: number, "valueBool"?: boolean, "unit"?: string }
	- "relationships": array of { "type": string, "targetId": string }

Always provide at least one entry describing whole-image progress. Include a mandatory "global_insights" array for whole-image observations; ensure it contains at least one element with:
- "category": "progress"
- "labels": ordered specific→general naming for the area or stage
- "description": narrative summary of the current construction phase/state
- "metrics": include at least one object with { "key": "percent_complete", "value": <0-100>, "unit": "%" }
If progress cannot be observed directly, still return the closest estimate available and explain the uncertainty in the description while providing a conservative percent value.

Do not return polygons or keypoints. Use the labels array for both specific names and broader searchable terms instead of separate name/description fields. Output ONLY JSON with no prose or code fences.
`.trim();

export const RESPONSE_SCHEMA = {
	type: "object",
	properties: {
		items: {
			type: "array",
			items: {
				type: "object",
				properties: {
					labels: {
						type: "array",
						items: { type: "string" },
						minItems: 1
					},
					category: { type: "string" },
					confidence: { type: "number" },
					box_2d: {
						type: "array",
						items: { type: "number" },
						minItems: 4,
						maxItems: 4
					},
					masks: {
						type: "array",
						items: { type: "string" },
						minItems: 1
					},
					safety: {
						type: "object",
						properties: {
							isViolation: { type: "boolean", nullable: true },
							severity: { type: "string", nullable: true },
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
					relationships: {
						type: "array",
						items: {
							type: "object",
							properties: {
								type: { type: "string" },
								targetId: { type: "string" }
							},
							required: ["type", "targetId"]
						},
						nullable: true
					}
				},
				required: ["labels", "category", "confidence", "box_2d", "masks"]
			}
		},
		global_insights: {
			type: "array",
			minItems: 1,
			items: {
				type: "object",
				properties: {
					labels: {
						type: "array",
						items: { type: "string" },
						minItems: 1
					},
					category: { type: "string" },
					description: { type: "string" },
					confidence: { type: "number" },
					metrics: {
						type: "array",
						items: {
							type: "object",
							properties: {
								key: { type: "string" },
								value: { type: "number" },
								unit: { type: "string", nullable: true }
							},
							required: ["key", "value"]
						},
						nullable: true
					}
				},
				required: ["labels", "category", "description", "confidence"]
			}
		}
	},
		required: ["items", "global_insights"]
};
