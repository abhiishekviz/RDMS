import mongoose from 'mongoose';

const subSubCategorySchema = new mongoose.Schema({
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
  SubCat_id: {
    type: Number,
    required: true,
    ref: 'SubCategory'
  },
  Type: {
    type: String,
    required: true,
    enum: ['SUBSUBCATEGORY'],
    default: 'SUBSUBCATEGORY'
  },
  Code: {
    type: String,
    default: '',
    trim: true
  }
}, { 
  timestamps: true,
  _id: false
});

// Indexes
subSubCategorySchema.index({ SubCat_id: 1 });
subSubCategorySchema.index({ Cat_id: 1 });
subSubCategorySchema.index({ Name: 1, SubCat_id: 1 }, { unique: true });

// Validation to ensure Cat_id and SubCat_id exist and match
subSubCategorySchema.pre('save', async function(next) {
  const Category = mongoose.model('Category');
  const SubCategory = mongoose.model('SubCategory');
  
  const [category, subcategory] = await Promise.all([
    Category.findById(this.Cat_id),
    SubCategory.findById(this.SubCat_id)
  ]);

  if (!category) {
    throw new Error('Invalid Category ID');
  }
  if (!subcategory) {
    throw new Error('Invalid SubCategory ID');
  }
  if (subcategory.Cat_id !== this.Cat_id) {
    throw new Error('SubCategory does not belong to specified Category');
  }
  next();
});

export default mongoose.model('SubSubCategory', subSubCategorySchema);