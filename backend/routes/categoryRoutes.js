import express from 'express';
import { protect, roleAccess } from '../middleware/authMiddleware.js';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
  updateCategory,
} from '../controllers/categoryController.js';

const router = express.Router();

router.route('/').get(getAllCategories);
router
  .route('/create')
  .post(protect, roleAccess(['Admin', 'QA Manager']), createCategory);
router
  .route('/:id')
  .delete(protect, roleAccess(['Admin', 'QA Manager']), deleteCategory)
  .put(protect, roleAccess(['Admin', 'QA Manager']), updateCategory)
  .get(protect, getCategoryById);

export default router;
