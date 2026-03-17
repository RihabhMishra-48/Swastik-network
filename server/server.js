const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

dotenv.config();

const connectDB = require('./config/db');
const { initSocket } = require('./config/socket');
const rateLimiter = require('./middleware/rateLimiter');

// Route imports
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const groupRoutes = require('./routes/group.routes');
const discussionRoutes = require('./routes/discussion.routes');
const notificationRoutes = require('./routes/notification.routes');
const eventRoutes = require('./routes/event.routes');
const anonymousRoutes = require('./routes/anonymous.routes');

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Connect DB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// Make io accessible in routes
app.use((req, _res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/anonymous', anonymousRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Socket.io
initSocket(io);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Swastik Server running on port ${PORT}`);
});
