import request from 'supertest';
import express from 'express';
// Import the real functions from Member 1's controller
import { register, login } from '../controllers/authController.js'; 

// --- THE HIJACK (MOCKS) ---
// We "fake" these so the code doesn't try to send real emails or talk to real MongoDB
jest.mock('../models/User.js'); 
jest.mock('bcryptjs', () => ({
    compare: jest.fn(() => Promise.resolve(true)), // Always says "Password Correct"
    hash: jest.fn(() => Promise.resolve('hashed_password_123'))
}));
jest.mock('@getbrevo/brevo');
jest.mock('nodemailer');

import User from '../models/User.js';

// --- THE MINI-SERVER ---
const app = express();
app.use(express.json());
app.post('/register', register); 
app.post('/login', login);      

describe('Member 1: User & Mentor Management Unit Tests', () => {

    /**
     * TEST 1: Registration Logic
     * Verifies your code blocks users with existing emails.
     */
    test('Scenario: Registering an email that already exists', async () => {
        // Arrange: Fake DB says user exists
        User.findOne.mockResolvedValue({ email: 'sasa@gmail.com' });

        // Act: Try to register
        const res = await request(app)
            .post('/register')
            .send({ 
                username: 'Sasa', 
                email: 'sasa@gmail.com', 
                password: 'password123' 
            });

        // Assert: Check if your code returned 400
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('User already exists');
    });

    /**
     * TEST 2: Mentor Security Logic
     * Verifies your code blocks unverified mentors.
     */
    test('Scenario: Unverified Mentor tries to login', async () => {
        // Arrange: Fake DB returns a mentor who is NOT verified
        User.findOne.mockResolvedValue({
            email: 'mentor@test.com',
            password: 'hashed_password_123',
            role: 'mentor',
            mentorDetails: { isVerified: false } 
        });

        // Act: Try to login
        const res = await request(app)
            .post('/login')
            .send({ email: 'mentor@test.com', password: 'password123' });

        // Assert: Your logic should send a 403 Forbidden
        expect(res.statusCode).toBe(403); 
        expect(res.body.message).toContain('pending admin approval');
    });

});