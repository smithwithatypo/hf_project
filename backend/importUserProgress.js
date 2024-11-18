// importUserProgress.js

const mongoose = require('mongoose');
const User = require('./models/User');
const UserProgress = require('./models/UserProgress');
const Problem = require('./models/Problem');
const Topic = require('./models/Topic');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

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
        const problem = await Problem.findOne({ problemId: problemProgress.problemId });
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

        const userProgress = new UserProgress({
          user: user._id,
          problem: problem._id,
          topic: topic._id,
          masteryLevel: problemProgress.mastery_level,
          lastPracticed: new Date(problemProgress.last_practiced),
          questionsAnswered: [], // Populate as needed
        });

        await userProgress.save();
      }
    }

    console.log('User progress imported successfully');
    process.exit();
  } catch (error) {
    console.error('Error importing user progress:', error);
    process.exit(1);
  }
};

importUserProgress();