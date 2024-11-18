// importTopics.js

const mongoose = require('mongoose');
const Topic = require('./models/Topic');
const topicsData = require('./data/topics.json');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

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
    process.exit();
  } catch (error) {
    console.error('Error importing topics:', error);
    process.exit(1);
  }
};

importTopics();