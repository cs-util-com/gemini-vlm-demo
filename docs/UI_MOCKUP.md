# Multi-Image UI Mockup

## Single Image Mode (Backwards Compatible)

```
┌─────────────────────────────────────────────────────────────┐
│ Header: [API Key] [Model: gemini-2.5-pro]                  │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ Dropzone: "Drop or click to choose images (up to 20)"      │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Canvas with image and bounding box overlays               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ ▼ 🚨 Safety Issues (2)                                      │
│   [Missing PPE] [High] [Unsafe Ladder]                     │
│                                                             │
│ ▼ 📊 Progress (3 items)                                     │
│   Foundation: 75% ████████████░░░                          │
│                                                             │
│ ▼ 🔍 All Detections (12)                                    │
│   [Worker] [Scaffolding] [Concrete]...                     │
└─────────────────────────────────────────────────────────────┘
```

## Multi-Image Mode (NEW)

```
┌─────────────────────────────────────────────────────────────┐
│ Header: [API Key] [Model: gemini-2.5-pro]                  │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ Progress: Analyzing 7 of 10 images...                       │
│ ████████████████████████████░░░░░░░░░░░ 70%                │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ Gallery: [🖼 img1][🖼 img2][🖼 img3][🖼 img4]...             │
│          ✓done   ✓done   ⏳analy  ⏱queue                   │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Canvas showing currently selected image (img2)             │
│  with overlays and detections highlighted                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ ▼ 📊 Session Overview                                       │
│   ┌────────────┐ ┌────────────┐ ┌────────────┐            │
│   │ Images     │ │ Detections │ │ Safety     │            │
│   │   8 / 10   │ │    142     │ │ ⚠️ 15      │            │
│   └────────────┘ └────────────┘ └────────────┘            │
│                                                             │
│   Image Overview:                                           │
│   [img1: 12 det] [img2: 18 det⚠️] [img3: 8 det]...         │
│                                                             │
│ ▼ 💾 Export Data                                            │
│   [Export JSON] [Export CSV]                                │
│                                                             │
│ ▶ 🖼️ Image 1: construction_site_01.jpg                      │
│   (collapsed - click to expand)                             │
│                                                             │
│ ▶ 🖼️ Image 2: foundation_progress.jpg                       │
│   (collapsed - click to expand)                             │
│                                                             │
│ ▼ 🖼️ Image 3: safety_inspection.jpg (active)                │
│   ▶ Safety Issues (3)                                       │
│   ▶ Progress (1)                                            │
│   ▶ All Detections (18)                                     │
│                                                             │
│ ▶ 🖼️ Image 4: scaffolding_setup.jpg                         │
│   ...                                                       │
└─────────────────────────────────────────────────────────────┘
```

## Gallery Thumbnail Detail

```
┌──────────────┐
│ ┌──────────┐ │
│ │          │ │ ← Image preview (80px height)
│ │  [IMG]   │ │
│ └──────────┘ │
│ photo1.jpg   │ ← Filename (truncated)
│ [completed]  │ ← Status chip (color-coded)
└──────────────┘
   ^
   Active border (blue) when selected
```

## Export Button Interaction

When user clicks "Export JSON":
```javascript
Downloads: session_20240101_120000.json

{
  "sessionId": "session_20240101_120000",
  "timestamp": "2024-01-01T12:00:00Z",
  "totalImages": 10,
  "imagesAnalyzed": 10,
  "sessionAggregates": {
    "totalDetections": 142,
    "safetyIssues": { "high": 5, "medium": 7, "low": 3 },
    ...
  },
  "images": [ ... ]
}
```

When user clicks "Export CSV":
```csv
SessionID,ImageID,ImageName,DetectionID,Label,Category,Confidence,...
session123,img1,photo1.jpg,det1,Worker,object,0.95,,,
session123,img1,photo1.jpg,det2,Helmet,object,0.89,,,
session123,img2,photo2.jpg,det3,Missing PPE,safety_issue,0.91,high,PPE Required
...
```

## Status Indicators

Gallery thumbnails show colored status chips:

- **⏱ Queued** - Gray background (#2a2a3b)
- **⏳ Analyzing** - Blue background (#4a4aff)
- **✓ Completed** - Green background (#44ff88)
- **❌ Error** - Red background (#ff4444)

## Hover Interaction

When user hovers over a detection card in the report:
1. Card gets highlighted border (blue glow)
2. Corresponding bounding box on canvas gets:
   - Thicker border (4px instead of 2px)
   - Shadow glow effect (shadowBlur: 15px)
3. Hover works only for currently active image

## Navigation Flow

```
User Flow:
1. Select 10 images → Gallery appears
2. Click thumbnail #3 → Canvas shows image #3
3. Hover detection card → Box highlights on canvas
4. Scroll to Image 7 section in report → Click
5. Click Export JSON → Downloads session_xxx.json
```

## Responsive Behavior

- Gallery: Horizontal scroll on overflow
- Canvas: Scales to viewport width (preserves aspect ratio)
- Report sections: Stack vertically
- Thumbnails: Fixed 120px width (scrollable container)

## Color Coding

Detection categories:
- **object** → Yellow (#ffcc00)
- **facility_asset** → Cyan (#00ddff)
- **safety_issue** → Red (#ff4444)
- **progress** → Green (#44ff88)
- **other** → Gray (#9aa0b4)

Safety severity:
- **High** → Red (#ff4444)
- **Medium** → Orange (#ffaa44)
- **Low** → Yellow (#ffdd44)
