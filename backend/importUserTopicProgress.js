// importUserTopicProgress.js

const mongoose = require('mongoose');
const User = require('./models/User');
const Topic = require('./models/Topic');
const UserTopicProgress = require('./models/UserTopicProgress');
const UserProgress = require('./models/UserProgress');
const UserResponse = require('./models/UserResponse');
require('dotenv').config();

const importUserTopicProgress = async () => {
  try {
    await UserTopicProgress.deleteMany();

    const users = require('./data/users.json').users;

    for (const userData of users) {
      const user = await User.findOne({ user_id: userData.user_id });

      if (!user || !userData.progress || !userData.progress.topics) continue;

      const topicsProgress = userData.progress.topics;

      for (const topicProgressData of Object.values(topicsProgress)) {
        // Fetch the Topic document
        const topic = await Topic.findOne({ topicId: topicProgressData.topicId });
        if (!topic) {
          console.warn(`Topic with topicId "${topicProgressData.topicId}" not found`);
          continue;
        }

        // Fetch UserProgress documents for this user and topic
        const userProgresses = await UserProgress.find({
          user: user._id,
          topic: topic._id,
        }).populate('problem');

        let totalWeightedMastery = 0;
        let totalQuestionsInTopic = 0;
        let totalScore = 0;
        let completedQuizzes = 0;

        for (const up of userProgresses) {
          const problemQuestions = up.problem.questions.length;
          totalWeightedMastery += up.masteryLevel * problemQuestions;
          totalQuestionsInTopic += problemQuestions;
          totalScore += up.score;   // Sum up the scores

          // Check if the user has responded to all questions for this problem
          const distinctQuestionsAnswered = await UserResponse.distinct('question', {
            user: user._id,
            problem: up.problem._id,
          });

          if (distinctQuestionsAnswered.length >= problemQuestions) {
            completedQuizzes += 1;
          }
        }

        const topicMasteryLevel = totalQuestionsInTopic > 0 ? totalWeightedMastery / totalQuestionsInTopic : 0;

        const userTopicProgress = new UserTopicProgress({
          user: user._id,
          topic: topic._id,
          status: topicMasteryLevel === 1 ? 'completed' : 'in progress',
          score: Math.max(0, totalScore), // Set total score for the topic
          completedQuizzes: completedQuizzes,
          masteryLevel: topicMasteryLevel,
          lastPracticed: topicProgressData.last_practiced ? new Date(topicProgressData.last_practiced) : new Date(),
        });

        await userTopicProgress.save();
      }
    }

    console.log('User topic progress imported successfully');
  } catch (error) {
    console.error('Error importing user topic progress:', error);
    throw error;
  }
};

if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
      await importUserTopicProgress();
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1);
    });
} else {
  module.exports = importUserTopicProgress;
}