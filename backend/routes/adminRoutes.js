const express = require('express');
const router = express.Router();

// Middleware
const {requireAdmin, protect } = require('../middleware/authMiddleware');

// Controller
const {
  getAllUsers,
  toggleBanUser,
  getAllGeneratedPosts,
  getAllScheduledPosts,
  deleteContent
} = require('../controllers/adminController');

// All routes here are protected AND admin-only
router.use(protect);
router.use(requireAdmin);

// User Routes
router.get('/users', getAllUsers);
router.patch('/users/:userId/ban', toggleBanUser); // Body: { banStatus: true/false }

// Content Routes
router.get('/content/generated', getAllGeneratedPosts);
router.get('/content/scheduled', getAllScheduledPosts);

// Delete Content (:type = 'generated' or 'scheduled')
router.delete('/content/:type/:id', deleteContent);

module.exports = router;