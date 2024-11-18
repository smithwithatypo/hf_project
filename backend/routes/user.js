// routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get User Data
router.get('/', auth, async (req, res) => {
    console.log('req.user:', req.user); // TODO: Remove this added line
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
        console.log('User not found');
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove the Update User Progress endpoint if it's obsolete
router.put('/progress', auth, async (req, res) => {
    res.status(404).json({ message: 'This endpoint is no longer available.' });
  });

module.exports = router;