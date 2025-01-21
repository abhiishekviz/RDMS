import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  form: {
    type: String,
    required: true,
    enum: ['Regulation', 'Order', 'Guideline', 'Policy', 'Circular', 'Notice']
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: Number,
    required: true,
    ref: 'Category'
  },
  subCategory: {
    type: Number,
    ref: 'SubCategory'
  },
  subSubCategory: {
    type: Number,
    ref: 'SubSubCategory'
  },
  file: {
    filename: {
      type: String,
      required: true
    },
    contentType: {
      type: String,
      required: true
    },
    data: {
      type: Buffer,
      required: true
    }
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  keywords: [{
    type: String,
    trim: true
  }],
  fileDate: {
    type: Date,
    required: true
  }
}, { 
  timestamps: true 
});

// Indexes for efficient searching
documentSchema.index({ title: 'text', description: 'text', keywords: 'text' });
documentSchema.index({ category: 1 });
documentSchema.index({ subCategory: 1 });
documentSchema.index({ subSubCategory: 1 });
documentSchema.index({ uploadedBy: 1 });
documentSchema.index({ fileDate: 1 });

export default mongoose.model('Document', documentSchema);