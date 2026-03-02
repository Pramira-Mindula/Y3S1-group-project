import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['user', 'mentor', 'admin'], 
        default: 'user' 
    },
    // Mentor කෙනෙක් නම් පමණක් මේවා අවශ්‍ය වේ
    mentorDetails: {
        expertise: { type: String }, // e.g., Legal, Psychology
        bio: { type: String },
        isVerified: { type: Boolean, default: false } // Admin විසින් අනුමත කළ යුතුය
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);