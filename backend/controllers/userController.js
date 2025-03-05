import  User  from "../models/userModel.js";
import Department from '../models/departmentModel.js';
import asyncHandler from '../middleware/asyncHandler.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {

    const {email , password} = req.body;
    const user = await User.findOne({email});

    if(user && await user.matchPassword(password)) {
        
     // generate jwt
        generateToken(res , user._id);

        res.status(200).json({
          _id : user._id,
          fullName : user.fullname,
          email: user.email,
          role :user.role,
          isActive :user.isActive,
          departments : user.departments
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

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  if (role === 'QA Coordinator' && departments && departments.length > 0) {
    const existingQA = await User.findOne({
      role: 'QA Coordinator',
      departments: { $in: departments }, 
    }).populate('departments', 'name'); 

    if (existingQA) {
      res.status(400);
      throw new Error(`The department ${existingQA.departments[0].name} already has a QA Coordinator.`);
    }
  }

  const user = await User.create({
    fullName,
    email,
    password,
    role: role || 'Staff',
    departments: departments || [],  
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      departments: user.departments,
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

     if (req.body.password) {
       user.password = req.body.password;
     }

     const updatedUser = await user.save();

     res.status(200).json({
       _id : updatedUser._id,
       fullName : updatedUser.fullName,
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
  const users = await User.find()
    .populate({
      path: 'departments', 
      select: 'name description', 
    });

  res.status(200).json(users);
});

export {authUser , 
        registerUser , 
        logoutUser, 
        getUsers , 
        getUserProfile ,
        updateUserProfile};
