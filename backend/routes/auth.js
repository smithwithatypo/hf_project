// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Badge = require('../models/Badge');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Update login_streak and last_login_date
    const today = new Date();
    const lastLoginDate = user.last_login_date ? new Date(user.last_login_date) : null;

    let isFirstLogin = false;

    if (!lastLoginDate) {
      // First login ever
      user.login_streak = 1;
      isFirstLogin = true;
    } else {
      // Strip time components
      const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const lastLoginDateOnly = new Date(lastLoginDate.getFullYear(), lastLoginDate.getMonth(), lastLoginDate.getDate());

      const differenceInDays = (todayDateOnly - lastLoginDateOnly) / (24 * 60 * 60 * 1000);

      if (differenceInDays === 0) {
        // User has already logged in today
      } else if (differenceInDays === 1) {
        // User logged in yesterday, increment login_streak
        user.login_streak += 1;
      } else {
        // User did not log in yesterday, reset login_streak
        user.login_streak = 1;
      }
    }

    user.last_login_date = today;

    // Award the first_login badge if it's the user's first login
    if (isFirstLogin) {
      const firstLoginBadge = await Badge.findOne({ badgeId: 'first_login' });
      if (firstLoginBadge) {
        user.badges.push(firstLoginBadge._id);
      }
    }

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