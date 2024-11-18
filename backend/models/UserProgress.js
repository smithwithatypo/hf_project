// models/UserProgress.js
const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
  },
  totalAttempts: {
    type: Number,
    default: 0,
  },
  correctAttempts: {
    type: Number,
    default: 0,
  },
  masteryLevel: Number, // Calculated based on performance
  lastPracticed: Date,
});

module.exports = mongoose.model('UserProgress', UserProgressSchema);