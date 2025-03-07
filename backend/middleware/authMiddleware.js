import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';

// protect routes
const protect = asyncHandler(async (req, res, next) => {
   let token;
   token = req.cookies.jwt;  
   console.log()

   if (token) {
     try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select('-password');
        next();
     } catch (error) {
        console.log(error)
        res.status(401);
        throw new Error('Not authorized, token failed');
     }
   } else {
      res.status(401);
      throw new Error('Not authorized, no token');
   }
});

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
