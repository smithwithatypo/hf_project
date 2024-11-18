// models/Topic.js

const mongoose = require('mongoose');

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

module.exports = mongoose.model('Topic', TopicSchema);