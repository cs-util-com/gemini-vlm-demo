/**
 * CSV and JSON export utilities for session data
 */

/**
 * Export session data as JSON
 * @param {object} session - Session state with aggregates
 * @returns {string} JSON string
 */
export function exportSessionJSON(session) {
	const timestamp = new Date().toISOString();
	const progress = getProgressCounts(session);

	const exportData = {
		sessionId: session.sessionId,
		timestamp,
		totalImages: session.images.length,
		imagesAnalyzed: progress.completed,
		imagesError: progress.error,
		sessionAggregates: session.sessionAggregates,
		images: session.images
			.filter(img => img.status === 'completed')
			.map(img => ({
				imageId: img.id,
				filename: img.filename,
				status: img.status,
				width: img.naturalWidth,
				height: img.naturalHeight,
				detections: img.detections,
				global_insights: img.parsedData?.global_insights || []
			}))
	};

	return JSON.stringify(exportData, null, 2);
}

/**
 * Export session data as CSV
 * @param {object} session - Session state with aggregates
 * @returns {string} CSV string
 */
export function exportSessionCSV(session) {
	const rows = [];
	
	// Header row
	rows.push([
		'SessionID',
		'ImageID',
		'ImageName',
		'DetectionID',
		'Label',
		'Category',
		'Confidence',
		'SafetySeverity',
		'SafetyRule',
		'ProgressPhase',
		'ProgressPercent'
	].join(','));

	// Data rows
	session.images.forEach(img => {
		if (img.status === 'completed' && img.detections) {
			img.detections.forEach(det => {
				const row = [
					escapeCsvField(session.sessionId),
					escapeCsvField(img.id),
					escapeCsvField(img.filename),
					escapeCsvField(det.id || ''),
					escapeCsvField(det.label || ''),
					escapeCsvField(det.category || ''),
					det.confidence != null ? det.confidence.toFixed(4) : '',
					det.safety?.severity ? escapeCsvField(det.safety.severity) : '',
					det.safety?.rule ? escapeCsvField(det.safety.rule) : '',
					det.progress?.phase ? escapeCsvField(det.progress.phase) : '',
					det.progress?.percentComplete != null ? det.progress.percentComplete.toFixed(2) : ''
				];
				rows.push(row.join(','));
			});
		}
	});

	return rows.join('\n');
}

/**
 * Download exported data as a file
 * @param {string} content - File content
 * @param {string} filename - Suggested filename
 * @param {string} mimeType - MIME type
 */
export function downloadFile(content, filename, mimeType) {
	const blob = new Blob([content], { type: mimeType });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

/**
 * Escape CSV field value
 * @param {string} value - Field value
 * @returns {string} Escaped value
 */
function escapeCsvField(value) {
	if (value == null) return '';
	const str = String(value);
	if (str.includes(',') || str.includes('"') || str.includes('\n')) {
		return `"${str.replace(/"/g, '""')}"`;
	}
	return str;
}

/**
 * Get progress counts helper
 * @param {object} session - Session state
 * @returns {object} Progress counts
 */
function getProgressCounts(session) {
	const completed = session.images.filter(img => img.status === 'completed').length;
	const error = session.images.filter(img => img.status === 'error').length;
	return { completed, error };
}
