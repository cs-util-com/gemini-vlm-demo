import {
	computeResizeDimensions,
	estimateTileFootprint,
	IMAGE_PREPROCESS_DEFAULTS,
	downscaleImageForGemini
} from './image-utils.js';

describe('computeResizeDimensions', () => {
	test('returns original dimensions when already within targets', () => {
		const result = computeResizeDimensions(800, 600);
		expect(result.resized).toBe(false);
		expect(result.width).toBe(800);
		expect(result.height).toBe(600);
		expect(result.strategy).toMatch(/no-op/);
	});

	test('downscales large images to keep short side near target', () => {
		const result = computeResizeDimensions(4000, 3000);
		expect(result.resized).toBe(true);
		expect(result.width).toBe(1280);
		expect(result.height).toBe(960);
		expect(result.strategy).toBe('downscale-dual-axis');
	});

	test('downscales panoramic images but preserves minimum short side', () => {
		const result = computeResizeDimensions(5000, 900);
		expect(result.resized).toBe(true);
		expect(result.height).toBeGreaterThanOrEqual(IMAGE_PREPROCESS_DEFAULTS.minShortSide);
		expect(result.strategy).toBe('downscale-long-side');
	});

	test('handles extremely large dimensions gracefully', () => {
		const result = computeResizeDimensions(8000, 6000);
		expect(result.resized).toBe(true);
		expect(result.width).toBe(1280);
		expect(result.height).toBe(960);
	});
});

describe('downscaleImageForGemini', () => {
	const originalCreateElement = document.createElement.bind(document);
	const originalCreateImageBitmap = global.createImageBitmap;

	afterEach(() => {
		document.createElement = originalCreateElement;
		if (originalCreateImageBitmap) {
			global.createImageBitmap = originalCreateImageBitmap;
		} else {
			delete global.createImageBitmap;
		}
	});

	test('produces resized blob metadata and preserves warnings', async () => {
		global.createImageBitmap = jest.fn(async () => ({
			width: 4000,
			height: 3000,
			close: jest.fn()
		}));

		const canvasMock = {
			width: 0,
			height: 0,
			getContext: jest.fn(() => ({ drawImage: jest.fn() })),
			toBlob: jest.fn(cb => {
				cb(new Blob([new Uint8Array(256)], { type: 'image/webp' }));
			})
		};

		document.createElement = jest.fn((tag) => {
			if (tag === 'canvas') {
				return canvasMock;
			}
			return originalCreateElement(tag);
		});

		const file = new File([new Uint8Array(1024)], 'photo.jpg', { type: 'image/jpeg' });
		const result = await downscaleImageForGemini(file);

		expect(result.resized).toBe(true);
		expect(result.targetWidth).toBe(1280);
		expect(result.targetHeight).toBe(960);
		expect(result.mimeType).toBe('image/webp');
		expect(result.footprint.totalTiles).toBeGreaterThan(0);
		expect(result.warnings).toBeInstanceOf(Array);
		expect(canvasMock.getContext).toHaveBeenCalled();
	});
});

describe('estimateTileFootprint', () => {
	test('computes tile counts and estimated tokens', () => {
		const footprint = estimateTileFootprint(800, 600);
		expect(footprint.tilesAcross).toBe(2);
		expect(footprint.tilesDown).toBe(1);
		expect(footprint.totalTiles).toBe(2);
		expect(footprint.estimatedTokens).toBe(516);
	});

	test('enforces minimum of one tile per dimension', () => {
		const footprint = estimateTileFootprint(100, 100);
		expect(footprint.tilesAcross).toBe(1);
		expect(footprint.tilesDown).toBe(1);
		expect(footprint.totalTiles).toBe(1);
	});
});
