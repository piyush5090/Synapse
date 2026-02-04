const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");


const {
  generateAd,
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  createManualPost
} = require("../controllers/contentController");

// Ad Generation route using AI
router.post("/generate-ad", protect, generateAd);

// Create new post entry route
router.post("/", protect, createPost);

// Create new post entry without AI (manual upload)
router.post("/manual", protect, upload.single("image"), createManualPost);

// Get Posts route
router.get("/", protect, getPosts);

// Get a Single Postby id
router.get("/:id", protect, getPostById);

// Update a post by id
router.put("/:id", protect, updatePost);

// Delete a post by id
router.delete("/:id", protect, deletePost);

module.exports = router;
