import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import express from 'express';

// 1. Controllers
import { register, login } from '../controllers/authController.js';
import { createPost } from '../controllers/postController.js'; 

// 2. Middleware - Update the filename below (e.g., 'people.js' or 'auth.js')
// We are looking inside your "Middleware" folder now
import { protect } from '../Middleware/authMiddleware.js'; 

const app = express();
app.use(express.json());

// 3. ROUTES
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.post('/api/posts', protect, createPost); 

describe('Full System Integration Test', () => {
    let mongoServer;
    let userToken;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
        // This MUST match the secret in your login controller
        process.env.JWT_SECRET = 'test_secret_123'; 
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    test('Integration Flow: Auth -> Middleware -> Post Creation', async () => {
        // Register
        await request(app).post('/api/auth/register').send({
            username: 'Sasa',
            email: 'sasa@test.com',
            password: 'password123'
        });

        // Login
        const loginRes = await request(app).post('/api/auth/login').send({
            email: 'sasa@test.com',
            password: 'password123'
        });
        
        userToken = loginRes.body.token;

        // Create Post (This proves the Middleware/People file is working!)
        const postRes = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${userToken}`) 
            .send({
                title: 'Integration Successful',
                description: 'Middleware folder path is now correct.',
                category: 'General'
            });

        expect(postRes.statusCode).toBe(201);
    });
});