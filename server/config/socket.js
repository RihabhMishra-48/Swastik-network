const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const User = require('../models/User');

// Track online users: { userId -> socketId }
const onlineUsers = new Map();
// Random chat queue
const randomChatQueue = [];
const randomChatRooms = new Map(); // roomId -> [userId1, userId2]

const initSocket = (io) => {
  // Auth middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication error'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    onlineUsers.set(userId, socket.id);
    io.emit('online-users', Array.from(onlineUsers.keys()));
    console.log(`🟢 User connected: ${userId}`);

    // ─── GROUP CHAT ───────────────────────────────────────────
    socket.on('join-room', (roomId) => {
      socket.join(roomId);
    });

    socket.on('leave-room', (roomId) => {
      socket.leave(roomId);
    });

    socket.on('send-message', async (data) => {
      try {
        const { roomId, content, image, replyTo } = data;
        const msg = await Message.create({
          group: roomId,
          sender: userId,
          content,
          image: image || null,
          replyTo: replyTo || null,
        });
        const populated = await msg.populate('sender', 'username avatar university');
        io.to(roomId).emit('new-message', populated);
      } catch (err) {
        socket.emit('error', err.message);
      }
    });

    socket.on('delete-message', async ({ messageId, roomId }) => {
      try {
        const msg = await Message.findById(messageId);
        if (!msg) return;
        if (msg.sender.toString() !== userId) return;
        msg.deletedAt = new Date();
        msg.content = 'This message was deleted.';
        await msg.save();
        io.to(roomId).emit('message-deleted', { messageId, roomId });
      } catch (err) {
        socket.emit('error', err.message);
      }
    });

    socket.on('typing', ({ roomId }) => {
      socket.to(roomId).emit('user-typing', { userId });
    });

    socket.on('stop-typing', ({ roomId }) => {
      socket.to(roomId).emit('user-stop-typing', { userId });
    });

    // ─── ANONYMOUS CHAT ────────────────────────────────────────
    socket.on('anon-message', async ({ roomId, content }) => {
      try {
        const msg = await Message.create({
          group: roomId,
          sender: userId,
          content,
          isAnonymous: true,
        });
        io.to(roomId).emit('new-anon-message', {
          _id: msg._id,
          content: msg.content,
          sender: { username: 'Anonymous', avatar: null },
          createdAt: msg.createdAt,
        });
      } catch (err) {
        socket.emit('error', err.message);
      }
    });

    // ─── RANDOM CHAT ──────────────────────────────────────────
    socket.on('find-match', () => {
      if (randomChatQueue.length > 0 && randomChatQueue[0] !== userId) {
        const partnerId = randomChatQueue.shift();
        const roomId = `random_${userId}_${partnerId}`;
        randomChatRooms.set(roomId, [userId, partnerId]);

        const partnerSocketId = onlineUsers.get(partnerId);
        socket.join(roomId);
        if (partnerSocketId) {
          io.sockets.sockets.get(partnerSocketId)?.join(roomId);
        }
        io.to(roomId).emit('match-found', { roomId });
      } else {
        if (!randomChatQueue.includes(userId)) randomChatQueue.push(userId);
        socket.emit('waiting-for-match');
      }
    });

    socket.on('random-message', ({ roomId, content }) => {
      socket.to(roomId).emit('new-random-message', { content, from: 'Anonymous' });
    });

    socket.on('skip-random-chat', ({ roomId }) => {
      io.to(roomId).emit('chat-skipped');
      randomChatRooms.delete(roomId);
    });

    socket.on('add-friend-after-chat', async ({ roomId }) => {
      const users = randomChatRooms.get(roomId);
      if (!users) return;
      const partnerId = users.find((id) => id !== userId);
      socket.emit('friend-request-sent', { partnerId });
    });

    // ─── DISCONNECT ──────────────────────────────────────────
    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      // Remove from random queue if waiting
      const qIdx = randomChatQueue.indexOf(userId);
      if (qIdx !== -1) randomChatQueue.splice(qIdx, 1);
      io.emit('online-users', Array.from(onlineUsers.keys()));
      console.log(`🔴 User disconnected: ${userId}`);
    });
  });
};

module.exports = { initSocket };
