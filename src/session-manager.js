/**
 * Session Manager - Handles multi-image batch analysis sessions
 */

/**
 * Create a new session for batch image analysis
 * @param {File[]} files - Array of image files (max 20)
 * @returns {object} Session object
 */
export function createSession(files) {
	const sessionId = `session_${Date.now()}`;
	const timestamp = new Date().toISOString();
	
	const images = files.map((file, index) => ({
		imageId: `img_${String(index + 1).padStart(3, '0')}`,
		fileName: file.name,
		file: file,
		status: 'queued', // 'queued' | 'analyzing' | 'completed' | 'error'
		result: null,
		error: null
	}));

	return {
		sessionId,
		timestamp,
		totalImages: files.length,
		completedImages: 0,
		failedImages: 0,
		images,
		sessionAggregates: null
	};
}

/**
 * Update image status in session
 * @param {object} session - Session object
 * @param {string} imageId - Image ID to update
 * @param {string} status - New status
 * @param {object} result - Analysis result (optional)
 * @param {Error} error - Error object (optional)
 */
export function updateImageStatus(session, imageId, status, result = null, error = null) {
	const image = session.images.find(img => img.imageId === imageId);
	if (!image) return;

	const oldStatus = image.status;
	image.status = status;
	image.result = result;
	image.error = error;

	// Update session counters
	if (status === 'completed' && oldStatus !== 'completed') {
		session.completedImages++;
	} else if (status === 'error' && oldStatus !== 'error') {
		session.failedImages++;
	}
}

/**
 * Check if session is complete (all images processed)
 * @param {object} session - Session object
 * @returns {boolean}
 */
export function isSessionComplete(session) {
	return (session.completedImages + session.failedImages) === session.totalImages;
}

/**
 * Get session progress (0-100)
 * @param {object} session - Session object
 * @returns {number} Progress percentage
 */
export function getSessionProgress(session) {
	if (session.totalImages === 0) return 100;
	return Math.round(((session.completedImages + session.failedImages) / session.totalImages) * 100);
}

/**
 * Calculate session-level aggregates from all completed image results
 * @param {object} session - Session object
 * @returns {object} Session aggregates
 */
export function calculateSessionAggregates(session) {
	const completedImages = session.images.filter(img => img.status === 'completed' && img.result);
	
	let totalDetections = 0;
	let totalSafetyIssues = 0;
	const safetyBySeverity = { high: 0, medium: 0, low: 0 };
	const countsByCategory = {};
	const countsByLabel = {};
	const imagesSafety = [];

	for (const image of completedImages) {
		const result = image.result;
		const detections = Array.isArray(result.detections) ? result.detections : [];
		
		totalDetections += detections.length;

		// Count by category
		for (const det of detections) {
			const category = det.category || 'other';
			countsByCategory[category] = (countsByCategory[category] || 0) + 1;

			const label = det.label || 'unknown';
			countsByLabel[label] = (countsByLabel[label] || 0) + 1;

			// Track safety issues
			if (category === 'safety_issue') {
				totalSafetyIssues++;
				const severity = det.safety?.severity || 'low';
				safetyBySeverity[severity] = (safetyBySeverity[severity] || 0) + 1;
			}
		}

		// Per-image safety summary
		const imageSafetyIssues = detections.filter(d => d.category === 'safety_issue');
		const maxSeverity = imageSafetyIssues.reduce((max, det) => {
			const severity = det.safety?.severity || 'low';
			const order = { high: 3, medium: 2, low: 1 };
			return (order[severity] || 0) > (order[max] || 0) ? severity : max;
		}, 'none');

		imagesSafety.push({
			imageId: image.imageId,
			fileName: image.fileName,
			detectionsCount: detections.length,
			safetyCount: imageSafetyIssues.length,
			maxSeverity: imageSafetyIssues.length > 0 ? maxSeverity : 'none'
		});
	}

	// Sort and format
	const countsByCategorySorted = Object.entries(countsByCategory)
		.map(([category, count]) => ({ category, count }))
		.sort((a, b) => b.count - a.count);

	const countsByLabelSorted = Object.entries(countsByLabel)
		.map(([label, count]) => ({ label, count }))
		.sort((a, b) => b.count - a.count);

	return {
		totalDetections,
		totalSafetyIssues,
		safetyBySeverity,
		countsByCategory: countsByCategorySorted,
		countsByLabel: countsByLabelSorted,
		imagesSafety
	};
}

