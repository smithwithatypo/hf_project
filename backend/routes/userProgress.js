// routes/userProgress.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const UserProgress = require('../models/UserProgress');
const UserResponse = require('../models/UserResponse');
const Problem = require('../models/Problem');

router.get('/progress', auth, async (req, res) => {
    console.log('GET /progress ...'); // TODO: Remove this added line
    console.log('req.user:', req.user); // TODO: Remove this added line
  try {
    const progress = await UserProgress.find({ user: req.user.userId })
      .populate('problem', 'problemId title')
      .populate('topic', 'name');

    const formattedProgress = progress.map((item) => ({
      problemId: item.problem.problemId,
      title: item.problem.title,
      topic: item.topic.name,
      totalAttempts: item.totalAttempts,
      correctAttempts: item.correctAttempts,
      masteryLevel: item.masteryLevel,
      lastPracticed: item.lastPracticed,
    }));

    res.json(formattedProgress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/history', auth, async (req, res) => {
    try {
      const responses = await UserResponse.find({ user: req.user.userId })
        .populate('question', 'questionText')
        .populate('problem', 'title')
        .sort({ attemptedAt: -1 });
  
      const formattedResponses = responses.map((resp) => ({
        problemTitle: resp.problem.title,
        questionText: resp.question.questionText,
        response: resp.response,
        correct: resp.correct,
        attemptNumber: resp.attemptNumber,
        attemptedAt: resp.attemptedAt,
      }));
  
      res.json(formattedResponses);
    } catch (error) {
      console.error('Error fetching user response history:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;