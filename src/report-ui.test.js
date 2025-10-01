import { calculateAggregates } from './report-ui.js';

describe('calculateAggregates', () => {
	test('calculates counts by label correctly', () => {
		const detections = [
			{ id: '1', label: 'ladder', category: 'object', confidence: 0.9 },
			{ id: '2', label: 'ladder', category: 'object', confidence: 0.85 },
			{ id: '3', label: 'exit sign', category: 'facility_asset', confidence: 0.95 },
			{ id: '4', label: 'hard hat', category: 'object', confidence: 0.8 }
		];

		const result = calculateAggregates(detections);

		expect(result.countsByLabel).toEqual([
			{ label: 'ladder', count: 2 },
			{ label: 'exit sign', count: 1 },
			{ label: 'hard hat', count: 1 }
		]);
	});

	test('calculates counts by category correctly', () => {
		const detections = [
			{ id: '1', label: 'ladder', category: 'object', confidence: 0.9 },
			{ id: '2', label: 'scaffold', category: 'object', confidence: 0.85 },
			{ id: '3', label: 'exit sign', category: 'facility_asset', confidence: 0.95 },
			{ id: '4', label: 'no hard hat', category: 'safety_issue', confidence: 0.8 }
		];

		const result = calculateAggregates(detections);

		expect(result.countsByCategory).toEqual([
			{ category: 'object', count: 2 },
			{ category: 'facility_asset', count: 1 },
			{ category: 'safety_issue', count: 1 }
		]);
	});

	test('handles empty detections array', () => {
		const result = calculateAggregates([]);

		expect(result.countsByLabel).toEqual([]);
		expect(result.countsByCategory).toEqual([]);
	});

	test('handles detections with missing labels', () => {
		const detections = [
			{ id: '1', category: 'object', confidence: 0.9 },
			{ id: '2', label: 'ladder', category: 'object', confidence: 0.85 }
		];

		const result = calculateAggregates(detections);

		expect(result.countsByLabel).toHaveLength(2);
		expect(result.countsByLabel).toContainEqual({ label: 'ladder', count: 1 });
		expect(result.countsByLabel).toContainEqual({ label: 'unknown', count: 1 });
	});

	test('handles detections with missing categories', () => {
		const detections = [
			{ id: '1', label: 'ladder', confidence: 0.9 },
			{ id: '2', label: 'scaffold', category: 'object', confidence: 0.85 }
		];

		const result = calculateAggregates(detections);

		expect(result.countsByCategory).toHaveLength(2);
		expect(result.countsByCategory).toContainEqual({ category: 'object', count: 1 });
		expect(result.countsByCategory).toContainEqual({ category: 'other', count: 1 });
	});

	test('sorts by count descending', () => {
		const detections = [
			{ id: '1', label: 'A', category: 'object', confidence: 0.9 },
			{ id: '2', label: 'B', category: 'object', confidence: 0.9 },
			{ id: '3', label: 'B', category: 'object', confidence: 0.9 },
			{ id: '4', label: 'C', category: 'object', confidence: 0.9 },
			{ id: '5', label: 'C', category: 'object', confidence: 0.9 },
			{ id: '6', label: 'C', category: 'object', confidence: 0.9 }
		];

		const result = calculateAggregates(detections);

		expect(result.countsByLabel).toEqual([
			{ label: 'C', count: 3 },
			{ label: 'B', count: 2 },
			{ label: 'A', count: 1 }
		]);
	});

	test('handles single detection', () => {
		const detections = [
			{ id: '1', label: 'ladder', category: 'object', confidence: 0.9 }
		];

		const result = calculateAggregates(detections);

		expect(result.countsByLabel).toEqual([
			{ label: 'ladder', count: 1 }
		]);
		expect(result.countsByCategory).toEqual([
			{ category: 'object', count: 1 }
		]);
	});

	test('handles duplicate entries correctly', () => {
		const detections = [
			{ id: '1', label: 'ladder', category: 'object', confidence: 0.9 },
			{ id: '2', label: 'ladder', category: 'object', confidence: 0.9 },
			{ id: '3', label: 'ladder', category: 'object', confidence: 0.9 },
			{ id: '4', label: 'ladder', category: 'object', confidence: 0.9 }
		];

		const result = calculateAggregates(detections);

		expect(result.countsByLabel).toEqual([
			{ label: 'ladder', count: 4 }
		]);
		expect(result.countsByCategory).toEqual([
			{ category: 'object', count: 4 }
		]);
	});
});
