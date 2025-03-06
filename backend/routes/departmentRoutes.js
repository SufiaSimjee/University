import express from 'express';
import {
  getAllDepartments,
  createDepartment,
  getDepartmentById,
  deleteDepartment,
  updateDepartment,
} from '../controllers/departmentController.js';
import { protect, roleAccess } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, roleAccess(['Admin', 'QA Manager']), getAllDepartments);
router
  .route('/create')
  .post(protect, roleAccess(['Admin', 'QA Manager']), createDepartment);
router
  .route('/:id')
  .delete(protect, roleAccess(['Admin', 'QA Manager']), deleteDepartment)
  .put(
    protect,
    roleAccess(['Admin', 'QA Manager', 'QA Coordinator']),
    updateDepartment
  )
  .get(
    protect,
    roleAccess(['Admin', 'QA Manager', 'QA Coordinator']),
    getDepartmentById
  );
export default router;