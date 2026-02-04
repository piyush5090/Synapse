import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
} from '../controllers/businessController.js';

const router = express.Router();

router.get('/', protect, getBusiness);
router.post('/', protect, createBusiness);
router.put('/', protect, updateBusiness);
router.delete('/', protect, deleteBusiness);

export default router;
