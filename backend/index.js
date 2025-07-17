const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const passport = require('passport');
const session = require('express-session');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Add session middleware (required by passport, even if not used for JWT)
app.use(session({
  secret: process.env.JWT_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/users', require('./routes/users'));

// Test route
app.get('/', (req, res) => {
  res.send('TinyBrosBlog API is running!');
});

// Create HTTP server and Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// In-memory store for online users (userId: socketId)
const onlineUsers = new Map();

io.on('connection', (socket) => {
  // Listen for user identification
  socket.on('user_connected', (userId) => {
    if (userId) {
      onlineUsers.set(userId, socket.id);
      io.emit('online_users', Array.from(onlineUsers.keys()));
    }
  });

  socket.on('disconnect', () => {
    // Remove user from onlineUsers
    for (const [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit('online_users', Array.from(onlineUsers.keys()));
  });
});

// Endpoint to get online users
app.get('/api/users/online', (req, res) => {
  res.json({ online: Array.from(onlineUsers.keys()) });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 