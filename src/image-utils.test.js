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

	test('returns no-op when input is below minimum short side', () => {
		const result = computeResizeDimensions(640, 480);
		expect(result.resized).toBe(false);
		expect(result.strategy).toBe('no-op-small-input');
		expect(result.width).toBe(640);
		expect(result.height).toBe(480);
	});

	test('throws when width is invalid', () => {
		expect(() => computeResizeDimensions(0, 600)).toThrow('Invalid width');
		expect(() => computeResizeDimensions(NaN, 600)).toThrow('Invalid width');
	});

	test('throws when height is invalid', () => {
		expect(() => computeResizeDimensions(800, 0)).toThrow('Invalid height');
		expect(() => computeResizeDimensions(800, Number.POSITIVE_INFINITY)).toThrow('Invalid height');
	});
});

describe('downscaleImageForGemini', () => {
	const originalCreateElement = document.createElement.bind(document);
	const originalCreateImageBitmap = global.createImageBitmap;
	const OriginalImage = global.Image;
	const originalCreateObjectURL = URL.createObjectURL;
	const originalRevokeObjectURL = URL.revokeObjectURL;

	afterEach(() => {
		document.createElement = originalCreateElement;
		if (originalCreateImageBitmap) {
			global.createImageBitmap = originalCreateImageBitmap;
		} else {
			delete global.createImageBitmap;
		}
		if (OriginalImage) {
			global.Image = OriginalImage;
		}
		if (originalCreateObjectURL) {
			URL.createObjectURL = originalCreateObjectURL;
		}
		if (originalRevokeObjectURL) {
			URL.revokeObjectURL = originalRevokeObjectURL;
		}
	});

	function mockCanvas({ toBlobImpl, convertToBlobImpl } = {}) {
		const canvas = {
			width: 0,
			height: 0,
			getContext: jest.fn(() => ({ drawImage: jest.fn() })),
			toBlob: jest.fn(toBlobImpl ?? ((cb) => cb(new Blob([new Uint8Array(256)], { type: 'image/webp' }))))
		};
		if (convertToBlobImpl) {
			canvas.convertToBlob = jest.fn(convertToBlobImpl);
		}
		return canvas;
	}

	test('rejects when provided non-blob input', async () => {
		await expect(downscaleImageForGemini('not-a-blob')).rejects.toThrow('Invalid file');
	});

	test('produces resized blob metadata and preserves warnings', async () => {
		global.createImageBitmap = jest.fn(async () => ({
			width: 4000,
			height: 3000,
			close: jest.fn()
		}));

		const canvasMock = mockCanvas();
		document.createElement = jest.fn((tag) => {
			if (tag === 'canvas') {
				return canvasMock;
			}
			return originalCreateElement(tag);
		});

		const file = new File([new Uint8Array(1024)], 'photo.jpg', { type: 'image/jpeg' });
		const result = await downscaleImageForGemini(file, { preferSmallerBytes: false });

		expect(result.resized).toBe(true);
		expect(result.targetWidth).toBe(1280);
		expect(result.targetHeight).toBe(960);
		expect(result.mimeType).toBe('image/webp');
		expect(result.footprint.totalTiles).toBeGreaterThan(0);
		expect(result.warnings).toBeInstanceOf(Array);
		expect(canvasMock.getContext).toHaveBeenCalled();
	});

	test('falls back to original payload when conversion is not smaller', async () => {
		global.createImageBitmap = jest.fn(async () => ({
			width: 2600,
			height: 1800,
			close: jest.fn()
		}));

		const canvasMock = mockCanvas({ toBlobImpl: (cb) => {
			cb(new Blob([new Uint8Array(4096)], { type: 'image/webp' }));
		}});

		document.createElement = jest.fn((tag) => {
			if (tag === 'canvas') {
				return canvasMock;
			}
			return originalCreateElement(tag);
		});

		const file = new File([new Uint8Array(2048)], 'photo.jpg', { type: 'image/jpeg' });
		const result = await downscaleImageForGemini(file);

		expect(result.resized).toBe(false);
		expect(result.targetWidth).toBe(2600);
		expect(result.mimeType).toBe('image/jpeg');
		expect(result.compressionRatio).toBe(1);
	});

	test('emits warnings for panoramic scenes requiring many tiles', async () => {
		global.createImageBitmap = jest.fn(async () => ({
			width: 6000,
			height: 900,
			close: jest.fn()
		}));

		const canvasMock = mockCanvas();
		document.createElement = jest.fn((tag) => {
			if (tag === 'canvas') {
				return canvasMock;
			}
			return originalCreateElement(tag);
		});

		const file = new File([new Uint8Array(1024)], 'wide.jpg', { type: 'image/jpeg' });
		const result = await downscaleImageForGemini(file);

		expect(result.resized).toBe(true);
		expect(result.targetWidth).toBeGreaterThan(3000);
		expect(result.footprint.totalTiles).toBeGreaterThan(4);
		expect(result.warnings.some(w => /cropping/i.test(w))).toBe(true);
	});

	test('records warning when canvas conversion fails', async () => {
		global.createImageBitmap = jest.fn(async () => ({
			width: 3200,
			height: 2400,
			close: jest.fn()
		}));

		const canvasMock = mockCanvas({ toBlobImpl: (cb) => cb(null) });
		document.createElement = jest.fn((tag) => {
			if (tag === 'canvas') {
				return canvasMock;
			}
			return originalCreateElement(tag);
		});

		const file = new File([new Uint8Array(3072)], 'error.jpg', { type: 'image/jpeg' });
		const result = await downscaleImageForGemini(file);

		expect(result.resized).toBe(false);
		expect(result.warnings.some(w => /Failed to downscale image/i.test(w))).toBe(true);
	});

	test('uses convertToBlob when available and flags large payload warning', async () => {
		global.createImageBitmap = jest.fn(async () => ({
			width: 6400,
			height: 4800,
			close: jest.fn()
		}));

		const smallBlob = new Blob([new Uint8Array(512)], { type: 'image/webp' });
		const canvasMock = mockCanvas({ convertToBlobImpl: () => smallBlob });
		document.createElement = jest.fn((tag) => tag === 'canvas' ? canvasMock : originalCreateElement(tag));

		const file = new File([new Uint8Array(4 * 1024 * 1024)], 'convert.jpg', { type: 'image/jpeg' });
		const result = await downscaleImageForGemini(file);

		expect(canvasMock.convertToBlob).toHaveBeenCalled();
		expect(canvasMock.toBlob).not.toHaveBeenCalled();
		expect(result.targetBytes).toBe(smallBlob.size);
		expect(result.mimeType).toBe('image/webp');
	});

	test('warns when inline payload exceeds 20 MB', async () => {
		global.createImageBitmap = jest.fn(async () => ({
			width: 800,
			height: 600,
			close: jest.fn()
		}));

		const bigBytes = new Uint8Array(19 * 1024 * 1024);
		const file = new File([bigBytes], 'large-inline.jpg', { type: 'image/jpeg' });
		const result = await downscaleImageForGemini(file);

		expect(result.resized).toBe(false);
		expect(result.targetBytes).toBe(file.size);
		expect(result.warnings.some(w => /20 MB|Files API/i.test(w))).toBe(true);
	});

	test('falls back to HTML image decoding when bitmap creation fails', async () => {
		global.createImageBitmap = jest.fn(async () => {
			throw new Error('decode failed');
		});

		URL.createObjectURL = jest.fn(() => 'blob://fake');
		URL.revokeObjectURL = jest.fn();

		class FakeImage {
			constructor() {
				this.onload = null;
				this.onerror = null;
			}
			set src(value) {
				this._src = value;
				this.naturalWidth = 2048;
				this.naturalHeight = 1024;
				if (this.onload) this.onload();
			}
		}

		global.Image = FakeImage;

		const canvasMock = mockCanvas();
		document.createElement = jest.fn((tag) => tag === 'canvas' ? canvasMock : originalCreateElement(tag));

		const file = new File([new Uint8Array(512)], 'fallback.jpg', { type: 'image/jpeg' });
		const result = await downscaleImageForGemini(file);

		expect(result.sourceWidth).toBe(2048);
		expect(result.sourceHeight).toBe(1024);
		expect(URL.createObjectURL).toHaveBeenCalled();
		expect(URL.revokeObjectURL).toHaveBeenCalled();
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

	test('throws when width is not a positive finite number', () => {
		expect(() => estimateTileFootprint(0, 100)).toThrow('Invalid width');
		expect(() => estimateTileFootprint(Number.NaN, 100)).toThrow('Invalid width');
	});

	test('throws when height is not a positive finite number', () => {
		expect(() => estimateTileFootprint(100, -5)).toThrow('Invalid height');
		expect(() => estimateTileFootprint(100, Number.POSITIVE_INFINITY)).toThrow('Invalid height');
	});

	test('throws when tile size is not a positive finite number', () => {
		expect(() => estimateTileFootprint(100, 100, 0)).toThrow('Invalid tileSize');
		expect(() => estimateTileFootprint(100, 100, Number.NaN)).toThrow('Invalid tileSize');
	});
});
