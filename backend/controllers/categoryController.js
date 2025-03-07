import asyncHandler from '../middleware/asyncHandler.js';
import Category from '../models/categoryModel.js'

// @desc    Create a category
// @route   POST /api/categories/create
// @access  Private/Admin, QA Manager
const createCategory = asyncHandler(async (req, res) => {
    
  const { name, description } = req.body;  
  
  const categoryExists = await Category.findOne({ name });

  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists');
  }

  const category = await Category.create({
    name,
    description
  });
  
  if (category) {
    res.status(201).json(category);
  } else {
    res.status(400);
    throw new Error('Invalid category data');
  }
});

// @desc    Get all categories
// @route   GET /api/categories/
// @access  Private/Admin , QA Manager
const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.status(200).json(categories);
});

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Private/Admin , QA Manager
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if  (category) {
    return res.status(200).json(category);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin , QA Manager
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    await Category.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Category removed' });
  }
  else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin , QA Manager
const updateCategory = asyncHandler(async (req, res) => {

  const category = await Category.findById(req.params.id);

  if (category) {

    category.name = req.body.name || category.name;
    category.description = req.body.description || category.description;

    const updatedCategory = await category.save();

    res.status(200).json(updatedCategory);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

export {
    createCategory,
    getAllCategories,
    getCategoryById,
    deleteCategory,
    updateCategory
   };
