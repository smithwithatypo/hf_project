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
  totalAttempts: {  // All attempts to questions in this problem
    type: Number,
    default: 0,
  },
  correctAttempts: {  // All attempts with correct answers to questions in this problem
    type: Number,
    default: 0,
  },
  masteryLevel: Number, // Calculated based on performance
  lastPracticed: Date,
  score: {type: Number, default: 0},
});

module.exports = mongoose.model('UserProgress', UserProgressSchema);