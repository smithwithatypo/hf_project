// routes/topics.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Topic = require('../models/Topic'); // Assuming you have a Topic model
const UserTopicProgress = require('../models/UserTopicProgress');
const UserProgress = require('../models/UserProgress');
const Problem = require('../models/Problem');

// GET /api/topics - Get all topics with user's mastery levels
router.get('/', auth, async (req, res) => {
  try {
    const topics = await Topic.find();
    const userId = req.user.userId;

    // Include user's mastery level for each topic
    const topicsWithProgress = await Promise.all(
      topics.map(async (topic) => {
        const userTopicProgress = await UserTopicProgress.findOne({
          user: userId,
          topic: topic._id,
        });
        const masteryLevel = userTopicProgress ? userTopicProgress.masteryLevel : 0;
        return {
          ...topic.toObject(),
          masteryLevel,
        };
      })
    );

    res.json(topicsWithProgress);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all problems for a topic with user's mastery levels
router.get('/:topicId/problems', auth, async (req, res) => {
  try {
    const topic = await Topic.findOne({ topicId: req.params.topicId });
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    const problems = await Problem.find({ topic: topic._id }).select('-questions');
    const userId = req.user.userId;

    // Include user's mastery level for each problem
    const problemsWithProgress = await Promise.all(
      problems.map(async (problem) => {
        const userProgress = await UserProgress.findOne({
          user: userId,
          problem: problem._id,
        });
        const masteryLevel = userProgress ? userProgress.masteryLevel : 0;
        return {
          ...problem.toObject(),
          masteryLevel,
        };
      })
    );

    res.json(problemsWithProgress);
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