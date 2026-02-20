import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js'; // Member 3 (අලුතින් එකතු කළා)        


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Member 1: User & Auth
app.use('/api/auth', authRoutes);

// Member 3: Resource Library
app.use('/api/resources', resourceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