/**
 * Export session summary as CSV
 * @param {object} session - Session object with aggregates
 * @returns {string} CSV content
 */
export function exportSessionCSV(session) {
	if (!session.sessionAggregates) {
		throw new Error('Session aggregates not calculated');
	}

	const lines = [];
	
	// Header
	lines.push('Image,File Name,Detections,Safety Issues,High,Medium,Low,Status');

	// Per-image rows
	for (const imageSummary of session.sessionAggregates.imagesSafety) {
		const image = session.images.find(img => img.imageId === imageSummary.imageId);
		if (!image) continue;

		const result = image.result;
		const detections = Array.isArray(result?.detections) ? result.detections : [];
		const safetyIssues = detections.filter(d => d.category === 'safety_issue');

		const safetyBySev = { high: 0, medium: 0, low: 0 };
		for (const det of safetyIssues) {
			const severity = det.safety?.severity || 'low';
			safetyBySev[severity]++;
		}

		const imageNum = parseInt(imageSummary.imageId.replace('img_', ''), 10);
		const fileName = csvEscape(imageSummary.fileName);
		const status = image.status === 'completed' ? 'Completed' : 'Error';

		lines.push(
			`${imageNum},${fileName},${imageSummary.detectionsCount},${imageSummary.safetyCount},${safetyBySev.high},${safetyBySev.medium},${safetyBySev.low},${status}`
		);
	}

	// Failed images
	for (const image of session.images) {
		if (image.status === 'error') {
			const imageNum = parseInt(image.imageId.replace('img_', ''), 10);
			const fileName = csvEscape(image.fileName);
			const errorMsg = csvEscape(image.error?.message || 'Unknown error');
			lines.push(`${imageNum},${fileName},0,0,0,0,0,Error: ${errorMsg}`);
		}
	}

	// Summary rows
	lines.push('');
	lines.push('Session Summary');
	lines.push(`Total Images,${session.totalImages}`);
	lines.push(`Completed,${session.completedImages}`);
	lines.push(`Failed,${session.failedImages}`);
	lines.push(`Total Detections,${session.sessionAggregates.totalDetections}`);
	lines.push(`Total Safety Issues,${session.sessionAggregates.totalSafetyIssues}`);
	lines.push(`High Severity,${session.sessionAggregates.safetyBySeverity.high}`);
	lines.push(`Medium Severity,${session.sessionAggregates.safetyBySeverity.medium}`);
	lines.push(`Low Severity,${session.sessionAggregates.safetyBySeverity.low}`);

	return lines.join('\n');
}

/**
 * Export session as JSON
 * @param {object} session - Session object with aggregates
 * @returns {string} JSON content
 */
export function exportSessionJSON(session) {
	// Create a clean export object (remove File objects)
	const exportData = {
		sessionId: session.sessionId,
		timestamp: session.timestamp,
		totalImages: session.totalImages,
		completedImages: session.completedImages,
		failedImages: session.failedImages,
		images: session.images.map(img => ({
			imageId: img.imageId,
			fileName: img.fileName,
			status: img.status,
			result: img.result,
			error: img.error ? { message: img.error.message } : null
		})),
		sessionAggregates: session.sessionAggregates
	};

	return JSON.stringify(exportData, null, 2);
}

/**
 * Helper to escape CSV values
 * @param {string} value - Value to escape
 * @returns {string} Escaped value
 */
function csvEscape(value) {
	if (value == null) return '';
	const str = String(value);
	if (str.includes(',') || str.includes('"') || str.includes('\n')) {
		return `"${str.replace(/"/g, '""')}"`;
	}
	return str;
}
