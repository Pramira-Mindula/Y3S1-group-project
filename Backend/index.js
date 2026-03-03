import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js'; // Member 3 (අලුතින් එකතු කළා)  
import reportRoutes from './routes/reportRoutes.js'; // Member 4 (අලුතින් එකතු කළා) 
import postRoutes from './routes/postRoutes.js';
import chatRoutes from './routes/chat.js';
import appointmentRoutes from './routes/appointmentRoutes.js';





dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Member 1: User & Auth
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);

// Member 3: Resource Library
app.use('/api/resources', resourceRoutes);


// ... අනෙක් imports
app.use('/api/safety',reportRoutes);


//Community-forum

app.use('/api/posts', postRoutes);

app.use('/api/chatbot', chatRoutes);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
