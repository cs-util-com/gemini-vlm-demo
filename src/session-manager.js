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
	let totalDetections = 0;
	let totalSafetyIssues = 0;
	const safetyBySeverity = { high: 0, medium: 0, low: 0 };
	const countsByCategory = {};
	const countsByLabel = {};
	const imagesSafety = [];
	const progressEntries = [];
	const progressByImage = new Map();
	const phaseCounts = new Map();
	const progressSourceCounts = { detection: 0, insight: 0 };

	const normalizePercent = (value) => {
		if (typeof value !== 'number' || !Number.isFinite(value)) return null;
		let percent = value;
		if (percent <= 1 && percent > 0) {
			percent = percent * 100;
		}
		if (percent < 0) percent = 0;
		if (percent > 100) percent = 100;
		return percent;
	};

	const incrementPhase = (phase) => {
		if (!phase) return;
		const trimmed = String(phase).trim();
		if (!trimmed) return;
		const key = trimmed.toLowerCase();
		const existing = phaseCounts.get(key);
		if (existing) {
			existing.count += 1;
		} else {
			phaseCounts.set(key, { name: trimmed, count: 1 });
		}
	};

	const registerProgress = ({ image, imageNumber, percent, label, phase, source }) => {
		if (phase) incrementPhase(phase);
		const normalizedPercent = normalizePercent(percent);
		if (normalizedPercent == null) {
			return;
		}

		const entry = {
			imageId: image.imageId,
			fileName: image.fileName,
			imageNumber,
			percent: normalizedPercent,
			label: label || 'Progress',
			phase: phase || null,
			source
		};
		progressEntries.push(entry);
		progressSourceCounts[source] = (progressSourceCounts[source] || 0) + 1;

		let perImage = progressByImage.get(image.imageId);
		if (!perImage) {
			perImage = {
				imageId: image.imageId,
				fileName: image.fileName,
				imageNumber,
				percents: [],
				phases: new Set()
			};
			progressByImage.set(image.imageId, perImage);
		}

		perImage.percents.push(normalizedPercent);
		if (phase) {
			perImage.phases.add(String(phase).trim());
		}
	};

	const extractPercentFromInsight = (insight) => {
		if (!insight) return null;
		if (typeof insight.percentComplete === 'number') {
			return insight.percentComplete;
		}
		if (Array.isArray(insight.metrics)) {
			const metric = insight.metrics.find(metric => {
				if (!metric || typeof metric.value !== 'number' || !metric.key) return false;
				const key = String(metric.key).toLowerCase();
				return key.includes('percent') || key.includes('complete');
			});
			if (metric) {
				return metric.value;
			}
		}
		return null;
	};

	session.images.forEach((image, index) => {
		if (image.status !== 'completed' || !image.result) return;

		const imageNumber = index + 1;
		const result = image.result;
		const detections = Array.isArray(result.detections) ? result.detections : [];

		totalDetections += detections.length;

		for (const det of detections) {
			const category = det.category || 'other';
			countsByCategory[category] = (countsByCategory[category] || 0) + 1;

			const label = det.label || 'unknown';
			countsByLabel[label] = (countsByLabel[label] || 0) + 1;

			if (category === 'safety_issue') {
				totalSafetyIssues++;
				const severity = det.safety?.severity || 'low';
				safetyBySeverity[severity] = (safetyBySeverity[severity] || 0) + 1;
			}

			if (category === 'progress' && det.progress) {
				const percent = det.progress.percentComplete ?? det.progress.percent ?? null;
				const phase = det.progress.phase || det.label;
				registerProgress({
					image,
					imageNumber,
					percent,
					label: det.label,
					phase,
					source: 'detection'
				});
			}
		}

		const insights = Array.isArray(result.global_insights) ? result.global_insights : [];
		const progressInsights = insights.filter(ins => ins && ins.category === 'progress');
		for (const insight of progressInsights) {
			const percent = extractPercentFromInsight(insight);
			const label = insight.name || (Array.isArray(insight.labels) && insight.labels[0]) || 'Progress insight';
			const phase = insight.phase || insight.progress?.phase || label;
			registerProgress({
				image,
				imageNumber,
				percent,
				label,
				phase,
				source: 'insight'
			});
		}

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
	});

	const countsByCategorySorted = Object.entries(countsByCategory)
		.map(([category, count]) => ({ category, count }))
		.sort((a, b) => b.count - a.count);

	const countsByLabelSorted = Object.entries(countsByLabel)
		.map(([label, count]) => ({ label, count }))
		.sort((a, b) => b.count - a.count);

	const progressByImageList = Array.from(progressByImage.values()).map(entry => {
		const count = entry.percents.length;
		const total = entry.percents.reduce((sum, val) => sum + val, 0);
		const average = count > 0 ? total / count : null;
		const max = count > 0 ? Math.max(...entry.percents) : null;
		const min = count > 0 ? Math.min(...entry.percents) : null;
		return {
			imageId: entry.imageId,
			fileName: entry.fileName,
			imageNumber: entry.imageNumber,
			averagePercent: average,
			maxPercent: max,
			minPercent: min,
			phases: Array.from(entry.phases)
		};
	}).sort((a, b) => {
		const aVal = Number.isFinite(a.averagePercent) ? a.averagePercent : -Infinity;
		const bVal = Number.isFinite(b.averagePercent) ? b.averagePercent : -Infinity;
		return bVal - aVal;
	});

	const averageProgress = progressEntries.length > 0
		? progressEntries.reduce((sum, entry) => sum + entry.percent, 0) / progressEntries.length
		: null;

	const topEntry = progressEntries.length > 0
		? progressEntries.reduce((max, entry) => (entry.percent > max.percent ? entry : max), progressEntries[0])
		: null;

	const bottomEntry = progressEntries.length > 0
		? progressEntries.reduce((min, entry) => (entry.percent < min.percent ? entry : min), progressEntries[0])
		: null;

	const phaseCountsList = Array.from(phaseCounts.values()).sort((a, b) => b.count - a.count);

	const progressSummary = {
		totalEntries: progressEntries.length,
		averagePercent: averageProgress,
		byImage: progressByImageList,
		topEntry,
		bottomEntry,
		phaseCounts: phaseCountsList,
		sourceCounts: progressSourceCounts
	};

	return {
		totalDetections,
		totalSafetyIssues,
		safetyBySeverity,
		countsByCategory: countsByCategorySorted,
		countsByLabel: countsByLabelSorted,
		imagesSafety,
		progressSummary
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
			error: img.error ? { message: img.error.message } : null,
			preprocessing: img.preprocessing ?? null
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
