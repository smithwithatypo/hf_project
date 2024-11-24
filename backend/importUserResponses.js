// importUserResponses.js
const mongoose = require('mongoose');
const User = require('./models/User');
const UserResponse = require('./models/UserResponse');
const Problem = require('./models/Problem');
const Question = require('./models/Question');
const usersData = require('./data/users.json').users;
require('dotenv').config();

const importUserResponses = async () => {
  try {
    await UserResponse.deleteMany();

    for (const userData of usersData) {
      const user = await User.findOne({ user_id: userData.user_id });

      if (!user || !userData.progress || !userData.progress.problems) continue;

      for (const problemData of Object.values(userData.progress.problems)) {
        const problem = await Problem.findOne({ problemId: problemData.problemId });
        if (!problem) {
          console.warn(`Problem with problemId "${problemData.problemId}" not found`);
          continue;
        }

        const questionsAnswered = problemData.questions_answered || {};
        for (const [questionKey, answerData] of Object.entries(questionsAnswered)) {
          const questionId = answerData.questionId;

          const question = await Question.findOne({ questionId: questionId });
          if (!question) {
            console.warn(`Question with questionId "${questionId}" not found`);
            continue;
          }

          // Proceed with creating the UserResponse
          const userResponse = new UserResponse({
            user: user._id,
            question: question._id,
            problem: problem._id,
            response: answerData.response,
            correct: answerData.correct,
            attemptNumber: answerData.attempts || 1,
            attemptedAt: new Date(answerData.last_attempted),
          });
          await userResponse.save();
        }
      }
    }

    console.log('User responses imported successfully');
  } catch (error) {
    console.error('Error importing user responses:', error);
    throw error;  // Re-throw to be handled by the caller
  }
};

if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
      await importUserResponses();
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1);
    });
} else {
  module.exports = importUserResponses;
}