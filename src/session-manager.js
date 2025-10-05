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
    file,
    status: 'queued',
    result: null,
    error: null,
  }));

  return {
    sessionId,
    timestamp,
    totalImages: files.length,
    completedImages: 0,
    failedImages: 0,
    images,
    sessionAggregates: null,
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
export function updateImageStatus(
  session,
  imageId,
  status,
  result = null,
  error = null
) {
  const image = session.images.find((img) => img.imageId === imageId);
  if (!image) return;

  const oldStatus = image.status;
  image.status = status;
  image.result = result;
  image.error = error;

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
  return session.completedImages + session.failedImages === session.totalImages;
}

/**
 * Get session progress (0-100)
 * @param {object} session - Session object
 * @returns {number} Progress percentage
 */
export function getSessionProgress(session) {
  if (session.totalImages === 0) return 100;
  return Math.round(
    ((session.completedImages + session.failedImages) / session.totalImages) *
      100
  );
}

const SAFETY_SEVERITIES = Object.freeze(['high', 'medium', 'low']);
const CSV_HEADER =
  'Image,File Name,Detections,Safety Issues,High,Medium,Low,Status';

/**
 * Calculate session-level aggregates from all completed image results
 * @param {object} session - Session object
 * @returns {object} Session aggregates
 */
export function calculateSessionAggregates(session) {
  const state = createAggregateState();
  if (!session || !Array.isArray(session.images)) {
    return finalizeAggregateState(state);
  }

  session.images.forEach((image) => {
    if (!isCompletedImage(image)) return;
    const imageNumber = parseImageNumber(image.imageId);
    processCompletedImage(state, image, imageNumber);
  });

  return finalizeAggregateState(state);
}

function createAggregateState() {
  return {
    totalDetections: 0,
    totalSafetyIssues: 0,
    safetyBySeverity: { high: 0, medium: 0, low: 0 },
    countsByCategory: new Map(),
    countsByLabel: new Map(),
    imagesSafety: [],
    progressEntries: [],
    progressByImage: new Map(),
    progressSourceCounts: {},
    phaseCounts: new Map(),
  };
}

function isCompletedImage(image) {
  return Boolean(image && image.status === 'completed' && image.result);
}

function processCompletedImage(state, image, imageNumber) {
  const detections = Array.isArray(image.result?.detections)
    ? image.result.detections
    : [];
  state.totalDetections += detections.length;

  const severityCounts = initializeSeverityCounts();
  for (const detection of detections) {
    tallyDetection(state, detection, severityCounts);
  }

  state.imagesSafety.push(
    buildImageSafetySummary(image, detections.length, severityCounts)
  );
  updateProgressFromDetections(state, detections, image, imageNumber);
  updateProgressFromInsights(state, image, imageNumber);
}

function initializeSeverityCounts() {
  return { high: 0, medium: 0, low: 0 };
}

function tallyDetection(state, detection, severityCounts) {
  const category = registerDetectionCategory(state, detection);
  incrementCount(state.countsByLabel, detection?.label || 'unknown');
  if (category === 'safety_issue') {
    applySafetyCounters(state, detection, severityCounts);
  }
}

function registerDetectionCategory(state, detection) {
  const category = detection?.category || 'other';
  incrementCount(state.countsByCategory, category);
  return category;
}

function applySafetyCounters(state, detection, severityCounts) {
  state.totalSafetyIssues += 1;
  const severity = normalizeSeverity(detection?.safety?.severity);
  state.safetyBySeverity[severity] =
    (state.safetyBySeverity[severity] || 0) + 1;
  severityCounts[severity] = (severityCounts[severity] || 0) + 1;
}

function normalizeSeverity(value) {
  return SAFETY_SEVERITIES.includes(value) ? value : 'low';
}

function buildImageSafetySummary(image, detectionsCount, severityCounts) {
  const normalized = normalizeSeverityCounts(severityCounts);
  const safetyCount = SAFETY_SEVERITIES.reduce(
    (sum, key) => sum + normalized[key],
    0
  );
  return {
    imageId: image.imageId,
    fileName: image.fileName,
    detectionsCount,
    safetyCount,
    maxSeverity: safetyCount > 0 ? determineMaxSeverity(normalized) : 'none',
    severityCounts: normalized,
  };
}

function normalizeSeverityCounts(counts) {
  const normalized = { high: 0, medium: 0, low: 0 };
  for (const key of SAFETY_SEVERITIES) {
    const value = counts[key];
    normalized[key] = Number.isFinite(value) && value > 0 ? value : 0;
  }
  return normalized;
}

function determineMaxSeverity(severityCounts) {
  for (const key of SAFETY_SEVERITIES) {
    if ((severityCounts[key] || 0) > 0) {
      return key;
    }
  }
  return 'none';
}

function finalizeAggregateState(state) {
  const countsByCategory = mapToSortedArray(state.countsByCategory, 'category');
  const countsByLabel = mapToSortedArray(state.countsByLabel, 'label');
  const progressByImage = buildProgressByImageList(state.progressByImage);
  const progressSummary = buildProgressSummary(
    state.progressEntries,
    progressByImage,
    state.phaseCounts,
    state.progressSourceCounts
  );

  return {
    totalDetections: state.totalDetections,
    totalSafetyIssues: state.totalSafetyIssues,
    safetyBySeverity: state.safetyBySeverity,
    countsByCategory,
    countsByLabel,
    imagesSafety: state.imagesSafety,
    progressSummary,
  };
}

function mapToSortedArray(map, labelKey) {
  return Array.from(map.entries())
    .map(([key, count]) => ({ [labelKey]: key, count }))
    .sort((a, b) => b.count - a.count);
}

function buildProgressByImageList(progressByImage) {
  return Array.from(progressByImage.values())
    .map((entry) => {
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
        phases: Array.from(entry.phases),
      };
    })
    .sort((a, b) => {
      const aVal = Number.isFinite(a.averagePercent)
        ? a.averagePercent
        : -Infinity;
      const bVal = Number.isFinite(b.averagePercent)
        ? b.averagePercent
        : -Infinity;
      return bVal - aVal;
    });
}

