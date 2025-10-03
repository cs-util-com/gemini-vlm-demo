/* istanbul ignore file */

/**
 * Calculate aggregates from detections (client-side to prevent LLM hallucination)
 */
export function calculateAggregates(detections) {
	const countsByLabel = {};
	const countsByCategory = {};

	for (const det of detections) {
		const label = det.label || 'unknown';
		const category = det.category || 'other';

		countsByLabel[label] = (countsByLabel[label] || 0) + 1;
		countsByCategory[category] = (countsByCategory[category] || 0) + 1;
	}

	return {
		countsByLabel: Object.entries(countsByLabel)
			.map(([label, count]) => ({ label, count }))
			.sort((a, b) => b.count - a.count),
		countsByCategory: Object.entries(countsByCategory)
			.map(([category, count]) => ({ category, count }))
			.sort((a, b) => b.count - a.count)
	};
}

/**
 * Render the interactive report UI
 */
export function renderReportUI(data) {
	const detections = Array.isArray(data.detections) ? data.detections : [];
	const insights = Array.isArray(data.global_insights) ? data.global_insights : [];
	const aggregates = calculateAggregates(detections);
	const preprocessing = data?.image?.preprocessing;

	// Separate safety issues and progress items
	const safetyIssues = detections.filter(d => d.category === 'safety_issue');
	const progressItems = detections.filter(d => d.category === 'progress' && d.progress);

	let html = '';

	if (preprocessing) {
		html += renderSection('preprocessing', '🖼️ Image Preprocessing', renderPreprocessing(preprocessing), false);
	}

	// Safety Issues Section (if any)
	if (safetyIssues.length > 0) {
		html += renderSection('safety', '🚨 Safety Issues', renderSafetyCards(safetyIssues), false);
	}

	// Progress Section (if any detections or insights)
	const progressInsights = insights.filter(i => i.category === 'progress');
	if (progressItems.length > 0 || progressInsights.length > 0) {
		html += renderSection('progress', '📊 Progress', renderProgressSection(progressItems, progressInsights), true);
	}

	// All Detections Section
	if (detections.length > 0) {
		html += renderSection('detections', '🔍 All Detections', renderDetectionCards(detections), true);
	}

	// Global Insights Section (non-progress)
	const otherInsights = insights.filter(i => i.category !== 'progress');
	if (otherInsights.length > 0) {
		html += renderSection('insights', '💡 Global Insights', renderInsights(otherInsights), true);
	}

	// Aggregates Section
	if (aggregates.countsByLabel.length > 0 || aggregates.countsByCategory.length > 0) {
		html += renderSection('aggregates', '📈 Summary Statistics', renderAggregates(aggregates), true);
	}

	return html;
}

function renderSection(id, title, content, collapsed = false) {
	const collapsedClass = collapsed ? 'collapsed' : '';
	const hiddenClass = collapsed ? 'hidden' : '';
	return `
		<div class="report-section" data-section="${id}">
			<div class="report-header ${collapsedClass}" data-section="${id}">
				<h3><span class="toggle-icon">▼</span> ${title}</h3>
			</div>
			<div class="report-content ${hiddenClass}" data-section="${id}">
				${content}
			</div>
		</div>
	`;
}

