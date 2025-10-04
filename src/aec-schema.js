/* istanbul ignore file */

export const AEC_PROMPT = `
Detect the most relevant objects, equipment, safety issues, facility assets, and progress indicators in this construction/AEC image.
Return a JSON object with an "items" array (maximum 20 entries). Each item must include:
- "labels": array of strings ordered from most specific to most general (e.g., ["bag of cement from Company X", "cement", "building material"]). Always include at least one label.
- "category": one of "object", "facility_asset", "safety_issue", "progress" (use the best fit for the detection).
- "confidence": detection confidence between 0 and 1.
- "box_2d": bounding box as [ymin, xmin, ymax, xmax] normalized 0-1000 with a top-left origin.
- "mask": optional base64-encoded PNG segmentation mask aligned to the same region (omit when unavailable).
- Optional context objects when relevant:
  - "safety": { "isViolation": boolean?, "severity": "low"|"medium"|"high"?, "rule": string? }
  - "progress": { "phase": string?, "percentComplete": number?, "notes": string? }
  - "attributes": array of { "name": string, "valueStr"?: string, "valueNum"?: number, "valueBool"?: boolean, "unit"?: string }
  - "relationships": array of { "type": string, "targetId": string }

Do not return polygons or keypoints. Use the labels array for both specific names and broader searchable terms instead of separate name/description fields. Include an optional "global_insights" array for whole-image observations following the same labeling approach (labels array, category, confidence, description, optional metrics). Output ONLY JSON with no prose or code fences.
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
					mask: { type: "string", nullable: true },
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
				required: ["labels", "category", "confidence", "box_2d"]
			}
		},
		global_insights: {
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
	required: ["items"]
};
