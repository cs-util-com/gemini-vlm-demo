/* istanbul ignore file */

import { escapeHtml } from './ui-utils.js';

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
	const aggregateCharts = renderSessionAggregateCharts(agg);
	const progressSummary = agg.progressSummary || {
		totalEntries: 0,
		averagePercent: null,
		byImage: [],
		phaseCounts: []
	};
	const overallProgressPercent = Number.isFinite(progressSummary.averagePercent)
		? Math.round(progressSummary.averagePercent)
		: null;
	const globalInsights = collectSessionGlobalInsights(session);
	const insightsPanel = renderSessionGlobalInsights(globalInsights.filter(insight => insight.category !== 'progress'));
	const progressPanel = renderSessionProgressPanel(progressSummary);

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
				${progressSummary.totalEntries > 0 || Number.isFinite(progressSummary.averagePercent) ? `
				<div class="summary-card">
					<div class="summary-card-value">${overallProgressPercent != null ? `${overallProgressPercent}%` : '—'}</div>
					<div class="summary-card-label">Overall Progress</div>
				</div>
				` : ''}
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
			${progressPanel}
			${aggregateCharts}
			${insightsPanel}

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
export function renderImageSectionHeader(imageId, fileName, imageNumber, options = {}) {
	const { asSummary = false, status = 'completed', detectionCount = null } = options;
	const statusLabel = statusLabelFor(status);
	const detectionMeta = typeof detectionCount === 'number' ? `${detectionCount} detections` : null;
	const metaParts = [statusLabel, detectionMeta].filter(Boolean);
	const metaText = metaParts.length > 0 ? metaParts.join(' • ') : '';
	const title = `🖼️ Image ${imageNumber}: ${escapeHtml(fileName)}`;

	if (asSummary) {
		return `
			<summary class="image-section-header" data-image-id="${imageId}">
				<span class="image-section-title">${title}</span>
				${metaText ? `<span class="image-section-meta">${escapeHtml(metaText)}</span>` : ''}
			</summary>
		`;
	}

	return `
		<div class="image-section-header" id="image-section-${imageId}" data-image-id="${imageId}">
			<span class="image-section-title">${title}</span>
			${metaText ? `<span class="image-section-meta">${escapeHtml(metaText)}</span>` : ''}
		</div>
	`;
}

function renderSessionAggregateCharts(agg) {
	const hasCategory = Array.isArray(agg.countsByCategory) && agg.countsByCategory.length > 0;
	const hasLabel = Array.isArray(agg.countsByLabel) && agg.countsByLabel.length > 0;
	if (!hasCategory && !hasLabel) return '';

	let html = '<div class="session-aggregate-panel">';
	if (hasCategory) {
		html += '<h3 class="session-panel-title">Detections by Category</h3>';
		const max = Math.max(...agg.countsByCategory.map(item => item.count));
		html += '<div class="aggregate-chart">';
		html += agg.countsByCategory.map(item => {
			const width = max > 0 ? (item.count / max) * 100 : 0;
			const label = escapeHtml(item.category.replace(/_/g, ' '));
			return `
				<div class="aggregate-bar">
					<div class="aggregate-bar-header">
						<span class="aggregate-bar-label">${label}</span>
						<span class="aggregate-bar-count">${item.count}</span>
					</div>
					<div class="aggregate-bar-bg">
						<div class="aggregate-bar-fill category-${escapeHtml(item.category)}" style="width:${width}%">${item.count}</div>
					</div>
				</div>
			`;
		}).join('');
		html += '</div>';
	}

	if (hasLabel) {
		html += '<h3 class="session-panel-title" style="margin-top:20px;">Top Labels (Session)</h3>';
		const topLabels = agg.countsByLabel.slice(0, 10);
		const max = Math.max(...topLabels.map(item => item.count));
		html += '<div class="aggregate-chart">';
		html += topLabels.map(item => {
			const width = max > 0 ? (item.count / max) * 100 : 0;
			return `
				<div class="aggregate-bar">
					<div class="aggregate-bar-header">
						<span class="aggregate-bar-label">${escapeHtml(item.label)}</span>
						<span class="aggregate-bar-count">${item.count}</span>
					</div>
					<div class="aggregate-bar-bg">
						<div class="aggregate-bar-fill category-other" style="width:${width}%; background:#4a4aff;">${item.count}</div>
					</div>
				</div>
			`;
		}).join('');
		html += '</div>';
	}

	return `${html}</div>`;
}

