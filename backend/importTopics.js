// importTopics.js

const mongoose = require('mongoose');
const Topic = require('./models/Topic');
const topicsData = require('./data/topics.json');
require('dotenv').config();

const importTopics = async () => {
  try {
    await Topic.deleteMany();

    for (const topicData of topicsData) {
      const topic = new Topic({
        topicId: topicData.topicId,
        name: topicData.name,
        description: topicData.description,
      });

      await topic.save();
    }

    console.log('Topics imported successfully');
  } catch (error) {
    console.error('Error importing topics:', error);
    throw error;  // Re-throw to be handled by the caller
  }
};

if (require.main === module) {
  // Script is being run directly
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
      await importTopics();
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1);
    });
} else {
  // Script is being imported
  module.exports = importTopics;
}