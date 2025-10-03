/* istanbul ignore file */

export const AEC_PROMPT = `
Detect objects and return a JSON object with items that each include a label, box_2d in [y0, x0, y1, x1] normalized to 0-1000, an optional mask (base64-encoded PNG probability map), and an optional array of points with [y, x] pairs. Limit the response to 25 items. Set coord_system to "normalized_0_1000" and coord_origin to "top-left". Respond with JSON only—no prose, no code fences. Use tight boxes and omit mask or points when unsure.`;

export const RESPONSE_SCHEMA = {
        type: "object",
        properties: {
                coord_system: { type: "string" },
                coord_origin: { type: "string" },
                items: {
                        type: "array",
                        items: {
                                type: "object",
                                properties: {
                                        id: { type: "string" },
                                        label: { type: "string" },
                                        confidence: { type: "number" },
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
