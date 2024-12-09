// utils/authUtils.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(token) {
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // Return the decoded user information
  } catch (err) {
    throw new Error('Invalid token');
  }
}

module.exports = { verifyToken };