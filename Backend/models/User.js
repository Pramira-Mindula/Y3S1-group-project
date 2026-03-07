import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    resetOTP: { type: String },
    resetOTPExpiry: { type: Date },
    role: { 
        type: String, 
        enum: ['user', 'mentor', 'admin'], 
        default: 'user' 
    },
    // Details only needed if a center is a mentor
    mentorDetails: {
        expertise: { type: String }, 
        bio: { type: String },
        isVerified: { type: Boolean, default: false }
    },
    // Contacting a user (Releaseship)
    myMentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);