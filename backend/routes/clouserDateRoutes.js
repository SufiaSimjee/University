import express from 'express';
import { protect, roleAccess } from '../middleware/authMiddleware.js';
import { createClosureDate , 
         updateClosureDate,
         getLatestClosureDates,
         getClosureDates
        } from '../controllers/closureDateController.js';

const router = express.Router();

router.get('/', protect,roleAccess(['Admin', 'QA Manager' ]), getClosureDates);
router.get('/latest', protect, getLatestClosureDates);
router.post('/', protect, roleAccess(['Admin', 'QA Manager' ]),createClosureDate);
router.put('/:id', protect,roleAccess(['Admin', 'QA Manager' ]), updateClosureDate);


export default router;