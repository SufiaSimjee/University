import express from "express";
import {
        authUser , 
        registerUser , 
        logoutUser , 
        getUsers, 
        getUserProfile ,
        updateUserProfile,
        getUserDetails ,
        getUsersQA ,
        getUsersQAC
        } from "../controllers/userController.js";
import {protect , roleAccess} from "../middleware/authMiddleware.js";

const router = express.Router();

router.route('/auth').post(authUser);
router.route('/profile').get(protect ,getUserProfile).put(protect, updateUserProfile);
router.route('/').post(registerUser).get(protect, roleAccess(['Admin', 'QA Manager']), getUsers);
router.route('/qa').get(protect, roleAccess(['QA Manager']), getUsersQA);
router.route('/qac').get(protect, roleAccess(['QA Coordinator']), getUsersQAC);
router.route('/logout').post(logoutUser);
router.route('/:id').get(protect, roleAccess(['Admin', 'QA Manager' , 'QA Coordinator']), getUserDetails);

export default router;