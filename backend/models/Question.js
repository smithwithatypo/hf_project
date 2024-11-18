// models/Question.js
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionId: { type: String, required: true, unique: true },
  text: String,
  type: String,
  options: [String],
  correctAnswer: mongoose.Schema.Types.Mixed,
  order: Number,
  explanation: String,
  pointValue: { type: Number, default: 1 },
});

module.exports = mongoose.model('Question', QuestionSchema);