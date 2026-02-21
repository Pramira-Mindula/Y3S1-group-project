import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    postId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post', 
        required: true 
    },
    reportedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    reason: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Resolved', 'Dismissed'], 
        default: 'Pending' 
    }
}, { timestamps: true });

// Business Logic: එකම User ට එකම Post එක දෙපාරක් Report කළ නොහැක
reportSchema.index({ postId: 1, reportedBy: 1 }, { unique: true });

export default mongoose.model('Report', reportSchema);