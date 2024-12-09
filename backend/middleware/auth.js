// middleware/auth.js
const { verifyToken } = require('../utils/authUtils');

const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Ensure req.user is set to decoded payload
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};