// routes/problem.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Problem = require('../models/Problem');
const Question = require('../models/Question');
const UserProgress = require('../models/UserProgress');
const UserResponse = require('../models/UserResponse');


// Helper function to grade answers
function gradeAnswer(question, userResponse) {
  console.log(`Grading answer for question ${question.questionId}...`); // TODO: Remove this added line
  console.log('question:', question); // TODO: Remove this added line
  console.log('userResponse:', userResponse); // TODO: Remove this added line
  switch (question.type) {
    case 'multiple_choice':
      return JSON.stringify(userResponse) === JSON.stringify(question.correctAnswer);
    case 'multiple_select':
      return Array.isArray(userResponse) &&
             Array.isArray(question.correctAnswer) &&
             userResponse.length === question.correctAnswer.length &&
             userResponse.every((val) => question.correctAnswer.includes(val));
    case 'short_answer':
    case 'true_false':
      return userResponse.toString().toLowerCase() === question.correctAnswer.toString().toLowerCase();
    default:
      return false;
  }
}

// Get All Problems
router.get('/', async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific problem
router.get('/:problemId', async (req, res) => {
  try {
    const problem = await Problem.findOne({ problemId: req.params.problemId });
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all questions for a problem
router.get('/:problemId/questions', auth, async (req, res) => {
  try {
    const problem = await Problem.findOne({ problemId: req.params.problemId }).populate({
      path: 'questions',
      select: '-correctAnswer'
    });
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

// Submit answers for a problem
router.post('/:problemId/submit', auth, async (req, res) => {
  const { problemId } = req.params;
  const { responses } = req.body; // repsonses is an array of { questionId, userResponse }
  console.log(`Submitting answers for problem ${problemId}...`); // TODO: Remove this added line
  console.log('req.user:', req.user); // TODO: Remove this added line
  console.log('req.params:', req.params); // TODO: Remove this added line
  console.log('req.body:', req.body); // TODO: Remove this added line
  try {
    const problem = await Problem.findOne({ problemId });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    let totalCorrect = 0;
    let totalPointsEarned = 0;
    const feedback = [];

    for (const responseItem of responses) {
      console.log(`Processing response for responseItem...`); // TODO: Remove this added line
      console.log('responseItem:', responseItem); // TODO: Remove this added line
      const { questionId, userResponse } = responseItem;
      console.log('questionId:', questionId); // TODO: Remove this added line
      console.log('userResponse:', userResponse); // TODO: Remove this added line

      // Find the question using questionId
      const question = await Question.findById(questionId);
      if (!question) {
        feedback.push({ questionId, correct: false, message: 'Question not found' });
        continue;
      }

      const isCorrect = gradeAnswer(question, userResponse);

      // Record the user's response
      const attemptNumber = await UserResponse.countDocuments({
        user: req.user.userId,
        question: question._id,
      }) + 1;

      const userResponseDoc = new UserResponse({
        user: req.user.userId,
        question: question._id,
        problem: problem._id,
        response: userResponse,
        correct: isCorrect,
        attemptNumber,
        attemptedAt: new Date(),
      });

      await userResponseDoc.save();

      if (isCorrect) {
        totalCorrect += 1;
        totalPointsEarned += question.pointValue;
      }

      feedback.push({
        questionId,
        correct: isCorrect,
        correctAnswer: isCorrect ? undefined : question.correctAnswer,  // Include correct answer if incorrect
      });
    }

    // Update UserProgress
    let userProgress = await UserProgress.findOne({
      user: req.user.userId,
      problem: problem._id,
    });

    if (!userProgress) {
      userProgress = new UserProgress({
        user: req.user.userId,
        problem: problem._id,
        topic: problem.topic,
        totalAttempts: responses.length,
        correctAttempts: totalCorrect,
        masteryLevel: totalCorrect / responses.length,
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
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (typeof user.points !== 'number') {
      console.error('User points field is invalid or missing:', user);
      return res.status(500).json({ message: 'User points field is missing or invalid' });
    }

    user.points = ((user.points || 0) + totalPointsEarned) || 0;

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
    
    const io = req.app.get('io');
    const connectedUsers = req.app.get('connectedUsers');
    const socketId = connectedUsers[req.user.userId];

    if (socketId) {
      io.to(socketId).emit('userUpdated', user);
    
      // Disconnect the socket
      const socketToDisconnect = io.sockets.sockets.get(socketId);
      if (socketToDisconnect) {
console.log(`Disconnecting socket ${socketId} after sending update...`); // TODO: Remove this added line
        socketToDisconnect.disconnect(true);
      }
    }

    return res.json({ feedback, totalCorrect, totalPointsEarned });
  } catch (error) {
    console.error('Error submitting answers:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;