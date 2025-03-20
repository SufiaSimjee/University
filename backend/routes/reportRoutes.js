import express from 'express';
import { protect, roleAccess } from '../middleware/authMiddleware.js';
import { getIdeasByDepartment , 
        getPercentageOfIdeasByDepartment ,
        getContributorsByDepartment,
        getAnonymousIdeasAndComments
        } from '../controllers/reportController.js';

const router = express.Router();
router.route('/getnumberofideasbydepartment').get(protect,  getIdeasByDepartment);
router.route('/getpercentageofideasbydepartment').get(protect, getPercentageOfIdeasByDepartment);
router.route('/getnumberofcontributorsbydepartment').get(protect, getContributorsByDepartment);
router.route('/getanonymousideasandcomments').get(protect, getAnonymousIdeasAndComments);

export default router;