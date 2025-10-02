/**
 * Tests for session management
 */

import {
	createSession,
	calculateSessionAggregates,
	updateSessionStatus,
	getSessionProgress
} from './session.js';

describe('session', () => {
	describe('createSession', () => {
		it('should create a session with unique ID and queued images', () => {
			const files = [
				new File(['content1'], 'image1.jpg', { type: 'image/jpeg' }),
				new File(['content2'], 'image2.jpg', { type: 'image/jpeg' })
			];

			const session = createSession(files);

			expect(session.sessionId).toMatch(/^session_\d+_[a-z0-9]+$/);
			expect(session.status).toBe('analyzing');
			expect(session.images).toHaveLength(2);
			expect(session.images[0].status).toBe('queued');
			expect(session.images[1].status).toBe('queued');
			expect(session.images[0].filename).toBe('image1.jpg');
			expect(session.activeImageIndex).toBe(0);
		});

		it('should generate unique image IDs', () => {
			const files = [
				new File(['c1'], 'test.jpg', { type: 'image/jpeg' }),
				new File(['c2'], 'test.jpg', { type: 'image/jpeg' })
			];

			const session = createSession(files);
			expect(session.images[0].id).not.toBe(session.images[1].id);
		});
	});

	describe('calculateSessionAggregates', () => {
		it('should aggregate detections across multiple images', () => {
			const session = {
				images: [
					{
						id: 'img1',
						filename: 'a.jpg',
						status: 'completed',
						detections: [
							{ label: 'Worker', category: 'object', confidence: 0.9 },
							{ label: 'Helmet', category: 'object', confidence: 0.8 }
						]
					},
					{
						id: 'img2',
						filename: 'b.jpg',
						status: 'completed',
						detections: [
							{ label: 'Worker', category: 'object', confidence: 0.85 },
							{ 
								label: 'Missing PPE', 
								category: 'safety_issue', 
								confidence: 0.9,
								safety: { severity: 'high', rule: 'PPE Required' }
							}
						]
					}
				]
			};

			const agg = calculateSessionAggregates(session);

			expect(agg.totalDetections).toBe(4);
			expect(agg.categoryCounts).toEqual([
				{ category: 'object', count: 3 },
				{ category: 'safety_issue', count: 1 }
			]);
			expect(agg.labelCounts).toEqual([
				{ label: 'Worker', count: 2 },
				{ label: 'Helmet', count: 1 },
				{ label: 'Missing PPE', count: 1 }
			]);
			expect(agg.safetyIssues.high).toBe(1);
			expect(agg.imageStats).toHaveLength(2);
		});

		it('should skip images with error status', () => {
			const session = {
				images: [
					{
						id: 'img1',
						filename: 'a.jpg',
						status: 'completed',
						detections: [{ label: 'Worker', category: 'object' }]
					},
					{
						id: 'img2',
						filename: 'b.jpg',
						status: 'error',
						detections: []
					}
				]
			};

			const agg = calculateSessionAggregates(session);
			expect(agg.totalDetections).toBe(1);
			expect(agg.imageStats).toHaveLength(1);
		});

		it('should handle empty detections', () => {
			const session = {
				images: [
					{
						id: 'img1',
						filename: 'a.jpg',
						status: 'completed',
						detections: []
					}
				]
			};

			const agg = calculateSessionAggregates(session);
			expect(agg.totalDetections).toBe(0);
			expect(agg.categoryCounts).toEqual([]);
			expect(agg.labelCounts).toEqual([]);
		});
	});

	describe('updateSessionStatus', () => {
		it('should return "analyzing" when images are still processing', () => {
			const session = {
				images: [
					{ status: 'completed' },
					{ status: 'analyzing' },
					{ status: 'queued' }
				]
			};

			expect(updateSessionStatus(session)).toBe('analyzing');
		});

		it('should return "completed" when all images are completed', () => {
			const session = {
				images: [
					{ status: 'completed' },
					{ status: 'completed' }
				]
			};

			expect(updateSessionStatus(session)).toBe('completed');
		});

		it('should return "error" when all images failed', () => {
			const session = {
				images: [
					{ status: 'error' },
					{ status: 'error' }
				]
			};

			expect(updateSessionStatus(session)).toBe('error');
		});

		it('should return "partial_failure" when some succeed and some fail', () => {
			const session = {
				images: [
					{ status: 'completed' },
					{ status: 'error' },
					{ status: 'completed' }
				]
			};

			expect(updateSessionStatus(session)).toBe('partial_failure');
		});
	});

	describe('getSessionProgress', () => {
		it('should calculate progress metrics correctly', () => {
			const session = {
				images: [
					{ status: 'completed' },
					{ status: 'completed' },
					{ status: 'analyzing' },
					{ status: 'queued' },
					{ status: 'error' }
				]
			};

			const progress = getSessionProgress(session);

			expect(progress.total).toBe(5);
			expect(progress.completed).toBe(2);
			expect(progress.error).toBe(1);
			expect(progress.analyzing).toBe(1);
			expect(progress.queued).toBe(1);
			expect(progress.done).toBe(3);
			expect(progress.percentage).toBe(60);
		});
	});
});
