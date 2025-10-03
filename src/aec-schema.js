/* istanbul ignore file */

export const AEC_PROMPT = `
Detect all salient objects in the image.
Respond with a single JSON object that matches the response schema.
For each item:
- Provide "label" with a concise description (avoid prose).
- Provide "box_2d" as [y0, x0, y1, x1] in the 0-1000 normalized space using a top-left origin.
- Include "mask" only when a segmentation mask is useful. Encode it as a base64 PNG probability map covering the same region as the box. Use the full PNG data, no prefixes.
- Include "points" only when useful. Each point must be [y, x] in the same 0-1000 normalized coordinate space.
Limit to at most 25 items. If uncertain about a region, omit it.
Output JSON only. Do not include prose, markdown, or code fences.
`.trim();

export const RESPONSE_SCHEMA = {
        type: "object",
        properties: {
                items: {
                        type: "array",
                        items: {
                                type: "object",
                                properties: {
                                        id: { type: "string", nullable: true },
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
