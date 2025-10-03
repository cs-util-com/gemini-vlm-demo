import {
	colorForCategory,
	extractJSONFromResponse,
	calculateDisplayScale,
	formatJsonOutput,
	extractBase64FromDataUrl,
	prepareDetectionData,
	escapeHtml,
	transformResponseFormat
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
					parts: [{ text: '{"detections": []}' }]
				}
			}]
		};
		const result = extractJSONFromResponse(resp);
		expect(result).toEqual({ detections: [] });
	});

	it('strips markdown json code blocks', () => {
		const resp = {
			candidates: [{
				content: {
					parts: [{ text: '```json\n{"detections": []}\n```' }]
				}
			}]
		};
		const result = extractJSONFromResponse(resp);
		expect(result).toEqual({ detections: [] });
	});

	it('handles whitespace around JSON', () => {
		const resp = {
			candidates: [{
				content: {
					parts: [{ text: '  \n{"detections": []}\n  ' }]
				}
			}]
		};
		const result = extractJSONFromResponse(resp);
		expect(result).toEqual({ detections: [] });
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

	it('strips truncated mask data so remaining fields can be parsed', () => {
		const truncated = '{"items":[{"label":"skylight","box_2d":[0,482,453,997],"category":"facility_asset","mask":"\\u003cstart_of_mask\\u003eABC';
		const resp = {
			candidates: [{
				content: {
					parts: [{ text: truncated }]
				}
			}]
		};

		const result = extractJSONFromResponse(resp);
		expect(result).toEqual({
			items: [
				{
					label: 'skylight',
					box_2d: [0, 482, 453, 997],
					category: 'facility_asset',
					mask: null
				}
			]
		});
	});

	it('recovers from truncated mask asset object payloads', () => {
		const truncated = '{"items":[{"label":"panel","category":"object","mask":{"inline_data":{"mime_type":"image/png","data":"AAA';
		const resp = {
			candidates: [{
				content: {
					parts: [{ text: truncated }]
				}
			}]
		};

		const result = extractJSONFromResponse(resp);
		expect(result).toEqual({
			items: [
				{
					label: 'panel',
					category: 'object',
					mask: null
				}
			]
		});
	});

	it('appends missing closing brackets when mask was otherwise valid', () => {
		const missingRootBrace = '{"items":[{"mask":"\\u003cstart_of_mask\\u003eAAAA"}]';
		const resp = {
			candidates: [{
				content: {
					parts: [{ text: missingRootBrace }]
				}
			}]
		};

		const result = extractJSONFromResponse(resp);
		expect(result).toEqual({
			items: [
				{
					mask: null
				}
			]
		});
	});

	it('still throws when cleanup cannot repair the response', () => {
		const broken = '{"items":[{"label":"door"}],"note":"mask"';
		const resp = {
			candidates: [{
				content: {
					parts: [{ text: broken }]
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
		const parsed = { detections: [] };
		const result = prepareDetectionData(parsed, 1920, 1080);
		expect(result.image.width).toBe(1920);
		expect(result.image.height).toBe(1080);
	});

	it('preserves existing image dimensions', () => {
		const parsed = { image: { width: 800, height: 600 }, detections: [] };
		const result = prepareDetectionData(parsed, 1920, 1080);
		expect(result.image.width).toBe(800);
		expect(result.image.height).toBe(600);
	});

	it('creates image object if missing', () => {
		const parsed = { detections: [] };
		const result = prepareDetectionData(parsed, 1920, 1080);
		expect(result.image).toBeDefined();
		expect(typeof result.image).toBe('object');
	});

	it('preserves other properties in parsed data', () => {
		const parsed = { 
			detections: [{ label: 'test' }], 
			metadata: { source: 'test' },
			image: {}
		};
		const result = prepareDetectionData(parsed, 1920, 1080);
		expect(result.detections).toEqual([{ label: 'test' }]);
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
		const parsed = { detections: [] };
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

describe('transformResponseFormat', () => {
	it('transforms items array to detections format', () => {
		const input = {
			items: [
				{
					label: 'ladder',
					box_2d: [100, 200, 300, 400],
					category: 'object',
					confidence: 0.95
				}
			]
		};
		
		const result = transformResponseFormat(input);
		
		expect(result).toHaveProperty('detections');
		expect(result).toHaveProperty('global_insights');
		expect(Array.isArray(result.detections)).toBe(true);
		expect(result.detections.length).toBe(1);
		expect(result.detections[0]).toMatchObject({
			id: 'det_0',
			label: 'ladder',
			bbox: [100, 200, 300, 400],
			category: 'object',
			confidence: 0.95
		});
	});

	it('includes mask when present', () => {
		const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQ=';
		const input = {
			items: [
				{
					label: 'person',
					box_2d: [10, 20, 30, 40],
					mask: base64,
					confidence: 0.9
				}
			]
		};
		
		const result = transformResponseFormat(input);
		
		expect(result.detections[0]).toHaveProperty('mask', `data:image/png;base64,${base64}`);
	});

	it('resolves mask references from mask_assets map', () => {
		const input = {
			items: [
				{
					label: 'helmet',
					box_2d: [5, 10, 15, 20],
					mask: 'mask_1'
				}
			],
			mask_assets: {
				mask_1: 'iVBORw0KGgoAAAANSUhEUgAAAAUA' + 'A'.repeat(64)
			}
		};

		const result = transformResponseFormat(input);
		expect(result.detections[0]).toHaveProperty('mask');
		expect(result.detections[0].mask.startsWith('data:image/png;base64,')).toBe(true);
	});

	it('supports inline_data mask objects', () => {
		const input = {
			items: [
				{
					label: 'cone',
					box_2d: [1, 2, 3, 4],
					mask: {
						inline_data: {
							mime_type: 'image/webp',
							data: 'TWFuIGlzIGRpc3Rpbmd1aXNoZWQ=' 
						}
					}
				}
			]
		};

		const result = transformResponseFormat(input);
		expect(result.detections[0]).toHaveProperty('mask', 'data:image/webp;base64,TWFuIGlzIGRpc3Rpbmd1aXNoZWQ=');
	});

	it('omits mask when unable to resolve placeholder', () => {
		const input = {
			items: [
				{
					label: 'barrier',
					box_2d: [10, 10, 20, 20],
					mask: 'mask_999'
				}
			]
		};

		const result = transformResponseFormat(input);
		expect(result.detections[0].mask).toBeUndefined();
	});

	it('includes points when present', () => {
		const input = {
			items: [
				{
					label: 'marker',
					box_2d: [50, 60, 70, 80],
					points: [[100, 200], [150, 250]],
					confidence: 0.85
				}
			]
		};
		
		const result = transformResponseFormat(input);
		
		expect(result.detections[0]).toHaveProperty('points');
		expect(result.detections[0].points).toEqual([[100, 200], [150, 250]]);
	});

	it('sets default values for missing fields', () => {
		const input = {
			items: [
				{
					label: 'item',
					box_2d: [1, 2, 3, 4]
				}
			]
		};
		
		const result = transformResponseFormat(input);
		
		expect(result.detections[0].category).toBe('object');
		expect(result.detections[0].confidence).toBe(0.8);
	});

	it('returns input unchanged if already in legacy format', () => {
		const input = {
			detections: [{ id: '1', label: 'test', category: 'object', confidence: 0.9 }],
			global_insights: []
		};
		
		const result = transformResponseFormat(input);
		
		expect(result).toBe(input);
	});

	it('returns input unchanged for invalid input', () => {
		expect(transformResponseFormat(null)).toBe(null);
		expect(transformResponseFormat(undefined)).toBe(undefined);
		expect(transformResponseFormat('string')).toBe('string');
	});

	it('gathers mask assets from multiple sources', () => {
		const base = 'A'.repeat(64);
		const input = {
			items: [
				{
					label: 'multi',
					box_2d: [0, 0, 1, 1],
					mask: 'mask_from_assets_url'
				}
			],
			maskAssets: { mask_primary: base },
			mask_assets: { mask_secondary: base },
			maskResources: { mask_resource: base },
			mask_resources: { mask_resource_snake: base },
			maskData: { mask_data: base },
			mask_data: { mask_data_snake: base },
			masks: { mask_plain: base },
			segmentationMasks: { mask_segment: base },
			segmentation_masks: { mask_segment_snake: base },
			assets: {
				maskAssets: { mask_from_assets_url: { url: 'https://cdn.example.com/mask.png' } },
				mask_assets: { mask_from_assets_inline: { inlineData: { data: base, mimeType: 'image/avif' } } },
				masks: { mask_from_assets_direct: { base64: base } },
				segmentationMasks: { mask_from_assets_segmentation: { data: base } },
				segmentation_masks: { mask_from_assets_snake: base }
			}
		};

		const result = transformResponseFormat(input);

		expect(result.detections[0].mask).toBe('https://cdn.example.com/mask.png');
		expect(Object.keys(result.maskAssets)).toEqual(expect.arrayContaining([
			'mask_primary',
			'mask_secondary',
			'mask_resource',
			'mask_resource_snake',
			'mask_data',
			'mask_data_snake',
			'mask_plain',
			'mask_segment',
			'mask_segment_snake',
			'mask_from_assets_inline',
			'mask_from_assets_direct',
			'mask_from_assets_segmentation',
			'mask_from_assets_snake'
		]));
	});

	it('normalizes diverse mask representations', () => {
		const baseInline = 'A'.repeat(64);
		const basePng = 'B'.repeat(64);
		const baseAsset = 'C'.repeat(64);
		const basePngBase64 = 'D'.repeat(64);
		const baseBytes = 'E'.repeat(64);
		const dataUrl = 'data:image/png;base64,alreadyEncoded==';
		const input = {
			items: [
				{ label: 'dataUrl', box_2d: [1, 1, 2, 2], mask: dataUrl },
				{ label: 'inlineCamel', box_2d: [2, 2, 3, 3], mask: { inlineData: { data: baseInline, mimeType: 'image/gif' } } },
				{ label: 'directObject', box_2d: [3, 3, 4, 4], mask: { png: basePng } },
				{ label: 'url', box_2d: [4, 4, 5, 5], mask: { url: 'https://example.com/mask.svg' } },
				{ label: 'assetBase64', box_2d: [5, 5, 6, 6], mask: 'mask_asset_base64' },
				{ label: 'assetPngBase64', box_2d: [6, 6, 7, 7], mask: 'mask_asset_png_base64' },
				{ label: 'assetBytes', box_2d: [7, 7, 8, 8], mask: 'mask_asset_bytes' },
				{ label: 'unresolvedShort', box_2d: [8, 8, 9, 9], mask: 'short' },
				{ label: 'invalidObject', box_2d: [9, 9, 10, 10], mask: { foo: 'bar' } },
				{ label: 'invalidType', box_2d: [10, 10, 11, 11], mask: true }
			],
			mask_assets: {
				mask_asset_base64: { base64: baseAsset, mimeType: 'image/jpeg' },
				mask_asset_png_base64: { pngBase64: basePngBase64 },
				mask_asset_bytes: { bytes: baseBytes, mime_type: 'image/webp' }
			}
		};

		const result = transformResponseFormat(input);
		const [
			maskDataUrl,
			maskInlineCamel,
			maskDirectObject,
			maskUrl,
			maskAssetBase64,
			maskAssetPngBase64,
			maskAssetBytes,
			maskUnresolved,
			maskInvalid,
			maskInvalidType
		] = result.detections.map(det => det.mask);

		expect(maskDataUrl).toBe(dataUrl);
		expect(maskInlineCamel).toBe(`data:image/gif;base64,${baseInline}`);
		expect(maskDirectObject).toBe(`data:image/png;base64,${basePng}`);
		expect(maskUrl).toBe('https://example.com/mask.svg');
		expect(maskAssetBase64).toBe(`data:image/jpeg;base64,${baseAsset}`);
		expect(maskAssetPngBase64).toBe(`data:image/png;base64,${basePngBase64}`);
		expect(maskAssetBytes).toBe(`data:image/webp;base64,${baseBytes}`);
		expect(maskUnresolved).toBeUndefined();
		expect(maskInvalid).toBeUndefined();
		expect(maskInvalidType).toBeUndefined();
	});

	it('handles malformed mask assets gracefully', () => {
		const invalidCharMask = '@'.repeat(40);
		const inlineBase64 = 'F'.repeat(64);
		const inlineBytes = 'G'.repeat(64);
		const dataUrlAsset = 'data:image/png;base64,ZXhhbXBsZWRhdGE=';
		const input = {
			items: [
				{ box_2d: [0, 1, 2], mask: invalidCharMask },
				{ label: 'numberAsset', mask: 'mask_number_asset' },
				{ label: 'inlineBase64', mask: 'mask_inline_base64' },
				{ label: 'inlineBytes', mask: 'mask_inline_bytes' },
				{ label: 'dataUrlAsset', mask: 'mask_data_url_asset' },
				{ label: 'emptyStringAsset', mask: 'mask_empty_string' }
			],
			mask_assets: {
				mask_number_asset: 42,
				mask_inline_base64: { inline_data: { base64: inlineBase64, mime_type: 'image/heif' } },
				mask_inline_bytes: { inlineData: { bytes: inlineBytes, mimeType: 'image/tiff' } },
				mask_data_url_asset: { data: dataUrlAsset },
				mask_empty_string: ''
			}
		};

		const result = transformResponseFormat(input);
		const [first, second, third, fourth, fifth, sixth] = result.detections;

		expect(first.label).toBe('unknown');
		expect(first.bbox).toBeNull();
		expect(first.mask).toBeUndefined();
		expect(second.mask).toBeUndefined();
		expect(third.mask).toBe(`data:image/heif;base64,${inlineBase64}`);
		expect(fourth.mask).toBe(`data:image/tiff;base64,${inlineBytes}`);
		expect(fifth.mask).toBe(dataUrlAsset);
		expect(sixth.mask).toBeUndefined();
	});
});
