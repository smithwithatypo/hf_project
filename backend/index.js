// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const problemRoutes = require('./routes/problem');
const answerRoutes = require('./routes/answers');        // New route
const userProgressRoutes = require('./routes/userProgress'); // New route
const topicRoutes = require('./routes/topics');          // New route (if applicable)
const badgeRoutes = require('./routes/badges'); // New route

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/answers', answerRoutes);                   // New route
app.use('/api/userProgress', userProgressRoutes);        // New route
app.use('/api/topics', topicRoutes);                     // New route (if applicable)
app.use('/api/badges', badgeRoutes); // New route


// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});