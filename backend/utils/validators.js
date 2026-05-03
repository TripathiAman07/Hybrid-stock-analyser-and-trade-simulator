// utils/validators.js — Input validation utilities

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Minimum 6 characters
 */
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Validate name
 * Minimum 2 characters, max 100
 */
export const isValidName = (name) => {
  return name && name.trim().length >= 2 && name.length <= 100;
};

/**
 * Sanitize user input (basic)
 * Remove leading/trailing whitespace
 */
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.trim();
};

/**
 * Validate register payload
 */
export const validateRegisterInput = (name, email, password) => {
  const errors = {};

  if (!isValidName(name)) {
    errors.name = "Name must be between 2-100 characters";
  }

  if (!isValidEmail(email)) {
    errors.email = "Please provide a valid email";
  }

  if (!isValidPassword(password)) {
    errors.password = "Password must be at least 6 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate login payload
 */
export const validateLoginInput = (email, password) => {
  const errors = {};

  if (!isValidEmail(email)) {
    errors.email = "Please provide a valid email";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
