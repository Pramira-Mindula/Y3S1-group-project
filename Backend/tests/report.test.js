import request from 'supertest';
import express from 'express';
// 1. IMPORT: Path to Member 4's controller
import { resolveReport, createReport } from '../controllers/reportController.js'; 

// 2. MOCKS: Fake the Database, Posts, and Brevo
jest.mock('../models/Report.js');
jest.mock('../models/Post.js');
jest.mock('@getbrevo/brevo', () => ({
    BrevoClient: jest.fn().mockImplementation(() => ({
        transactionalEmails: {
            sendTransacEmail: jest.fn().mockResolvedValue({ messageId: 'report_email_123' })
        }
    }))
}));

import Report from '../models/Report.js';

// 3. MINI-SERVER
const app = express();
app.use(express.json());

// Fake Auth Middleware for Member 4
app.use((req, res, next) => {
    req.user = { id: 'admin_user_99' }; 
    next();
});

app.post('/reports', createReport);
app.put('/reports/:id/resolve', resolveReport);

describe('Member 4: Report & Moderation Unit Tests', () => {

    /**
     * TEST 1: Status Validation
     * Logic: Only 'Pending', 'Resolved', or 'Dismissed' are allowed.
     */
    test('Scenario: Should block invalid status updates', async () => {
        // [ACT] Try to set status to 'Deleted' (which is not in the allowed list)
        const res = await request(app)
            .put('/reports/123/resolve')
            .send({ status: 'Deleted', actionComment: 'Not allowed' });

        // [ASSERT] Should return 400 Bad Request
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain('Must be Pending, Resolved, or Dismissed');
    });

    /**
     * TEST 2: Admin Comment Requirement
     * Logic: If status is Resolved or Dismissed, a comment is MANDATORY.
     */
    test('Scenario: Should require a comment when resolving a report', async () => {
        // [ACT] Send 'Resolved' status but NO comment
        const res = await request(app)
            .put('/reports/123/resolve')
            .send({ status: 'Resolved' }); // Missing actionComment

        // [ASSERT]
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Action comment is required when resolving or dismissing a report.');
    });

    /**
     * TEST 3: Duplicate Report Prevention
     * Logic: If MongoDB returns error code 11000 (unique violation).
     */
    test('Scenario: Should block duplicate reports from the same user', async () => {
        // [ARRANGE] Force the DB to throw a "Duplicate Key" error
        Report.create.mockRejectedValue({ code: 11000 });

        const res = await request(app)
            .post('/reports')
            .send({ postId: 'post1', reason: 'Spam' });

        // [ASSERT]
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('You have already reported this post.');
    });
});