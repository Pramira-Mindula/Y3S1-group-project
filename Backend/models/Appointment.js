import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    mentorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    date: { 
        type: Date, 
        required: [true, 'Appointment date is required'] 
    },
    reason: { 
        type: String, 
        required: [true, 'Reason for appointment is required'],
        trim: true 
    },
    status: { 
        type: String, 
        enum: ['Available', 'Booked', 'Pending', 'Approved', 'Completed', 'Cancelled'], 
        default: 'Available' 
    }
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);