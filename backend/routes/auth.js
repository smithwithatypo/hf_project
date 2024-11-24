// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Update login_streak and last_login_date
    const today = new Date().toISOString().split('T')[0];
    const lastLoginDate = user.last_login_date.toISOString().split('T')[0];

    if (today === lastLoginDate) {
      // User has already logged in today, no need to update login_streak
    } else if (new Date(today) - new Date(lastLoginDate) === 86400000) {
      // User logged in yesterday, increment login_streak
      user.login_streak += 1;
    } else {
      // User did not log in yesterday, reset login_streak
      user.login_streak = 1;
    }

    user.last_login_date = new Date();

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Populate badges
    const populatedUser = await User.findById(user._id).populate('badges').select('-password');

    res.json({
      token,
      user: populatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;