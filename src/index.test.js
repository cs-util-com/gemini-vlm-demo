import {
        toCanvasBox,
        toCanvasPolygon,
        toCanvasPoint,
        ensureCoordOrigin,
        ensureCoordSystem
} from './geometry.js';
import { clamp } from './math.js';
import { prepareDetectionData } from './ui-utils.js';

describe('geometry helpers', () => {
	const naturalW = 200;
	const naturalH = 100;

	describe('Gemini bbox array format [ymin, xmin, ymax, xmax]', () => {
		test('toCanvasBox parses Gemini array format and converts to canvas coordinates', () => {
			// Gemini format: [ymin, xmin, ymax, xmax] normalized 0-1000
			// Example: [200, 100, 600, 500] on a 1000x1000 normalized space
			// Image: 200x100 pixels
			const geminiBbox = [200, 100, 600, 500];
			const result = toCanvasBox(geminiBbox, 'normalized_0_1000', 1, 1, naturalW, naturalH, 'top-left', 200, 100);
			
			// Expected: ymin=200/1000*100=20, xmin=100/1000*200=20
			//           ymax=600/1000*100=60, xmax=500/1000*200=100
			//           x=20, y=20, width=80, height=40
			expect(result).toEqual({ x: 20, y: 20, width: 80, height: 40 });
		});

		test('toCanvasBox handles top-left origin correctly (Gemini default)', () => {
			const geminiBbox = [100, 200, 300, 400]; // [ymin, xmin, ymax, xmax]
			const result = toCanvasBox(geminiBbox, 'normalized_0_1000', 1, 1, naturalW, naturalH, 'top-left', 200, 100);
			
			// ymin=100/1000*100=10, xmin=200/1000*200=40
			// ymax=300/1000*100=30, xmax=400/1000*200=80
			// x=40, y=10, width=40, height=20
			expect(result).toEqual({ x: 40, y: 10, width: 40, height: 20 });
		});

		test('toCanvasBox returns null for invalid array', () => {
			expect(toCanvasBox([1, 2, 3], 'normalized_0_1000', 1, 1, naturalW, naturalH)).toBeNull();
			expect(toCanvasBox([NaN, 100, 200, 300], 'normalized_0_1000', 1, 1, naturalW, naturalH)).toBeNull();
		});
	});

	describe('Legacy object format {x, y, width, height}', () => {
		test('toCanvasBox still supports object format for backward compatibility', () => {
			const bbox = { x: 10, y: 20, width: 30, height: 40 };
			const result = toCanvasBox(bbox, 'pixel', 1, 1, naturalW, naturalH, 'top-left', 200, 100);
			expect(result).toEqual({ x: 10, y: 20, width: 30, height: 40 });
		});

		test('toCanvasBox converts bottom-left origin to top-left when specified', () => {
			const bbox = { x: 10, y: 20, width: 30, height: 40 };
			const result = toCanvasBox(bbox, 'pixel', 1, 1, naturalW, naturalH, 'bottom-left', 200, 100);
			// bottom-left: y = imgH - (y + height) = 100 - (20 + 40) = 40
			expect(result).toEqual({ x: 10, y: 40, width: 30, height: 40 });
		});
	});

	test('toCanvasBox returns null when bbox is missing', () => {
		expect(toCanvasBox(null, 'pixel', 1, 1, naturalW, naturalH)).toBeNull();
	});

	test('toCanvasBox respects normalized_0_1000 coord system and scales output', () => {
		const bbox = { x: 500, y: 250, width: 100, height: 200 };
		const result = toCanvasBox(bbox, 'normalized_0_1000', 0.5, 0.5, 400, 200, 'top-left', 200, 100);
		expect(result).toEqual({ x: 100, y: 25, width: 20, height: 20 });
	});

  test('toCanvasBox clamps values that exceed the canvas bounds', () => {
    const bbox = { x: 180, y: 90, width: 50, height: 30 };
    const result = toCanvasBox(bbox, 'pixel', 1, 1, naturalW, naturalH, 'top-left', 200, 100);
    expect(result).toEqual({ x: 180, y: 90, width: 20, height: 10 });
  });

  test('toCanvasBox returns null when bbox contains non-finite values', () => {
    const bbox = { x: 0, y: Number.NaN, width: 10, height: 10 };
    expect(toCanvasBox(bbox, 'pixel', 1, 1, naturalW, naturalH, 'top-left', 200, 100)).toBeNull();
  });

  test('toCanvasBox falls back to unit scale and skips clamping when scale/canvas values are missing', () => {
    const bbox = { x: 10, y: 10, width: 10, height: 10 };
    const result = toCanvasBox(bbox, 'pixel', undefined, undefined, naturalW, naturalH, 'top-left');
    expect(result).toEqual({ x: 10, y: 10, width: 10, height: 10 });
  });

  test('toCanvasPolygon flips Y when origin is bottom-left', () => {
    const polygon = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 50, y: 50 }
    ];
    const result = toCanvasPolygon(polygon, 'pixel', 1, 1, naturalW, naturalH, 'bottom-left');
    expect(result).toEqual([
      { x: 0, y: 100 },
      { x: 100, y: 100 },
      { x: 50, y: 50 }
    ]);
  });

  test('toCanvasPolygon maps normalized coordinates correctly', () => {
    const polygon = [
      { x: 0, y: 0 },
      { x: 1000, y: 0 },
      { x: 500, y: 1000 }
    ];
    const result = toCanvasPolygon(polygon, 'normalized_0_1000', 0.5, 0.5, 400, 200, 'top-left');
    expect(result).toEqual([
      { x: 0, y: 0 },
      { x: 200, y: 0 },
      { x: 100, y: 100 }
    ]);
  });

  test('toCanvasPolygon returns null when fewer than three valid points remain after filtering', () => {
    const polygon = [
      { x: 0, y: 0 },
      { x: Number.NaN, y: 5 },
      { x: 10, y: Number.POSITIVE_INFINITY }
    ];
    const result = toCanvasPolygon(polygon, 'pixel', 1, 1, naturalW, naturalH, 'top-left');
    expect(result).toBeNull();
  });

        test('toCanvasPolygon returns null when poly is not an array', () => {
                expect(toCanvasPolygon(null, 'pixel', 1, 1, naturalW, naturalH, 'top-left')).toBeNull();
        });

        test('toCanvasPolygon defaults scale factors when display scales are missing', () => {
                const polygon = [
                        { x: 0, y: 0 },
                        { x: 0, y: 50 },
                        { x: 50, y: 50 }
                ];
                const result = toCanvasPolygon(polygon, 'pixel', undefined, undefined, naturalW, naturalH, 'top-left');
                expect(result).toEqual([
                        { x: 0, y: 0 },
                        { x: 0, y: 50 },
                        { x: 50, y: 50 }
                ]);
        });

        test('toCanvasPoint returns null for falsy input', () => {
                expect(toCanvasPoint(null, 'pixel', 1, 1, naturalW, naturalH, 'top-left')).toBeNull();
        });

        test('toCanvasPoint maps normalized points to canvas space', () => {
                const point = toCanvasPoint({ x: 500, y: 500 }, 'normalized_0_1000', 0.5, 0.5, naturalW, naturalH, 'top-left');
                expect(point).toEqual({ x: 50, y: 25 });
        });

	test('ensureCoordOrigin falls back to detections when image metadata missing', () => {
		const parsed = {
			image: {},
			detections: [{ coordOrigin: 'bottom-left' }]
		};
		expect(ensureCoordOrigin(parsed, 'top-left')).toBe('bottom-left');
	});

	test('ensureCoordSystem defaults to normalized_0_1000 (Gemini standard)', () => {
		const parsed = { image: {} };
		expect(ensureCoordSystem(parsed, 'normalized_0_1000')).toBe('normalized_0_1000');
	});

	test('ensureCoordOrigin defaults to top-left (Gemini standard)', () => {
		expect(ensureCoordOrigin({}, 'top-left')).toBe('top-left');
	});  test('clamp limits values to provided range and handles non-finite inputs', () => {
		expect(clamp(15, 0, 10)).toBe(10);
		expect(clamp(-5, 0, 10)).toBe(0);
		expect(clamp(Number.NaN, 0, 10)).toBe(0);
	});

	describe('Integration: Full Gemini response flow', () => {
		test('Complete flow from Gemini response to canvas coordinates', () => {
			// Simulate a Gemini API response with the official format
                        const geminiResponse = {
                                image: {
                                        width: 1920,
                                        height: 1080,
                                        coordSystem: 'normalized_0_1000'
                                },
                                items: [
                                        {
                                                id: '1',
                                                label: 'ladder',
                                                box_2d: [200, 100, 800, 500]
                                        }
                                ]
                        };

                        const prepared = prepareDetectionData({ ...geminiResponse }, geminiResponse.image.width, geminiResponse.image.height);
                        const imgW = prepared.image.width;
                        const imgH = prepared.image.height;
                        const canvasW = 960; // Half size display
                        const canvasH = 540;
                        const scaleX = canvasW / imgW; // 0.5
                        const scaleY = canvasH / imgH; // 0.5

                        const coordSystem = ensureCoordSystem(prepared, 'normalized_0_1000');
                        const coordOrigin = ensureCoordOrigin(prepared, 'top-left');

                        expect(coordSystem).toBe('normalized_0_1000');
                        expect(coordOrigin).toBe('top-left');

                        const detection = prepared.detections[0];
                        const canvasBox = toCanvasBox(
                                detection.bbox,
                                coordSystem,
                                scaleX,
				scaleY,
				imgW,
				imgH,
				coordOrigin,
				canvasW,
				canvasH
			);

			// Expected calculation:
			// [200, 100, 800, 500] normalized 0-1000
			// ymin = 200/1000 * 1080 = 216px
			// xmin = 100/1000 * 1920 = 192px
			// ymax = 800/1000 * 1080 = 864px
			// xmax = 500/1000 * 1920 = 960px
			// width = 960 - 192 = 768px
			// height = 864 - 216 = 648px
			// Scaled to canvas (0.5):
			// x = 192 * 0.5 = 96
			// y = 216 * 0.5 = 108
			// width = 768 * 0.5 = 384
			// height = 648 * 0.5 = 324

			expect(canvasBox).toEqual({
				x: 96,
				y: 108,
				width: 384,
				height: 324
			});
		});
	});
});
