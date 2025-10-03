# Spatial Understanding Improvements

## Overview

This document describes the improvements made to enhance bounding box accuracy and add segmentation mask and point visualization capabilities, based on Google's reference implementation for Gemini spatial understanding.

## Key Changes

### 1. Model Selection
- **Before:** `gemini-2.5-pro` (general purpose)
- **After:** `gemini-2.5-flash` (optimized for spatial understanding)
- **Rationale:** Google's reference implementation and documentation recommend Flash for spatial tasks

### 2. API Configuration
- **Added:** `thinkingConfig: {thinkingBudget: 0}`
- **Rationale:** Gemini documentation explicitly recommends disabling thinking for spatial understanding tasks to improve accuracy and speed

### 3. Schema Simplification

**Before (Complex AEC Schema):**
```javascript
{
  type: "object",
  properties: {
    image: { /* ... */ },
    detections: {
      type: "array",
      items: {
        properties: {
          id, label, category, confidence,
          bbox, polygon,
          safety: { isViolation, severity, rule },
          progress: { phase, percentComplete, notes },
          attributes: [ /* ... */ ],
          useCaseTags, relationships
        }
      }
    },
    global_insights: { /* ... */ }
  }
}
```

**After (Simplified Spatial Schema):**
```javascript
{
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        properties: {
          label: { type: "string" },
          box_2d: { type: "array", items: { type: "number" } },
          mask: { type: "string", nullable: true },
          points: { 
            type: "array", 
            items: { type: "array", items: { type: "number" } },
            nullable: true 
          }
        },
        required: ["label", "box_2d"]
      }
    }
  },
  required: ["items"]
}
```

**Benefits:**
- Avoids "too many states for serving" errors mentioned in [Google's structured output docs](https://ai.google.dev/gemini-api/docs/structured-output)
- No complex enums, nested objects, or minItems/maxItems constraints
- All spatial data (boxes, masks, points) in single response
- More focused on core spatial understanding features

### 4. Prompt Simplification

**Before:**
- Multi-paragraph AEC-specific instructions
- Detailed category requirements
- Multiple coordinate system options
- Safety/progress/attribute specifications

**After:**
```
Detect objects in this image and return a JSON object with an "items" array.
Each item should include:
- "label": descriptive text label
- "box_2d": bounding box as [ymin, xmin, ymax, xmax] normalized to 0-1000
- "mask": (optional) base64-encoded PNG probability map for segmentation
- "points": (optional) array of significant points as [y, x] pairs normalized to 0-1000

Limit to 25 items. Return JSON only—no prose, no code fences.
```

**Benefits:**
- Direct and clear instructions
- Requests all spatial features in one call
- No ambiguity about output format
- Matches patterns from Google's spatial understanding examples

## New Visualization Features

### 1. Segmentation Masks
- **Rendering:** Canvas-based with alpha blending
- **Colorization:** Each mask is colored based on object category
- **Opacity:** 50% transparency to show underlying image
- **Caching:** Processed masks are cached to avoid re-computation
- **Format:** Receives base64-encoded PNG from API, decodes and colorizes client-side

**Implementation Details:**
```javascript
function drawMask(mask, bbox, color, detectionId) {
  // Check cache first
  if (maskCache[cacheKey]) {
    ctx.drawImage(maskCache[cacheKey], bbox.x, bbox.y, bbox.width, bbox.height);
    return;
  }
  
  // Process mask: decode PNG, colorize pixels, cache result
  // Automatically redraws when mask loads
}
```

### 2. Point Detection
- **Rendering:** Colored circles with white borders
- **Coordinates:** [y, x] pairs normalized to 0-1000
- **Labels:** Displayed above first point
- **Use Case:** Highlighting key features, landmarks, or attention points

**Implementation Details:**
```javascript
function drawPoints(points, label, color) {
  for (const [y, x] of points) {
    const canvasX = (x / 1000) * canvas.width;
    const canvasY = (y / 1000) * canvas.height;
    
    // Draw filled circle with border
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }
}
```

### 3. Enhanced Bounding Boxes
- **Same format:** [ymin, xmin, ymax, xmax] normalized 0-1000
- **Expected improvement:** More accurate due to Flash model + simplified schema
- **Rendering:** Unchanged - draws rectangles with labels
- **Integration:** Works seamlessly with masks (mask rendered first, then box on top)

## Backward Compatibility

The implementation maintains backward compatibility through a transformation layer:

```javascript
function transformSimpleResponse(response) {
  if (response.detections) return response; // Already legacy format
  
  // Transform items[] to detections[]
  return {
    detections: response.items.map((item, idx) => ({
      id: `item-${idx}`,
      label: item.label,
      category: 'object',
      confidence: 1.0,
      bbox: item.box_2d,
      mask: item.mask,
      points: item.points
    })),
    global_insights: []
  };
}
```

This allows the existing UI code (report generation, overlay rendering, etc.) to work without changes.

## Testing

- **Unit Tests:** 127 tests pass (5 new tests added for transformation logic)
- **Coverage:** 97.8% statements, 90.74% branches
- **Quality Checks:** All pass (lint, duplication, cycles, boundaries)

## References

1. [Gemini Spatial Understanding Demo](https://github.com/google-gemini/cookbook/blob/main/quickstarts/Spatial_understanding.ipynb) - Reference implementation from Google
2. [Structured Output Docs](https://ai.google.dev/gemini-api/docs/structured-output) - Guidance on avoiding schema complexity
3. [Conversational Image Segmentation](https://developers.googleblog.com/en/conversational-image-segmentation-gemini-2-5/) - Blog post on Gemini 2.5 spatial features
4. [Gemini for Robotics](https://developers.googleblog.com/en/gemini-25-for-robotics-and-embodied-intelligence/) - Examples using box_2d and points

## Expected Results

Based on the reference implementation and Google's documentation:

1. **Improved Accuracy:** Flash model + simplified schema should produce tighter bounding boxes
2. **Faster Responses:** Flash model is faster than Pro, thinking disabled speeds it up further
3. **Richer Data:** Single call now returns boxes, masks, and points together
4. **Better Reliability:** Simpler schema less likely to hit API limits or parsing errors

## Usage

1. Open `index.html` in a modern browser
2. Enter your Gemini API key
3. Ensure `gemini-2.5-flash` is selected (now the default)
4. Drop one or more images
5. View results with:
   - Bounding boxes (rectangles)
   - Segmentation masks (colored overlays)
   - Key points (colored dots)
