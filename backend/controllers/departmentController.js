import asyncHandler from '../middleware/asyncHandler.js';
import Department from '../models/departmentModel.js';

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
const getAllDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find();
  res.status(200).json(departments);
});

// @desc    Get department by ID
// @route   GET /api/departments/:id
// @access  Private/Admin , QA Manager, QA Coordinator
const getDepartmentById = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id);
  if (department) {
    return res.status(200).json(department);
  } else {
    res.status(404);
    throw new Error('Department not found');
  }
});

// @desc    delete a department
// @route   DELETE /api/departments/:id
// @access  Private/Admin , QA Manager, QA Coordinator
const deleteDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id);
  if (department) {
    await Department.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Department removed' });
  } else {
    res.status(404);
    throw new Error('Department not found');
  }
});

// @desc    Update a department
// @route   PUT /api/departments/:id
// @access  Private/Admin , QA Manager, QA Coordinator
const updateDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id);

  if (department) {
    department.name = req.body.name || department.name;
    department.description = req.body.description || department.description;

    const updatedDepartment = await department.save();

    res.status(200).json(updatedDepartment);
  } else {
    res.status(404);
    throw new Error('Department not found');
  }
});

export {
  getAllDepartments,
  createDepartment,
  getDepartmentById,
  deleteDepartment,
  updateDepartment,
};

