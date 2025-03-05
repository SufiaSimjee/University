import express from 'express';
import { getDepartments , createDepartment } from '../controllers/departmentController.js';
import {protect , roleAccess} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/', getDepartments);
router.post('/create', protect , roleAccess(['Admin', 'QA Manager']), createDepartment);


export default router;
