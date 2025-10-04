# Gemini Vision Demo — Full Specification (Client-Only, Vanilla JS + Gemini 2.5 Pro)

**Status:** v2 with Multi-Image Support
**Default model:** `gemini-2.5-flash` (selectable)
**Scope:** Single-page web demo (no backend) that accepts 1-20 images, processes them in parallel, and provides comprehensive site-wide analysis with session-level reporting and export capabilities.

---

## 1) Goals & Non-Goals

### 1.1 Goals

* Provide a minimal, self-contained **vanilla JS** demo that:

  * Accepts 1-20 user-supplied images via drag-and-drop or file picker for batch analysis.
  * Calls **Gemini 2.5** models (Flash by default) directly via REST with a **strict structured-output schema**.
  * Processes multiple images concurrently (10 parallel requests) for efficient batch analysis.
  * Returns **AEC-oriented detections** (objects, facility assets, safety issues, regional progress) and **global insights** for each image.
  * Provides **session-level aggregates** across all images with safety issue tracking and detection summaries.
  * Draws **bounding boxes and segmentation masks on a `<canvas>` overlay for each image with thumbnail navigation.
  * Displays interactive reports with session summary and per-image sections.
  * **Exports session data** as CSV and JSON for external analysis.
* Keep the schema **generic** so new AEC findings can be expressed without changing the app.
* Ship with a **BYO API key** flow (prototype only; no server).

### 1.2 Non-Goals

* No server-side proxy, auth, or key management.
* No storage of images or keys beyond session. No analytics.
* No integration with BIM, floor plans, WBS, or scheduling tools (future work).
* No mobile camera capture UI (file input only).
* No localStorage session persistence (sessions are ephemeral).

---

## 2) Target Users & Use Cases

### 2.1 Users

* AEC professionals evaluating AI helpers for: site monitoring, safety, facility inventory, and progress estimation across multiple site locations or areas.

### 2.2 Use Cases (supported in batch analysis)

* **Multi-location site analysis** - Upload 10-20 images from different areas of a construction site for comprehensive safety and progress assessment.
* **General object detection** (e.g., ladders, scaffolds, ducts, tools) across multiple images.
* **Facility asset inventory** (e.g., exit signs, fire extinguishers) with aggregated counts across the site.
* **Safety findings** (PPE compliance, ladder angle, blocked exits, unguarded edges) with severity tracking and site-wide heatmap.
* **Progress insights**

  * Per-region progress: e.g., drywall or MEP rough-in in portions of different images.
  * Whole-image progress: overall phase and percent complete per location.
  * **Session-level aggregates**: Total detections, safety issues breakdown, category distributions across all images.

* **Export capabilities**
  * CSV export: Session summary with per-image statistics for spreadsheet analysis
  * JSON export: Complete session data including all detections and results

---

## 3) System Architecture

### 3.1 High-Level

* **Client-only SPA** (`index.html`) with:

  * Drag-and-drop/file input → render image on `<canvas>`.
  * REST call to Gemini 2.5 Pro using **structured output** (`response_mime_type` + `response_schema`).
  * Draw returned **bounding boxes/segmentation masks**.
  * Render full JSON in a `<pre>` block.

### 3.2 Rationale

* Single file minimizes friction for demos and code reviews.
* Structured output guarantees parseable, predictable JSON for overlays and summaries.

### 3.3 Key Limitations/Assumptions

* API key is typed by the user and **sent directly** to Google’s API from the browser.
* Request size must remain within inline limits (large assets would require a Files API flow in a future iteration).
* Model outputs are probabilistic; the UI surfaces confidence values.

---

## 4) UI/UX Specification

### 4.1 Layout

* **Header**

  * Password field for **API key** (memory only; not persisted).
  * Model dropdown (defaults to `gemini-2.5-pro`; also lists `gemini-2.5-flash` and `…-flash-lite`).
  * Buttons: “Choose image…”. Analysis starts automatically after files are selected.
  * Note indicating “Prototype only. Key is not stored.”
