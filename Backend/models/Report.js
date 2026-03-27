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

// same user cannot replicate the same post two ways
reportSchema.index({ postId: 1, reportedBy: 1 }, { unique: true });

export default mongoose.model('Report', reportSchema);