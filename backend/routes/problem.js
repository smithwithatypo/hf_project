// routes/problem.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Problem = require('../models/Problem');
const Question = require('../models/Question');

// Get All Problems
router.get('/', async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all questions for a problem
router.get('/:problemId/questions', auth, async (req, res) => {
  try {
    const problem = await Problem.findOne({ problemId: req.params.problemId }).populate('questions');
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.json(problem.questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/topic/:topicName', async(req, res) => {
    try {
        const problems = await Problem.find({ topic: req.params.topicName });
        res.json(problems);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;