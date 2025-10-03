/* istanbul ignore file */

export const AEC_PROMPT = `
Detect objects in the image and respond with JSON only.
Return a single object with an "items" array (maximum 25 entries).
Each item must include:
- "label": short descriptive text.
- "box_2d": [y0, x0, y1, x1] with values normalized 0-1000 using a top-left origin.
Optionally include:
- "mask": base64-encoded PNG probability map for the object (omit when unavailable).
- "points": array of [y, x] pairs normalized 0-1000 highlighting key locations (omit when unavailable).
Do not include prose or code fences in the response.
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
                                        }
                                },
                                required: ["label", "box_2d"]
                        }
                }
        },
        required: ["items"]
};