* **Body**

  * **Dropzone** (drag-and-drop with highlight on drag).
  * **Canvas** to show the image and overlays (boxes, masks).
  * **Interactive Report** panel displaying structured findings in collapsible sections.
  * **JSON panel** showing the raw response.

### 4.2 Interactions

* Drag-and-drop or file-picker sets the image and renders it scaled to viewport width.
* Clicking **Analyze** sends the image and prompt to the API, then overlays results.
* **Interactive Report UI** appears between the canvas and raw JSON with:
  * **Safety Issues** section (always expanded) showing high/medium/low severity cards
  * **Progress** section with visual progress bars for regional and overall progress
  * **All Detections** grid cards with category color-coding
  * **Global Insights** for whole-image observations
  * **Summary Statistics** with bar chart visualizations (calculated client-side)
  * All sections are independently collapsible via headers
* **Hover interactions**: Hovering over detection cards highlights their corresponding overlay (box, mask) on the canvas with glow effect
* Boxes are color-coded by category:
  * `object` → yellow
  * `facility_asset` → cyan
  * `safety_issue` → red
  * `progress` → green
* Label on each overlay shows `label` and optional `% confidence`.

### 4.3 Accessibility

* Keyboard focusable controls, visible focus rings (browser default).
* Text labels for buttons and inputs.
* High-contrast overlay labels (dark background with white text).

---

## 5) Data Contract

### 5.1 Unified AEC Structured Output Schema

**Type:** OpenAPI-style Schema object (as required by the Gemini REST `response_schema`).
**Coordinate system supported:**

* `"normalized_0_1000"` → normalized coordinates [0..1000] (converted to pixels in the renderer).

The model returns a compact envelope with an `items` array for per-detection details and an optional `global_insights` array for whole-image observations. Every detection carries a `labels` array ordered from most specific → most general; the first value becomes the canonical label in the UI.

```json
{
  "type": "object",
  "properties": {
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "labels": {
            "type": "array",
            "items": { "type": "string" },
            "minItems": 1,
            "description": "Ordered list of labels from most specific to most general"
          },
          "category": {
            "type": "string",
            "enum": ["object", "facility_asset", "safety_issue", "progress"]
          },
          "confidence": { "type": "number" },
          "box_2d": {
            "type": "array",
            "items": { "type": "number" },
            "minItems": 4,
            "maxItems": 4,
            "description": "[ymin, xmin, ymax, xmax] normalized 0-1000"
          },
          "mask": {
            "type": "string",
            "description": "Optional base64/URL for a segmentation mask aligned to the bbox",
            "nullable": true
          },
          "safety": {
            "type": "object",
            "properties": {
              "isViolation": { "type": "boolean", "nullable": true },
              "severity": { "type": "string", "nullable": true },
              "rule": { "type": "string", "nullable": true }
            },
            "nullable": true
          },
          "progress": {
            "type": "object",
            "properties": {
              "phase": { "type": "string", "nullable": true },
              "percentComplete": { "type": "number", "nullable": true },
              "notes": { "type": "string", "nullable": true }
            },
            "nullable": true
          },
          "attributes": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": { "type": "string" },
                "valueStr": { "type": "string", "nullable": true },
                "valueNum": { "type": "number", "nullable": true },
                "valueBool": { "type": "boolean", "nullable": true },
                "unit": { "type": "string", "nullable": true }
              },
              "required": ["name"]
            },
            "nullable": true
          },
          "relationships": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "type": { "type": "string" },
                "targetId": { "type": "string" }
              },
              "required": ["type", "targetId"]
            },
            "nullable": true
          }
        },
        "required": ["labels", "category", "confidence", "box_2d"]
      }
    },
    "global_insights": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "labels": {
            "type": "array",
            "items": { "type": "string" },
            "minItems": 1
          },
          "category": {
            "type": "string",
            "enum": ["progress", "safety_issue", "facility_asset", "object", "other"]
          },
          "description": { "type": "string" },
          "confidence": { "type": "number" },
          "metrics": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "key": { "type": "string" },
                "value": { "type": "number" },
                "unit": { "type": "string", "nullable": true }
              },
              "required": ["key", "value"]
            },
            "nullable": true
          }
        },
        "required": ["labels", "category", "description", "confidence"]
      },
      "nullable": true
    }
  },
  "required": ["items"]
}
```

