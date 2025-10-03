/* istanbul ignore file */

/**
 * Render session-level summary report
 */
export function renderSessionSummary(session) {
	if (!session.sessionAggregates) return '';

	const agg = session.sessionAggregates;
	const safetyTotal = agg.totalSafetyIssues;
	const safetyHigh = agg.safetyBySeverity.high || 0;
	const safetyMed = agg.safetyBySeverity.medium || 0;
	const safetyLow = agg.safetyBySeverity.low || 0;

	return `
		<div class="session-summary">
			<h2>📊 Session Summary</h2>
			<div class="summary-grid">
				<div class="summary-card">
					<div class="summary-card-value">${session.totalImages}</div>
					<div class="summary-card-label">Total Images</div>
				</div>
				<div class="summary-card">
					<div class="summary-card-value">${session.completedImages}</div>
					<div class="summary-card-label">Successfully Analyzed</div>
				</div>
				<div class="summary-card">
					<div class="summary-card-value">${agg.totalDetections}</div>
					<div class="summary-card-label">Total Detections</div>
				</div>
				<div class="summary-card">
					<div class="summary-card-value" style="color:${safetyTotal > 0 ? '#ff4444' : '#44ff88'}">${safetyTotal}</div>
					<div class="summary-card-label">Safety Issues</div>
				</div>
			</div>

			${safetyTotal > 0 ? `
				<div style="margin-top:16px; padding:12px; background:#1a0f0f; border:1px solid #4a2020; border-radius:8px;">
					<div style="font-weight:600; margin-bottom:8px; color:#ff4444;">Safety Issues Breakdown</div>
					<div style="display:flex; gap:16px; flex-wrap:wrap;">
						<div><span style="color:#ff4444; font-weight:600;">${safetyHigh}</span> High</div>
						<div><span style="color:#ffaa44; font-weight:600;">${safetyMed}</span> Medium</div>
						<div><span style="color:#ffdd44; font-weight:600;">${safetyLow}</span> Low</div>
					</div>
				</div>
			` : ''}

			${renderImagesSafetyHeatmap(agg.imagesSafety)}

			<div class="export-buttons">
				<button class="export-btn" id="exportCSV">📥 Export CSV</button>
				<button class="export-btn" id="exportJSON">📥 Export JSON</button>
			</div>
		</div>
	`;
}

/**
 * Render heatmap of images with safety issues
 */
function renderImagesSafetyHeatmap(imagesSafety) {
	if (!imagesSafety || imagesSafety.length === 0) return '';

	const imagesWithSafety = imagesSafety.filter(img => img.safetyCount > 0);
	if (imagesWithSafety.length === 0) return '';

	const chips = imagesWithSafety.map(img => {
		const icon = img.maxSeverity === 'high' ? '🔴' : img.maxSeverity === 'medium' ? '🟡' : '🟢';
		const imageNum = parseInt(img.imageId.replace('img_', ''), 10);
		return `<span class="safety-image-chip" data-image-id="${img.imageId}" style="display:inline-block; padding:6px 10px; background:#141420; border:1px solid #2a2a3b; border-radius:6px; margin:4px; font-size:12px; cursor:pointer; transition:transform 0.15s, box-shadow 0.15s;">${icon} Image ${imageNum} (${img.safetyCount})</span>`;
	}).join('');

	return `
		<div style="margin-top:16px; padding:12px; background:#141420; border:1px solid #2a2a3b; border-radius:8px;">
			<div style="font-weight:600; margin-bottom:8px; color:#cfd5e4;">Images with Safety Issues</div>
			<div>${chips}</div>
		</div>
	`;
}

/**
 * Render section header for individual image results
 */
export function renderImageSectionHeader(imageId, fileName, imageNumber) {
	return `
		<div class="image-section-header" id="image-section-${imageId}">
			<span>🖼️ Image ${imageNumber}: ${escapeHtml(fileName)}</span>
		</div>
	`;
}

function escapeHtml(text) {
	const div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}
