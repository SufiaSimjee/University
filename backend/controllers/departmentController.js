import asyncHandler from '../middleware/asyncHandler.js';
import Department from '../models/departmentModel.js'

// @desc    POST create a department
// @route   POST /api/departments/create
// @access  Private/Admin, QA Manager
const createDepartment = asyncHandler(async (req, res) => {
  
  const { name, description } = req.body;

  const department = new Department({ name, description });

  const createdDepartment = await department.save();
  res.status(201).json(createdDepartment);
  
});

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
const getDepartments = asyncHandler(async (req, res) => {
  
  const departments = await Department.find();
  res.status(200).json(departments);
});

export { getDepartments , createDepartment };
