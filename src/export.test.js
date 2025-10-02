/**
 * Tests for export utilities
 */

import { exportSessionJSON, exportSessionCSV } from './export.js';

describe('export', () => {
	describe('exportSessionJSON', () => {
		it('should export session as valid JSON', () => {
			const session = {
				sessionId: 'test_session',
				images: [
					{
						id: 'img1',
						filename: 'test.jpg',
						status: 'completed',
						naturalWidth: 1920,
						naturalHeight: 1080,
						detections: [
							{ 
								id: 'det1', 
								label: 'Worker', 
								category: 'object', 
								confidence: 0.95 
							}
						],
						parsedData: {
							global_insights: [
								{ name: 'Site Overview', description: 'Test site' }
							]
						}
					}
				],
				sessionAggregates: {
					totalDetections: 1,
					safetyIssues: { high: 0, medium: 0, low: 0 }
				}
			};

			const json = exportSessionJSON(session);
			const parsed = JSON.parse(json);

			expect(parsed.sessionId).toBe('test_session');
			expect(parsed.totalImages).toBe(1);
			expect(parsed.imagesAnalyzed).toBe(1);
			expect(parsed.images).toHaveLength(1);
			expect(parsed.images[0].filename).toBe('test.jpg');
			expect(parsed.images[0].detections).toHaveLength(1);
		});

		it('should skip images with error status', () => {
			const session = {
				sessionId: 'test',
				images: [
					{
						id: 'img1',
						filename: 'a.jpg',
						status: 'completed',
						naturalWidth: 100,
						naturalHeight: 100,
						detections: [{ label: 'Worker' }],
						parsedData: {}
					},
					{
						id: 'img2',
						filename: 'b.jpg',
						status: 'error',
						naturalWidth: 0,
						naturalHeight: 0,
						detections: [],
						parsedData: null
					}
				],
				sessionAggregates: { totalDetections: 1 }
			};

			const json = exportSessionJSON(session);
			const parsed = JSON.parse(json);

			expect(parsed.images).toHaveLength(1);
			expect(parsed.images[0].filename).toBe('a.jpg');
		});
	});

	describe('exportSessionCSV', () => {
		it('should export session as CSV with header', () => {
			const session = {
				sessionId: 'test_session',
				images: [
					{
						id: 'img1',
						filename: 'test.jpg',
						status: 'completed',
						detections: [
							{
								id: 'det1',
								label: 'Worker',
								category: 'object',
								confidence: 0.95
							}
						]
					}
				]
			};

			const csv = exportSessionCSV(session);
			const lines = csv.split('\n');

			expect(lines[0]).toContain('SessionID');
			expect(lines[0]).toContain('ImageID');
			expect(lines[0]).toContain('DetectionID');
			expect(lines[1]).toContain('test_session');
			expect(lines[1]).toContain('img1');
			expect(lines[1]).toContain('Worker');
			expect(lines[1]).toContain('0.9500');
		});

		it('should escape CSV fields with commas', () => {
			const session = {
				sessionId: 'test',
				images: [
					{
						id: 'img1',
						filename: 'file,with,commas.jpg',
						status: 'completed',
						detections: [
							{
								id: 'det1',
								label: 'Worker, standing',
								category: 'object',
								confidence: 0.8
							}
						]
					}
				]
			};

			const csv = exportSessionCSV(session);
			expect(csv).toContain('"file,with,commas.jpg"');
			expect(csv).toContain('"Worker, standing"');
		});

		it('should include safety and progress fields', () => {
			const session = {
				sessionId: 'test',
				images: [
					{
						id: 'img1',
						filename: 'test.jpg',
						status: 'completed',
						detections: [
							{
								id: 'det1',
								label: 'Missing PPE',
								category: 'safety_issue',
								confidence: 0.9,
								safety: {
									severity: 'high',
									rule: 'PPE Required'
								}
							},
							{
								id: 'det2',
								label: 'Foundation',
								category: 'progress',
								confidence: 0.85,
								progress: {
									phase: 'In Progress',
									percentComplete: 45.5
								}
							}
						]
					}
				]
			};

			const csv = exportSessionCSV(session);
			expect(csv).toContain('high');
			expect(csv).toContain('PPE Required');
			expect(csv).toContain('In Progress');
			expect(csv).toContain('45.50');
		});

		it('should handle empty detections', () => {
			const session = {
				sessionId: 'test',
				images: [
					{
						id: 'img1',
						filename: 'test.jpg',
						status: 'completed',
						detections: []
					}
				]
			};

			const csv = exportSessionCSV(session);
			const lines = csv.split('\n');

			// Only header row
			expect(lines.length).toBe(1);
		});
	});
});
