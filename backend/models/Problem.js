// models/Problem.js

const mongoose = require('mongoose');

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

module.exports = mongoose.model('Problem', ProblemSchema);