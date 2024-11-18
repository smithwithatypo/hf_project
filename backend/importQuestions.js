// importQuestions.js

const mongoose = require('mongoose');
const Question = require('./models/Question');
const problemsData = require('./data/problems.json');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

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
    process.exit();
  } catch (error) {
    console.error('Error importing questions:', error);
    process.exit(1);
  }
};

importQuestions();