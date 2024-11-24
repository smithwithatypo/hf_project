// importUsers.js
const mongoose = require('mongoose');
const User = require('./models/User');
const Badge = require('./models/Badge'); // Import Badge model
const bcrypt = require('bcrypt');
const usersData = require('./data/users.json');
require('dotenv').config();

const importUsers = async () => {
  try {
    await User.deleteMany();

    // Add a test user with a known password
    const testUser = {
        user_id: 'user_test',
        name: 'Test User',
        username: 'test_user',
        password_hash: await bcrypt.hash('testpassword', 10),
        email: 'testuser@example.com',
        points: 0,
        level: 1,
        next_level_points: 100,
        badges: [],
    };

    // Map badgeIds to ObjectIds
    const badgesMap = {};
    const badges = await Badge.find(); // Fetch all badges from the Badge collection
    badges.forEach((badge) => {
      badgesMap[badge.badgeId] = badge._id; // Map badgeId to ObjectId
    });

    const users = await Promise.all(
      usersData.users.map(async (user) => {
        const hashedPassword = user.password_hash.startsWith('$2a$')
          ? user.password_hash
          : await bcrypt.hash(user.password_hash, 10);

        // Map badgeIds in users.json to their corresponding ObjectIds
        const badgeObjectIds = (user.badges || []).map((badgeId) => {
          if (!badgesMap[badgeId]) {
            console.warn(`Badge with badgeId "${badgeId}" not found`);
            return null;
          }
          return badgesMap[badgeId];
        }).filter(Boolean); // Remove nulls if any badgeId is not found

        return {
          user_id: user.user_id,
          name: user.name,
          username: user.username,
          password: hashedPassword,
          email: user.email,
          points: user.points || 0,
          level: user.level || 1,
          next_level_points: user.next_level_points || 100,
          badges: badgeObjectIds, // Use ObjectIds for badges
        };
      })
    );

    // Include the test user in the users array
    users.push({
        user_id: testUser.user_id,
        name: testUser.name,
        username: testUser.username,
        password: testUser.password_hash,
        email: testUser.email,
        points: testUser.points,
        level: testUser.level,
        next_level_points: testUser.next_level_points,
        badges: testUser.badges,
    });

    await User.insertMany(users);
    console.log('Users imported successfully');
  } catch (error) {
    console.error('Error importing users:', error);
    throw error;  // Re-throw to be handled by the caller
  }
};

if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
      await importUsers();
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1);
    });
} else {
  module.exports = importUsers;
}