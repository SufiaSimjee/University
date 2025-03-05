import express from 'express';
import {protect , roleAccess} from "../middleware/authMiddleware.js";
import {
    createCategory,
    getAllCategories,
} from '../controllers/categoryController.js';

const router = express.Router();

router.route('/').get(getAllCategories);
router.route('/create').post(protect, roleAccess(['Admin', 'QA Manager']),  createCategory);

export default router;
