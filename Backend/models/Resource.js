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
        // URL A simple validation (optional) to check if one is one
        match: [/^https?:\/\/.+/, 'Please enter a valid URL']
    }, 
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    } 
}, { 
    timestamps: true // Of this, the createdAt and the upledAt are automatically made
});

// Adding an index to the title to speed up the Search facility
resourceSchema.index({ title: 'text' });

export default mongoose.model('Resource', resourceSchema);