import express from "express";
import { signup, login, logout } from "../controllers/authController.js";

const router = express.Router();

// New User SignUp Route
router.post("/signup", signup);

// Existing User Login Route
router.post("/login", login);

// Already Logged In User Logout Route
router.post("/logout", logout);

export default router;
