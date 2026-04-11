import request from 'supertest';
import express from 'express';
// 1. IMPORT: Path might be resourceController.js - update if needed!
import { getResources, shareResourceViaEmail } from '../controllers/resourceController.js'; 

// 2. MOCKS: Fake the Database and the Email Service
jest.mock('../models/Resource.js');
jest.mock('@getbrevo/brevo', () => ({
    BrevoClient: jest.fn().mockImplementation(() => ({
        transactionalEmails: {
            sendTransacEmail: jest.fn().mockResolvedValue({ messageId: '123' })
        }
    }))
}));

import Resource from '../models/Resource.js';

// 3. MINI-SERVER
const app = express();
app.use(express.json());
app.get('/resources', getResources);
app.post('/resources/share', shareResourceViaEmail);

describe('Member 3: Resource Management Unit Tests', () => {

    /**
     * TEST 1: Pagination Logic
     * Logic: (count / limit) rounded up. 15 items / limit 10 = 2 pages.
     */
    test('Scenario: Should calculate total pages correctly', async () => {
        // [ARRANGE] Fake 15 total items in the database
        Resource.countDocuments.mockResolvedValue(15);
        Resource.find.mockReturnValue({
            limit: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue([{ title: 'Resource 1' }])
        });

        // [ACT] Ask for resources with a limit of 10
        const res = await request(app).get('/resources?limit=10&page=1');

        // [ASSERT] 15 items / 10 limit should = 2 total pages
        expect(res.body.totalPages).toBe(2);
        expect(res.body.currentPage).toBe("1");
    });

    /**
     * TEST 2: Validation for Email Sharing
     * Logic: if (!resourceId || !email) return res.status(400)
     */
    test('Scenario: Should fail if email is missing in share request', async () => {
        // [ACT] Send request with ID but NO email
        const res = await request(app)
            .post('/resources/share')
            .send({ resourceId: '12345' }); // Missing 'email' field

        // [ASSERT] Your code should catch the missing field
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('resourceId and email are required');
    });
});