const express = require('express');
const { connectDB } = require('./utils/db');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

const globalRouter = require('./index');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.set('io', io);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB(process.env.MONGODB_URI);

app.use('/api/v1', globalRouter);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
    
  });

  socket.on('task-updated', (data) => {
    socket.to(data.roomId).emit('task-updated', data.task);
  });

  socket.on('task-created', (data) => {
    socket.to(data.roomId).emit('task-created', data.task);
  });

  socket.on('task-deleted', (data) => {
    socket.to(data.roomId).emit('task-deleted', data.taskId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 