import express from 'express';
import { protect, roleAccess } from '../middleware/authMiddleware.js';
import { downloadAllFilesAsZip ,
         downloadcsv,
         downloadcategotycsv , 
         downloaddepartmentcsv , 
         downloadusercsvforadmin ,
         downloadusercsvforqa
         } from '../controllers/fileDownloadController.js';

const router = express.Router();

router.route('/downloadzip').post(protect, roleAccess(['Admin', 'QA Manager']), downloadAllFilesAsZip);
router.route('/downloadcsv').post(protect, roleAccess(['Admin', 'QA Manager']), downloadcsv);
router.route('/downloadcategorycsv').post(protect, roleAccess(['Admin', 'QA Manager']), downloadcategotycsv);
router.route('/downloaddepartmentcsv').post(protect, roleAccess(['Admin', 'QA Manager']), downloaddepartmentcsv);
router.route('/downloadusercsvforadmin').post(protect, roleAccess(['Admin']), downloadusercsvforadmin);
router.route('/downloadusercsvforqa').post(protect, roleAccess(['Admin', 'QA Manager']), downloadusercsvforqa);

export default router;