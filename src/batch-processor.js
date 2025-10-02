/**
 * Batch processor for concurrent image analysis with rate limiting
 */

const MAX_CONCURRENT = 10;

/**
 * Process multiple images with concurrency control
 * @param {Array} images - Array of image objects from session
 * @param {Function} processOne - Async function to process a single image (imageObj) => Promise<result>
 * @param {Function} onProgress - Optional callback for progress updates (imageObj, result, error) => void
 * @returns {Promise<Array>} Results array (includes errors)
 */
export async function processBatch(images, processOne, onProgress = null) {
	const results = new Array(images.length);
	let activeCount = 0;
	let nextIndex = 0;

	return new Promise((resolve) => {
		const processNext = async () => {
			if (nextIndex >= images.length) {
				// All items queued, check if all done
				if (activeCount === 0) {
					resolve(results);
				}
				return;
			}

			const currentIndex = nextIndex++;
			const image = images[currentIndex];
			activeCount++;

			try {
				const result = await processOne(image);
				results[currentIndex] = { success: true, data: result, image };
				if (onProgress) {
					onProgress(image, result, null);
				}
			} catch (error) {
				results[currentIndex] = { success: false, error, image };
				if (onProgress) {
					onProgress(image, null, error);
				}
			} finally {
				activeCount--;
				processNext(); // Start next item
			}
		};

		// Start initial batch of workers
		const initialWorkers = Math.min(MAX_CONCURRENT, images.length);
		for (let i = 0; i < initialWorkers; i++) {
			processNext();
		}
	});
}

/**
 * Create a delay promise for rate limiting
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>}
 */
export function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
