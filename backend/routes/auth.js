// routes/auth.js — Authentication routes
import express from "express";
import {
  register,
  login,
  refresh,
  logout,
  getCurrentUser,
  updateProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);

// Protected routes
router.post("/logout", protect, logout);
router.get("/me", protect, getCurrentUser);
router.put("/profile", protect, updateProfile);

export default router;
