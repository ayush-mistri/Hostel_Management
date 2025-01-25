const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Generate a JWT token
 * @param {String} userId - The user ID to include in the token
 * @param {Boolean} isAdmin - Admin status of the user
 * @param {String} [expiresIn='1h'] - Token expiration time (optional)
 * @returns {String} - Signed JWT token
 */
exports.generateToken = (userId, isAdmin, expiresIn = '1h') => {
  const payload = { userId, isAdmin };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Verify a JWT token
 * @param {String} token - The token to verify
 * @returns {Object|null} - Decoded token payload or null if invalid
 */
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return null; // Return null to indicate invalid token
  }
};