function renderPreprocessing(meta) {
	const cards = [];
	const scalePercent = typeof meta.scale === 'number' ? Math.round(meta.scale * 100) : 100;
	const tileLabel = meta.footprint
		? `${meta.footprint.totalTiles} tile${meta.footprint.totalTiles === 1 ? '' : 's'} (${meta.footprint.tilesAcross}×${meta.footprint.tilesDown} grid)`
		: '—';
	const strategyLabel = describeStrategy(meta.strategy, meta.resized);

	if (meta.sourceWidth && meta.sourceHeight) {
		cards.push(renderPreprocessMetric('Original resolution', `${meta.sourceWidth}×${meta.sourceHeight}`));
	}

	if (meta.targetWidth && meta.targetHeight) {
		const note = meta.resized
			? `${scalePercent}% scale • ${strategyLabel}`
			: 'Sent as-is';
		cards.push(renderPreprocessMetric('Sent to Gemini', `${meta.targetWidth}×${meta.targetHeight}`, note));
	}

	cards.push(renderPreprocessMetric('Tile footprint', tileLabel, `${meta.tileSize || 768}px reference`));

	if (typeof meta.estimatedTokens === 'number') {
		cards.push(renderPreprocessMetric('Estimated tokens', meta.estimatedTokens.toLocaleString(), 'Approx. 258 tokens per tile'));
	}

	if (typeof meta.sourceBytes === 'number') {
		cards.push(renderPreprocessMetric('Original file size', formatBytes(meta.sourceBytes), meta.mimeType ? `Original ${meta.mimeType}` : undefined));
	}

	if (typeof meta.targetBytes === 'number') {
		const note = meta.resized ? 'After resize/compression' : 'Original image bytes';
		cards.push(renderPreprocessMetric('Payload bytes sent', formatBytes(meta.targetBytes), note));
	}

	if (meta.compressionRatio != null) {
		const pct = Math.round(meta.compressionRatio * 100);
		cards.push(renderPreprocessMetric('Size vs. original', `${pct}%`, pct < 100 ? 'Compressed before upload' : 'No size savings'));
	}

	let warningsHtml = '';
	if (Array.isArray(meta.warnings) && meta.warnings.length > 0) {
		const items = meta.warnings.map(w => `<li>${escapeHtml(w)}</li>`).join('');
		warningsHtml = `
			<div style="margin-top:16px; padding:12px 16px; border-radius:8px; border:1px solid #513417; background: #24160b; color:#f8b26a;">
				<strong style="display:block; margin-bottom:4px;">Optimization tips</strong>
				<ul style="margin:0; padding-left:20px;">${items}</ul>
			</div>
		`;
	}

	return `
		<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:12px;">
			${cards.join('')}
		</div>
		${warningsHtml}
	`;
}

function renderPreprocessMetric(label, value, note) {
	return `
		<div style="padding:12px 14px; background:#111827; border:1px solid #1f2937; border-radius:8px;">
			<div style="font-size:11px; text-transform:uppercase; letter-spacing:0.12em; color:#9aa0b4;">${escapeHtml(label)}</div>
			<div style="margin-top:6px; font-size:18px; font-weight:600; color:#f9fafb;">${escapeHtml(String(value))}</div>
			${note ? `<div style="margin-top:4px; font-size:12px; color:#9aa0b4;">${escapeHtml(note)}</div>` : ''}
		</div>
	`;
}

function describeStrategy(strategy, resized) {
	if (!resized) return 'No resize applied';
	switch (strategy) {
		case 'downscale-long-side':
			return 'Long side capped to reduce tile count';
		case 'downscale-dual-axis':
			return 'Both dimensions reduced to fit Gemini tile sweet spot';
		case 'downscale-short-side':
			return 'Short side normalized to single-tile target';
		default:
			return 'Resized prior to upload';
	}
}

