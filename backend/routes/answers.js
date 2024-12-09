// routes/answers.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const UserResponse = require('../models/UserResponse');
const UserProgress = require('../models/UserProgress');
const Problem = require('../models/Problem');
const Question = require('../models/Question');
const User = require('../models/User');

// Helper function to grade answers
function gradeAnswer(question, userResponse) {
  switch (question.type) {
    case 'multiple_choice':
    case 'multiple_select':
      return JSON.stringify(userResponse) === JSON.stringify(question.correctAnswer);
    case 'short_answer':
    case 'true_false':
      return userResponse.toString().toLowerCase() === question.correctAnswer.toString().toLowerCase();
    default:
      return false;
  }
}

// Answer submission endpoint
router.post('/submit', auth, async (req, res) => {
console.log('req.user:', req.user); // TODO: Remove this added line
  const { problemId, responses } = req.body; // responses is an array of { questionId, userResponse }

  try {
    const problem = await Problem.findOne({ problemId });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    let totalCorrect = 0;
    const feedback = [];

    for (const responseItem of responses) {
      const { questionId, userResponse } = responseItem;

      // Find the question using questionId
      const question = await Question.findOne({ questionId });
      if (!question) {
        feedback.push({ questionId, correct: false, message: 'Question not found' });
        continue;
      }

      const isCorrect = gradeAnswer(question, userResponse);

      // Record the user's response
      const attemptNumber = await UserResponse.countDocuments({
        user: req.user.userId, // Updated line
        question: question._id,
      }) + 1;

      const userResponseDoc = new UserResponse({
        user: req.user.userId, // Updated line
        question: question._id,
        problem: problem._id,
        response: userResponse,
        correct: isCorrect,
        attemptNumber,
        attemptedAt: new Date(),
      });

      await userResponseDoc.save();

      if (isCorrect) totalCorrect += 1;

      feedback.push({
        questionId,
        correct: isCorrect,
        correctAnswer: isCorrect ? undefined : question.correctAnswer,  // Include correct answer if incorrect
      })
    }

    // Update UserProgress
    let userProgress = await UserProgress.findOne({
      user: req.user.userId, // Updated line
      problem: problem._id,
    });

    if (!userProgress) {
      userProgress = new UserProgress({
        user: req.user.userId, // Updated line
        problem: problem._id,
        topic: problem.topic,
        totalAttempts: responses.length,
        correctAttempts: totalCorrect,
        lastPracticed: new Date(),
      });
    } else {
      userProgress.totalAttempts += responses.length;
      userProgress.correctAttempts += totalCorrect;
      userProgress.lastPracticed = new Date();
    }

    userProgress.masteryLevel = userProgress.correctAttempts / userProgress.totalAttempts;

    await userProgress.save();

    // Update User Points and Level
    const user = await User.findById(req.user.userId);
    if (!user) {
      console.error('User not found:', req.user.userId);
      return res.status(404).json({ message: 'User not found' });
    }

    if (typeof user.points !== 'number') {
      console.error('User points field is invalid or missing:', user);
      return res.status(500).json({ message: 'User points field is missing or invalid' });
    }   

    const pointsEarned = totalCorrect; // Adjust as needed
    user.points = (user.points || 0) + pointsEarned;

    // Level Up Logic
    const levelThreshold = 100; // Adjust as needed
    const newLevel = Math.floor(user.points / levelThreshold) + 1;
    user.level = newLevel;

    // Update next_level_points
    user.next_level_points = (newLevel * levelThreshold) - user.points;

    // Update badges (example logic, adjust as needed)
    const badges = [];
    if (userProgress.masteryLevel === 1 && !user.badges.includes('problem_mastery')) {
      badges.push('problem_mastery');
    }
    user.badges = [...new Set([...user.badges, ...badges])];

    await user.save();

    res.json({ feedback, totalCorrect, totalQuestions: responses.length });
  } catch (error) {
    console.error('Error submitting answers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;