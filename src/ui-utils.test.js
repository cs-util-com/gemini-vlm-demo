import {
	colorForCategory,
	extractJSONFromResponse,
	calculateDisplayScale,
	formatJsonOutput,
	extractBase64FromDataUrl,
	prepareDetectionData,
	escapeHtml
} from './ui-utils.js';

describe('colorForCategory', () => {
	it('returns correct color for safety_issue', () => {
		expect(colorForCategory('safety_issue')).toBe('#ff5b5b');
	});

	it('returns correct color for facility_asset', () => {
		expect(colorForCategory('facility_asset')).toBe('#5bd1ff');
	});

	it('returns correct color for progress', () => {
		expect(colorForCategory('progress')).toBe('#a1ff5b');
	});

	it('returns correct color for object', () => {
		expect(colorForCategory('object')).toBe('#ffd05b');
	});

	it('returns default color for unknown category', () => {
		expect(colorForCategory('unknown')).toBe('#cccccc');
		expect(colorForCategory('')).toBe('#cccccc');
		expect(colorForCategory(null)).toBe('#cccccc');
		expect(colorForCategory(undefined)).toBe('#cccccc');
	});
});

describe('extractJSONFromResponse', () => {
	it('extracts JSON from valid Gemini response', () => {
                const resp = {
                        candidates: [{
                                content: {
                                        parts: [{ text: '{"items": []}' }]
                                }
                        }]
                };
                const result = extractJSONFromResponse(resp);
                expect(result).toEqual({ items: [] });
	});

	it('strips markdown json code blocks', () => {
                const resp = {
                        candidates: [{
                                content: {
                                        parts: [{ text: '```json\n{"items": []}\n```' }]
                                }
                        }]
                };
                const result = extractJSONFromResponse(resp);
                expect(result).toEqual({ items: [] });
	});

	it('handles whitespace around JSON', () => {
                const resp = {
                        candidates: [{
                                content: {
                                        parts: [{ text: '  \n{"items": []}\n  ' }]
                                }
                        }]
                };
                const result = extractJSONFromResponse(resp);
                expect(result).toEqual({ items: [] });
	});

	it('throws error when no candidates', () => {
		expect(() => extractJSONFromResponse({})).toThrow('No text JSON found in response.');
	});

	it('throws error when candidates array is empty', () => {
		expect(() => extractJSONFromResponse({ candidates: [] })).toThrow('No text JSON found in response.');
	});

	it('throws error when no text part found', () => {
		const resp = {
			candidates: [{
				content: {
					parts: [{ image: 'data' }]
				}
			}]
		};
		expect(() => extractJSONFromResponse(resp)).toThrow('No text JSON found in response.');
	});

	it('throws error on invalid JSON', () => {
		const resp = {
			candidates: [{
				content: {
					parts: [{ text: 'not valid json' }]
				}
			}]
		};
		expect(() => extractJSONFromResponse(resp)).toThrow();
	});

	it('finds text part when multiple parts present', () => {
		const resp = {
			candidates: [{
				content: {
					parts: [
						{ image: 'data' },
						{ text: '{"found": true}' },
						{ text: 'second text' }
					]
				}
			}]
		};
		const result = extractJSONFromResponse(resp);
		expect(result).toEqual({ found: true });
	});
});

describe('calculateDisplayScale', () => {
	it('returns 1.0 when image fits within viewport', () => {
		expect(calculateDisplayScale(800, 1920, 60)).toBe(1.0);
	});

	it('scales down when image exceeds viewport', () => {
		const scale = calculateDisplayScale(2000, 1920, 60);
		expect(scale).toBe((1920 - 60) / 2000);
		expect(scale).toBeLessThan(1.0);
	});

	it('uses custom padding', () => {
		const scale = calculateDisplayScale(1000, 1920, 100);
		// When naturalWidth (1000) < viewportWidth - padding (1820), scale is 1.0
		expect(scale).toBe(1.0);
	});

	it('defaults padding to 60', () => {
		const scale1 = calculateDisplayScale(1000, 1920);
		const scale2 = calculateDisplayScale(1000, 1920, 60);
		expect(scale1).toBe(scale2);
	});

	it('handles small viewport gracefully', () => {
		const scale = calculateDisplayScale(500, 400, 60);
		expect(scale).toBe((400 - 60) / 500);
	});

	it('throws error for invalid naturalWidth', () => {
		expect(() => calculateDisplayScale(0, 1920)).toThrow('Invalid naturalWidth');
		expect(() => calculateDisplayScale(-100, 1920)).toThrow('Invalid naturalWidth');
		expect(() => calculateDisplayScale(NaN, 1920)).toThrow('Invalid naturalWidth');
		expect(() => calculateDisplayScale(Infinity, 1920)).toThrow('Invalid naturalWidth');
		expect(() => calculateDisplayScale('800', 1920)).toThrow('Invalid naturalWidth');
	});

	it('throws error for invalid viewportWidth', () => {
		expect(() => calculateDisplayScale(800, 0)).toThrow('Invalid viewportWidth');
		expect(() => calculateDisplayScale(800, -1920)).toThrow('Invalid viewportWidth');
		expect(() => calculateDisplayScale(800, NaN)).toThrow('Invalid viewportWidth');
	});

	it('throws error for invalid padding', () => {
		expect(() => calculateDisplayScale(800, 1920, -10)).toThrow('Invalid padding');
		expect(() => calculateDisplayScale(800, 1920, NaN)).toThrow('Invalid padding');
		expect(() => calculateDisplayScale(800, 1920, Infinity)).toThrow('Invalid padding');
	});
});

