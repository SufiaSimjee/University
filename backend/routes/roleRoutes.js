import express from 'express';
import {
    getAllRoles,
    createRole,
} from '../controllers/roleController.js';
import { protect, roleAccess } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get( getAllRoles);
router .route('/create').post( createRole);

export default router;