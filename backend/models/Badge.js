const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
    badgeId: {
        type: String,
        required: true,
        unique: true,
    },
    name: String,
    description: String,
    criteria: String,
    });

module.exports = mongoose.model('Badge', BadgeSchema);