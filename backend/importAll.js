// importAll.js

const mongoose = require('mongoose');
require('dotenv').config();

const importTopics = require('./importTopics');
const importQuestions = require('./importQuestions');
const importProblems = require('./importProblems');
const importBadges = require('./importBadges');
const importUsers = require('./importUsers');
const importUserProgress = require('./importUserProgress');
const importUserResponses = require('./importUserResponses');

const runImports = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Import data in the correct order
    await importTopics();
    await importBadges();
    await importQuestions();
    await importProblems();
    await importUsers();
    await importUserProgress();
    await importUserResponses();

    console.log('All data imported successfully');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

runImports();