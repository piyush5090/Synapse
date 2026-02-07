import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; 
import upload from '../middleware/uploadMiddleware.js'; // <--- Import your EXISTING file as-is
import { 
  uploadEmailImage, 
  createTemplate, 
  updateTemplate, 
  getTemplates, 
  deleteTemplate,
  generateAiTemplate,
  generateEmailImage
} from '../controllers/emailTemplateController.js';

const router = express.Router();

// --- AI Generation ---
router.post('/generate-text', protect, generateAiTemplate);
router.post('/generate-image', protect, generateEmailImage);

// --- Manual Upload Route ---
// usage: upload.single('image') MUST match the formData name on frontend
router.post('/upload-image', protect, upload.single('image'), uploadEmailImage);

// --- Template CRUD ---
router.post('/', protect, createTemplate);
router.get('/', protect, getTemplates);
router.put('/:id', protect, updateTemplate);
router.delete('/:id', protect, deleteTemplate);

export default router;