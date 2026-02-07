import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; 
import { 
  addSenderEmail, 
  getSenderEmails, 
  deleteSenderEmail, 
  addRecipients, 
  getRecipients, 
  deleteRecipient 
} from '../controllers/emailSettingsController.js';

const router = express.Router();

// Sender Emails (SMTP)
router.post('/senders', protect, addSenderEmail);
router.get('/senders', protect, getSenderEmails);
router.delete('/senders/:id', protect, deleteSenderEmail);

// Recipients (Contacts)
router.post('/recipients', protect, addRecipients);
router.get('/recipients', protect, getRecipients);
router.delete('/recipients/:id', protect, deleteRecipient);

export default router;