import express from 'express';
import multer from 'multer';
import Category from '../models/Category.js';
import SubCategory from '../models/SubCategory.js';
import SubSubCategory from '../models/SubSubCategory.js';
import Document from '../models/Document.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb) {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Get Categories
router.get('/categories', auth, async (req, res) => {
  try {
    console.log('Fetching categories...');
    const categories = await Category.find().sort({ Name: 1 });
    console.log('Categories found:', categories.length);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add Category
router.post('/categories', auth, async (req, res) => {
  try {
    const { name, code } = req.body;
    const lastCategory = await Category.findOne().sort({ _id: -1 });
    const newId = lastCategory ? lastCategory._id + 1 : 1;

    const category = new Category({
      _id: newId,
      Name: name,
      Type: 'CATEGORY',
      Code: code || ''
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get SubCategories by Category
router.get('/subcategories/:catId', auth, async (req, res) => {
  try {
    console.log('Fetching subcategories for category:', req.params.catId);
    const subCategories = await SubCategory.find({ 
      Cat_id: parseInt(req.params.catId) 
    }).sort({ Name: 1 });
    console.log('Subcategories found:', subCategories.length);
    res.json(subCategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add SubCategory
router.post('/subcategories', auth, async (req, res) => {
  try {
    const { name, Cat_id } = req.body;
    const lastSubCategory = await SubCategory.findOne().sort({ _id: -1 });
    const newId = lastSubCategory ? lastSubCategory._id + 1 : 1;

    const subCategory = new SubCategory({
      _id: newId,
      Name: name,
      Cat_id: parseInt(Cat_id),
      Type: 'SUBCATEGORY'
    });

    await subCategory.save();
    res.status(201).json(subCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get SubSubCategories by SubCategory
router.get('/subsubcategories/:subCatId', auth, async (req, res) => {
  try {
    console.log('Fetching subsubcategories for subcategory:', req.params.subCatId);
    const subSubCategories = await SubSubCategory.find({ 
      SubCat_id: parseInt(req.params.subCatId) 
    }).sort({ Name: 1 });
    console.log('SubSubcategories found:', subSubCategories.length);
    res.json(subSubCategories);
  } catch (error) {
    console.error('Error fetching subsubcategories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add SubSubCategory
router.post('/subsubcategories', auth, async (req, res) => {
  try {
    const { name, Cat_id, SubCat_id, code } = req.body;
    const lastSubSubCategory = await SubSubCategory.findOne().sort({ _id: -1 });
    const newId = lastSubSubCategory ? lastSubSubCategory._id + 1 : 1;

    const subSubCategory = new SubSubCategory({
      _id: newId,
      Name: name,
      Cat_id: parseInt(Cat_id),
      SubCat_id: parseInt(SubCat_id),
      Type: 'SUBSUBCATEGORY',
      Code: code || ''
    });

    await subSubCategory.save();
    res.status(201).json(subSubCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload Document
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const { 
      form,
      category,
      subCategory,
      subSubCategory,
      description,
      keyword,
      fileDate
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Validate required fields
    if (!form || !category || !description || !keyword || !fileDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const document = new Document({
      form,
      title: req.file.originalname,
      description,
      category: parseInt(category),
      subCategory: subCategory ? parseInt(subCategory) : null,
      subSubCategory: subSubCategory ? parseInt(subSubCategory) : null,
      file: {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        data: req.file.buffer
      },
      uploadedBy: req.user.userId,
      keywords: keyword.split(',').map(k => k.trim()),
      fileDate: new Date(fileDate)
    });

    await document.save();
    res.status(201).json({ message: 'Document uploaded successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

// Search Documents
router.get('/search', auth, async (req, res) => {
  try {
    const { keyword, category, subCategory, subSubCategory, startDate, endDate } = req.query;
    
    let query = { uploadedBy: req.user.userId };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { keywords: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = parseInt(category);
    }

    if (subCategory) {
      query.subCategory = parseInt(subCategory);
    }

    if (subSubCategory) {
      query.subSubCategory = parseInt(subSubCategory);
    }

    if (startDate || endDate) {
      query.fileDate = {};
      if (startDate) query.fileDate.$gte = new Date(startDate);
      if (endDate) query.fileDate.$lte = new Date(endDate);
    }

    const documents = await Document.find(query)
      .populate('category')
      .populate('subCategory')
      .populate('subSubCategory')
      .sort({ createdAt: -1 });

    res.json(documents);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error during search' });
  }
});

export default router;