function buildProgressSummary(
  entries,
  progressByImage,
  phaseCounts,
  sourceCounts
) {
  const totalEntries = entries.length;
  const averagePercent =
    totalEntries > 0
      ? entries.reduce((sum, entry) => sum + entry.percent, 0) / totalEntries
      : null;
  const topEntry =
    totalEntries > 0
      ? entries.reduce(
          (max, entry) => (entry.percent > max.percent ? entry : max),
          entries[0]
        )
      : null;
  const bottomEntry =
    totalEntries > 0
      ? entries.reduce(
          (min, entry) => (entry.percent < min.percent ? entry : min),
          entries[0]
        )
      : null;
  const phaseCountsList = Array.from(phaseCounts.values()).sort(
    (a, b) => b.count - a.count
  );
  return {
    totalEntries,
    averagePercent,
    byImage: progressByImage,
    topEntry,
    bottomEntry,
    phaseCounts: phaseCountsList,
    sourceCounts,
  };
}

function incrementCount(map, key) {
  if (key == null) return;
  const normalized = String(key);
  const current = map.get(normalized) || 0;
  map.set(normalized, current + 1);
}

function updateProgressFromDetections(state, detections, image, imageNumber) {
  detections
    .filter((det) => det.category === 'progress' && det.progress)
    .forEach((det) => {
      const percent =
        det.progress.percentComplete ?? det.progress.percent ?? null;
      const phase = det.progress.phase || det.label;
      registerProgressEntry(state, {
        image,
        imageNumber,
        percent,
        label: det.label,
        phase,
        source: 'detection',
      });
    });
}

function updateProgressFromInsights(state, image, imageNumber) {
  const insights = Array.isArray(image.result?.global_insights)
    ? image.result.global_insights
    : [];
  insights
    .filter((insight) => insight && insight.category === 'progress')
    .forEach((insight) => {
      const percent = extractPercentFromInsight(insight);
      const label =
        insight.name ||
        (Array.isArray(insight.labels) && insight.labels[0]) ||
        'Progress insight';
      const phase = insight.phase || insight.progress?.phase || label;
      registerProgressEntry(state, {
        image,
        imageNumber,
        percent,
        label,
        phase,
        source: 'insight',
      });
    });
}

function extractPercentFromInsight(insight) {
  if (!insight) return null;
  if (typeof insight.percentComplete === 'number') {
    return insight.percentComplete;
  }
  if (!Array.isArray(insight.metrics)) return null;
  const metric = insight.metrics.find((item) => {
    if (!item || typeof item.value !== 'number' || !item.key) return false;
    const key = String(item.key).toLowerCase();
    return key.includes('percent') || key.includes('complete');
  });
  return metric ? metric.value : null;
}

