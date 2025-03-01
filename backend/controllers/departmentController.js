import Department from '../models/departmentModel.js'

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    console.error(error);
    res.status(404);
    throw new Error('Department not found');
    
  }
};

export { getDepartments };
