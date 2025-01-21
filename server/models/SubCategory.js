import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true
  },
  Name: {
    type: String,
    required: true,
    trim: true
  },
  Cat_id: {
    type: Number,
    required: true,
    ref: 'Category'
  },
  Type: {
    type: String,
    required: true,
    enum: ['SUBCATEGORY'],
    default: 'SUBCATEGORY'
  }
}, { 
  timestamps: true,
  _id: false
});

// Indexes
subCategorySchema.index({ Cat_id: 1 });
subCategorySchema.index({ Name: 1, Cat_id: 1 }, { unique: true });

// Validation to ensure Cat_id exists
subCategorySchema.pre('save', async function(next) {
  const Category = mongoose.model('Category');
  const category = await Category.findById(this.Cat_id);
  if (!category) {
    throw new Error('Invalid Category ID');
  }
  next();
});

export default mongoose.model('SubCategory', subCategorySchema);