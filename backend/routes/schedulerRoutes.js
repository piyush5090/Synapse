const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  createSchedule,
  updateScheduleTime,
  deleteSchedule,
  getScheduledPosts
} = require("../controllers/schedulerController");

// Get all scheduled posts for logged-in user (Pagination)
router.get("/", protect, getScheduledPosts);

// Create new schedule
router.post("/", protect, createSchedule);

// Update schedule time
router.put("/:id", protect, updateScheduleTime);

// Delete schedule
router.delete("/:id", protect, deleteSchedule);

module.exports = router;
