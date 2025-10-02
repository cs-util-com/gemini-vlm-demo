# Multi-Image Analysis Specification

## Overview
This document specifies the architecture and implementation for analyzing multiple images (up to 20) simultaneously to provide comprehensive construction site understanding.

## User Requirements
- **CSV/JSON Export**: Yes, for session-level summary
- **Concurrency Limit**: Hardcoded to 10 parallel requests
- **Progress Bar**: Display during analysis
- **Report UX**: Show only after all images are processed
- **localStorage**: Not needed

## Architecture

### Session Concept
Each analysis run is a "session" containing 1-20 images:
- `sessionId`: Unique identifier (timestamp-based)
- `images`: Array of image analysis results
- `status`: overall session status (analyzing, completed, partial_failure)
- `sessionAggregates`: Cross-image statistics

### Batch Processing
- Accept up to 20 images via dropzone/file input
- Queue all images for analysis
- Process with **10 concurrent requests** max
- Track individual image states: `queued → analyzing → completed | error`
- Accumulate results as they complete
- Display report only when all images finish (success or error)

### Progress Tracking
- Progress bar showing: `N/M images analyzed`
- Percentage completion: `(completed + errored) / total * 100`
- Visual status for each thumbnail: queued, analyzing, completed, error

## UI/UX Changes

### File Input Enhancement
- Update `<input type="file">` to support `multiple` attribute
- Accept up to 20 images maximum
- Show error if user selects >20 images

### Gallery Strip (New Component)
- Horizontal scrollable strip of thumbnails
- Each thumbnail shows:
  - Image preview (scaled)
  - Status indicator (color-coded chip)
  - Image filename (truncated)
- Click thumbnail to view in main canvas
- Keyboard navigation (arrow keys)

### Progress Bar (New Component)
- Displayed during analysis phase
- Shows: "Analyzing X of N images..."
- Percentage-based fill bar
- Replaces dropzone text during analysis

### Canvas Viewer
- Displays currently selected image with overlays
- Navigation controls (prev/next buttons)
- Shows detections for active image only

### Session Report (Enhanced)
- **Session Overview** (new top section):
  - Total images analyzed
  - Total detections across all images
  - Safety issues summary (high/med/low counts)
  - Overall progress indicators
  - Heatmap showing which images contain safety/progress findings
- **Per-Image Subsections** (expandable):
  - Preserves existing report structure per image
  - Each section: "Image 1: filename.jpg"
  - Maintains hover↔canvas sync per image
- **Export Controls** (new):
  - "Export CSV" button
  - "Export JSON" button

### Export Format

#### CSV Export
```
SessionID,ImageID,ImageName,DetectionID,Label,Category,Confidence,SafetySeverity,SafetyRule,ProgressPhase,ProgressPercent
session123,img1,photo1.jpg,det1,Worker,object,0.95,,,,,
session123,img1,photo1.jpg,det2,Missing PPE,safety_issue,0.87,high,PPE Required,,
...
```

#### JSON Export
```json
{
  "sessionId": "session_20240101_120000",
  "timestamp": "2024-01-01T12:00:00Z",
  "totalImages": 5,
  "imagesAnalyzed": 5,
  "imagesError": 0,
  "sessionAggregates": {
    "totalDetections": 47,
    "safetyIssues": { "high": 2, "medium": 3, "low": 1 },
    "categoryCounts": { "object": 30, "safety_issue": 6, ... },
    "labelCounts": { "Worker": 15, "Scaffolding": 8, ... }
  },
  "images": [
    {
      "imageId": "img1",
      "filename": "photo1.jpg",
      "status": "completed",
      "detections": [...],
      "global_insights": [...]
    },
    ...
  ]
}
```

## Data Handling

### Session State Structure
```javascript
{
  sessionId: string,
  status: 'analyzing' | 'completed' | 'partial_failure',
  images: [
    {
      id: string,          // unique image ID
      file: File,          // original File object
      filename: string,
      status: 'queued' | 'analyzing' | 'completed' | 'error',
      bitmap: ImageBitmap | null,
      naturalWidth: number,
      naturalHeight: number,
      parsedData: object | null,  // Gemini response
      detections: array,
      error: string | null
    }
  ],
  activeImageIndex: number,  // currently displayed image
  sessionAggregates: {
    totalDetections: number,
    safetyIssues: { high: number, medium: number, low: number },
    categoryCounts: object,
    labelCounts: object,
    imageStats: array  // per-image summary
  }
}
```

### Aggregation Logic
Computed once all images complete:
- Count detections by category across images
- Count detections by label across images
- Group safety violations by severity
- Calculate per-image statistics
- Identify images with critical findings

## Error Handling
- **Partial Failures**: Some images fail, others succeed
  - Mark failed images with error status
  - Display session report with available results
  - Show error indicators in gallery
- **Retry**: Provide retry button per failed image
- **Complete Failure**: All images fail
  - Show error message
  - Allow user to retry all or clear

## Performance Considerations
- **Concurrency**: Max 10 simultaneous API calls
- **Canvas Optimization**: Only render active image
- **Thumbnail Generation**: Downscale images for gallery (max 150px height)
- **Memory**: Release ImageBitmap objects when switching images
- **Limits**:
  - Max 20 images per session
  - Warn if any file >10MB
  - Max total batch size: 50MB

## Testing Strategy

### Unit Tests
- `session.js`: Session state management, aggregation logic
- `export.js`: CSV and JSON export formatting
- `batch-processor.js`: Concurrency control, queue management

### Property-Based Tests
- Aggregation remains consistent across permutations
- Export round-trip (import exported JSON)
- Concurrent processing order independence

### Integration Tests
- Full flow: select multiple files → analyze → view report → export
- Error scenarios: partial failures, retry logic
- Gallery navigation and canvas sync

## Implementation Modules

### New Files
1. **src/session.js**: Session state management and aggregation
2. **src/export.js**: CSV/JSON export utilities
3. **src/batch-processor.js**: Concurrent image processing orchestrator
4. **src/gallery.js**: Gallery UI component logic
5. **src/progress-bar.js**: Progress bar component

### Modified Files
1. **index.html**: Add gallery container, progress bar, export buttons
2. **src/index.js**: Integrate multi-image flow, session management
3. **src/report-ui.js**: Add session overview section, per-image subsections
4. **styles** (in index.html): Gallery, progress bar, export button styles

## Migration Notes
- Single-image mode preserved as special case (1 image = simplified UI)
- Existing test suite remains valid
- No breaking changes to data contract or API calls
