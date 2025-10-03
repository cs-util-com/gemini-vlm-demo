/* istanbul ignore file */

export const AEC_PROMPT = `
Detect objects in the image and return a JSON object with an "items" array.
Each item must include:
- "label": a short description of the object.
- "box_2d": [y0, x0, y1, x1] normalized to the 0–1000 coordinate system (top-left origin).
Optionally include:
- "mask": base64-encoded PNG probability map cropped to the object.
- "points": an array of [y, x] coordinates normalized to 0–1000 describing salient keypoints.
Respond with JSON only (no prose, no code fences) and limit the list to 25 items. Omit optional fields when unknown.
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
                                        box_2d: { type: "array", items: { type: "number" } },
                                        mask: { type: "string" },
                                        points: {
                                                type: "array",
                                                items: { type: "array", items: { type: "number" } }
                                        }
                                },
                                required: ["label", "box_2d"]
                        }
                }
        },
        required: ["items"]
};
