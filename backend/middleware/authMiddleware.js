import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';

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
const roleAccess = (roles = []) => {
   return async (req, res, next) => {
     if (!req.user) {
       return next(new Error('Not authorized, no user found'));
     }

     if (roles.length && !roles.includes(req.user.role)) {
       return next(new Error('Not authorized for this role'));
     }
     next();
   };
 };
 
export { protect, roleAccess };
