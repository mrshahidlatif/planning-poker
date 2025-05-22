const { Server } = require("socket.io");

const io = new Server(3001, {
  cors: { origin: "*" },
});

// In-memory storage (temporary solution)
const rooms = {};

io.on("connection", (socket) => {
  socket.on("join-room", ({ roomId, name, adminToken }) => {
    socket.join(roomId);

    // Create room if it doesn't exist
    if (!rooms[roomId]) {
      rooms[roomId] = {
        adminToken, // Store the admin token
        users: {},
        votesRevealed: false
      };
    }

    // Add or update user in room
    rooms[roomId].users[name] = {
      name,
      vote: null,
      socketId: socket.id
    };

    // Send current room state to all users in the room
    io.to(roomId).emit("room-state", {
      users: rooms[roomId].users,
      adminToken: rooms[roomId].adminToken,
      votesRevealed: rooms[roomId].votesRevealed
    });
  });

  socket.on("vote", ({ roomId, name, vote }) => {
    const room = rooms[roomId];
    if (room?.users[name]) {
      room.users[name].vote = vote;
      room.users[name].socketId = socket.id; // Update socket mapping
      io.to(roomId).emit("room-state", {
        users: room.users,
        adminToken: room.adminToken,
        votesRevealed: room.votesRevealed
      });
    }
  });

  socket.on("reveal", ({ roomId, name, adminToken }) => {
    const room = rooms[roomId];
    if (room?.adminToken === adminToken) {
      room.votesRevealed = true;
      io.to(roomId).emit("room-state", {
        users: room.users,
        adminToken: room.adminToken,
        votesRevealed: true
      });
    }
  });

  socket.on("reset", ({ roomId, name, adminToken }) => {
    const room = rooms[roomId];
    if (room?.adminToken === adminToken) {
      // Reset all votes
      Object.values(room.users).forEach((user) => (user.vote = null));
      room.votesRevealed = false;

      io.to(roomId).emit("room-state", {
        users: room.users,
        adminToken: room.adminToken,
        votesRevealed: false
      });
    }
  });

  socket.on("disconnect", () => {
    // Find all rooms the user was in
    for (const roomId in rooms) {
      const room = rooms[roomId];

      // Find user by socket.id
      const disconnectedUserName = Object.entries(room.users).find(
        ([_, user]) => user.socketId === socket.id
      )?.[0];

      if (disconnectedUserName) {
        // Only remove the user if they're not in the room with another socket
        const userSockets = Object.values(room.users).filter(
          user => user.socketId === socket.id
        );

        if (userSockets.length === 1) {
          delete room.users[disconnectedUserName];

          // If no users left, delete the room
          if (Object.keys(room.users).length === 0) {
            delete rooms[roomId];
            continue;
          }

          // If room still exists, send updated state
          if (rooms[roomId]) {
            io.to(roomId).emit("room-state", {
              users: room.users,
              adminToken: room.adminToken,
              votesRevealed: room.votesRevealed
            });
          }
        }
      }
    }
  });
});

console.log("WebSocket server is running on port 3001");
