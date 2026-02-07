import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; 
import { 
  createCampaign, 
  getCampaigns,
  deleteCampaign 
} from '../controllers/emailCampaignController.js';

const router = express.Router();

router.post('/', protect, createCampaign); // Schedule new
router.get('/', protect, getCampaigns);    // List history
router.delete('/:id', protect, deleteCampaign);

export default router;