/* istanbul ignore file */

export const AEC_PROMPT = `
You are an AEC computer-vision assistant.
Return findings strictly matching the provided response schema across FOUR categories:
1) General objects (e.g., ladder, scaffold, duct, rebar, crane hook).
2) Facility assets (e.g., exit sign, fire extinguisher, panel/valve).
3) Safety issues (e.g., missing PPE, unguarded edge, ladder angle > 75°, blocked exit).
4) Progress/scene insights (e.g., "drywall phase ~70%", "MEP rough-in present", "finishes started").

Geometry:
- Use bbox as [ymin, xmin, ymax, xmax] array, normalized 0-1000, top-left origin, when localizable.
- Use polygon only when a box would be misleading (each point {x,y} normalized 0-1000).
- For whole-image findings (e.g., overall progress), use no geometry under detections (prefer global_insights).

Safety:
- For safety items, set category: "safety_issue" and fill safety.{isViolation, severity, rule}.

Progress:
- For per-region progress, set category: "progress" and fill progress.{phase, percentComplete, notes}.
- For overall progress, prefer global_insights (no geometry).

Attributes:
- Add useful metadata as {name, valueNum|valueStr|valueBool, unit?}, e.g., {name:"ladder_angle_deg", valueNum:68, unit:"deg"}.

Coordinates:
- Set image.coordSystem explicitly to "normalized_0_1000" (Google's 0..1000 normalization).
Be conservative; reflect uncertainty in confidence. Output ONLY JSON (no prose).
`.trim();

export const RESPONSE_SCHEMA = {
	type: "object",
	properties: {
		image: {
			type: "object",
			properties: {
				width: { type: "number", nullable: true },
				height: { type: "number", nullable: true },
				fileName: { type: "string", nullable: true },
				coordSystem: { type: "string", enum: ["normalized_0_1000"], nullable: true, description: "Always normalized_0_1000" }
			},
			nullable: true
		},
		detections: {
			type: "array",
			items: {
				type: "object",
				properties: {
					id: { type: "string" },
					label: { type: "string" },
					category: { type: "string", enum: ["object","facility_asset","safety_issue","progress","other"] },
					confidence: { type: "number" },
					bbox: {
						type: "array",
						items: { type: "number" },
						minItems: 4,
						maxItems: 4,
						description: "[ymin, xmin, ymax, xmax] normalized 0-1000",
						nullable: true
					},
					polygon: {
						type: "array",
						items: { type:"object", properties:{ x:{type:"number"}, y:{type:"number"} }, required:["x","y"] },
						description: "Array of {x,y} points, each normalized 0-1000",
						nullable: true
					},
					safety: {
						type: "object",
						properties: {
							isViolation: { type: "boolean", nullable: true },
							severity: { type: "string", enum: ["low","medium","high"], nullable: true },
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
					useCaseTags: { type: "array", items: { type:"string" }, nullable: true },
					relationships: {
						type: "array",
						items: { type:"object", properties:{ type:{type:"string"}, targetId:{type:"string"} }, required:["type","targetId"] },
						nullable: true
					}
				},
				required: ["id","label","category","confidence"]
			}
		},
		global_insights: {
			type: "array",
			items: {
				type: "object",
				properties: {
					name: { type: "string" },
					category: { type:"string", enum:["progress","safety_issue","facility_asset","object","other"] },
					description: { type: "string" },
					confidence: { type: "number" },
					metrics: {
						type: "array",
						items: { type:"object", properties:{ key:{type:"string"}, value:{type:"number"}, unit:{type:"string",nullable:true} }, required:["key","value"] },
						nullable: true
					},
					relatedDetectionIds: { type:"array", items:{type:"string"}, nullable: true },
					region: {
						type: "object",
						properties: {
							bbox: {
								type: "object",
								properties: { x:{type:"number"}, y:{type:"number"}, width:{type:"number"}, height:{type:"number"} },
								required: ["x","y","width","height"],
								nullable: true
							}
						},
						nullable: true
					}
				},
				required: ["name","category","description","confidence"]
			}
		}
	},
	required: ["detections","global_insights"]
};
