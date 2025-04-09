import express from 'express';
import { protect, roleAccess } from '../middleware/authMiddleware.js';
import { reportIdea ,
         getReportsByIdeaId
 } from '../controllers/ideaReportController.js';

const router = express.Router();

router.route('/create').post(protect, reportIdea);

router.route('/:ideaId').get(protect, protect, roleAccess(['Admin', 'QA Manager']), getReportsByIdeaId);

export default router;