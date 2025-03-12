import  User  from "../models/userModel.js";
import Department from '../models/departmentModel.js';
import Role from '../models/roleModel.js';
import asyncHandler from '../middleware/asyncHandler.js';
import generateToken from "../utils/generateToken.js";


// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {

    const {email , password} = req.body;
    const user = await User.findOne({ email })
      .populate('departments', 'name')
      .populate('role', 'name');

    if(user && await user.matchPassword(password)) {
        
     // generate jwt
       
        generateToken(res , user._id);

        res.status(200).json({
          _id : user._id,
          fullName : user.fullName,
          email: user.email,
          role: {
            id: user.role._id,  
            name: user.role.name 
          },
          isActive :user.isActive,
          departments: user.departments.map(department => ({
            id: department._id,
            name: department.name,
          })),
        });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    } 
});


// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, role, departments } = req.body;

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;
  if (!passwordRegex.test(password)) {
    res.status(400);
    throw new Error('Password must be between 8 to 12 characters, contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
  }

  const userExists = await User.findOne({ email })
    .populate('departments', 'name')
    .populate('role', 'name');

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  let defaultRole;
  if (!role) {
    defaultRole = await Role.findOne({ name: 'Staff' });
    if (!defaultRole) {
      res.status(400);
      throw new Error('Default role "Staff" not found');
    }
  } else {
    defaultRole = await Role.findById(role);
  }

  if (role && defaultRole.name === 'QA Coordinator' && departments && departments.length > 0) {
    const existingQA = await User.findOne({
      role: defaultRole._id,
      departments: { $in: departments },
    }).populate('departments', 'name')
      .populate('role', 'name');

    if (existingQA) {
      res.status(400);
      throw new Error(`The department ${existingQA.departments[0].name} already has a QA Coordinator.`);
    }
  }

  const user = await User.create({
    fullName,
    email,
    password,
    role: defaultRole._id,
    isActive: true,
    departments: departments || [],
  });

  const populatedUser = await User.findById(user._id)
    .populate('departments', 'name')
    .populate('role', 'name');

  if (populatedUser) {
    generateToken(res, user._id);

    res.status(200).json({
      _id: populatedUser._id,
      fullName: populatedUser.fullName,
      email: populatedUser.email,
      role: {
        id: populatedUser.role._id,
        name: populatedUser.role.name,
      },
      isActive: populatedUser.isActive,
      departments: populatedUser.departments.map(department => ({
        id: department._id,
        name: department.name,
      })),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});


// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {

  // clear jwt cookie
  res.cookie('jwt' , '' , {
    httpOnly : true,
    expires : new Date(0),
  })

  res.status(200).json({message : 'Logged out successfully'});
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('departments', 'name');

  if(user) {
    res.status(200).json({
      _id : user._id,
      fullName : user.fullName,
      email: user.email,
      role: user.role,
      departments: user.departments,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  
  const user = await User.findById(req.user._id).populate('departments', 'name');

  if (user) {
    user.fullName = req.body.name || user.fullName;
    user.email = req.body.email || user.email;

    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    // Update departments if provided
    if (req.body.departments && Array.isArray(req.body.departments)) {
      user.departments = req.body.departments;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      departments: updatedUser.departments, 
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users with their department details
// @route   GET /api/users
// @access  Private/Admin , QA Manager
const getUsers = asyncHandler(async (req, res) => {
  const adminRole = await Role.findOne({ name: "Admin" });

  if (adminRole) {
    const users = await User.find({ role: { $ne: adminRole._id } }) 
      .populate({
        path: 'departments',
        select: 'name',  
      })
      .populate({
        path: 'role',
        select: 'name',  
      });

    res.status(200).json(users);
  } else {
    res.status(400).json({ message: "Admin role not found in the system." });
  }
});

// @desc    Get all users excluding Admin and QA Manager with their department details
// @route   GET /api/users/excluding-admin-and-qa
// @access  Private/Admin , QA Manager
const getUsersQA = asyncHandler(async (req, res) => {
  const adminRole = await Role.findOne({ name: "Admin" });
  const qaManagerRole = await Role.findOne({ name: "QA Manager" });

  if (adminRole && qaManagerRole) {
    const users = await User.find({
      $and: [
        { role: { $ne: adminRole._id } },
        { role: { $ne: qaManagerRole._id } }
      ]
    })
      .populate({
        path: 'departments',
        select: 'name',  
      })
      .populate({
        path: 'role',
        select: 'name',  
      });

    res.status(200).json(users);
  } else {
    res.status(400).json({ message: "Admin or QA Manager role not found in the system." });
  }
});

// @desc    Get single user details with populated role and departments
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .populate({
      path: 'departments', 
      select: 'name', 
    })
    .populate({
      path: 'role', 
      select: 'name'  
    });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json(user);
});

// @desc    Get staff users in the same department as the logged-in QA Coordinator
// @route   GET /api/users/qac/users
// @access  Private/QA Coordinator
const getUsersQAC = asyncHandler(async (req, res) => {
  const qaCoordinatorRole = await Role.findOne({ name: "QA Coordinator" });
  const staffRole = await Role.findOne({ name: "Staff" });

  if (!qaCoordinatorRole || !staffRole) {
    res.status(400);
    throw new Error('Required roles not found in the system');
  }

  if (!req.user || req.user.role.name !== 'QA Coordinator') {
    res.status(401);
    throw new Error('Not authorized, only QA Coordinators can access this data');
  }

  const qaCoordinatorDepartments = req.user.departments.map(department => department._id);

  const staffUsers = await User.find({
    role: staffRole._id,  
    departments: { $in: qaCoordinatorDepartments },  
  })
    .populate({
      path: 'departments',
      select: 'name',
    })
    .populate({
      path: 'role',
      select: 'name',
    });

  if (!staffUsers || staffUsers.length === 0) {
    res.status(404);
    throw new Error('No staff users found in this department(s)');
  }

  res.status(200).json(staffUsers);
});


export {authUser , 
        registerUser , 
        logoutUser, 
        getUsers , 
        getUsersQA ,
        getUsersQAC,
        getUserProfile ,
        updateUserProfile , 
        getUserDetails
      };
