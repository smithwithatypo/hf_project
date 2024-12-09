// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const { verifyToken } = require('./utils/authUtils');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

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

const connectedUsers = {};    // Map to store userId to socket mapping

// Authenticate WebSocket connections
io.use((socket, next) => {
  // Retrieve token from the client's authentication handshake
  const token = socket.handshake.auth.token || socket.handshake.query.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  try {
    const decoded = verifyToken(token);
    socket.user = decoded; // Attach user information to the socket object
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
}).on('connection', (socket) => {
  console.log(`User connected: ${socket.user.userId}`);
  connectedUsers[socket.user.userId] = socket.id;

  let inactivityTimeout;

  const resetInactivityTimeout = () => {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
      socket.disconnect(true);
      console.log(`Socket disconnected due to inactivity: ${socket.user.userId}`);
    }, 10 * 60 * 1000); // 10 minutes of inactivity
  };

  // Reset inactivity timeout on any socket event
  socket.onAny((event, ...args) => {
    resetInactivityTimeout();
  });

  resetInactivityTimeout();

  socket.on('disconnect', () => {
    clearTimeout(inactivityTimeout);
    console.log(`User disconnected: ${socket.user.userId}\n========================\n`);
    delete connectedUsers[socket.user.userId];
  });
});

app.set('io', io);
app.set('connectedUsers', connectedUsers);

// Start Server
const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { io, connectedUsers };