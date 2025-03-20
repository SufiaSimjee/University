import mongoose from "mongoose";
import  User  from "../models/userModel.js";
import Department from '../models/departmentModel.js';
import Idea from "../models/ideaModel.js";
import Role from '../models/roleModel.js';
import asyncHandler from '../middleware/asyncHandler.js';
import generateToken from "../utils/generateToken.js";


// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email })
      .populate('departments', 'name')
      .populate('role', 'name');

  if (user && user.isActive) {
      if (await user.matchPassword(password)) {
          generateToken(res, user._id);
          res.status(200).json({
              _id: user._id,
              fullName: user.fullName,
              email: user.email,
              role: {
                  id: user.role._id,
                  name: user.role.name
              },
              isActive: user.isActive,
              departments: user.departments.map(department => ({
                  id: department._id,
                  name: department.name,
              })),
          });
      } else {
          res.status(401);
          throw new Error('Invalid email or password');
      }
  } else if (user && !user.isActive) {
      // If user is inactive, throw an error
      res.status(403);
      throw new Error('Your account has been disabled');
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


// @desc    Register a new user
// @route   POST /api/users/add
// @access  Public
const registerUserForManager = asyncHandler(async (req, res) => {
  const { fullName, email, password, role, departments } = req.body;

  if(fullName == null || email == null || password == null || role == null ) {
    res.status(400);
    throw new Error('All fields are required');
  }
  
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

  if ((defaultRole.name === 'Staff' || defaultRole.name === 'QA Coordinator') && (!departments || departments.length === 0)) {
    res.status(400);
    throw new Error(`Departments must be selected for the role "${defaultRole.name}".`);
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

   if(user) {
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: {
        id: user.role._id,
        name: user.role.name,
      },
      isActive: user.isActive,
      departments: user.departments.map(department => ({
        id: department._id,
        name: department.name,
      })),
    });
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
  const user = await User.findById(req.user._id)
    .populate('departments', 'name')
    .populate('role', 'name');

    if (user) {
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: {
        id: user.role._id,
        name: user.role.name,
      },
      isActive: user.isActive,
      departments: user.departments.map(department => ({
        id: department._id,
        name: department.name,
      })),
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
  
  const user = await User.findById(req.user._id);

  if (user) {
    user.fullName = req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;

    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
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
    .populate('departments', 'name') 
    .populate('role', 'name');      

  if (!staffUsers || staffUsers.length === 0) {
    res.status(404);
    res.json({ message: 'No user found in the same department(s)' });
    return;
  }
  res.status(200).json(staffUsers);
});

// @desc    Delete user and associtead idea
// @route   DELETE /api/users/:id
// @access  Private/Admin/QA Manager
const deleteUser = asyncHandler(async (req, res) => {
 
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid user ID');
  }

  const user = await User.findById(id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await Idea.deleteMany({ userId: id });

  await User.findByIdAndDelete(id);

  res.status(200).json({ message: 'User and associated ideas deleted successfully' });
});


// @desc    Update user information
// @route   PUT /api/users/update/:id/manager
// @access  Private/Admin/QA Manager/ QA Coordinator
const updateUserInfo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { fullName, email, role, departments, isActive } = req.body;

  const user = await User.findById(id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (fullName) user.fullName = fullName;
  if (email) user.email = email;

  // Ensure isActive is only updated if explicitly provided
  if (typeof isActive === "boolean") {
    user.isActive = isActive;
  }

  // Validate and update role if provided
  if (role) {
    const validRole = await Role.findById(role);
    if (!validRole) {
      res.status(400);
      throw new Error("Invalid role");
    }
    user.role = role;
  }

  // Validate and update departments if provided
  if (departments && Array.isArray(departments) && departments.length > 0) {
    const validDepartments = await Department.find({ _id: { $in: departments } });
    if (validDepartments.length !== departments.length) {
      res.status(400);
      throw new Error("Invalid department(s)");
    }
    user.departments = departments;
  }

  const updatedUser = await user.save();

  res.status(200).json('message: User updated successfully');
});

export {authUser , 
        registerUser , 
        registerUserForManager,
        logoutUser, 
        getUsers , 
        getUsersQA ,
        getUsersQAC,
        getUserProfile ,
        updateUserProfile , 
        updateUserInfo,
        getUserDetails ,
        deleteUser,
      };
