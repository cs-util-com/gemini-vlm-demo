# Multi-Image Analysis Specification

**Status:** Implementation v1
**Date:** 2024
**Scope:** Extension to support batch analysis of up to 20 images with concurrent processing, progress tracking, and session-level reporting.

---

## 1) Overview

This specification extends the single-image AEC Vision Demo to support batch analysis of multiple images (1-20) from a construction site, enabling comprehensive site-wide understanding through parallel image processing.

---

## 2) Goals & Requirements

### 2.1 Goals
* Enable users to upload and analyze up to 20 images in a single session
* Process images concurrently (hardcoded limit: 10 parallel requests) to optimize analysis time
* Display real-time progress during batch analysis
* Provide session-level aggregated insights across all images
* Export session results as CSV/JSON for external analysis
* Maintain existing single-image functionality and UX patterns

### 2.2 Requirements
* **Concurrency:** 10 parallel API requests (hardcoded)
* **Progress:** Visual progress bar showing analysis state
* **Export:** CSV and JSON download options for session summary
* **Report Timing:** Show report UI only after all images are processed
* **No Persistence:** No localStorage for session state (not needed)

---

## 3) Architecture Updates

### 3.1 Session Concept
* Introduce "session" as a batch analysis run containing 1-20 images
* Each session has:
  - Unique session ID (timestamp-based)
  - Array of image analysis results
  - Session-level aggregated metrics
  - Overall completion state

### 3.2 Data Flow
1. User selects/drops multiple images (validation: max 20)
2. UI creates image thumbnails and initializes session
3. Batch orchestrator queues all images for analysis
4. Process 10 images concurrently, tracking progress for each
5. Collect results as each analysis completes
6. When all complete, compute session aggregates
7. Render session report with summary + per-image sections
8. Enable CSV/JSON export of session data

### 3.3 Modules

#### session-manager.js
* Session state management
* Image result collection
* Session-level aggregate calculations
* Export data formatting (CSV/JSON)

#### batch-orchestrator (in index.js)
* Queue management for image batch
* Concurrency control (limit: 10)
* Progress tracking and UI updates
* Error handling per image (graceful degradation)

---

## 4) UI/UX Enhancements

### 4.1 File Input
* Update dropzone to accept multiple files (max 20)
* Show validation message if >20 files selected
* Display thumbnail gallery of selected images

### 4.2 Progress UI
* Progress bar appears during batch analysis
* Shows: "Analyzing X of Y images..."
* Per-image status indicators: Queued → Analyzing → Done/Error
* Overall progress percentage

### 4.3 Canvas/Viewer
* Thumbnail gallery above canvas
* Click thumbnail to view that image + its overlays
* Keyboard navigation (arrow keys) between images
* Active image highlighted in gallery

### 4.4 Report Structure
```
┌─ Session Summary ─────────────────────┐
│ Total Detections: 247                 │
│ Safety Issues: 15 (High: 3, Med: 8)   │
│ Images Analyzed: 18/20 (2 failed)     │
│ [Export CSV] [Export JSON]            │
└───────────────────────────────────────┘

┌─ Safety Issues Heatmap ───────────────┐
│ Image 1: 🔴🔴  Image 2: -             │
│ Image 3: 🟡   Image 4: 🔴🟡          │
└───────────────────────────────────────┘

┌─ Image 1: site_entrance.jpg ─────────┐
│ [Existing per-image sections]         │
└───────────────────────────────────────┘

┌─ Image 2: scaffold_area.jpg ─────────┐
│ [Existing per-image sections]         │
└───────────────────────────────────────┘
```

### 4.5 Session Summary Cards
* Total detections count across all images
* Safety issues breakdown (high/medium/low) with image references
* Progress indicators showing which images have findings
* Category distribution across session
* Per-image summary table

---

## 5) Data Contract Extensions

