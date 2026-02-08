const express = require('express');
const router = express.Router();
const { requireAdmin, protect } = require('../middleware/authMiddleware');

const {
  getAllUsers,
  toggleBanUser,
  deleteUser,
  getAllGeneratedPosts,
  getAllEmailTemplates,
  deleteContent
} = require('../controllers/adminController');

// All routes protected + admin only
router.use(protect);
router.use(requireAdmin);

// --- User Routes ---
router.get('/users', getAllUsers);
router.patch('/users/:userId/ban', toggleBanUser);
router.delete('/users/:userId', deleteUser);

// --- Generated Social Content Routes ---
router.get('/content/social', getAllGeneratedPosts);

// --- Generated Mail Routes ---
router.get('/content/mail', getAllEmailTemplates);

// --- Delete Content Route ---
// :type can be 'social' (for posts) or 'mail' (for templates)
router.delete('/content/:type/:id', deleteContent);

module.exports = router;