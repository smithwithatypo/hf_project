// models/UserResponse.js
const mongoose = require('mongoose');

const UserResponseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  },
  response: mongoose.Schema.Types.Mixed, // Can be String, Number, Array, etc.
  correct: Boolean,
  attemptNumber: Number, // The nth attempt at this question
  attemptedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('UserResponse', UserResponseSchema);