// importProblems.js

const mongoose = require('mongoose');
const Problem = require('./models/Problem');
const Question = require('./models/Question');
const Topic = require('./models/Topic');
const problemsData = require('./data/problems.json');
require('dotenv').config();

const importProblems = async () => {
  try {
    await Problem.deleteMany();

    for (const topicKey of Object.keys(problemsData.topics)) {
      const topicData = problemsData.topics[topicKey];
      const topicId = topicData.topicId;

      // Fetch the Topic document using topicId
      const dbTopic = await Topic.findOne({ topicId: topicId });
      if (!dbTopic) {
        console.warn(`Topic with topicId "${topicId}" not found.`);
        continue;
      }

      for (const problemKey of Object.keys(topicData.problems)) {
        const problemData = topicData.problems[problemKey];

        // Collect Question ObjectIds using questionKey
        const questionIds = [];

        for (const questionData of problemData.questions) {
          const question = await Question.findOne({
            questionId: questionData.questionId,
          });

          if (question) {
            questionIds.push(question._id);
          } else {
            console.warn(`Question with questionKey "${questionData.questionId}" not found`);
          }
        }

        // Create the Problem document with the array of Question ObjectIds
        const problem = new Problem({
          problemId: problemData.problemId,
          title: problemData.title,
          description: problemData.description,
          examples: problemData.examples,
          constraints: problemData.constraints,
          starterCode: problemData.starterCode,
          topic: dbTopic._id, // Reference the Topic ObjectId
          questions: questionIds,
        });

        await problem.save();
      }
    }

    console.log('Problems imported successfully');
  } catch (error) {
    console.error('Error importing problems:', error);
    throw error;  // Re-throw to be handled by the caller
  }
};

if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
      await importProblems();
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1);
    });
} else {
  module.exports = importProblems;
}