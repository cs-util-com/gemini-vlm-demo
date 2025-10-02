/**
 * Tests for batch processor
 */

import { processBatch, delay } from './batch-processor.js';

describe('batch-processor', () => {
	describe('processBatch', () => {
		it('should process all items successfully', async () => {
			const items = [
				{ id: 1, value: 'a' },
				{ id: 2, value: 'b' },
				{ id: 3, value: 'c' }
			];

			const processOne = async (item) => {
				await delay(10);
				return { result: item.value.toUpperCase() };
			};

			const results = await processBatch(items, processOne);

			expect(results).toHaveLength(3);
			expect(results[0].success).toBe(true);
			expect(results[0].data.result).toBe('A');
			expect(results[1].data.result).toBe('B');
			expect(results[2].data.result).toBe('C');
		});

		it('should handle errors gracefully', async () => {
			const items = [
				{ id: 1, shouldFail: false },
				{ id: 2, shouldFail: true },
				{ id: 3, shouldFail: false }
			];

			const processOne = async (item) => {
				await delay(5);
				if (item.shouldFail) {
					throw new Error('Processing failed');
				}
				return { id: item.id, status: 'ok' };
			};

			const results = await processBatch(items, processOne);

			expect(results).toHaveLength(3);
			expect(results[0].success).toBe(true);
			expect(results[1].success).toBe(false);
			expect(results[1].error.message).toBe('Processing failed');
			expect(results[2].success).toBe(true);
		});

		it('should call progress callback for each item', async () => {
			const items = [{ id: 1 }, { id: 2 }];
			const progressCalls = [];

			const processOne = async (item) => {
				await delay(5);
				return { processed: item.id };
			};

			const onProgress = (image, result, error) => {
				progressCalls.push({ image, result, error });
			};

			await processBatch(items, processOne, onProgress);

			expect(progressCalls).toHaveLength(2);
			expect(progressCalls[0].result.processed).toBe(1);
			expect(progressCalls[0].error).toBeNull();
			expect(progressCalls[1].result.processed).toBe(2);
		});

		it('should respect concurrency limit', async () => {
			const items = Array.from({ length: 25 }, (_, i) => ({ id: i }));
			let maxConcurrent = 0;
			let currentConcurrent = 0;

			const processOne = async (item) => {
				currentConcurrent++;
				maxConcurrent = Math.max(maxConcurrent, currentConcurrent);
				await delay(20);
				currentConcurrent--;
				return { id: item.id };
			};

			await processBatch(items, processOne);

			// Should not exceed MAX_CONCURRENT (10)
			expect(maxConcurrent).toBeLessThanOrEqual(10);
			expect(maxConcurrent).toBeGreaterThan(1); // Should use concurrency
		});

		it('should preserve order of results', async () => {
			const items = [
				{ id: 1, delay: 50 },
				{ id: 2, delay: 10 },
				{ id: 3, delay: 30 }
			];

			const processOne = async (item) => {
				await delay(item.delay);
				return { id: item.id };
			};

			const results = await processBatch(items, processOne);

			expect(results[0].data.id).toBe(1);
			expect(results[1].data.id).toBe(2);
			expect(results[2].data.id).toBe(3);
		});
	});

	describe('delay', () => {
		it('should resolve after specified time', async () => {
			const start = Date.now();
			await delay(50);
			const elapsed = Date.now() - start;

			expect(elapsed).toBeGreaterThanOrEqual(45);
			expect(elapsed).toBeLessThan(100);
		});
	});
});
