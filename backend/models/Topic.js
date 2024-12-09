// models/Topic.js

const mongoose = require('mongoose');
const Problem = require('./Problem');
const UserProgress = require('./UserProgress');
const UserResponse = require('./UserResponse');

const TopicSchema = new mongoose.Schema({
  topicId: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  description: String,
  problems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
    },
  ],
});

TopicSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    const topicId = this._id;

    // Find all problems associated with this topic
    const problems = await Problem.find({ topic: topicId });

    // Collect all problem IDs
    const problemIds = problems.map((problem) => problem._id);

    // Delete problems
    await Problem.deleteMany({ topic: topicId });

    // Delete user progress and responses for these problems
    await UserProgress.deleteMany({ problem: { $in: problemIds } });
    await UserResponse.deleteMany({ problem: { $in: problemIds } });

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Topic', TopicSchema);