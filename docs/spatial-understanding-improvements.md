# Spatial Understanding Improvements

## Overview

This document describes the improvements made to enhance bounding box accuracy and add support for segmentation masks and points visualization, based on learnings from Google's reference implementation.

## Key Changes

### 1. API Configuration

**Model Selection:**
- Changed default model from `gemini-2.5-pro` to `gemini-2.5-flash`
- Added `thinkingConfig: {thinkingBudget: 0}` for optimal spatial understanding performance
- This configuration is recommended by Google for spatial tasks per their reference implementation

**Location:** `src/index.js` lines 356-372, 549

### 2. Simplified Prompt

**Before:**
- Complex AEC-specific prompt with multiple categories, detailed geometry instructions, and nested requirements
- ~30 lines of detailed instructions

**After:**
- Direct, concise prompt focused on detection task
- Clear request for boxes, masks, and points in a single call
- Explicit limit of 25 items to improve response quality
- No prose or code fences in output

**Location:** `src/aec-schema.js` lines 3-10

### 3. Simplified Response Schema

**Before:**
- Complex nested schema with `detections` and `global_insights`
- Multiple enums for categories (5 values)
- Nested objects for safety, progress, attributes, relationships
- `minItems`/`maxItems` constraints
- Polygon support with complex point objects `{x, y}`

**After:**
- Simple flat `items` array
- Each item contains:
  - `label` (string, required)
  - `box_2d` (array of 4 numbers, required) - `[ymin, xmin, ymax, xmax]` normalized 0-1000
  - `mask` (string, optional) - base64-encoded PNG
  - `points` (array of arrays, optional) - `[[y, x], ...]` normalized 0-1000
  - `category` (string, optional) - simple string, no enum
  - `confidence` (number, optional) - 0-1 confidence

**Why this matters:**
- Reduces "too many states for serving" errors
- Allows model to return all spatial data (boxes, masks, points) in single response
- Simpler structure = better model performance
- Follows Google's reference implementation pattern

**Location:** `src/aec-schema.js` lines 31-52

### 4. Response Format Transformation

**Implementation:**
- Added `transformResponseFormat()` function in `src/ui-utils.js`
- Converts new simplified format to legacy format for backward compatibility
- Allows UI code to remain unchanged while using improved API

**Transformation mapping:**
- `items` → `detections` array
- Adds auto-generated IDs (`det_0`, `det_1`, etc.)
- Preserves `mask` and `points` fields when present
- Adds default values for missing fields (category: 'object', confidence: 0.8)

**Location:** `src/ui-utils.js` lines 134-176

### 5. Segmentation Mask Visualization

**New capability:**
- Renders base64 PNG masks as colored overlays
- Uses color palette from reference implementation
- 50% opacity for visibility of underlying image
- Mask drawn as background layer before boxes

**Technical details:**
- Converts grayscale mask to RGBA with color palette
- Scales mask to bounding box dimensions
- Uses off-screen canvas for pixel manipulation

**Location:** `src/index.js` lines 102-108, 376-414

**Color palette:**
```javascript
const segmentationColors = [
  [230, 25, 75],    // Red
  [60, 180, 75],    // Green
  [255, 225, 25],   // Yellow
  [0, 130, 200],    // Blue
  [245, 130, 48],   // Orange
  [145, 30, 180],   // Purple
  [70, 240, 240],   // Cyan
  [240, 50, 230],   // Magenta
  [191, 239, 69],   // Lime
  [250, 190, 212]   // Pink
]
```

### 6. Points Visualization

**New capability:**
- Renders point arrays as colored circles on canvas
- Supports `[y, x]` format normalized to 0-1000
- White border around points for visibility
- Label shown at first point only

**Technical details:**
- 6px radius circles
- 2px white stroke
- Color matches category

**Location:** `src/index.js` lines 154-159, 416-448

## Testing

**Test coverage:**
- Added comprehensive tests for `transformResponseFormat()`
- Tests cover:
  - Basic transformation from items to detections
  - Mask field preservation
  - Points field preservation
  - Default value handling
  - Legacy format pass-through
  - Invalid input handling

**Location:** `src/ui-utils.test.js` lines 336-435

**Test results:**
- All 128 tests pass
- Coverage: 97.78% statements, 90.82% branches, 98.48% functions

## Benefits

### Improved Bounding Box Accuracy
- Simplified prompt allows model to focus on spatial task
- Reduced schema complexity prevents state explosion
- Optimized model configuration (thinkingBudget: 0)

### Single API Call for All Spatial Data
- Previously: Multiple calls needed for different output types
- Now: Single call returns boxes, masks, and points simultaneously
- Reduces API costs and latency

### Better Visualization
- Segmentation masks show precise object boundaries
- Points highlight key locations
- Color-coded by category for easy identification

## Migration Notes

### For Existing Code
- Response structure automatically transformed to legacy format
- Existing UI code requires no changes
- All existing tests continue to pass

### For New Features
- Can access `mask` field directly from detections
- Can access `points` array directly from detections
- Format: `detection.mask` (base64 string), `detection.points` (array of [y,x] pairs)

## References

1. Google's spatial understanding demo: `/referenceImplementations/gemini-spatial-understanding-demo`
2. Gemini 2.5 spatial understanding docs: https://developers.googleblog.com/en/conversational-image-segmentation-gemini-2-5/
3. Structured output guidelines: https://ai.google.dev/gemini-api/docs/structured-output
4. 2D spatial understanding colab: https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Spatial_understanding.ipynb

## Future Improvements

Potential enhancements not included in this change:
- Interactive mask editing
- Point annotation tools
- 3D bounding box support
- Mask-based object selection
- Export masks as separate PNG files
