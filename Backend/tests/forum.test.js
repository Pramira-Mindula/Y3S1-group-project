import request from 'supertest';
import express from 'express';
// 1. IMPORT: Grabbing Member 2's controller functions
import { createPost, deletePost, getPosts } from '../controllers/postController.js'; 

// 2. MOCKS: We "fake" the Post and Report models
jest.mock('../models/Post.js');
jest.mock('../models/Report.js');

import Post from '../models/Post.js';
import Report from '../models/Report.js';

// 3. MINI-SERVER: Setting up the routes for Member 2
const app = express();
app.use(express.json());

// We simulate the 'protect' middleware by manually adding a fake user to req
app.use((req, res, next) => {
    req.user = { id: 'user123' }; // This is our "Logged in" user for testing
    next();
});

app.post('/posts', createPost);
app.get('/posts', getPosts);
app.delete('/posts/:id', deletePost);

describe('Member 2: Community Forum Unit Tests', () => {

    /**
     * TEST 1: Ownership Security
     * Logic: If a user tries to delete someone else's post, it should return 403.
     */
    test('Scenario: User cannot delete a post they did not create', async () => {
        // [ARRANGE] Fake a post that belongs to 'user999' (not our test user 'user123')
        Post.findById.mockResolvedValue({
            _id: 'post_abc',
            user: 'user999', // Different owner
            toString: () => 'user999'
        });

        // [ACT] Try to delete it
        const res = await request(app).delete('/posts/post_abc');

        // [ASSERT] Your code should see the ID mismatch and block it
        expect(res.statusCode).toBe(403);
        expect(res.body.message).toBe('Unauthorized to delete this post');
    });

    /**
     * TEST 2: Reported Content Logic
     * Logic: Your code hides posts that are marked as 'Resolved' in the Report database.
     */
    test('Scenario: Hidden posts (Resolved Reports) should not appear in Feed', async () => {
        // [ARRANGE] Pretend there is one "Resolved" report for post 'bad_post_id'
        Report.find.mockReturnValue({
            select: jest.fn().mockResolvedValue([{ postId: 'bad_post_id' }])
        });

        // Pretend the database returns a list of posts
        Post.find.mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockResolvedValue([{ title: 'Good Post', _id: 'good_id' }])
        });

        // [ACT] Get all posts
        const res = await request(app).get('/posts');

        // [ASSERT] Check if the DB query was told to EXCLUDE ($nin) the bad post
        expect(Post.find).toHaveBeenCalledWith(expect.objectContaining({
            _id: { $nin: ['bad_post_id'] }
        }));
        expect(res.statusCode).toBe(200);
    });
});