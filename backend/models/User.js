const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  user_id: String,
  name: String,
  username: { type: String, unique: true },
  password: String,
  email: String,
  // Other user fields
  login_streak: {
    type: Number,
    default: 0,
  },
  last_login_date: {
    type: Date,
    default: Date.now,
  },
  points: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 0,
  },
  next_level_points: {
    type: Number,
    default: 100,
  },
  badges: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badge',
    },
  ],
});

module.exports = mongoose.model('User', UserSchema);