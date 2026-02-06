import express from "express";
import { signup, login, logout, getMe } from "../controllers/authController.js";

const router = express.Router();

// New User SignUp Route
router.post("/signup", signup);

// Existing User Login Route
router.post("/login", login);

// Already Logged In User Logout Route
router.post("/logout", logout);

// LoggedIn user info route 
router.get('/me', protect, getMe);

export default router;
