// controllers/authController.js — Authentication logic
import User from "../models/User.js";
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../middleware/auth.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";
import { validateRegisterInput, validateLoginInput, sanitizeInput } from "../utils/validators.js";

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  const validation = validateRegisterInput(name, email, password);
  if (!validation.isValid) {
    return res.status(400).json({ errors: validation.errors });
  }

  // Sanitize input
  const sanitizedName = sanitizeInput(name);
  const sanitizedEmail = sanitizeInput(email).toLowerCase();

  // Check if user already exists
  const existingUser = await User.findOne({ email: sanitizedEmail });
  if (existingUser) {
    return res.status(400).json({ error: "Email already registered" });
  }

  // Create user
  const user = await User.create({
    name: sanitizedName,
    email: sanitizedEmail,
    password,
  });

  // Generate tokens
  const accessToken = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token to database
  user.refreshToken = refreshToken;
  await user.save();

  // Return response
  res.status(201).json({
    message: "User registered successfully",
    user: user.toJSON(),
    accessToken,
    refreshToken,
  });
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  const validation = validateLoginInput(email, password);
  if (!validation.isValid) {
    return res.status(400).json({ errors: validation.errors });
  }

  const sanitizedEmail = sanitizeInput(email).toLowerCase();

  // Find user and include password field
  const user = await User.findOne({ email: sanitizedEmail }).select("+password");
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Check password
  const isPasswordCorrect = await user.matchPassword(password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Generate tokens
  const accessToken = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token to database
  user.refreshToken = refreshToken;
  await user.save();

  // Return response
  res.status(200).json({
    message: "Login successful",
    user: user.toJSON(),
    accessToken,
    refreshToken,
  });
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token required" });
  }

  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }

  // Find user
  const user = await User.findById(decoded.id);
  if (!user || user.refreshToken !== refreshToken) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }

  // Generate new access token
  const newAccessToken = generateToken(user._id);

  res.status(200).json({
    message: "Token refreshed",
    accessToken: newAccessToken,
  });
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (clear refresh token)
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  res.status(200).json({ message: "Logout successful" });
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json({
    user: user.toJSON(),
  });
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Update fields if provided
  if (name) {
    if (name.trim().length < 2) {
      return res.status(400).json({ error: "Name must be at least 2 characters" });
    }
    user.name = sanitizeInput(name);
  }

  if (email) {
    const sanitizedEmail = sanitizeInput(email).toLowerCase();
    const existingUser = await User.findOne({
      email: sanitizedEmail,
      _id: { $ne: user._id },
    });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }
    user.email = sanitizedEmail;
  }

  await user.save();

  res.status(200).json({
    message: "Profile updated successfully",
    user: user.toJSON(),
  });
});