function registerProgressEntry(
  state,
  { image, imageNumber, percent, label, phase, source }
) {
  if (phase) {
    incrementPhaseCount(state.phaseCounts, phase);
  }
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
    phase: phase ? String(phase).trim() : null,
    source,
  };
  state.progressEntries.push(entry);
  state.progressSourceCounts[source] =
    (state.progressSourceCounts[source] || 0) + 1;

  const perImage = ensureProgressImageBucket(
    state.progressByImage,
    image,
    imageNumber
  );
  perImage.percents.push(normalizedPercent);
  if (entry.phase) {
    perImage.phases.add(entry.phase);
  }
}

function ensureProgressImageBucket(progressByImage, image, imageNumber) {
  let bucket = progressByImage.get(image.imageId);
  if (!bucket) {
    bucket = {
      imageId: image.imageId,
      fileName: image.fileName,
      imageNumber,
      percents: [],
      phases: new Set(),
    };
    progressByImage.set(image.imageId, bucket);
  }
  return bucket;
}

function incrementPhaseCount(phaseCounts, phase) {
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
}

function normalizePercent(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  let percent = value;
  if (percent <= 1 && percent > 0) {
    percent *= 100;
  }
  percent = Math.max(0, Math.min(100, percent));
  return percent;
}

function parseImageNumber(imageId) {
  const numeric = Number.parseInt(String(imageId).replace('img_', ''), 10);
  return Number.isFinite(numeric) ? numeric : imageId;
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

  const aggregates = session.sessionAggregates;
  const rows = [CSV_HEADER];
  rows.push(...buildCompletedImageRows(session, aggregates));
  rows.push(...buildFailedImageRows(session.images));
  rows.push('');
  rows.push('Session Summary');
  rows.push(...buildSessionSummaryRows(session, aggregates));
  rows.push(...buildSeveritySummaryRows(aggregates));
  return rows.join('\n');
}

function buildCompletedImageRows(session, aggregates) {
  return aggregates.imagesSafety.flatMap((summary) => {
    const image = session.images.find((img) => img.imageId === summary.imageId);
    if (!image) return [];
    const counts = summarizeSeverityCounts(summary);
    const imageNum = parseImageNumber(summary.imageId);
    const fileName = csvEscape(summary.fileName);
    const status = image.status === 'completed' ? 'Completed' : 'Error';
    return [
      `${imageNum},${fileName},${summary.detectionsCount},${summary.safetyCount},${counts.high},${counts.medium},${counts.low},${status}`,
    ];
  });
}

function summarizeSeverityCounts(summary) {
  const counts = summary?.severityCounts || {};
  return {
    high: counts.high || 0,
    medium: counts.medium || 0,
    low: counts.low || 0,
  };
}

function buildFailedImageRows(images) {
  return images
    .filter((image) => image.status === 'error')
    .map((image) => {
      const imageNum = parseImageNumber(image.imageId);
      const fileName = csvEscape(image.fileName);
      const errorMsg = csvEscape(image.error?.message || 'Unknown error');
      return `${imageNum},${fileName},0,0,0,0,0,Error: ${errorMsg}`;
    });
}

function buildSessionSummaryRows(session, aggregates) {
  return [
    `Total Images,${session.totalImages}`,
    `Completed,${session.completedImages}`,
    `Failed,${session.failedImages}`,
    `Total Detections,${aggregates.totalDetections}`,
    `Total Safety Issues,${aggregates.totalSafetyIssues}`,
  ];
}

function buildSeveritySummaryRows(aggregates) {
  return [
    `High Severity,${aggregates.safetyBySeverity.high}`,
    `Medium Severity,${aggregates.safetyBySeverity.medium}`,
    `Low Severity,${aggregates.safetyBySeverity.low}`,
  ];
}

/**
 * Export session as JSON
 * @param {object} session - Session object with aggregates
 * @returns {string} JSON content
 */
export function exportSessionJSON(session) {
  const exportData = {
    sessionId: session.sessionId,
    timestamp: session.timestamp,
    totalImages: session.totalImages,
    completedImages: session.completedImages,
    failedImages: session.failedImages,
    images: session.images.map((img) => ({
      imageId: img.imageId,
      fileName: img.fileName,
      status: img.status,
      result: img.result,
      error: img.error ? { message: img.error.message } : null,
      preprocessing: img.preprocessing ?? null,
    })),
    sessionAggregates: session.sessionAggregates,
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
