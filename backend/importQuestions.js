// importQuestions.js

const mongoose = require('mongoose');
const Question = require('./models/Question');
const problemsData = require('./data/problems.json');
require('dotenv').config();

const importQuestions = async () => {
  try {
    await Question.deleteMany();

    const questions = [];
    for (const topicData of Object.values(problemsData.topics)) {
      for (const problemData of Object.values(topicData.problems)) {
        for (const questionData of problemData.questions) {
          questions.push({
            questionId: questionData.questionId,
            text: questionData.text,
            type: questionData.type,
            options: questionData.options,
            correctAnswer: questionData.correct_answer,
            order: questionData.order,
            explanation: questionData.explanation,
            pointValue: questionData.pointValue || 1,
          });
        }
      }
    }

    await Question.insertMany(questions);
    console.log('Questions imported successfully');
  } catch (error) {
    console.error('Error importing questions:', error);
    throw error;  // Re-throw to be handled by the caller
  }
};

if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
      await importQuestions();
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1);
    });
} else {
  module.exports = importQuestions;
}