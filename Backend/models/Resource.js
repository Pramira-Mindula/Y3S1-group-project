import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Title is required'], 
        trim: true 
    },
    category: { 
        type: String, 
        required: [true, 'Category is required'], 
        enum: {
            values: ['Legal', 'Health', 'Career', 'Safety'],
            message: '{VALUE} is not a supported category'
        }
    },
    content: { 
        type: String, 
        required: [true, 'Content is required'] 
    },
    link: { 
        type: String, 
        trim: true,
        // URL එකක්දැයි පරීක්ෂා කිරීමට සරල validation එකක් (optional)
        match: [/^https?:\/\/.+/, 'Please enter a valid URL']
    }, 
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true // ලිපියක් දාන කෙනෙක් අනිවාර්යයෙන් ඉන්න ඕන නිසා
    } 
}, { 
    timestamps: true // මෙයින් createdAt සහ updatedAt ස්වයංක්‍රීයව සෑදේ
});

// Search පහසුකම වේගවත් කිරීමට Title එකට Index එකක් එක් කිරීම
resourceSchema.index({ title: 'text' });

export default mongoose.model('Resource', resourceSchema);