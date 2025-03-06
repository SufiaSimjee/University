import asyncHandler from '../middleware/asyncHandler.js';
import Role from '../models/roleModel.js'

// @desc    POST create a role
// @route   POST /api/roles/create
// @access  Private/Admin, QA Manager
const createRole = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const role = new Role({ name });

  const createdrole = await role.save();
  res.status(201).json(createdrole);
});

// @desc    Get all role
// @route   GET /api/roles
// @access  Public
const getAllRoles = asyncHandler(async (req, res) => {
  const role = await Role.find();
  res.status(200).json(role);
});



export {
  getAllRoles,
  createRole,
};

