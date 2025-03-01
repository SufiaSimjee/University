import express from "express";
import {authUser , 
        registerUser , 
        logoutUser , 
        getUsers, 
        getUserProfile ,
        updateUserProfile
        } from "../controllers/userController.js";
import {protect , roleAccess} from "../middleware/authMiddleware.js";

const router = express.Router();

router.route('/auth').post(authUser);
router.route('/profile').get(protect ,getUserProfile).put(protect, updateUserProfile);
router.route('/').post(registerUser).get(protect, roleAccess(['Admin', 'QA Manager']), getUsers);
router.route('/logout').post(logoutUser);

export default router;