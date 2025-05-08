const { Server } = require("socket.io");

const io = new Server(3001, {
  cors: { origin: "*" },
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-room", ({ roomId, name }) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        adminId: socket.id,
        users: {},
      };
    }

    rooms[roomId].users[socket.id] = { name, vote: null };

    io.to(roomId).emit("room-state", {
      users: rooms[roomId].users,
      adminId: rooms[roomId].adminId,
    });
  });

  socket.on("vote", ({ roomId, vote }) => {
    if (rooms[roomId]?.users[socket.id]) {
      rooms[roomId].users[socket.id].vote = vote;
      io.to(roomId).emit("room-state", {
        users: rooms[roomId].users,
        adminId: rooms[roomId].adminId,
      });
    }
  });

  socket.on("reveal", (roomId) => {
    if (rooms[roomId]?.adminId === socket.id) {
      io.to(roomId).emit("reveal");
    }
  });

  socket.on("reset", (roomId) => {
    if (rooms[roomId]?.adminId === socket.id) {
      Object.values(rooms[roomId].users).forEach((u) => (u.vote = null));
      io.to(roomId).emit("room-state", {
        users: rooms[roomId].users,
        adminId: rooms[roomId].adminId,
      });
      io.to(roomId).emit("reset");
    }
  });

  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      const room = rooms[roomId];
      delete room.users[socket.id];

      // If admin left, assign a new one (if any users remain)
      if (room.adminId === socket.id) {
        const userIds = Object.keys(room.users);
        room.adminId = userIds[0] || null;
      }

      // Clean up if room is empty
      if (Object.keys(room.users).length === 0) {
        delete rooms[roomId];
        continue;
      }

      io.to(roomId).emit("room-state", {
        users: room.users,
        adminId: room.adminId,
      });
    }
  });
});

console.log("WebSocket server is running on port 3001");
