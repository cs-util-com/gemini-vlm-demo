# Gemini Vision Demo — Full Specification (Client-Only, Vanilla JS + Gemini 2.5 Pro)

**Status:** Draft v1 (implementation complete)
**Default model:** `gemini-2.5-pro`
**Scope:** Single-page web demo (no backend) that accepts an image, sends it to Gemini 2.5 with a strict JSON schema, draws bounding boxes/polygons on a canvas, and displays the full structured JSON (including whole-image insights).

---

## 1) Goals & Non-Goals

### 1.1 Goals

* Provide a minimal, self-contained **vanilla JS** demo that:

  * Accepts a user-supplied image via drag-and-drop or file picker.
  * Calls **Gemini 2.5 Pro** directly via REST with a **strict structured-output schema**.
  * Returns **AEC-oriented detections** (objects, facility assets, safety issues, regional progress) and **global insights** (image-level progress/safety summaries).
  * Draws **bounding boxes and polygons** on a `<canvas>` overlay and shows the **raw JSON** below the image.
* Keep the schema **generic** so new AEC findings can be expressed without changing the app.
* Ship with a **BYO API key** flow (prototype only; no server).

### 1.2 Non-Goals

* No server-side proxy, auth, or key management.
* No storage of images or keys. No analytics.
* No integration with BIM, floor plans, WBS, or scheduling tools (future work).
* No segmentation masks visualization (future work).
* No mobile camera capture UI (file input only).

---

## 2) Target Users & Use Cases

### 2.1 Users

* AEC professionals evaluating AI helpers for: site monitoring, safety, facility inventory, and progress estimation.

### 2.2 Use Cases (supported in one run)

* **General object detection** (e.g., ladders, scaffolds, ducts, tools).
* **Facility asset inventory** (e.g., exit signs, fire extinguishers) with counts.
* **Safety findings** (PPE compliance, ladder angle, blocked exits, unguarded edges) with severity.
* **Progress insights**

  * Per-region progress: e.g., drywall or MEP rough-in in a portion of the image.
  * Whole-image progress: overall phase and percent complete.

---

## 3) System Architecture

### 3.1 High-Level

* **Client-only SPA** (`index.html`) with:

  * Drag-and-drop/file input → render image on `<canvas>`.
  * REST call to Gemini 2.5 Pro using **structured output** (`response_mime_type` + `response_schema`).
  * Draw returned **bounding boxes/polygons**.
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
  * Buttons: “Choose image…”, “Analyze”.
  * Note indicating “Prototype only. Key is not stored.”
* **Body**

  * **Dropzone** (drag-and-drop with highlight on drag).
  * **Canvas** to show the image and overlays.
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
* **Hover interactions**: Hovering over detection cards highlights their corresponding bounding box/polygon on the canvas with glow effect
* Boxes/polygons are color-coded by category:
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

```json
{
  "type": "object",
  "properties": {
    "image": {
      "type": "object",
      "properties": {
        "width": { "type": "number", "nullable": true },
        "height": { "type": "number", "nullable": true },
        "fileName": { "type": "string", "nullable": true },
        "coordSystem": { "type": "string", "enum": ["normalized_0_1000"], "nullable": true, "description": "Always normalized_0_1000" }
      },
      "nullable": true
    },
    "detections": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "label": { "type": "string" },
          "category": { "type": "string", "enum": ["object", "facility_asset", "safety_issue", "progress", "other"] },
          "confidence": { "type": "number" },
          "bbox": {
            "type": "array",
            "items": { "type": "number" },
            "minItems": 4,
            "maxItems": 4,
            "description": "[ymin, xmin, ymax, xmax] normalized 0-1000",
            "nullable": true
          },
          "polygon": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": { "x": { "type": "number" }, "y": { "type": "number" } },
              "required": ["x", "y"]
            },
            "description": "Array of {x,y} points, each normalized 0-1000",
            "nullable": true
          },
          "safety": {
            "type": "object",
            "properties": {
              "isViolation": { "type": "boolean", "nullable": true },
              "severity": { "type": "string", "enum": ["low", "medium", "high"], "nullable": true },
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
          "useCaseTags": { "type": "array", "items": { "type": "string" }, "nullable": true },
          "relationships": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": { "type": { "type": "string" }, "targetId": { "type": "string" } },
              "required": ["type", "targetId"]
            },
            "nullable": true
          }
        },
        "required": ["id", "label", "category", "confidence"]
      }
    },
    "global_insights": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "category": { "type": "string", "enum": ["progress", "safety_issue", "facility_asset", "object", "other"] },
          "description": { "type": "string" },
          "confidence": { "type": "number" },
          "metrics": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": { "key": { "type": "string" }, "value": { "type": "number" }, "unit": { "type": "string", "nullable": true } },
              "required": ["key", "value"]
            },
            "nullable": true
          },
          "relatedDetectionIds": { "type": "array", "items": { "type": "string" }, "nullable": true },
          "region": {
            "type": "object",
            "properties": {
              "bbox": {
                "type": "object",
                "properties": { "x": { "type": "number" }, "y": { "type": "number" }, "width": { "type": "number" }, "height": { "type": "number" } },
                "required": ["x", "y", "width", "height"],
                "nullable": true
              }
            },
            "nullable": true
          }
        },
        "required": ["name", "category", "description", "confidence"]
      }
    }
  },
  "required": ["detections", "global_insights"]
}
```

