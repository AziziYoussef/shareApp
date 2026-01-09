import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const rooms = new Map(); // roomId -> Set of socketIds
const userNames = new Map(); // socketId -> userName
const socketRooms = new Map(); // socketId -> roomId

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("create-room", ({ roomId, userName }) => {
    console.log(`Creating room ${roomId} for user ${socket.id} (${userName})`);
    socket.join(roomId);

    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(socket.id);
    userNames.set(socket.id, userName);
    socketRooms.set(socket.id, roomId);

    // Notify others in the room
    socket.to(roomId).emit("user-joined", {
      userId: socket.id,
      userName,
    });

    // Send list of existing users to the new user
    const roomSockets = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    const otherUsers = roomSockets
      .filter((id) => id !== socket.id)
      .map((id) => ({ userId: id, userName: userNames.get(id) || "User" }));

    socket.emit("room-users", otherUsers);
  });

  socket.on("join-room", ({ roomId, userName }) => {
    console.log(`User ${socket.id} (${userName}) joining room ${roomId}`);
    socket.join(roomId);

    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(socket.id);
    userNames.set(socket.id, userName);
    socketRooms.set(socket.id, roomId);

    // Notify others in the room
    socket.to(roomId).emit("user-joined", {
      userId: socket.id,
      userName,
    });

    // Send list of existing users to the new user
    const roomSockets = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    const otherUsers = roomSockets
      .filter((id) => id !== socket.id)
      .map((id) => ({ userId: id, userName: userNames.get(id) || "User" }));

    socket.emit("room-users", otherUsers);
  });

  socket.on("offer", ({ to, offer }) => {
    console.log(`Offer from ${socket.id} to ${to}`);
    socket.to(to).emit("offer", { from: socket.id, offer });
  });

  socket.on("answer", ({ to, answer }) => {
    console.log(`Answer from ${socket.id} to ${to}`);
    socket.to(to).emit("answer", { from: socket.id, answer });
  });

  socket.on("ice-candidate", ({ to, candidate }) => {
    socket.to(to).emit("ice-candidate", { from: socket.id, candidate });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    const roomId = socketRooms.get(socket.id);

    // Remove from room and notify others
    if (roomId && rooms.has(roomId)) {
      const users = rooms.get(roomId);
      users.delete(socket.id);
      socket.to(roomId).emit("user-left", { userId: socket.id });

      if (users.size === 0) {
        rooms.delete(roomId);
      }
    }

    // Clean up user data
    userNames.delete(socket.id);
    socketRooms.delete(socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});
