const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  getPlatformPerformance,
  getTopPerformingPosts,
} = require("../controllers/analyticsController");

router.get("/platform-performance", protect, getPlatformPerformance);
router.get("/top-posts", protect, getTopPerformingPosts);

module.exports = router;
