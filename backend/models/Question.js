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

QuestionSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    const questionId = this._id;
    await UserResponse.deleteMany({ question: questionId });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Question', QuestionSchema);