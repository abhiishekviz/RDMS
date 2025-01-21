import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true
  },
  Name: {
    type: String,
    required: true,
    trim: true
  },
  Type: {
    type: String,
    required: true,
    enum: ['CATEGORY'],
    default: 'CATEGORY'
  },
  Code: {
    type: String,
    default: '',
    trim: true
  }
}, { 
  timestamps: true,
  _id: false // Allow custom _id
});

// Indexes
categorySchema.index({ Name: 1 }, { unique: true });
categorySchema.index({ Code: 1 });

export default mongoose.model('Category', categorySchema);