### 5.1 Session Schema
```javascript
{
  sessionId: "session_1234567890",
  timestamp: "2024-01-15T10:30:00Z",
  totalImages: 20,
  completedImages: 18,
  failedImages: 2,
  images: [
    {
      imageId: "img_001",
      fileName: "site_entrance.jpg",
      status: "completed", // "queued" | "analyzing" | "completed" | "error"
      result: { /* standard detection result */ },
      error: null
    },
    // ...
  ],
  sessionAggregates: {
    totalDetections: 247,
    totalSafetyIssues: 15,
    safetyBySeverity: { high: 3, medium: 8, low: 4 },
    countsByCategory: { object: 120, facility_asset: 45, safety_issue: 15, progress: 67 },
    countsByLabel: { "worker": 35, "ladder": 12, ... },
    imagesSafety: [
      { imageId: "img_001", fileName: "site_entrance.jpg", safetyCount: 3, maxSeverity: "high" },
      // ...
    ]
  }
}
```

### 5.2 Export Formats

#### CSV Export (Session Summary)
```csv
Image,File Name,Detections,Safety Issues,High,Medium,Low,Status
1,site_entrance.jpg,15,3,1,2,0,Completed
2,scaffold_area.jpg,12,2,0,1,1,Completed
...
```

#### JSON Export
Complete session object with all image results and aggregates

---

## 6) Error Handling

### 6.1 Graceful Degradation
* Individual image failures don't block session completion
* Mark failed images with error state and message
* Include partial results in session summary
* Show retry option per failed image

### 6.2 Validation
* Reject >20 images with user-friendly message
* Warn on very large files (>10MB per image)
* Handle API quota errors gracefully
* Show clear error states in progress UI

---

## 7) Performance Considerations

### 7.1 Concurrency Control
* Hardcoded limit: 10 parallel requests
* Use Promise-based queue with concurrency limiter
* Batch completion triggers report render (not incremental)

### 7.2 Canvas Optimization
* Only render active image + overlays
* Lazy load image bitmaps (load on demand when viewing)
* Clear previous canvas before switching images

### 7.3 Memory Management
* Release ImageBitmap objects for non-active images
* Limit thumbnail resolution (max 200x200px)

---

## 8) Testing Strategy

### 8.1 Unit Tests
* Session manager: aggregate calculations, export formatting
* Batch orchestrator: concurrency control, queue management
* Error handling: partial failures, validation

### 8.2 Integration Tests
* Multi-image upload flow
* Progress tracking accuracy
* Session report rendering with mixed results
* CSV/JSON export correctness

### 8.3 Manual Testing
* Load 20 mixed safety/progress images
* Verify progress bar updates
* Test image navigation (click + keyboard)
* Validate session aggregates accuracy
* Test export downloads
* Verify graceful handling of API failures

---

## 9) Open Questions & Future Enhancements

### 9.1 Resolved
* ✅ CSV/JSON export: Yes, include session-level summary export
* ✅ Concurrency limit: 10 hardcoded (no UI config)
* ✅ localStorage persistence: Not needed for MVP

### 9.2 Future Considerations
* Auto-play mode to cycle through images with safety issues
* Comparative analysis across images (detect changes over time)
* Group images by location/area/floor
* Multi-session history and comparison
* Configurable concurrency based on API quota tier
* Advanced filters (show only images with high-severity issues)
* Bulk re-analyze with different prompts

---

## 10) Implementation Phases

### Phase 1: Core Multi-Image (This PR)
- [x] Specification document
- [x] Multi-file upload UI
- [x] Progress bar component
- [x] Session manager module
- [x] Batch orchestrator with concurrency
- [x] Session-level aggregates
- [x] Updated report UI

### Phase 2: Export & Navigation
- [x] CSV export functionality
- [x] JSON export functionality
- [x] Thumbnail gallery
- [x] Image navigation (click + keyboard)

### Phase 3: Polish
- [x] Error handling refinements
- [ ] Performance optimizations
- [ ] Enhanced session summary visualizations
- [x] Documentation updates