function renderSessionProgressPanel(progressSummary) {
	if (!progressSummary) return '';
	const hasPercent = Number.isFinite(progressSummary.averagePercent);
	const roundedPercent = hasPercent ? Math.round(progressSummary.averagePercent) : null;
	const barWidth = hasPercent ? Math.max(0, Math.min(100, roundedPercent)) : 0;
	const imageChips = Array.isArray(progressSummary.byImage)
		? progressSummary.byImage
			.filter(img => Number.isFinite(img.averagePercent))
			.slice(0, 4)
			.map(img => {
				const pct = Math.round(img.averagePercent);
				return `<span class="session-progress-chip" data-image-id="${img.imageId}">Image ${img.imageNumber} • ${pct}%</span>`;
			})
			.join('')
		: '';
	const phaseTags = Array.isArray(progressSummary.phaseCounts)
		? progressSummary.phaseCounts.slice(0, 4).map(phase => `<span class="session-progress-phase">${escapeHtml(phase.name)} (${phase.count})</span>`).join(' ')
		: '';

	if (!hasPercent && !phaseTags && !imageChips) {
		return '';
	}

	return `
		<div class="session-progress-panel">
			<div class="session-progress-header">
				<span class="session-panel-title">Overall Progress</span>
				<span class="session-progress-value">${hasPercent ? `${roundedPercent}% complete` : 'Progress signals detected'}</span>
			</div>
			<div class="session-progress-bar-bg">
				<div class="session-progress-bar-fill" style="width:${barWidth}%"></div>
			</div>
			${phaseTags ? `<div class="session-progress-phases">Top phases: ${phaseTags}</div>` : ''}
			${imageChips ? `<div class="session-progress-images">${imageChips}</div>` : ''}
		</div>
	`;
}

function collectSessionGlobalInsights(session) {
	const insights = [];
	if (!session || !Array.isArray(session.images)) return insights;

	session.images.forEach((img, idx) => {
		if (img.status !== 'completed' || !img.result) return;
		const list = Array.isArray(img.result.global_insights) ? img.result.global_insights : [];
		const imageNumber = idx + 1;
		list.forEach(insight => {
			insights.push({
				...insight,
				imageNumber,
				imageId: img.imageId,
				fileName: img.fileName
			});
		});
	});

	return insights.sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0));
}

function renderSessionGlobalInsights(insights) {
	if (!Array.isArray(insights) || insights.length === 0) return '';

	const cards = insights.map(insight => {
		const confidence = typeof insight.confidence === 'number' ? (insight.confidence * 100).toFixed(0) : '?';
		const metricsHtml = Array.isArray(insight.metrics) && insight.metrics.length > 0
			? `<div class="insight-metrics">${insight.metrics.map(metric => {
				const unit = metric.unit ? ` ${escapeHtml(metric.unit)}` : '';
				return `
					<div class="insight-metric">
						<span class="insight-metric-key">${escapeHtml(metric.key)}:</span>
						<span class="insight-metric-value">${escapeHtml(String(metric.value))}${unit}</span>
					</div>
				`;
			}).join('')}</div>`
			: '';

		const label = insight.name || (Array.isArray(insight.labels) ? insight.labels[0] : '') || `Insight`;
		const source = `Image ${insight.imageNumber}: ${escapeHtml(insight.fileName)}`;
		return `
			<div class="session-insight-card" data-image-id="${insight.imageId}">
				<div class="session-insight-header">
					<span class="session-insight-title">${escapeHtml(label)}</span>
					<span class="session-insight-meta">${escapeHtml(source)}</span>
				</div>
				<div class="session-insight-desc">${escapeHtml(insight.description || '')}</div>
				<div class="session-insight-confidence">Confidence: ${confidence}%</div>
				${metricsHtml}
			</div>
		`;
	}).join('');

	return `
		<div class="session-global-insights">
			<h3 class="session-panel-title">Global Insights Across Session</h3>
			<div class="session-insight-grid">${cards}</div>
		</div>
	`;
}

function statusLabelFor(status) {
	switch (status) {
		case 'completed':
			return 'Completed';
		case 'analyzing':
			return 'Analyzing';
		case 'error':
			return 'Error';
		case 'queued':
			return 'Queued';
		default:
			return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
	}
}