**Note:** The `aggregates` object has been removed from the schema. Counts by label and category are now calculated client-side from the detections array to prevent hallucination of statistics.

### 5.2 Prompt (model instruction)

Short text prompt accompanying the image:

```
You are an AEC computer-vision assistant.
Return findings strictly matching the provided response schema across FOUR categories:
1) General objects (e.g., ladder, scaffold, duct, rebar, crane hook).
2) Facility assets (e.g., exit sign, fire extinguisher, panel/valve).
3) Safety issues (e.g., missing PPE, unguarded edge, ladder angle > 75°, blocked exit).
4) Progress/scene insights (e.g., "drywall phase ~70%", "MEP rough-in present", "finishes started").

Geometry:
- Use bbox as [ymin, xmin, ymax, xmax] array, normalized 0-1000, top-left origin, when localizable.
- Use polygon only when a box would be misleading (each point {x,y} normalized 0-1000).
- For whole-image findings (e.g., overall progress), use no geometry under detections (prefer global_insights).

Safety:
- For safety items, set category: "safety_issue" and fill safety.{isViolation, severity, rule}.

Progress:
- For per-region progress, set category: "progress" and fill progress.{phase, percentComplete, notes}.
- For overall progress, prefer global_insights (no geometry).

Attributes:
- Add useful metadata as {name, valueNum|valueStr|valueBool, unit?}, e.g., {name:"ladder_angle_deg", valueNum:68, unit:"deg"}.

Coordinates:
- Set image.coordSystem explicitly to "normalized_0_1000" (Google's 0..1000 normalization).
Be conservative with confidence. Output ONLY JSON (no prose).
```

**Note:** Aggregates (counts by label/category) are calculated **client-side** to prevent LLM hallucination of statistics.

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
    "response_mime_type": "application/json",
    "response_schema": { ...see schema above... }
  }
}
```

> Note: Implementation tries snake_case first (`response_mime_type`/`response_schema`), then retries with camelCase if needed (`responseMimeType`/`responseSchema`).

### 6.3 Response Handling

* Expect JSON as a **single text part** in `candidates[0].content.parts[0].text`.
* Parse JSON; if surrounded by backticks (rare), strip before parsing.
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
   * Hover highlights the corresponding bounding box on canvas

2. **📊 Progress** (collapsed by default)
   * **Regional Progress**: Progress bars for localized detections with `category: "progress"`
   * **Overall Progress**: Whole-image progress from `global_insights`
   * Shows: phase name, completion percentage, visual progress bar, notes, confidence

3. **🔍 All Detections** (collapsed by default)
   * Grid of cards for every detection
   * Category color-coding (left border): object (yellow), facility_asset (cyan), safety_issue (red), progress (green)
   * Shows: label, confidence, category badge, custom attributes
   * Hover highlights the corresponding bounding box/polygon on canvas

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

* **Hover to Highlight**: Mousing over any detection card highlights its bounding box/polygon on the canvas with a glow effect
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

### 8.3 Polygons

* Convert each `{x,y}` similarly.
* Require at least 3 points before drawing; close the path.

### 8.4 Labels

* Draw a small dark rectangle above the shape with white text:

  * `"{label} (NN%)"` when confidence is numeric.

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
* Avoid unnecessary re-draws (base image is re-drawn once before overlaying).
* No external libraries; minimal DOM updates.
* Large images can be downscaled client-side before sending (future enhancement).

---

## 12) Testing Plan

> The app is a single file with minimal logic. Tests focus on **deterministic helpers** and **schema conformance**.

### 12.1 Unit-like tests (manual/automated)

* **Coordinate conversion**

  * Given `normalized_0_1000` bbox and known `naturalW/H`, verify pixel conversion.
* **Polygon conversion**

  * Convert known 3-point polygon in both coord systems; verify resulting screen points.
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

* No build step. Open `index.html` in a modern browser.
* Paste API key, choose model (default `gemini-2.5-pro`), drop an image, click **Analyze**.

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
2. **Polygon usage:** In v1, keep polygons optional—should the prompt steer strongly towards **bbox first** to reduce UI complexity?
3. **Label taxonomy:** Remain fully freeform, or add light guidance for common facility assets (e.g., “exit sign”, “fire extinguisher”) to improve consistency across runs?
4. **Safety rules catalog:** Provide a short, curated list of common safety rules to encourage consistent `safety.rule` strings (e.g., PPE categories, ladder angle rule)?
5. **Download artifacts:** Add “Download JSON” and “Download annotated PNG” buttons?
6. **Public demo hosting:** If hosted, should a **tiny proxy** be added immediately to avoid teaching bad key practices?