describe('formatJsonOutput', () => {
	it('formats JSON with pretty printing', () => {
		const obj = { key: 'value', nested: { data: 123 } };
		const result = formatJsonOutput(obj);
		expect(result).toContain('"key": "value"');
		expect(result).toContain('"nested"');
		expect(result).toContain('  '); // indentation
	});

	it('adds note header when provided', () => {
		const obj = { status: 'ok' };
		const result = formatJsonOutput(obj, 'Success');
		expect(result.startsWith('// Success\n')).toBe(true);
		expect(result).toContain('"status": "ok"');
	});

	it('does not add header when note is null', () => {
		const obj = { status: 'ok' };
		const result = formatJsonOutput(obj, null);
		expect(result).not.toContain('//');
		expect(result.startsWith('{')).toBe(true);
	});

	it('does not add header when note is undefined', () => {
		const obj = { status: 'ok' };
		const result = formatJsonOutput(obj);
		expect(result).not.toContain('//');
		expect(result.startsWith('{')).toBe(true);
	});

	it('handles empty objects', () => {
		const result = formatJsonOutput({});
		expect(result).toBe('{}');
	});

	it('handles arrays', () => {
		const result = formatJsonOutput([1, 2, 3]);
		expect(result).toContain('[\n  1,\n  2,\n  3\n]');
	});
});

describe('extractBase64FromDataUrl', () => {
	it('extracts base64 content from data URL', () => {
		const dataUrl = 'data:image/jpeg;base64,ABC123XYZ';
		expect(extractBase64FromDataUrl(dataUrl)).toBe('ABC123XYZ');
	});

	it('handles data URLs with different MIME types', () => {
		const dataUrl = 'data:image/png;base64,PNG_DATA_HERE';
		expect(extractBase64FromDataUrl(dataUrl)).toBe('PNG_DATA_HERE');
	});

	it('handles data URLs with charset', () => {
		const dataUrl = 'data:text/plain;charset=utf-8;base64,TEXT_DATA';
		expect(extractBase64FromDataUrl(dataUrl)).toBe('TEXT_DATA');
	});

	it('throws error for non-string input', () => {
		expect(() => extractBase64FromDataUrl(123)).toThrow('Invalid dataUrl: must be a string');
		expect(() => extractBase64FromDataUrl(null)).toThrow('Invalid dataUrl: must be a string');
		expect(() => extractBase64FromDataUrl(undefined)).toThrow('Invalid dataUrl: must be a string');
	});

	it('throws error for invalid format without comma', () => {
		expect(() => extractBase64FromDataUrl('invalidformat')).toThrow('Invalid dataUrl format');
	});

	it('throws error for empty string', () => {
		expect(() => extractBase64FromDataUrl('')).toThrow('Invalid dataUrl format');
	});
});

