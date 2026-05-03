// middleware/auth.js — JWT authentication middleware
import jwt from "jsonwebtoken";

/**
 * Protect routes - verify JWT token
 * Token should be in Authorization header: Bearer <token>
 */
export const protect = (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({ error: "Not authorized to access this route" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Not authorized to access this route" });
  }
};

/**
 * Optional auth middleware
 * Doesn't fail if no token, but populates req.user if valid token exists
 */
export const optionalAuth = (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
      req.user = decoded;
    }

    next();
  } catch (error) {
    // Continue without user if token is invalid
    next();
  }
};

/**
 * Generate JWT token
 * @param {string} id - User ID
 * @param {number} expiresIn - Expiry time in seconds (default: 7 days)
 */
export const generateToken = (id, expiresIn = 7 * 24 * 60 * 60) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn,
  });
};

/**
 * Generate refresh token (longer expiry)
 * Used to get new access tokens without re-login
 */
export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || "refresh-secret-key", {
    expiresIn: 30 * 24 * 60 * 60, // 30 days
  });
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || "refresh-secret-key");
  } catch (error) {
    return null;
  }
};
