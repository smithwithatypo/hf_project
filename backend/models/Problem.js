// models/Problem.js

const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
  problemId: { type: String, required: true, unique: true },
  title: String,
  description: String,
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