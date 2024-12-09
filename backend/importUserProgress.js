// importUserProgress.js

const mongoose = require('mongoose');
const User = require('./models/User');
const UserProgress = require('./models/UserProgress');
const Problem = require('./models/Problem');
const Topic = require('./models/Topic');
const Question = require('./models/Question');
const UserResponse = require('./models/UserResponse');
require('dotenv').config();

const importUserProgress = async () => {
  try {
    await UserProgress.deleteMany();

    const users = require('./data/users.json').users;

    for (const userData of users) {
      const user = await User.findOne({ user_id: userData.user_id });

      if (!user || !userData.progress) continue;

      const problemsProgress = userData.progress.problems || {};

      for (const problemProgress of Object.values(problemsProgress)) {
        // Fetch the Problem document
        const problem = await Problem.findOne({ problemId: problemProgress.problemId }).populate('questions');
        if (!problem) {
          console.warn(`Problem with problemId "${problemProgress.problemId}" not found`);
          continue;
        }

        // Fetch the Topic document
        const topic = await Topic.findById(problem.topic);
        if (!topic) {
          console.warn(`Topic with ID "${problem.topic}" not found`);
          continue;
        }

        // Calculate masteryLevel based on user responses
        const questionIds = problem.questions.map(q => q._id);
        const totalQuestions = questionIds.length;
        let correctOnLastAttempt = 0;
        let totalPointsEarned = 0;
        let totalAttempts = 0;
        let correctAttempts = 0;

        for (const questionId of questionIds) {
          const userResponses = await UserResponse.find({
            user: user._id,
            question: questionId,
          });

          totalAttempts += userResponses.length;

          const latestResponse = await UserResponse.findOne({
            user: user._id,
            question: questionId,
          }).sort({ attemptNumber: -1 });
          
          if (latestResponse && latestResponse.correct) {
            correctOnLastAttempt += 1;
          }

          userResponses.forEach(response => {
            if (response.correct) {
              correctAttempts += 1;
            }

            const question = problem.questions.find(q => q._id.equals(questionId));
            if (question && question.pointValue) {
              totalPointsEarned += response.correct ? question.pointValue : question.pointValue * -1;
            }
          });
        }

        const masteryLevel = totalQuestions > 0 ? correctOnLastAttempt / totalQuestions : 0;

        const userProgress = new UserProgress({
          user: user._id,
          problem: problem._id,
          topic: topic._id,
          totalAttempts: totalAttempts,
          correctAttempts: correctAttempts,
          masteryLevel: masteryLevel,
          lastPracticed: new Date(problemProgress.last_practiced),
          score: Math.max(0, totalPointsEarned),
        });

        await userProgress.save();
      }
    }

    console.log('User progress imported successfully');
  } catch (error) {
    console.error('Error importing user progress:', error);
    throw error;  // Re-throw to be handled by the caller
  }
};

if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
      await importUserProgress();
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1);
    });
} else {
  module.exports = importUserProgress;
}