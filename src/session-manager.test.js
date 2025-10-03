/**
 * Tests for session-manager.js
 */

import {
	createSession,
	updateImageStatus,
	isSessionComplete,
	getSessionProgress,
	calculateSessionAggregates,
	exportSessionCSV,
	exportSessionJSON
} from './session-manager.js';

describe('session-manager', () => {
	describe('createSession', () => {
		it('should create a session with correct structure', () => {
			const files = [
				{ name: 'img1.jpg' },
				{ name: 'img2.jpg' }
			];

			const session = createSession(files);

			expect(session.sessionId).toMatch(/^session_\d+$/);
			expect(session.totalImages).toBe(2);
			expect(session.completedImages).toBe(0);
			expect(session.failedImages).toBe(0);
			expect(session.images).toHaveLength(2);
			expect(session.images[0].imageId).toBe('img_001');
			expect(session.images[0].fileName).toBe('img1.jpg');
			expect(session.images[0].status).toBe('queued');
			expect(session.images[1].imageId).toBe('img_002');
		});

		it('should handle empty file array', () => {
			const session = createSession([]);
			expect(session.totalImages).toBe(0);
			expect(session.images).toHaveLength(0);
		});
	});

	describe('updateImageStatus', () => {
		it('should update image status to completed', () => {
			const session = createSession([{ name: 'test.jpg' }]);
			const result = { detections: [] };

			updateImageStatus(session, 'img_001', 'completed', result);

			expect(session.images[0].status).toBe('completed');
			expect(session.images[0].result).toBe(result);
			expect(session.completedImages).toBe(1);
		});

		it('should update image status to error', () => {
			const session = createSession([{ name: 'test.jpg' }]);
			const error = new Error('API failed');

			updateImageStatus(session, 'img_001', 'error', null, error);

			expect(session.images[0].status).toBe('error');
			expect(session.images[0].error).toBe(error);
			expect(session.failedImages).toBe(1);
		});

		it('should handle non-existent image ID gracefully', () => {
			const session = createSession([{ name: 'test.jpg' }]);
			
			updateImageStatus(session, 'img_999', 'completed');
			
			expect(session.completedImages).toBe(0);
		});

		it('should not double-count status updates', () => {
			const session = createSession([{ name: 'test.jpg' }]);
			
			updateImageStatus(session, 'img_001', 'completed', {});
			updateImageStatus(session, 'img_001', 'completed', {});
			
			expect(session.completedImages).toBe(1);
		});
	});

	describe('isSessionComplete', () => {
		it('should return true when all images are processed', () => {
			const session = createSession([
				{ name: 'img1.jpg' },
				{ name: 'img2.jpg' }
			]);

			updateImageStatus(session, 'img_001', 'completed', {});
			updateImageStatus(session, 'img_002', 'completed', {});

			expect(isSessionComplete(session)).toBe(true);
		});

		it('should return true when some succeed and some fail', () => {
			const session = createSession([
				{ name: 'img1.jpg' },
				{ name: 'img2.jpg' }
			]);

			updateImageStatus(session, 'img_001', 'completed', {});
			updateImageStatus(session, 'img_002', 'error', null, new Error('fail'));

			expect(isSessionComplete(session)).toBe(true);
		});

		it('should return false when images are still queued', () => {
			const session = createSession([
				{ name: 'img1.jpg' },
				{ name: 'img2.jpg' }
			]);

			updateImageStatus(session, 'img_001', 'completed', {});

			expect(isSessionComplete(session)).toBe(false);
		});

		it('should return true for empty session', () => {
			const session = createSession([]);
			expect(isSessionComplete(session)).toBe(true);
		});
	});

	describe('getSessionProgress', () => {
		it('should return 0 for no progress', () => {
			const session = createSession([{ name: 'img1.jpg' }]);
			expect(getSessionProgress(session)).toBe(0);
		});

		it('should return 50 for half complete', () => {
			const session = createSession([
				{ name: 'img1.jpg' },
				{ name: 'img2.jpg' }
			]);
			updateImageStatus(session, 'img_001', 'completed', {});
			expect(getSessionProgress(session)).toBe(50);
		});

		it('should return 100 for complete session', () => {
			const session = createSession([
				{ name: 'img1.jpg' },
				{ name: 'img2.jpg' }
			]);
			updateImageStatus(session, 'img_001', 'completed', {});
			updateImageStatus(session, 'img_002', 'completed', {});
			expect(getSessionProgress(session)).toBe(100);
		});

		it('should count errors toward progress', () => {
			const session = createSession([
				{ name: 'img1.jpg' },
				{ name: 'img2.jpg' }
			]);
			updateImageStatus(session, 'img_001', 'completed', {});
			updateImageStatus(session, 'img_002', 'error', null, new Error());
			expect(getSessionProgress(session)).toBe(100);
		});

		it('should return 100 for empty session', () => {
			const session = createSession([]);
			expect(getSessionProgress(session)).toBe(100);
		});
	});

	describe('calculateSessionAggregates', () => {
		it('should calculate aggregates from multiple images', () => {
			const session = createSession([
				{ name: 'img1.jpg' },
				{ name: 'img2.jpg' }
			]);

			const result1 = {
				detections: [
					{ id: '1', label: 'worker', category: 'object', confidence: 0.9 },
					{ id: '2', label: 'ladder', category: 'safety_issue', confidence: 0.8, safety: { severity: 'high' } }
				]
			};
			const result2 = {
				detections: [
					{ id: '3', label: 'worker', category: 'object', confidence: 0.85 },
					{ id: '4', label: 'exit sign', category: 'facility_asset', confidence: 0.95 }
				]
			};

			updateImageStatus(session, 'img_001', 'completed', result1);
			updateImageStatus(session, 'img_002', 'completed', result2);

			const aggregates = calculateSessionAggregates(session);

			expect(aggregates.totalDetections).toBe(4);
			expect(aggregates.totalSafetyIssues).toBe(1);
			expect(aggregates.safetyBySeverity.high).toBe(1);
			expect(aggregates.countsByCategory).toHaveLength(3);
			expect(aggregates.countsByLabel).toHaveLength(3);
			expect(aggregates.imagesSafety).toHaveLength(2);
		});

		it('should handle empty results', () => {
			const session = createSession([{ name: 'img1.jpg' }]);
			updateImageStatus(session, 'img_001', 'completed', { detections: [] });

			const aggregates = calculateSessionAggregates(session);

			expect(aggregates.totalDetections).toBe(0);
			expect(aggregates.totalSafetyIssues).toBe(0);
			expect(aggregates.imagesSafety).toHaveLength(1);
		});

		it('should skip failed images', () => {
			const session = createSession([
				{ name: 'img1.jpg' },
				{ name: 'img2.jpg' }
			]);

			updateImageStatus(session, 'img_001', 'completed', {
				detections: [{ id: '1', label: 'worker', category: 'object' }]
			});
			updateImageStatus(session, 'img_002', 'error', null, new Error());

			const aggregates = calculateSessionAggregates(session);

			expect(aggregates.totalDetections).toBe(1);
			expect(aggregates.imagesSafety).toHaveLength(1);
		});

		it('should sort categories by count', () => {
			const session = createSession([{ name: 'img1.jpg' }]);
			
			updateImageStatus(session, 'img_001', 'completed', {
				detections: [
					{ id: '1', label: 'a', category: 'object' },
					{ id: '2', label: 'b', category: 'object' },
					{ id: '3', label: 'c', category: 'safety_issue', safety: { severity: 'low' } }
				]
			});

			const aggregates = calculateSessionAggregates(session);

			expect(aggregates.countsByCategory[0].category).toBe('object');
			expect(aggregates.countsByCategory[0].count).toBe(2);
			expect(aggregates.countsByCategory[1].category).toBe('safety_issue');
			expect(aggregates.countsByCategory[1].count).toBe(1);
		});

		it('should determine max severity per image', () => {
			const session = createSession([{ name: 'img1.jpg' }]);
			
			updateImageStatus(session, 'img_001', 'completed', {
				detections: [
					{ id: '1', label: 'issue1', category: 'safety_issue', safety: { severity: 'low' } },
					{ id: '2', label: 'issue2', category: 'safety_issue', safety: { severity: 'high' } },
					{ id: '3', label: 'issue3', category: 'safety_issue', safety: { severity: 'medium' } }
				]
			});

			const aggregates = calculateSessionAggregates(session);

			expect(aggregates.imagesSafety[0].maxSeverity).toBe('high');
			expect(aggregates.imagesSafety[0].safetyCount).toBe(3);
		});

			it('should fill in defaults when detection metadata is missing', () => {
				const session = createSession([{ name: 'img1.jpg' }]);

				updateImageStatus(session, 'img_001', 'completed', {
					detections: [
						{ id: '1' },
						{ id: '2', category: 'safety_issue', safety: {} }
					]
				});

				const aggregates = calculateSessionAggregates(session);

				expect(aggregates.totalDetections).toBe(2);
				expect(aggregates.totalSafetyIssues).toBe(1);
				expect(aggregates.safetyBySeverity.low).toBe(1);
				const categoryOther = aggregates.countsByCategory.find(item => item.category === 'other');
				const labelUnknown = aggregates.countsByLabel.find(item => item.label === 'unknown');
				expect(categoryOther?.count).toBe(1);
				expect(labelUnknown?.count).toBe(2);
				expect(aggregates.imagesSafety[0].maxSeverity).toBe('low');

				session.sessionAggregates = aggregates;
				const csv = exportSessionCSV(session);
				expect(csv).toContain('1,img1.jpg,2,1,0,0,1,Completed');
			});
	});

	describe('exportSessionCSV', () => {
		it('should export session summary as CSV', () => {
			const session = createSession([
				{ name: 'img1.jpg' },
				{ name: 'img2.jpg' }
			]);

			updateImageStatus(session, 'img_001', 'completed', {
				detections: [
					{ id: '1', label: 'worker', category: 'object' },
					{ id: '2', label: 'issue', category: 'safety_issue', safety: { severity: 'high' } }
				]
			});
			updateImageStatus(session, 'img_002', 'completed', {
				detections: [
					{ id: '3', label: 'tool', category: 'object' }
				]
			});

			session.sessionAggregates = calculateSessionAggregates(session);

			const csv = exportSessionCSV(session);

			expect(csv).toContain('Image,File Name,Detections,Safety Issues');
			expect(csv).toContain('1,img1.jpg,2,1,1,0,0,Completed');
			expect(csv).toContain('2,img2.jpg,1,0,0,0,0,Completed');
			expect(csv).toContain('Session Summary');
			expect(csv).toContain('Total Images,2');
			expect(csv).toContain('Total Detections,3');
		});

		it('should escape CSV special characters', () => {
			const session = createSession([{ name: 'test,file"name.jpg' }]);

			updateImageStatus(session, 'img_001', 'completed', {
				detections: []
			});

			session.sessionAggregates = calculateSessionAggregates(session);

			const csv = exportSessionCSV(session);

			expect(csv).toContain('"test,file""name.jpg"');
		});

		it('should throw if aggregates not calculated', () => {
			const session = createSession([{ name: 'test.jpg' }]);

			expect(() => exportSessionCSV(session)).toThrow('Session aggregates not calculated');
		});

		it('should include error rows for failed images', () => {
			const session = createSession([
				{ name: 'good.jpg' },
				{ name: 'bad.jpg' }
			]);

			updateImageStatus(session, 'img_001', 'completed', { detections: [] });
			updateImageStatus(session, 'img_002', 'error', null, new Error('Server down'));

			session.sessionAggregates = calculateSessionAggregates(session);

			const csv = exportSessionCSV(session);

			expect(csv).toContain('2,bad.jpg,0,0,0,0,0,Error: Server down');
		});

		it('should render blank CSV cells when file name is missing', () => {
			const session = createSession([{ name: null }]);

			updateImageStatus(session, 'img_001', 'completed', { detections: [] });
			session.sessionAggregates = calculateSessionAggregates(session);

			const csv = exportSessionCSV(session);
			const lines = csv.split('\n');

			expect(lines[1]).toBe('1,,0,0,0,0,0,Completed');
		});

		it('should quote values containing newline characters', () => {
			const session = createSession([{ name: 'multi\nline.png' }]);

			updateImageStatus(session, 'img_001', 'completed', { detections: [] });
			session.sessionAggregates = calculateSessionAggregates(session);

			const csv = exportSessionCSV(session);

			expect(csv).toContain('"multi\nline.png"');
			expect(csv).toContain('Completed');
		});

		it('should skip aggregate entries without matching images', () => {
			const session = createSession([{ name: 'only.jpg' }]);

			updateImageStatus(session, 'img_001', 'completed', { detections: [] });

			const aggregates = calculateSessionAggregates(session);
			session.sessionAggregates = {
				...aggregates,
				imagesSafety: [
					...aggregates.imagesSafety,
					{
						imageId: 'img_999',
						fileName: 'ghost.jpg',
						detectionsCount: 0,
						safetyCount: 0,
						maxSeverity: 'none'
					}
				]
			};

			const csv = exportSessionCSV(session);

			expect(csv).toContain('1,only.jpg,0,0,0,0,0,Completed');
			expect(csv).not.toContain('ghost.jpg');
		});
	});

	describe('exportSessionJSON', () => {
		it('should export complete session as JSON', () => {
			const session = createSession([{ name: 'img1.jpg' }]);

			updateImageStatus(session, 'img_001', 'completed', {
				detections: [{ id: '1', label: 'worker' }]
			});

			session.sessionAggregates = calculateSessionAggregates(session);

			const json = exportSessionJSON(session);
			const parsed = JSON.parse(json);

			expect(parsed.sessionId).toBe(session.sessionId);
			expect(parsed.totalImages).toBe(1);
			expect(parsed.images).toHaveLength(1);
			expect(parsed.images[0].result.detections).toHaveLength(1);
			expect(parsed.sessionAggregates).toBeDefined();
		});

		it('should handle errors in export', () => {
			const session = createSession([{ name: 'img1.jpg' }]);

			updateImageStatus(session, 'img_001', 'error', null, new Error('Test error'));

			session.sessionAggregates = calculateSessionAggregates(session);

			const json = exportSessionJSON(session);
			const parsed = JSON.parse(json);

			expect(parsed.images[0].status).toBe('error');
			expect(parsed.images[0].error.message).toBe('Test error');
		});
	});
});
