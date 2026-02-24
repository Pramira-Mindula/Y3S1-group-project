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
    // Mentor කෙනෙක් නම් පමණක් අවශ්‍ය විස්තර
    mentorDetails: {
        expertise: { type: String }, 
        bio: { type: String },
        isVerified: { type: Boolean, default: false }
    },
    // User කෙනෙක් Mentor කෙනෙක්ව සම්බන්ධ කරගැනීම (Relationship)
    myMentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);