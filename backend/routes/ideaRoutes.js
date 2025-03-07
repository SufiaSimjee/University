import express from 'express';
import { protect, roleAccess } from '../middleware/authMiddleware.js';
import { createIdea } from '../controllers/ideaController.js';
const router = express.Router();
router
  .route('/create')
  .post( createIdea);

export default router;