**Notes:**

* Masks are optional—omit `mask` when segmentation is uncertain. Polygon/keypoint payloads are intentionally excluded.
* When Gemini returns auxiliary mask blobs (`mask_assets`, `maskResources`, etc.), the client consolidates them but they remain optional.
* Session aggregates are still calculated client-side; the schema stays lean to reduce hallucination surface area.

### 5.2 Prompt (model instruction)

Short text prompt accompanying each image:

```
Detect the most relevant objects, equipment, safety issues, facility assets, and progress indicators in this construction/AEC image.
Return a JSON object with an "items" array (maximum 20 entries). Each item must include:
- "labels": array of strings ordered from most specific to most general (e.g., ["bag of cement from Company X", "cement", "building material"]). Always include at least one label.
- "category": one of "object", "facility_asset", "safety_issue", "progress" (use the best fit for the detection).
- "confidence": detection confidence between 0 and 1.
- "box_2d": bounding box as [ymin, xmin, ymax, xmax] normalized 0-1000 with a top-left origin.
- "mask": optional base64-encoded PNG segmentation mask aligned to the same region (omit when unavailable).
- Optional context objects when relevant:
  - "safety": { "isViolation": boolean?, "severity": "low"|"medium"|"high"?, "rule": string? }
  - "progress": { "phase": string?, "percentComplete": number?, "notes": string? }
  - "attributes": array of { "name": string, "valueStr"?: string, "valueNum"?: number, "valueBool"?: boolean, "unit"?: string }
  - "relationships": array of { "type": string, "targetId": string }

Do not return polygons or keypoints. Use the labels array for both specific names and broader searchable terms instead of separate name/description fields. Include an optional "global_insights" array for whole-image observations following the same labeling approach (labels array, category, confidence, description, optional metrics). Output ONLY JSON with no prose or code fences.
```

**Note:** The client transforms this schema into the legacy `detections`/`global_insights` format internally for display and exports.

---

## 6) API Contract (REST)

### 6.1 Endpoint

```
POST https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent
Authorization: x-goog-api-key: <user-provided key>
Content-Type: application/json
```

### 6.2 Request Body (shape)

```json
{
  "contents": [{
    "parts": [
      { "inline_data": { "mime_type": "image/jpeg", "data": "<BASE64_BYTES>" } },
      { "text": "<AEC prompt text>" }
    ]
  }],
  "generationConfig": {
    "responseMimeType": "application/json",
    "responseSchema": { ...see schema above... },
    "thinkingConfig": { "thinkingBudget": 0 },
    "maxOutputTokens": 1024
  }
}
```

### 6.3 Response Handling

* Expect JSON as a **single text part** in `candidates[0].content.parts[0].text`.
* Parse JSON; if surrounded by backticks (rare), strip before parsing.
* `thinkingBudget` is forced to `0` and `maxOutputTokens` is capped to keep latency predictable.
* On HTTP error, surface `error.message` when available.

---

## 7) Interactive Report UI

### 7.1 Overview

Between the canvas and raw JSON output, the app displays an **interactive report panel** that organizes the structured response data into user-friendly, collapsible sections.

### 7.2 Report Sections

The report is organized into independently collapsible sections:

