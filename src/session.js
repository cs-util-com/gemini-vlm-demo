/**
 * Session management for multi-image analysis
 */

/**
 * Create a new analysis session
 * @param {File[]} files - Array of image files (max 20)
 * @returns {object} Initial session state
 */
export function createSession(files) {
	const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
	
	const images = files.map((file, index) => ({
		id: `img_${index}_${file.name.replace(/[^a-zA-Z0-9]/g, '_')}`,
		file,
		filename: file.name,
		status: 'queued',
		bitmap: null,
		naturalWidth: 0,
		naturalHeight: 0,
		parsedData: null,
		detections: [],
		error: null
	}));

	return {
		sessionId,
		status: 'analyzing',
		images,
		activeImageIndex: 0,
		sessionAggregates: null
	};
}

/**
 * Calculate session-level aggregates from all completed images
 * @param {object} session - Session state
 * @returns {object} Aggregated statistics
 */
export function calculateSessionAggregates(session) {
	const completedImages = session.images.filter(img => img.status === 'completed');
	
	let totalDetections = 0;
	const safetyIssues = { high: 0, medium: 0, low: 0 };
	const categoryCounts = {};
	const labelCounts = {};
	const imageStats = [];

	completedImages.forEach(img => {
		const detections = img.detections || [];
		totalDetections += detections.length;

		// Per-image stats
		const imgSafetyCount = detections.filter(d => d.category === 'safety_issue').length;
		const imgProgressCount = detections.filter(d => d.category === 'progress').length;
		
		imageStats.push({
			imageId: img.id,
			filename: img.filename,
			detectionCount: detections.length,
			safetyIssueCount: imgSafetyCount,
			progressItemCount: imgProgressCount,
			status: img.status
		});

		// Aggregate detections
		detections.forEach(det => {
			const category = det.category || 'other';
			const label = det.label || 'unknown';

			// Category counts
			categoryCounts[category] = (categoryCounts[category] || 0) + 1;

			// Label counts
			labelCounts[label] = (labelCounts[label] || 0) + 1;

			// Safety severity counts
			if (det.category === 'safety_issue' && det.safety?.severity) {
				const severity = det.safety.severity.toLowerCase();
				if (severity === 'high' || severity === 'medium' || severity === 'low') {
					safetyIssues[severity]++;
				}
			}
		});
	});

	return {
		totalDetections,
		safetyIssues,
		categoryCounts: Object.entries(categoryCounts)
			.map(([category, count]) => ({ category, count }))
			.sort((a, b) => b.count - a.count),
		labelCounts: Object.entries(labelCounts)
			.map(([label, count]) => ({ label, count }))
			.sort((a, b) => b.count - a.count),
		imageStats
	};
}

/**
 * Update session status based on image states
 * @param {object} session - Session state
 * @returns {string} Updated status
 */
export function updateSessionStatus(session) {
	const statuses = session.images.map(img => img.status);
	const allDone = statuses.every(s => s === 'completed' || s === 'error');
	const anyError = statuses.some(s => s === 'error');
	const anyCompleted = statuses.some(s => s === 'completed');

	if (allDone) {
		return anyError && anyCompleted ? 'partial_failure' : anyError ? 'error' : 'completed';
	}
	return 'analyzing';
}

/**
 * Get progress metrics for the session
 * @param {object} session - Session state
 * @returns {object} Progress information
 */
export function getSessionProgress(session) {
	const total = session.images.length;
	const completed = session.images.filter(img => img.status === 'completed').length;
	const error = session.images.filter(img => img.status === 'error').length;
	const analyzing = session.images.filter(img => img.status === 'analyzing').length;
	const queued = session.images.filter(img => img.status === 'queued').length;

	return {
		total,
		completed,
		error,
		analyzing,
		queued,
		done: completed + error,
		percentage: Math.round(((completed + error) / total) * 100)
	};
}
