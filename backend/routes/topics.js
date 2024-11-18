// routes/topics.js

const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic'); // Assuming you have a Topic model
const auth = require('../middleware/auth');
const Question = require('../models/Question');
const Problem = require('../models/Problem');

// GET /api/topics - Get all topics
router.get('/', async (req, res) => {
  try {
    const topics = await Topic.find();
    res.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all problems for a topic
router.get('/:topicId/problems', auth, async (req, res) => {
  try {
    const topic = await Topic.findOne({ topicId: req.params.topicId });
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    const problems = await Problem.find({ topic: topic._id }).select('-questions');
    res.json(problems);
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/topics/:id - Get a specific topic
router.get('/:id', async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.json(topic);
  } catch (error) {
    console.error('Error fetching topic:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/topics - Create a new topic
router.post('/', async (req, res) => {
  try {
    const newTopic = new Topic({
      name: req.body.name,
      description: req.body.description,
    });
    const savedTopic = await newTopic.save();
    res.status(201).json(savedTopic);
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;