function formatBytes(bytes) {
	if (!Number.isFinite(bytes) || bytes < 0) {
		return '—';
	}
	if (bytes === 0) {
		return '0 B';
	}
	const units = ['B', 'KB', 'MB', 'GB'];
	const exponent = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
	const value = bytes / (1024 ** exponent);
	return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${units[exponent]}`;
}

function renderSafetyCards(safetyIssues) {
	const cards = safetyIssues.map(det => {
		const severity = det.safety?.severity || 'low';
		const rule = det.safety?.rule || 'No rule specified';
		const confidence = typeof det.confidence === 'number' ? (det.confidence * 100).toFixed(0) : '?';

		return `
			<div class="safety-card severity-${severity}" data-detection-id="${det.id || ''}">
				<span class="safety-badge ${severity}">${severity}</span>
				<div class="safety-card-title">${escapeHtml(det.label)}</div>
				<div class="safety-card-rule">${escapeHtml(rule)}</div>
				<div style="margin-top:8px; font-size:12px; color:#9aa0b4;">Confidence: ${confidence}%</div>
			</div>
		`;
	}).join('');

	return `<div class="safety-grid">${cards}</div>`;
}

function renderProgressSection(progressItems, progressInsights) {
	let html = '';

	// Progress from detections (regional)
	if (progressItems.length > 0) {
		html += '<h4 style="margin:0 0 12px; font-size:14px; color:#9aa0b4;">Regional Progress</h4>';
		progressItems.forEach(det => {
			const phase = det.progress?.phase || 'Unknown phase';
			const percent = det.progress?.percentComplete ?? 0;
			const notes = det.progress?.notes || '';
			const confidence = typeof det.confidence === 'number' ? (det.confidence * 100).toFixed(0) : '?';

			html += `
				<div class="progress-item" data-detection-id="${det.id || ''}">
					<div class="progress-header">
						<span class="progress-label">${escapeHtml(det.label)}: ${escapeHtml(phase)}</span>
						<span class="progress-percent">${percent.toFixed(0)}%</span>
					</div>
					<div class="progress-bar-bg">
						<div class="progress-bar-fill" style="width: ${percent}%"></div>
					</div>
					${notes ? `<div class="progress-notes">${escapeHtml(notes)}</div>` : ''}
					<div class="progress-notes">Confidence: ${confidence}%</div>
				</div>
			`;
		});
	}

	// Progress from global insights
	if (progressInsights.length > 0) {
		if (progressItems.length > 0) {
			html += '<h4 style="margin:20px 0 12px; font-size:14px; color:#9aa0b4;">Overall Progress</h4>';
		}
		progressInsights.forEach(insight => {
			const confidence = typeof insight.confidence === 'number' ? (insight.confidence * 100).toFixed(0) : '?';
			// Try to extract percentage from metrics or description
			let percent = 0;
			if (insight.metrics) {
				const pctMetric = insight.metrics.find(m => m.key.toLowerCase().includes('percent') || m.key.toLowerCase().includes('complete'));
				if (pctMetric) percent = pctMetric.value;
			}

			html += `
				<div class="progress-item">
					<div class="progress-header">
						<span class="progress-label">${escapeHtml(insight.name)}</span>
						${percent > 0 ? `<span class="progress-percent">${percent.toFixed(0)}%</span>` : ''}
					</div>
					${percent > 0 ? `
						<div class="progress-bar-bg">
							<div class="progress-bar-fill" style="width: ${percent}%"></div>
						</div>
					` : ''}
					<div class="progress-notes">${escapeHtml(insight.description)}</div>
					<div class="progress-notes">Confidence: ${confidence}%</div>
				</div>
			`;
		});
	}

	return html || '<p style="color:#9aa0b4;">No progress information available.</p>';
}

function renderDetectionCards(detections) {
        const cards = detections.map(det => {
                const confidence = typeof det.confidence === 'number' ? (det.confidence * 100).toFixed(0) : '?';
                const category = det.category || 'other';
                const categoryLabel = category.replace(/_/g, ' ');
                const colorSwatch = det.visualColor ? `<span class="detection-color-swatch" style="background:${escapeHtml(det.visualColor)};"></span>` : '';

                let attrsHtml = '';
                if (Array.isArray(det.attributes) && det.attributes.length > 0) {
                        attrsHtml = '<dl class="detection-card-attrs">';
                        det.attributes.forEach(attr => {
                                const value = attr.valueNum ?? attr.valueStr ?? attr.valueBool ?? '—';
                                const unit = attr.unit ? ` ${attr.unit}` : '';
                                attrsHtml += `<dt>${escapeHtml(attr.name)}:</dt><dd>${value}${unit}</dd><br>`;
                        });
                        attrsHtml += '</dl>';
                }

                const extras = [];
                if (det.mask) {
                        extras.push('Mask');
                }
                if (Array.isArray(det.points) && det.points.length > 0) {
                        const label = det.points.length === 1 ? '1 point' : `${det.points.length} points`;
                        extras.push(label);
                }
                const extrasHtml = extras.length > 0
                        ? `<div class="detection-card-extras">${extras.map(text => `<span class="detection-extra">${escapeHtml(text)}</span>`).join('')}</div>`
                        : '';

                return `
                        <div class="detection-card category-${category}" data-detection-id="${det.id || ''}">
                                <div class="detection-card-header">
                                        <div class="detection-card-label">${colorSwatch}${escapeHtml(det.label)}</div>
                                        <div class="detection-card-confidence">${confidence}%</div>
                                </div>
                                <div class="detection-card-category">${escapeHtml(categoryLabel)}</div>
                                ${attrsHtml}
                                ${extrasHtml}
                        </div>
                `;
        }).join('');

        return `<div class="detection-grid">${cards}</div>`;
}

function renderInsights(insights) {
	const cards = insights.map(insight => {
		const confidence = typeof insight.confidence === 'number' ? (insight.confidence * 100).toFixed(0) : '?';
		let metricsHtml = '';

		if (Array.isArray(insight.metrics) && insight.metrics.length > 0) {
			metricsHtml = '<div class="insight-metrics">';
			insight.metrics.forEach(metric => {
				const unit = metric.unit ? ` ${metric.unit}` : '';
				metricsHtml += `
					<div class="insight-metric">
						<span class="insight-metric-key">${escapeHtml(metric.key)}:</span>
						<span class="insight-metric-value">${metric.value}${unit}</span>
					</div>
				`;
			});
			metricsHtml += '</div>';
		}

		return `
			<div class="insight-card">
				<div class="insight-card-title">${escapeHtml(insight.name)}</div>
				<div class="insight-card-desc">${escapeHtml(insight.description)}</div>
				<div class="insight-card-confidence">Confidence: ${confidence}%</div>
				${metricsHtml}
			</div>
		`;
	}).join('');

	return cards || '<p style="color:#9aa0b4;">No additional insights available.</p>';
}

function renderAggregates(aggregates) {
	let html = '';

	// By Category
	if (aggregates.countsByCategory.length > 0) {
		html += '<h4 style="margin:0 0 12px; font-size:14px; color:#9aa0b4;">By Category</h4>';
		const maxCount = Math.max(...aggregates.countsByCategory.map(c => c.count));

		aggregates.countsByCategory.forEach(item => {
			const width = (item.count / maxCount) * 100;
			const categoryLabel = item.category.replace(/_/g, ' ');

			html += `
				<div class="aggregate-bar">
					<div class="aggregate-bar-header">
						<span class="aggregate-bar-label">${escapeHtml(categoryLabel)}</span>
						<span class="aggregate-bar-count">${item.count}</span>
					</div>
					<div class="aggregate-bar-bg">
						<div class="aggregate-bar-fill category-${item.category}" style="width: ${width}%">
							${item.count}
						</div>
					</div>
				</div>
			`;
		});
	}

	// By Label
	if (aggregates.countsByLabel.length > 0) {
		html += '<h4 style="margin:20px 0 12px; font-size:14px; color:#9aa0b4;">By Label (Top 10)</h4>';
		const maxCount = Math.max(...aggregates.countsByLabel.map(c => c.count));
		const topLabels = aggregates.countsByLabel.slice(0, 10);

		topLabels.forEach(item => {
			const width = (item.count / maxCount) * 100;

			html += `
				<div class="aggregate-bar">
					<div class="aggregate-bar-header">
						<span class="aggregate-bar-label">${escapeHtml(item.label)}</span>
						<span class="aggregate-bar-count">${item.count}</span>
					</div>
					<div class="aggregate-bar-bg">
						<div class="aggregate-bar-fill category-other" style="width: ${width}%; background:#4a4aff;">
							${item.count}
						</div>
					</div>
				</div>
			`;
		});
	}

	return html;
}

function escapeHtml(text) {
	const div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}

/**
 * Setup interactive event handlers for the report UI
 */
export function setupReportInteractions(reportContainer, detections, onHover, onLeave) {
	// Toggle section collapse (attach once per header)
	reportContainer.querySelectorAll('.report-header').forEach(header => {
		if (header.dataset.toggleBound === 'true') return;
		header.dataset.toggleBound = 'true';

		header.addEventListener('click', () => {
			const sectionEl = header.closest('.report-section');
			const content = sectionEl?.querySelector('.report-content');
			if (!content) return;

			header.classList.toggle('collapsed');
			content.classList.toggle('hidden');
		});
	});

	// Detection card hover interactions (attach once per card)
	reportContainer.querySelectorAll('[data-detection-id]').forEach(card => {
		if (card.dataset.hoverBound === 'true') return;
		const detectionId = card.dataset.detectionId;
		if (!detectionId) return;

		const detection = detections.find(d => String(d.id) === detectionId);
		if (!detection) return;

		card.dataset.hoverBound = 'true';

		card.addEventListener('mouseenter', () => {
			card.classList.add('highlight');
			onHover(detection);
		});

		card.addEventListener('mouseleave', () => {
			card.classList.remove('highlight');
			onLeave(detection);
		});
	});
}