1. **🚨 Safety Issues** (always expanded by default)
   * Displays safety violations in a grid of cards
   * Color-coded by severity: High (red), Medium (orange), Low (yellow)
   * Shows: label, severity badge, rule violated, confidence
  * Hover highlights the corresponding overlay on canvas

2. **📊 Progress** (collapsed by default)
   * **Regional Progress**: Progress bars for localized detections with `category: "progress"`
   * **Overall Progress**: Whole-image progress from `global_insights`
   * Shows: phase name, completion percentage, visual progress bar, notes, confidence

3. **🔍 All Detections** (collapsed by default)
   * Grid of cards for every detection
   * Category color-coding (left border): object (yellow), facility_asset (cyan), safety_issue (red), progress (green)
   * Shows: label, confidence, category badge, custom attributes
   * Hover highlights the corresponding bounding box/segmentations on canvas

4. **💡 Global Insights** (collapsed by default)
   * Cards for whole-image observations (non-progress)
   * Shows: name, description, confidence, related metrics
   * Example: overall safety assessment, detected construction phase

5. **📈 Summary Statistics** (collapsed by default)
   * **Client-side calculated** counts (prevents LLM hallucination)
   * Bar charts showing:
     - Counts by category (object, facility_asset, safety_issue, progress)
     - Counts by label (top 10)
   * Color-coded bars matching category colors

### 7.3 Interactive Features

* **Hover to Highlight**: Mousing over any detection card highlights its overlay (box, segmentation mask) on the canvas with a glow effect
* **Collapsible Sections**: Click any section header to expand/collapse
* **Visual Feedback**: Highlighted cards get border color change and subtle elevation

### 7.4 Design Rationale

* **Safety First**: Safety issues are prominently displayed at the top and expanded by default
* **Progressive Disclosure**: Other sections are collapsed to avoid overwhelming the user
* **Visual Hierarchy**: Color coding and spacing guide attention to critical information
* **Interaction Before Inspection**: Report provides overview before diving into raw JSON

---

## 8) Rendering & Coordinate Math

### 8.1 Image draw

* Use `createImageBitmap(file)` to load the image.
* Compute scale factor to fit viewport width; keep original image width/height (`naturalW`, `naturalH`) for coordinate conversion.

### 8.2 Boxes

* Gemini returns bboxes as **arrays** in `[ymin, xmin, ymax, xmax]` format (note: **y-first** order).
* If `coordSystem === "normalized_0_1000"` (Gemini default): convert to pixels by:
  * `xMinPx = (xmin / 1000) * naturalW`
  * `yMinPx = (ymin / 1000) * naturalH`
  * `xMaxPx = (xmax / 1000) * naturalW`
  * `yMaxPx = (ymax / 1000) * naturalH`
  * Then convert to `{x, y, width, height}` format and scale to canvas dimensions.
* The unified schema enforces `coordSystem: "normalized_0_1000"`, so all box math assumes that normalized range.

### 8.4 Labels

* Draw a small dark rectangle above the shape with white text:

  * `"{label} (NN%)"` when confidence is numeric.

### 8.5 Segmentation Masks

* Masks arrive as PNG data (data URL or base64) aligned to the detection's bounding box.
* Each mask is tinted with a category-specific palette and cached for reuse to avoid blocking redraws.
* Render masks before boxes with ~0.5 alpha to keep underlying imagery visible.

---

## 9) Error Handling & Edge Cases

