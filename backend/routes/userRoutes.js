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
        getUsersQAC ,
        deleteUser,
        registerUserForManager,
        updateUserInfo,
        } from "../controllers/userController.js";
import {protect , roleAccess} from "../middleware/authMiddleware.js";

const router = express.Router();

router.route('/auth').post(authUser);
router.route('/profile').get(protect ,getUserProfile).put(protect, updateUserProfile);
router.route('/update/:id/manager').put(protect, roleAccess(['Admin', 'QA Manager' , 'QA Coordinator']), updateUserInfo);
router.route('/').post(registerUser).get(protect, roleAccess(['Admin']), getUsers);
router.route('/add').post(protect, roleAccess(['Admin', 'QA Manager', 'QA Coordinator' ]), registerUserForManager);
router.route('/qa').get(protect, roleAccess(['QA Manager']), getUsersQA);
router.route('/qac').get(protect, roleAccess(['QA Coordinator']), getUsersQAC);
router.route('/logout').post(logoutUser);
router.route('/:id').get(protect, roleAccess(['Admin', 'QA Manager' , 'QA Coordinator']), getUserDetails)
.delete(protect, roleAccess(['Admin', 'QA Manager' , 'QA Coordinator']), deleteUser);

export default router;