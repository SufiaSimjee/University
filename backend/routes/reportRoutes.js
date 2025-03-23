import express from 'express';
import { protect, roleAccess } from '../middleware/authMiddleware.js';
import { getIdeasByDepartment , 
        getPercentageOfIdeasByDepartment ,
        getContributorsByDepartment,
        getAnonymousIdeasAndComments ,
        getIdeasWithAndWithoutComments,
        getCategoryCount,
        getDepartmentCount,
        getNonAnonymousIdeasCount,
        getAnonymousIdeasCount,
        getUserIdeasCount,
        getDepartmentUserCount
        } from '../controllers/reportController.js';

const router = express.Router();
router.route('/getnumberofideasbydepartment').get(protect, roleAccess(['Admin', 'QA Manager']),  getIdeasByDepartment);
router.route('/getpercentageofideasbydepartment').get(protect,roleAccess(['Admin', 'QA Manager']),  getPercentageOfIdeasByDepartment);
router.route('/getnumberofcontributorsbydepartment').get(protect,roleAccess(['Admin', 'QA Manager']),  getContributorsByDepartment);
router.route('/getanonymousideasandcomments').get(protect,roleAccess(['Admin', 'QA Manager']),  getAnonymousIdeasAndComments);
router.route('/getIdeaswithandwithoutcomments').get(protect,roleAccess(['Admin', 'QA Manager']),  getIdeasWithAndWithoutComments);
router.route('/getcategorycount').get(protect,roleAccess(['Admin', 'QA Manager']),  getCategoryCount);
router.route('/getdepartmentcount').get(protect,roleAccess(['Admin', 'QA Manager']),  getDepartmentCount);
router.route('/getnonanonymousideascount').get(protect,roleAccess(['Admin', 'QA Manager']),  getNonAnonymousIdeasCount);
router.route('/getanonymousideascount').get(protect,roleAccess(['Admin', 'QA Manager']),  getAnonymousIdeasCount);

//for staff and QA Coordinator
router.route('/getuserideascount').get(protect,  getUserIdeasCount);
router.route('/getdepartmentusercount').get(protect,roleAccess(['QA Coordinator']),  getDepartmentUserCount);


export default router;