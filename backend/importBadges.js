// importBadges.js
const mongoose = require('mongoose');
const Badge = require('./models/Badge');
const badgesData = require('./data/badges.json');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

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
    process.exit();
  } catch (error) {
    console.error('Error importing badges:', error);
    process.exit(1);
  }
};

importBadges();