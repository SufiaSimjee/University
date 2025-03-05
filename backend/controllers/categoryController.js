import asyncHandler from '../middleware/asyncHandler.js';
import Category from '../models/categoryModel.js'

// @desc    Create a category
// @route   POST /api/users/category/create
// @access  Private/Admin , QA Manager
const createCategory = asyncHandler(async (req, res) => {
    
    const { name, department } = req.body;
     
    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
      res.status(400);
      throw new Error('Category already exists');
    }

    const category = await Category.create({
      name,
      department: department || null,
    });
    
    if (category) {
      res.status(201).json(category);
    } else {
      res.status(400);
      throw new Error('Invalid category data');
    }
});


// @desc    Create a category
// @route   POST /api/users/category/create
// @access  Public
const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.status(200).json(categories);
});

export {
    createCategory,
    getAllCategories
};