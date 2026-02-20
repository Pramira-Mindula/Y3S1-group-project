import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { 
        type: String, 
        required: true, 
        enum: ['Legal', 'Health', 'Career', 'Safety'] // PDF එකේ සඳහන් උදාහරණ අනුව [cite: 39]
    },
    content: { type: String, required: true },
    link: { type: String }, // PDF link හෝ වෙනත් මූලාශ්‍ර සඳහා [cite: 42, 47]
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
}, { timestamps: true });

export default mongoose.model('Resource', resourceSchema);