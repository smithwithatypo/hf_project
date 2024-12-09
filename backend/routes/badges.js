// routes/badges.js
const express = require('express');
const router = express.Router();
const Badge = require('../models/Badge');
const auth = require('../middleware/auth');

// GET /api/badges - Get all badges
router.get('/', auth, async (req, res) => {
  try {
    const badges = await Badge.find();
    res.json(badges);
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/badges - Create a new badge
router.post('/', auth, async (req, res) => {
  const { badgeId, name, description, criteria } = req.body;

  try {
    const newBadge = new Badge({
      badgeId,
      name,
      description,
      criteria,
    });

    const savedBadge = await newBadge.save();
    res.status(201).json(savedBadge);
  } catch (error) {
    console.error('Error creating badge:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;