* **Missing API key** → show inline error in JSON panel.
* **No file selected** → show inline error.
* **HTTP errors** (invalid key, quota, request too large) → show `error.message` or status code.
* **JSON parse failure** → attempt to strip accidental code fences; otherwise show parse error.
* **Oversized images** → if request size fails, instruct users to try a smaller image (future: Files API flow).
* **No detections** → draw nothing; JSON panel still shows `global_insights` (may include progress/safety info).
* **Coordinate system missing** → assume `"normalized_0_1000"` (Gemini's default); prompt explicitly requests this to reduce ambiguity.

---

## 10) Security & Privacy

* Prototype only; **no production key handling**.
* Key is typed into a password field and used only for the outbound request.
* No storage of keys or images; no third-party analytics.
* CORS and CSP are default (local file). For hosted demos, set a restrictive CSP and HTTPS.

---

## 11) Performance

* Scale image to viewport width for display; keep internal dimensions for accurate math.
* Preprocess uploads to a ~640 px short side (max long side 1280 px) before sending to Gemini to reduce latency.
* Avoid unnecessary re-draws (base image is re-drawn once before overlaying).
* No external libraries; minimal DOM updates.
* For unusually large assets, consider cropping or using the Files API in a future iteration.

---

## 12) Testing Plan

> The app is a single file with minimal logic. Tests focus on **deterministic helpers** and **schema conformance**.

### 12.1 Unit-like tests (manual/automated)

* **Coordinate conversion**

  * Given `normalized_0_1000` bbox and known `naturalW/H`, verify pixel conversion.
* **Label formatting**

  * Confidence rounding and truncation for long labels.
* **Client-side aggregates**

  * Given a set of detections, verify `calculateAggregates()` produces correct counts by label and category.
  * Test with empty arrays, single items, and duplicate labels.
* **Resilience**

  * JSON parsing with and without code fences.
  * Fallback from snake_case to camelCase schema field names.

### 12.2 Schema validation

* Use a lightweight schema validator (optional) in a separate test page to validate the **model output** against the schema.

  * For the demo, basic runtime guards suffice; a future iteration can integrate AJV in a dev-only page.

### 12.3 UX checks (manual)

* Drag-and-drop focus/hover state.
* Keyboard navigation (tabbing through controls).
* Color contrast for overlay labels on bright/dark images.
* Report UI collapsible sections work correctly.
* Hover over detection cards highlights corresponding canvas overlays.

### 12.4 Example Given/When/Then (manual script)

* **Given** an image with a visible exit sign and ladder, **when** Analyze is pressed, **then** at least two detections appear, with `facility_asset` and `object` categories, each with reasonable boxes and confidence > 0.5, and the report UI shows correct client-side calculated counts in the aggregates section.
* **Given** a safety violation image (no hard hat), **when** Analyze is pressed, **then** a `safety_issue` is present with `safety.isViolation=true` and a non-empty `safety.rule`, displayed prominently in the Safety Issues section.
* **Given** a construction site image, **when** hovering over a detection card in the report, **then** the corresponding bounding box on the canvas is highlighted with a glow effect.

---

## 13) Build & Run

### Single Image Mode
* No build step. Open `index.html` in a modern browser.
* Paste API key, choose model (default `gemini-2.5-pro`), drop a single image.
* Analysis starts automatically.

### Multi-Image Batch Mode (New in v2)
* Drop or select up to 20 images at once.
* Progress bar shows real-time analysis status.
* Images are processed concurrently (10 at a time).
* Once complete, view:
  - **Session Summary**: Aggregated statistics across all images
  - **Thumbnail Gallery**: Click any thumbnail to view that image's overlays
  - **Per-Image Reports**: Detailed findings for each image
  - **Export Options**: Download CSV or JSON of session data
* **Keyboard Navigation**: Use arrow keys (← →) to navigate between images.

---

## 14) Logging & Telemetry

* Console logs limited to development only.
* JSON panel acts as a visible log of the last request’s structured output.

---

## 15) Internationalization

* Static English UI. Schema and prompt are language-agnostic (labels are freeform; model may output English labels by default).

---

## 16) Future Enhancements

* **Edge proxy** (Cloudflare/Vercel) to protect the API key; same client can call the proxy instead of Google directly.
* **Files API** integration for large files and reuse across requests.
* **Segmentation masks** (PNG or RLE) and overlay visualization.
* **Model choice UI** presets for different tasks (safety vs. inventory vs. progress).
* **BIM/plan context**: add inputs for room/level IDs, WBS, and compare against planned scope.
* **Confidence threshold slider** and filters by `category`/`label`.
* **Download** annotated image and JSON bundle.
* **Vertex AI** backend variant for enterprise deployments.

---

## 17) Acceptance Criteria

* Page loads without errors on latest Chrome/Edge/Firefox.
* With a valid API key and a test image:

  * A structured JSON response is shown in the panel.
  * Overlays render for any detection with geometry.
  * **All four** categories are supported in a single run (as applicable to the image).
* No secrets are persisted; refreshing the page forgets the key.

---

## 18) Risks

* Client-only key exposure (acceptable for prototype; clearly marked).
* Model variability may produce low-quality or empty results on some images.
* Inline size limits can block very large images (future Files API).

---

## 19) Open Questions

1. **Default thresholds:** Should a UI control hide detections below a confidence threshold (e.g., < 0.4)?
2. **Mask guidance:** Now that polygons/keypoints are out of scope, should we add extra prompt tuning or UI affordances to encourage high-quality masks while keeping bboxes as the guaranteed fallback?
3. **Label taxonomy:** Remain fully freeform, or add light guidance for common facility assets (e.g., “exit sign”, “fire extinguisher”) to improve consistency across runs?
4. **Safety rules catalog:** Provide a short, curated list of common safety rules to encourage consistent `safety.rule` strings (e.g., PPE categories, ladder angle rule)?
5. **Download artifacts:** Add “Download JSON” and “Download annotated PNG” buttons?
6. **Public demo hosting:** If hosted, should a **tiny proxy** be added immediately to avoid teaching bad key practices?



---

## 20) Multi-Image Features (v2)

### 20.1 Session-Based Analysis

**Batch Upload**
* Support for 1-20 images per session
* Drag-and-drop or file picker for multiple files
* Automatic validation with user feedback for >20 images

**Concurrent Processing**
* Hardcoded limit: 10 parallel API requests
* Optimizes analysis time while respecting API quotas
* Individual image failures don't block session completion

**Progress Tracking**
* Real-time progress bar: "Analyzing X of Y images..."
* Per-image status: Queued → Analyzing → Completed/Error
* Visual feedback through thumbnail status badges

### 20.2 Session Reporting

**Session Summary**
* Total images analyzed (completed vs. failed)
* Total detections across all images
* Safety issues breakdown by severity (High/Medium/Low)
* Images with safety issues heatmap

**Per-Image Navigation**
* Thumbnail gallery with click-to-view
* Keyboard navigation (arrow keys)
* Active image highlighting
* Scroll-to-section in report

**Aggregated Statistics**
* Detection counts by category across session
* Detection counts by label across session
* Per-image safety summaries
* Image-level detection counts

### 20.3 Export Capabilities

**CSV Export**
* Per-image statistics table
* Columns: Image #, File Name, Detections, Safety Issues (High/Med/Low), Status
* Session summary footer with totals
* Suitable for spreadsheet analysis and reporting

**JSON Export**
* Complete session object
* All image results with full detection data
* Session aggregates
* Error information for failed images
* Machine-readable format for further processing

### 20.4 Technical Implementation

**Modules**
* `session-manager.js` - Session state management, aggregates calculation, export formatting
* `session-report-ui.js` - Session summary rendering, heatmap visualization
* `index.js` - Extended with batch orchestrator, thumbnail gallery, keyboard navigation

**Architecture Benefits**
* Graceful degradation (partial results on failure)
* Memory-efficient (lazy bitmap loading)
* Responsive UI (progress updates during processing)
* Export-ready data (structured for external analysis)

**Testing**
* 25 unit tests for session manager (100% function coverage)
* Session creation, status updates, completion tracking
* Aggregate calculations with multiple images
* CSV/JSON export with proper escaping

For detailed specification, see [docs/multi-image-specification.md](docs/multi-image-specification.md)
