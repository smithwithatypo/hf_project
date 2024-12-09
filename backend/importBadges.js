// importBadges.js
const mongoose = require('mongoose');
const Badge = require('./models/Badge');
const badgesData = require('./data/badges.json');
require('dotenv').config();

const importBadges = async () => {
  try {
    await Badge.deleteMany();

    const badges = badgesData.map((badge) => ({
      badgeId: badge.badgeId,
      name: badge.name,
      description: badge.description,
      criteria: badge.criteria,
    }));

    await Badge.insertMany(badges);
    console.log('Badges imported successfully');
  } catch (error) {
    console.error('Error importing badges:', error);
    throw error;  // Re-throw to be handled by the caller
  }
};

if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
      await importBadges();
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1);
    });
} else {
  module.exports = importBadges;
}