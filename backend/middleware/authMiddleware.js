import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';
import Role from "../models/roleModel.js";

// Protect routes middleware
const protect = asyncHandler(async (req, res, next) => {
   let token = req.cookies.jwt;

   if (token) {
     try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select('-password');
        next();
     } catch (error) {
        console.log(error);
        return next(new Error('Not authorized, token failed'));
     }
   } else {
      return next(new Error('Not authorized, no token'));
   }
});

// Role-based Access Middleware
const roleAccess = (roles) => {
  return asyncHandler(async (req, res, next) => {
    const user = req.user;

    if (!user) {
      return next(new Error('Not authorized, user not found'));
    }

    await user.populate('role', 'name'); 

    if (!roles.includes(user.role.name)) {
      return next(new Error('Not authorized, insufficient role'));
    }

    next();
  });
};
 
export { protect, roleAccess };