describe('prepareDetectionData', () => {
        it('adds missing image dimensions', () => {
                const parsed = { items: [] };
                const result = prepareDetectionData(parsed, 1920, 1080);
                expect(result.image.width).toBe(1920);
                expect(result.image.height).toBe(1080);
        });

        it('preserves existing image dimensions', () => {
                const parsed = { image: { width: 800, height: 600 }, items: [] };
                const result = prepareDetectionData(parsed, 1920, 1080);
                expect(result.image.width).toBe(800);
                expect(result.image.height).toBe(600);
        });

        it('creates image object if missing', () => {
                const parsed = { items: [] };
                const result = prepareDetectionData(parsed, 1920, 1080);
                expect(result.image).toBeDefined();
                expect(typeof result.image).toBe('object');
        });

        it('preserves other properties in parsed data', () => {
                const parsed = {
                        items: [{ label: 'test', box_2d: [0, 0, 10, 10] }],
                        metadata: { source: 'test' },
                        image: {}
                };
                const result = prepareDetectionData(parsed, 1920, 1080);
                expect(result.detections).toHaveLength(1);
                expect(result.detections[0].label).toBe('test');
                expect(result.detections[0].bbox).toEqual([0, 0, 10, 10]);
                expect(result.metadata).toEqual({ source: 'test' });
        });

	it('handles null width/height in image object', () => {
		const parsed = { image: { width: null, height: null } };
		const result = prepareDetectionData(parsed, 1920, 1080);
		expect(result.image.width).toBe(1920);
		expect(result.image.height).toBe(1080);
	});

        it('handles undefined width/height in image object', () => {
                const parsed = { image: {} };
                const result = prepareDetectionData(parsed, 1920, 1080);
                expect(result.image.width).toBe(1920);
                expect(result.image.height).toBe(1080);
        });

        it('converts legacy detections into items for compatibility', () => {
                const parsed = {
                        detections: [{ id: '1', label: 'legacy', bbox: [0, 0, 100, 200] }]
                };
                const result = prepareDetectionData(parsed, 1920, 1080);
                expect(result.items).toHaveLength(1);
                expect(result.items[0].label).toBe('legacy');
                expect(result.items[0].box_2d).toEqual([0, 0, 100, 200]);
                expect(result.detections[0].bbox).toEqual([0, 0, 100, 200]);
        });

        it('normalizes point arrays into {x,y} objects', () => {
                const parsed = {
                        items: [{ label: 'thing', box_2d: [0, 0, 100, 100], points: [[10, 20], [30, 40]] }]
                };
                const result = prepareDetectionData(parsed, 1920, 1080);
                expect(result.detections[0].points).toEqual([{ x: 20, y: 10 }, { x: 40, y: 30 }]);
        });

        it('omits masks when the string is blank', () => {
                const parsed = {
                        items: [{ label: 'thing', box_2d: [0, 0, 100, 100], mask: '   ' }]
                };
                const result = prepareDetectionData(parsed, 1920, 1080);
                expect(result.detections[0].mask).toBeNull();
        });

        it('filters out invalid points when normalizing', () => {
                const parsed = {
                        items: [{ label: 'thing', box_2d: [0, 0, 100, 100], points: [[10, 20], ['bad'], [30]] }]
                };
                const result = prepareDetectionData(parsed, 1920, 1080);
                expect(result.detections[0].points).toEqual([{ x: 20, y: 10 }]);
        });

        it('trims non-empty mask strings', () => {
                const parsed = {
                        items: [{ label: 'thing', box_2d: [0, 0, 100, 100], mask: '  abc123  ' }]
                };
                const result = prepareDetectionData(parsed, 1920, 1080);
                expect(result.detections[0].mask).toBe('abc123');
        });

	it('throws error for invalid parsed data', () => {
		expect(() => prepareDetectionData(null, 1920, 1080)).toThrow('Invalid parsed data');
		expect(() => prepareDetectionData(undefined, 1920, 1080)).toThrow('Invalid parsed data');
		expect(() => prepareDetectionData('string', 1920, 1080)).toThrow('Invalid parsed data');
	});

	it('throws error for invalid naturalWidth', () => {
		expect(() => prepareDetectionData({}, 0, 1080)).toThrow('Invalid naturalWidth');
		expect(() => prepareDetectionData({}, -100, 1080)).toThrow('Invalid naturalWidth');
		expect(() => prepareDetectionData({}, NaN, 1080)).toThrow('Invalid naturalWidth');
	});

	it('throws error for invalid naturalHeight', () => {
		expect(() => prepareDetectionData({}, 1920, 0)).toThrow('Invalid naturalHeight');
		expect(() => prepareDetectionData({}, 1920, -100)).toThrow('Invalid naturalHeight');
		expect(() => prepareDetectionData({}, 1920, Infinity)).toThrow('Invalid naturalHeight');
	});

        it('mutates the original object', () => {
                const parsed = { items: [] };
                const result = prepareDetectionData(parsed, 1920, 1080);
                expect(result).toBe(parsed); // Same reference
                expect(parsed.image.width).toBe(1920);
        });
});

describe('escapeHtml', () => {
	it('escapes basic HTML special characters', () => {
		const input = `<div>&<>&"'</div>`;
		expect(escapeHtml(input)).toBe('&lt;div&gt;&amp;&lt;&gt;&amp;&quot;&#39;&lt;/div&gt;');
	});

	it('returns empty string for nullish input', () => {
		expect(escapeHtml(null)).toBe('');
		expect(escapeHtml(undefined)).toBe('');
	});

	it('coerces non-string values to string', () => {
		expect(escapeHtml(123)).toBe('123');
		expect(escapeHtml(true)).toBe('true');
	});

	it('leaves safe strings unchanged', () => {
		const input = 'plain text';
		expect(escapeHtml(input)).toBe(input);
	});
});
