// models/Problem.js

const mongoose = require('mongoose');
const Question = require('./Question');
const UserProgress = require('./UserProgress');
const UserResponse = require('./UserResponse');

const ProblemSchema = new mongoose.Schema({
  problemId: { type: String, required: true, unique: true },
  title: String,
  description: String,
  examples: [
    {
      input: String,
      output: String,
      explanation: String,
    },
  ],
  constraints: [String],
  starterCode: {
    type: Map,
    of: String,
    required: false,
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true,
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
  ],
});

ProblemSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    const problemId = this._id;

    // Delete related UserProgress and UserResponse documents
    await UserProgress.deleteMany({ problem: problemId });
    await UserResponse.deleteMany({ problem: problemId });

    // Delete associated Questions
    const questionIds = this.questions;
    await Question.deleteMany({ _id: { $in: questionIds } });

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Problem', ProblemSchema);