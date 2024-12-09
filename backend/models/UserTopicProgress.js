// models/UserTopicProgress.js
const mongoose = require('mongoose');

const UserTopicProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true,
  },
  status: String, // Status of the topic (e.g., started, in progress, completed)
  score: { type: Number, default: 0 }, // Score achieved in the topic
  completedQuizzes: Number, // Number of quizzes completed for the topic
  masteryLevel: Number, // Calculated based on performance across all problems in the topic
  lastPracticed: Date,
  // Additional fields as needed
});

module.exports = mongoose.model('UserTopicProgress', UserTopicProgressSchema);