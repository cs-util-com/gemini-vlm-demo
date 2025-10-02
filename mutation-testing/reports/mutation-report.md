# 🧬 Mutation Testing Report

> **Generated:** 2025-10-02T20:07:34.894Z  
> **Mutation Score:** 🟢 **79.5%**  
> **Coverage Score:** 34.2%  
> **Total Files Analyzed:** 9

> 💡 **Note:** A human-readable, pretty-printed version of the raw JSON data (that was used to produce this md file here) is available at `mutation-report-pretty.json` for detailed analysis and debugging.

---

## 📊 Executive Summary

✅ **Risk Level: LOW**

| Metric | Count | Percentage |
|--------|-------|------------|
| **Total Mutants** | 1864 | 100% |
| **✅ Killed (Good)** | 507 | 27.2% |
| **❌ Survived (Bad)** | 116 | 6.2% |
| **🚫 No Coverage** | 1226 | 65.8% |
| **⏱️ Timeout** | 15 | 0.8% |
| **💥 Error** | 0 | 0.0% |

### Quality Assessment
- **Mutation Score:** 79.5% (Good)
- **Test Coverage:** 34.2% (Poor)

---

## 🎯 Priority Actions

### Immediate Actions Required:

#### 🔴 HIGH PRIORITY (Immediate attention needed)

**src/aec-schema.js**
- Issues: ❌ Very low test coverage (0.0%), ❌ Poor mutation score (0.0%)
- Recommended actions: Add comprehensive unit tests, Improve code coverage
- Stats: 207/207 no coverage, 0 survived

**src/index.js**
- Issues: ❌ Very low test coverage (0.0%), ❌ Poor mutation score (0.0%)
- Recommended actions: Add comprehensive unit tests, Improve code coverage
- Stats: 528/528 no coverage, 0 survived

**src/report-ui.js**
- Issues: ❌ Very low test coverage (5.8%)
- Recommended actions: Add comprehensive unit tests, Strengthen test assertions, Add edge case tests, Improve code coverage
- Stats: 469/498 no coverage, 3 survived

**src/export.js**
- Issues: ❌ Poor mutation score (54.3%), ❌ 43 survived mutants need test improvements
- Recommended actions: Strengthen test assertions, Add edge case tests
- Stats: 9/103 no coverage, 43 survived

#### 🟡 MEDIUM PRIORITY (Address soon)

**src/batch-processor.js**
- Issues: ❌ Poor mutation score (52.8%)
- Recommended actions: Strengthen test assertions, Add edge case tests
- Stats: 1/37 no coverage, 2 survived

#### 🟢 LOW PRIORITY (Improve when possible)

- 4 files have good test coverage and mutation scores

---

## 🔍 Detailed Analysis

### Mutation Testing Metrics Explained

**Mutation Score**: Percentage of mutants killed by tests (excluding no-coverage mutants)
- 🟢 ≥80%: Excellent test quality
- 🟡 60-79%: Good test quality  
- 🔴 <60%: Tests need improvement

**Coverage Score**: Percentage of code covered by tests
- 🟢 ≥90%: Excellent coverage
- 🟡 70-89%: Good coverage
- 🔴 <70%: Poor coverage

### Top Mutation Operators Analysis

| Mutator | Total | Killed | Survived | No Coverage | Kill Rate |
|---------|-------|--------|----------|-------------|-----------|
| StringLiteral | 434 | 64 | 26 | 344 | 🔴 14.7% |
| ConditionalExpression | 457 | 151 | 36 | 267 | 🔴 33.0% |
| BlockStatement | 209 | 58 | 1 | 144 | 🔴 27.8% |
| EqualityOperator | 158 | 53 | 4 | 100 | 🔴 33.5% |
| ObjectLiteral | 124 | 24 | 1 | 99 | 🔴 19.4% |
| BooleanLiteral | 109 | 27 | 0 | 82 | 🔴 24.8% |
| LogicalOperator | 96 | 37 | 8 | 51 | 🔴 38.5% |
| MethodExpression | 59 | 20 | 9 | 30 | 🔴 33.9% |
| ArrayDeclaration | 39 | 5 | 6 | 28 | 🔴 12.8% |
| ArithmeticOperator | 70 | 37 | 3 | 30 | 🔴 52.9% |

### Mutator-Specific Analysis

#### StringLiteral
- **Total Mutations**: 434
- **Success Rate**: 14.7%
- **Impact**: High (26 survived, 344 uncovered)
- **Recommendation**: Primary issue is test coverage. Add tests to cover the 344 uncovered mutations.

#### ConditionalExpression
- **Total Mutations**: 457
- **Success Rate**: 33.0%
- **Impact**: High (36 survived, 267 uncovered)
- **Recommendation**: Primary issue is test coverage. Add tests to cover the 267 uncovered mutations.

#### BlockStatement
- **Total Mutations**: 209
- **Success Rate**: 27.8%
- **Impact**: High (1 survived, 144 uncovered)
- **Recommendation**: Primary issue is test coverage. Add tests to cover the 144 uncovered mutations.

#### EqualityOperator
- **Total Mutations**: 158
- **Success Rate**: 33.5%
- **Impact**: High (4 survived, 100 uncovered)
- **Recommendation**: Primary issue is test coverage. Add tests to cover the 100 uncovered mutations.

#### ObjectLiteral
- **Total Mutations**: 124
- **Success Rate**: 19.4%
- **Impact**: High (1 survived, 99 uncovered)
- **Recommendation**: Primary issue is test coverage. Add tests to cover the 99 uncovered mutations.


### Test Effectiveness Analysis

#### Overall Test Coverage Insights
- **Total Mutants Analyzed**: 1864
- **Average Test Coverage per Mutant**: 1.4 tests
- **Most Tested Mutant**: #365 (covered by 11 tests)
- **Least Tested Areas**: AssignmentOperator, ObjectLiteral, StringLiteral

#### Test Quality Metrics
- **Mutation Detection Rate**: 27.2%
- **Test Efficiency**: 79.5% (killed/covered ratio)
- **Coverage Gaps**: 310 lines not covered by any tests

#### Top Performing Tests
1. **Test #43**: Killed 48 mutants, covered 78
2. **Test #65**: Killed 47 mutants, covered 72
3. **Test #53**: Killed 35 mutants, covered 51
4. **Test #72**: Killed 30 mutants, covered 30
5. **Test #75**: Killed 28 mutants, covered 62


---

## 📁 File-by-File Breakdown

### 🔴 src/aec-schema.js

**Overall Health**: 🔴 Needs Improvement | **Mutation Score**: 0.0% | **Coverage**: 0.0%

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Killed | 0 | 0.0% |
| ❌ Survived | 0 | 0.0% |
| 🚫 No Coverage | 207 | 100.0% |
| **Total** | **207** | **100%** |

#### 📄 Source Code with Mutation Analysis

```javascript
  1| /* istanbul ignore file */
  2| 
  3| export const AEC_PROMPT = `
   🚫 #0: MethodExpression → "`
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
Be conservative; reflect uncertainty in confidence. Output ONLY JSON (no prose).
`" [0 tests]
   🚫 #1: StringLiteral → "``" [0 tests]
  4| You are an AEC computer-vision assistant.
  5| Return findings strictly matching the provided response schema across FOUR categories:
  6| 1) General objects (e.g., ladder, scaffold, duct, rebar, crane hook).
  7| 2) Facility assets (e.g., exit sign, fire extinguisher, panel/valve).
  8| 3) Safety issues (e.g., missing PPE, unguarded edge, ladder angle > 75°, blocked exit).
  9| 4) Progress/scene insights (e.g., "drywall phase ~70%", "MEP rough-in present", "finishes started").
 10| 
 11| Geometry:
 12| - Use bbox as [ymin, xmin, ymax, xmax] array, normalized 0-1000, top-left origin, when localizable.
 13| - Use polygon only when a box would be misleading (each point {x,y} normalized 0-1000).
 14| - For whole-image findings (e.g., overall progress), use no geometry under detections (prefer global_insights).
 15| 
 16| Safety:
 17| - For safety items, set category: "safety_issue" and fill safety.{isViolation, severity, rule}.
 18| 
 19| Progress:
 20| - For per-region progress, set category: "progress" and fill progress.{phase, percentComplete, notes}.
 21| - For overall progress, prefer global_insights (no geometry).
 22| 
 23| Attributes:
 24| - Add useful metadata as {name, valueNum|valueStr|valueBool, unit?}, e.g., {name:"ladder_angle_deg", valueNum:68, unit:"deg"}.
 25| 
 26| Coordinates:
 27| - Set image.coordSystem explicitly to "normalized_0_1000" (Google's 0..1000 normalization).
 28| Be conservative; reflect uncertainty in confidence. Output ONLY JSON (no prose).
 29| `.trim();
 30| 
 31| export const RESPONSE_SCHEMA = {
   🚫 #2: ObjectLiteral → "{}" [0 tests]
 32| 	type: "object",
   🚫 #3: StringLiteral → """" [0 tests]
 33| 	properties: {
   🚫 #4: ObjectLiteral → "{}" [0 tests]
 34| 		image: {
   🚫 #5: ObjectLiteral → "{}" [0 tests]
 35| 			type: "object",
   🚫 #6: StringLiteral → """" [0 tests]
 36| 			properties: {
   🚫 #7: ObjectLiteral → "{}" [0 tests]
 37| 				width: { type: "number", nullable: true },
   🚫 #8: ObjectLiteral → "{}" [0 tests]
   🚫 #9: StringLiteral → """" [0 tests]
   🚫 #10: BooleanLiteral → "false" [0 tests]
 38| 				height: { type: "number", nullable: true },
   🚫 #11: ObjectLiteral → "{}" [0 tests]
   🚫 #12: StringLiteral → """" [0 tests]
   🚫 #13: BooleanLiteral → "false" [0 tests]
 39| 				fileName: { type: "string", nullable: true },
   🚫 #14: ObjectLiteral → "{}" [0 tests]
   🚫 #15: StringLiteral → """" [0 tests]
   🚫 #16: BooleanLiteral → "false" [0 tests]
 40| 				coordSystem: { type: "string", enum: ["normalized_0_1000"], nullable: true, description: "Always normalized_0_1000" }
   🚫 #17: ObjectLiteral → "{}" [0 tests]
   🚫 #18: StringLiteral → """" [0 tests]
   🚫 #19: ArrayDeclaration → "[]" [0 tests]
   🚫 #20: StringLiteral → """" [0 tests]
   🚫 #21: BooleanLiteral → "false" [0 tests]
   🚫 #22: StringLiteral → """" [0 tests]
 41| 			},
 42| 			nullable: true
   🚫 #23: BooleanLiteral → "false" [0 tests]
 43| 		},
 44| 		detections: {
   🚫 #24: ObjectLiteral → "{}" [0 tests]
 45| 			type: "array",
   🚫 #25: StringLiteral → """" [0 tests]
 46| 			items: {
   🚫 #26: ObjectLiteral → "{}" [0 tests]
 47| 				type: "object",
   🚫 #27: StringLiteral → """" [0 tests]
 48| 				properties: {
   🚫 #28: ObjectLiteral → "{}" [0 tests]
 49| 					id: { type: "string" },
   🚫 #29: ObjectLiteral → "{}" [0 tests]
   🚫 #30: StringLiteral → """" [0 tests]
 50| 					label: { type: "string" },
   🚫 #31: ObjectLiteral → "{}" [0 tests]
   🚫 #32: StringLiteral → """" [0 tests]
 51| 					category: { type: "string", enum: ["object","facility_asset","safety_issue","progress","other"] },
   🚫 #33: ObjectLiteral → "{}" [0 tests]
   🚫 #34: StringLiteral → """" [0 tests]
   🚫 #35: ArrayDeclaration → "[]" [0 tests]
   🚫 #36: StringLiteral → """" [0 tests]
   🚫 #37: StringLiteral → """" [0 tests]
   🚫 #38: StringLiteral → """" [0 tests]
   🚫 #39: StringLiteral → """" [0 tests]
   🚫 #40: StringLiteral → """" [0 tests]
 52| 					confidence: { type: "number" },
   🚫 #41: ObjectLiteral → "{}" [0 tests]
   🚫 #42: StringLiteral → """" [0 tests]
 53| 					bbox: {
   🚫 #43: ObjectLiteral → "{}" [0 tests]
 54| 						type: "array",
   🚫 #44: StringLiteral → """" [0 tests]
 55| 						items: { type: "number" },
   🚫 #45: ObjectLiteral → "{}" [0 tests]
   🚫 #46: StringLiteral → """" [0 tests]
 56| 						minItems: 4,
 57| 						maxItems: 4,
 58| 						description: "[ymin, xmin, ymax, xmax] normalized 0-1000",
   🚫 #47: StringLiteral → """" [0 tests]
 59| 						nullable: true
   🚫 #48: BooleanLiteral → "false" [0 tests]
 60| 					},
 61| 					polygon: {
   🚫 #49: ObjectLiteral → "{}" [0 tests]
 62| 						type: "array",
   🚫 #50: StringLiteral → """" [0 tests]
 63| 						items: { type:"object", properties:{ x:{type:"number"}, y:{type:"number"} }, required:["x","y"] },
   🚫 #51: ObjectLiteral → "{}" [0 tests]
   🚫 #52: StringLiteral → """" [0 tests]
   🚫 #53: ObjectLiteral → "{}" [0 tests]
   🚫 #54: ObjectLiteral → "{}" [0 tests]
   🚫 #55: StringLiteral → """" [0 tests]
   🚫 #56: ObjectLiteral → "{}" [0 tests]
   🚫 #57: StringLiteral → """" [0 tests]
   🚫 #58: ArrayDeclaration → "[]" [0 tests]
   🚫 #59: StringLiteral → """" [0 tests]
   🚫 #60: StringLiteral → """" [0 tests]
 64| 						description: "Array of {x,y} points, each normalized 0-1000",
   🚫 #61: StringLiteral → """" [0 tests]
 65| 						nullable: true
   🚫 #62: BooleanLiteral → "false" [0 tests]
 66| 					},
 67| 					safety: {
   🚫 #63: ObjectLiteral → "{}" [0 tests]
 68| 						type: "object",
   🚫 #64: StringLiteral → """" [0 tests]
 69| 						properties: {
   🚫 #65: ObjectLiteral → "{}" [0 tests]
 70| 							isViolation: { type: "boolean", nullable: true },
   🚫 #66: ObjectLiteral → "{}" [0 tests]
   🚫 #67: StringLiteral → """" [0 tests]
   🚫 #68: BooleanLiteral → "false" [0 tests]
 71| 							severity: { type: "string", enum: ["low","medium","high"], nullable: true },
   🚫 #69: ObjectLiteral → "{}" [0 tests]
   🚫 #70: StringLiteral → """" [0 tests]
   🚫 #71: ArrayDeclaration → "[]" [0 tests]
   🚫 #72: StringLiteral → """" [0 tests]
   🚫 #73: StringLiteral → """" [0 tests]
   🚫 #74: StringLiteral → """" [0 tests]
   🚫 #75: BooleanLiteral → "false" [0 tests]
 72| 							rule: { type: "string", nullable: true }
   🚫 #76: ObjectLiteral → "{}" [0 tests]
   🚫 #77: StringLiteral → """" [0 tests]
   🚫 #78: BooleanLiteral → "false" [0 tests]
 73| 						},
 74| 						nullable: true
   🚫 #79: BooleanLiteral → "false" [0 tests]
 75| 					},
 76| 					progress: {
   🚫 #80: ObjectLiteral → "{}" [0 tests]
 77| 						type: "object",
   🚫 #81: StringLiteral → """" [0 tests]
 78| 						properties: {
   🚫 #82: ObjectLiteral → "{}" [0 tests]
 79| 							phase: { type: "string", nullable: true },
   🚫 #83: ObjectLiteral → "{}" [0 tests]
   🚫 #84: StringLiteral → """" [0 tests]
   🚫 #85: BooleanLiteral → "false" [0 tests]
 80| 							percentComplete: { type: "number", nullable: true },
   🚫 #86: ObjectLiteral → "{}" [0 tests]
   🚫 #87: StringLiteral → """" [0 tests]
   🚫 #88: BooleanLiteral → "false" [0 tests]
 81| 							notes: { type: "string", nullable: true }
   🚫 #89: ObjectLiteral → "{}" [0 tests]
   🚫 #90: StringLiteral → """" [0 tests]
   🚫 #91: BooleanLiteral → "false" [0 tests]
 82| 						},
 83| 						nullable: true
   🚫 #92: BooleanLiteral → "false" [0 tests]
 84| 					},
 85| 					attributes: {
   🚫 #93: ObjectLiteral → "{}" [0 tests]
 86| 						type: "array",
   🚫 #94: StringLiteral → """" [0 tests]
 87| 						items: {
   🚫 #95: ObjectLiteral → "{}" [0 tests]
 88| 							type: "object",
   🚫 #96: StringLiteral → """" [0 tests]
 89| 							properties: {
   🚫 #97: ObjectLiteral → "{}" [0 tests]
 90| 								name: { type: "string" },
   🚫 #98: ObjectLiteral → "{}" [0 tests]
   🚫 #99: StringLiteral → """" [0 tests]
 91| 								valueStr: { type: "string", nullable: true },
   🚫 #100: ObjectLiteral → "{}" [0 tests]
   🚫 #101: StringLiteral → """" [0 tests]
   🚫 #102: BooleanLiteral → "false" [0 tests]
 92| 								valueNum: { type: "number", nullable: true },
   🚫 #103: ObjectLiteral → "{}" [0 tests]
   🚫 #104: StringLiteral → """" [0 tests]
   🚫 #105: BooleanLiteral → "false" [0 tests]
 93| 								valueBool: { type: "boolean", nullable: true },
   🚫 #106: ObjectLiteral → "{}" [0 tests]
   🚫 #107: StringLiteral → """" [0 tests]
   🚫 #108: BooleanLiteral → "false" [0 tests]
 94| 								unit: { type: "string", nullable: true }
   🚫 #109: ObjectLiteral → "{}" [0 tests]
   🚫 #110: StringLiteral → """" [0 tests]
   🚫 #111: BooleanLiteral → "false" [0 tests]
 95| 							},
 96| 							required: ["name"]
   🚫 #112: ArrayDeclaration → "[]" [0 tests]
   🚫 #113: StringLiteral → """" [0 tests]
 97| 						},
 98| 						nullable: true
   🚫 #114: BooleanLiteral → "false" [0 tests]
 99| 					},
100| 					useCaseTags: { type: "array", items: { type:"string" }, nullable: true },
   🚫 #115: ObjectLiteral → "{}" [0 tests]
   🚫 #116: StringLiteral → """" [0 tests]
   🚫 #117: ObjectLiteral → "{}" [0 tests]
   🚫 #118: StringLiteral → """" [0 tests]
   🚫 #119: BooleanLiteral → "false" [0 tests]
101| 					relationships: {
   🚫 #120: ObjectLiteral → "{}" [0 tests]
102| 						type: "array",
   🚫 #121: StringLiteral → """" [0 tests]
103| 						items: { type:"object", properties:{ type:{type:"string"}, targetId:{type:"string"} }, required:["type","targetId"] },
   🚫 #122: ObjectLiteral → "{}" [0 tests]
   🚫 #123: StringLiteral → """" [0 tests]
   🚫 #124: ObjectLiteral → "{}" [0 tests]
   🚫 #125: ObjectLiteral → "{}" [0 tests]
   🚫 #126: StringLiteral → """" [0 tests]
   🚫 #127: ObjectLiteral → "{}" [0 tests]
   🚫 #128: StringLiteral → """" [0 tests]
   🚫 #129: ArrayDeclaration → "[]" [0 tests]
   🚫 #130: StringLiteral → """" [0 tests]
   🚫 #131: StringLiteral → """" [0 tests]
104| 						nullable: true
   🚫 #132: BooleanLiteral → "false" [0 tests]
105| 					}
106| 				},
107| 				required: ["id","label","category","confidence"]
   🚫 #133: ArrayDeclaration → "[]" [0 tests]
   🚫 #134: StringLiteral → """" [0 tests]
   🚫 #135: StringLiteral → """" [0 tests]
   🚫 #136: StringLiteral → """" [0 tests]
   🚫 #137: StringLiteral → """" [0 tests]
108| 			}
109| 		},
110| 		global_insights: {
   🚫 #138: ObjectLiteral → "{}" [0 tests]
111| 			type: "array",
   🚫 #139: StringLiteral → """" [0 tests]
112| 			items: {
   🚫 #140: ObjectLiteral → "{}" [0 tests]
113| 				type: "object",
   🚫 #141: StringLiteral → """" [0 tests]
114| 				properties: {
   🚫 #142: ObjectLiteral → "{}" [0 tests]
115| 					name: { type: "string" },
   🚫 #143: ObjectLiteral → "{}" [0 tests]
   🚫 #144: StringLiteral → """" [0 tests]
116| 					category: { type:"string", enum:["progress","safety_issue","facility_asset","object","other"] },
   🚫 #145: ObjectLiteral → "{}" [0 tests]
   🚫 #146: StringLiteral → """" [0 tests]
   🚫 #147: ArrayDeclaration → "[]" [0 tests]
   🚫 #148: StringLiteral → """" [0 tests]
   🚫 #149: StringLiteral → """" [0 tests]
   🚫 #150: StringLiteral → """" [0 tests]
   🚫 #151: StringLiteral → """" [0 tests]
   🚫 #152: StringLiteral → """" [0 tests]
117| 					description: { type: "string" },
   🚫 #153: ObjectLiteral → "{}" [0 tests]
   🚫 #154: StringLiteral → """" [0 tests]
118| 					confidence: { type: "number" },
   🚫 #155: ObjectLiteral → "{}" [0 tests]
   🚫 #156: StringLiteral → """" [0 tests]
119| 					metrics: {
   🚫 #157: ObjectLiteral → "{}" [0 tests]
120| 						type: "array",
   🚫 #158: StringLiteral → """" [0 tests]
121| 						items: { type:"object", properties:{ key:{type:"string"}, value:{type:"number"}, unit:{type:"string",nullable:true} }, required:["key","value"] },
   🚫 #159: ObjectLiteral → "{}" [0 tests]
   🚫 #160: StringLiteral → """" [0 tests]
   🚫 #161: ObjectLiteral → "{}" [0 tests]
   🚫 #162: ObjectLiteral → "{}" [0 tests]
   🚫 #163: StringLiteral → """" [0 tests]
   🚫 #164: ObjectLiteral → "{}" [0 tests]
   🚫 #165: StringLiteral → """" [0 tests]
   🚫 #166: ObjectLiteral → "{}" [0 tests]
   🚫 #167: StringLiteral → """" [0 tests]
   🚫 #168: BooleanLiteral → "false" [0 tests]
   🚫 #169: ArrayDeclaration → "[]" [0 tests]
   🚫 #170: StringLiteral → """" [0 tests]
   🚫 #171: StringLiteral → """" [0 tests]
122| 						nullable: true
   🚫 #172: BooleanLiteral → "false" [0 tests]
123| 					},
124| 					relatedDetectionIds: { type:"array", items:{type:"string"}, nullable: true },
   🚫 #173: ObjectLiteral → "{}" [0 tests]
   🚫 #174: StringLiteral → """" [0 tests]
   🚫 #175: ObjectLiteral → "{}" [0 tests]
   🚫 #176: StringLiteral → """" [0 tests]
   🚫 #177: BooleanLiteral → "false" [0 tests]
125| 					region: {
   🚫 #178: ObjectLiteral → "{}" [0 tests]
126| 						type: "object",
   🚫 #179: StringLiteral → """" [0 tests]
127| 						properties: {
   🚫 #180: ObjectLiteral → "{}" [0 tests]
128| 							bbox: {
   🚫 #181: ObjectLiteral → "{}" [0 tests]
129| 								type: "object",
   🚫 #182: StringLiteral → """" [0 tests]
130| 								properties: { x:{type:"number"}, y:{type:"number"}, width:{type:"number"}, height:{type:"number"} },
   🚫 #183: ObjectLiteral → "{}" [0 tests]
   🚫 #184: ObjectLiteral → "{}" [0 tests]
   🚫 #185: StringLiteral → """" [0 tests]
   🚫 #186: ObjectLiteral → "{}" [0 tests]
   🚫 #187: StringLiteral → """" [0 tests]
   🚫 #188: ObjectLiteral → "{}" [0 tests]
   🚫 #189: StringLiteral → """" [0 tests]
   🚫 #190: ObjectLiteral → "{}" [0 tests]
   🚫 #191: StringLiteral → """" [0 tests]
131| 								required: ["x","y","width","height"],
   🚫 #192: ArrayDeclaration → "[]" [0 tests]
   🚫 #193: StringLiteral → """" [0 tests]
   🚫 #194: StringLiteral → """" [0 tests]
   🚫 #195: StringLiteral → """" [0 tests]
   🚫 #196: StringLiteral → """" [0 tests]
132| 								nullable: true
   🚫 #197: BooleanLiteral → "false" [0 tests]
133| 							}
134| 						},
135| 						nullable: true
   🚫 #198: BooleanLiteral → "false" [0 tests]
136| 					}
137| 				},
138| 				required: ["name","category","description","confidence"]
   🚫 #199: ArrayDeclaration → "[]" [0 tests]
   🚫 #200: StringLiteral → """" [0 tests]
   🚫 #201: StringLiteral → """" [0 tests]
   🚫 #202: StringLiteral → """" [0 tests]
   🚫 #203: StringLiteral → """" [0 tests]
139| 			}
140| 		}
141| 	},
142| 	required: ["detections","global_insights"]
   🚫 #204: ArrayDeclaration → "[]" [0 tests]
   🚫 #205: StringLiteral → """" [0 tests]
   🚫 #206: StringLiteral → """" [0 tests]
143| };
144| 
```

#### 🚫 Coverage Gaps Summary

- **207 uncovered mutants** across 88 lines
- **Most affected lines**: 3, 31, 32, 33, 34
- **Common uncovered operations**: StringLiteral, ObjectLiteral, BooleanLiteral

##### Detailed No Coverage Mutants:
1. **Mutant #0** - Line 3:27-9: `MethodExpression` → ``
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
Be conservative; reflect uncertainty in confidence. Output ONLY JSON (no prose).
``
2. **Mutant #1** - Line 3:27-2: `StringLiteral` → ````
3. **Mutant #2** - Line 31:32-2: `ObjectLiteral` → `{}`
4. **Mutant #3** - Line 32:8-16: `StringLiteral` → `""`
5. **Mutant #4** - Line 33:14-3: `ObjectLiteral` → `{}`
6. **Mutant #5** - Line 34:10-4: `ObjectLiteral` → `{}`
7. **Mutant #6** - Line 35:10-18: `StringLiteral` → `""`
8. **Mutant #7** - Line 36:16-5: `ObjectLiteral` → `{}`
9. **Mutant #8** - Line 37:12-46: `ObjectLiteral` → `{}`
10. **Mutant #9** - Line 37:20-28: `StringLiteral` → `""`
11. **Mutant #10** - Line 37:40-44: `BooleanLiteral` → `false`
12. **Mutant #11** - Line 38:13-47: `ObjectLiteral` → `{}`
13. **Mutant #12** - Line 38:21-29: `StringLiteral` → `""`
14. **Mutant #13** - Line 38:41-45: `BooleanLiteral` → `false`
15. **Mutant #14** - Line 39:15-49: `ObjectLiteral` → `{}`
16. **Mutant #15** - Line 39:23-31: `StringLiteral` → `""`
17. **Mutant #16** - Line 39:43-47: `BooleanLiteral` → `false`
18. **Mutant #17** - Line 40:18-122: `ObjectLiteral` → `{}`
19. **Mutant #18** - Line 40:26-34: `StringLiteral` → `""`
20. **Mutant #19** - Line 40:42-63: `ArrayDeclaration` → `[]`
21. **Mutant #20** - Line 40:43-62: `StringLiteral` → `""`
22. **Mutant #21** - Line 40:75-79: `BooleanLiteral` → `false`
23. **Mutant #22** - Line 40:94-120: `StringLiteral` → `""`
24. **Mutant #23** - Line 42:14-18: `BooleanLiteral` → `false`
25. **Mutant #24** - Line 44:15-4: `ObjectLiteral` → `{}`
26. **Mutant #25** - Line 45:10-17: `StringLiteral` → `""`
27. **Mutant #26** - Line 46:11-5: `ObjectLiteral` → `{}`
28. **Mutant #27** - Line 47:11-19: `StringLiteral` → `""`
29. **Mutant #28** - Line 48:17-6: `ObjectLiteral` → `{}`
30. **Mutant #29** - Line 49:10-28: `ObjectLiteral` → `{}`
31. **Mutant #30** - Line 49:18-26: `StringLiteral` → `""`
32. **Mutant #31** - Line 50:13-31: `ObjectLiteral` → `{}`
33. **Mutant #32** - Line 50:21-29: `StringLiteral` → `""`
34. **Mutant #33** - Line 51:16-103: `ObjectLiteral` → `{}`
35. **Mutant #34** - Line 51:24-32: `StringLiteral` → `""`
36. **Mutant #35** - Line 51:40-101: `ArrayDeclaration` → `[]`
37. **Mutant #36** - Line 51:41-49: `StringLiteral` → `""`
38. **Mutant #37** - Line 51:50-66: `StringLiteral` → `""`
39. **Mutant #38** - Line 51:67-81: `StringLiteral` → `""`
40. **Mutant #39** - Line 51:82-92: `StringLiteral` → `""`
41. **Mutant #40** - Line 51:93-100: `StringLiteral` → `""`
42. **Mutant #41** - Line 52:18-36: `ObjectLiteral` → `{}`
43. **Mutant #42** - Line 52:26-34: `StringLiteral` → `""`
44. **Mutant #43** - Line 53:12-7: `ObjectLiteral` → `{}`
45. **Mutant #44** - Line 54:13-20: `StringLiteral` → `""`
46. **Mutant #45** - Line 55:14-32: `ObjectLiteral` → `{}`
47. **Mutant #46** - Line 55:22-30: `StringLiteral` → `""`
48. **Mutant #47** - Line 58:20-64: `StringLiteral` → `""`
49. **Mutant #48** - Line 59:17-21: `BooleanLiteral` → `false`
50. **Mutant #49** - Line 61:15-7: `ObjectLiteral` → `{}`
51. **Mutant #50** - Line 62:13-20: `StringLiteral` → `""`
52. **Mutant #51** - Line 63:14-104: `ObjectLiteral` → `{}`
53. **Mutant #52** - Line 63:21-29: `StringLiteral` → `""`
54. **Mutant #53** - Line 63:42-82: `ObjectLiteral` → `{}`
55. **Mutant #54** - Line 63:46-61: `ObjectLiteral` → `{}`
56. **Mutant #55** - Line 63:52-60: `StringLiteral` → `""`
57. **Mutant #56** - Line 63:65-80: `ObjectLiteral` → `{}`
58. **Mutant #57** - Line 63:71-79: `StringLiteral` → `""`
59. **Mutant #58** - Line 63:93-102: `ArrayDeclaration` → `[]`
60. **Mutant #59** - Line 63:94-97: `StringLiteral` → `""`
61. **Mutant #60** - Line 63:98-101: `StringLiteral` → `""`
62. **Mutant #61** - Line 64:20-67: `StringLiteral` → `""`
63. **Mutant #62** - Line 65:17-21: `BooleanLiteral` → `false`
64. **Mutant #63** - Line 67:14-7: `ObjectLiteral` → `{}`
65. **Mutant #64** - Line 68:13-21: `StringLiteral` → `""`
66. **Mutant #65** - Line 69:19-8: `ObjectLiteral` → `{}`
67. **Mutant #66** - Line 70:21-56: `ObjectLiteral` → `{}`
68. **Mutant #67** - Line 70:29-38: `StringLiteral` → `""`
69. **Mutant #68** - Line 70:50-54: `BooleanLiteral` → `false`
70. **Mutant #69** - Line 71:18-83: `ObjectLiteral` → `{}`
71. **Mutant #70** - Line 71:26-34: `StringLiteral` → `""`
72. **Mutant #71** - Line 71:42-65: `ArrayDeclaration` → `[]`
73. **Mutant #72** - Line 71:43-48: `StringLiteral` → `""`
74. **Mutant #73** - Line 71:49-57: `StringLiteral` → `""`
75. **Mutant #74** - Line 71:58-64: `StringLiteral` → `""`
76. **Mutant #75** - Line 71:77-81: `BooleanLiteral` → `false`
77. **Mutant #76** - Line 72:14-48: `ObjectLiteral` → `{}`
78. **Mutant #77** - Line 72:22-30: `StringLiteral` → `""`
79. **Mutant #78** - Line 72:42-46: `BooleanLiteral` → `false`
80. **Mutant #79** - Line 74:17-21: `BooleanLiteral` → `false`
81. **Mutant #80** - Line 76:16-7: `ObjectLiteral` → `{}`
82. **Mutant #81** - Line 77:13-21: `StringLiteral` → `""`
83. **Mutant #82** - Line 78:19-8: `ObjectLiteral` → `{}`
84. **Mutant #83** - Line 79:15-49: `ObjectLiteral` → `{}`
85. **Mutant #84** - Line 79:23-31: `StringLiteral` → `""`
86. **Mutant #85** - Line 79:43-47: `BooleanLiteral` → `false`
87. **Mutant #86** - Line 80:25-59: `ObjectLiteral` → `{}`
88. **Mutant #87** - Line 80:33-41: `StringLiteral` → `""`
89. **Mutant #88** - Line 80:53-57: `BooleanLiteral` → `false`
90. **Mutant #89** - Line 81:15-49: `ObjectLiteral` → `{}`
91. **Mutant #90** - Line 81:23-31: `StringLiteral` → `""`
92. **Mutant #91** - Line 81:43-47: `BooleanLiteral` → `false`
93. **Mutant #92** - Line 83:17-21: `BooleanLiteral` → `false`
94. **Mutant #93** - Line 85:18-7: `ObjectLiteral` → `{}`
95. **Mutant #94** - Line 86:13-20: `StringLiteral` → `""`
96. **Mutant #95** - Line 87:14-8: `ObjectLiteral` → `{}`
97. **Mutant #96** - Line 88:14-22: `StringLiteral` → `""`
98. **Mutant #97** - Line 89:20-9: `ObjectLiteral` → `{}`
99. **Mutant #98** - Line 90:15-33: `ObjectLiteral` → `{}`
100. **Mutant #99** - Line 90:23-31: `StringLiteral` → `""`
101. **Mutant #100** - Line 91:19-53: `ObjectLiteral` → `{}`
102. **Mutant #101** - Line 91:27-35: `StringLiteral` → `""`
103. **Mutant #102** - Line 91:47-51: `BooleanLiteral` → `false`
104. **Mutant #103** - Line 92:19-53: `ObjectLiteral` → `{}`
105. **Mutant #104** - Line 92:27-35: `StringLiteral` → `""`
106. **Mutant #105** - Line 92:47-51: `BooleanLiteral` → `false`
107. **Mutant #106** - Line 93:20-55: `ObjectLiteral` → `{}`
108. **Mutant #107** - Line 93:28-37: `StringLiteral` → `""`
109. **Mutant #108** - Line 93:49-53: `BooleanLiteral` → `false`
110. **Mutant #109** - Line 94:15-49: `ObjectLiteral` → `{}`
111. **Mutant #110** - Line 94:23-31: `StringLiteral` → `""`
112. **Mutant #111** - Line 94:43-47: `BooleanLiteral` → `false`
113. **Mutant #112** - Line 96:18-26: `ArrayDeclaration` → `[]`
114. **Mutant #113** - Line 96:19-25: `StringLiteral` → `""`
115. **Mutant #114** - Line 98:17-21: `BooleanLiteral` → `false`
116. **Mutant #115** - Line 100:19-78: `ObjectLiteral` → `{}`
117. **Mutant #116** - Line 100:27-34: `StringLiteral` → `""`
118. **Mutant #117** - Line 100:43-60: `ObjectLiteral` → `{}`
119. **Mutant #118** - Line 100:50-58: `StringLiteral` → `""`
120. **Mutant #119** - Line 100:72-76: `BooleanLiteral` → `false`
121. **Mutant #120** - Line 101:21-7: `ObjectLiteral` → `{}`
122. **Mutant #121** - Line 102:13-20: `StringLiteral` → `""`
123. **Mutant #122** - Line 103:14-124: `ObjectLiteral` → `{}`
124. **Mutant #123** - Line 103:21-29: `StringLiteral` → `""`
125. **Mutant #124** - Line 103:42-92: `ObjectLiteral` → `{}`
126. **Mutant #125** - Line 103:49-64: `ObjectLiteral` → `{}`
127. **Mutant #126** - Line 103:55-63: `StringLiteral` → `""`
128. **Mutant #127** - Line 103:75-90: `ObjectLiteral` → `{}`
129. **Mutant #128** - Line 103:81-89: `StringLiteral` → `""`
130. **Mutant #129** - Line 103:103-122: `ArrayDeclaration` → `[]`
131. **Mutant #130** - Line 103:104-110: `StringLiteral` → `""`
132. **Mutant #131** - Line 103:111-121: `StringLiteral` → `""`
133. **Mutant #132** - Line 104:17-21: `BooleanLiteral` → `false`
134. **Mutant #133** - Line 107:15-53: `ArrayDeclaration` → `[]`
135. **Mutant #134** - Line 107:16-20: `StringLiteral` → `""`
136. **Mutant #135** - Line 107:21-28: `StringLiteral` → `""`
137. **Mutant #136** - Line 107:29-39: `StringLiteral` → `""`
138. **Mutant #137** - Line 107:40-52: `StringLiteral` → `""`
139. **Mutant #138** - Line 110:20-4: `ObjectLiteral` → `{}`
140. **Mutant #139** - Line 111:10-17: `StringLiteral` → `""`
141. **Mutant #140** - Line 112:11-5: `ObjectLiteral` → `{}`
142. **Mutant #141** - Line 113:11-19: `StringLiteral` → `""`
143. **Mutant #142** - Line 114:17-6: `ObjectLiteral` → `{}`
144. **Mutant #143** - Line 115:12-30: `ObjectLiteral` → `{}`
145. **Mutant #144** - Line 115:20-28: `StringLiteral` → `""`
146. **Mutant #145** - Line 116:16-101: `ObjectLiteral` → `{}`
147. **Mutant #146** - Line 116:23-31: `StringLiteral` → `""`
148. **Mutant #147** - Line 116:38-99: `ArrayDeclaration` → `[]`
149. **Mutant #148** - Line 116:39-49: `StringLiteral` → `""`
150. **Mutant #149** - Line 116:50-64: `StringLiteral` → `""`
151. **Mutant #150** - Line 116:65-81: `StringLiteral` → `""`
152. **Mutant #151** - Line 116:82-90: `StringLiteral` → `""`
153. **Mutant #152** - Line 116:91-98: `StringLiteral` → `""`
154. **Mutant #153** - Line 117:19-37: `ObjectLiteral` → `{}`
155. **Mutant #154** - Line 117:27-35: `StringLiteral` → `""`
156. **Mutant #155** - Line 118:18-36: `ObjectLiteral` → `{}`
157. **Mutant #156** - Line 118:26-34: `StringLiteral` → `""`
158. **Mutant #157** - Line 119:15-7: `ObjectLiteral` → `{}`
159. **Mutant #158** - Line 120:13-20: `StringLiteral` → `""`
160. **Mutant #159** - Line 121:14-152: `ObjectLiteral` → `{}`
161. **Mutant #160** - Line 121:21-29: `StringLiteral` → `""`
162. **Mutant #161** - Line 121:42-124: `ObjectLiteral` → `{}`
163. **Mutant #162** - Line 121:48-63: `ObjectLiteral` → `{}`
164. **Mutant #163** - Line 121:54-62: `StringLiteral` → `""`
165. **Mutant #164** - Line 121:71-86: `ObjectLiteral` → `{}`
166. **Mutant #165** - Line 121:77-85: `StringLiteral` → `""`
167. **Mutant #166** - Line 121:93-122: `ObjectLiteral` → `{}`
168. **Mutant #167** - Line 121:99-107: `StringLiteral` → `""`
169. **Mutant #168** - Line 121:117-121: `BooleanLiteral` → `false`
170. **Mutant #169** - Line 121:135-150: `ArrayDeclaration` → `[]`
171. **Mutant #170** - Line 121:136-141: `StringLiteral` → `""`
172. **Mutant #171** - Line 121:142-149: `StringLiteral` → `""`
173. **Mutant #172** - Line 122:17-21: `BooleanLiteral` → `false`
174. **Mutant #173** - Line 124:27-82: `ObjectLiteral` → `{}`
175. **Mutant #174** - Line 124:34-41: `StringLiteral` → `""`
176. **Mutant #175** - Line 124:49-64: `ObjectLiteral` → `{}`
177. **Mutant #176** - Line 124:55-63: `StringLiteral` → `""`
178. **Mutant #177** - Line 124:76-80: `BooleanLiteral` → `false`
179. **Mutant #178** - Line 125:14-7: `ObjectLiteral` → `{}`
180. **Mutant #179** - Line 126:13-21: `StringLiteral` → `""`
181. **Mutant #180** - Line 127:19-8: `ObjectLiteral` → `{}`
182. **Mutant #181** - Line 128:14-9: `ObjectLiteral` → `{}`
183. **Mutant #182** - Line 129:15-23: `StringLiteral` → `""`
184. **Mutant #183** - Line 130:21-108: `ObjectLiteral` → `{}`
185. **Mutant #184** - Line 130:25-40: `ObjectLiteral` → `{}`
186. **Mutant #185** - Line 130:31-39: `StringLiteral` → `""`
187. **Mutant #186** - Line 130:44-59: `ObjectLiteral` → `{}`
188. **Mutant #187** - Line 130:50-58: `StringLiteral` → `""`
189. **Mutant #188** - Line 130:67-82: `ObjectLiteral` → `{}`
190. **Mutant #189** - Line 130:73-81: `StringLiteral` → `""`
191. **Mutant #190** - Line 130:91-106: `ObjectLiteral` → `{}`
192. **Mutant #191** - Line 130:97-105: `StringLiteral` → `""`
193. **Mutant #192** - Line 131:19-45: `ArrayDeclaration` → `[]`
194. **Mutant #193** - Line 131:20-23: `StringLiteral` → `""`
195. **Mutant #194** - Line 131:24-27: `StringLiteral` → `""`
196. **Mutant #195** - Line 131:28-35: `StringLiteral` → `""`
197. **Mutant #196** - Line 131:36-44: `StringLiteral` → `""`
198. **Mutant #197** - Line 132:19-23: `BooleanLiteral` → `false`
199. **Mutant #198** - Line 135:17-21: `BooleanLiteral` → `false`
200. **Mutant #199** - Line 138:15-61: `ArrayDeclaration` → `[]`
201. **Mutant #200** - Line 138:16-22: `StringLiteral` → `""`
202. **Mutant #201** - Line 138:23-33: `StringLiteral` → `""`
203. **Mutant #202** - Line 138:34-47: `StringLiteral` → `""`
204. **Mutant #203** - Line 138:48-60: `StringLiteral` → `""`
205. **Mutant #204** - Line 142:12-44: `ArrayDeclaration` → `[]`
206. **Mutant #205** - Line 142:13-25: `StringLiteral` → `""`
207. **Mutant #206** - Line 142:26-43: `StringLiteral` → `""`

---

### 🔴 src/batch-processor.js

**Overall Health**: 🔴 Needs Improvement | **Mutation Score**: 52.8% | **Coverage**: 97.3%

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Killed | 19 | 51.4% |
| ❌ Survived | 2 | 5.4% |
| 🚫 No Coverage | 1 | 2.7% |
| **Total** | **37** | **100%** |

#### 📄 Source Code with Mutation Analysis

```javascript
  1| /**
  2|  * Batch processor for concurrent image analysis with rate limiting
  3|  */
  4| 
  5| const MAX_CONCURRENT = 10;
  6| 
  7| /**
  8|  * Process multiple images with concurrency control
  9|  * @param {Array} images - Array of image objects from session
 10|  * @param {Function} processOne - Async function to process a single image (imageObj) => Promise<result>
 11|  * @param {Function} onProgress - Optional callback for progress updates (imageObj, result, error) => void
 12|  * @returns {Promise<Array>} Results array (includes errors)
 13|  */
 14| export async function processBatch(images, processOne, onProgress = null) {
   ✅ #207: BlockStatement → "{}" [5 tests]
 15| 	const results = new Array(images.length);
   ❌ #208: ArrayDeclaration → "new Array()" [5 tests]
 16| 	let activeCount = 0;
 17| 	let nextIndex = 0;
 18| 
 19| 	return new Promise((resolve) => {
   ⚠️ #209: BlockStatement → "{}" [5 tests]
 20| 		const processNext = async () => {
   ⚠️ #210: BlockStatement → "{}" [5 tests]
 21| 			if (nextIndex >= images.length) {
   ✅ #211: ConditionalExpression → "true" [5 tests]
   ✅ #213: EqualityOperator → "nextIndex > images.length" [5 tests]
   ✅ #214: EqualityOperator → "nextIndex < images.length" [5 tests]
   ⚠️ #212: ConditionalExpression → "false" [5 tests]
   ⚠️ #215: BlockStatement → "{}" [5 tests]
 22| 				// All items queued, check if all done
 23| 				if (activeCount === 0) {
   ✅ #216: ConditionalExpression → "true" [5 tests]
   ✅ #218: EqualityOperator → "activeCount !== 0" [5 tests]
   ⚠️ #217: ConditionalExpression → "false" [5 tests]
   ⚠️ #219: BlockStatement → "{}" [5 tests]
 24| 					resolve(results);
 25| 				}
 26| 				return;
 27| 			}
 28| 
 29| 			const currentIndex = nextIndex++;
   ⚠️ #220: UpdateOperator → "nextIndex--" [5 tests]
 30| 			const image = images[currentIndex];
 31| 			activeCount++;
   ⚠️ #221: UpdateOperator → "activeCount--" [5 tests]
 32| 
 33| 			try {
   ✅ #222: BlockStatement → "{}" [5 tests]
 34| 				const result = await processOne(image);
 35| 				results[currentIndex] = { success: true, data: result, image };
   ✅ #223: ObjectLiteral → "{}" [5 tests]
   ✅ #224: BooleanLiteral → "false" [5 tests]
 36| 				if (onProgress) {
   ✅ #225: ConditionalExpression → "true" [5 tests]
   ✅ #227: BlockStatement → "{}" [1 tests]
   ✅ #226: ConditionalExpression → "false" [5 tests]
 37| 					onProgress(image, result, null);
 38| 				}
 39| 			} catch (error) {
   ✅ #228: BlockStatement → "{}" [1 tests]
 40| 				results[currentIndex] = { success: false, error, image };
   ✅ #229: ObjectLiteral → "{}" [1 tests]
   ✅ #230: BooleanLiteral → "true" [1 tests]
 41| 				if (onProgress) {
   🚫 #233: BlockStatement → "{}" [0 tests]
   ✅ #231: ConditionalExpression → "true" [1 tests]
   ❌ #232: ConditionalExpression → "false" [1 tests]
 42| 					onProgress(image, null, error);
 43| 				}
 44| 			} finally {
   ⚠️ #234: BlockStatement → "{}" [5 tests]
 45| 				activeCount--;
   ⚠️ #235: UpdateOperator → "activeCount++" [5 tests]
 46| 				processNext(); // Start next item
 47| 			}
 48| 		};
 49| 
 50| 		// Start initial batch of workers
 51| 		const initialWorkers = Math.min(MAX_CONCURRENT, images.length);
   ✅ #236: MethodExpression → "Math.max(MAX_CONCURRENT, images.length)" [5 tests]
 52| 		for (let i = 0; i < initialWorkers; i++) {
   ✅ #238: EqualityOperator → "i <= initialWorkers" [5 tests]
   ⚠️ #237: ConditionalExpression → "false" [5 tests]
   ⚠️ #239: EqualityOperator → "i >= initialWorkers" [5 tests]
   ⚠️ #240: UpdateOperator → "i--" [5 tests]
   ⚠️ #241: BlockStatement → "{}" [5 tests]
 53| 			processNext();
 54| 		}
 55| 	});
 56| }
 57| 
 58| /**
 59|  * Create a delay promise for rate limiting
 60|  * @param {number} ms - Milliseconds to delay
 61|  * @returns {Promise<void>}
 62|  */
 63| export function delay(ms) {
   ✅ #242: BlockStatement → "{}" [6 tests]
 64| 	return new Promise(resolve => setTimeout(resolve, ms));
   ⚠️ #243: ArrowFunction → "() => undefined" [6 tests]
 65| }
 66| 
```

#### ❌ Critical Survived Mutants (First 2)

1. **Mutant #208** - Line 15:18-42
   - **Mutator**: `ArrayDeclaration` → `new Array()`
   - **Issue**: Unknown
   - **Fix**: Add specific test cases to kill this mutant
   - **Tests that should have caught this**: 87, 88, 89, 90, 91

2. **Mutant #232** - Line 41:9-19
   - **Mutator**: `ConditionalExpression` → `false`
   - **Issue**: Unknown
   - **Fix**: Add test cases for both true/false conditions
   - **Tests that should have caught this**: 88

#### 🚫 Coverage Gaps Summary

- **1 uncovered mutants** across 1 lines
- **Most affected lines**: 41
- **Common uncovered operations**: BlockStatement

##### Detailed No Coverage Mutants:
1. **Mutant #233** - Line 41:21-6: `BlockStatement` → `{}`

#### ✅ Successfully Killed Mutants Summary

- **19 mutants killed** by tests
- **Average tests per mutant**: 1.0
- **Most effective test**: 87 (killed 10 mutants)
- **Top mutator types killed**: BlockStatement, ConditionalExpression, EqualityOperator

---

### 🔴 src/export.js

**Overall Health**: 🔴 Needs Improvement | **Mutation Score**: 54.3% | **Coverage**: 91.3%

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Killed | 51 | 49.5% |
| ❌ Survived | 43 | 41.7% |
| 🚫 No Coverage | 9 | 8.7% |
| **Total** | **103** | **100%** |

#### 📄 Source Code with Mutation Analysis

```javascript
  1| /**
  2|  * CSV and JSON export utilities for session data
  3|  */
  4| 
  5| /**
  6|  * Export session data as JSON
  7|  * @param {object} session - Session state with aggregates
  8|  * @returns {string} JSON string
  9|  */
 10| export function exportSessionJSON(session) {
   ✅ #244: BlockStatement → "{}" [2 tests]
 11| 	const timestamp = new Date().toISOString();
 12| 	const progress = getProgressCounts(session);
 13| 
 14| 	const exportData = {
   ✅ #245: ObjectLiteral → "{}" [2 tests]
 15| 		sessionId: session.sessionId,
 16| 		timestamp,
 17| 		totalImages: session.images.length,
 18| 		imagesAnalyzed: progress.completed,
 19| 		imagesError: progress.error,
 20| 		sessionAggregates: session.sessionAggregates,
 21| 		images: session.images
   ✅ #246: MethodExpression → "session.images" [2 tests]
 22| 			.filter(img => img.status === 'completed')
   ✅ #247: ArrowFunction → "() => undefined" [2 tests]
   ✅ #248: ConditionalExpression → "true" [2 tests]
   ✅ #249: ConditionalExpression → "false" [2 tests]
   ✅ #250: EqualityOperator → "img.status !== 'completed'" [2 tests]
   ✅ #251: StringLiteral → """" [2 tests]
 23| 			.map(img => ({
   ✅ #252: ArrowFunction → "() => undefined" [2 tests]
   ✅ #253: ObjectLiteral → "{}" [2 tests]
 24| 				imageId: img.id,
 25| 				filename: img.filename,
 26| 				status: img.status,
 27| 				width: img.naturalWidth,
 28| 				height: img.naturalHeight,
 29| 				detections: img.detections,
 30| 				global_insights: img.parsedData?.global_insights || []
   ❌ #255: ConditionalExpression → "false" [2 tests]
   ❌ #254: ConditionalExpression → "true" [2 tests]
   ❌ #256: LogicalOperator → "img.parsedData?.global_insights && []" [2 tests]
   ❌ #257: OptionalChaining → "img.parsedData.global_insights" [2 tests]
   ❌ #258: ArrayDeclaration → "["Stryker was here"]" [1 tests]
 31| 			}))
 32| 	};
 33| 
 34| 	return JSON.stringify(exportData, null, 2);
 35| }
 36| 
 37| /**
 38|  * Export session data as CSV
 39|  * @param {object} session - Session state with aggregates
 40|  * @returns {string} CSV string
 41|  */
 42| export function exportSessionCSV(session) {
   ✅ #259: BlockStatement → "{}" [4 tests]
 43| 	const rows = [];
   ✅ #260: ArrayDeclaration → "["Stryker was here"]" [4 tests]
 44| 	
 45| 	// Header row
 46| 	rows.push([
   ✅ #261: ArrayDeclaration → "[]" [4 tests]
 47| 		'SessionID',
   ✅ #262: StringLiteral → """" [4 tests]
 48| 		'ImageID',
   ✅ #263: StringLiteral → """" [4 tests]
 49| 		'ImageName',
   ❌ #264: StringLiteral → """" [4 tests]
 50| 		'DetectionID',
   ✅ #265: StringLiteral → """" [4 tests]
 51| 		'Label',
   ❌ #266: StringLiteral → """" [4 tests]
 52| 		'Category',
   ❌ #267: StringLiteral → """" [4 tests]
 53| 		'Confidence',
   ❌ #268: StringLiteral → """" [4 tests]
 54| 		'SafetySeverity',
   ❌ #269: StringLiteral → """" [4 tests]
 55| 		'SafetyRule',
   ❌ #270: StringLiteral → """" [4 tests]
 56| 		'ProgressPhase',
   ❌ #271: StringLiteral → """" [4 tests]
 57| 		'ProgressPercent'
   ❌ #272: StringLiteral → """" [4 tests]
 58| 	].join(','));
   ❌ #273: StringLiteral → """" [4 tests]
 59| 
 60| 	// Data rows
 61| 	session.images.forEach(img => {
   ✅ #274: BlockStatement → "{}" [4 tests]
 62| 		if (img.status === 'completed' && img.detections) {
   ❌ #275: ConditionalExpression → "true" [4 tests]
   ✅ #276: ConditionalExpression → "false" [4 tests]
   ❌ #277: LogicalOperator → "img.status === 'completed' || img.detections" [4 tests]
   ❌ #278: ConditionalExpression → "true" [4 tests]
   ✅ #279: EqualityOperator → "img.status !== 'completed'" [4 tests]
   ✅ #280: StringLiteral → """" [4 tests]
   ✅ #281: BlockStatement → "{}" [4 tests]
 63| 			img.detections.forEach(det => {
   ✅ #282: BlockStatement → "{}" [3 tests]
 64| 				const row = [
   ✅ #283: ArrayDeclaration → "[]" [3 tests]
 65| 					escapeCsvField(session.sessionId),
 66| 					escapeCsvField(img.id),
 67| 					escapeCsvField(img.filename),
 68| 					escapeCsvField(det.id || ''),
   🚫 #287: StringLiteral → ""Stryker was here!"" [0 tests]
   ❌ #284: ConditionalExpression → "true" [3 tests]
   ❌ #285: ConditionalExpression → "false" [3 tests]
   ❌ #286: LogicalOperator → "det.id && ''" [3 tests]
 69| 					escapeCsvField(det.label || ''),
   🚫 #291: StringLiteral → ""Stryker was here!"" [0 tests]
   ✅ #288: ConditionalExpression → "true" [3 tests]
   ✅ #289: ConditionalExpression → "false" [3 tests]
   ✅ #290: LogicalOperator → "det.label && ''" [3 tests]
 70| 					escapeCsvField(det.category || ''),
   🚫 #295: StringLiteral → ""Stryker was here!"" [0 tests]
   ❌ #292: ConditionalExpression → "true" [3 tests]
   ❌ #293: ConditionalExpression → "false" [3 tests]
   ❌ #294: LogicalOperator → "det.category && ''" [3 tests]
 71| 					det.confidence != null ? det.confidence.toFixed(4) : '',
   🚫 #299: StringLiteral → ""Stryker was here!"" [0 tests]
   ❌ #296: ConditionalExpression → "true" [3 tests]
   ✅ #297: ConditionalExpression → "false" [3 tests]
   ✅ #298: EqualityOperator → "det.confidence == null" [3 tests]
 72| 					det.safety?.severity ? escapeCsvField(det.safety.severity) : '',
   ✅ #300: OptionalChaining → "det.safety.severity" [3 tests]
   ❌ #301: StringLiteral → ""Stryker was here!"" [3 tests]
 73| 					det.safety?.rule ? escapeCsvField(det.safety.rule) : '',
   ✅ #302: OptionalChaining → "det.safety.rule" [3 tests]
   ❌ #303: StringLiteral → ""Stryker was here!"" [3 tests]
 74| 					det.progress?.phase ? escapeCsvField(det.progress.phase) : '',
   ❌ #305: StringLiteral → ""Stryker was here!"" [3 tests]
   ✅ #304: OptionalChaining → "det.progress.phase" [3 tests]
 75| 					det.progress?.percentComplete != null ? det.progress.percentComplete.toFixed(2) : ''
   ✅ #307: ConditionalExpression → "false" [3 tests]
   ✅ #306: ConditionalExpression → "true" [3 tests]
   ✅ #308: EqualityOperator → "det.progress?.percentComplete == null" [3 tests]
   ✅ #309: OptionalChaining → "det.progress.percentComplete" [3 tests]
   ❌ #310: StringLiteral → ""Stryker was here!"" [3 tests]
 76| 				];
 77| 				rows.push(row.join(','));
   ❌ #311: StringLiteral → """" [3 tests]
 78| 			});
 79| 		}
 80| 	});
 81| 
 82| 	return rows.join('\n');
   ✅ #312: StringLiteral → """" [4 tests]
 83| }
 84| 
 85| /**
 86|  * Download exported data as a file
 87|  * @param {string} content - File content
 88|  * @param {string} filename - Suggested filename
 89|  * @param {string} mimeType - MIME type
 90|  */
 91| export function downloadFile(content, filename, mimeType) {
   🚫 #313: BlockStatement → "{}" [0 tests]
 92| 	const blob = new Blob([content], { type: mimeType });
   🚫 #314: ArrayDeclaration → "[]" [0 tests]
   🚫 #315: ObjectLiteral → "{}" [0 tests]
 93| 	const url = URL.createObjectURL(blob);
 94| 	const link = document.createElement('a');
   🚫 #316: StringLiteral → """" [0 tests]
 95| 	link.href = url;
 96| 	link.download = filename;
 97| 	document.body.appendChild(link);
 98| 	link.click();
 99| 	document.body.removeChild(link);
100| 	URL.revokeObjectURL(url);
101| }
102| 
103| /**
104|  * Escape CSV field value
105|  * @param {string} value - Field value
106|  * @returns {string} Escaped value
107|  */
108| function escapeCsvField(value) {
   ✅ #317: BlockStatement → "{}" [3 tests]
109| 	if (value == null) return '';
   🚫 #321: StringLiteral → ""Stryker was here!"" [0 tests]
   ✅ #318: ConditionalExpression → "true" [3 tests]
   ❌ #319: ConditionalExpression → "false" [3 tests]
   ✅ #320: EqualityOperator → "value != null" [3 tests]
110| 	const str = String(value);
111| 	if (str.includes(',') || str.includes('"') || str.includes('\n')) {
   ❌ #322: ConditionalExpression → "true" [3 tests]
   ✅ #323: ConditionalExpression → "false" [3 tests]
   ✅ #324: LogicalOperator → "(str.includes(',') || str.includes('"')) && str.includes('\n')" [3 tests]
   ✅ #325: ConditionalExpression → "false" [3 tests]
   ✅ #326: LogicalOperator → "str.includes(',') && str.includes('"')" [3 tests]
   ❌ #327: StringLiteral → """" [3 tests]
   ❌ #328: StringLiteral → """" [3 tests]
   ❌ #329: StringLiteral → """" [3 tests]
   ✅ #330: BlockStatement → "{}" [1 tests]
112| 		return `"${str.replace(/"/g, '""')}"`;
   ✅ #331: StringLiteral → "``" [1 tests]
   ❌ #332: StringLiteral → """" [1 tests]
113| 	}
114| 	return str;
115| }
116| 
117| /**
118|  * Get progress counts helper
119|  * @param {object} session - Session state
120|  * @returns {object} Progress counts
121|  */
122| function getProgressCounts(session) {
   ✅ #333: BlockStatement → "{}" [2 tests]
123| 	const completed = session.images.filter(img => img.status === 'completed').length;
   ❌ #334: MethodExpression → "session.images" [2 tests]
   ✅ #335: ArrowFunction → "() => undefined" [2 tests]
   ❌ #336: ConditionalExpression → "true" [2 tests]
   ✅ #338: EqualityOperator → "img.status !== 'completed'" [2 tests]
   ✅ #337: ConditionalExpression → "false" [2 tests]
   ✅ #339: StringLiteral → """" [2 tests]
124| 	const error = session.images.filter(img => img.status === 'error').length;
   ❌ #340: MethodExpression → "session.images" [2 tests]
   ❌ #341: ArrowFunction → "() => undefined" [2 tests]
   ❌ #342: ConditionalExpression → "true" [2 tests]
   ❌ #343: ConditionalExpression → "false" [2 tests]
   ❌ #344: EqualityOperator → "img.status !== 'error'" [2 tests]
   ❌ #345: StringLiteral → """" [2 tests]
125| 	return { completed, error };
   ✅ #346: ObjectLiteral → "{}" [2 tests]
126| }
127| 
```

#### ❌ Critical Survived Mutants (First 10)

1. **Mutant #255** - Line 30:22-59
   - **Mutator**: `ConditionalExpression` → `false`
   - **Issue**: Unknown
   - **Fix**: Add test cases for both true/false conditions
   - **Tests that should have caught this**: 73, 74

2. **Mutant #254** - Line 30:22-59
   - **Mutator**: `ConditionalExpression` → `true`
   - **Issue**: Unknown
   - **Fix**: Add test cases for both true/false conditions
   - **Tests that should have caught this**: 73, 74

3. **Mutant #256** - Line 30:22-59
   - **Mutator**: `LogicalOperator` → `img.parsedData?.global_insights && []`
   - **Issue**: Unknown
   - **Fix**: Test all logical combinations (&&, ||)
   - **Tests that should have caught this**: 73, 74

4. **Mutant #257** - Line 30:22-53
   - **Mutator**: `OptionalChaining` → `img.parsedData.global_insights`
   - **Issue**: Unknown
   - **Fix**: Add specific test cases to kill this mutant
   - **Tests that should have caught this**: 73, 74

5. **Mutant #258** - Line 30:57-59
   - **Mutator**: `ArrayDeclaration` → `["Stryker was here"]`
   - **Issue**: Unknown
   - **Fix**: Add specific test cases to kill this mutant
   - **Tests that should have caught this**: 74

6. **Mutant #264** - Line 49:3-14
   - **Mutator**: `StringLiteral` → `""`
   - **Issue**: Unknown
   - **Fix**: Test with different string values including empty strings
   - **Tests that should have caught this**: 75, 76, 77, 78

7. **Mutant #266** - Line 51:3-10
   - **Mutator**: `StringLiteral` → `""`
   - **Issue**: Unknown
   - **Fix**: Test with different string values including empty strings
   - **Tests that should have caught this**: 75, 76, 77, 78

8. **Mutant #267** - Line 52:3-13
   - **Mutator**: `StringLiteral` → `""`
   - **Issue**: Unknown
   - **Fix**: Test with different string values including empty strings
   - **Tests that should have caught this**: 75, 76, 77, 78

9. **Mutant #268** - Line 53:3-15
   - **Mutator**: `StringLiteral` → `""`
   - **Issue**: Unknown
   - **Fix**: Test with different string values including empty strings
   - **Tests that should have caught this**: 75, 76, 77, 78

10. **Mutant #269** - Line 54:3-19
   - **Mutator**: `StringLiteral` → `""`
   - **Issue**: Unknown
   - **Fix**: Test with different string values including empty strings
   - **Tests that should have caught this**: 75, 76, 77, 78

#### 🚫 Coverage Gaps Summary

- **9 uncovered mutants** across 8 lines
- **Most affected lines**: 68, 69, 70, 71, 91
- **Common uncovered operations**: StringLiteral, BlockStatement, ArrayDeclaration

##### Detailed No Coverage Mutants:
1. **Mutant #287** - Line 68:31-33: `StringLiteral` → `"Stryker was here!"`
2. **Mutant #291** - Line 69:34-36: `StringLiteral` → `"Stryker was here!"`
3. **Mutant #295** - Line 70:37-39: `StringLiteral` → `"Stryker was here!"`
4. **Mutant #299** - Line 71:59-61: `StringLiteral` → `"Stryker was here!"`
5. **Mutant #313** - Line 91:59-2: `BlockStatement` → `{}`
6. **Mutant #314** - Line 92:24-33: `ArrayDeclaration` → `[]`
7. **Mutant #315** - Line 92:35-53: `ObjectLiteral` → `{}`
8. **Mutant #316** - Line 94:38-41: `StringLiteral` → `""`
9. **Mutant #321** - Line 109:28-30: `StringLiteral` → `"Stryker was here!"`

#### ✅ Successfully Killed Mutants Summary

- **51 mutants killed** by tests
- **Average tests per mutant**: 1.0
- **Most effective test**: 75 (killed 28 mutants)
- **Top mutator types killed**: ConditionalExpression, BlockStatement, StringLiteral

---

### 🟢 src/geometry.js

**Overall Health**: 🟢 Excellent | **Mutation Score**: 84.9% | **Coverage**: 98.3%

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Killed | 146 | 83.4% |
| ❌ Survived | 26 | 14.9% |
| 🚫 No Coverage | 3 | 1.7% |
| **Total** | **175** | **100%** |

#### 📄 Source Code with Mutation Analysis

```javascript
  1| import { clamp } from './math.js';
  2| 
  3| /**
  4|  * Convert Gemini's [ymin, xmin, ymax, xmax] format to {x, y, width, height}
  5|  * Gemini uses: top-left origin, y-first order, normalized 0-1000
  6|  */
  7| function parseGeminiBbox(bbox) {
   ✅ #347: BlockStatement → "{}" [4 tests]
  8| 	if (!Array.isArray(bbox) || bbox.length !== 4) return null;
   ✅ #348: ConditionalExpression → "true" [4 tests]
   ❌ #349: ConditionalExpression → "false" [4 tests]
   ❌ #350: LogicalOperator → "!Array.isArray(bbox) && bbox.length !== 4" [4 tests]
   ✅ #351: BooleanLiteral → "Array.isArray(bbox)" [4 tests]
   ❌ #352: ConditionalExpression → "false" [4 tests]
   ✅ #353: EqualityOperator → "bbox.length === 4" [4 tests]
  9| 	const [ymin, xmin, ymax, xmax] = bbox;
 10| 	if (![ymin, xmin, ymax, xmax].every(Number.isFinite)) return null;
   ✅ #354: BooleanLiteral → "[ymin, xmin, ymax, xmax].every(Number.isFinite)" [4 tests]
   ❌ #356: ConditionalExpression → "false" [4 tests]
   ✅ #355: ConditionalExpression → "true" [4 tests]
   ❌ #357: MethodExpression → "[ymin, xmin, ymax, xmax].some(Number.isFinite)" [4 tests]
   ❌ #358: ArrayDeclaration → "[]" [4 tests]
 11| 	
 12| 	return {
   ✅ #359: ObjectLiteral → "{}" [3 tests]
 13| 		x: xmin,
 14| 		y: ymin,
 15| 		width: Math.max(0, xmax - xmin),
   ✅ #360: MethodExpression → "Math.min(0, xmax - xmin)" [3 tests]
   ✅ #361: ArithmeticOperator → "xmax + xmin" [3 tests]
 16| 		height: Math.max(0, ymax - ymin)
   ✅ #362: MethodExpression → "Math.min(0, ymax - ymin)" [3 tests]
   ✅ #363: ArithmeticOperator → "ymax + ymin" [3 tests]
 17| 	};
 18| }
 19| 
 20| export function toCanvasBox(
 21| 	b,
 22| 	coordSystem,
 23| 	displayScaleX,
 24| 	displayScaleY,
 25| 	imgW,
 26| 	imgH,
 27| 	origin = 'top-left',
   ❌ #364: StringLiteral → """" [2 tests]
 28| 	canvasWidth,
 29| 	canvasHeight
 30| ) {
   ✅ #365: BlockStatement → "{}" [11 tests]
 31| 	// If b is an array, it's Gemini's [ymin, xmin, ymax, xmax] format
 32| 	const box = Array.isArray(b) ? parseGeminiBbox(b) : b;
 33| 	
 34| 	const normalized = normalizeBox(box, coordSystem, imgW, imgH);
 35| 	if (!normalized) return null;
   ✅ #366: BooleanLiteral → "normalized" [11 tests]
   ✅ #367: ConditionalExpression → "true" [11 tests]
   ✅ #368: ConditionalExpression → "false" [11 tests]
 36| 
 37| 	const oriented = orientBox(normalized, origin, imgH);
 38| 	const scaled = scaleBox(oriented, displayScaleX, displayScaleY);
 39| 	return clampBox(scaled, canvasWidth, canvasHeight);
 40| }
 41| 
 42| export function toCanvasPolygon(
 43| 	poly,
 44| 	coordSystem,
 45| 	displayScaleX,
 46| 	displayScaleY,
 47| 	imgW,
 48| 	imgH,
 49| 	origin = 'top-left'
   🚫 #369: StringLiteral → """" [0 tests]
 50| ) {
   ✅ #370: BlockStatement → "{}" [5 tests]
 51| 	if (!Array.isArray(poly)) return null;
   ✅ #371: BooleanLiteral → "Array.isArray(poly)" [5 tests]
   ✅ #372: ConditionalExpression → "true" [5 tests]
   ✅ #373: ConditionalExpression → "false" [5 tests]
 52| 
 53| 	const scaledPoints = poly
   ✅ #374: MethodExpression → "poly.map(point => normalizePoint(point, coordSystem, imgW, imgH)).map(point => orientPoint(point, origin, imgH)).map(point => scalePoint(point, displayScaleX, displayScaleY))" [4 tests]
 54| 		.map(point => normalizePoint(point, coordSystem, imgW, imgH))
   ✅ #375: ArrowFunction → "() => undefined" [4 tests]
 55| 		.map(point => orientPoint(point, origin, imgH))
   ✅ #376: ArrowFunction → "() => undefined" [4 tests]
 56| 		.map(point => scalePoint(point, displayScaleX, displayScaleY))
   ✅ #377: ArrowFunction → "() => undefined" [4 tests]
 57| 		.filter(Boolean);
 58| 
 59| 	return scaledPoints.length >= 3 ? scaledPoints : null;
   ✅ #378: ConditionalExpression → "true" [4 tests]
   ✅ #379: ConditionalExpression → "false" [4 tests]
   ✅ #380: EqualityOperator → "scaledPoints.length > 3" [4 tests]
   ✅ #381: EqualityOperator → "scaledPoints.length < 3" [4 tests]
 60| }
 61| 
 62| export function ensureCoordSystem(res, fallback = 'normalized_0_1000') {
   🚫 #382: StringLiteral → """" [0 tests]
   ✅ #383: BlockStatement → "{}" [2 tests]
 63| 	const cs = res?.image?.coordSystem;
   ❌ #384: OptionalChaining → "res?.image.coordSystem" [2 tests]
   ❌ #385: OptionalChaining → "res.image" [2 tests]
 64| 	return (cs === 'pixel' || cs === 'normalized_0_1000') ? cs : fallback;
   ✅ #386: ConditionalExpression → "true" [2 tests]
   ❌ #387: ConditionalExpression → "false" [2 tests]
   ❌ #388: LogicalOperator → "cs === 'pixel' && cs === 'normalized_0_1000'" [2 tests]
   ❌ #389: ConditionalExpression → "false" [2 tests]
   ✅ #390: EqualityOperator → "cs !== 'pixel'" [2 tests]
   ❌ #391: StringLiteral → """" [2 tests]
   ❌ #392: ConditionalExpression → "false" [2 tests]
   ✅ #393: EqualityOperator → "cs !== 'normalized_0_1000'" [2 tests]
   ❌ #394: StringLiteral → """" [2 tests]
 65| }
 66| 
 67| export function ensureCoordOrigin(res, fallback = 'top-left') {
   🚫 #395: StringLiteral → """" [0 tests]
   ✅ #396: BlockStatement → "{}" [3 tests]
 68| 	const match = collectOrigins(res).find(isValidOrigin);
 69| 	return match ?? fallback;
   ✅ #397: LogicalOperator → "match && fallback" [3 tests]
 70| }
 71| 
 72| function normalizeBox(box, coordSystem, imgW, imgH) {
   ✅ #398: BlockStatement → "{}" [11 tests]
 73| 	if (!box) return null;
   ✅ #399: BooleanLiteral → "box" [11 tests]
   ✅ #400: ConditionalExpression → "true" [11 tests]
   ✅ #401: ConditionalExpression → "false" [11 tests]
 74| 	const { x, y, width, height } = box;
 75| 	if (![x, y, width, height].every(Number.isFinite)) return null;
   ✅ #403: ConditionalExpression → "true" [9 tests]
   ✅ #402: BooleanLiteral → "[x, y, width, height].every(Number.isFinite)" [9 tests]
   ✅ #405: MethodExpression → "[x, y, width, height].some(Number.isFinite)" [9 tests]
   ✅ #406: ArrayDeclaration → "[]" [9 tests]
   ✅ #404: ConditionalExpression → "false" [9 tests]
 76| 
 77| 	if (coordSystem !== 'normalized_0_1000' || !Number.isFinite(imgW) || !Number.isFinite(imgH)) {
   ✅ #407: ConditionalExpression → "true" [8 tests]
   ✅ #408: ConditionalExpression → "false" [8 tests]
   ✅ #409: LogicalOperator → "(coordSystem !== 'normalized_0_1000' || !Number.isFinite(imgW)) && !Number.isFinite(imgH)" [8 tests]
   ✅ #410: ConditionalExpression → "false" [8 tests]
   ✅ #412: ConditionalExpression → "false" [8 tests]
   ✅ #411: LogicalOperator → "coordSystem !== 'normalized_0_1000' && !Number.isFinite(imgW)" [8 tests]
   ✅ #413: EqualityOperator → "coordSystem === 'normalized_0_1000'" [8 tests]
   ✅ #414: StringLiteral → """" [8 tests]
   ✅ #415: BooleanLiteral → "Number.isFinite(imgW)" [4 tests]
   ✅ #417: BlockStatement → "{}" [4 tests]
   ✅ #416: BooleanLiteral → "Number.isFinite(imgH)" [4 tests]
 78| 		return { x, y, width, height };
   ✅ #418: ObjectLiteral → "{}" [4 tests]
 79| 	}
 80| 
 81| 	return {
   ✅ #419: ObjectLiteral → "{}" [4 tests]
 82| 		x: (x / 1000) * imgW,
   ✅ #421: ArithmeticOperator → "x * 1000" [4 tests]
   ✅ #420: ArithmeticOperator → "x / 1000 / imgW" [4 tests]
 83| 		y: (y / 1000) * imgH,
   ✅ #422: ArithmeticOperator → "y / 1000 / imgH" [4 tests]
   ✅ #423: ArithmeticOperator → "y * 1000" [4 tests]
 84| 		width: (width / 1000) * imgW,
   ✅ #424: ArithmeticOperator → "width / 1000 / imgW" [4 tests]
   ✅ #425: ArithmeticOperator → "width * 1000" [4 tests]
 85| 		height: (height / 1000) * imgH
   ✅ #426: ArithmeticOperator → "height / 1000 / imgH" [4 tests]
   ✅ #427: ArithmeticOperator → "height * 1000" [4 tests]
 86| 	};
 87| }
 88| 
 89| function orientBox(box, origin, imgH) {
   ✅ #428: BlockStatement → "{}" [8 tests]
 90| 	if (origin !== 'bottom-left' || !Number.isFinite(imgH)) {
   ✅ #430: ConditionalExpression → "false" [8 tests]
   ✅ #429: ConditionalExpression → "true" [8 tests]
   ✅ #431: LogicalOperator → "origin !== 'bottom-left' && !Number.isFinite(imgH)" [8 tests]
   ✅ #432: ConditionalExpression → "false" [8 tests]
   ✅ #433: EqualityOperator → "origin === 'bottom-left'" [8 tests]
   ✅ #434: StringLiteral → """" [8 tests]
   ✅ #435: BooleanLiteral → "Number.isFinite(imgH)" [1 tests]
   ✅ #436: BlockStatement → "{}" [7 tests]
 91| 		return box;
 92| 	}
 93| 	return {
   ✅ #437: ObjectLiteral → "{}" [1 tests]
 94| 		...box,
 95| 		y: imgH - (box.y + box.height)
   ✅ #438: ArithmeticOperator → "imgH + (box.y + box.height)" [1 tests]
   ✅ #439: ArithmeticOperator → "box.y - box.height" [1 tests]
 96| 	};
 97| }
 98| 
 99| function scaleBox(box, scaleX, scaleY) {
   ✅ #440: BlockStatement → "{}" [8 tests]
100| 	const sx = Number.isFinite(scaleX) ? scaleX : 1;
101| 	const sy = Number.isFinite(scaleY) ? scaleY : 1;
102| 	return {
   ✅ #441: ObjectLiteral → "{}" [8 tests]
103| 		x: box.x * sx,
   ✅ #442: ArithmeticOperator → "box.x / sx" [8 tests]
104| 		y: box.y * sy,
   ✅ #443: ArithmeticOperator → "box.y / sy" [8 tests]
105| 		width: box.width * sx,
   ✅ #444: ArithmeticOperator → "box.width / sx" [8 tests]
106| 		height: box.height * sy
   ✅ #445: ArithmeticOperator → "box.height / sy" [8 tests]
107| 	};
108| }
109| 
110| function clampBox(box, canvasWidth, canvasHeight) {
   ✅ #446: BlockStatement → "{}" [8 tests]
111| 	if (!Number.isFinite(canvasWidth) || !Number.isFinite(canvasHeight)) {
   ✅ #447: ConditionalExpression → "true" [8 tests]
   ✅ #448: ConditionalExpression → "false" [8 tests]
   ❌ #449: LogicalOperator → "!Number.isFinite(canvasWidth) && !Number.isFinite(canvasHeight)" [8 tests]
   ✅ #451: BooleanLiteral → "Number.isFinite(canvasHeight)" [7 tests]
   ✅ #450: BooleanLiteral → "Number.isFinite(canvasWidth)" [8 tests]
   ✅ #452: BlockStatement → "{}" [1 tests]
112| 		return box;
113| 	}
114| 	const x = clamp(box.x, 0, canvasWidth);
115| 	const y = clamp(box.y, 0, canvasHeight);
116| 	const width = clamp(box.width, 0, canvasWidth - x);
   ✅ #453: ArithmeticOperator → "canvasWidth + x" [7 tests]
117| 	const height = clamp(box.height, 0, canvasHeight - y);
   ✅ #454: ArithmeticOperator → "canvasHeight + y" [7 tests]
118| 	return { x, y, width, height };
   ✅ #455: ObjectLiteral → "{}" [7 tests]
119| }
120| 
121| function normalizePoint(point, coordSystem, imgW, imgH) {
   ✅ #456: BlockStatement → "{}" [4 tests]
122| 	if (!point) return null;
   ✅ #457: BooleanLiteral → "point" [4 tests]
   ✅ #458: ConditionalExpression → "true" [4 tests]
   ❌ #459: ConditionalExpression → "false" [4 tests]
123| 	let { x, y } = point;
124| 	if (!(Number.isFinite(x) && Number.isFinite(y))) return null;
   ✅ #460: BooleanLiteral → "Number.isFinite(x) && Number.isFinite(y)" [4 tests]
   ✅ #461: ConditionalExpression → "true" [4 tests]
   ✅ #462: ConditionalExpression → "false" [4 tests]
   ✅ #463: ConditionalExpression → "true" [4 tests]
   ✅ #464: ConditionalExpression → "false" [4 tests]
   ✅ #465: LogicalOperator → "Number.isFinite(x) || Number.isFinite(y)" [4 tests]
125| 
126| 	if (coordSystem === 'normalized_0_1000' && Number.isFinite(imgW) && Number.isFinite(imgH)) {
   ✅ #466: ConditionalExpression → "true" [4 tests]
   ✅ #468: LogicalOperator → "coordSystem === 'normalized_0_1000' && Number.isFinite(imgW) || Number.isFinite(imgH)" [4 tests]
   ✅ #467: ConditionalExpression → "false" [4 tests]
   ✅ #469: ConditionalExpression → "true" [4 tests]
   ✅ #470: LogicalOperator → "coordSystem === 'normalized_0_1000' || Number.isFinite(imgW)" [4 tests]
   ✅ #472: EqualityOperator → "coordSystem !== 'normalized_0_1000'" [4 tests]
   ✅ #471: ConditionalExpression → "true" [4 tests]
   ✅ #473: StringLiteral → """" [4 tests]
   ✅ #474: BlockStatement → "{}" [1 tests]
127| 		x = (x / 1000) * imgW;
   ✅ #475: ArithmeticOperator → "x / 1000 / imgW" [1 tests]
   ✅ #476: ArithmeticOperator → "x * 1000" [1 tests]
128| 		y = (y / 1000) * imgH;
   ✅ #477: ArithmeticOperator → "y / 1000 / imgH" [1 tests]
   ✅ #478: ArithmeticOperator → "y * 1000" [1 tests]
129| 	}
130| 
131| 	return { x, y };
   ✅ #479: ObjectLiteral → "{}" [4 tests]
132| }
133| 
134| function orientPoint(point, origin, imgH) {
   ✅ #480: BlockStatement → "{}" [4 tests]
135| 	if (!point) return null;
   ✅ #481: BooleanLiteral → "point" [4 tests]
   ✅ #482: ConditionalExpression → "true" [4 tests]
   ❌ #483: ConditionalExpression → "false" [4 tests]
136| 	if (origin !== 'bottom-left' || !Number.isFinite(imgH)) return point;
   ✅ #484: ConditionalExpression → "true" [4 tests]
   ✅ #486: LogicalOperator → "origin !== 'bottom-left' && !Number.isFinite(imgH)" [4 tests]
   ✅ #485: ConditionalExpression → "false" [4 tests]
   ✅ #487: ConditionalExpression → "false" [4 tests]
   ✅ #488: EqualityOperator → "origin === 'bottom-left'" [4 tests]
   ✅ #489: StringLiteral → """" [4 tests]
   ✅ #490: BooleanLiteral → "Number.isFinite(imgH)" [1 tests]
137| 	return { x: point.x, y: imgH - point.y };
   ✅ #491: ObjectLiteral → "{}" [1 tests]
   ✅ #492: ArithmeticOperator → "imgH + point.y" [1 tests]
138| }
139| 
140| function scalePoint(point, scaleX, scaleY) {
   ✅ #493: BlockStatement → "{}" [4 tests]
141| 	if (!point) return null;
   ✅ #495: ConditionalExpression → "true" [4 tests]
   ✅ #494: BooleanLiteral → "point" [4 tests]
   ✅ #496: ConditionalExpression → "false" [4 tests]
142| 	const sx = Number.isFinite(scaleX) ? scaleX : 1;
143| 	const sy = Number.isFinite(scaleY) ? scaleY : 1;
144| 	return { x: point.x * sx, y: point.y * sy };
   ✅ #497: ObjectLiteral → "{}" [4 tests]
   ✅ #499: ArithmeticOperator → "point.y / sy" [4 tests]
   ✅ #498: ArithmeticOperator → "point.x / sx" [4 tests]
145| }
146| 
147| function isValidOrigin(origin) {
   ✅ #500: BlockStatement → "{}" [2 tests]
148| 	return origin === 'top-left' || origin === 'bottom-left';
   ✅ #501: ConditionalExpression → "true" [2 tests]
   ✅ #503: LogicalOperator → "origin === 'top-left' && origin === 'bottom-left'" [2 tests]
   ✅ #502: ConditionalExpression → "false" [2 tests]
   ❌ #504: ConditionalExpression → "false" [2 tests]
   ❌ #506: StringLiteral → """" [2 tests]
   ✅ #505: EqualityOperator → "origin !== 'top-left'" [2 tests]
   ✅ #507: ConditionalExpression → "false" [2 tests]
   ✅ #508: EqualityOperator → "origin !== 'bottom-left'" [2 tests]
   ✅ #509: StringLiteral → """" [2 tests]
149| }
150| 
151| function collectOrigins(res) {
   ✅ #510: BlockStatement → "{}" [3 tests]
152| 	const origins = [];
   ❌ #511: ArrayDeclaration → "["Stryker was here"]" [3 tests]
153| 	if (res?.image) {
   ✅ #512: ConditionalExpression → "true" [3 tests]
   ❌ #513: ConditionalExpression → "false" [3 tests]
   ❌ #514: OptionalChaining → "res.image" [3 tests]
   ❌ #515: BlockStatement → "{}" [2 tests]
154| 		origins.push(res.image.coordOrigin, res.image.origin, res.image.coordinateOrigin);
155| 	}
156| 	if (Array.isArray(res?.detections)) {
   ✅ #516: ConditionalExpression → "true" [3 tests]
   ✅ #517: ConditionalExpression → "false" [3 tests]
   ❌ #518: OptionalChaining → "res.detections" [3 tests]
   ✅ #519: BlockStatement → "{}" [2 tests]
157| 		origins.push(...res.detections.map(det => det?.coordOrigin));
   ❌ #521: OptionalChaining → "det.coordOrigin" [2 tests]
   ✅ #520: ArrowFunction → "() => undefined" [2 tests]
158| 	}
159| 	return origins;
160| }
161| 
```

#### ❌ Critical Survived Mutants (First 10)

1. **Mutant #349** - Line 8:6-47
   - **Mutator**: `ConditionalExpression` → `false`
   - **Issue**: Unknown
   - **Fix**: Add test cases for both true/false conditions
   - **Tests that should have caught this**: 43, 44, 45, 62

2. **Mutant #350** - Line 8:6-47
   - **Mutator**: `LogicalOperator` → `!Array.isArray(bbox) && bbox.length !== 4`
   - **Issue**: Unknown
   - **Fix**: Test all logical combinations (&&, ||)
   - **Tests that should have caught this**: 43, 44, 45, 62

3. **Mutant #352** - Line 8:30-47
   - **Mutator**: `ConditionalExpression` → `false`
   - **Issue**: Unknown
   - **Fix**: Add test cases for both true/false conditions
   - **Tests that should have caught this**: 43, 44, 45, 62

4. **Mutant #356** - Line 10:6-54
   - **Mutator**: `ConditionalExpression` → `false`
   - **Issue**: Unknown
   - **Fix**: Add test cases for both true/false conditions
   - **Tests that should have caught this**: 43, 44, 45, 62

5. **Mutant #357** - Line 10:7-54
   - **Mutator**: `MethodExpression` → `[ymin, xmin, ymax, xmax].some(Number.isFinite)`
   - **Issue**: Unknown
   - **Fix**: Mock and verify method calls with different inputs
   - **Tests that should have caught this**: 43, 44, 45, 62

6. **Mutant #358** - Line 10:7-31
   - **Mutator**: `ArrayDeclaration` → `[]`
   - **Issue**: Unknown
   - **Fix**: Add specific test cases to kill this mutant
   - **Tests that should have caught this**: 43, 44, 45, 62

7. **Mutant #364** - Line 27:11-21
   - **Mutator**: `StringLiteral` → `""`
   - **Issue**: Unknown
   - **Fix**: Test with different string values including empty strings
   - **Tests that should have caught this**: 45, 48

8. **Mutant #384** - Line 63:13-36
   - **Mutator**: `OptionalChaining` → `res?.image.coordSystem`
   - **Issue**: Unknown
   - **Fix**: Add specific test cases to kill this mutant
   - **Tests that should have caught this**: 59, 62

9. **Mutant #387** - Line 64:10-54
   - **Mutator**: `ConditionalExpression` → `false`
   - **Issue**: Unknown
   - **Fix**: Add test cases for both true/false conditions
   - **Tests that should have caught this**: 59, 62

10. **Mutant #388** - Line 64:10-54
   - **Mutator**: `LogicalOperator` → `cs === 'pixel' && cs === 'normalized_0_1000'`
   - **Issue**: Unknown
   - **Fix**: Test all logical combinations (&&, ||)
   - **Tests that should have caught this**: 59, 62

#### 🚫 Coverage Gaps Summary

- **3 uncovered mutants** across 3 lines
- **Most affected lines**: 49, 62, 67
- **Common uncovered operations**: StringLiteral

##### Detailed No Coverage Mutants:
1. **Mutant #369** - Line 49:11-21: `StringLiteral` → `""`
2. **Mutant #382** - Line 62:51-70: `StringLiteral` → `""`
3. **Mutant #395** - Line 67:51-61: `StringLiteral` → `""`

#### ✅ Successfully Killed Mutants Summary

- **146 mutants killed** by tests
- **Average tests per mutant**: 1.0
- **Most effective test**: 43 (killed 43 mutants)
- **Top mutator types killed**: ConditionalExpression, ArithmeticOperator, BlockStatement

---

### 🔴 src/index.js

**Overall Health**: 🔴 Needs Improvement | **Mutation Score**: 0.0% | **Coverage**: 0.0%

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Killed | 0 | 0.0% |
| ❌ Survived | 0 | 0.0% |
| 🚫 No Coverage | 528 | 100.0% |
| **Total** | **528** | **100%** |

#### 📄 Source Code with Mutation Analysis

```javascript
  1| /* istanbul ignore file */
  2| 
  3| import { AEC_PROMPT, RESPONSE_SCHEMA } from './aec-schema.js';
  4| import {
  5| 	toCanvasBox,
  6| 	toCanvasPolygon,
  7| 	ensureCoordSystem,
  8| 	ensureCoordOrigin
  9| } from './geometry.js';
 10| import {
 11| 	colorForCategory,
 12| 	extractJSONFromResponse,
 13| 	calculateDisplayScale,
 14| 	formatJsonOutput,
 15| 	extractBase64FromDataUrl,
 16| 	prepareDetectionData
 17| } from './ui-utils.js';
 18| import {
 19| 	renderReportUI,
 20| 	setupReportInteractions
 21| } from './report-ui.js';
 22| import {
 23| 	createSession,
 24| 	calculateSessionAggregates,
 25| 	updateSessionStatus,
 26| 	getSessionProgress
 27| } from './session.js';
 28| import { processBatch } from './batch-processor.js';
 29| import { exportSessionJSON, exportSessionCSV, downloadFile } from './export.js';
 30| 
 31| // ---------- UI Elements ----------
 32| const apiKeyEl = document.getElementById('apiKey');
   🚫 #522: StringLiteral → """" [0 tests]
 33| const modelEl  = document.getElementById('model');
   🚫 #523: StringLiteral → """" [0 tests]
 34| const fileEl   = document.getElementById('file');
   🚫 #524: StringLiteral → """" [0 tests]
 35| const dropzone = document.getElementById('dropzone');
   🚫 #525: StringLiteral → """" [0 tests]
 36| const canvas   = document.getElementById('canvas');
   🚫 #526: StringLiteral → """" [0 tests]
 37| const ctx      = canvas.getContext('2d');
   🚫 #527: StringLiteral → """" [0 tests]
 38| const reportWrap = document.getElementById('reportWrap');
   🚫 #528: StringLiteral → """" [0 tests]
 39| const jsonOut  = document.getElementById('jsonOut');
   🚫 #529: StringLiteral → """" [0 tests]
 40| const progressBar = document.getElementById('progressBar');
   🚫 #530: StringLiteral → """" [0 tests]
 41| const progressText = document.getElementById('progressText');
   🚫 #531: StringLiteral → """" [0 tests]
 42| const progressFill = document.getElementById('progressFill');
   🚫 #532: StringLiteral → """" [0 tests]
 43| const gallery = document.getElementById('gallery');
   🚫 #533: StringLiteral → """" [0 tests]
 44| 
 45| const STORAGE_KEY = 'geminiApiKey';
   🚫 #534: StringLiteral → """" [0 tests]
 46| const MAX_IMAGES = 20;
 47| 
 48| // Session state
 49| let currentSession = null;
 50| let isAnalyzing = false;
   🚫 #535: BooleanLiteral → "true" [0 tests]
 51| let pendingApiKeyAnalysis = false;
   🚫 #536: BooleanLiteral → "true" [0 tests]
 52| 
 53| // Legacy single-image state (for backwards compatibility)
 54| let currentFile = null;
 55| let currentImageBitmap = null;
 56| let currentDetections = [];
   🚫 #537: ArrayDeclaration → "["Stryker was here"]" [0 tests]
 57| let currentParsedData = null;
 58| let naturalW = 0, naturalH = 0;
 59| let highlightedDetectionId = null;
 60| let analysisQueued = false;
   🚫 #538: BooleanLiteral → "true" [0 tests]
 61| 
 62| // ---------- Helpers ----------
 63| function logJson(obj, note) {
   🚫 #539: BlockStatement → "{}" [0 tests]
 64| 	jsonOut.textContent = formatJsonOutput(obj, note);
 65| }
 66| 
 67| function clearReport() {
   🚫 #540: BlockStatement → "{}" [0 tests]
 68| 	reportWrap.innerHTML = '';
   🚫 #541: StringLiteral → ""Stryker was here!"" [0 tests]
 69| }
 70| 
 71| // ---------- Multi-Image Functions ----------
 72| 
 73| async function handleMultipleFiles(files) {
   🚫 #542: BlockStatement → "{}" [0 tests]
 74| 	const fileArray = Array.from(files);
 75| 	
 76| 	if (fileArray.length > MAX_IMAGES) {
   🚫 #543: ConditionalExpression → "true" [0 tests]
   🚫 #544: ConditionalExpression → "false" [0 tests]
   🚫 #545: EqualityOperator → "fileArray.length >= MAX_IMAGES" [0 tests]
   🚫 #546: EqualityOperator → "fileArray.length <= MAX_IMAGES" [0 tests]
   🚫 #547: BlockStatement → "{}" [0 tests]
 77| 		logJson({ error: `Maximum ${MAX_IMAGES} images allowed. You selected ${fileArray.length}.` }, 'Error');
   🚫 #548: ObjectLiteral → "{}" [0 tests]
   🚫 #549: StringLiteral → "``" [0 tests]
   🚫 #550: StringLiteral → """" [0 tests]
 78| 		return;
 79| 	}
 80| 
 81| 	const apiKey = apiKeyEl.value.trim();
   🚫 #551: MethodExpression → "apiKeyEl.value" [0 tests]
 82| 	if (!apiKey) {
   🚫 #552: BooleanLiteral → "apiKey" [0 tests]
   🚫 #553: ConditionalExpression → "true" [0 tests]
   🚫 #554: ConditionalExpression → "false" [0 tests]
   🚫 #555: BlockStatement → "{}" [0 tests]
 83| 		pendingApiKeyAnalysis = true;
   🚫 #556: BooleanLiteral → "false" [0 tests]
 84| 		logJson({ message: `${fileArray.length} images loaded. Enter your API key to start analysis.` });
   🚫 #557: ObjectLiteral → "{}" [0 tests]
   🚫 #558: StringLiteral → "``" [0 tests]
 85| 		return;
 86| 	}
 87| 
 88| 	pendingApiKeyAnalysis = false;
   🚫 #559: BooleanLiteral → "true" [0 tests]
 89| 	await analyzeMultipleImages(fileArray);
 90| }
 91| 
 92| async function analyzeMultipleImages(files) {
   🚫 #560: BlockStatement → "{}" [0 tests]
 93| 	if (isAnalyzing) return;
   🚫 #561: ConditionalExpression → "true" [0 tests]
   🚫 #562: ConditionalExpression → "false" [0 tests]
 94| 	isAnalyzing = true;
   🚫 #563: BooleanLiteral → "false" [0 tests]
 95| 
 96| 	// Create session
 97| 	currentSession = createSession(files);
 98| 	
 99| 	// Hide dropzone, show progress bar and gallery
100| 	dropzone.style.display = 'none';
   🚫 #564: StringLiteral → """" [0 tests]
101| 	progressBar.style.display = 'block';
   🚫 #565: StringLiteral → """" [0 tests]
102| 	gallery.style.display = 'block';
   🚫 #566: StringLiteral → """" [0 tests]
103| 	clearReport();
104| 
105| 	// Render gallery
106| 	renderGallery();
107| 
108| 	// Load image bitmaps
109| 	for (const img of currentSession.images) {
   🚫 #567: BlockStatement → "{}" [0 tests]
110| 		try {
   🚫 #568: BlockStatement → "{}" [0 tests]
111| 			img.bitmap = await createImageBitmap(img.file);
112| 			img.naturalWidth = img.bitmap.width;
113| 			img.naturalHeight = img.bitmap.height;
114| 		} catch (err) {
   🚫 #569: BlockStatement → "{}" [0 tests]
115| 			img.error = `Failed to load image: ${err.message}`;
   🚫 #570: StringLiteral → "``" [0 tests]
116| 			img.status = 'error';
   🚫 #571: StringLiteral → """" [0 tests]
117| 		}
118| 		updateGalleryThumb(img.id);
119| 	}
120| 
121| 	// Display first image
122| 	if (currentSession.images.length > 0) {
   🚫 #572: ConditionalExpression → "true" [0 tests]
   🚫 #573: ConditionalExpression → "false" [0 tests]
   🚫 #574: EqualityOperator → "currentSession.images.length >= 0" [0 tests]
   🚫 #575: EqualityOperator → "currentSession.images.length <= 0" [0 tests]
   🚫 #576: BlockStatement → "{}" [0 tests]
123| 		await displaySessionImage(0);
124| 	}
125| 
126| 	// Process all images
127| 	const apiKey = apiKeyEl.value.trim();
   🚫 #577: MethodExpression → "apiKeyEl.value" [0 tests]
128| 	const model = modelEl.value.trim() || 'gemini-2.5-pro';
   🚫 #578: ConditionalExpression → "true" [0 tests]
   🚫 #579: ConditionalExpression → "false" [0 tests]
   🚫 #580: LogicalOperator → "modelEl.value.trim() && 'gemini-2.5-pro'" [0 tests]
   🚫 #581: MethodExpression → "modelEl.value" [0 tests]
   🚫 #582: StringLiteral → """" [0 tests]
129| 
130| 	await processBatch(
131| 		currentSession.images.filter(img => img.status === 'queued'),
   🚫 #583: MethodExpression → "currentSession.images" [0 tests]
   🚫 #584: ArrowFunction → "() => undefined" [0 tests]
   🚫 #585: ConditionalExpression → "true" [0 tests]
   🚫 #586: ConditionalExpression → "false" [0 tests]
   🚫 #587: EqualityOperator → "img.status !== 'queued'" [0 tests]
   🚫 #588: StringLiteral → """" [0 tests]
132| 		async (img) => {
   🚫 #589: BlockStatement → "{}" [0 tests]
133| 			img.status = 'analyzing';
   🚫 #590: StringLiteral → """" [0 tests]
134| 			updateProgress();
135| 			updateGalleryThumb(img.id);
136| 
137| 			const resp = await callGeminiREST({ apiKey, model, file: img.file });
   🚫 #591: ObjectLiteral → "{}" [0 tests]
138| 			const parsed = extractJSONFromResponse(resp);
139| 			prepareDetectionData(parsed, img.naturalWidth, img.naturalHeight);
140| 
141| 			const coordSystem = ensureCoordSystem(parsed, 'normalized_0_1000');
   🚫 #592: StringLiteral → """" [0 tests]
142| 			ensureCoordOrigin(parsed, 'top-left');
   🚫 #593: StringLiteral → """" [0 tests]
143| 			if (parsed.image.coordSystem == null) parsed.image.coordSystem = coordSystem;
   🚫 #594: ConditionalExpression → "true" [0 tests]
   🚫 #595: ConditionalExpression → "false" [0 tests]
   🚫 #596: EqualityOperator → "parsed.image.coordSystem != null" [0 tests]
144| 
145| 			img.parsedData = parsed;
146| 			img.detections = Array.isArray(parsed.detections) ? parsed.detections : [];
   🚫 #597: ArrayDeclaration → "["Stryker was here"]" [0 tests]
147| 			img.status = 'completed';
   🚫 #598: StringLiteral → """" [0 tests]
148| 
149| 			return parsed;
150| 		},
151| 		(img, result, error) => {
   🚫 #599: BlockStatement → "{}" [0 tests]
152| 			if (error) {
   🚫 #600: ConditionalExpression → "true" [0 tests]
   🚫 #601: ConditionalExpression → "false" [0 tests]
   🚫 #602: BlockStatement → "{}" [0 tests]
153| 				img.error = String(error?.message || error);
   🚫 #603: ConditionalExpression → "true" [0 tests]
   🚫 #604: ConditionalExpression → "false" [0 tests]
   🚫 #605: LogicalOperator → "error?.message && error" [0 tests]
   🚫 #606: OptionalChaining → "error.message" [0 tests]
154| 				img.status = 'error';
   🚫 #607: StringLiteral → """" [0 tests]
155| 			}
156| 			updateProgress();
157| 			updateGalleryThumb(img.id);
158| 			
159| 			// Redraw active image if it's the one that just completed
160| 			if (currentSession.activeImageIndex === currentSession.images.indexOf(img)) {
   🚫 #608: ConditionalExpression → "true" [0 tests]
   🚫 #609: ConditionalExpression → "false" [0 tests]
   🚫 #610: EqualityOperator → "currentSession.activeImageIndex !== currentSession.images.indexOf(img)" [0 tests]
   🚫 #611: BlockStatement → "{}" [0 tests]
161| 				drawOverlaysForSession();
162| 			}
163| 		}
164| 	);
165| 
166| 	// All done - calculate aggregates and show report
167| 	currentSession.status = updateSessionStatus(currentSession);
168| 	currentSession.sessionAggregates = calculateSessionAggregates(currentSession);
169| 
170| 	progressBar.style.display = 'none';
   🚫 #612: StringLiteral → """" [0 tests]
171| 
172| 	// Render session report
173| 	const reportHtml = renderReportUI(null, currentSession);
174| 	reportWrap.innerHTML = reportHtml;
175| 
176| 	// Setup interactions
177| 	const activeImg = currentSession.images[currentSession.activeImageIndex];
178| 	if (activeImg && activeImg.status === 'completed') {
   🚫 #613: ConditionalExpression → "true" [0 tests]
   🚫 #614: ConditionalExpression → "false" [0 tests]
   🚫 #615: LogicalOperator → "activeImg || activeImg.status === 'completed'" [0 tests]
   🚫 #616: ConditionalExpression → "true" [0 tests]
   🚫 #617: EqualityOperator → "activeImg.status !== 'completed'" [0 tests]
   🚫 #618: StringLiteral → """" [0 tests]
   🚫 #619: BlockStatement → "{}" [0 tests]
179| 		setupReportInteractions(
180| 			reportWrap,
181| 			activeImg.detections,
182| 			(detection) => {
   🚫 #620: BlockStatement → "{}" [0 tests]
183| 				highlightedDetectionId = detection.id;
184| 				drawOverlaysForSession();
185| 			},
186| 			() => {
   🚫 #621: BlockStatement → "{}" [0 tests]
187| 				highlightedDetectionId = null;
188| 				drawOverlaysForSession();
189| 			}
190| 		);
191| 	}
192| 
193| 	// Setup export buttons
194| 	const exportJSONBtn = document.getElementById('exportJSON');
   🚫 #622: StringLiteral → """" [0 tests]
195| 	const exportCSVBtn = document.getElementById('exportCSV');
   🚫 #623: StringLiteral → """" [0 tests]
196| 	
197| 	if (exportJSONBtn) {
   🚫 #624: ConditionalExpression → "true" [0 tests]
   🚫 #625: ConditionalExpression → "false" [0 tests]
   🚫 #626: BlockStatement → "{}" [0 tests]
198| 		exportJSONBtn.addEventListener('click', () => {
   🚫 #627: StringLiteral → """" [0 tests]
   🚫 #628: BlockStatement → "{}" [0 tests]
199| 			const json = exportSessionJSON(currentSession);
200| 			downloadFile(json, `session_${currentSession.sessionId}.json`, 'application/json');
   🚫 #629: StringLiteral → "``" [0 tests]
   🚫 #630: StringLiteral → """" [0 tests]
201| 		});
202| 	}
203| 	
204| 	if (exportCSVBtn) {
   🚫 #631: ConditionalExpression → "true" [0 tests]
   🚫 #632: ConditionalExpression → "false" [0 tests]
   🚫 #633: BlockStatement → "{}" [0 tests]
205| 		exportCSVBtn.addEventListener('click', () => {
   🚫 #634: StringLiteral → """" [0 tests]
   🚫 #635: BlockStatement → "{}" [0 tests]
206| 			const csv = exportSessionCSV(currentSession);
207| 			downloadFile(csv, `session_${currentSession.sessionId}.csv`, 'text/csv');
   🚫 #636: StringLiteral → "``" [0 tests]
   🚫 #637: StringLiteral → """" [0 tests]
208| 		});
209| 	}
210| 
211| 	logJson({ message: `Analysis complete. ${currentSession.sessionAggregates.totalDetections} detections across ${currentSession.images.filter(img => img.status === 'completed').length} images.` });
   🚫 #638: ObjectLiteral → "{}" [0 tests]
   🚫 #639: StringLiteral → "``" [0 tests]
   🚫 #640: MethodExpression → "currentSession.images" [0 tests]
   🚫 #641: ArrowFunction → "() => undefined" [0 tests]
   🚫 #642: ConditionalExpression → "true" [0 tests]
   🚫 #643: ConditionalExpression → "false" [0 tests]
   🚫 #644: EqualityOperator → "img.status !== 'completed'" [0 tests]
   🚫 #645: StringLiteral → """" [0 tests]
212| 	isAnalyzing = false;
   🚫 #646: BooleanLiteral → "true" [0 tests]
213| }
214| 
215| function renderGallery() {
   🚫 #647: BlockStatement → "{}" [0 tests]
216| 	gallery.innerHTML = '';
   🚫 #648: StringLiteral → ""Stryker was here!"" [0 tests]
217| 	currentSession.images.forEach((img, index) => {
   🚫 #649: BlockStatement → "{}" [0 tests]
218| 		const thumb = document.createElement('div');
   🚫 #650: StringLiteral → """" [0 tests]
219| 		thumb.className = 'gallery-thumb';
   🚫 #651: StringLiteral → """" [0 tests]
220| 		thumb.id = `thumb-${img.id}`;
   🚫 #652: StringLiteral → "``" [0 tests]
221| 		if (index === currentSession.activeImageIndex) {
   🚫 #653: ConditionalExpression → "true" [0 tests]
   🚫 #654: ConditionalExpression → "false" [0 tests]
   🚫 #655: EqualityOperator → "index !== currentSession.activeImageIndex" [0 tests]
   🚫 #656: BlockStatement → "{}" [0 tests]
222| 			thumb.classList.add('active');
   🚫 #657: StringLiteral → """" [0 tests]
223| 		}
224| 
225| 		const imgEl = document.createElement('img');
   🚫 #658: StringLiteral → """" [0 tests]
226| 		imgEl.className = 'gallery-thumb-img';
   🚫 #659: StringLiteral → """" [0 tests]
227| 		if (img.bitmap) {
   🚫 #660: ConditionalExpression → "true" [0 tests]
   🚫 #661: ConditionalExpression → "false" [0 tests]
   🚫 #662: BlockStatement → "{}" [0 tests]
228| 			imgEl.src = createThumbnailDataUrl(img.bitmap);
229| 		}
230| 
231| 		const nameEl = document.createElement('div');
   🚫 #663: StringLiteral → """" [0 tests]
232| 		nameEl.className = 'gallery-thumb-name';
   🚫 #664: StringLiteral → """" [0 tests]
233| 		nameEl.textContent = img.filename;
234| 
235| 		const statusEl = document.createElement('div');
   🚫 #665: StringLiteral → """" [0 tests]
236| 		statusEl.className = `gallery-thumb-status ${img.status}`;
   🚫 #666: StringLiteral → "``" [0 tests]
237| 		statusEl.id = `status-${img.id}`;
   🚫 #667: StringLiteral → "``" [0 tests]
238| 		statusEl.textContent = img.status;
239| 
240| 		thumb.appendChild(imgEl);
241| 		thumb.appendChild(nameEl);
242| 		thumb.appendChild(statusEl);
243| 
244| 		thumb.addEventListener('click', () => {
   🚫 #668: StringLiteral → """" [0 tests]
   🚫 #669: BlockStatement → "{}" [0 tests]
245| 			displaySessionImage(index);
246| 		});
247| 
248| 		gallery.appendChild(thumb);
249| 	});
250| }
251| 
252| function updateGalleryThumb(imageId) {
   🚫 #670: BlockStatement → "{}" [0 tests]
253| 	const img = currentSession.images.find(i => i.id === imageId);
   🚫 #671: ArrowFunction → "() => undefined" [0 tests]
   🚫 #672: ConditionalExpression → "true" [0 tests]
   🚫 #673: ConditionalExpression → "false" [0 tests]
   🚫 #674: EqualityOperator → "i.id !== imageId" [0 tests]
254| 	if (!img) return;
   🚫 #675: BooleanLiteral → "img" [0 tests]
   🚫 #676: ConditionalExpression → "true" [0 tests]
   🚫 #677: ConditionalExpression → "false" [0 tests]
255| 
256| 	const statusEl = document.getElementById(`status-${imageId}`);
   🚫 #678: StringLiteral → "``" [0 tests]
257| 	if (statusEl) {
   🚫 #679: ConditionalExpression → "true" [0 tests]
   🚫 #680: ConditionalExpression → "false" [0 tests]
   🚫 #681: BlockStatement → "{}" [0 tests]
258| 		statusEl.className = `gallery-thumb-status ${img.status}`;
   🚫 #682: StringLiteral → "``" [0 tests]
259| 		statusEl.textContent = img.status;
260| 	}
261| }
262| 
263| async function displaySessionImage(index) {
   🚫 #683: BlockStatement → "{}" [0 tests]
264| 	if (!currentSession || index < 0 || index >= currentSession.images.length) return;
   🚫 #684: ConditionalExpression → "true" [0 tests]
   🚫 #685: ConditionalExpression → "false" [0 tests]
   🚫 #686: LogicalOperator → "(!currentSession || index < 0) && index >= currentSession.images.length" [0 tests]
   🚫 #687: ConditionalExpression → "false" [0 tests]
   🚫 #688: LogicalOperator → "!currentSession && index < 0" [0 tests]
   🚫 #689: BooleanLiteral → "currentSession" [0 tests]
   🚫 #690: ConditionalExpression → "false" [0 tests]
   🚫 #691: EqualityOperator → "index <= 0" [0 tests]
   🚫 #692: EqualityOperator → "index >= 0" [0 tests]
   🚫 #693: ConditionalExpression → "false" [0 tests]
   🚫 #694: EqualityOperator → "index > currentSession.images.length" [0 tests]
   🚫 #695: EqualityOperator → "index < currentSession.images.length" [0 tests]
265| 
266| 	currentSession.activeImageIndex = index;
267| 	const img = currentSession.images[index];
268| 
269| 	// Update gallery active state
270| 	document.querySelectorAll('.gallery-thumb').forEach((thumb, i) => {
   🚫 #696: StringLiteral → """" [0 tests]
   🚫 #697: BlockStatement → "{}" [0 tests]
271| 		thumb.classList.toggle('active', i === index);
   🚫 #698: StringLiteral → """" [0 tests]
   🚫 #699: ConditionalExpression → "true" [0 tests]
   🚫 #700: ConditionalExpression → "false" [0 tests]
   🚫 #701: EqualityOperator → "i !== index" [0 tests]
272| 	});
273| 
274| 	// Draw image
275| 	if (img.bitmap) {
   🚫 #702: ConditionalExpression → "true" [0 tests]
   🚫 #703: ConditionalExpression → "false" [0 tests]
   🚫 #704: BlockStatement → "{}" [0 tests]
276| 		currentImageBitmap = img.bitmap;
277| 		naturalW = img.naturalWidth;
278| 		naturalH = img.naturalHeight;
279| 		currentDetections = img.detections || [];
   🚫 #705: ConditionalExpression → "true" [0 tests]
   🚫 #706: ConditionalExpression → "false" [0 tests]
   🚫 #707: LogicalOperator → "img.detections && []" [0 tests]
   🚫 #708: ArrayDeclaration → "["Stryker was here"]" [0 tests]
280| 		currentParsedData = img.parsedData;
281| 
282| 		const scale = calculateDisplayScale(naturalW, window.innerWidth);
283| 		canvas.width = Math.round(naturalW * scale);
   🚫 #709: ArithmeticOperator → "naturalW / scale" [0 tests]
284| 		canvas.height = Math.round(naturalH * scale);
   🚫 #710: ArithmeticOperator → "naturalH / scale" [0 tests]
285| 
286| 		ctx.clearRect(0, 0, canvas.width, canvas.height);
287| 		ctx.drawImage(img.bitmap, 0, 0, canvas.width, canvas.height);
288| 
289| 		drawOverlaysForSession();
290| 	}
291| }
292| 
293| function drawOverlaysForSession() {
   🚫 #711: BlockStatement → "{}" [0 tests]
294| 	if (!currentSession || !currentImageBitmap) return;
   🚫 #712: ConditionalExpression → "true" [0 tests]
   🚫 #713: ConditionalExpression → "false" [0 tests]
   🚫 #714: LogicalOperator → "!currentSession && !currentImageBitmap" [0 tests]
   🚫 #715: BooleanLiteral → "currentSession" [0 tests]
   🚫 #716: BooleanLiteral → "currentImageBitmap" [0 tests]
295| 
296| 	const img = currentSession.images[currentSession.activeImageIndex];
297| 	if (!img || img.status !== 'completed') return;
   🚫 #717: ConditionalExpression → "true" [0 tests]
   🚫 #718: ConditionalExpression → "false" [0 tests]
   🚫 #719: LogicalOperator → "!img && img.status !== 'completed'" [0 tests]
   🚫 #720: BooleanLiteral → "img" [0 tests]
   🚫 #721: ConditionalExpression → "false" [0 tests]
   🚫 #722: EqualityOperator → "img.status === 'completed'" [0 tests]
   🚫 #723: StringLiteral → """" [0 tests]
298| 
299| 	drawOverlaysForData(img.bitmap, img.parsedData, img.detections, img.naturalWidth, img.naturalHeight);
300| }
301| 
302| function updateProgress() {
   🚫 #724: BlockStatement → "{}" [0 tests]
303| 	if (!currentSession) return;
   🚫 #725: BooleanLiteral → "currentSession" [0 tests]
   🚫 #726: ConditionalExpression → "true" [0 tests]
   🚫 #727: ConditionalExpression → "false" [0 tests]
304| 
305| 	const progress = getSessionProgress(currentSession);
306| 	progressText.textContent = `Analyzing ${progress.done} of ${progress.total} images...`;
   🚫 #728: StringLiteral → "``" [0 tests]
307| 	progressFill.style.width = `${progress.percentage}%`;
   🚫 #729: StringLiteral → "``" [0 tests]
308| 	progressFill.textContent = `${progress.percentage}%`;
   🚫 #730: StringLiteral → "``" [0 tests]
309| }
310| 
311| function createThumbnailDataUrl(bitmap) {
   🚫 #731: BlockStatement → "{}" [0 tests]
312| 	const thumbCanvas = document.createElement('canvas');
   🚫 #732: StringLiteral → """" [0 tests]
313| 	const thumbCtx = thumbCanvas.getContext('2d');
   🚫 #733: StringLiteral → """" [0 tests]
314| 	const maxHeight = 80;
315| 	const scale = maxHeight / bitmap.height;
   🚫 #734: ArithmeticOperator → "maxHeight * bitmap.height" [0 tests]
316| 	thumbCanvas.width = bitmap.width * scale;
   🚫 #735: ArithmeticOperator → "bitmap.width / scale" [0 tests]
317| 	thumbCanvas.height = maxHeight;
318| 	thumbCtx.drawImage(bitmap, 0, 0, thumbCanvas.width, thumbCanvas.height);
319| 	return thumbCanvas.toDataURL('image/jpeg', 0.7);
   🚫 #736: StringLiteral → """" [0 tests]
320| }
321| 
322| function drawOverlays() {
   🚫 #737: BlockStatement → "{}" [0 tests]
323| 	if (!currentImageBitmap || !currentParsedData) return;
   🚫 #738: ConditionalExpression → "true" [0 tests]
   🚫 #739: ConditionalExpression → "false" [0 tests]
   🚫 #740: LogicalOperator → "!currentImageBitmap && !currentParsedData" [0 tests]
   🚫 #741: BooleanLiteral → "currentImageBitmap" [0 tests]
   🚫 #742: BooleanLiteral → "currentParsedData" [0 tests]
324| 	drawOverlaysForData(currentImageBitmap, currentParsedData, currentDetections, naturalW, naturalH);
325| }
326| 
327| function drawOverlaysForData(bitmap, parsedData, detections, natW, natH) {
   🚫 #743: BlockStatement → "{}" [0 tests]
328| 	if (!bitmap || !parsedData) return;
   🚫 #744: ConditionalExpression → "true" [0 tests]
   🚫 #745: ConditionalExpression → "false" [0 tests]
   🚫 #746: LogicalOperator → "!bitmap && !parsedData" [0 tests]
   🚫 #747: BooleanLiteral → "bitmap" [0 tests]
   🚫 #748: BooleanLiteral → "parsedData" [0 tests]
329| 
330| 	// Redraw base image
331| 	ctx.clearRect(0, 0, canvas.width, canvas.height);
332| 	ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
333| 
334| 	const scaleX = canvas.width / natW;
   🚫 #749: ArithmeticOperator → "canvas.width * natW" [0 tests]
335| 	const scaleY = canvas.height / natH;
   🚫 #750: ArithmeticOperator → "canvas.height * natH" [0 tests]
336| 	const coordSystem = ensureCoordSystem(parsedData, 'normalized_0_1000');
   🚫 #751: StringLiteral → """" [0 tests]
337| 	const coordOrigin = ensureCoordOrigin(parsedData, 'top-left');
   🚫 #752: StringLiteral → """" [0 tests]
338| 
339| 	for (const d of detections) {
   🚫 #753: BlockStatement → "{}" [0 tests]
340| 		const isHighlighted = highlightedDetectionId === d.id;
   🚫 #754: ConditionalExpression → "true" [0 tests]
   🚫 #755: ConditionalExpression → "false" [0 tests]
   🚫 #756: EqualityOperator → "highlightedDetectionId !== d.id" [0 tests]
341| 		const color = colorForCategory(d.category);
342| 		const label = `${d.label ?? 'item'}${typeof d.confidence === 'number' ? ` (${(d.confidence*100).toFixed(0)}%)` : ''}`;
   🚫 #757: StringLiteral → "``" [0 tests]
   🚫 #758: LogicalOperator → "d.label && 'item'" [0 tests]
   🚫 #759: StringLiteral → """" [0 tests]
   🚫 #760: ConditionalExpression → "true" [0 tests]
   🚫 #761: ConditionalExpression → "false" [0 tests]
   🚫 #762: EqualityOperator → "typeof d.confidence !== 'number'" [0 tests]
   🚫 #763: StringLiteral → """" [0 tests]
   🚫 #764: StringLiteral → "``" [0 tests]
   🚫 #765: ArithmeticOperator → "d.confidence / 100" [0 tests]
   🚫 #766: StringLiteral → ""Stryker was here!"" [0 tests]
343| 
344| 		if (isHighlighted) {
   🚫 #767: ConditionalExpression → "true" [0 tests]
   🚫 #768: ConditionalExpression → "false" [0 tests]
   🚫 #769: BlockStatement → "{}" [0 tests]
345| 			ctx.save();
346| 			ctx.shadowColor = color;
347| 			ctx.shadowBlur = 15;
348| 		}
349| 
350| 		if (d.bbox) {
   🚫 #770: ConditionalExpression → "true" [0 tests]
   🚫 #771: ConditionalExpression → "false" [0 tests]
   🚫 #772: BlockStatement → "{}" [0 tests]
351| 			const b = toCanvasBox(
352| 				d.bbox,
353| 				coordSystem,
354| 				scaleX,
355| 				scaleY,
356| 				natW,
357| 				natH,
358| 				coordOrigin,
359| 				canvas.width,
360| 				canvas.height
361| 			);
362| 			if (b) {
   🚫 #773: ConditionalExpression → "true" [0 tests]
   🚫 #774: ConditionalExpression → "false" [0 tests]
   🚫 #775: BlockStatement → "{}" [0 tests]
363| 				if (isHighlighted) ctx.lineWidth = 4;
   🚫 #776: ConditionalExpression → "true" [0 tests]
   🚫 #777: ConditionalExpression → "false" [0 tests]
364| 				drawBox(b, label, color);
365| 			}
366| 		}
367| 		if (Array.isArray(d.polygon) && d.polygon.length >= 3) {
   🚫 #778: ConditionalExpression → "true" [0 tests]
   🚫 #779: ConditionalExpression → "false" [0 tests]
   🚫 #780: LogicalOperator → "Array.isArray(d.polygon) || d.polygon.length >= 3" [0 tests]
   🚫 #781: ConditionalExpression → "true" [0 tests]
   🚫 #782: EqualityOperator → "d.polygon.length > 3" [0 tests]
   🚫 #783: EqualityOperator → "d.polygon.length < 3" [0 tests]
   🚫 #784: BlockStatement → "{}" [0 tests]
368| 			const pts = toCanvasPolygon(d.polygon, coordSystem, scaleX, scaleY, natW, natH, coordOrigin);
369| 			if (pts) {
   🚫 #785: ConditionalExpression → "true" [0 tests]
   🚫 #786: ConditionalExpression → "false" [0 tests]
   🚫 #787: BlockStatement → "{}" [0 tests]
370| 				if (isHighlighted) ctx.lineWidth = 4;
   🚫 #788: ConditionalExpression → "true" [0 tests]
   🚫 #789: ConditionalExpression → "false" [0 tests]
371| 				drawPolygon(pts, label, color);
372| 			}
373| 		}
374| 
375| 		if (isHighlighted) {
   🚫 #790: ConditionalExpression → "true" [0 tests]
   🚫 #791: ConditionalExpression → "false" [0 tests]
   🚫 #792: BlockStatement → "{}" [0 tests]
376| 			ctx.restore();
377| 		}
378| 	}
379| }
380| 
381| function getStoredApiKey() {
   🚫 #793: BlockStatement → "{}" [0 tests]
382| 	try {
   🚫 #794: BlockStatement → "{}" [0 tests]
383| 		return globalThis.localStorage?.getItem(STORAGE_KEY) || '';
   🚫 #795: ConditionalExpression → "true" [0 tests]
   🚫 #796: ConditionalExpression → "false" [0 tests]
   🚫 #797: LogicalOperator → "globalThis.localStorage?.getItem(STORAGE_KEY) && ''" [0 tests]
   🚫 #798: OptionalChaining → "globalThis.localStorage.getItem" [0 tests]
   🚫 #799: StringLiteral → ""Stryker was here!"" [0 tests]
384| 	} catch {
   🚫 #800: BlockStatement → "{}" [0 tests]
385| 		return '';
   🚫 #801: StringLiteral → ""Stryker was here!"" [0 tests]
386| 	}
387| }
388| 
389| function persistApiKey(value) {
   🚫 #802: BlockStatement → "{}" [0 tests]
390| 	try {
   🚫 #803: BlockStatement → "{}" [0 tests]
391| 		const trimmed = value.trim();
   🚫 #804: MethodExpression → "value" [0 tests]
392| 		if (trimmed) {
   🚫 #805: ConditionalExpression → "true" [0 tests]
   🚫 #806: ConditionalExpression → "false" [0 tests]
   🚫 #807: BlockStatement → "{}" [0 tests]
393| 			globalThis.localStorage?.setItem(STORAGE_KEY, trimmed);
   🚫 #808: OptionalChaining → "globalThis.localStorage.setItem" [0 tests]
394| 		} else {
   🚫 #809: BlockStatement → "{}" [0 tests]
395| 			globalThis.localStorage?.removeItem(STORAGE_KEY);
   🚫 #810: OptionalChaining → "globalThis.localStorage.removeItem" [0 tests]
396| 		}
397| 	} catch {
398| 		// Ignore storage errors (private mode, quotas, etc.)
399| 	}
400| }
401| 
402| const storedApiKey = getStoredApiKey();
403| if (storedApiKey) {
   🚫 #811: ConditionalExpression → "true" [0 tests]
   🚫 #812: ConditionalExpression → "false" [0 tests]
   🚫 #813: BlockStatement → "{}" [0 tests]
404| 	apiKeyEl.value = storedApiKey;
405| }
406| 
407| function toBase64(file) {
   🚫 #814: BlockStatement → "{}" [0 tests]
408| 	return new Promise((res, rej) => {
   🚫 #815: BlockStatement → "{}" [0 tests]
409| 		const r = new FileReader();
410| 		r.onload = () => res(extractBase64FromDataUrl(String(r.result)));
   🚫 #816: ArrowFunction → "() => undefined" [0 tests]
411| 		r.onerror = rej;
412| 		r.readAsDataURL(file);
413| 	});
414| }
415| 
416| async function drawImage(file) {
   🚫 #817: BlockStatement → "{}" [0 tests]
417| 	const bmp = await createImageBitmap(file);
418| 	currentImageBitmap = bmp;
419| 	naturalW = bmp.width;
420| 	naturalH = bmp.height;
421| 	// Fit to viewport width but keep full resolution internally
422| 	const scale = calculateDisplayScale(naturalW, window.innerWidth);
423| 	canvas.width  = Math.round(naturalW * scale);
   🚫 #818: ArithmeticOperator → "naturalW / scale" [0 tests]
424| 	canvas.height = Math.round(naturalH * scale);
   🚫 #819: ArithmeticOperator → "naturalH / scale" [0 tests]
425| 	// Draw scaled image
426| 	ctx.clearRect(0,0,canvas.width,canvas.height);
427| 	ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
428| 	return { scaleX: scale, scaleY: scale };
   🚫 #820: ObjectLiteral → "{}" [0 tests]
429| }
430| 
431| function setDrag(drag) {
   🚫 #821: BlockStatement → "{}" [0 tests]
432| 	dropzone.classList.toggle('drag', !!drag);
   🚫 #822: StringLiteral → """" [0 tests]
   🚫 #823: BooleanLiteral → "!drag" [0 tests]
   🚫 #824: BooleanLiteral → "drag" [0 tests]
433| }
434| 
435| function drawLabelBox(x, y, text) {
   🚫 #825: BlockStatement → "{}" [0 tests]
436| 	ctx.save();
437| 	ctx.font = '12px ui-sans-serif, system-ui, -apple-system';
   🚫 #826: StringLiteral → """" [0 tests]
438| 	const pad = 4;
439| 	const metrics = ctx.measureText(text);
440| 	const w = metrics.width + pad*2;
   🚫 #827: ArithmeticOperator → "metrics.width - pad * 2" [0 tests]
   🚫 #828: ArithmeticOperator → "pad / 2" [0 tests]
441| 	const h = 16 + pad*2;
   🚫 #829: ArithmeticOperator → "16 - pad * 2" [0 tests]
   🚫 #830: ArithmeticOperator → "pad / 2" [0 tests]
442| 	ctx.fillStyle = 'rgba(0,0,0,0.6)';
   🚫 #831: StringLiteral → """" [0 tests]
443| 	ctx.fillRect(x, Math.max(0, y - h), w, h);
   🚫 #832: MethodExpression → "Math.min(0, y - h)" [0 tests]
   🚫 #833: ArithmeticOperator → "y + h" [0 tests]
444| 	ctx.fillStyle = '#ffffff';
   🚫 #834: StringLiteral → """" [0 tests]
445| 	ctx.fillText(text, x + pad, Math.max(12 + (y - h) + pad, 12));
   🚫 #835: ArithmeticOperator → "x - pad" [0 tests]
   🚫 #836: MethodExpression → "Math.min(12 + (y - h) + pad, 12)" [0 tests]
   🚫 #837: ArithmeticOperator → "12 + (y - h) - pad" [0 tests]
   🚫 #838: ArithmeticOperator → "12 - (y - h)" [0 tests]
   🚫 #839: ArithmeticOperator → "y + h" [0 tests]
446| 	ctx.restore();
447| }
448| 
449| function drawBox(b, label, color) {
   🚫 #840: BlockStatement → "{}" [0 tests]
450| 	ctx.save();
451| 	ctx.lineWidth = 2;
452| 	ctx.strokeStyle = color;
453| 	ctx.strokeRect(b.x, b.y, b.width, b.height);
454| 	drawLabelBox(b.x, b.y, label);
455| 	ctx.restore();
456| }
457| 
458| function drawPolygon(points, label, color) {
   🚫 #841: BlockStatement → "{}" [0 tests]
459| 	if (!points || points.length < 3) return;
   🚫 #842: ConditionalExpression → "true" [0 tests]
   🚫 #843: ConditionalExpression → "false" [0 tests]
   🚫 #844: LogicalOperator → "!points && points.length < 3" [0 tests]
   🚫 #845: BooleanLiteral → "points" [0 tests]
   🚫 #846: ConditionalExpression → "false" [0 tests]
   🚫 #847: EqualityOperator → "points.length <= 3" [0 tests]
   🚫 #848: EqualityOperator → "points.length >= 3" [0 tests]
460| 	ctx.save();
461| 	ctx.lineWidth = 2;
462| 	ctx.strokeStyle = color;
463| 	ctx.beginPath();
464| 	ctx.moveTo(points[0].x, points[0].y);
465| 	for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
   🚫 #849: ConditionalExpression → "false" [0 tests]
   🚫 #850: EqualityOperator → "i <= points.length" [0 tests]
   🚫 #851: EqualityOperator → "i >= points.length" [0 tests]
   🚫 #852: UpdateOperator → "i--" [0 tests]
466| 	ctx.closePath();
467| 	ctx.stroke();
468| 	// Label near first vertex
469| 	drawLabelBox(points[0].x, points[0].y, label);
470| 	ctx.restore();
471| }
472| 
473| // colorForCategory is now imported from ui-utils.js
474| 
475| async function callGeminiREST({ apiKey, model, file }) {
   🚫 #853: BlockStatement → "{}" [0 tests]
476| 	const base64 = await toBase64(file);
477| 	const parts = [
   🚫 #854: ArrayDeclaration → "[]" [0 tests]
478| 		{ inline_data: { mime_type: file.type || 'image/jpeg', data: base64 } },
   🚫 #855: ObjectLiteral → "{}" [0 tests]
   🚫 #856: ObjectLiteral → "{}" [0 tests]
   🚫 #857: ConditionalExpression → "true" [0 tests]
   🚫 #858: ConditionalExpression → "false" [0 tests]
   🚫 #859: LogicalOperator → "file.type && 'image/jpeg'" [0 tests]
   🚫 #860: StringLiteral → """" [0 tests]
479| 		{ text: AEC_PROMPT }
   🚫 #861: ObjectLiteral → "{}" [0 tests]
480| 	];
481| 
482| 	// Build two payload flavors: snake_case (REST-preferred) and camelCase (fallback)
483| 	const snake = {
   🚫 #862: ObjectLiteral → "{}" [0 tests]
484| 		contents: [{ parts }],
   🚫 #863: ArrayDeclaration → "[]" [0 tests]
   🚫 #864: ObjectLiteral → "{}" [0 tests]
485| 		generationConfig: {
   🚫 #865: ObjectLiteral → "{}" [0 tests]
486| 			response_mime_type: "application/json",
   🚫 #866: StringLiteral → """" [0 tests]
487| 			response_schema: RESPONSE_SCHEMA
488| 		}
489| 	};
490| 	const camel = {
   🚫 #867: ObjectLiteral → "{}" [0 tests]
491| 		contents: [{ parts }],
   🚫 #868: ArrayDeclaration → "[]" [0 tests]
   🚫 #869: ObjectLiteral → "{}" [0 tests]
492| 		generationConfig: {
   🚫 #870: ObjectLiteral → "{}" [0 tests]
493| 			responseMimeType: "application/json",
   🚫 #871: StringLiteral → """" [0 tests]
494| 			responseSchema: RESPONSE_SCHEMA
495| 		}
496| 	};
497| 
498| 	const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
   🚫 #872: StringLiteral → "``" [0 tests]
499| 	async function post(body) {
   🚫 #873: BlockStatement → "{}" [0 tests]
500| 		const r = await fetch(url, {
   🚫 #874: ObjectLiteral → "{}" [0 tests]
501| 			method: 'POST',
   🚫 #875: StringLiteral → """" [0 tests]
502| 			headers: {
   🚫 #876: ObjectLiteral → "{}" [0 tests]
503| 				'Content-Type': 'application/json',
   🚫 #877: StringLiteral → """" [0 tests]
504| 				'x-goog-api-key': apiKey
505| 			},
506| 			body: JSON.stringify(body)
507| 		});
508| 		const data = await r.json().catch(() => ({}));
   🚫 #878: ArrowFunction → "() => undefined" [0 tests]
509| 		if (!r.ok) {
   🚫 #879: BooleanLiteral → "r.ok" [0 tests]
   🚫 #880: ConditionalExpression → "true" [0 tests]
   🚫 #881: ConditionalExpression → "false" [0 tests]
   🚫 #882: BlockStatement → "{}" [0 tests]
510| 			const msg = (data && (data.error?.message || data.candidates?.[0]?.finishReason)) || `HTTP ${r.status}`;
   🚫 #883: ConditionalExpression → "true" [0 tests]
   🚫 #884: ConditionalExpression → "false" [0 tests]
   🚫 #885: LogicalOperator → "data && (data.error?.message || data.candidates?.[0]?.finishReason) && `HTTP ${r.status}`" [0 tests]
   🚫 #886: ConditionalExpression → "false" [0 tests]
   🚫 #887: LogicalOperator → "data || data.error?.message || data.candidates?.[0]?.finishReason" [0 tests]
   🚫 #888: ConditionalExpression → "true" [0 tests]
   🚫 #889: LogicalOperator → "data.error?.message && data.candidates?.[0]?.finishReason" [0 tests]
   🚫 #890: OptionalChaining → "data.error.message" [0 tests]
   🚫 #891: OptionalChaining → "data.candidates?.[0].finishReason" [0 tests]
   🚫 #892: OptionalChaining → "data.candidates[0]" [0 tests]
   🚫 #893: StringLiteral → "``" [0 tests]
511| 			throw new Error(msg);
512| 		}
513| 		return data;
514| 	}
515| 
516| 	try {
   🚫 #894: BlockStatement → "{}" [0 tests]
517| 		return await post(snake);
518| 	} catch (e1) {
   🚫 #895: BlockStatement → "{}" [0 tests]
519| 		// Retry with camelCase schema fields if the first fails
520| 		try {
   🚫 #896: BlockStatement → "{}" [0 tests]
521| 			return await post(camel);
522| 		} catch (e2) {
   🚫 #897: BlockStatement → "{}" [0 tests]
523| 			throw new Error(`Gemini call failed.\nFirst: ${e1.message}\nThen: ${e2.message}`);
   🚫 #898: StringLiteral → "``" [0 tests]
524| 		}
525| 	}
526| }
527| 
528| // extractJSONFromResponse is now imported from ui-utils.js
529| 
530| async function analyzeCurrentImage({ silentOnMissingKey = false } = {}) {
   🚫 #899: BooleanLiteral → "true" [0 tests]
   🚫 #900: BlockStatement → "{}" [0 tests]
531| 	const apiKey = apiKeyEl.value.trim();
   🚫 #901: MethodExpression → "apiKeyEl.value" [0 tests]
532| 	const model  = modelEl.value.trim() || 'gemini-2.5-pro';
   🚫 #902: ConditionalExpression → "true" [0 tests]
   🚫 #903: ConditionalExpression → "false" [0 tests]
   🚫 #904: LogicalOperator → "modelEl.value.trim() && 'gemini-2.5-pro'" [0 tests]
   🚫 #905: MethodExpression → "modelEl.value" [0 tests]
   🚫 #906: StringLiteral → """" [0 tests]
533| 
534| 	if (!apiKey) {
   🚫 #907: BooleanLiteral → "apiKey" [0 tests]
   🚫 #908: ConditionalExpression → "true" [0 tests]
   🚫 #909: ConditionalExpression → "false" [0 tests]
   🚫 #910: BlockStatement → "{}" [0 tests]
535| 		if (!silentOnMissingKey) {
   🚫 #911: BooleanLiteral → "silentOnMissingKey" [0 tests]
   🚫 #912: ConditionalExpression → "true" [0 tests]
   🚫 #913: ConditionalExpression → "false" [0 tests]
   🚫 #914: BlockStatement → "{}" [0 tests]
536| 			logJson({ error: 'Missing API key' }, 'Error');
   🚫 #915: ObjectLiteral → "{}" [0 tests]
   🚫 #916: StringLiteral → """" [0 tests]
   🚫 #917: StringLiteral → """" [0 tests]
537| 		}
538| 		return;
539| 	}
540| 
541| 	if (!currentFile) {
   🚫 #918: BooleanLiteral → "currentFile" [0 tests]
   🚫 #919: ConditionalExpression → "true" [0 tests]
   🚫 #920: ConditionalExpression → "false" [0 tests]
   🚫 #921: BlockStatement → "{}" [0 tests]
542| 		if (!silentOnMissingKey) {
   🚫 #922: BooleanLiteral → "silentOnMissingKey" [0 tests]
   🚫 #923: ConditionalExpression → "true" [0 tests]
   🚫 #924: ConditionalExpression → "false" [0 tests]
   🚫 #925: BlockStatement → "{}" [0 tests]
543| 			logJson({ error: 'No image selected' }, 'Error');
   🚫 #926: ObjectLiteral → "{}" [0 tests]
   🚫 #927: StringLiteral → """" [0 tests]
   🚫 #928: StringLiteral → """" [0 tests]
544| 		}
545| 		return;
546| 	}
547| 
548| 	persistApiKey(apiKey);
549| 	pendingApiKeyAnalysis = false;
   🚫 #929: BooleanLiteral → "true" [0 tests]
550| 
551| 	if (isAnalyzing) {
   🚫 #930: ConditionalExpression → "true" [0 tests]
   🚫 #931: ConditionalExpression → "false" [0 tests]
   🚫 #932: BlockStatement → "{}" [0 tests]
552| 		analysisQueued = true;
   🚫 #933: BooleanLiteral → "false" [0 tests]
553| 		return;
554| 	}
555| 
556| 	isAnalyzing = true;
   🚫 #934: BooleanLiteral → "false" [0 tests]
557| 	analysisQueued = false;
   🚫 #935: BooleanLiteral → "true" [0 tests]
558| 
559| 	clearReport();
560| 	currentDetections = [];
   🚫 #936: ArrayDeclaration → "["Stryker was here"]" [0 tests]
561| 	currentParsedData = null;
562| 	highlightedDetectionId = null;
563| 
564| 	if (currentImageBitmap) {
   🚫 #937: ConditionalExpression → "true" [0 tests]
   🚫 #938: ConditionalExpression → "false" [0 tests]
   🚫 #939: BlockStatement → "{}" [0 tests]
565| 		ctx.clearRect(0,0,canvas.width,canvas.height);
566| 		ctx.drawImage(currentImageBitmap, 0, 0, canvas.width, canvas.height);
567| 	}
568| 
569| 	logJson({ status: 'Calling Gemini…' });
   🚫 #940: ObjectLiteral → "{}" [0 tests]
   🚫 #941: StringLiteral → """" [0 tests]
570| 
571| 	try {
   🚫 #942: BlockStatement → "{}" [0 tests]
572| 		const resp = await callGeminiREST({ apiKey, model, file: currentFile });
   🚫 #943: ObjectLiteral → "{}" [0 tests]
573| 		const parsed = extractJSONFromResponse(resp);
574| 
575| 		prepareDetectionData(parsed, naturalW, naturalH);
576| 
577| 		const coordSystem = ensureCoordSystem(parsed, 'normalized_0_1000');
   🚫 #944: StringLiteral → """" [0 tests]
578| 		ensureCoordOrigin(parsed, 'top-left');
   🚫 #945: StringLiteral → """" [0 tests]
579| 		if (parsed.image.coordSystem == null) parsed.image.coordSystem = coordSystem;
   🚫 #946: ConditionalExpression → "true" [0 tests]
   🚫 #947: ConditionalExpression → "false" [0 tests]
   🚫 #948: EqualityOperator → "parsed.image.coordSystem != null" [0 tests]
580| 
581| 		currentParsedData = parsed;
582| 		currentDetections = Array.isArray(parsed.detections) ? parsed.detections : [];
   🚫 #949: ArrayDeclaration → "["Stryker was here"]" [0 tests]
583| 
584| 		drawOverlays();
585| 
586| 		const reportHtml = renderReportUI(parsed);
587| 		reportWrap.innerHTML = reportHtml;
588| 
589| 		setupReportInteractions(
590| 			reportWrap,
591| 			currentDetections,
592| 			(detection) => {
   🚫 #950: BlockStatement → "{}" [0 tests]
593| 				highlightedDetectionId = detection.id;
594| 				drawOverlays();
595| 			},
596| 			() => {
   🚫 #951: BlockStatement → "{}" [0 tests]
597| 				highlightedDetectionId = null;
598| 				drawOverlays();
599| 			}
600| 		);
601| 
602| 		logJson(parsed, 'Model JSON');
   🚫 #952: StringLiteral → """" [0 tests]
603| 	} catch (err) {
   🚫 #953: BlockStatement → "{}" [0 tests]
604| 		clearReport();
605| 		logJson({ error: String(err?.message || err) }, 'Error');
   🚫 #954: ObjectLiteral → "{}" [0 tests]
   🚫 #955: ConditionalExpression → "true" [0 tests]
   🚫 #956: ConditionalExpression → "false" [0 tests]
   🚫 #957: LogicalOperator → "err?.message && err" [0 tests]
   🚫 #958: OptionalChaining → "err.message" [0 tests]
   🚫 #959: StringLiteral → """" [0 tests]
606| 	} finally {
   🚫 #960: BlockStatement → "{}" [0 tests]
607| 		isAnalyzing = false;
   🚫 #961: BooleanLiteral → "true" [0 tests]
608| 		if (analysisQueued) {
   🚫 #962: ConditionalExpression → "true" [0 tests]
   🚫 #963: ConditionalExpression → "false" [0 tests]
   🚫 #964: BlockStatement → "{}" [0 tests]
609| 			analysisQueued = false;
   🚫 #965: BooleanLiteral → "true" [0 tests]
610| 			await analyzeCurrentImage({ silentOnMissingKey: true });
   🚫 #966: ObjectLiteral → "{}" [0 tests]
   🚫 #967: BooleanLiteral → "false" [0 tests]
611| 		}
612| 	}
613| }
614| 
615| async function handleFileSelection(file) {
   🚫 #968: BlockStatement → "{}" [0 tests]
616| 	if (!file) return;
   🚫 #969: BooleanLiteral → "file" [0 tests]
   🚫 #970: ConditionalExpression → "true" [0 tests]
   🚫 #971: ConditionalExpression → "false" [0 tests]
617| 
618| 	currentFile = file;
619| 	currentParsedData = null;
620| 	currentDetections = [];
   🚫 #972: ArrayDeclaration → "["Stryker was here"]" [0 tests]
621| 	highlightedDetectionId = null;
622| 	analysisQueued = false;
   🚫 #973: BooleanLiteral → "true" [0 tests]
623| 
624| 	try {
   🚫 #974: BlockStatement → "{}" [0 tests]
625| 		await drawImage(file);
626| 	} catch (err) {
   🚫 #975: BlockStatement → "{}" [0 tests]
627| 		logJson({ error: `Failed to load image: ${String(err?.message || err)}` }, 'Error');
   🚫 #976: ObjectLiteral → "{}" [0 tests]
   🚫 #977: StringLiteral → "``" [0 tests]
   🚫 #978: ConditionalExpression → "true" [0 tests]
   🚫 #979: ConditionalExpression → "false" [0 tests]
   🚫 #980: LogicalOperator → "err?.message && err" [0 tests]
   🚫 #981: OptionalChaining → "err.message" [0 tests]
   🚫 #982: StringLiteral → """" [0 tests]
628| 		return;
629| 	}
630| 
631| 	clearReport();
632| 
633| 	const apiKey = apiKeyEl.value.trim();
   🚫 #983: MethodExpression → "apiKeyEl.value" [0 tests]
634| 	if (!apiKey) {
   🚫 #984: BooleanLiteral → "apiKey" [0 tests]
   🚫 #985: ConditionalExpression → "true" [0 tests]
   🚫 #986: ConditionalExpression → "false" [0 tests]
   🚫 #987: BlockStatement → "{}" [0 tests]
635| 		pendingApiKeyAnalysis = true;
   🚫 #988: BooleanLiteral → "false" [0 tests]
636| 		logJson({ message: 'Image loaded. Enter your API key to start analysis.' });
   🚫 #989: ObjectLiteral → "{}" [0 tests]
   🚫 #990: StringLiteral → """" [0 tests]
637| 		return;
638| 	}
639| 
640| 	pendingApiKeyAnalysis = false;
   🚫 #991: BooleanLiteral → "true" [0 tests]
641| 	await analyzeCurrentImage({ silentOnMissingKey: true });
   🚫 #992: ObjectLiteral → "{}" [0 tests]
   🚫 #993: BooleanLiteral → "false" [0 tests]
642| }
643| 
644| // ---------- Event wiring ----------
645| dropzone.addEventListener('click', () => fileEl.click());
   🚫 #994: StringLiteral → """" [0 tests]
   🚫 #995: ArrowFunction → "() => undefined" [0 tests]
646| 
647| dropzone.addEventListener('dragover', e => { e.preventDefault(); setDrag(true); });
   🚫 #996: StringLiteral → """" [0 tests]
   🚫 #997: BlockStatement → "{}" [0 tests]
   🚫 #998: BooleanLiteral → "false" [0 tests]
648| dropzone.addEventListener('dragleave', () => setDrag(false));
   🚫 #999: StringLiteral → """" [0 tests]
   🚫 #1000: ArrowFunction → "() => undefined" [0 tests]
   🚫 #1001: BooleanLiteral → "true" [0 tests]
649| dropzone.addEventListener('drop', async e => {
   🚫 #1002: StringLiteral → """" [0 tests]
   🚫 #1003: BlockStatement → "{}" [0 tests]
650| 	e.preventDefault();
651| 	setDrag(false);
   🚫 #1004: BooleanLiteral → "true" [0 tests]
652| 	const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
   🚫 #1005: MethodExpression → "Array.from(e.dataTransfer.files)" [0 tests]
   🚫 #1006: ArrowFunction → "() => undefined" [0 tests]
   🚫 #1007: MethodExpression → "f.type.endsWith('image/')" [0 tests]
   🚫 #1008: StringLiteral → """" [0 tests]
653| 	
654| 	if (files.length === 0) return;
   🚫 #1009: ConditionalExpression → "true" [0 tests]
   🚫 #1010: ConditionalExpression → "false" [0 tests]
   🚫 #1011: EqualityOperator → "files.length !== 0" [0 tests]
655| 	
656| 	if (files.length === 1) {
   🚫 #1012: ConditionalExpression → "true" [0 tests]
   🚫 #1013: ConditionalExpression → "false" [0 tests]
   🚫 #1014: EqualityOperator → "files.length !== 1" [0 tests]
   🚫 #1015: BlockStatement → "{}" [0 tests]
657| 		await handleFileSelection(files[0]);
658| 	} else {
   🚫 #1016: BlockStatement → "{}" [0 tests]
659| 		await handleMultipleFiles(files);
660| 	}
661| });
662| 
663| fileEl.addEventListener('change', async e => {
   🚫 #1017: StringLiteral → """" [0 tests]
   🚫 #1018: BlockStatement → "{}" [0 tests]
664| 	const files = Array.from(e.target.files);
665| 	if (files.length === 0) return;
   🚫 #1019: ConditionalExpression → "true" [0 tests]
   🚫 #1020: ConditionalExpression → "false" [0 tests]
   🚫 #1021: EqualityOperator → "files.length !== 0" [0 tests]
666| 	
667| 	if (files.length === 1) {
   🚫 #1022: ConditionalExpression → "true" [0 tests]
   🚫 #1023: ConditionalExpression → "false" [0 tests]
   🚫 #1024: EqualityOperator → "files.length !== 1" [0 tests]
   🚫 #1025: BlockStatement → "{}" [0 tests]
668| 		await handleFileSelection(files[0]);
669| 	} else {
   🚫 #1026: BlockStatement → "{}" [0 tests]
670| 		await handleMultipleFiles(files);
671| 	}
672| 	e.target.value = '';
   🚫 #1027: StringLiteral → ""Stryker was here!"" [0 tests]
673| });
674| 
675| apiKeyEl.addEventListener('input', async e => {
   🚫 #1028: StringLiteral → """" [0 tests]
   🚫 #1029: BlockStatement → "{}" [0 tests]
676| 	const value = e.target.value;
677| 	persistApiKey(value);
678| 	if (pendingApiKeyAnalysis && value.trim() && !isAnalyzing) {
   🚫 #1030: ConditionalExpression → "true" [0 tests]
   🚫 #1031: ConditionalExpression → "false" [0 tests]
   🚫 #1032: LogicalOperator → "pendingApiKeyAnalysis && value.trim() || !isAnalyzing" [0 tests]
   🚫 #1033: ConditionalExpression → "true" [0 tests]
   🚫 #1034: LogicalOperator → "pendingApiKeyAnalysis || value.trim()" [0 tests]
   🚫 #1035: MethodExpression → "value" [0 tests]
   🚫 #1036: BooleanLiteral → "isAnalyzing" [0 tests]
   🚫 #1037: BlockStatement → "{}" [0 tests]
679| 		pendingApiKeyAnalysis = false;
   🚫 #1038: BooleanLiteral → "true" [0 tests]
680| 		if (currentFile) {
   🚫 #1039: ConditionalExpression → "true" [0 tests]
   🚫 #1040: ConditionalExpression → "false" [0 tests]
   🚫 #1041: BlockStatement → "{}" [0 tests]
681| 			await analyzeCurrentImage({ silentOnMissingKey: true });
   🚫 #1042: ObjectLiteral → "{}" [0 tests]
   🚫 #1043: BooleanLiteral → "false" [0 tests]
682| 		} else if (currentSession) {
   🚫 #1044: ConditionalExpression → "true" [0 tests]
   🚫 #1045: ConditionalExpression → "false" [0 tests]
   🚫 #1046: BlockStatement → "{}" [0 tests]
683| 			await analyzeMultipleImages(currentSession.images.map(img => img.file));
   🚫 #1047: ArrowFunction → "() => undefined" [0 tests]
684| 		}
685| 	}
686| });
687| 
688| // ---------- Initial message ----------
689| logJson({ message: 'Drop or click to choose images (up to 20). Analysis runs automatically.' });
   🚫 #1048: ObjectLiteral → "{}" [0 tests]
   🚫 #1049: StringLiteral → """" [0 tests]
690| 
```

#### 🚫 Coverage Gaps Summary

- **528 uncovered mutants** across 262 lines
- **Most affected lines**: 32, 33, 34, 35, 36
- **Common uncovered operations**: ConditionalExpression, StringLiteral, BlockStatement

##### Detailed No Coverage Mutants:
1. **Mutant #522** - Line 32:42-50: `StringLiteral` → `""`
2. **Mutant #523** - Line 33:42-49: `StringLiteral` → `""`
3. **Mutant #524** - Line 34:42-48: `StringLiteral` → `""`
4. **Mutant #525** - Line 35:42-52: `StringLiteral` → `""`
5. **Mutant #526** - Line 36:42-50: `StringLiteral` → `""`
6. **Mutant #527** - Line 37:36-40: `StringLiteral` → `""`
7. **Mutant #528** - Line 38:44-56: `StringLiteral` → `""`
8. **Mutant #529** - Line 39:42-51: `StringLiteral` → `""`
9. **Mutant #530** - Line 40:45-58: `StringLiteral` → `""`
10. **Mutant #531** - Line 41:46-60: `StringLiteral` → `""`
11. **Mutant #532** - Line 42:46-60: `StringLiteral` → `""`
12. **Mutant #533** - Line 43:41-50: `StringLiteral` → `""`
13. **Mutant #534** - Line 45:21-35: `StringLiteral` → `""`
14. **Mutant #535** - Line 50:19-24: `BooleanLiteral` → `true`
15. **Mutant #536** - Line 51:29-34: `BooleanLiteral` → `true`
16. **Mutant #537** - Line 56:25-27: `ArrayDeclaration` → `["Stryker was here"]`
17. **Mutant #538** - Line 60:22-27: `BooleanLiteral` → `true`
18. **Mutant #539** - Line 63:29-2: `BlockStatement` → `{}`
19. **Mutant #540** - Line 67:24-2: `BlockStatement` → `{}`
20. **Mutant #541** - Line 68:25-27: `StringLiteral` → `"Stryker was here!"`
21. **Mutant #542** - Line 73:43-2: `BlockStatement` → `{}`
22. **Mutant #543** - Line 76:6-35: `ConditionalExpression` → `true`
23. **Mutant #544** - Line 76:6-35: `ConditionalExpression` → `false`
24. **Mutant #545** - Line 76:6-35: `EqualityOperator` → `fileArray.length >= MAX_IMAGES`
25. **Mutant #546** - Line 76:6-35: `EqualityOperator` → `fileArray.length <= MAX_IMAGES`
26. **Mutant #547** - Line 76:37-3: `BlockStatement` → `{}`
27. **Mutant #548** - Line 77:11-95: `ObjectLiteral` → `{}`
28. **Mutant #549** - Line 77:20-93: `StringLiteral` → ````
29. **Mutant #550** - Line 77:97-104: `StringLiteral` → `""`
30. **Mutant #551** - Line 81:17-38: `MethodExpression` → `apiKeyEl.value`
31. **Mutant #552** - Line 82:6-13: `BooleanLiteral` → `apiKey`
32. **Mutant #553** - Line 82:6-13: `ConditionalExpression` → `true`
33. **Mutant #554** - Line 82:6-13: `ConditionalExpression` → `false`
34. **Mutant #555** - Line 82:15-3: `BlockStatement` → `{}`
35. **Mutant #556** - Line 83:27-31: `BooleanLiteral` → `false`
36. **Mutant #557** - Line 84:11-98: `ObjectLiteral` → `{}`
37. **Mutant #558** - Line 84:22-96: `StringLiteral` → ````
38. **Mutant #559** - Line 88:26-31: `BooleanLiteral` → `true`
39. **Mutant #560** - Line 92:45-2: `BlockStatement` → `{}`
40. **Mutant #561** - Line 93:6-17: `ConditionalExpression` → `true`
41. **Mutant #562** - Line 93:6-17: `ConditionalExpression` → `false`
42. **Mutant #563** - Line 94:16-20: `BooleanLiteral` → `false`
43. **Mutant #564** - Line 100:27-33: `StringLiteral` → `""`
44. **Mutant #565** - Line 101:30-37: `StringLiteral` → `""`
45. **Mutant #566** - Line 102:26-33: `StringLiteral` → `""`
46. **Mutant #567** - Line 109:43-3: `BlockStatement` → `{}`
47. **Mutant #568** - Line 110:7-4: `BlockStatement` → `{}`
48. **Mutant #569** - Line 114:17-4: `BlockStatement` → `{}`
49. **Mutant #570** - Line 115:16-54: `StringLiteral` → ````
50. **Mutant #571** - Line 116:17-24: `StringLiteral` → `""`
51. **Mutant #572** - Line 122:6-38: `ConditionalExpression` → `true`
52. **Mutant #573** - Line 122:6-38: `ConditionalExpression` → `false`
53. **Mutant #574** - Line 122:6-38: `EqualityOperator` → `currentSession.images.length >= 0`
54. **Mutant #575** - Line 122:6-38: `EqualityOperator` → `currentSession.images.length <= 0`
55. **Mutant #576** - Line 122:40-3: `BlockStatement` → `{}`
56. **Mutant #577** - Line 127:17-38: `MethodExpression` → `apiKeyEl.value`
57. **Mutant #578** - Line 128:16-56: `ConditionalExpression` → `true`
58. **Mutant #579** - Line 128:16-56: `ConditionalExpression` → `false`
59. **Mutant #580** - Line 128:16-56: `LogicalOperator` → `modelEl.value.trim() && 'gemini-2.5-pro'`
60. **Mutant #581** - Line 128:16-36: `MethodExpression` → `modelEl.value`
61. **Mutant #582** - Line 128:40-56: `StringLiteral` → `""`
62. **Mutant #583** - Line 131:3-63: `MethodExpression` → `currentSession.images`
63. **Mutant #584** - Line 131:32-62: `ArrowFunction` → `() => undefined`
64. **Mutant #585** - Line 131:39-62: `ConditionalExpression` → `true`
65. **Mutant #586** - Line 131:39-62: `ConditionalExpression` → `false`
66. **Mutant #587** - Line 131:39-62: `EqualityOperator` → `img.status !== 'queued'`
67. **Mutant #588** - Line 131:54-62: `StringLiteral` → `""`
68. **Mutant #589** - Line 132:18-4: `BlockStatement` → `{}`
69. **Mutant #590** - Line 133:17-28: `StringLiteral` → `""`
70. **Mutant #591** - Line 137:38-71: `ObjectLiteral` → `{}`
71. **Mutant #592** - Line 141:50-69: `StringLiteral` → `""`
72. **Mutant #593** - Line 142:30-40: `StringLiteral` → `""`
73. **Mutant #594** - Line 143:8-40: `ConditionalExpression` → `true`
74. **Mutant #595** - Line 143:8-40: `ConditionalExpression` → `false`
75. **Mutant #596** - Line 143:8-40: `EqualityOperator` → `parsed.image.coordSystem != null`
76. **Mutant #597** - Line 146:76-78: `ArrayDeclaration` → `["Stryker was here"]`
77. **Mutant #598** - Line 147:17-28: `StringLiteral` → `""`
78. **Mutant #599** - Line 151:27-4: `BlockStatement` → `{}`
79. **Mutant #600** - Line 152:8-13: `ConditionalExpression` → `true`
80. **Mutant #601** - Line 152:8-13: `ConditionalExpression` → `false`
81. **Mutant #602** - Line 152:15-5: `BlockStatement` → `{}`
82. **Mutant #603** - Line 153:24-47: `ConditionalExpression` → `true`
83. **Mutant #604** - Line 153:24-47: `ConditionalExpression` → `false`
84. **Mutant #605** - Line 153:24-47: `LogicalOperator` → `error?.message && error`
85. **Mutant #606** - Line 153:24-38: `OptionalChaining` → `error.message`
86. **Mutant #607** - Line 154:18-25: `StringLiteral` → `""`
87. **Mutant #608** - Line 160:8-78: `ConditionalExpression` → `true`
88. **Mutant #609** - Line 160:8-78: `ConditionalExpression` → `false`
89. **Mutant #610** - Line 160:8-78: `EqualityOperator` → `currentSession.activeImageIndex !== currentSession.images.indexOf(img)`
90. **Mutant #611** - Line 160:80-5: `BlockStatement` → `{}`
91. **Mutant #612** - Line 170:30-36: `StringLiteral` → `""`
92. **Mutant #613** - Line 178:6-51: `ConditionalExpression` → `true`
93. **Mutant #614** - Line 178:6-51: `ConditionalExpression` → `false`
94. **Mutant #615** - Line 178:6-51: `LogicalOperator` → `activeImg || activeImg.status === 'completed'`
95. **Mutant #616** - Line 178:19-51: `ConditionalExpression` → `true`
96. **Mutant #617** - Line 178:19-51: `EqualityOperator` → `activeImg.status !== 'completed'`
97. **Mutant #618** - Line 178:40-51: `StringLiteral` → `""`
98. **Mutant #619** - Line 178:53-3: `BlockStatement` → `{}`
99. **Mutant #620** - Line 182:19-5: `BlockStatement` → `{}`
100. **Mutant #621** - Line 186:10-5: `BlockStatement` → `{}`
101. **Mutant #622** - Line 194:48-60: `StringLiteral` → `""`
102. **Mutant #623** - Line 195:47-58: `StringLiteral` → `""`
103. **Mutant #624** - Line 197:6-19: `ConditionalExpression` → `true`
104. **Mutant #625** - Line 197:6-19: `ConditionalExpression` → `false`
105. **Mutant #626** - Line 197:21-3: `BlockStatement` → `{}`
106. **Mutant #627** - Line 198:34-41: `StringLiteral` → `""`
107. **Mutant #628** - Line 198:49-4: `BlockStatement` → `{}`
108. **Mutant #629** - Line 200:23-65: `StringLiteral` → ````
109. **Mutant #630** - Line 200:67-85: `StringLiteral` → `""`
110. **Mutant #631** - Line 204:6-18: `ConditionalExpression` → `true`
111. **Mutant #632** - Line 204:6-18: `ConditionalExpression` → `false`
112. **Mutant #633** - Line 204:20-3: `BlockStatement` → `{}`
113. **Mutant #634** - Line 205:33-40: `StringLiteral` → `""`
114. **Mutant #635** - Line 205:48-4: `BlockStatement` → `{}`
115. **Mutant #636** - Line 207:22-63: `StringLiteral` → ````
116. **Mutant #637** - Line 207:65-75: `StringLiteral` → `""`
117. **Mutant #638** - Line 211:10-195: `ObjectLiteral` → `{}`
118. **Mutant #639** - Line 211:21-193: `StringLiteral` → ````
119. **Mutant #640** - Line 211:113-176: `MethodExpression` → `currentSession.images`
120. **Mutant #641** - Line 211:142-175: `ArrowFunction` → `() => undefined`
121. **Mutant #642** - Line 211:149-175: `ConditionalExpression` → `true`
122. **Mutant #643** - Line 211:149-175: `ConditionalExpression` → `false`
123. **Mutant #644** - Line 211:149-175: `EqualityOperator` → `img.status !== 'completed'`
124. **Mutant #645** - Line 211:164-175: `StringLiteral` → `""`
125. **Mutant #646** - Line 212:16-21: `BooleanLiteral` → `true`
126. **Mutant #647** - Line 215:26-2: `BlockStatement` → `{}`
127. **Mutant #648** - Line 216:22-24: `StringLiteral` → `"Stryker was here!"`
128. **Mutant #649** - Line 217:48-3: `BlockStatement` → `{}`
129. **Mutant #650** - Line 218:40-45: `StringLiteral` → `""`
130. **Mutant #651** - Line 219:21-36: `StringLiteral` → `""`
131. **Mutant #652** - Line 220:14-31: `StringLiteral` → ````
132. **Mutant #653** - Line 221:7-48: `ConditionalExpression` → `true`
133. **Mutant #654** - Line 221:7-48: `ConditionalExpression` → `false`
134. **Mutant #655** - Line 221:7-48: `EqualityOperator` → `index !== currentSession.activeImageIndex`
135. **Mutant #656** - Line 221:50-4: `BlockStatement` → `{}`
136. **Mutant #657** - Line 222:24-32: `StringLiteral` → `""`
137. **Mutant #658** - Line 225:40-45: `StringLiteral` → `""`
138. **Mutant #659** - Line 226:21-40: `StringLiteral` → `""`
139. **Mutant #660** - Line 227:7-17: `ConditionalExpression` → `true`
140. **Mutant #661** - Line 227:7-17: `ConditionalExpression` → `false`
141. **Mutant #662** - Line 227:19-4: `BlockStatement` → `{}`
142. **Mutant #663** - Line 231:41-46: `StringLiteral` → `""`
143. **Mutant #664** - Line 232:22-42: `StringLiteral` → `""`
144. **Mutant #665** - Line 235:43-48: `StringLiteral` → `""`
145. **Mutant #666** - Line 236:24-60: `StringLiteral` → ````
146. **Mutant #667** - Line 237:17-35: `StringLiteral` → ````
147. **Mutant #668** - Line 244:26-33: `StringLiteral` → `""`
148. **Mutant #669** - Line 244:41-4: `BlockStatement` → `{}`
149. **Mutant #670** - Line 252:38-2: `BlockStatement` → `{}`
150. **Mutant #671** - Line 253:41-62: `ArrowFunction` → `() => undefined`
151. **Mutant #672** - Line 253:46-62: `ConditionalExpression` → `true`
152. **Mutant #673** - Line 253:46-62: `ConditionalExpression` → `false`
153. **Mutant #674** - Line 253:46-62: `EqualityOperator` → `i.id !== imageId`
154. **Mutant #675** - Line 254:6-10: `BooleanLiteral` → `img`
155. **Mutant #676** - Line 254:6-10: `ConditionalExpression` → `true`
156. **Mutant #677** - Line 254:6-10: `ConditionalExpression` → `false`
157. **Mutant #678** - Line 256:43-62: `StringLiteral` → ````
158. **Mutant #679** - Line 257:6-14: `ConditionalExpression` → `true`
159. **Mutant #680** - Line 257:6-14: `ConditionalExpression` → `false`
160. **Mutant #681** - Line 257:16-3: `BlockStatement` → `{}`
161. **Mutant #682** - Line 258:24-60: `StringLiteral` → ````
162. **Mutant #683** - Line 263:43-2: `BlockStatement` → `{}`
163. **Mutant #684** - Line 264:6-75: `ConditionalExpression` → `true`
164. **Mutant #685** - Line 264:6-75: `ConditionalExpression` → `false`
165. **Mutant #686** - Line 264:6-75: `LogicalOperator` → `(!currentSession || index < 0) && index >= currentSession.images.length`
166. **Mutant #687** - Line 264:6-34: `ConditionalExpression` → `false`
167. **Mutant #688** - Line 264:6-34: `LogicalOperator` → `!currentSession && index < 0`
168. **Mutant #689** - Line 264:6-21: `BooleanLiteral` → `currentSession`
169. **Mutant #690** - Line 264:25-34: `ConditionalExpression` → `false`
170. **Mutant #691** - Line 264:25-34: `EqualityOperator` → `index <= 0`
171. **Mutant #692** - Line 264:25-34: `EqualityOperator` → `index >= 0`
172. **Mutant #693** - Line 264:38-75: `ConditionalExpression` → `false`
173. **Mutant #694** - Line 264:38-75: `EqualityOperator` → `index > currentSession.images.length`
174. **Mutant #695** - Line 264:38-75: `EqualityOperator` → `index < currentSession.images.length`
175. **Mutant #696** - Line 270:28-44: `StringLiteral` → `""`
176. **Mutant #697** - Line 270:68-3: `BlockStatement` → `{}`
177. **Mutant #698** - Line 271:26-34: `StringLiteral` → `""`
178. **Mutant #699** - Line 271:36-47: `ConditionalExpression` → `true`
179. **Mutant #700** - Line 271:36-47: `ConditionalExpression` → `false`
180. **Mutant #701** - Line 271:36-47: `EqualityOperator` → `i !== index`
181. **Mutant #702** - Line 275:6-16: `ConditionalExpression` → `true`
182. **Mutant #703** - Line 275:6-16: `ConditionalExpression` → `false`
183. **Mutant #704** - Line 275:18-3: `BlockStatement` → `{}`
184. **Mutant #705** - Line 279:23-43: `ConditionalExpression` → `true`
185. **Mutant #706** - Line 279:23-43: `ConditionalExpression` → `false`
186. **Mutant #707** - Line 279:23-43: `LogicalOperator` → `img.detections && []`
187. **Mutant #708** - Line 279:41-43: `ArrayDeclaration` → `["Stryker was here"]`
188. **Mutant #709** - Line 283:29-45: `ArithmeticOperator` → `naturalW / scale`
189. **Mutant #710** - Line 284:30-46: `ArithmeticOperator` → `naturalH / scale`
190. **Mutant #711** - Line 293:35-2: `BlockStatement` → `{}`
191. **Mutant #712** - Line 294:6-44: `ConditionalExpression` → `true`
192. **Mutant #713** - Line 294:6-44: `ConditionalExpression` → `false`
193. **Mutant #714** - Line 294:6-44: `LogicalOperator` → `!currentSession && !currentImageBitmap`
194. **Mutant #715** - Line 294:6-21: `BooleanLiteral` → `currentSession`
195. **Mutant #716** - Line 294:25-44: `BooleanLiteral` → `currentImageBitmap`
196. **Mutant #717** - Line 297:6-40: `ConditionalExpression` → `true`
197. **Mutant #718** - Line 297:6-40: `ConditionalExpression` → `false`
198. **Mutant #719** - Line 297:6-40: `LogicalOperator` → `!img && img.status !== 'completed'`
199. **Mutant #720** - Line 297:6-10: `BooleanLiteral` → `img`
200. **Mutant #721** - Line 297:14-40: `ConditionalExpression` → `false`
201. **Mutant #722** - Line 297:14-40: `EqualityOperator` → `img.status === 'completed'`
202. **Mutant #723** - Line 297:29-40: `StringLiteral` → `""`
203. **Mutant #724** - Line 302:27-2: `BlockStatement` → `{}`
204. **Mutant #725** - Line 303:6-21: `BooleanLiteral` → `currentSession`
205. **Mutant #726** - Line 303:6-21: `ConditionalExpression` → `true`
206. **Mutant #727** - Line 303:6-21: `ConditionalExpression` → `false`
207. **Mutant #728** - Line 306:29-88: `StringLiteral` → ````
208. **Mutant #729** - Line 307:29-54: `StringLiteral` → ````
209. **Mutant #730** - Line 308:29-54: `StringLiteral` → ````
210. **Mutant #731** - Line 311:41-2: `BlockStatement` → `{}`
211. **Mutant #732** - Line 312:45-53: `StringLiteral` → `""`
212. **Mutant #733** - Line 313:42-46: `StringLiteral` → `""`
213. **Mutant #734** - Line 315:16-41: `ArithmeticOperator` → `maxHeight * bitmap.height`
214. **Mutant #735** - Line 316:22-42: `ArithmeticOperator` → `bitmap.width / scale`
215. **Mutant #736** - Line 319:31-43: `StringLiteral` → `""`
216. **Mutant #737** - Line 322:25-2: `BlockStatement` → `{}`
217. **Mutant #738** - Line 323:6-47: `ConditionalExpression` → `true`
218. **Mutant #739** - Line 323:6-47: `ConditionalExpression` → `false`
219. **Mutant #740** - Line 323:6-47: `LogicalOperator` → `!currentImageBitmap && !currentParsedData`
220. **Mutant #741** - Line 323:6-25: `BooleanLiteral` → `currentImageBitmap`
221. **Mutant #742** - Line 323:29-47: `BooleanLiteral` → `currentParsedData`
222. **Mutant #743** - Line 327:74-2: `BlockStatement` → `{}`
223. **Mutant #744** - Line 328:6-28: `ConditionalExpression` → `true`
224. **Mutant #745** - Line 328:6-28: `ConditionalExpression` → `false`
225. **Mutant #746** - Line 328:6-28: `LogicalOperator` → `!bitmap && !parsedData`
226. **Mutant #747** - Line 328:6-13: `BooleanLiteral` → `bitmap`
227. **Mutant #748** - Line 328:17-28: `BooleanLiteral` → `parsedData`
228. **Mutant #749** - Line 334:17-36: `ArithmeticOperator` → `canvas.width * natW`
229. **Mutant #750** - Line 335:17-37: `ArithmeticOperator` → `canvas.height * natH`
230. **Mutant #751** - Line 336:52-71: `StringLiteral` → `""`
231. **Mutant #752** - Line 337:52-62: `StringLiteral` → `""`
232. **Mutant #753** - Line 339:30-3: `BlockStatement` → `{}`
233. **Mutant #754** - Line 340:25-56: `ConditionalExpression` → `true`
234. **Mutant #755** - Line 340:25-56: `ConditionalExpression` → `false`
235. **Mutant #756** - Line 340:25-56: `EqualityOperator` → `highlightedDetectionId !== d.id`
236. **Mutant #757** - Line 342:17-120: `StringLiteral` → ````
237. **Mutant #758** - Line 342:20-37: `LogicalOperator` → `d.label && 'item'`
238. **Mutant #759** - Line 342:31-37: `StringLiteral` → `""`
239. **Mutant #760** - Line 342:40-72: `ConditionalExpression` → `true`
240. **Mutant #761** - Line 342:40-72: `ConditionalExpression` → `false`
241. **Mutant #762** - Line 342:40-72: `EqualityOperator` → `typeof d.confidence !== 'number'`
242. **Mutant #763** - Line 342:64-72: `StringLiteral` → `""`
243. **Mutant #764** - Line 342:75-113: `StringLiteral` → ````
244. **Mutant #765** - Line 342:81-97: `ArithmeticOperator` → `d.confidence / 100`
245. **Mutant #766** - Line 342:116-118: `StringLiteral` → `"Stryker was here!"`
246. **Mutant #767** - Line 344:7-20: `ConditionalExpression` → `true`
247. **Mutant #768** - Line 344:7-20: `ConditionalExpression` → `false`
248. **Mutant #769** - Line 344:22-4: `BlockStatement` → `{}`
249. **Mutant #770** - Line 350:7-13: `ConditionalExpression` → `true`
250. **Mutant #771** - Line 350:7-13: `ConditionalExpression` → `false`
251. **Mutant #772** - Line 350:15-4: `BlockStatement` → `{}`
252. **Mutant #773** - Line 362:8-9: `ConditionalExpression` → `true`
253. **Mutant #774** - Line 362:8-9: `ConditionalExpression` → `false`
254. **Mutant #775** - Line 362:11-5: `BlockStatement` → `{}`
255. **Mutant #776** - Line 363:9-22: `ConditionalExpression` → `true`
256. **Mutant #777** - Line 363:9-22: `ConditionalExpression` → `false`
257. **Mutant #778** - Line 367:7-56: `ConditionalExpression` → `true`
258. **Mutant #779** - Line 367:7-56: `ConditionalExpression` → `false`
259. **Mutant #780** - Line 367:7-56: `LogicalOperator` → `Array.isArray(d.polygon) || d.polygon.length >= 3`
260. **Mutant #781** - Line 367:35-56: `ConditionalExpression` → `true`
261. **Mutant #782** - Line 367:35-56: `EqualityOperator` → `d.polygon.length > 3`
262. **Mutant #783** - Line 367:35-56: `EqualityOperator` → `d.polygon.length < 3`
263. **Mutant #784** - Line 367:58-4: `BlockStatement` → `{}`
264. **Mutant #785** - Line 369:8-11: `ConditionalExpression` → `true`
265. **Mutant #786** - Line 369:8-11: `ConditionalExpression` → `false`
266. **Mutant #787** - Line 369:13-5: `BlockStatement` → `{}`
267. **Mutant #788** - Line 370:9-22: `ConditionalExpression` → `true`
268. **Mutant #789** - Line 370:9-22: `ConditionalExpression` → `false`
269. **Mutant #790** - Line 375:7-20: `ConditionalExpression` → `true`
270. **Mutant #791** - Line 375:7-20: `ConditionalExpression` → `false`
271. **Mutant #792** - Line 375:22-4: `BlockStatement` → `{}`
272. **Mutant #793** - Line 381:28-2: `BlockStatement` → `{}`
273. **Mutant #794** - Line 382:6-3: `BlockStatement` → `{}`
274. **Mutant #795** - Line 383:10-61: `ConditionalExpression` → `true`
275. **Mutant #796** - Line 383:10-61: `ConditionalExpression` → `false`
276. **Mutant #797** - Line 383:10-61: `LogicalOperator` → `globalThis.localStorage?.getItem(STORAGE_KEY) && ''`
277. **Mutant #798** - Line 383:10-42: `OptionalChaining` → `globalThis.localStorage.getItem`
278. **Mutant #799** - Line 383:59-61: `StringLiteral` → `"Stryker was here!"`
279. **Mutant #800** - Line 384:10-3: `BlockStatement` → `{}`
280. **Mutant #801** - Line 385:10-12: `StringLiteral` → `"Stryker was here!"`
281. **Mutant #802** - Line 389:31-2: `BlockStatement` → `{}`
282. **Mutant #803** - Line 390:6-3: `BlockStatement` → `{}`
283. **Mutant #804** - Line 391:19-31: `MethodExpression` → `value`
284. **Mutant #805** - Line 392:7-14: `ConditionalExpression` → `true`
285. **Mutant #806** - Line 392:7-14: `ConditionalExpression` → `false`
286. **Mutant #807** - Line 392:16-4: `BlockStatement` → `{}`
287. **Mutant #808** - Line 393:4-36: `OptionalChaining` → `globalThis.localStorage.setItem`
288. **Mutant #809** - Line 394:10-4: `BlockStatement` → `{}`
289. **Mutant #810** - Line 395:4-39: `OptionalChaining` → `globalThis.localStorage.removeItem`
290. **Mutant #811** - Line 403:5-17: `ConditionalExpression` → `true`
291. **Mutant #812** - Line 403:5-17: `ConditionalExpression` → `false`
292. **Mutant #813** - Line 403:19-2: `BlockStatement` → `{}`
293. **Mutant #814** - Line 407:25-2: `BlockStatement` → `{}`
294. **Mutant #815** - Line 408:35-3: `BlockStatement` → `{}`
295. **Mutant #816** - Line 410:14-67: `ArrowFunction` → `() => undefined`
296. **Mutant #817** - Line 416:32-2: `BlockStatement` → `{}`
297. **Mutant #818** - Line 423:29-45: `ArithmeticOperator` → `naturalW / scale`
298. **Mutant #819** - Line 424:29-45: `ArithmeticOperator` → `naturalH / scale`
299. **Mutant #820** - Line 428:9-41: `ObjectLiteral` → `{}`
300. **Mutant #821** - Line 431:24-2: `BlockStatement` → `{}`
301. **Mutant #822** - Line 432:28-34: `StringLiteral` → `""`
302. **Mutant #823** - Line 432:36-42: `BooleanLiteral` → `!drag`
303. **Mutant #824** - Line 432:37-42: `BooleanLiteral` → `drag`
304. **Mutant #825** - Line 435:35-2: `BlockStatement` → `{}`
305. **Mutant #826** - Line 437:13-59: `StringLiteral` → `""`
306. **Mutant #827** - Line 440:12-33: `ArithmeticOperator` → `metrics.width - pad * 2`
307. **Mutant #828** - Line 440:28-33: `ArithmeticOperator` → `pad / 2`
308. **Mutant #829** - Line 441:12-22: `ArithmeticOperator` → `16 - pad * 2`
309. **Mutant #830** - Line 441:17-22: `ArithmeticOperator` → `pad / 2`
310. **Mutant #831** - Line 442:18-35: `StringLiteral` → `""`
311. **Mutant #832** - Line 443:18-36: `MethodExpression` → `Math.min(0, y - h)`
312. **Mutant #833** - Line 443:30-35: `ArithmeticOperator` → `y + h`
313. **Mutant #834** - Line 444:18-27: `StringLiteral` → `""`
314. **Mutant #835** - Line 445:21-28: `ArithmeticOperator` → `x - pad`
315. **Mutant #836** - Line 445:30-62: `MethodExpression` → `Math.min(12 + (y - h) + pad, 12)`
316. **Mutant #837** - Line 445:39-57: `ArithmeticOperator` → `12 + (y - h) - pad`
317. **Mutant #838** - Line 445:39-51: `ArithmeticOperator` → `12 - (y - h)`
318. **Mutant #839** - Line 445:45-50: `ArithmeticOperator` → `y + h`
319. **Mutant #840** - Line 449:35-2: `BlockStatement` → `{}`
320. **Mutant #841** - Line 458:44-2: `BlockStatement` → `{}`
321. **Mutant #842** - Line 459:6-34: `ConditionalExpression` → `true`
322. **Mutant #843** - Line 459:6-34: `ConditionalExpression` → `false`
323. **Mutant #844** - Line 459:6-34: `LogicalOperator` → `!points && points.length < 3`
324. **Mutant #845** - Line 459:6-13: `BooleanLiteral` → `points`
325. **Mutant #846** - Line 459:17-34: `ConditionalExpression` → `false`
326. **Mutant #847** - Line 459:17-34: `EqualityOperator` → `points.length <= 3`
327. **Mutant #848** - Line 459:17-34: `EqualityOperator` → `points.length >= 3`
328. **Mutant #849** - Line 465:18-35: `ConditionalExpression` → `false`
329. **Mutant #850** - Line 465:18-35: `EqualityOperator` → `i <= points.length`
330. **Mutant #851** - Line 465:18-35: `EqualityOperator` → `i >= points.length`
331. **Mutant #852** - Line 465:37-40: `UpdateOperator` → `i--`
332. **Mutant #853** - Line 475:56-2: `BlockStatement` → `{}`
333. **Mutant #854** - Line 477:16-3: `ArrayDeclaration` → `[]`
334. **Mutant #855** - Line 478:3-74: `ObjectLiteral` → `{}`
335. **Mutant #856** - Line 478:18-72: `ObjectLiteral` → `{}`
336. **Mutant #857** - Line 478:31-56: `ConditionalExpression` → `true`
337. **Mutant #858** - Line 478:31-56: `ConditionalExpression` → `false`
338. **Mutant #859** - Line 478:31-56: `LogicalOperator` → `file.type && 'image/jpeg'`
339. **Mutant #860** - Line 478:44-56: `StringLiteral` → `""`
340. **Mutant #861** - Line 479:3-23: `ObjectLiteral` → `{}`
341. **Mutant #862** - Line 483:16-3: `ObjectLiteral` → `{}`
342. **Mutant #863** - Line 484:13-24: `ArrayDeclaration` → `[]`
343. **Mutant #864** - Line 484:14-23: `ObjectLiteral` → `{}`
344. **Mutant #865** - Line 485:21-4: `ObjectLiteral` → `{}`
345. **Mutant #866** - Line 486:24-42: `StringLiteral` → `""`
346. **Mutant #867** - Line 490:16-3: `ObjectLiteral` → `{}`
347. **Mutant #868** - Line 491:13-24: `ArrayDeclaration` → `[]`
348. **Mutant #869** - Line 491:14-23: `ObjectLiteral` → `{}`
349. **Mutant #870** - Line 492:21-4: `ObjectLiteral` → `{}`
350. **Mutant #871** - Line 493:22-40: `StringLiteral` → `""`
351. **Mutant #872** - Line 498:14-116: `StringLiteral` → ````
352. **Mutant #873** - Line 499:28-3: `BlockStatement` → `{}`
353. **Mutant #874** - Line 500:30-4: `ObjectLiteral` → `{}`
354. **Mutant #875** - Line 501:12-18: `StringLiteral` → `""`
355. **Mutant #876** - Line 502:13-5: `ObjectLiteral` → `{}`
356. **Mutant #877** - Line 503:21-39: `StringLiteral` → `""`
357. **Mutant #878** - Line 508:37-47: `ArrowFunction` → `() => undefined`
358. **Mutant #879** - Line 509:7-12: `BooleanLiteral` → `r.ok`
359. **Mutant #880** - Line 509:7-12: `ConditionalExpression` → `true`
360. **Mutant #881** - Line 509:7-12: `ConditionalExpression` → `false`
361. **Mutant #882** - Line 509:14-4: `BlockStatement` → `{}`
362. **Mutant #883** - Line 510:16-107: `ConditionalExpression` → `true`
363. **Mutant #884** - Line 510:16-107: `ConditionalExpression` → `false`
364. **Mutant #885** - Line 510:16-107: `LogicalOperator` → `data && (data.error?.message || data.candidates?.[0]?.finishReason) && `HTTP ${r.status}``
365. **Mutant #886** - Line 510:17-84: `ConditionalExpression` → `false`
366. **Mutant #887** - Line 510:17-84: `LogicalOperator` → `data || data.error?.message || data.candidates?.[0]?.finishReason`
367. **Mutant #888** - Line 510:26-83: `ConditionalExpression` → `true`
368. **Mutant #889** - Line 510:26-83: `LogicalOperator` → `data.error?.message && data.candidates?.[0]?.finishReason`
369. **Mutant #890** - Line 510:26-45: `OptionalChaining` → `data.error.message`
370. **Mutant #891** - Line 510:49-83: `OptionalChaining` → `data.candidates?.[0].finishReason`
371. **Mutant #892** - Line 510:49-69: `OptionalChaining` → `data.candidates[0]`
372. **Mutant #893** - Line 510:89-107: `StringLiteral` → ````
373. **Mutant #894** - Line 516:6-3: `BlockStatement` → `{}`
374. **Mutant #895** - Line 518:15-3: `BlockStatement` → `{}`
375. **Mutant #896** - Line 520:7-4: `BlockStatement` → `{}`
376. **Mutant #897** - Line 522:16-4: `BlockStatement` → `{}`
377. **Mutant #898** - Line 523:20-84: `StringLiteral` → ````
378. **Mutant #899** - Line 530:59-64: `BooleanLiteral` → `true`
379. **Mutant #900** - Line 530:73-2: `BlockStatement` → `{}`
380. **Mutant #901** - Line 531:17-38: `MethodExpression` → `apiKeyEl.value`
381. **Mutant #902** - Line 532:17-57: `ConditionalExpression` → `true`
382. **Mutant #903** - Line 532:17-57: `ConditionalExpression` → `false`
383. **Mutant #904** - Line 532:17-57: `LogicalOperator` → `modelEl.value.trim() && 'gemini-2.5-pro'`
384. **Mutant #905** - Line 532:17-37: `MethodExpression` → `modelEl.value`
385. **Mutant #906** - Line 532:41-57: `StringLiteral` → `""`
386. **Mutant #907** - Line 534:6-13: `BooleanLiteral` → `apiKey`
387. **Mutant #908** - Line 534:6-13: `ConditionalExpression` → `true`
388. **Mutant #909** - Line 534:6-13: `ConditionalExpression` → `false`
389. **Mutant #910** - Line 534:15-3: `BlockStatement` → `{}`
390. **Mutant #911** - Line 535:7-26: `BooleanLiteral` → `silentOnMissingKey`
391. **Mutant #912** - Line 535:7-26: `ConditionalExpression` → `true`
392. **Mutant #913** - Line 535:7-26: `ConditionalExpression` → `false`
393. **Mutant #914** - Line 535:28-4: `BlockStatement` → `{}`
394. **Mutant #915** - Line 536:12-40: `ObjectLiteral` → `{}`
395. **Mutant #916** - Line 536:21-38: `StringLiteral` → `""`
396. **Mutant #917** - Line 536:42-49: `StringLiteral` → `""`
397. **Mutant #918** - Line 541:6-18: `BooleanLiteral` → `currentFile`
398. **Mutant #919** - Line 541:6-18: `ConditionalExpression` → `true`
399. **Mutant #920** - Line 541:6-18: `ConditionalExpression` → `false`
400. **Mutant #921** - Line 541:20-3: `BlockStatement` → `{}`
401. **Mutant #922** - Line 542:7-26: `BooleanLiteral` → `silentOnMissingKey`
402. **Mutant #923** - Line 542:7-26: `ConditionalExpression` → `true`
403. **Mutant #924** - Line 542:7-26: `ConditionalExpression` → `false`
404. **Mutant #925** - Line 542:28-4: `BlockStatement` → `{}`
405. **Mutant #926** - Line 543:12-42: `ObjectLiteral` → `{}`
406. **Mutant #927** - Line 543:21-40: `StringLiteral` → `""`
407. **Mutant #928** - Line 543:44-51: `StringLiteral` → `""`
408. **Mutant #929** - Line 549:26-31: `BooleanLiteral` → `true`
409. **Mutant #930** - Line 551:6-17: `ConditionalExpression` → `true`
410. **Mutant #931** - Line 551:6-17: `ConditionalExpression` → `false`
411. **Mutant #932** - Line 551:19-3: `BlockStatement` → `{}`
412. **Mutant #933** - Line 552:20-24: `BooleanLiteral` → `false`
413. **Mutant #934** - Line 556:16-20: `BooleanLiteral` → `false`
414. **Mutant #935** - Line 557:19-24: `BooleanLiteral` → `true`
415. **Mutant #936** - Line 560:22-24: `ArrayDeclaration` → `["Stryker was here"]`
416. **Mutant #937** - Line 564:6-24: `ConditionalExpression` → `true`
417. **Mutant #938** - Line 564:6-24: `ConditionalExpression` → `false`
418. **Mutant #939** - Line 564:26-3: `BlockStatement` → `{}`
419. **Mutant #940** - Line 569:10-39: `ObjectLiteral` → `{}`
420. **Mutant #941** - Line 569:20-37: `StringLiteral` → `""`
421. **Mutant #942** - Line 571:6-3: `BlockStatement` → `{}`
422. **Mutant #943** - Line 572:37-73: `ObjectLiteral` → `{}`
423. **Mutant #944** - Line 577:49-68: `StringLiteral` → `""`
424. **Mutant #945** - Line 578:29-39: `StringLiteral` → `""`
425. **Mutant #946** - Line 579:7-39: `ConditionalExpression` → `true`
426. **Mutant #947** - Line 579:7-39: `ConditionalExpression` → `false`
427. **Mutant #948** - Line 579:7-39: `EqualityOperator` → `parsed.image.coordSystem != null`
428. **Mutant #949** - Line 582:78-80: `ArrayDeclaration` → `["Stryker was here"]`
429. **Mutant #950** - Line 592:19-5: `BlockStatement` → `{}`
430. **Mutant #951** - Line 596:10-5: `BlockStatement` → `{}`
431. **Mutant #952** - Line 602:19-31: `StringLiteral` → `""`
432. **Mutant #953** - Line 603:16-3: `BlockStatement` → `{}`
433. **Mutant #954** - Line 605:11-49: `ObjectLiteral` → `{}`
434. **Mutant #955** - Line 605:27-46: `ConditionalExpression` → `true`
435. **Mutant #956** - Line 605:27-46: `ConditionalExpression` → `false`
436. **Mutant #957** - Line 605:27-46: `LogicalOperator` → `err?.message && err`
437. **Mutant #958** - Line 605:27-39: `OptionalChaining` → `err.message`
438. **Mutant #959** - Line 605:51-58: `StringLiteral` → `""`
439. **Mutant #960** - Line 606:12-3: `BlockStatement` → `{}`
440. **Mutant #961** - Line 607:17-22: `BooleanLiteral` → `true`
441. **Mutant #962** - Line 608:7-21: `ConditionalExpression` → `true`
442. **Mutant #963** - Line 608:7-21: `ConditionalExpression` → `false`
443. **Mutant #964** - Line 608:23-4: `BlockStatement` → `{}`
444. **Mutant #965** - Line 609:21-26: `BooleanLiteral` → `true`
445. **Mutant #966** - Line 610:30-58: `ObjectLiteral` → `{}`
446. **Mutant #967** - Line 610:52-56: `BooleanLiteral` → `false`
447. **Mutant #968** - Line 615:42-2: `BlockStatement` → `{}`
448. **Mutant #969** - Line 616:6-11: `BooleanLiteral` → `file`
449. **Mutant #970** - Line 616:6-11: `ConditionalExpression` → `true`
450. **Mutant #971** - Line 616:6-11: `ConditionalExpression` → `false`
451. **Mutant #972** - Line 620:22-24: `ArrayDeclaration` → `["Stryker was here"]`
452. **Mutant #973** - Line 622:19-24: `BooleanLiteral` → `true`
453. **Mutant #974** - Line 624:6-3: `BlockStatement` → `{}`
454. **Mutant #975** - Line 626:16-3: `BlockStatement` → `{}`
455. **Mutant #976** - Line 627:11-76: `ObjectLiteral` → `{}`
456. **Mutant #977** - Line 627:20-74: `StringLiteral` → ````
457. **Mutant #978** - Line 627:52-71: `ConditionalExpression` → `true`
458. **Mutant #979** - Line 627:52-71: `ConditionalExpression` → `false`
459. **Mutant #980** - Line 627:52-71: `LogicalOperator` → `err?.message && err`
460. **Mutant #981** - Line 627:52-64: `OptionalChaining` → `err.message`
461. **Mutant #982** - Line 627:78-85: `StringLiteral` → `""`
462. **Mutant #983** - Line 633:17-38: `MethodExpression` → `apiKeyEl.value`
463. **Mutant #984** - Line 634:6-13: `BooleanLiteral` → `apiKey`
464. **Mutant #985** - Line 634:6-13: `ConditionalExpression` → `true`
465. **Mutant #986** - Line 634:6-13: `ConditionalExpression` → `false`
466. **Mutant #987** - Line 634:15-3: `BlockStatement` → `{}`
467. **Mutant #988** - Line 635:27-31: `BooleanLiteral` → `false`
468. **Mutant #989** - Line 636:11-77: `ObjectLiteral` → `{}`
469. **Mutant #990** - Line 636:22-75: `StringLiteral` → `""`
470. **Mutant #991** - Line 640:26-31: `BooleanLiteral` → `true`
471. **Mutant #992** - Line 641:28-56: `ObjectLiteral` → `{}`
472. **Mutant #993** - Line 641:50-54: `BooleanLiteral` → `false`
473. **Mutant #994** - Line 645:27-34: `StringLiteral` → `""`
474. **Mutant #995** - Line 645:36-56: `ArrowFunction` → `() => undefined`
475. **Mutant #996** - Line 647:27-37: `StringLiteral` → `""`
476. **Mutant #997** - Line 647:44-82: `BlockStatement` → `{}`
477. **Mutant #998** - Line 647:74-78: `BooleanLiteral` → `false`
478. **Mutant #999** - Line 648:27-38: `StringLiteral` → `""`
479. **Mutant #1000** - Line 648:40-60: `ArrowFunction` → `() => undefined`
480. **Mutant #1001** - Line 648:54-59: `BooleanLiteral` → `true`
481. **Mutant #1002** - Line 649:27-33: `StringLiteral` → `""`
482. **Mutant #1003** - Line 649:46-2: `BlockStatement` → `{}`
483. **Mutant #1004** - Line 651:10-15: `BooleanLiteral` → `true`
484. **Mutant #1005** - Line 652:16-89: `MethodExpression` → `Array.from(e.dataTransfer.files)`
485. **Mutant #1006** - Line 652:56-88: `ArrowFunction` → `() => undefined`
486. **Mutant #1007** - Line 652:61-88: `MethodExpression` → `f.type.endsWith('image/')`
487. **Mutant #1008** - Line 652:79-87: `StringLiteral` → `""`
488. **Mutant #1009** - Line 654:6-24: `ConditionalExpression` → `true`
489. **Mutant #1010** - Line 654:6-24: `ConditionalExpression` → `false`
490. **Mutant #1011** - Line 654:6-24: `EqualityOperator` → `files.length !== 0`
491. **Mutant #1012** - Line 656:6-24: `ConditionalExpression` → `true`
492. **Mutant #1013** - Line 656:6-24: `ConditionalExpression` → `false`
493. **Mutant #1014** - Line 656:6-24: `EqualityOperator` → `files.length !== 1`
494. **Mutant #1015** - Line 656:26-3: `BlockStatement` → `{}`
495. **Mutant #1016** - Line 658:9-3: `BlockStatement` → `{}`
496. **Mutant #1017** - Line 663:25-33: `StringLiteral` → `""`
497. **Mutant #1018** - Line 663:46-2: `BlockStatement` → `{}`
498. **Mutant #1019** - Line 665:6-24: `ConditionalExpression` → `true`
499. **Mutant #1020** - Line 665:6-24: `ConditionalExpression` → `false`
500. **Mutant #1021** - Line 665:6-24: `EqualityOperator` → `files.length !== 0`
501. **Mutant #1022** - Line 667:6-24: `ConditionalExpression` → `true`
502. **Mutant #1023** - Line 667:6-24: `ConditionalExpression` → `false`
503. **Mutant #1024** - Line 667:6-24: `EqualityOperator` → `files.length !== 1`
504. **Mutant #1025** - Line 667:26-3: `BlockStatement` → `{}`
505. **Mutant #1026** - Line 669:9-3: `BlockStatement` → `{}`
506. **Mutant #1027** - Line 672:19-21: `StringLiteral` → `"Stryker was here!"`
507. **Mutant #1028** - Line 675:27-34: `StringLiteral` → `""`
508. **Mutant #1029** - Line 675:47-2: `BlockStatement` → `{}`
509. **Mutant #1030** - Line 678:6-59: `ConditionalExpression` → `true`
510. **Mutant #1031** - Line 678:6-59: `ConditionalExpression` → `false`
511. **Mutant #1032** - Line 678:6-59: `LogicalOperator` → `pendingApiKeyAnalysis && value.trim() || !isAnalyzing`
512. **Mutant #1033** - Line 678:6-43: `ConditionalExpression` → `true`
513. **Mutant #1034** - Line 678:6-43: `LogicalOperator` → `pendingApiKeyAnalysis || value.trim()`
514. **Mutant #1035** - Line 678:31-43: `MethodExpression` → `value`
515. **Mutant #1036** - Line 678:47-59: `BooleanLiteral` → `isAnalyzing`
516. **Mutant #1037** - Line 678:61-3: `BlockStatement` → `{}`
517. **Mutant #1038** - Line 679:27-32: `BooleanLiteral` → `true`
518. **Mutant #1039** - Line 680:7-18: `ConditionalExpression` → `true`
519. **Mutant #1040** - Line 680:7-18: `ConditionalExpression` → `false`
520. **Mutant #1041** - Line 680:20-4: `BlockStatement` → `{}`
521. **Mutant #1042** - Line 681:30-58: `ObjectLiteral` → `{}`
522. **Mutant #1043** - Line 681:52-56: `BooleanLiteral` → `false`
523. **Mutant #1044** - Line 682:14-28: `ConditionalExpression` → `true`
524. **Mutant #1045** - Line 682:14-28: `ConditionalExpression` → `false`
525. **Mutant #1046** - Line 682:30-4: `BlockStatement` → `{}`
526. **Mutant #1047** - Line 683:58-73: `ArrowFunction` → `() => undefined`
527. **Mutant #1048** - Line 689:9-95: `ObjectLiteral` → `{}`
528. **Mutant #1049** - Line 689:20-93: `StringLiteral` → `""`

---

### 🔴 src/report-ui.js

**Overall Health**: 🔴 Needs Improvement | **Mutation Score**: 89.7% | **Coverage**: 5.8%

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Killed | 26 | 5.2% |
| ❌ Survived | 3 | 0.6% |
| 🚫 No Coverage | 469 | 94.2% |
| **Total** | **498** | **100%** |

#### 📄 Source Code with Mutation Analysis

```javascript
  1| /* istanbul ignore file */
  2| 
  3| /**
  4|  * Calculate aggregates from detections (client-side to prevent LLM hallucination)
  5|  */
  6| export function calculateAggregates(detections) {
   ✅ #1056: BlockStatement → "{}" [8 tests]
  7| 	const countsByLabel = {};
  8| 	const countsByCategory = {};
  9| 
 10| 	for (const det of detections) {
   ✅ #1057: BlockStatement → "{}" [7 tests]
 11| 		const label = det.label || 'unknown';
   ✅ #1060: LogicalOperator → "det.label && 'unknown'" [7 tests]
   ✅ #1059: ConditionalExpression → "false" [7 tests]
   ✅ #1058: ConditionalExpression → "true" [7 tests]
   ✅ #1061: StringLiteral → """" [1 tests]
 12| 		const category = det.category || 'other';
   ✅ #1062: ConditionalExpression → "true" [7 tests]
   ✅ #1063: ConditionalExpression → "false" [7 tests]
   ✅ #1065: StringLiteral → """" [1 tests]
   ✅ #1064: LogicalOperator → "det.category && 'other'" [7 tests]
 13| 
 14| 		countsByLabel[label] = (countsByLabel[label] || 0) + 1;
   ✅ #1066: ArithmeticOperator → "(countsByLabel[label] || 0) - 1" [7 tests]
   ✅ #1067: ConditionalExpression → "true" [7 tests]
   ✅ #1068: ConditionalExpression → "false" [7 tests]
   ✅ #1069: LogicalOperator → "countsByLabel[label] && 0" [7 tests]
 15| 		countsByCategory[category] = (countsByCategory[category] || 0) + 1;
   ✅ #1070: ArithmeticOperator → "(countsByCategory[category] || 0) - 1" [7 tests]
   ✅ #1071: ConditionalExpression → "true" [7 tests]
   ✅ #1072: ConditionalExpression → "false" [7 tests]
   ✅ #1073: LogicalOperator → "countsByCategory[category] && 0" [7 tests]
 16| 	}
 17| 
 18| 	return {
   ✅ #1074: ObjectLiteral → "{}" [8 tests]
 19| 		countsByLabel: Object.entries(countsByLabel)
   ✅ #1075: MethodExpression → "Object.entries(countsByLabel).map(([label, count]) => ({
  label,
  count
}))" [8 tests]
 20| 			.map(([label, count]) => ({ label, count }))
   ✅ #1076: ArrowFunction → "() => undefined" [8 tests]
   ✅ #1077: ObjectLiteral → "{}" [7 tests]
 21| 			.sort((a, b) => b.count - a.count),
   ✅ #1078: ArrowFunction → "() => undefined" [8 tests]
   ✅ #1079: ArithmeticOperator → "b.count + a.count" [5 tests]
 22| 		countsByCategory: Object.entries(countsByCategory)
   ❌ #1080: MethodExpression → "Object.entries(countsByCategory).map(([category, count]) => ({
  category,
  count
}))" [8 tests]
 23| 			.map(([category, count]) => ({ category, count }))
   ✅ #1081: ArrowFunction → "() => undefined" [8 tests]
   ✅ #1082: ObjectLiteral → "{}" [7 tests]
 24| 			.sort((a, b) => b.count - a.count)
   ❌ #1083: ArrowFunction → "() => undefined" [8 tests]
   ❌ #1084: ArithmeticOperator → "b.count + a.count" [3 tests]
 25| 	};
 26| }
 27| 
 28| /**
 29|  * Render the interactive report UI for a session (multi-image or single-image)
 30|  */
 31| export function renderReportUI(data, session = null) {
   🚫 #1085: BlockStatement → "{}" [0 tests]
 32| 	// Multi-image session mode
 33| 	if (session && session.images && session.images.length > 1) {
   🚫 #1086: ConditionalExpression → "true" [0 tests]
   🚫 #1087: ConditionalExpression → "false" [0 tests]
   🚫 #1088: LogicalOperator → "session && session.images || session.images.length > 1" [0 tests]
   🚫 #1089: ConditionalExpression → "true" [0 tests]
   🚫 #1090: LogicalOperator → "session || session.images" [0 tests]
   🚫 #1091: ConditionalExpression → "true" [0 tests]
   🚫 #1092: EqualityOperator → "session.images.length >= 1" [0 tests]
   🚫 #1093: EqualityOperator → "session.images.length <= 1" [0 tests]
   🚫 #1094: BlockStatement → "{}" [0 tests]
 34| 		return renderSessionReport(session);
 35| 	}
 36| 
 37| 	// Single-image mode (original behavior)
 38| 	const detections = Array.isArray(data.detections) ? data.detections : [];
   🚫 #1095: ArrayDeclaration → "["Stryker was here"]" [0 tests]
 39| 	const insights = Array.isArray(data.global_insights) ? data.global_insights : [];
   🚫 #1096: ArrayDeclaration → "["Stryker was here"]" [0 tests]
 40| 	const aggregates = calculateAggregates(detections);
 41| 
 42| 	// Separate safety issues and progress items
 43| 	const safetyIssues = detections.filter(d => d.category === 'safety_issue');
   🚫 #1097: MethodExpression → "detections" [0 tests]
   🚫 #1098: ArrowFunction → "() => undefined" [0 tests]
   🚫 #1099: ConditionalExpression → "true" [0 tests]
   🚫 #1100: ConditionalExpression → "false" [0 tests]
   🚫 #1101: EqualityOperator → "d.category !== 'safety_issue'" [0 tests]
   🚫 #1102: StringLiteral → """" [0 tests]
 44| 	const progressItems = detections.filter(d => d.category === 'progress' && d.progress);
   🚫 #1103: MethodExpression → "detections" [0 tests]
   🚫 #1104: ArrowFunction → "() => undefined" [0 tests]
   🚫 #1105: ConditionalExpression → "true" [0 tests]
   🚫 #1106: ConditionalExpression → "false" [0 tests]
   🚫 #1107: LogicalOperator → "d.category === 'progress' || d.progress" [0 tests]
   🚫 #1108: ConditionalExpression → "true" [0 tests]
   🚫 #1109: EqualityOperator → "d.category !== 'progress'" [0 tests]
   🚫 #1110: StringLiteral → """" [0 tests]
 45| 
 46| 	let html = '';
   🚫 #1111: StringLiteral → ""Stryker was here!"" [0 tests]
 47| 
 48| 	// Safety Issues Section (if any)
 49| 	if (safetyIssues.length > 0) {
   🚫 #1112: ConditionalExpression → "true" [0 tests]
   🚫 #1113: ConditionalExpression → "false" [0 tests]
   🚫 #1114: EqualityOperator → "safetyIssues.length >= 0" [0 tests]
   🚫 #1115: EqualityOperator → "safetyIssues.length <= 0" [0 tests]
   🚫 #1116: BlockStatement → "{}" [0 tests]
 50| 		html += renderSection('safety', '🚨 Safety Issues', renderSafetyCards(safetyIssues), false);
   🚫 #1117: AssignmentOperator → "html -= renderSection('safety', '🚨 Safety Issues', renderSafetyCards(safetyIssues), false)" [0 tests]
   🚫 #1118: StringLiteral → """" [0 tests]
   🚫 #1119: StringLiteral → """" [0 tests]
   🚫 #1120: BooleanLiteral → "true" [0 tests]
 51| 	}
 52| 
 53| 	// Progress Section (if any detections or insights)
 54| 	const progressInsights = insights.filter(i => i.category === 'progress');
   🚫 #1121: MethodExpression → "insights" [0 tests]
   🚫 #1122: ArrowFunction → "() => undefined" [0 tests]
   🚫 #1123: ConditionalExpression → "true" [0 tests]
   🚫 #1124: ConditionalExpression → "false" [0 tests]
   🚫 #1125: EqualityOperator → "i.category !== 'progress'" [0 tests]
   🚫 #1126: StringLiteral → """" [0 tests]
 55| 	if (progressItems.length > 0 || progressInsights.length > 0) {
   🚫 #1127: ConditionalExpression → "true" [0 tests]
   🚫 #1128: ConditionalExpression → "false" [0 tests]
   🚫 #1129: LogicalOperator → "progressItems.length > 0 && progressInsights.length > 0" [0 tests]
   🚫 #1130: ConditionalExpression → "false" [0 tests]
   🚫 #1131: EqualityOperator → "progressItems.length >= 0" [0 tests]
   🚫 #1132: EqualityOperator → "progressItems.length <= 0" [0 tests]
   🚫 #1133: ConditionalExpression → "false" [0 tests]
   🚫 #1134: EqualityOperator → "progressInsights.length >= 0" [0 tests]
   🚫 #1135: EqualityOperator → "progressInsights.length <= 0" [0 tests]
   🚫 #1136: BlockStatement → "{}" [0 tests]
 56| 		html += renderSection('progress', '📊 Progress', renderProgressSection(progressItems, progressInsights), true);
   🚫 #1137: AssignmentOperator → "html -= renderSection('progress', '📊 Progress', renderProgressSection(progressItems, progressInsights), true)" [0 tests]
   🚫 #1138: StringLiteral → """" [0 tests]
   🚫 #1139: StringLiteral → """" [0 tests]
   🚫 #1140: BooleanLiteral → "false" [0 tests]
 57| 	}
 58| 
 59| 	// All Detections Section
 60| 	if (detections.length > 0) {
   🚫 #1141: ConditionalExpression → "true" [0 tests]
   🚫 #1142: ConditionalExpression → "false" [0 tests]
   🚫 #1143: EqualityOperator → "detections.length >= 0" [0 tests]
   🚫 #1144: EqualityOperator → "detections.length <= 0" [0 tests]
   🚫 #1145: BlockStatement → "{}" [0 tests]
 61| 		html += renderSection('detections', '🔍 All Detections', renderDetectionCards(detections), true);
   🚫 #1146: AssignmentOperator → "html -= renderSection('detections', '🔍 All Detections', renderDetectionCards(detections), true)" [0 tests]
   🚫 #1147: StringLiteral → """" [0 tests]
   🚫 #1148: StringLiteral → """" [0 tests]
   🚫 #1149: BooleanLiteral → "false" [0 tests]
 62| 	}
 63| 
 64| 	// Global Insights Section (non-progress)
 65| 	const otherInsights = insights.filter(i => i.category !== 'progress');
   🚫 #1150: MethodExpression → "insights" [0 tests]
   🚫 #1151: ArrowFunction → "() => undefined" [0 tests]
   🚫 #1152: ConditionalExpression → "true" [0 tests]
   🚫 #1153: ConditionalExpression → "false" [0 tests]
   🚫 #1154: EqualityOperator → "i.category === 'progress'" [0 tests]
   🚫 #1155: StringLiteral → """" [0 tests]
 66| 	if (otherInsights.length > 0) {
   🚫 #1156: ConditionalExpression → "true" [0 tests]
   🚫 #1157: ConditionalExpression → "false" [0 tests]
   🚫 #1158: EqualityOperator → "otherInsights.length >= 0" [0 tests]
   🚫 #1159: EqualityOperator → "otherInsights.length <= 0" [0 tests]
   🚫 #1160: BlockStatement → "{}" [0 tests]
 67| 		html += renderSection('insights', '💡 Global Insights', renderInsights(otherInsights), true);
   🚫 #1161: AssignmentOperator → "html -= renderSection('insights', '💡 Global Insights', renderInsights(otherInsights), true)" [0 tests]
   🚫 #1162: StringLiteral → """" [0 tests]
   🚫 #1163: StringLiteral → """" [0 tests]
   🚫 #1164: BooleanLiteral → "false" [0 tests]
 68| 	}
 69| 
 70| 	// Aggregates Section
 71| 	if (aggregates.countsByLabel.length > 0 || aggregates.countsByCategory.length > 0) {
   🚫 #1165: ConditionalExpression → "true" [0 tests]
   🚫 #1166: ConditionalExpression → "false" [0 tests]
   🚫 #1167: LogicalOperator → "aggregates.countsByLabel.length > 0 && aggregates.countsByCategory.length > 0" [0 tests]
   🚫 #1168: ConditionalExpression → "false" [0 tests]
   🚫 #1169: EqualityOperator → "aggregates.countsByLabel.length >= 0" [0 tests]
   🚫 #1170: EqualityOperator → "aggregates.countsByLabel.length <= 0" [0 tests]
   🚫 #1171: ConditionalExpression → "false" [0 tests]
   🚫 #1172: EqualityOperator → "aggregates.countsByCategory.length >= 0" [0 tests]
   🚫 #1173: EqualityOperator → "aggregates.countsByCategory.length <= 0" [0 tests]
   🚫 #1174: BlockStatement → "{}" [0 tests]
 72| 		html += renderSection('aggregates', '📈 Summary Statistics', renderAggregates(aggregates), true);
   🚫 #1175: AssignmentOperator → "html -= renderSection('aggregates', '📈 Summary Statistics', renderAggregates(aggregates), true)" [0 tests]
   🚫 #1176: StringLiteral → """" [0 tests]
   🚫 #1177: StringLiteral → """" [0 tests]
   🚫 #1178: BooleanLiteral → "false" [0 tests]
 73| 	}
 74| 
 75| 	return html;
 76| }
 77| 
 78| function renderSection(id, title, content, collapsed = false) {
   🚫 #1179: BooleanLiteral → "true" [0 tests]
   🚫 #1180: BlockStatement → "{}" [0 tests]
 79| 	const collapsedClass = collapsed ? 'collapsed' : '';
   🚫 #1181: StringLiteral → """" [0 tests]
   🚫 #1182: StringLiteral → ""Stryker was here!"" [0 tests]
 80| 	const hiddenClass = collapsed ? 'hidden' : '';
   🚫 #1183: StringLiteral → """" [0 tests]
   🚫 #1184: StringLiteral → ""Stryker was here!"" [0 tests]
 81| 	return `
   🚫 #1185: StringLiteral → "``" [0 tests]
 82| 		<div class="report-section" data-section="${id}">
 83| 			<div class="report-header ${collapsedClass}" data-section="${id}">
 84| 				<h3><span class="toggle-icon">▼</span> ${title}</h3>
 85| 			</div>
 86| 			<div class="report-content ${hiddenClass}" data-section="${id}">
 87| 				${content}
 88| 			</div>
 89| 		</div>
 90| 	`;
 91| }
 92| 
 93| function renderSafetyCards(safetyIssues) {
   🚫 #1186: BlockStatement → "{}" [0 tests]
 94| 	const cards = safetyIssues.map(det => {
   🚫 #1187: BlockStatement → "{}" [0 tests]
 95| 		const severity = det.safety?.severity || 'low';
   🚫 #1188: ConditionalExpression → "true" [0 tests]
   🚫 #1189: ConditionalExpression → "false" [0 tests]
   🚫 #1190: LogicalOperator → "det.safety?.severity && 'low'" [0 tests]
   🚫 #1191: OptionalChaining → "det.safety.severity" [0 tests]
   🚫 #1192: StringLiteral → """" [0 tests]
 96| 		const rule = det.safety?.rule || 'No rule specified';
   🚫 #1193: ConditionalExpression → "true" [0 tests]
   🚫 #1194: ConditionalExpression → "false" [0 tests]
   🚫 #1195: LogicalOperator → "det.safety?.rule && 'No rule specified'" [0 tests]
   🚫 #1196: OptionalChaining → "det.safety.rule" [0 tests]
   🚫 #1197: StringLiteral → """" [0 tests]
 97| 		const confidence = typeof det.confidence === 'number' ? (det.confidence * 100).toFixed(0) : '?';
   🚫 #1198: ConditionalExpression → "true" [0 tests]
   🚫 #1199: ConditionalExpression → "false" [0 tests]
   🚫 #1200: EqualityOperator → "typeof det.confidence !== 'number'" [0 tests]
   🚫 #1201: StringLiteral → """" [0 tests]
   🚫 #1202: ArithmeticOperator → "det.confidence / 100" [0 tests]
   🚫 #1203: StringLiteral → """" [0 tests]
 98| 
 99| 		return `
   🚫 #1204: StringLiteral → "``" [0 tests]
100| 			<div class="safety-card severity-${severity}" data-detection-id="${det.id || ''}">
   🚫 #1205: ConditionalExpression → "true" [0 tests]
   🚫 #1206: ConditionalExpression → "false" [0 tests]
   🚫 #1207: LogicalOperator → "det.id && ''" [0 tests]
   🚫 #1208: StringLiteral → ""Stryker was here!"" [0 tests]
101| 				<span class="safety-badge ${severity}">${severity}</span>
102| 				<div class="safety-card-title">${escapeHtml(det.label)}</div>
103| 				<div class="safety-card-rule">${escapeHtml(rule)}</div>
104| 				<div style="margin-top:8px; font-size:12px; color:#9aa0b4;">Confidence: ${confidence}%</div>
105| 			</div>
106| 		`;
107| 	}).join('');
   🚫 #1209: StringLiteral → ""Stryker was here!"" [0 tests]
108| 
109| 	return `<div class="safety-grid">${cards}</div>`;
   🚫 #1210: StringLiteral → "``" [0 tests]
110| }
111| 
112| function renderProgressSection(progressItems, progressInsights) {
   🚫 #1211: BlockStatement → "{}" [0 tests]
113| 	let html = '';
   🚫 #1212: StringLiteral → ""Stryker was here!"" [0 tests]
114| 
115| 	// Progress from detections (regional)
116| 	if (progressItems.length > 0) {
   🚫 #1213: ConditionalExpression → "true" [0 tests]
   🚫 #1214: ConditionalExpression → "false" [0 tests]
   🚫 #1215: EqualityOperator → "progressItems.length >= 0" [0 tests]
   🚫 #1216: EqualityOperator → "progressItems.length <= 0" [0 tests]
   🚫 #1217: BlockStatement → "{}" [0 tests]
117| 		html += '<h4 style="margin:0 0 12px; font-size:14px; color:#9aa0b4;">Regional Progress</h4>';
   🚫 #1218: StringLiteral → """" [0 tests]
118| 		progressItems.forEach(det => {
   🚫 #1219: BlockStatement → "{}" [0 tests]
119| 			const phase = det.progress?.phase || 'Unknown phase';
   🚫 #1220: ConditionalExpression → "true" [0 tests]
   🚫 #1221: ConditionalExpression → "false" [0 tests]
   🚫 #1222: LogicalOperator → "det.progress?.phase && 'Unknown phase'" [0 tests]
   🚫 #1223: OptionalChaining → "det.progress.phase" [0 tests]
   🚫 #1224: StringLiteral → """" [0 tests]
120| 			const percent = det.progress?.percentComplete ?? 0;
   🚫 #1225: LogicalOperator → "det.progress?.percentComplete && 0" [0 tests]
   🚫 #1226: OptionalChaining → "det.progress.percentComplete" [0 tests]
121| 			const notes = det.progress?.notes || '';
   🚫 #1227: ConditionalExpression → "true" [0 tests]
   🚫 #1228: ConditionalExpression → "false" [0 tests]
   🚫 #1229: LogicalOperator → "det.progress?.notes && ''" [0 tests]
   🚫 #1230: OptionalChaining → "det.progress.notes" [0 tests]
   🚫 #1231: StringLiteral → ""Stryker was here!"" [0 tests]
122| 			const confidence = typeof det.confidence === 'number' ? (det.confidence * 100).toFixed(0) : '?';
   🚫 #1232: ConditionalExpression → "true" [0 tests]
   🚫 #1233: ConditionalExpression → "false" [0 tests]
   🚫 #1234: EqualityOperator → "typeof det.confidence !== 'number'" [0 tests]
   🚫 #1235: StringLiteral → """" [0 tests]
   🚫 #1236: ArithmeticOperator → "det.confidence / 100" [0 tests]
   🚫 #1237: StringLiteral → """" [0 tests]
123| 
124| 			html += `
   🚫 #1238: StringLiteral → "``" [0 tests]
125| 				<div class="progress-item" data-detection-id="${det.id || ''}">
   🚫 #1239: ConditionalExpression → "true" [0 tests]
   🚫 #1240: ConditionalExpression → "false" [0 tests]
   🚫 #1241: LogicalOperator → "det.id && ''" [0 tests]
   🚫 #1242: StringLiteral → ""Stryker was here!"" [0 tests]
126| 					<div class="progress-header">
127| 						<span class="progress-label">${escapeHtml(det.label)}: ${escapeHtml(phase)}</span>
128| 						<span class="progress-percent">${percent.toFixed(0)}%</span>
129| 					</div>
130| 					<div class="progress-bar-bg">
131| 						<div class="progress-bar-fill" style="width: ${percent}%"></div>
132| 					</div>
133| 					${notes ? `<div class="progress-notes">${escapeHtml(notes)}</div>` : ''}
   🚫 #1243: StringLiteral → "``" [0 tests]
   🚫 #1244: StringLiteral → ""Stryker was here!"" [0 tests]
134| 					<div class="progress-notes">Confidence: ${confidence}%</div>
135| 				</div>
136| 			`;
137| 		});
138| 	}
139| 
140| 	// Progress from global insights
141| 	if (progressInsights.length > 0) {
   🚫 #1245: ConditionalExpression → "true" [0 tests]
   🚫 #1246: ConditionalExpression → "false" [0 tests]
   🚫 #1247: EqualityOperator → "progressInsights.length >= 0" [0 tests]
   🚫 #1248: EqualityOperator → "progressInsights.length <= 0" [0 tests]
   🚫 #1249: BlockStatement → "{}" [0 tests]
142| 		if (progressItems.length > 0) {
   🚫 #1250: ConditionalExpression → "true" [0 tests]
   🚫 #1251: ConditionalExpression → "false" [0 tests]
   🚫 #1252: EqualityOperator → "progressItems.length >= 0" [0 tests]
   🚫 #1253: EqualityOperator → "progressItems.length <= 0" [0 tests]
   🚫 #1254: BlockStatement → "{}" [0 tests]
143| 			html += '<h4 style="margin:20px 0 12px; font-size:14px; color:#9aa0b4;">Overall Progress</h4>';
   🚫 #1255: StringLiteral → """" [0 tests]
144| 		}
145| 		progressInsights.forEach(insight => {
   🚫 #1256: BlockStatement → "{}" [0 tests]
146| 			const confidence = typeof insight.confidence === 'number' ? (insight.confidence * 100).toFixed(0) : '?';
   🚫 #1257: ConditionalExpression → "true" [0 tests]
   🚫 #1258: ConditionalExpression → "false" [0 tests]
   🚫 #1259: EqualityOperator → "typeof insight.confidence !== 'number'" [0 tests]
   🚫 #1260: StringLiteral → """" [0 tests]
   🚫 #1261: ArithmeticOperator → "insight.confidence / 100" [0 tests]
   🚫 #1262: StringLiteral → """" [0 tests]
147| 			// Try to extract percentage from metrics or description
148| 			let percent = 0;
149| 			if (insight.metrics) {
   🚫 #1263: ConditionalExpression → "true" [0 tests]
   🚫 #1264: ConditionalExpression → "false" [0 tests]
   🚫 #1265: BlockStatement → "{}" [0 tests]
150| 				const pctMetric = insight.metrics.find(m => m.key.toLowerCase().includes('percent') || m.key.toLowerCase().includes('complete'));
   🚫 #1266: ArrowFunction → "() => undefined" [0 tests]
   🚫 #1267: ConditionalExpression → "true" [0 tests]
   🚫 #1268: ConditionalExpression → "false" [0 tests]
   🚫 #1269: LogicalOperator → "m.key.toLowerCase().includes('percent') && m.key.toLowerCase().includes('complete')" [0 tests]
   🚫 #1270: MethodExpression → "m.key.toUpperCase()" [0 tests]
   🚫 #1271: StringLiteral → """" [0 tests]
   🚫 #1272: MethodExpression → "m.key.toUpperCase()" [0 tests]
   🚫 #1273: StringLiteral → """" [0 tests]
151| 				if (pctMetric) percent = pctMetric.value;
   🚫 #1274: ConditionalExpression → "true" [0 tests]
   🚫 #1275: ConditionalExpression → "false" [0 tests]
152| 			}
153| 
154| 			html += `
   🚫 #1276: StringLiteral → "``" [0 tests]
155| 				<div class="progress-item">
156| 					<div class="progress-header">
157| 						<span class="progress-label">${escapeHtml(insight.name)}</span>
158| 						${percent > 0 ? `<span class="progress-percent">${percent.toFixed(0)}%</span>` : ''}
   🚫 #1277: ConditionalExpression → "true" [0 tests]
   🚫 #1278: ConditionalExpression → "false" [0 tests]
   🚫 #1279: EqualityOperator → "percent >= 0" [0 tests]
   🚫 #1280: EqualityOperator → "percent <= 0" [0 tests]
   🚫 #1281: StringLiteral → "``" [0 tests]
   🚫 #1282: StringLiteral → ""Stryker was here!"" [0 tests]
159| 					</div>
160| 					${percent > 0 ? `
   🚫 #1283: ConditionalExpression → "true" [0 tests]
   🚫 #1284: ConditionalExpression → "false" [0 tests]
   🚫 #1285: EqualityOperator → "percent >= 0" [0 tests]
   🚫 #1286: EqualityOperator → "percent <= 0" [0 tests]
   🚫 #1287: StringLiteral → "``" [0 tests]
161| 						<div class="progress-bar-bg">
162| 							<div class="progress-bar-fill" style="width: ${percent}%"></div>
163| 						</div>
164| 					` : ''}
   🚫 #1288: StringLiteral → ""Stryker was here!"" [0 tests]
165| 					<div class="progress-notes">${escapeHtml(insight.description)}</div>
166| 					<div class="progress-notes">Confidence: ${confidence}%</div>
167| 				</div>
168| 			`;
169| 		});
170| 	}
171| 
172| 	return html || '<p style="color:#9aa0b4;">No progress information available.</p>';
   🚫 #1289: ConditionalExpression → "true" [0 tests]
   🚫 #1290: ConditionalExpression → "false" [0 tests]
   🚫 #1291: LogicalOperator → "html && '<p style="color:#9aa0b4;">No progress information available.</p>'" [0 tests]
   🚫 #1292: StringLiteral → """" [0 tests]
173| }
174| 
175| function renderDetectionCards(detections) {
   🚫 #1293: BlockStatement → "{}" [0 tests]
176| 	const cards = detections.map(det => {
   🚫 #1294: BlockStatement → "{}" [0 tests]
177| 		const confidence = typeof det.confidence === 'number' ? (det.confidence * 100).toFixed(0) : '?';
   🚫 #1295: ConditionalExpression → "true" [0 tests]
   🚫 #1296: ConditionalExpression → "false" [0 tests]
   🚫 #1297: EqualityOperator → "typeof det.confidence !== 'number'" [0 tests]
   🚫 #1298: StringLiteral → """" [0 tests]
   🚫 #1299: ArithmeticOperator → "det.confidence / 100" [0 tests]
   🚫 #1300: StringLiteral → """" [0 tests]
178| 		const category = det.category || 'other';
   🚫 #1301: ConditionalExpression → "true" [0 tests]
   🚫 #1302: ConditionalExpression → "false" [0 tests]
   🚫 #1303: LogicalOperator → "det.category && 'other'" [0 tests]
   🚫 #1304: StringLiteral → """" [0 tests]
179| 		const categoryLabel = category.replace(/_/g, ' ');
   🚫 #1305: StringLiteral → """" [0 tests]
180| 
181| 		let attrsHtml = '';
   🚫 #1306: StringLiteral → ""Stryker was here!"" [0 tests]
182| 		if (Array.isArray(det.attributes) && det.attributes.length > 0) {
   🚫 #1307: ConditionalExpression → "true" [0 tests]
   🚫 #1308: ConditionalExpression → "false" [0 tests]
   🚫 #1309: LogicalOperator → "Array.isArray(det.attributes) || det.attributes.length > 0" [0 tests]
   🚫 #1310: ConditionalExpression → "true" [0 tests]
   🚫 #1311: EqualityOperator → "det.attributes.length >= 0" [0 tests]
   🚫 #1312: EqualityOperator → "det.attributes.length <= 0" [0 tests]
   🚫 #1313: BlockStatement → "{}" [0 tests]
183| 			attrsHtml = '<dl class="detection-card-attrs">';
   🚫 #1314: StringLiteral → """" [0 tests]
184| 			det.attributes.forEach(attr => {
   🚫 #1315: BlockStatement → "{}" [0 tests]
185| 				const value = attr.valueNum ?? attr.valueStr ?? attr.valueBool ?? '—';
   🚫 #1316: LogicalOperator → "(attr.valueNum ?? attr.valueStr ?? attr.valueBool) && '—'" [0 tests]
   🚫 #1317: LogicalOperator → "(attr.valueNum ?? attr.valueStr) && attr.valueBool" [0 tests]
   🚫 #1318: LogicalOperator → "attr.valueNum && attr.valueStr" [0 tests]
   🚫 #1319: StringLiteral → """" [0 tests]
186| 				const unit = attr.unit ? ` ${attr.unit}` : '';
   🚫 #1320: StringLiteral → "``" [0 tests]
   🚫 #1321: StringLiteral → ""Stryker was here!"" [0 tests]
187| 				attrsHtml += `<dt>${escapeHtml(attr.name)}:</dt><dd>${value}${unit}</dd><br>`;
   🚫 #1322: StringLiteral → "``" [0 tests]
188| 			});
189| 			attrsHtml += '</dl>';
   🚫 #1323: StringLiteral → """" [0 tests]
190| 		}
191| 
192| 		return `
   🚫 #1324: StringLiteral → "``" [0 tests]
193| 			<div class="detection-card category-${category}" data-detection-id="${det.id || ''}">
   🚫 #1325: ConditionalExpression → "true" [0 tests]
   🚫 #1326: ConditionalExpression → "false" [0 tests]
   🚫 #1327: LogicalOperator → "det.id && ''" [0 tests]
   🚫 #1328: StringLiteral → ""Stryker was here!"" [0 tests]
194| 				<div class="detection-card-header">
195| 					<div class="detection-card-label">${escapeHtml(det.label)}</div>
196| 					<div class="detection-card-confidence">${confidence}%</div>
197| 				</div>
198| 				<div class="detection-card-category">${escapeHtml(categoryLabel)}</div>
199| 				${attrsHtml}
200| 			</div>
201| 		`;
202| 	}).join('');
   🚫 #1329: StringLiteral → ""Stryker was here!"" [0 tests]
203| 
204| 	return `<div class="detection-grid">${cards}</div>`;
   🚫 #1330: StringLiteral → "``" [0 tests]
205| }
206| 
207| function renderInsights(insights) {
   🚫 #1331: BlockStatement → "{}" [0 tests]
208| 	const cards = insights.map(insight => {
   🚫 #1332: BlockStatement → "{}" [0 tests]
209| 		const confidence = typeof insight.confidence === 'number' ? (insight.confidence * 100).toFixed(0) : '?';
   🚫 #1333: ConditionalExpression → "true" [0 tests]
   🚫 #1334: ConditionalExpression → "false" [0 tests]
   🚫 #1335: EqualityOperator → "typeof insight.confidence !== 'number'" [0 tests]
   🚫 #1336: StringLiteral → """" [0 tests]
   🚫 #1337: ArithmeticOperator → "insight.confidence / 100" [0 tests]
   🚫 #1338: StringLiteral → """" [0 tests]
210| 		let metricsHtml = '';
   🚫 #1339: StringLiteral → ""Stryker was here!"" [0 tests]
211| 
212| 		if (Array.isArray(insight.metrics) && insight.metrics.length > 0) {
   🚫 #1340: ConditionalExpression → "true" [0 tests]
   🚫 #1341: ConditionalExpression → "false" [0 tests]
   🚫 #1342: LogicalOperator → "Array.isArray(insight.metrics) || insight.metrics.length > 0" [0 tests]
   🚫 #1343: ConditionalExpression → "true" [0 tests]
   🚫 #1344: EqualityOperator → "insight.metrics.length >= 0" [0 tests]
   🚫 #1345: EqualityOperator → "insight.metrics.length <= 0" [0 tests]
   🚫 #1346: BlockStatement → "{}" [0 tests]
213| 			metricsHtml = '<div class="insight-metrics">';
   🚫 #1347: StringLiteral → """" [0 tests]
214| 			insight.metrics.forEach(metric => {
   🚫 #1348: BlockStatement → "{}" [0 tests]
215| 				const unit = metric.unit ? ` ${metric.unit}` : '';
   🚫 #1349: StringLiteral → "``" [0 tests]
   🚫 #1350: StringLiteral → ""Stryker was here!"" [0 tests]
216| 				metricsHtml += `
   🚫 #1351: StringLiteral → "``" [0 tests]
217| 					<div class="insight-metric">
218| 						<span class="insight-metric-key">${escapeHtml(metric.key)}:</span>
219| 						<span class="insight-metric-value">${metric.value}${unit}</span>
220| 					</div>
221| 				`;
222| 			});
223| 			metricsHtml += '</div>';
   🚫 #1352: StringLiteral → """" [0 tests]
224| 		}
225| 
226| 		return `
   🚫 #1353: StringLiteral → "``" [0 tests]
227| 			<div class="insight-card">
228| 				<div class="insight-card-title">${escapeHtml(insight.name)}</div>
229| 				<div class="insight-card-desc">${escapeHtml(insight.description)}</div>
230| 				<div class="insight-card-confidence">Confidence: ${confidence}%</div>
231| 				${metricsHtml}
232| 			</div>
233| 		`;
234| 	}).join('');
   🚫 #1354: StringLiteral → ""Stryker was here!"" [0 tests]
235| 
236| 	return cards || '<p style="color:#9aa0b4;">No additional insights available.</p>';
   🚫 #1355: ConditionalExpression → "true" [0 tests]
   🚫 #1356: ConditionalExpression → "false" [0 tests]
   🚫 #1357: LogicalOperator → "cards && '<p style="color:#9aa0b4;">No additional insights available.</p>'" [0 tests]
   🚫 #1358: StringLiteral → """" [0 tests]
237| }
238| 
239| function renderAggregates(aggregates) {
   🚫 #1359: BlockStatement → "{}" [0 tests]
240| 	let html = '';
   🚫 #1360: StringLiteral → ""Stryker was here!"" [0 tests]
241| 
242| 	// By Category
243| 	if (aggregates.countsByCategory.length > 0) {
   🚫 #1361: ConditionalExpression → "true" [0 tests]
   🚫 #1362: ConditionalExpression → "false" [0 tests]
   🚫 #1363: EqualityOperator → "aggregates.countsByCategory.length >= 0" [0 tests]
   🚫 #1364: EqualityOperator → "aggregates.countsByCategory.length <= 0" [0 tests]
   🚫 #1365: BlockStatement → "{}" [0 tests]
244| 		html += '<h4 style="margin:0 0 12px; font-size:14px; color:#9aa0b4;">By Category</h4>';
   🚫 #1366: StringLiteral → """" [0 tests]
245| 		const maxCount = Math.max(...aggregates.countsByCategory.map(c => c.count));
   🚫 #1367: MethodExpression → "Math.min(...aggregates.countsByCategory.map(c => c.count))" [0 tests]
   🚫 #1368: ArrowFunction → "() => undefined" [0 tests]
246| 
247| 		aggregates.countsByCategory.forEach(item => {
   🚫 #1369: BlockStatement → "{}" [0 tests]
248| 			const width = (item.count / maxCount) * 100;
   🚫 #1370: ArithmeticOperator → "item.count / maxCount / 100" [0 tests]
   🚫 #1371: ArithmeticOperator → "item.count * maxCount" [0 tests]
249| 			const categoryLabel = item.category.replace(/_/g, ' ');
   🚫 #1372: StringLiteral → """" [0 tests]
250| 
251| 			html += `
   🚫 #1373: StringLiteral → "``" [0 tests]
252| 				<div class="aggregate-bar">
253| 					<div class="aggregate-bar-header">
254| 						<span class="aggregate-bar-label">${escapeHtml(categoryLabel)}</span>
255| 						<span class="aggregate-bar-count">${item.count}</span>
256| 					</div>
257| 					<div class="aggregate-bar-bg">
258| 						<div class="aggregate-bar-fill category-${item.category}" style="width: ${width}%">
259| 							${item.count}
260| 						</div>
261| 					</div>
262| 				</div>
263| 			`;
264| 		});
265| 	}
266| 
267| 	// By Label
268| 	if (aggregates.countsByLabel.length > 0) {
   🚫 #1374: ConditionalExpression → "true" [0 tests]
   🚫 #1375: ConditionalExpression → "false" [0 tests]
   🚫 #1376: EqualityOperator → "aggregates.countsByLabel.length >= 0" [0 tests]
   🚫 #1377: EqualityOperator → "aggregates.countsByLabel.length <= 0" [0 tests]
   🚫 #1378: BlockStatement → "{}" [0 tests]
269| 		html += '<h4 style="margin:20px 0 12px; font-size:14px; color:#9aa0b4;">By Label (Top 10)</h4>';
   🚫 #1379: StringLiteral → """" [0 tests]
270| 		const maxCount = Math.max(...aggregates.countsByLabel.map(c => c.count));
   🚫 #1380: MethodExpression → "Math.min(...aggregates.countsByLabel.map(c => c.count))" [0 tests]
   🚫 #1381: ArrowFunction → "() => undefined" [0 tests]
271| 		const topLabels = aggregates.countsByLabel.slice(0, 10);
   🚫 #1382: MethodExpression → "aggregates.countsByLabel" [0 tests]
272| 
273| 		topLabels.forEach(item => {
   🚫 #1383: BlockStatement → "{}" [0 tests]
274| 			const width = (item.count / maxCount) * 100;
   🚫 #1384: ArithmeticOperator → "item.count / maxCount / 100" [0 tests]
   🚫 #1385: ArithmeticOperator → "item.count * maxCount" [0 tests]
275| 
276| 			html += `
   🚫 #1386: StringLiteral → "``" [0 tests]
277| 				<div class="aggregate-bar">
278| 					<div class="aggregate-bar-header">
279| 						<span class="aggregate-bar-label">${escapeHtml(item.label)}</span>
280| 						<span class="aggregate-bar-count">${item.count}</span>
281| 					</div>
282| 					<div class="aggregate-bar-bg">
283| 						<div class="aggregate-bar-fill category-other" style="width: ${width}%; background:#4a4aff;">
284| 							${item.count}
285| 						</div>
286| 					</div>
287| 				</div>
288| 			`;
289| 		});
290| 	}
291| 
292| 	return html;
293| }
294| 
295| function escapeHtml(text) {
   🚫 #1387: BlockStatement → "{}" [0 tests]
296| 	const div = document.createElement('div');
   🚫 #1388: StringLiteral → """" [0 tests]
297| 	div.textContent = text;
298| 	return div.innerHTML;
299| }
300| 
301| /**
302|  * Render session report for multiple images
303|  */
304| function renderSessionReport(session) {
   🚫 #1389: BlockStatement → "{}" [0 tests]
305| 	const agg = session.sessionAggregates;
306| 	const completedImages = session.images.filter(img => img.status === 'completed');
   🚫 #1390: MethodExpression → "session.images" [0 tests]
   🚫 #1391: ArrowFunction → "() => undefined" [0 tests]
   🚫 #1392: ConditionalExpression → "true" [0 tests]
   🚫 #1393: ConditionalExpression → "false" [0 tests]
   🚫 #1394: EqualityOperator → "img.status !== 'completed'" [0 tests]
   🚫 #1395: StringLiteral → """" [0 tests]
307| 	
308| 	let html = '';
   🚫 #1396: StringLiteral → ""Stryker was here!"" [0 tests]
309| 
310| 	// Session Overview Section
311| 	html += renderSection('session-overview', '📊 Session Overview', renderSessionOverview(session, agg), false);
   🚫 #1397: AssignmentOperator → "html -= renderSection('session-overview', '📊 Session Overview', renderSessionOverview(session, agg), false)" [0 tests]
   🚫 #1398: StringLiteral → """" [0 tests]
   🚫 #1399: StringLiteral → """" [0 tests]
   🚫 #1400: BooleanLiteral → "true" [0 tests]
312| 
313| 	// Export Controls Section
314| 	html += renderSection('export', '💾 Export Data', renderExportControls(), false);
   🚫 #1401: AssignmentOperator → "html -= renderSection('export', '💾 Export Data', renderExportControls(), false)" [0 tests]
   🚫 #1402: StringLiteral → """" [0 tests]
   🚫 #1403: StringLiteral → """" [0 tests]
   🚫 #1404: BooleanLiteral → "true" [0 tests]
315| 
316| 	// Per-Image Sections
317| 	completedImages.forEach((img, index) => {
   🚫 #1405: BlockStatement → "{}" [0 tests]
318| 		const imageTitle = `🖼️ Image ${index + 1}: ${img.filename}`;
   🚫 #1406: StringLiteral → "``" [0 tests]
   🚫 #1407: ArithmeticOperator → "index - 1" [0 tests]
319| 		const imageReport = renderSingleImageReport(img);
320| 		html += renderSection(`image-${img.id}`, imageTitle, imageReport, true);
   🚫 #1408: AssignmentOperator → "html -= renderSection(`image-${img.id}`, imageTitle, imageReport, true)" [0 tests]
   🚫 #1409: StringLiteral → "``" [0 tests]
   🚫 #1410: BooleanLiteral → "false" [0 tests]
321| 	});
322| 
323| 	return html;
324| }
325| 
326| /**
327|  * Render session overview section
328|  */
329| function renderSessionOverview(session, agg) {
   🚫 #1411: BlockStatement → "{}" [0 tests]
330| 	const totalImages = session.images.length;
331| 	const completedCount = session.images.filter(img => img.status === 'completed').length;
   🚫 #1412: MethodExpression → "session.images" [0 tests]
   🚫 #1413: ArrowFunction → "() => undefined" [0 tests]
   🚫 #1414: ConditionalExpression → "true" [0 tests]
   🚫 #1415: ConditionalExpression → "false" [0 tests]
   🚫 #1416: EqualityOperator → "img.status !== 'completed'" [0 tests]
   🚫 #1417: StringLiteral → """" [0 tests]
332| 	const errorCount = session.images.filter(img => img.status === 'error').length;
   🚫 #1418: MethodExpression → "session.images" [0 tests]
   🚫 #1419: ArrowFunction → "() => undefined" [0 tests]
   🚫 #1420: ConditionalExpression → "true" [0 tests]
   🚫 #1421: ConditionalExpression → "false" [0 tests]
   🚫 #1422: EqualityOperator → "img.status !== 'error'" [0 tests]
   🚫 #1423: StringLiteral → """" [0 tests]
333| 
334| 	let html = '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:16px; margin-bottom:20px;">';
   🚫 #1424: StringLiteral → """" [0 tests]
335| 
336| 	// Summary cards
337| 	html += `
   🚫 #1425: StringLiteral → "``" [0 tests]
338| 		<div style="background:#141420; border:1px solid #2a2a3b; border-radius:8px; padding:16px;">
339| 			<div style="font-size:12px; color:#9aa0b4; margin-bottom:4px;">Total Images</div>
340| 			<div style="font-size:24px; font-weight:600;">${completedCount} / ${totalImages}</div>
341| 			${errorCount > 0 ? `<div style="font-size:12px; color:#ff4444; margin-top:4px;">${errorCount} failed</div>` : ''}
   🚫 #1426: ConditionalExpression → "true" [0 tests]
   🚫 #1427: ConditionalExpression → "false" [0 tests]
   🚫 #1428: EqualityOperator → "errorCount >= 0" [0 tests]
   🚫 #1429: EqualityOperator → "errorCount <= 0" [0 tests]
   🚫 #1430: StringLiteral → "``" [0 tests]
   🚫 #1431: StringLiteral → ""Stryker was here!"" [0 tests]
342| 		</div>
343| 		<div style="background:#141420; border:1px solid #2a2a3b; border-radius:8px; padding:16px;">
344| 			<div style="font-size:12px; color:#9aa0b4; margin-bottom:4px;">Total Detections</div>
345| 			<div style="font-size:24px; font-weight:600;">${agg.totalDetections}</div>
346| 		</div>
347| 		<div style="background:#141420; border:1px solid #ff4444; border-radius:8px; padding:16px;">
348| 			<div style="font-size:12px; color:#9aa0b4; margin-bottom:4px;">Safety Issues</div>
349| 			<div style="font-size:24px; font-weight:600;">${agg.safetyIssues.high + agg.safetyIssues.medium + agg.safetyIssues.low}</div>
   🚫 #1432: ArithmeticOperator → "agg.safetyIssues.high + agg.safetyIssues.medium - agg.safetyIssues.low" [0 tests]
   🚫 #1433: ArithmeticOperator → "agg.safetyIssues.high - agg.safetyIssues.medium" [0 tests]
350| 			<div style="font-size:11px; margin-top:4px;">
351| 				<span style="color:#ff4444;">High: ${agg.safetyIssues.high}</span> | 
352| 				<span style="color:#ffaa44;">Med: ${agg.safetyIssues.medium}</span> | 
353| 				<span style="color:#ffdd44;">Low: ${agg.safetyIssues.low}</span>
354| 			</div>
355| 		</div>
356| 	`;
357| 	html += '</div>';
   🚫 #1434: StringLiteral → """" [0 tests]
358| 
359| 	// Image heatmap
360| 	if (agg.imageStats && agg.imageStats.length > 0) {
   🚫 #1435: ConditionalExpression → "true" [0 tests]
   🚫 #1436: ConditionalExpression → "false" [0 tests]
   🚫 #1437: LogicalOperator → "agg.imageStats || agg.imageStats.length > 0" [0 tests]
   🚫 #1438: ConditionalExpression → "true" [0 tests]
   🚫 #1439: EqualityOperator → "agg.imageStats.length >= 0" [0 tests]
   🚫 #1440: EqualityOperator → "agg.imageStats.length <= 0" [0 tests]
   🚫 #1441: BlockStatement → "{}" [0 tests]
361| 		html += '<h4 style="margin:20px 0 12px; font-size:14px; color:#9aa0b4;">Images Overview</h4>';
   🚫 #1442: StringLiteral → """" [0 tests]
362| 		html += '<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap:8px;">';
   🚫 #1443: StringLiteral → """" [0 tests]
363| 		
364| 		agg.imageStats.forEach((stat) => {
   🚫 #1444: BlockStatement → "{}" [0 tests]
365| 			const hasSafety = stat.safetyIssueCount > 0;
   🚫 #1445: ConditionalExpression → "true" [0 tests]
   🚫 #1446: ConditionalExpression → "false" [0 tests]
   🚫 #1447: EqualityOperator → "stat.safetyIssueCount >= 0" [0 tests]
   🚫 #1448: EqualityOperator → "stat.safetyIssueCount <= 0" [0 tests]
366| 			const borderColor = hasSafety ? '#ff4444' : '#2a2a3b';
   🚫 #1449: StringLiteral → """" [0 tests]
   🚫 #1450: StringLiteral → """" [0 tests]
367| 			
368| 			html += `
   🚫 #1451: StringLiteral → "``" [0 tests]
369| 				<div style="background:#141420; border:2px solid ${borderColor}; border-radius:6px; padding:8px; font-size:11px;">
370| 					<div style="font-weight:600; margin-bottom:4px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(stat.filename)}</div>
371| 					<div style="color:#9aa0b4;">Detections: ${stat.detectionCount}</div>
372| 					${hasSafety ? `<div style="color:#ff4444;">⚠️ Safety: ${stat.safetyIssueCount}</div>` : ''}
   🚫 #1452: StringLiteral → "``" [0 tests]
   🚫 #1453: StringLiteral → ""Stryker was here!"" [0 tests]
373| 					${stat.progressItemCount > 0 ? `<div style="color:#44ff88;">📊 Progress: ${stat.progressItemCount}</div>` : ''}
   🚫 #1454: ConditionalExpression → "true" [0 tests]
   🚫 #1455: ConditionalExpression → "false" [0 tests]
   🚫 #1456: EqualityOperator → "stat.progressItemCount >= 0" [0 tests]
   🚫 #1457: EqualityOperator → "stat.progressItemCount <= 0" [0 tests]
   🚫 #1458: StringLiteral → "``" [0 tests]
   🚫 #1459: StringLiteral → ""Stryker was here!"" [0 tests]
374| 				</div>
375| 			`;
376| 		});
377| 		
378| 		html += '</div>';
   🚫 #1460: StringLiteral → """" [0 tests]
379| 	}
380| 
381| 	// Session aggregates
382| 	if (agg.categoryCounts && agg.categoryCounts.length > 0) {
   🚫 #1461: ConditionalExpression → "true" [0 tests]
   🚫 #1462: ConditionalExpression → "false" [0 tests]
   🚫 #1463: LogicalOperator → "agg.categoryCounts || agg.categoryCounts.length > 0" [0 tests]
   🚫 #1464: ConditionalExpression → "true" [0 tests]
   🚫 #1465: EqualityOperator → "agg.categoryCounts.length >= 0" [0 tests]
   🚫 #1466: EqualityOperator → "agg.categoryCounts.length <= 0" [0 tests]
   🚫 #1467: BlockStatement → "{}" [0 tests]
383| 		html += '<h4 style="margin:20px 0 12px; font-size:14px; color:#9aa0b4;">Category Distribution</h4>';
   🚫 #1468: StringLiteral → """" [0 tests]
384| 		html += renderAggregates({ countsByCategory: agg.categoryCounts, countsByLabel: [] });
   🚫 #1469: AssignmentOperator → "html -= renderAggregates({
  countsByCategory: agg.categoryCounts,
  countsByLabel: []
})" [0 tests]
   🚫 #1470: ObjectLiteral → "{}" [0 tests]
   🚫 #1471: ArrayDeclaration → "["Stryker was here"]" [0 tests]
385| 	}
386| 
387| 	return html;
388| }
389| 
390| /**
391|  * Render export controls
392|  */
393| function renderExportControls() {
   🚫 #1472: BlockStatement → "{}" [0 tests]
394| 	return `
   🚫 #1473: StringLiteral → "``" [0 tests]
395| 		<div style="display:flex; gap:12px; flex-wrap:wrap;">
396| 			<button id="exportJSON" style="background:#4a4aff; color:#fff; border:none; border-radius:8px; padding:12px 24px; font-size:14px; font-weight:600; cursor:pointer;">
397| 				Export JSON
398| 			</button>
399| 			<button id="exportCSV" style="background:#44ff88; color:#000; border:none; border-radius:8px; padding:12px 24px; font-size:14px; font-weight:600; cursor:pointer;">
400| 				Export CSV
401| 			</button>
402| 		</div>
403| 	`;
404| }
405| 
406| /**
407|  * Render single image report (for per-image subsections)
408|  */
409| function renderSingleImageReport(img) {
   🚫 #1474: BlockStatement → "{}" [0 tests]
410| 	const detections = img.detections || [];
   🚫 #1475: ConditionalExpression → "true" [0 tests]
   🚫 #1476: ConditionalExpression → "false" [0 tests]
   🚫 #1477: LogicalOperator → "img.detections && []" [0 tests]
   🚫 #1478: ArrayDeclaration → "["Stryker was here"]" [0 tests]
411| 	const insights = img.parsedData?.global_insights || [];
   🚫 #1479: ConditionalExpression → "true" [0 tests]
   🚫 #1480: ConditionalExpression → "false" [0 tests]
   🚫 #1481: LogicalOperator → "img.parsedData?.global_insights && []" [0 tests]
   🚫 #1482: OptionalChaining → "img.parsedData.global_insights" [0 tests]
   🚫 #1483: ArrayDeclaration → "["Stryker was here"]" [0 tests]
412| 
413| 	const safetyIssues = detections.filter(d => d.category === 'safety_issue');
   🚫 #1484: MethodExpression → "detections" [0 tests]
   🚫 #1485: ArrowFunction → "() => undefined" [0 tests]
   🚫 #1486: ConditionalExpression → "true" [0 tests]
   🚫 #1487: ConditionalExpression → "false" [0 tests]
   🚫 #1488: EqualityOperator → "d.category !== 'safety_issue'" [0 tests]
   🚫 #1489: StringLiteral → """" [0 tests]
414| 	const progressItems = detections.filter(d => d.category === 'progress' && d.progress);
   🚫 #1490: MethodExpression → "detections" [0 tests]
   🚫 #1491: ArrowFunction → "() => undefined" [0 tests]
   🚫 #1492: ConditionalExpression → "true" [0 tests]
   🚫 #1493: ConditionalExpression → "false" [0 tests]
   🚫 #1494: LogicalOperator → "d.category === 'progress' || d.progress" [0 tests]
   🚫 #1495: ConditionalExpression → "true" [0 tests]
   🚫 #1496: EqualityOperator → "d.category !== 'progress'" [0 tests]
   🚫 #1497: StringLiteral → """" [0 tests]
415| 	const progressInsights = insights.filter(i => i.category === 'progress');
   🚫 #1498: MethodExpression → "insights" [0 tests]
   🚫 #1499: ArrowFunction → "() => undefined" [0 tests]
   🚫 #1500: ConditionalExpression → "true" [0 tests]
   🚫 #1501: ConditionalExpression → "false" [0 tests]
   🚫 #1502: EqualityOperator → "i.category !== 'progress'" [0 tests]
   🚫 #1503: StringLiteral → """" [0 tests]
416| 
417| 	let html = '';
   🚫 #1504: StringLiteral → ""Stryker was here!"" [0 tests]
418| 
419| 	// Safety (if any)
420| 	if (safetyIssues.length > 0) {
   🚫 #1505: ConditionalExpression → "true" [0 tests]
   🚫 #1506: ConditionalExpression → "false" [0 tests]
   🚫 #1507: EqualityOperator → "safetyIssues.length >= 0" [0 tests]
   🚫 #1508: EqualityOperator → "safetyIssues.length <= 0" [0 tests]
   🚫 #1509: BlockStatement → "{}" [0 tests]
421| 		html += '<h4 style="margin:0 0 12px; font-size:14px; color:#9aa0b4;">Safety Issues</h4>';
   🚫 #1510: StringLiteral → """" [0 tests]
422| 		html += renderSafetyCards(safetyIssues);
   🚫 #1511: AssignmentOperator → "html -= renderSafetyCards(safetyIssues)" [0 tests]
423| 	}
424| 
425| 	// Progress (if any)
426| 	if (progressItems.length > 0 || progressInsights.length > 0) {
   🚫 #1512: ConditionalExpression → "true" [0 tests]
   🚫 #1513: ConditionalExpression → "false" [0 tests]
   🚫 #1514: LogicalOperator → "progressItems.length > 0 && progressInsights.length > 0" [0 tests]
   🚫 #1515: ConditionalExpression → "false" [0 tests]
   🚫 #1516: EqualityOperator → "progressItems.length >= 0" [0 tests]
   🚫 #1517: EqualityOperator → "progressItems.length <= 0" [0 tests]
   🚫 #1518: ConditionalExpression → "false" [0 tests]
   🚫 #1519: EqualityOperator → "progressInsights.length >= 0" [0 tests]
   🚫 #1520: EqualityOperator → "progressInsights.length <= 0" [0 tests]
   🚫 #1521: BlockStatement → "{}" [0 tests]
427| 		html += '<h4 style="margin:20px 0 12px; font-size:14px; color:#9aa0b4;">Progress</h4>';
   🚫 #1522: StringLiteral → """" [0 tests]
428| 		html += renderProgressSection(progressItems, progressInsights);
   🚫 #1523: AssignmentOperator → "html -= renderProgressSection(progressItems, progressInsights)" [0 tests]
429| 	}
430| 
431| 	// All Detections
432| 	if (detections.length > 0) {
   🚫 #1524: ConditionalExpression → "true" [0 tests]
   🚫 #1525: ConditionalExpression → "false" [0 tests]
   🚫 #1526: EqualityOperator → "detections.length >= 0" [0 tests]
   🚫 #1527: EqualityOperator → "detections.length <= 0" [0 tests]
   🚫 #1528: BlockStatement → "{}" [0 tests]
433| 		html += '<h4 style="margin:20px 0 12px; font-size:14px; color:#9aa0b4;">All Detections</h4>';
   🚫 #1529: StringLiteral → """" [0 tests]
434| 		html += renderDetectionCards(detections);
   🚫 #1530: AssignmentOperator → "html -= renderDetectionCards(detections)" [0 tests]
435| 	}
436| 
437| 	return html;
438| }
439| 
440| /**
441|  * Setup interactive event handlers for the report UI
442|  */
443| export function setupReportInteractions(reportContainer, detections, onHover, onLeave) {
   🚫 #1531: BlockStatement → "{}" [0 tests]
444| 	// Toggle section collapse
445| 	reportContainer.querySelectorAll('.report-header').forEach(header => {
   🚫 #1532: StringLiteral → """" [0 tests]
   🚫 #1533: BlockStatement → "{}" [0 tests]
446| 		header.addEventListener('click', () => {
   🚫 #1534: StringLiteral → """" [0 tests]
   🚫 #1535: BlockStatement → "{}" [0 tests]
447| 			const section = header.dataset.section;
448| 			const content = reportContainer.querySelector(`.report-content[data-section="${section}"]`);
   🚫 #1536: StringLiteral → "``" [0 tests]
449| 			
450| 			header.classList.toggle('collapsed');
   🚫 #1537: StringLiteral → """" [0 tests]
451| 			content.classList.toggle('hidden');
   🚫 #1538: StringLiteral → """" [0 tests]
452| 		});
453| 	});
454| 
455| 	// Detection card hover interactions
456| 	reportContainer.querySelectorAll('[data-detection-id]').forEach(card => {
   🚫 #1539: StringLiteral → """" [0 tests]
   🚫 #1540: BlockStatement → "{}" [0 tests]
457| 		const detectionId = card.dataset.detectionId;
458| 		const detection = detections.find(d => d.id === detectionId);
   🚫 #1541: ArrowFunction → "() => undefined" [0 tests]
   🚫 #1542: ConditionalExpression → "true" [0 tests]
   🚫 #1543: ConditionalExpression → "false" [0 tests]
   🚫 #1544: EqualityOperator → "d.id !== detectionId" [0 tests]
459| 
460| 		if (detection) {
   🚫 #1545: ConditionalExpression → "true" [0 tests]
   🚫 #1546: ConditionalExpression → "false" [0 tests]
   🚫 #1547: BlockStatement → "{}" [0 tests]
461| 			card.addEventListener('mouseenter', () => {
   🚫 #1548: StringLiteral → """" [0 tests]
   🚫 #1549: BlockStatement → "{}" [0 tests]
462| 				card.classList.add('highlight');
   🚫 #1550: StringLiteral → """" [0 tests]
463| 				onHover(detection);
464| 			});
465| 
466| 			card.addEventListener('mouseleave', () => {
   🚫 #1551: StringLiteral → """" [0 tests]
   🚫 #1552: BlockStatement → "{}" [0 tests]
467| 				card.classList.remove('highlight');
   🚫 #1553: StringLiteral → """" [0 tests]
468| 				onLeave(detection);
469| 			});
470| 		}
471| 	});
472| }
473| 
```

#### ❌ Critical Survived Mutants (First 3)

1. **Mutant #1080** - Line 22:21-38
   - **Mutator**: `MethodExpression` → `Object.entries(countsByCategory).map(([category, count]) => ({
  category,
  count
}))`
   - **Issue**: Unknown
   - **Fix**: Mock and verify method calls with different inputs
   - **Tests that should have caught this**: 79, 80, 81, 82, 83, 84, 85, 86

2. **Mutant #1083** - Line 24:10-37
   - **Mutator**: `ArrowFunction` → `() => undefined`
   - **Issue**: Unknown
   - **Fix**: Add specific test cases to kill this mutant
   - **Tests that should have caught this**: 79, 80, 81, 82, 83, 84, 85, 86

3. **Mutant #1084** - Line 24:20-37
   - **Mutator**: `ArithmeticOperator` → `b.count + a.count`
   - **Issue**: Unknown
   - **Fix**: Test with different numeric values and operators
   - **Tests that should have caught this**: 79, 80, 83

#### 🚫 Coverage Gaps Summary

- **469 uncovered mutants** across 165 lines
- **Most affected lines**: 31, 33, 38, 39, 43
- **Common uncovered operations**: StringLiteral, ConditionalExpression, EqualityOperator

##### Detailed No Coverage Mutants:
1. **Mutant #1085** - Line 31:54-2: `BlockStatement` → `{}`
2. **Mutant #1086** - Line 33:6-60: `ConditionalExpression` → `true`
3. **Mutant #1087** - Line 33:6-60: `ConditionalExpression` → `false`
4. **Mutant #1088** - Line 33:6-60: `LogicalOperator` → `session && session.images || session.images.length > 1`
5. **Mutant #1089** - Line 33:6-31: `ConditionalExpression` → `true`
6. **Mutant #1090** - Line 33:6-31: `LogicalOperator` → `session || session.images`
7. **Mutant #1091** - Line 33:35-60: `ConditionalExpression` → `true`
8. **Mutant #1092** - Line 33:35-60: `EqualityOperator` → `session.images.length >= 1`
9. **Mutant #1093** - Line 33:35-60: `EqualityOperator` → `session.images.length <= 1`
10. **Mutant #1094** - Line 33:62-3: `BlockStatement` → `{}`
11. **Mutant #1095** - Line 38:72-74: `ArrayDeclaration` → `["Stryker was here"]`
12. **Mutant #1096** - Line 39:80-82: `ArrayDeclaration` → `["Stryker was here"]`
13. **Mutant #1097** - Line 43:23-76: `MethodExpression` → `detections`
14. **Mutant #1098** - Line 43:41-75: `ArrowFunction` → `() => undefined`
15. **Mutant #1099** - Line 43:46-75: `ConditionalExpression` → `true`
16. **Mutant #1100** - Line 43:46-75: `ConditionalExpression` → `false`
17. **Mutant #1101** - Line 43:46-75: `EqualityOperator` → `d.category !== 'safety_issue'`
18. **Mutant #1102** - Line 43:61-75: `StringLiteral` → `""`
19. **Mutant #1103** - Line 44:24-87: `MethodExpression` → `detections`
20. **Mutant #1104** - Line 44:42-86: `ArrowFunction` → `() => undefined`
21. **Mutant #1105** - Line 44:47-86: `ConditionalExpression` → `true`
22. **Mutant #1106** - Line 44:47-86: `ConditionalExpression` → `false`
23. **Mutant #1107** - Line 44:47-86: `LogicalOperator` → `d.category === 'progress' || d.progress`
24. **Mutant #1108** - Line 44:47-72: `ConditionalExpression` → `true`
25. **Mutant #1109** - Line 44:47-72: `EqualityOperator` → `d.category !== 'progress'`
26. **Mutant #1110** - Line 44:62-72: `StringLiteral` → `""`
27. **Mutant #1111** - Line 46:13-15: `StringLiteral` → `"Stryker was here!"`
28. **Mutant #1112** - Line 49:6-29: `ConditionalExpression` → `true`
29. **Mutant #1113** - Line 49:6-29: `ConditionalExpression` → `false`
30. **Mutant #1114** - Line 49:6-29: `EqualityOperator` → `safetyIssues.length >= 0`
31. **Mutant #1115** - Line 49:6-29: `EqualityOperator` → `safetyIssues.length <= 0`
32. **Mutant #1116** - Line 49:31-3: `BlockStatement` → `{}`
33. **Mutant #1117** - Line 50:3-94: `AssignmentOperator` → `html -= renderSection('safety', '🚨 Safety Issues', renderSafetyCards(safetyIssues), false)`
34. **Mutant #1118** - Line 50:25-33: `StringLiteral` → `""`
35. **Mutant #1119** - Line 50:35-53: `StringLiteral` → `""`
36. **Mutant #1120** - Line 50:88-93: `BooleanLiteral` → `true`
37. **Mutant #1121** - Line 54:27-74: `MethodExpression` → `insights`
38. **Mutant #1122** - Line 54:43-73: `ArrowFunction` → `() => undefined`
39. **Mutant #1123** - Line 54:48-73: `ConditionalExpression` → `true`
40. **Mutant #1124** - Line 54:48-73: `ConditionalExpression` → `false`
41. **Mutant #1125** - Line 54:48-73: `EqualityOperator` → `i.category !== 'progress'`
42. **Mutant #1126** - Line 54:63-73: `StringLiteral` → `""`
43. **Mutant #1127** - Line 55:6-61: `ConditionalExpression` → `true`
44. **Mutant #1128** - Line 55:6-61: `ConditionalExpression` → `false`
45. **Mutant #1129** - Line 55:6-61: `LogicalOperator` → `progressItems.length > 0 && progressInsights.length > 0`
46. **Mutant #1130** - Line 55:6-30: `ConditionalExpression` → `false`
47. **Mutant #1131** - Line 55:6-30: `EqualityOperator` → `progressItems.length >= 0`
48. **Mutant #1132** - Line 55:6-30: `EqualityOperator` → `progressItems.length <= 0`
49. **Mutant #1133** - Line 55:34-61: `ConditionalExpression` → `false`
50. **Mutant #1134** - Line 55:34-61: `EqualityOperator` → `progressInsights.length >= 0`
51. **Mutant #1135** - Line 55:34-61: `EqualityOperator` → `progressInsights.length <= 0`
52. **Mutant #1136** - Line 55:63-3: `BlockStatement` → `{}`
53. **Mutant #1137** - Line 56:3-113: `AssignmentOperator` → `html -= renderSection('progress', '📊 Progress', renderProgressSection(progressItems, progressInsights), true)`
54. **Mutant #1138** - Line 56:25-35: `StringLiteral` → `""`
55. **Mutant #1139** - Line 56:37-50: `StringLiteral` → `""`
56. **Mutant #1140** - Line 56:108-112: `BooleanLiteral` → `false`
57. **Mutant #1141** - Line 60:6-27: `ConditionalExpression` → `true`
58. **Mutant #1142** - Line 60:6-27: `ConditionalExpression` → `false`
59. **Mutant #1143** - Line 60:6-27: `EqualityOperator` → `detections.length >= 0`
60. **Mutant #1144** - Line 60:6-27: `EqualityOperator` → `detections.length <= 0`
61. **Mutant #1145** - Line 60:29-3: `BlockStatement` → `{}`
62. **Mutant #1146** - Line 61:3-99: `AssignmentOperator` → `html -= renderSection('detections', '🔍 All Detections', renderDetectionCards(detections), true)`
63. **Mutant #1147** - Line 61:25-37: `StringLiteral` → `""`
64. **Mutant #1148** - Line 61:39-58: `StringLiteral` → `""`
65. **Mutant #1149** - Line 61:94-98: `BooleanLiteral` → `false`
66. **Mutant #1150** - Line 65:24-71: `MethodExpression` → `insights`
67. **Mutant #1151** - Line 65:40-70: `ArrowFunction` → `() => undefined`
68. **Mutant #1152** - Line 65:45-70: `ConditionalExpression` → `true`
69. **Mutant #1153** - Line 65:45-70: `ConditionalExpression` → `false`
70. **Mutant #1154** - Line 65:45-70: `EqualityOperator` → `i.category === 'progress'`
71. **Mutant #1155** - Line 65:60-70: `StringLiteral` → `""`
72. **Mutant #1156** - Line 66:6-30: `ConditionalExpression` → `true`
73. **Mutant #1157** - Line 66:6-30: `ConditionalExpression` → `false`
74. **Mutant #1158** - Line 66:6-30: `EqualityOperator` → `otherInsights.length >= 0`
75. **Mutant #1159** - Line 66:6-30: `EqualityOperator` → `otherInsights.length <= 0`
76. **Mutant #1160** - Line 66:32-3: `BlockStatement` → `{}`
77. **Mutant #1161** - Line 67:3-95: `AssignmentOperator` → `html -= renderSection('insights', '💡 Global Insights', renderInsights(otherInsights), true)`
78. **Mutant #1162** - Line 67:25-35: `StringLiteral` → `""`
79. **Mutant #1163** - Line 67:37-57: `StringLiteral` → `""`
80. **Mutant #1164** - Line 67:90-94: `BooleanLiteral` → `false`
81. **Mutant #1165** - Line 71:6-83: `ConditionalExpression` → `true`
82. **Mutant #1166** - Line 71:6-83: `ConditionalExpression` → `false`
83. **Mutant #1167** - Line 71:6-83: `LogicalOperator` → `aggregates.countsByLabel.length > 0 && aggregates.countsByCategory.length > 0`
84. **Mutant #1168** - Line 71:6-41: `ConditionalExpression` → `false`
85. **Mutant #1169** - Line 71:6-41: `EqualityOperator` → `aggregates.countsByLabel.length >= 0`
86. **Mutant #1170** - Line 71:6-41: `EqualityOperator` → `aggregates.countsByLabel.length <= 0`
87. **Mutant #1171** - Line 71:45-83: `ConditionalExpression` → `false`
88. **Mutant #1172** - Line 71:45-83: `EqualityOperator` → `aggregates.countsByCategory.length >= 0`
89. **Mutant #1173** - Line 71:45-83: `EqualityOperator` → `aggregates.countsByCategory.length <= 0`
90. **Mutant #1174** - Line 71:85-3: `BlockStatement` → `{}`
91. **Mutant #1175** - Line 72:3-99: `AssignmentOperator` → `html -= renderSection('aggregates', '📈 Summary Statistics', renderAggregates(aggregates), true)`
92. **Mutant #1176** - Line 72:25-37: `StringLiteral` → `""`
93. **Mutant #1177** - Line 72:39-62: `StringLiteral` → `""`
94. **Mutant #1178** - Line 72:94-98: `BooleanLiteral` → `false`
95. **Mutant #1179** - Line 78:56-61: `BooleanLiteral` → `true`
96. **Mutant #1180** - Line 78:63-2: `BlockStatement` → `{}`
97. **Mutant #1181** - Line 79:37-48: `StringLiteral` → `""`
98. **Mutant #1182** - Line 79:51-53: `StringLiteral` → `"Stryker was here!"`
99. **Mutant #1183** - Line 80:34-42: `StringLiteral` → `""`
100. **Mutant #1184** - Line 80:45-47: `StringLiteral` → `"Stryker was here!"`
101. **Mutant #1185** - Line 81:9-3: `StringLiteral` → ````
102. **Mutant #1186** - Line 93:42-2: `BlockStatement` → `{}`
103. **Mutant #1187** - Line 94:40-3: `BlockStatement` → `{}`
104. **Mutant #1188** - Line 95:20-49: `ConditionalExpression` → `true`
105. **Mutant #1189** - Line 95:20-49: `ConditionalExpression` → `false`
106. **Mutant #1190** - Line 95:20-49: `LogicalOperator` → `det.safety?.severity && 'low'`
107. **Mutant #1191** - Line 95:20-40: `OptionalChaining` → `det.safety.severity`
108. **Mutant #1192** - Line 95:44-49: `StringLiteral` → `""`
109. **Mutant #1193** - Line 96:16-55: `ConditionalExpression` → `true`
110. **Mutant #1194** - Line 96:16-55: `ConditionalExpression` → `false`
111. **Mutant #1195** - Line 96:16-55: `LogicalOperator` → `det.safety?.rule && 'No rule specified'`
112. **Mutant #1196** - Line 96:16-32: `OptionalChaining` → `det.safety.rule`
113. **Mutant #1197** - Line 96:36-55: `StringLiteral` → `""`
114. **Mutant #1198** - Line 97:22-56: `ConditionalExpression` → `true`
115. **Mutant #1199** - Line 97:22-56: `ConditionalExpression` → `false`
116. **Mutant #1200** - Line 97:22-56: `EqualityOperator` → `typeof det.confidence !== 'number'`
117. **Mutant #1201** - Line 97:48-56: `StringLiteral` → `""`
118. **Mutant #1202** - Line 97:60-80: `ArithmeticOperator` → `det.confidence / 100`
119. **Mutant #1203** - Line 97:95-98: `StringLiteral` → `""`
120. **Mutant #1204** - Line 99:10-4: `StringLiteral` → ````
121. **Mutant #1205** - Line 100:71-83: `ConditionalExpression` → `true`
122. **Mutant #1206** - Line 100:71-83: `ConditionalExpression` → `false`
123. **Mutant #1207** - Line 100:71-83: `LogicalOperator` → `det.id && ''`
124. **Mutant #1208** - Line 100:81-83: `StringLiteral` → `"Stryker was here!"`
125. **Mutant #1209** - Line 107:10-12: `StringLiteral` → `"Stryker was here!"`
126. **Mutant #1210** - Line 109:9-50: `StringLiteral` → ````
127. **Mutant #1211** - Line 112:65-2: `BlockStatement` → `{}`
128. **Mutant #1212** - Line 113:13-15: `StringLiteral` → `"Stryker was here!"`
129. **Mutant #1213** - Line 116:6-30: `ConditionalExpression` → `true`
130. **Mutant #1214** - Line 116:6-30: `ConditionalExpression` → `false`
131. **Mutant #1215** - Line 116:6-30: `EqualityOperator` → `progressItems.length >= 0`
132. **Mutant #1216** - Line 116:6-30: `EqualityOperator` → `progressItems.length <= 0`
133. **Mutant #1217** - Line 116:32-3: `BlockStatement` → `{}`
134. **Mutant #1218** - Line 117:11-95: `StringLiteral` → `""`
135. **Mutant #1219** - Line 118:32-4: `BlockStatement` → `{}`
136. **Mutant #1220** - Line 119:18-56: `ConditionalExpression` → `true`
137. **Mutant #1221** - Line 119:18-56: `ConditionalExpression` → `false`
138. **Mutant #1222** - Line 119:18-56: `LogicalOperator` → `det.progress?.phase && 'Unknown phase'`
139. **Mutant #1223** - Line 119:18-37: `OptionalChaining` → `det.progress.phase`
140. **Mutant #1224** - Line 119:41-56: `StringLiteral` → `""`
141. **Mutant #1225** - Line 120:20-54: `LogicalOperator` → `det.progress?.percentComplete && 0`
142. **Mutant #1226** - Line 120:20-49: `OptionalChaining` → `det.progress.percentComplete`
143. **Mutant #1227** - Line 121:18-43: `ConditionalExpression` → `true`
144. **Mutant #1228** - Line 121:18-43: `ConditionalExpression` → `false`
145. **Mutant #1229** - Line 121:18-43: `LogicalOperator` → `det.progress?.notes && ''`
146. **Mutant #1230** - Line 121:18-37: `OptionalChaining` → `det.progress.notes`
147. **Mutant #1231** - Line 121:41-43: `StringLiteral` → `"Stryker was here!"`
148. **Mutant #1232** - Line 122:23-57: `ConditionalExpression` → `true`
149. **Mutant #1233** - Line 122:23-57: `ConditionalExpression` → `false`
150. **Mutant #1234** - Line 122:23-57: `EqualityOperator` → `typeof det.confidence !== 'number'`
151. **Mutant #1235** - Line 122:49-57: `StringLiteral` → `""`
152. **Mutant #1236** - Line 122:61-81: `ArithmeticOperator` → `det.confidence / 100`
153. **Mutant #1237** - Line 122:96-99: `StringLiteral` → `""`
154. **Mutant #1238** - Line 124:12-5: `StringLiteral` → ````
155. **Mutant #1239** - Line 125:53-65: `ConditionalExpression` → `true`
156. **Mutant #1240** - Line 125:53-65: `ConditionalExpression` → `false`
157. **Mutant #1241** - Line 125:53-65: `LogicalOperator` → `det.id && ''`
158. **Mutant #1242** - Line 125:63-65: `StringLiteral` → `"Stryker was here!"`
159. **Mutant #1243** - Line 133:16-72: `StringLiteral` → ````
160. **Mutant #1244** - Line 133:75-77: `StringLiteral` → `"Stryker was here!"`
161. **Mutant #1245** - Line 141:6-33: `ConditionalExpression` → `true`
162. **Mutant #1246** - Line 141:6-33: `ConditionalExpression` → `false`
163. **Mutant #1247** - Line 141:6-33: `EqualityOperator` → `progressInsights.length >= 0`
164. **Mutant #1248** - Line 141:6-33: `EqualityOperator` → `progressInsights.length <= 0`
165. **Mutant #1249** - Line 141:35-3: `BlockStatement` → `{}`
166. **Mutant #1250** - Line 142:7-31: `ConditionalExpression` → `true`
167. **Mutant #1251** - Line 142:7-31: `ConditionalExpression` → `false`
168. **Mutant #1252** - Line 142:7-31: `EqualityOperator` → `progressItems.length >= 0`
169. **Mutant #1253** - Line 142:7-31: `EqualityOperator` → `progressItems.length <= 0`
170. **Mutant #1254** - Line 142:33-4: `BlockStatement` → `{}`
171. **Mutant #1255** - Line 143:12-98: `StringLiteral` → `""`
172. **Mutant #1256** - Line 145:39-4: `BlockStatement` → `{}`
173. **Mutant #1257** - Line 146:23-61: `ConditionalExpression` → `true`
174. **Mutant #1258** - Line 146:23-61: `ConditionalExpression` → `false`
175. **Mutant #1259** - Line 146:23-61: `EqualityOperator` → `typeof insight.confidence !== 'number'`
176. **Mutant #1260** - Line 146:53-61: `StringLiteral` → `""`
177. **Mutant #1261** - Line 146:65-89: `ArithmeticOperator` → `insight.confidence / 100`
178. **Mutant #1262** - Line 146:104-107: `StringLiteral` → `""`
179. **Mutant #1263** - Line 149:8-23: `ConditionalExpression` → `true`
180. **Mutant #1264** - Line 149:8-23: `ConditionalExpression` → `false`
181. **Mutant #1265** - Line 149:25-5: `BlockStatement` → `{}`
182. **Mutant #1266** - Line 150:44-132: `ArrowFunction` → `() => undefined`
183. **Mutant #1267** - Line 150:49-132: `ConditionalExpression` → `true`
184. **Mutant #1268** - Line 150:49-132: `ConditionalExpression` → `false`
185. **Mutant #1269** - Line 150:49-132: `LogicalOperator` → `m.key.toLowerCase().includes('percent') && m.key.toLowerCase().includes('complete')`
186. **Mutant #1270** - Line 150:49-68: `MethodExpression` → `m.key.toUpperCase()`
187. **Mutant #1271** - Line 150:78-87: `StringLiteral` → `""`
188. **Mutant #1272** - Line 150:92-111: `MethodExpression` → `m.key.toUpperCase()`
189. **Mutant #1273** - Line 150:121-131: `StringLiteral` → `""`
190. **Mutant #1274** - Line 151:9-18: `ConditionalExpression` → `true`
191. **Mutant #1275** - Line 151:9-18: `ConditionalExpression` → `false`
192. **Mutant #1276** - Line 154:12-5: `StringLiteral` → ````
193. **Mutant #1277** - Line 158:9-20: `ConditionalExpression` → `true`
194. **Mutant #1278** - Line 158:9-20: `ConditionalExpression` → `false`
195. **Mutant #1279** - Line 158:9-20: `EqualityOperator` → `percent >= 0`
196. **Mutant #1280** - Line 158:9-20: `EqualityOperator` → `percent <= 0`
197. **Mutant #1281** - Line 158:23-85: `StringLiteral` → ````
198. **Mutant #1282** - Line 158:88-90: `StringLiteral` → `"Stryker was here!"`
199. **Mutant #1283** - Line 160:8-19: `ConditionalExpression` → `true`
200. **Mutant #1284** - Line 160:8-19: `ConditionalExpression` → `false`
201. **Mutant #1285** - Line 160:8-19: `EqualityOperator` → `percent >= 0`
202. **Mutant #1286** - Line 160:8-19: `EqualityOperator` → `percent <= 0`
203. **Mutant #1287** - Line 160:22-7: `StringLiteral` → ````
204. **Mutant #1288** - Line 164:10-12: `StringLiteral` → `"Stryker was here!"`
205. **Mutant #1289** - Line 172:9-83: `ConditionalExpression` → `true`
206. **Mutant #1290** - Line 172:9-83: `ConditionalExpression` → `false`
207. **Mutant #1291** - Line 172:9-83: `LogicalOperator` → `html && '<p style="color:#9aa0b4;">No progress information available.</p>'`
208. **Mutant #1292** - Line 172:17-83: `StringLiteral` → `""`
209. **Mutant #1293** - Line 175:43-2: `BlockStatement` → `{}`
210. **Mutant #1294** - Line 176:38-3: `BlockStatement` → `{}`
211. **Mutant #1295** - Line 177:22-56: `ConditionalExpression` → `true`
212. **Mutant #1296** - Line 177:22-56: `ConditionalExpression` → `false`
213. **Mutant #1297** - Line 177:22-56: `EqualityOperator` → `typeof det.confidence !== 'number'`
214. **Mutant #1298** - Line 177:48-56: `StringLiteral` → `""`
215. **Mutant #1299** - Line 177:60-80: `ArithmeticOperator` → `det.confidence / 100`
216. **Mutant #1300** - Line 177:95-98: `StringLiteral` → `""`
217. **Mutant #1301** - Line 178:20-43: `ConditionalExpression` → `true`
218. **Mutant #1302** - Line 178:20-43: `ConditionalExpression` → `false`
219. **Mutant #1303** - Line 178:20-43: `LogicalOperator` → `det.category && 'other'`
220. **Mutant #1304** - Line 178:36-43: `StringLiteral` → `""`
221. **Mutant #1305** - Line 179:48-51: `StringLiteral` → `""`
222. **Mutant #1306** - Line 181:19-21: `StringLiteral` → `"Stryker was here!"`
223. **Mutant #1307** - Line 182:7-65: `ConditionalExpression` → `true`
224. **Mutant #1308** - Line 182:7-65: `ConditionalExpression` → `false`
225. **Mutant #1309** - Line 182:7-65: `LogicalOperator` → `Array.isArray(det.attributes) || det.attributes.length > 0`
226. **Mutant #1310** - Line 182:40-65: `ConditionalExpression` → `true`
227. **Mutant #1311** - Line 182:40-65: `EqualityOperator` → `det.attributes.length >= 0`
228. **Mutant #1312** - Line 182:40-65: `EqualityOperator` → `det.attributes.length <= 0`
229. **Mutant #1313** - Line 182:67-4: `BlockStatement` → `{}`
230. **Mutant #1314** - Line 183:16-51: `StringLiteral` → `""`
231. **Mutant #1315** - Line 184:35-5: `BlockStatement` → `{}`
232. **Mutant #1316** - Line 185:19-74: `LogicalOperator` → `(attr.valueNum ?? attr.valueStr ?? attr.valueBool) && '—'`
233. **Mutant #1317** - Line 185:19-67: `LogicalOperator` → `(attr.valueNum ?? attr.valueStr) && attr.valueBool`
234. **Mutant #1318** - Line 185:19-49: `LogicalOperator` → `attr.valueNum && attr.valueStr`
235. **Mutant #1319** - Line 185:71-74: `StringLiteral` → `""`
236. **Mutant #1320** - Line 186:30-45: `StringLiteral` → ````
237. **Mutant #1321** - Line 186:48-50: `StringLiteral` → `"Stryker was here!"`
238. **Mutant #1322** - Line 187:18-82: `StringLiteral` → ````
239. **Mutant #1323** - Line 189:17-24: `StringLiteral` → `""`
240. **Mutant #1324** - Line 192:10-4: `StringLiteral` → ````
241. **Mutant #1325** - Line 193:74-86: `ConditionalExpression` → `true`
242. **Mutant #1326** - Line 193:74-86: `ConditionalExpression` → `false`
243. **Mutant #1327** - Line 193:74-86: `LogicalOperator` → `det.id && ''`
244. **Mutant #1328** - Line 193:84-86: `StringLiteral` → `"Stryker was here!"`
245. **Mutant #1329** - Line 202:10-12: `StringLiteral` → `"Stryker was here!"`
246. **Mutant #1330** - Line 204:9-53: `StringLiteral` → ````
247. **Mutant #1331** - Line 207:35-2: `BlockStatement` → `{}`
248. **Mutant #1332** - Line 208:40-3: `BlockStatement` → `{}`
249. **Mutant #1333** - Line 209:22-60: `ConditionalExpression` → `true`
250. **Mutant #1334** - Line 209:22-60: `ConditionalExpression` → `false`
251. **Mutant #1335** - Line 209:22-60: `EqualityOperator` → `typeof insight.confidence !== 'number'`
252. **Mutant #1336** - Line 209:52-60: `StringLiteral` → `""`
253. **Mutant #1337** - Line 209:64-88: `ArithmeticOperator` → `insight.confidence / 100`
254. **Mutant #1338** - Line 209:103-106: `StringLiteral` → `""`
255. **Mutant #1339** - Line 210:21-23: `StringLiteral` → `"Stryker was here!"`
256. **Mutant #1340** - Line 212:7-67: `ConditionalExpression` → `true`
257. **Mutant #1341** - Line 212:7-67: `ConditionalExpression` → `false`
258. **Mutant #1342** - Line 212:7-67: `LogicalOperator` → `Array.isArray(insight.metrics) || insight.metrics.length > 0`
259. **Mutant #1343** - Line 212:41-67: `ConditionalExpression` → `true`
260. **Mutant #1344** - Line 212:41-67: `EqualityOperator` → `insight.metrics.length >= 0`
261. **Mutant #1345** - Line 212:41-67: `EqualityOperator` → `insight.metrics.length <= 0`
262. **Mutant #1346** - Line 212:69-4: `BlockStatement` → `{}`
263. **Mutant #1347** - Line 213:18-49: `StringLiteral` → `""`
264. **Mutant #1348** - Line 214:38-5: `BlockStatement` → `{}`
265. **Mutant #1349** - Line 215:32-49: `StringLiteral` → ````
266. **Mutant #1350** - Line 215:52-54: `StringLiteral` → `"Stryker was here!"`
267. **Mutant #1351** - Line 216:20-6: `StringLiteral` → ````
268. **Mutant #1352** - Line 223:19-27: `StringLiteral` → `""`
269. **Mutant #1353** - Line 226:10-4: `StringLiteral` → ````
270. **Mutant #1354** - Line 234:10-12: `StringLiteral` → `"Stryker was here!"`
271. **Mutant #1355** - Line 236:9-83: `ConditionalExpression` → `true`
272. **Mutant #1356** - Line 236:9-83: `ConditionalExpression` → `false`
273. **Mutant #1357** - Line 236:9-83: `LogicalOperator` → `cards && '<p style="color:#9aa0b4;">No additional insights available.</p>'`
274. **Mutant #1358** - Line 236:18-83: `StringLiteral` → `""`
275. **Mutant #1359** - Line 239:39-2: `BlockStatement` → `{}`
276. **Mutant #1360** - Line 240:13-15: `StringLiteral` → `"Stryker was here!"`
277. **Mutant #1361** - Line 243:6-44: `ConditionalExpression` → `true`
278. **Mutant #1362** - Line 243:6-44: `ConditionalExpression` → `false`
279. **Mutant #1363** - Line 243:6-44: `EqualityOperator` → `aggregates.countsByCategory.length >= 0`
280. **Mutant #1364** - Line 243:6-44: `EqualityOperator` → `aggregates.countsByCategory.length <= 0`
281. **Mutant #1365** - Line 243:46-3: `BlockStatement` → `{}`
282. **Mutant #1366** - Line 244:11-89: `StringLiteral` → `""`
283. **Mutant #1367** - Line 245:20-78: `MethodExpression` → `Math.min(...aggregates.countsByCategory.map(c => c.count))`
284. **Mutant #1368** - Line 245:64-76: `ArrowFunction` → `() => undefined`
285. **Mutant #1369** - Line 247:47-4: `BlockStatement` → `{}`
286. **Mutant #1370** - Line 248:18-47: `ArithmeticOperator` → `item.count / maxCount / 100`
287. **Mutant #1371** - Line 248:19-40: `ArithmeticOperator` → `item.count * maxCount`
288. **Mutant #1372** - Line 249:54-57: `StringLiteral` → `""`
289. **Mutant #1373** - Line 251:12-5: `StringLiteral` → ````
290. **Mutant #1374** - Line 268:6-41: `ConditionalExpression` → `true`
291. **Mutant #1375** - Line 268:6-41: `ConditionalExpression` → `false`
292. **Mutant #1376** - Line 268:6-41: `EqualityOperator` → `aggregates.countsByLabel.length >= 0`
293. **Mutant #1377** - Line 268:6-41: `EqualityOperator` → `aggregates.countsByLabel.length <= 0`
294. **Mutant #1378** - Line 268:43-3: `BlockStatement` → `{}`
295. **Mutant #1379** - Line 269:11-98: `StringLiteral` → `""`
296. **Mutant #1380** - Line 270:20-75: `MethodExpression` → `Math.min(...aggregates.countsByLabel.map(c => c.count))`
297. **Mutant #1381** - Line 270:61-73: `ArrowFunction` → `() => undefined`
298. **Mutant #1382** - Line 271:21-58: `MethodExpression` → `aggregates.countsByLabel`
299. **Mutant #1383** - Line 273:29-4: `BlockStatement` → `{}`
300. **Mutant #1384** - Line 274:18-47: `ArithmeticOperator` → `item.count / maxCount / 100`
301. **Mutant #1385** - Line 274:19-40: `ArithmeticOperator` → `item.count * maxCount`
302. **Mutant #1386** - Line 276:12-5: `StringLiteral` → ````
303. **Mutant #1387** - Line 295:27-2: `BlockStatement` → `{}`
304. **Mutant #1388** - Line 296:37-42: `StringLiteral` → `""`
305. **Mutant #1389** - Line 304:39-2: `BlockStatement` → `{}`
306. **Mutant #1390** - Line 306:26-82: `MethodExpression` → `session.images`
307. **Mutant #1391** - Line 306:48-81: `ArrowFunction` → `() => undefined`
308. **Mutant #1392** - Line 306:55-81: `ConditionalExpression` → `true`
309. **Mutant #1393** - Line 306:55-81: `ConditionalExpression` → `false`
310. **Mutant #1394** - Line 306:55-81: `EqualityOperator` → `img.status !== 'completed'`
311. **Mutant #1395** - Line 306:70-81: `StringLiteral` → `""`
312. **Mutant #1396** - Line 308:13-15: `StringLiteral` → `"Stryker was here!"`
313. **Mutant #1397** - Line 311:2-110: `AssignmentOperator` → `html -= renderSection('session-overview', '📊 Session Overview', renderSessionOverview(session, agg), false)`
314. **Mutant #1398** - Line 311:24-42: `StringLiteral` → `""`
315. **Mutant #1399** - Line 311:44-65: `StringLiteral` → `""`
316. **Mutant #1400** - Line 311:104-109: `BooleanLiteral` → `true`
317. **Mutant #1401** - Line 314:2-82: `AssignmentOperator` → `html -= renderSection('export', '💾 Export Data', renderExportControls(), false)`
318. **Mutant #1402** - Line 314:24-32: `StringLiteral` → `""`
319. **Mutant #1403** - Line 314:34-50: `StringLiteral` → `""`
320. **Mutant #1404** - Line 314:76-81: `BooleanLiteral` → `true`
321. **Mutant #1405** - Line 317:42-3: `BlockStatement` → `{}`
322. **Mutant #1406** - Line 318:22-63: `StringLiteral` → ````
323. **Mutant #1407** - Line 318:35-44: `ArithmeticOperator` → `index - 1`
324. **Mutant #1408** - Line 320:3-74: `AssignmentOperator` → `html -= renderSection(`image-${img.id}`, imageTitle, imageReport, true)`
325. **Mutant #1409** - Line 320:25-42: `StringLiteral` → ````
326. **Mutant #1410** - Line 320:69-73: `BooleanLiteral` → `false`
327. **Mutant #1411** - Line 329:46-2: `BlockStatement` → `{}`
328. **Mutant #1412** - Line 331:25-81: `MethodExpression` → `session.images`
329. **Mutant #1413** - Line 331:47-80: `ArrowFunction` → `() => undefined`
330. **Mutant #1414** - Line 331:54-80: `ConditionalExpression` → `true`
331. **Mutant #1415** - Line 331:54-80: `ConditionalExpression` → `false`
332. **Mutant #1416** - Line 331:54-80: `EqualityOperator` → `img.status !== 'completed'`
333. **Mutant #1417** - Line 331:69-80: `StringLiteral` → `""`
334. **Mutant #1418** - Line 332:21-73: `MethodExpression` → `session.images`
335. **Mutant #1419** - Line 332:43-72: `ArrowFunction` → `() => undefined`
336. **Mutant #1420** - Line 332:50-72: `ConditionalExpression` → `true`
337. **Mutant #1421** - Line 332:50-72: `ConditionalExpression` → `false`
338. **Mutant #1422** - Line 332:50-72: `EqualityOperator` → `img.status !== 'error'`
339. **Mutant #1423** - Line 332:65-72: `StringLiteral` → `""`
340. **Mutant #1424** - Line 334:13-133: `StringLiteral` → `""`
341. **Mutant #1425** - Line 337:10-3: `StringLiteral` → ````
342. **Mutant #1426** - Line 341:6-20: `ConditionalExpression` → `true`
343. **Mutant #1427** - Line 341:6-20: `ConditionalExpression` → `false`
344. **Mutant #1428** - Line 341:6-20: `EqualityOperator` → `errorCount >= 0`
345. **Mutant #1429** - Line 341:6-20: `EqualityOperator` → `errorCount <= 0`
346. **Mutant #1430** - Line 341:23-111: `StringLiteral` → ````
347. **Mutant #1431** - Line 341:114-116: `StringLiteral` → `"Stryker was here!"`
348. **Mutant #1432** - Line 349:52-122: `ArithmeticOperator` → `agg.safetyIssues.high + agg.safetyIssues.medium - agg.safetyIssues.low`
349. **Mutant #1433** - Line 349:52-99: `ArithmeticOperator` → `agg.safetyIssues.high - agg.safetyIssues.medium`
350. **Mutant #1434** - Line 357:10-18: `StringLiteral` → `""`
351. **Mutant #1435** - Line 360:6-49: `ConditionalExpression` → `true`
352. **Mutant #1436** - Line 360:6-49: `ConditionalExpression` → `false`
353. **Mutant #1437** - Line 360:6-49: `LogicalOperator` → `agg.imageStats || agg.imageStats.length > 0`
354. **Mutant #1438** - Line 360:24-49: `ConditionalExpression` → `true`
355. **Mutant #1439** - Line 360:24-49: `EqualityOperator` → `agg.imageStats.length >= 0`
356. **Mutant #1440** - Line 360:24-49: `EqualityOperator` → `agg.imageStats.length <= 0`
357. **Mutant #1441** - Line 360:51-3: `BlockStatement` → `{}`
358. **Mutant #1442** - Line 361:11-96: `StringLiteral` → `""`
359. **Mutant #1443** - Line 362:11-111: `StringLiteral` → `""`
360. **Mutant #1444** - Line 364:36-4: `BlockStatement` → `{}`
361. **Mutant #1445** - Line 365:22-47: `ConditionalExpression` → `true`
362. **Mutant #1446** - Line 365:22-47: `ConditionalExpression` → `false`
363. **Mutant #1447** - Line 365:22-47: `EqualityOperator` → `stat.safetyIssueCount >= 0`
364. **Mutant #1448** - Line 365:22-47: `EqualityOperator` → `stat.safetyIssueCount <= 0`
365. **Mutant #1449** - Line 366:36-45: `StringLiteral` → `""`
366. **Mutant #1450** - Line 366:48-57: `StringLiteral` → `""`
367. **Mutant #1451** - Line 368:12-5: `StringLiteral` → ````
368. **Mutant #1452** - Line 372:20-91: `StringLiteral` → ````
369. **Mutant #1453** - Line 372:94-96: `StringLiteral` → `"Stryker was here!"`
370. **Mutant #1454** - Line 373:8-34: `ConditionalExpression` → `true`
371. **Mutant #1455** - Line 373:8-34: `ConditionalExpression` → `false`
372. **Mutant #1456** - Line 373:8-34: `EqualityOperator` → `stat.progressItemCount >= 0`
373. **Mutant #1457** - Line 373:8-34: `EqualityOperator` → `stat.progressItemCount <= 0`
374. **Mutant #1458** - Line 373:37-111: `StringLiteral` → ````
375. **Mutant #1459** - Line 373:114-116: `StringLiteral` → `"Stryker was here!"`
376. **Mutant #1460** - Line 378:11-19: `StringLiteral` → `""`
377. **Mutant #1461** - Line 382:6-57: `ConditionalExpression` → `true`
378. **Mutant #1462** - Line 382:6-57: `ConditionalExpression` → `false`
379. **Mutant #1463** - Line 382:6-57: `LogicalOperator` → `agg.categoryCounts || agg.categoryCounts.length > 0`
380. **Mutant #1464** - Line 382:28-57: `ConditionalExpression` → `true`
381. **Mutant #1465** - Line 382:28-57: `EqualityOperator` → `agg.categoryCounts.length >= 0`
382. **Mutant #1466** - Line 382:28-57: `EqualityOperator` → `agg.categoryCounts.length <= 0`
383. **Mutant #1467** - Line 382:59-3: `BlockStatement` → `{}`
384. **Mutant #1468** - Line 383:11-102: `StringLiteral` → `""`
385. **Mutant #1469** - Line 384:3-88: `AssignmentOperator` → `html -= renderAggregates({
  countsByCategory: agg.categoryCounts,
  countsByLabel: []
})`
386. **Mutant #1470** - Line 384:28-87: `ObjectLiteral` → `{}`
387. **Mutant #1471** - Line 384:83-85: `ArrayDeclaration` → `["Stryker was here"]`
388. **Mutant #1472** - Line 393:33-2: `BlockStatement` → `{}`
389. **Mutant #1473** - Line 394:9-3: `StringLiteral` → ````
390. **Mutant #1474** - Line 409:39-2: `BlockStatement` → `{}`
391. **Mutant #1475** - Line 410:21-41: `ConditionalExpression` → `true`
392. **Mutant #1476** - Line 410:21-41: `ConditionalExpression` → `false`
393. **Mutant #1477** - Line 410:21-41: `LogicalOperator` → `img.detections && []`
394. **Mutant #1478** - Line 410:39-41: `ArrayDeclaration` → `["Stryker was here"]`
395. **Mutant #1479** - Line 411:19-56: `ConditionalExpression` → `true`
396. **Mutant #1480** - Line 411:19-56: `ConditionalExpression` → `false`
397. **Mutant #1481** - Line 411:19-56: `LogicalOperator` → `img.parsedData?.global_insights && []`
398. **Mutant #1482** - Line 411:19-50: `OptionalChaining` → `img.parsedData.global_insights`
399. **Mutant #1483** - Line 411:54-56: `ArrayDeclaration` → `["Stryker was here"]`
400. **Mutant #1484** - Line 413:23-76: `MethodExpression` → `detections`
401. **Mutant #1485** - Line 413:41-75: `ArrowFunction` → `() => undefined`
402. **Mutant #1486** - Line 413:46-75: `ConditionalExpression` → `true`
403. **Mutant #1487** - Line 413:46-75: `ConditionalExpression` → `false`
404. **Mutant #1488** - Line 413:46-75: `EqualityOperator` → `d.category !== 'safety_issue'`
405. **Mutant #1489** - Line 413:61-75: `StringLiteral` → `""`
406. **Mutant #1490** - Line 414:24-87: `MethodExpression` → `detections`
407. **Mutant #1491** - Line 414:42-86: `ArrowFunction` → `() => undefined`
408. **Mutant #1492** - Line 414:47-86: `ConditionalExpression` → `true`
409. **Mutant #1493** - Line 414:47-86: `ConditionalExpression` → `false`
410. **Mutant #1494** - Line 414:47-86: `LogicalOperator` → `d.category === 'progress' || d.progress`
411. **Mutant #1495** - Line 414:47-72: `ConditionalExpression` → `true`
412. **Mutant #1496** - Line 414:47-72: `EqualityOperator` → `d.category !== 'progress'`
413. **Mutant #1497** - Line 414:62-72: `StringLiteral` → `""`
414. **Mutant #1498** - Line 415:27-74: `MethodExpression` → `insights`
415. **Mutant #1499** - Line 415:43-73: `ArrowFunction` → `() => undefined`
416. **Mutant #1500** - Line 415:48-73: `ConditionalExpression` → `true`
417. **Mutant #1501** - Line 415:48-73: `ConditionalExpression` → `false`
418. **Mutant #1502** - Line 415:48-73: `EqualityOperator` → `i.category !== 'progress'`
419. **Mutant #1503** - Line 415:63-73: `StringLiteral` → `""`
420. **Mutant #1504** - Line 417:13-15: `StringLiteral` → `"Stryker was here!"`
421. **Mutant #1505** - Line 420:6-29: `ConditionalExpression` → `true`
422. **Mutant #1506** - Line 420:6-29: `ConditionalExpression` → `false`
423. **Mutant #1507** - Line 420:6-29: `EqualityOperator` → `safetyIssues.length >= 0`
424. **Mutant #1508** - Line 420:6-29: `EqualityOperator` → `safetyIssues.length <= 0`
425. **Mutant #1509** - Line 420:31-3: `BlockStatement` → `{}`
426. **Mutant #1510** - Line 421:11-91: `StringLiteral` → `""`
427. **Mutant #1511** - Line 422:3-42: `AssignmentOperator` → `html -= renderSafetyCards(safetyIssues)`
428. **Mutant #1512** - Line 426:6-61: `ConditionalExpression` → `true`
429. **Mutant #1513** - Line 426:6-61: `ConditionalExpression` → `false`
430. **Mutant #1514** - Line 426:6-61: `LogicalOperator` → `progressItems.length > 0 && progressInsights.length > 0`
431. **Mutant #1515** - Line 426:6-30: `ConditionalExpression` → `false`
432. **Mutant #1516** - Line 426:6-30: `EqualityOperator` → `progressItems.length >= 0`
433. **Mutant #1517** - Line 426:6-30: `EqualityOperator` → `progressItems.length <= 0`
434. **Mutant #1518** - Line 426:34-61: `ConditionalExpression` → `false`
435. **Mutant #1519** - Line 426:34-61: `EqualityOperator` → `progressInsights.length >= 0`
436. **Mutant #1520** - Line 426:34-61: `EqualityOperator` → `progressInsights.length <= 0`
437. **Mutant #1521** - Line 426:63-3: `BlockStatement` → `{}`
438. **Mutant #1522** - Line 427:11-89: `StringLiteral` → `""`
439. **Mutant #1523** - Line 428:3-65: `AssignmentOperator` → `html -= renderProgressSection(progressItems, progressInsights)`
440. **Mutant #1524** - Line 432:6-27: `ConditionalExpression` → `true`
441. **Mutant #1525** - Line 432:6-27: `ConditionalExpression` → `false`
442. **Mutant #1526** - Line 432:6-27: `EqualityOperator` → `detections.length >= 0`
443. **Mutant #1527** - Line 432:6-27: `EqualityOperator` → `detections.length <= 0`
444. **Mutant #1528** - Line 432:29-3: `BlockStatement` → `{}`
445. **Mutant #1529** - Line 433:11-95: `StringLiteral` → `""`
446. **Mutant #1530** - Line 434:3-43: `AssignmentOperator` → `html -= renderDetectionCards(detections)`
447. **Mutant #1531** - Line 443:88-2: `BlockStatement` → `{}`
448. **Mutant #1532** - Line 445:35-51: `StringLiteral` → `""`
449. **Mutant #1533** - Line 445:71-3: `BlockStatement` → `{}`
450. **Mutant #1534** - Line 446:27-34: `StringLiteral` → `""`
451. **Mutant #1535** - Line 446:42-4: `BlockStatement` → `{}`
452. **Mutant #1536** - Line 448:50-94: `StringLiteral` → ````
453. **Mutant #1537** - Line 450:28-39: `StringLiteral` → `""`
454. **Mutant #1538** - Line 451:29-37: `StringLiteral` → `""`
455. **Mutant #1539** - Line 456:35-56: `StringLiteral` → `""`
456. **Mutant #1540** - Line 456:74-3: `BlockStatement` → `{}`
457. **Mutant #1541** - Line 458:37-62: `ArrowFunction` → `() => undefined`
458. **Mutant #1542** - Line 458:42-62: `ConditionalExpression` → `true`
459. **Mutant #1543** - Line 458:42-62: `ConditionalExpression` → `false`
460. **Mutant #1544** - Line 458:42-62: `EqualityOperator` → `d.id !== detectionId`
461. **Mutant #1545** - Line 460:7-16: `ConditionalExpression` → `true`
462. **Mutant #1546** - Line 460:7-16: `ConditionalExpression` → `false`
463. **Mutant #1547** - Line 460:18-4: `BlockStatement` → `{}`
464. **Mutant #1548** - Line 461:26-38: `StringLiteral` → `""`
465. **Mutant #1549** - Line 461:46-5: `BlockStatement` → `{}`
466. **Mutant #1550** - Line 462:24-35: `StringLiteral` → `""`
467. **Mutant #1551** - Line 466:26-38: `StringLiteral` → `""`
468. **Mutant #1552** - Line 466:46-5: `BlockStatement` → `{}`
469. **Mutant #1553** - Line 467:27-38: `StringLiteral` → `""`

#### ✅ Successfully Killed Mutants Summary

- **26 mutants killed** by tests
- **Average tests per mutant**: 1.0
- **Most effective test**: 79 (killed 12 mutants)
- **Top mutator types killed**: ConditionalExpression, LogicalOperator, ArithmeticOperator

---

### 🟢 src/session.js

**Overall Health**: 🟢 Excellent | **Mutation Score**: 82.6% | **Coverage**: 94.3%

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Killed | 123 | 77.8% |
| ❌ Survived | 26 | 16.5% |
| 🚫 No Coverage | 9 | 5.7% |
| **Total** | **158** | **100%** |

#### 📄 Source Code with Mutation Analysis

```javascript
  1| /**
  2|  * Session management for multi-image analysis
  3|  */
  4| 
  5| /**
  6|  * Create a new analysis session
  7|  * @param {File[]} files - Array of image files (max 20)
  8|  * @returns {object} Initial session state
  9|  */
 10| export function createSession(files) {
   ✅ #1554: BlockStatement → "{}" [2 tests]
 11| 	const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
   ✅ #1556: MethodExpression → "Math.random().toString(36)" [2 tests]
   ✅ #1555: StringLiteral → "``" [2 tests]
 12| 	
 13| 	const images = files.map((file, index) => ({
   ✅ #1557: ArrowFunction → "() => undefined" [2 tests]
   ✅ #1558: ObjectLiteral → "{}" [2 tests]
 14| 		id: `img_${index}_${file.name.replace(/[^a-zA-Z0-9]/g, '_')}`,
   ❌ #1560: Regex → "/[a-zA-Z0-9]/g" [2 tests]
   ✅ #1559: StringLiteral → "``" [2 tests]
   ❌ #1561: StringLiteral → """" [2 tests]
 15| 		file,
 16| 		filename: file.name,
 17| 		status: 'queued',
   ✅ #1562: StringLiteral → """" [2 tests]
 18| 		bitmap: null,
 19| 		naturalWidth: 0,
 20| 		naturalHeight: 0,
 21| 		parsedData: null,
 22| 		detections: [],
   ❌ #1563: ArrayDeclaration → "["Stryker was here"]" [2 tests]
 23| 		error: null
 24| 	}));
 25| 
 26| 	return {
   ✅ #1564: ObjectLiteral → "{}" [2 tests]
 27| 		sessionId,
 28| 		status: 'analyzing',
   ✅ #1565: StringLiteral → """" [2 tests]
 29| 		images,
 30| 		activeImageIndex: 0,
 31| 		sessionAggregates: null
 32| 	};
 33| }
 34| 
 35| /**
 36|  * Calculate session-level aggregates from all completed images
 37|  * @param {object} session - Session state
 38|  * @returns {object} Aggregated statistics
 39|  */
 40| export function calculateSessionAggregates(session) {
   ✅ #1566: BlockStatement → "{}" [3 tests]
 41| 	const completedImages = session.images.filter(img => img.status === 'completed');
   ✅ #1567: MethodExpression → "session.images" [3 tests]
   ✅ #1569: ConditionalExpression → "true" [3 tests]
   ✅ #1568: ArrowFunction → "() => undefined" [3 tests]
   ✅ #1570: ConditionalExpression → "false" [3 tests]
   ✅ #1571: EqualityOperator → "img.status !== 'completed'" [3 tests]
   ✅ #1572: StringLiteral → """" [3 tests]
 42| 	
 43| 	let totalDetections = 0;
 44| 	const safetyIssues = { high: 0, medium: 0, low: 0 };
   ✅ #1573: ObjectLiteral → "{}" [3 tests]
 45| 	const categoryCounts = {};
 46| 	const labelCounts = {};
 47| 	const imageStats = [];
   ✅ #1574: ArrayDeclaration → "["Stryker was here"]" [3 tests]
 48| 
 49| 	completedImages.forEach(img => {
   ✅ #1575: BlockStatement → "{}" [3 tests]
 50| 		const detections = img.detections || [];
   🚫 #1579: ArrayDeclaration → "["Stryker was here"]" [0 tests]
   ✅ #1577: ConditionalExpression → "false" [3 tests]
   ✅ #1576: ConditionalExpression → "true" [3 tests]
   ✅ #1578: LogicalOperator → "img.detections && []" [3 tests]
 51| 		totalDetections += detections.length;
   ✅ #1580: AssignmentOperator → "totalDetections -= detections.length" [3 tests]
 52| 
 53| 		// Per-image stats
 54| 		const imgSafetyCount = detections.filter(d => d.category === 'safety_issue').length;
   ❌ #1581: MethodExpression → "detections" [3 tests]
   ❌ #1582: ArrowFunction → "() => undefined" [3 tests]
   ❌ #1583: ConditionalExpression → "true" [2 tests]
   ❌ #1585: EqualityOperator → "d.category !== 'safety_issue'" [2 tests]
   ❌ #1584: ConditionalExpression → "false" [2 tests]
   ❌ #1586: StringLiteral → """" [2 tests]
 55| 		const imgProgressCount = detections.filter(d => d.category === 'progress').length;
   ❌ #1587: MethodExpression → "detections" [3 tests]
   ❌ #1589: ConditionalExpression → "true" [2 tests]
   ❌ #1588: ArrowFunction → "() => undefined" [3 tests]
   ❌ #1590: ConditionalExpression → "false" [2 tests]
   ❌ #1591: EqualityOperator → "d.category !== 'progress'" [2 tests]
   ❌ #1592: StringLiteral → """" [2 tests]
 56| 		
 57| 		imageStats.push({
   ❌ #1593: ObjectLiteral → "{}" [3 tests]
 58| 			imageId: img.id,
 59| 			filename: img.filename,
 60| 			detectionCount: detections.length,
 61| 			safetyIssueCount: imgSafetyCount,
 62| 			progressItemCount: imgProgressCount,
 63| 			status: img.status
 64| 		});
 65| 
 66| 		// Aggregate detections
 67| 		detections.forEach(det => {
   ✅ #1594: BlockStatement → "{}" [2 tests]
 68| 			const category = det.category || 'other';
   🚫 #1598: StringLiteral → """" [0 tests]
   ✅ #1595: ConditionalExpression → "true" [2 tests]
   ✅ #1596: ConditionalExpression → "false" [2 tests]
   ✅ #1597: LogicalOperator → "det.category && 'other'" [2 tests]
 69| 			const label = det.label || 'unknown';
   🚫 #1602: StringLiteral → """" [0 tests]
   ✅ #1599: ConditionalExpression → "true" [2 tests]
   ✅ #1600: ConditionalExpression → "false" [2 tests]
   ✅ #1601: LogicalOperator → "det.label && 'unknown'" [2 tests]
 70| 
 71| 			// Category counts
 72| 			categoryCounts[category] = (categoryCounts[category] || 0) + 1;
   ✅ #1603: ArithmeticOperator → "(categoryCounts[category] || 0) - 1" [2 tests]
   ✅ #1604: ConditionalExpression → "true" [2 tests]
   ✅ #1605: ConditionalExpression → "false" [2 tests]
   ✅ #1606: LogicalOperator → "categoryCounts[category] && 0" [2 tests]
 73| 
 74| 			// Label counts
 75| 			labelCounts[label] = (labelCounts[label] || 0) + 1;
   ✅ #1607: ArithmeticOperator → "(labelCounts[label] || 0) - 1" [2 tests]
   ✅ #1608: ConditionalExpression → "true" [2 tests]
   ✅ #1609: ConditionalExpression → "false" [2 tests]
   ✅ #1610: LogicalOperator → "labelCounts[label] && 0" [2 tests]
 76| 
 77| 			// Safety severity counts
 78| 			if (det.category === 'safety_issue' && det.safety?.severity) {
   ❌ #1613: LogicalOperator → "det.category === 'safety_issue' || det.safety?.severity" [2 tests]
   ✅ #1612: ConditionalExpression → "false" [2 tests]
   ✅ #1611: ConditionalExpression → "true" [2 tests]
   ❌ #1614: ConditionalExpression → "true" [2 tests]
   ❌ #1617: OptionalChaining → "det.safety.severity" [1 tests]
   ✅ #1616: StringLiteral → """" [2 tests]
   ✅ #1615: EqualityOperator → "det.category !== 'safety_issue'" [2 tests]
   ✅ #1618: BlockStatement → "{}" [1 tests]
 79| 				const severity = det.safety.severity.toLowerCase();
   ✅ #1619: MethodExpression → "det.safety.severity.toUpperCase()" [1 tests]
 80| 				if (severity === 'high' || severity === 'medium' || severity === 'low') {
   🚫 #1628: ConditionalExpression → "false" [0 tests]
   🚫 #1629: EqualityOperator → "severity !== 'medium'" [0 tests]
   🚫 #1630: StringLiteral → """" [0 tests]
   🚫 #1631: ConditionalExpression → "false" [0 tests]
   🚫 #1632: EqualityOperator → "severity !== 'low'" [0 tests]
   🚫 #1633: StringLiteral → """" [0 tests]
   ❌ #1620: ConditionalExpression → "true" [1 tests]
   ✅ #1621: ConditionalExpression → "false" [1 tests]
   ✅ #1622: LogicalOperator → "(severity === 'high' || severity === 'medium') && severity === 'low'" [1 tests]
   ✅ #1623: ConditionalExpression → "false" [1 tests]
   ✅ #1624: LogicalOperator → "severity === 'high' && severity === 'medium'" [1 tests]
   ✅ #1625: ConditionalExpression → "false" [1 tests]
   ✅ #1626: EqualityOperator → "severity !== 'high'" [1 tests]
   ✅ #1634: BlockStatement → "{}" [1 tests]
   ✅ #1627: StringLiteral → """" [1 tests]
 81| 					safetyIssues[severity]++;
   ✅ #1635: UpdateOperator → "safetyIssues[severity]--" [1 tests]
 82| 				}
 83| 			}
 84| 		});
 85| 	});
 86| 
 87| 	return {
   ✅ #1636: ObjectLiteral → "{}" [3 tests]
 88| 		totalDetections,
 89| 		safetyIssues,
 90| 		categoryCounts: Object.entries(categoryCounts)
   ❌ #1637: MethodExpression → "Object.entries(categoryCounts).map(([category, count]) => ({
  category,
  count
}))" [3 tests]
 91| 			.map(([category, count]) => ({ category, count }))
   ✅ #1638: ArrowFunction → "() => undefined" [3 tests]
   ✅ #1639: ObjectLiteral → "{}" [2 tests]
 92| 			.sort((a, b) => b.count - a.count),
   ❌ #1640: ArrowFunction → "() => undefined" [3 tests]
   ❌ #1641: ArithmeticOperator → "b.count + a.count" [1 tests]
 93| 		labelCounts: Object.entries(labelCounts)
   ❌ #1642: MethodExpression → "Object.entries(labelCounts).map(([label, count]) => ({
  label,
  count
}))" [3 tests]
 94| 			.map(([label, count]) => ({ label, count }))
   ✅ #1643: ArrowFunction → "() => undefined" [3 tests]
   ✅ #1644: ObjectLiteral → "{}" [2 tests]
 95| 			.sort((a, b) => b.count - a.count),
   ❌ #1646: ArithmeticOperator → "b.count + a.count" [1 tests]
   ❌ #1645: ArrowFunction → "() => undefined" [3 tests]
 96| 		imageStats
 97| 	};
 98| }
 99| 
100| /**
101|  * Update session status based on image states
102|  * @param {object} session - Session state
103|  * @returns {string} Updated status
104|  */
105| export function updateSessionStatus(session) {
   ✅ #1647: BlockStatement → "{}" [4 tests]
106| 	const statuses = session.images.map(img => img.status);
   ✅ #1648: ArrowFunction → "() => undefined" [4 tests]
107| 	const allDone = statuses.every(s => s === 'completed' || s === 'error');
   ✅ #1649: MethodExpression → "statuses.some(s => s === 'completed' || s === 'error')" [4 tests]
   ✅ #1650: ArrowFunction → "() => undefined" [4 tests]
   ✅ #1651: ConditionalExpression → "true" [4 tests]
   ✅ #1654: ConditionalExpression → "false" [4 tests]
   ✅ #1653: LogicalOperator → "s === 'completed' && s === 'error'" [4 tests]
   ✅ #1655: EqualityOperator → "s !== 'completed'" [4 tests]
   ✅ #1652: ConditionalExpression → "false" [4 tests]
   ✅ #1656: StringLiteral → """" [4 tests]
   ✅ #1657: ConditionalExpression → "false" [3 tests]
   ✅ #1658: EqualityOperator → "s !== 'error'" [3 tests]
   ✅ #1659: StringLiteral → """" [3 tests]
108| 	const anyError = statuses.some(s => s === 'error');
   ✅ #1661: ArrowFunction → "() => undefined" [4 tests]
   ✅ #1660: MethodExpression → "statuses.every(s => s === 'error')" [4 tests]
   ✅ #1663: ConditionalExpression → "false" [4 tests]
   ✅ #1662: ConditionalExpression → "true" [4 tests]
   ✅ #1664: EqualityOperator → "s !== 'error'" [4 tests]
   ✅ #1665: StringLiteral → """" [4 tests]
109| 	const anyCompleted = statuses.some(s => s === 'completed');
   ✅ #1667: ArrowFunction → "() => undefined" [4 tests]
   ✅ #1666: MethodExpression → "statuses.every(s => s === 'completed')" [4 tests]
   ✅ #1668: ConditionalExpression → "true" [4 tests]
   ✅ #1669: ConditionalExpression → "false" [4 tests]
   ✅ #1670: EqualityOperator → "s !== 'completed'" [4 tests]
   ✅ #1671: StringLiteral → """" [4 tests]
110| 
111| 	if (allDone) {
   ✅ #1672: ConditionalExpression → "true" [4 tests]
   ✅ #1674: BlockStatement → "{}" [3 tests]
   ✅ #1673: ConditionalExpression → "false" [4 tests]
112| 		return anyError && anyCompleted ? 'partial_failure' : anyError ? 'error' : 'completed';
   ✅ #1675: ConditionalExpression → "true" [3 tests]
   ✅ #1676: ConditionalExpression → "false" [3 tests]
   ✅ #1677: LogicalOperator → "anyError || anyCompleted" [3 tests]
   ✅ #1678: StringLiteral → """" [1 tests]
   ✅ #1679: StringLiteral → """" [1 tests]
   ✅ #1680: StringLiteral → """" [1 tests]
113| 	}
114| 	return 'analyzing';
   ✅ #1681: StringLiteral → """" [1 tests]
115| }
116| 
117| /**
118|  * Get progress metrics for the session
119|  * @param {object} session - Session state
120|  * @returns {object} Progress information
121|  */
122| export function getSessionProgress(session) {
   ✅ #1682: BlockStatement → "{}" [1 tests]
123| 	const total = session.images.length;
124| 	const completed = session.images.filter(img => img.status === 'completed').length;
   ✅ #1683: MethodExpression → "session.images" [1 tests]
   ✅ #1685: ConditionalExpression → "true" [1 tests]
   ✅ #1684: ArrowFunction → "() => undefined" [1 tests]
   ✅ #1687: EqualityOperator → "img.status !== 'completed'" [1 tests]
   ✅ #1686: ConditionalExpression → "false" [1 tests]
   ✅ #1688: StringLiteral → """" [1 tests]
125| 	const error = session.images.filter(img => img.status === 'error').length;
   ✅ #1689: MethodExpression → "session.images" [1 tests]
   ✅ #1690: ArrowFunction → "() => undefined" [1 tests]
   ✅ #1691: ConditionalExpression → "true" [1 tests]
   ✅ #1693: EqualityOperator → "img.status !== 'error'" [1 tests]
   ✅ #1692: ConditionalExpression → "false" [1 tests]
   ✅ #1694: StringLiteral → """" [1 tests]
126| 	const analyzing = session.images.filter(img => img.status === 'analyzing').length;
   ✅ #1695: MethodExpression → "session.images" [1 tests]
   ✅ #1696: ArrowFunction → "() => undefined" [1 tests]
   ✅ #1697: ConditionalExpression → "true" [1 tests]
   ✅ #1698: ConditionalExpression → "false" [1 tests]
   ✅ #1699: EqualityOperator → "img.status !== 'analyzing'" [1 tests]
   ✅ #1700: StringLiteral → """" [1 tests]
127| 	const queued = session.images.filter(img => img.status === 'queued').length;
   ✅ #1701: MethodExpression → "session.images" [1 tests]
   ✅ #1703: ConditionalExpression → "true" [1 tests]
   ✅ #1702: ArrowFunction → "() => undefined" [1 tests]
   ✅ #1705: EqualityOperator → "img.status !== 'queued'" [1 tests]
   ✅ #1706: StringLiteral → """" [1 tests]
   ✅ #1704: ConditionalExpression → "false" [1 tests]
128| 
129| 	return {
   ✅ #1707: ObjectLiteral → "{}" [1 tests]
130| 		total,
131| 		completed,
132| 		error,
133| 		analyzing,
134| 		queued,
135| 		done: completed + error,
   ✅ #1708: ArithmeticOperator → "completed - error" [1 tests]
136| 		percentage: Math.round(((completed + error) / total) * 100)
   ✅ #1709: ArithmeticOperator → "(completed + error) / total / 100" [1 tests]
   ✅ #1710: ArithmeticOperator → "(completed + error) * total" [1 tests]
   ✅ #1711: ArithmeticOperator → "completed - error" [1 tests]
137| 	};
138| }
139| 
```

#### ❌ Critical Survived Mutants (First 10)

1. **Mutant #1560** - Line 14:41-56
   - **Mutator**: `Regex` → `/[a-zA-Z0-9]/g`
   - **Issue**: Unknown
   - **Fix**: Add specific test cases to kill this mutant
   - **Tests that should have caught this**: 63, 64

2. **Mutant #1561** - Line 14:58-61
   - **Mutator**: `StringLiteral` → `""`
   - **Issue**: Unknown
   - **Fix**: Test with different string values including empty strings
   - **Tests that should have caught this**: 63, 64

3. **Mutant #1563** - Line 22:15-17
   - **Mutator**: `ArrayDeclaration` → `["Stryker was here"]`
   - **Issue**: Unknown
   - **Fix**: Add specific test cases to kill this mutant
   - **Tests that should have caught this**: 63, 64

4. **Mutant #1581** - Line 54:26-79
   - **Mutator**: `MethodExpression` → `detections`
   - **Issue**: Unknown
   - **Fix**: Mock and verify method calls with different inputs
   - **Tests that should have caught this**: 65, 66, 67

5. **Mutant #1582** - Line 54:44-78
   - **Mutator**: `ArrowFunction` → `() => undefined`
   - **Issue**: Unknown
   - **Fix**: Add specific test cases to kill this mutant
   - **Tests that should have caught this**: 65, 66, 67

6. **Mutant #1583** - Line 54:49-78
   - **Mutator**: `ConditionalExpression` → `true`
   - **Issue**: Unknown
   - **Fix**: Add test cases for both true/false conditions
   - **Tests that should have caught this**: 65, 66

7. **Mutant #1585** - Line 54:49-78
   - **Mutator**: `EqualityOperator` → `d.category !== 'safety_issue'`
   - **Issue**: Unknown
   - **Fix**: Test boundary conditions and edge cases
   - **Tests that should have caught this**: 65, 66

8. **Mutant #1584** - Line 54:49-78
   - **Mutator**: `ConditionalExpression` → `false`
   - **Issue**: Unknown
   - **Fix**: Add test cases for both true/false conditions
   - **Tests that should have caught this**: 65, 66

9. **Mutant #1586** - Line 54:64-78
   - **Mutator**: `StringLiteral` → `""`
   - **Issue**: Unknown
   - **Fix**: Test with different string values including empty strings
   - **Tests that should have caught this**: 65, 66

10. **Mutant #1587** - Line 55:28-77
   - **Mutator**: `MethodExpression` → `detections`
   - **Issue**: Unknown
   - **Fix**: Mock and verify method calls with different inputs
   - **Tests that should have caught this**: 65, 66, 67

#### 🚫 Coverage Gaps Summary

- **9 uncovered mutants** across 4 lines
- **Most affected lines**: 50, 68, 69, 80
- **Common uncovered operations**: StringLiteral, ConditionalExpression, EqualityOperator

##### Detailed No Coverage Mutants:
1. **Mutant #1579** - Line 50:40-42: `ArrayDeclaration` → `["Stryker was here"]`
2. **Mutant #1598** - Line 68:37-44: `StringLiteral` → `""`
3. **Mutant #1602** - Line 69:31-40: `StringLiteral` → `""`
4. **Mutant #1628** - Line 80:32-53: `ConditionalExpression` → `false`
5. **Mutant #1629** - Line 80:32-53: `EqualityOperator` → `severity !== 'medium'`
6. **Mutant #1630** - Line 80:45-53: `StringLiteral` → `""`
7. **Mutant #1631** - Line 80:57-75: `ConditionalExpression` → `false`
8. **Mutant #1632** - Line 80:57-75: `EqualityOperator` → `severity !== 'low'`
9. **Mutant #1633** - Line 80:70-75: `StringLiteral` → `""`

#### ✅ Successfully Killed Mutants Summary

- **123 mutants killed** by tests
- **Average tests per mutant**: 1.0
- **Most effective test**: 65 (killed 47 mutants)
- **Top mutator types killed**: ConditionalExpression, StringLiteral, ArrowFunction

---

### 🟢 src/math.js

**Overall Health**: 🟢 Excellent | **Mutation Score**: 100.0% | **Coverage**: 100.0%

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Killed | 6 | 100.0% |
| ❌ Survived | 0 | 0.0% |
| 🚫 No Coverage | 0 | 0.0% |
| **Total** | **6** | **100%** |

#### 📄 Source Code with Mutation Analysis

```javascript
  1| export function clamp(n, min, max) {
   ✅ #1050: BlockStatement → "{}" [8 tests]
  2| 	if (!Number.isFinite(n)) return min;
   ✅ #1053: ConditionalExpression → "false" [8 tests]
   ✅ #1051: BooleanLiteral → "Number.isFinite(n)" [8 tests]
   ✅ #1052: ConditionalExpression → "true" [8 tests]
  3| 	return Math.max(min, Math.min(max, n));
   ✅ #1054: MethodExpression → "Math.min(min, Math.min(max, n))" [8 tests]
   ✅ #1055: MethodExpression → "Math.max(max, n)" [8 tests]
  4| }
  5| 
```

#### ✅ Successfully Killed Mutants Summary

- **6 mutants killed** by tests
- **Average tests per mutant**: 1.0
- **Most effective test**: 43 (killed 5 mutants)
- **Top mutator types killed**: ConditionalExpression, MethodExpression, BlockStatement

---

### 🟢 src/ui-utils.js

**Overall Health**: 🟢 Excellent | **Mutation Score**: 89.5% | **Coverage**: 100.0%

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Killed | 136 | 89.5% |
| ❌ Survived | 16 | 10.5% |
| 🚫 No Coverage | 0 | 0.0% |
| **Total** | **152** | **100%** |

#### 📄 Source Code with Mutation Analysis

```javascript
  1| /**
  2|  * Pure utility functions extracted from UI code for testability.
  3|  */
  4| 
  5| /**
  6|  * Map detection category to color for visualization.
  7|  * @param {string} cat - Category name
  8|  * @returns {string} Hex color code
  9|  */
 10| export function colorForCategory(cat) {
   ✅ #1712: BlockStatement → "{}" [5 tests]
 11| 	switch (cat) {
 12| 		case 'safety_issue': return '#ff5b5b';
   ✅ #1715: StringLiteral → """" [1 tests]
   ✅ #1714: StringLiteral → """" [5 tests]
   ✅ #1713: ConditionalExpression → "case 'safety_issue':" [1 tests]
 13| 		case 'facility_asset': return '#5bd1ff';
   ✅ #1716: ConditionalExpression → "case 'facility_asset':" [1 tests]
   ✅ #1718: StringLiteral → """" [1 tests]
   ✅ #1717: StringLiteral → """" [4 tests]
 14| 		case 'progress': return '#a1ff5b';
   ✅ #1719: ConditionalExpression → "case 'progress':" [1 tests]
   ✅ #1720: StringLiteral → """" [3 tests]
   ✅ #1721: StringLiteral → """" [1 tests]
 15| 		case 'object': return '#ffd05b';
   ✅ #1722: ConditionalExpression → "case 'object':" [1 tests]
   ✅ #1723: StringLiteral → """" [2 tests]
   ✅ #1724: StringLiteral → """" [1 tests]
 16| 		default: return '#cccccc';
   ✅ #1725: ConditionalExpression → "default:" [1 tests]
   ✅ #1726: StringLiteral → """" [1 tests]
 17| 	}
 18| }
 19| 
 20| /**
 21|  * Extract and parse JSON from Gemini API response.
 22|  * Handles both clean JSON and JSON wrapped in markdown code blocks.
 23|  * @param {object} resp - Gemini API response object
 24|  * @returns {object} Parsed JSON data
 25|  * @throws {Error} If no text JSON found or JSON is invalid
 26|  */
 27| export function extractJSONFromResponse(resp) {
   ✅ #1727: BlockStatement → "{}" [8 tests]
 28| 	// Expect JSON as text in first candidate part
 29| 	const c = resp?.candidates?.[0];
   ✅ #1728: OptionalChaining → "resp?.candidates[0]" [8 tests]
   ❌ #1729: OptionalChaining → "resp.candidates" [8 tests]
 30| 	const parts = c?.content?.parts || [];
   ✅ #1730: ConditionalExpression → "true" [8 tests]
   ✅ #1731: ConditionalExpression → "false" [8 tests]
   ✅ #1732: LogicalOperator → "c?.content?.parts && []" [8 tests]
   ❌ #1733: OptionalChaining → "c?.content.parts" [8 tests]
   ❌ #1735: ArrayDeclaration → "["Stryker was here"]" [2 tests]
   ✅ #1734: OptionalChaining → "c.content" [8 tests]
 31| 	const textPart = parts.find(p => typeof p.text === 'string');
   ✅ #1736: ArrowFunction → "() => undefined" [8 tests]
   ✅ #1737: ConditionalExpression → "true" [6 tests]
   ✅ #1738: ConditionalExpression → "false" [6 tests]
   ✅ #1739: EqualityOperator → "typeof p.text !== 'string'" [6 tests]
   ✅ #1740: StringLiteral → """" [6 tests]
 32| 	if (!textPart) throw new Error('No text JSON found in response.');
   ✅ #1741: BooleanLiteral → "textPart" [8 tests]
   ✅ #1742: ConditionalExpression → "true" [8 tests]
   ✅ #1743: ConditionalExpression → "false" [8 tests]
   ✅ #1744: StringLiteral → """" [3 tests]
 33| 	// Some responses may wrap JSON in backticks by mistake; strip if needed
 34| 	const raw = textPart.text.trim().replace(/^```json\s*|\s*```$/g, '');
   ❌ #1745: MethodExpression → "textPart.text" [5 tests]
   ❌ #1747: Regex → "/^```json\s|\s*```$/g" [5 tests]
   ❌ #1748: Regex → "/^```json\S*|\s*```$/g" [5 tests]
   ❌ #1746: Regex → "/```json\s*|\s*```$/g" [5 tests]
   ❌ #1749: Regex → "/^```json\s*|\s*```/g" [5 tests]
   ❌ #1751: Regex → "/^```json\s*|\S*```$/g" [5 tests]
   ❌ #1750: Regex → "/^```json\s*|\s```$/g" [5 tests]
   ✅ #1752: StringLiteral → ""Stryker was here!"" [5 tests]
 35| 	return JSON.parse(raw);
 36| }
 37| 
 38| /**
 39|  * Calculate display scale to fit image within viewport constraints.
 40|  * @param {number} naturalWidth - Original image width
 41|  * @param {number} viewportWidth - Available viewport width
 42|  * @param {number} padding - Padding to subtract from viewport (default: 60)
 43|  * @returns {number} Scale factor (1.0 = no scaling, <1.0 = scale down)
 44|  */
 45| export function calculateDisplayScale(naturalWidth, viewportWidth, padding = 60) {
   ✅ #1753: BlockStatement → "{}" [8 tests]
 46| 	if (typeof naturalWidth !== 'number' || !Number.isFinite(naturalWidth) || naturalWidth <= 0) {
   ✅ #1756: LogicalOperator → "(typeof naturalWidth !== 'number' || !Number.isFinite(naturalWidth)) && naturalWidth <= 0" [8 tests]
   ✅ #1754: ConditionalExpression → "true" [8 tests]
   ✅ #1755: ConditionalExpression → "false" [8 tests]
   ✅ #1757: ConditionalExpression → "false" [8 tests]
   ❌ #1759: ConditionalExpression → "false" [8 tests]
   ✅ #1758: LogicalOperator → "typeof naturalWidth !== 'number' && !Number.isFinite(naturalWidth)" [8 tests]
   ✅ #1760: EqualityOperator → "typeof naturalWidth === 'number'" [8 tests]
   ✅ #1761: StringLiteral → """" [8 tests]
   ✅ #1763: ConditionalExpression → "false" [8 tests]
   ✅ #1762: BooleanLiteral → "Number.isFinite(naturalWidth)" [8 tests]
   ✅ #1764: EqualityOperator → "naturalWidth < 0" [8 tests]
   ✅ #1766: BlockStatement → "{}" [1 tests]
   ✅ #1765: EqualityOperator → "naturalWidth > 0" [8 tests]
 47| 		throw new Error('Invalid naturalWidth: must be positive finite number');
   ✅ #1767: StringLiteral → """" [1 tests]
 48| 	}
 49| 	if (typeof viewportWidth !== 'number' || !Number.isFinite(viewportWidth) || viewportWidth <= 0) {
   ✅ #1768: ConditionalExpression → "true" [7 tests]
   ✅ #1769: ConditionalExpression → "false" [7 tests]
   ✅ #1770: LogicalOperator → "(typeof viewportWidth !== 'number' || !Number.isFinite(viewportWidth)) && viewportWidth <= 0" [7 tests]
   ✅ #1771: ConditionalExpression → "false" [7 tests]
   ✅ #1772: LogicalOperator → "typeof viewportWidth !== 'number' && !Number.isFinite(viewportWidth)" [7 tests]
   ❌ #1773: ConditionalExpression → "false" [7 tests]
   ✅ #1774: EqualityOperator → "typeof viewportWidth === 'number'" [7 tests]
   ✅ #1775: StringLiteral → """" [7 tests]
   ✅ #1776: BooleanLiteral → "Number.isFinite(viewportWidth)" [7 tests]
   ✅ #1777: ConditionalExpression → "false" [7 tests]
   ✅ #1778: EqualityOperator → "viewportWidth < 0" [7 tests]
   ✅ #1780: BlockStatement → "{}" [1 tests]
   ✅ #1779: EqualityOperator → "viewportWidth > 0" [7 tests]
 50| 		throw new Error('Invalid viewportWidth: must be positive finite number');
   ✅ #1781: StringLiteral → """" [1 tests]
 51| 	}
 52| 	if (typeof padding !== 'number' || !Number.isFinite(padding) || padding < 0) {
   ✅ #1783: ConditionalExpression → "false" [6 tests]
   ✅ #1782: ConditionalExpression → "true" [6 tests]
   ✅ #1784: LogicalOperator → "(typeof padding !== 'number' || !Number.isFinite(padding)) && padding < 0" [6 tests]
   ✅ #1786: LogicalOperator → "typeof padding !== 'number' && !Number.isFinite(padding)" [6 tests]
   ✅ #1785: ConditionalExpression → "false" [6 tests]
   ❌ #1787: ConditionalExpression → "false" [6 tests]
   ✅ #1788: EqualityOperator → "typeof padding === 'number'" [6 tests]
   ✅ #1790: BooleanLiteral → "Number.isFinite(padding)" [6 tests]
   ✅ #1791: ConditionalExpression → "false" [6 tests]
   ✅ #1789: StringLiteral → """" [6 tests]
   ❌ #1792: EqualityOperator → "padding <= 0" [6 tests]
   ✅ #1794: BlockStatement → "{}" [1 tests]
   ✅ #1793: EqualityOperator → "padding >= 0" [6 tests]
 53| 		throw new Error('Invalid padding: must be non-negative finite number');
   ✅ #1795: StringLiteral → """" [1 tests]
 54| 	}
 55| 	
 56| 	const maxW = Math.min(viewportWidth - padding, naturalWidth);
   ✅ #1796: MethodExpression → "Math.max(viewportWidth - padding, naturalWidth)" [5 tests]
   ✅ #1797: ArithmeticOperator → "viewportWidth + padding" [5 tests]
 57| 	return maxW / naturalWidth;
   ✅ #1798: ArithmeticOperator → "maxW * naturalWidth" [5 tests]
 58| }
 59| 
 60| /**
 61|  * Format JSON output with optional note header.
 62|  * @param {object} obj - Object to stringify
 63|  * @param {string} [note] - Optional note to prepend
 64|  * @returns {string} Formatted JSON string
 65|  */
 66| export function formatJsonOutput(obj, note) {
   ✅ #1799: BlockStatement → "{}" [6 tests]
 67| 	const head = note ? `// ${note}\n` : '';
   ✅ #1800: StringLiteral → "``" [1 tests]
   ✅ #1801: StringLiteral → ""Stryker was here!"" [5 tests]
 68| 	return head + JSON.stringify(obj, null, 2);
   ✅ #1802: ArithmeticOperator → "head - JSON.stringify(obj, null, 2)" [6 tests]
 69| }
 70| 
 71| /**
 72|  * Parse base64 data URL to extract the base64 content.
 73|  * @param {string} dataUrl - Data URL string (e.g., "data:image/jpeg;base64,ABC123...")
 74|  * @returns {string} Base64 content without the data URL prefix
 75|  * @throws {Error} If dataUrl format is invalid
 76|  */
 77| export function extractBase64FromDataUrl(dataUrl) {
   ✅ #1803: BlockStatement → "{}" [6 tests]
 78| 	if (typeof dataUrl !== 'string') {
   ✅ #1804: ConditionalExpression → "true" [6 tests]
   ✅ #1805: ConditionalExpression → "false" [6 tests]
   ✅ #1808: BlockStatement → "{}" [1 tests]
   ✅ #1806: EqualityOperator → "typeof dataUrl === 'string'" [6 tests]
   ✅ #1807: StringLiteral → """" [6 tests]
 79| 		throw new Error('Invalid dataUrl: must be a string');
   ✅ #1809: StringLiteral → """" [1 tests]
 80| 	}
 81| 	const parts = dataUrl.split(',');
   ✅ #1810: StringLiteral → """" [5 tests]
 82| 	if (parts.length < 2) {
   ✅ #1812: ConditionalExpression → "false" [5 tests]
   ✅ #1811: ConditionalExpression → "true" [5 tests]
   ✅ #1813: EqualityOperator → "parts.length <= 2" [5 tests]
   ✅ #1815: BlockStatement → "{}" [2 tests]
   ✅ #1814: EqualityOperator → "parts.length >= 2" [5 tests]
 83| 		throw new Error('Invalid dataUrl format: expected "data:mime;base64,content"');
   ✅ #1816: StringLiteral → """" [2 tests]
 84| 	}
 85| 	return parts[1];
 86| }
 87| 
 88| /**
 89|  * Validate and prepare detection data for rendering.
 90|  * Ensures required image metadata is present.
 91|  * @param {object} parsed - Parsed detection response
 92|  * @param {number} naturalWidth - Original image width
 93|  * @param {number} naturalHeight - Original image height
 94|  * @returns {object} Enhanced detection data with guaranteed image dimensions
 95|  */
 96| export function prepareDetectionData(parsed, naturalWidth, naturalHeight) {
   ✅ #1817: BlockStatement → "{}" [10 tests]
 97| 	if (!parsed || typeof parsed !== 'object') {
   ✅ #1820: LogicalOperator → "!parsed && typeof parsed !== 'object'" [10 tests]
   ✅ #1819: ConditionalExpression → "false" [10 tests]
   ✅ #1818: ConditionalExpression → "true" [10 tests]
   ✅ #1822: ConditionalExpression → "false" [10 tests]
   ✅ #1821: BooleanLiteral → "parsed" [10 tests]
   ✅ #1824: StringLiteral → """" [10 tests]
   ✅ #1823: EqualityOperator → "typeof parsed === 'object'" [10 tests]
   ✅ #1825: BlockStatement → "{}" [1 tests]
 98| 		throw new Error('Invalid parsed data: must be an object');
   ✅ #1826: StringLiteral → """" [1 tests]
 99| 	}
100| 	if (typeof naturalWidth !== 'number' || !Number.isFinite(naturalWidth) || naturalWidth <= 0) {
   ✅ #1827: ConditionalExpression → "true" [9 tests]
   ✅ #1829: LogicalOperator → "(typeof naturalWidth !== 'number' || !Number.isFinite(naturalWidth)) && naturalWidth <= 0" [9 tests]
   ✅ #1828: ConditionalExpression → "false" [9 tests]
   ✅ #1831: LogicalOperator → "typeof naturalWidth !== 'number' && !Number.isFinite(naturalWidth)" [9 tests]
   ✅ #1830: ConditionalExpression → "false" [9 tests]
   ❌ #1832: ConditionalExpression → "false" [9 tests]
   ✅ #1833: EqualityOperator → "typeof naturalWidth === 'number'" [9 tests]
   ✅ #1835: BooleanLiteral → "Number.isFinite(naturalWidth)" [9 tests]
   ✅ #1834: StringLiteral → """" [9 tests]
   ✅ #1836: ConditionalExpression → "false" [9 tests]
   ✅ #1839: BlockStatement → "{}" [1 tests]
   ✅ #1837: EqualityOperator → "naturalWidth < 0" [9 tests]
   ✅ #1838: EqualityOperator → "naturalWidth > 0" [9 tests]
101| 		throw new Error('Invalid naturalWidth: must be positive finite number');
   ✅ #1840: StringLiteral → """" [1 tests]
102| 	}
103| 	if (typeof naturalHeight !== 'number' || !Number.isFinite(naturalHeight) || naturalHeight <= 0) {
   ✅ #1842: ConditionalExpression → "false" [8 tests]
   ✅ #1841: ConditionalExpression → "true" [8 tests]
   ✅ #1843: LogicalOperator → "(typeof naturalHeight !== 'number' || !Number.isFinite(naturalHeight)) && naturalHeight <= 0" [8 tests]
   ✅ #1844: ConditionalExpression → "false" [8 tests]
   ❌ #1846: ConditionalExpression → "false" [8 tests]
   ✅ #1845: LogicalOperator → "typeof naturalHeight !== 'number' && !Number.isFinite(naturalHeight)" [8 tests]
   ✅ #1847: EqualityOperator → "typeof naturalHeight === 'number'" [8 tests]
   ✅ #1848: StringLiteral → """" [8 tests]
   ✅ #1850: ConditionalExpression → "false" [8 tests]
   ✅ #1849: BooleanLiteral → "Number.isFinite(naturalHeight)" [8 tests]
   ✅ #1851: EqualityOperator → "naturalHeight < 0" [8 tests]
   ✅ #1853: BlockStatement → "{}" [1 tests]
   ✅ #1852: EqualityOperator → "naturalHeight > 0" [8 tests]
104| 		throw new Error('Invalid naturalHeight: must be positive finite number');
   ✅ #1854: StringLiteral → """" [1 tests]
105| 	}
106| 
107| 	// Fill in image.width/height if missing (helps downstream)
108| 	if (!parsed.image) parsed.image = {};
   ✅ #1855: BooleanLiteral → "parsed.image" [7 tests]
   ✅ #1856: ConditionalExpression → "true" [7 tests]
   ✅ #1857: ConditionalExpression → "false" [7 tests]
109| 	if (parsed.image.width == null)  parsed.image.width  = naturalWidth;
   ✅ #1858: ConditionalExpression → "true" [7 tests]
   ✅ #1859: ConditionalExpression → "false" [7 tests]
   ✅ #1860: EqualityOperator → "parsed.image.width != null" [7 tests]
110| 	if (parsed.image.height == null) parsed.image.height = naturalHeight;
   ✅ #1861: ConditionalExpression → "true" [7 tests]
   ✅ #1862: ConditionalExpression → "false" [7 tests]
   ✅ #1863: EqualityOperator → "parsed.image.height != null" [7 tests]
111| 
112| 	return parsed;
113| }
114| 
```

#### ❌ Critical Survived Mutants (First 10)

1. **Mutant #1729** - Line 29:12-28
   - **Mutator**: `OptionalChaining` → `resp.candidates`
   - **Issue**: Unknown
   - **Fix**: Add specific test cases to kill this mutant
   - **Tests that should have caught this**: 5, 6, 7, 8, 9, 10, 11, 12

2. **Mutant #1733** - Line 30:16-33
   - **Mutator**: `OptionalChaining` → `c?.content.parts`
   - **Issue**: Unknown
   - **Fix**: Add specific test cases to kill this mutant
   - **Tests that should have caught this**: 5, 6, 7, 8, 9, 10, 11, 12

3. **Mutant #1735** - Line 30:37-39
   - **Mutator**: `ArrayDeclaration` → `["Stryker was here"]`
   - **Issue**: Unknown
   - **Fix**: Add specific test cases to kill this mutant
   - **Tests that should have caught this**: 8, 9

4. **Mutant #1745** - Line 34:14-34
   - **Mutator**: `MethodExpression` → `textPart.text`
   - **Issue**: Unknown
   - **Fix**: Mock and verify method calls with different inputs
   - **Tests that should have caught this**: 5, 6, 7, 11, 12

5. **Mutant #1747** - Line 34:43-65
   - **Mutator**: `Regex` → `/^```json\s|\s*```$/g`
   - **Issue**: Unknown
   - **Fix**: Add specific test cases to kill this mutant
   - **Tests that should have caught this**: 5, 6, 7, 11, 12

6. **Mutant #1748** - Line 34:43-65
   - **Mutator**: `Regex` → `/^```json\S*|\s*```$/g`
   - **Issue**: Unknown
   - **Fix**: Add specific test cases to kill this mutant
   - **Tests that should have caught this**: 5, 6, 7, 11, 12

7. **Mutant #1746** - Line 34:43-65
   - **Mutator**: `Regex` → `/```json\s*|\s*```$/g`
   - **Issue**: Unknown
   - **Fix**: Add specific test cases to kill this mutant
   - **Tests that should have caught this**: 5, 6, 7, 11, 12

8. **Mutant #1749** - Line 34:43-65
   - **Mutator**: `Regex` → `/^```json\s*|\s*```/g`
   - **Issue**: Unknown
   - **Fix**: Add specific test cases to kill this mutant
   - **Tests that should have caught this**: 5, 6, 7, 11, 12

9. **Mutant #1751** - Line 34:43-65
   - **Mutator**: `Regex` → `/^```json\s*|\S*```$/g`
   - **Issue**: Unknown
   - **Fix**: Add specific test cases to kill this mutant
   - **Tests that should have caught this**: 5, 6, 7, 11, 12

10. **Mutant #1750** - Line 34:43-65
   - **Mutator**: `Regex` → `/^```json\s*|\s```$/g`
   - **Issue**: Unknown
   - **Fix**: Add specific test cases to kill this mutant
   - **Tests that should have caught this**: 5, 6, 7, 11, 12

#### ✅ Successfully Killed Mutants Summary

- **136 mutants killed** by tests
- **Average tests per mutant**: 1.0
- **Most effective test**: 33 (killed 21 mutants)
- **Top mutator types killed**: ConditionalExpression, StringLiteral, EqualityOperator

---

## 📚 Appendix

### Understanding Mutation Testing

Mutation testing validates test quality by introducing small bugs (mutations) into your code:

1. **🟢 Killed Mutants**: Tests detected the bug ✅ Good!
2. **❌ Survived Mutants**: Tests missed the bug ❌ Need better tests  
3. **🚫 No Coverage**: Code isn't tested ❌ Need more tests

### Mutation Testing Process

1. **Mutation Generation**: The tool creates variants of your code with small changes
2. **Test Execution**: Your test suite runs against each mutant
3. **Result Analysis**: 
   - If tests fail → Mutant is "killed" (good)
   - If tests pass → Mutant "survived" (bad)
   - If no tests run → "No coverage" (very bad)

### Interpreting Results

#### Status Definitions
- **Killed**: Tests caught the mutation (test quality is good for this area)
- **Survived**: Tests didn't catch the mutation (test quality needs improvement)
- **No Coverage**: No tests executed this code (coverage gap)
- **Timeout**: Tests took too long (possible infinite loop)
- **Runtime Error**: Mutation caused a runtime error
- **Compile Error**: Mutation caused compilation to fail

#### Mutator Types Explained
- **ConditionalExpression**: Changes conditions (true ↔ false)
- **EqualityOperator**: Changes equality operators (== ↔ !=, === ↔ !==)
- **StringLiteral**: Changes string values
- **BooleanLiteral**: Changes boolean values (true ↔ false)
- **ArithmeticOperator**: Changes math operators (+, -, *, /, %)
- **LogicalOperator**: Changes logical operators (&&, ||)
- **BlockStatement**: Removes or modifies code blocks
- **MethodExpression**: Changes method calls

### Recommended Next Steps

#### Immediate Actions (Priority Order)
1. **Address High Priority Files**: Focus on files with low coverage or poor mutation scores
2. **Fix No Coverage Issues**: Add tests for uncovered code paths
3. **Improve Test Assertions**: Strengthen tests to catch survived mutants
4. **Add Edge Case Tests**: Test boundary conditions and error scenarios

#### Long-term Improvements
1. **Regular Monitoring**: Run mutation testing in CI/CD pipeline
2. **Set Quality Gates**: Require minimum mutation scores for commits
3. **Team Training**: Educate team on mutation testing principles
4. **Incremental Improvement**: Focus on most critical files first

#### Test Quality Guidelines
- **Target 80%+ mutation score** for critical business logic
- **Focus on edge cases** and error conditions
- **Test both positive and negative scenarios**
- **Verify error messages and exception types**
- **Test with various input combinations**

### Mutation Testing Best Practices

#### Do's ✅
- Use mutation testing to **guide test improvements**
- Focus on **business-critical code** first
- Set **realistic targets** (80%+ for important code)
- **Combine with code coverage** for comprehensive analysis
- **Run regularly** to prevent regression
- **Use results to improve** test design

#### Don'ts ❌
- Don't aim for 100% mutation score (some mutants are equivalent)
- Don't ignore "No Coverage" mutants
- Don't rely solely on mutation score
- Don't test generated or trivial code extensively
- Don't let perfect be the enemy of good

### Troubleshooting Common Issues

#### Low Mutation Score
- **Symptom**: Many survived mutants
- **Solution**: Add more specific assertions and edge case tests
- **Example**: Test both success and failure paths

#### No Coverage Issues  
- **Symptom**: High percentage of uncovered mutants
- **Solution**: Increase test coverage first, then improve test quality
- **Example**: Add unit tests for all public methods

#### Equivalent Mutants
- **Symptom**: Mutants that don't change behavior
- **Solution**: This is normal - focus on actionable mutants
- **Example**: Changing variable names doesn't affect functionality

### Integration with Development Workflow

#### CI/CD Integration
```bash
# Example pipeline step
npm run test:mutation
if mutation_score < 80%; then
  echo "Mutation score too low"
  exit 1
fi
```

#### Git Hooks
```bash
# Pre-commit hook
npm run test:mutation:changed-files
```

#### Quality Gates
- **Minimum mutation score**: 70% for new code
- **No decrease**: Mutation score shouldn't drop
- **Coverage requirement**: 90%+ line coverage before mutation testing

### Additional Resources

- [Mutation Testing Guide](https://stryker-mutator.io/docs/)
- [Best Practices](https://blog.stryker-mutator.io/blog/)
- [Academic Research](https://en.wikipedia.org/wiki/Mutation_testing)
- [Interpreting Results](https://github.com/stryker-mutator/stryker/blob/master/docs/mutation-testing-elements/supported-mutators.md)

### Tool Configuration

#### Stryker Configuration Tips
```json
{
  "mutate": ["src/**/*.js", "!src/**/*.test.js"],
  "testRunner": "jest",
  "coverageAnalysis": "perTest",
  "thresholds": {
    "high": 80,
    "low": 60,
    "break": 50
  }
}
```

#### Performance Optimization
- Use **coverage analysis** to speed up execution
- **Exclude test files** from mutation
- **Parallelize execution** when possible
- **Use incremental mode** for large codebases

---

*Report generated by Stryker Mutation Testing Framework*  
*For questions or issues, consult your development team or the Stryker documentation.*

**Report Generation Details**
- Generated: 2025-10-02T20:07:34.907Z
- Stryker Version: Latest
- Analysis Includes: Source code, test coverage, mutant details, recommendations
- Interactive Version: Available at `html/index.html`
