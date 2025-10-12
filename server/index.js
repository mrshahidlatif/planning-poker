const { Server } = require("socket.io");

const io = new Server(3001, {
  cors: { origin: "*" },
});

// A global state of all rooms
const rooms = {};

io.on("connection", (socket) => {
  socket.on("join-room", ({ userId, userName, roomId }) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      // First user to join becomes the admin
      rooms[roomId] = {
        adminUserId: userId,
        users: {},
        votesRevealed: false
      };
    }

    // Add or update user in room
    rooms[roomId].users[userId] = {
      userId,
      userName,
      vote: null,
      socketId: socket.id
    };

    // Send current room state to all users in the room
    io.to(roomId).emit("room-state", {
      users: rooms[roomId].users,
      adminUserId: rooms[roomId].adminUserId,
      votesRevealed: rooms[roomId].votesRevealed
    });
    console.log(`User ${userName} joined room ${roomId}`);
  });

  socket.on("vote", ({ roomId, userId, vote }) => {
    const room = rooms[roomId];
    if (room?.users[userId]) {
      room.users[userId].vote = vote;
      room.users[userId].socketId = socket.id;

      console.log(`User ${userId} voted ${vote} in room ${roomId}`);
      io.to(roomId).emit("room-state", {
        users: room.users,
        adminUserId: room.adminUserId,
        votesRevealed: room.votesRevealed
      });
    }
  });

  socket.on("reveal", ({ roomId, userId }) => {
    const room = rooms[roomId];
    if (room?.adminUserId === userId) {
      room.votesRevealed = true;
      io.to(roomId).emit("room-state", {
        users: room.users,
        adminUserId: room.adminUserId,
        votesRevealed: true
      });
    }
  });

  socket.on("reset", ({ roomId, userId }) => {
    const room = rooms[roomId];
    if (room?.adminUserId === userId) {
      // Reset all votes
      Object.values(room.users).forEach((user) => (user.vote = null));
      room.votesRevealed = false;

      io.to(roomId).emit("room-state", {
        users: room.users,
        adminUserId: room.adminUserId,
        votesRevealed: false
      });
    }
  });

  socket.on("make-admin", ({ roomId, adminUserId, newAdminUserId }) => {
    const room = rooms[roomId];

    // Verify that the requesting user is the current admin
    if (room?.adminUserId === adminUserId) {
      // Verify that the new admin user exists in the room
      if (room.users[newAdminUserId]) {
        // Transfer admin privileges
        room.adminUserId = newAdminUserId;

        console.log(`Admin transferred from ${adminUserId} to ${newAdminUserId} in room ${roomId}`);

        // Send updated room state to all users
        io.to(roomId).emit("room-state", {
          users: room.users,
          adminUserId: room.adminUserId,
          votesRevealed: room.votesRevealed
        });
      } else {
        console.log(`Cannot make admin: User ${newAdminUserId} not found in room ${roomId}`);
      }
    } else {
      console.log(`Unauthorized admin transfer attempt by ${adminUserId} in room ${roomId}`);
    }
  });

  socket.on("disconnect", () => {
    // Find all rooms the user was in
    for (const roomId in rooms) {
      const room = rooms[roomId];

      // Find user by socket.id
      const disconnectedUserId = Object.entries(room.users).find(
        ([_, user]) => user.socketId === socket.id
      )?.[0];

      if (disconnectedUserId) {
        // Only remove the user if they're not in the room with another socket
        const userSockets = Object.values(room.users).filter(
          user => user.socketId === socket.id
        );

        if (userSockets.length === 1) {
          // If the disconnected user was the admin, transfer admin to another user
          if (room.adminUserId === disconnectedUserId) {
            const remainingUsers = Object.keys(room.users).filter(id => id !== disconnectedUserId);
            if (remainingUsers.length > 0) {
              // Transfer admin to the first remaining user
              room.adminUserId = remainingUsers[0];
              console.log(`Admin ${disconnectedUserId} disconnected, transferred admin to ${room.adminUserId} in room ${roomId}`);
            }
          }

          delete room.users[disconnectedUserId];

          // If no users left, delete the room
          if (Object.keys(room.users).length === 0) {
            delete rooms[roomId];
            continue;
          }

          // If room still exists, send updated state
          if (rooms[roomId]) {
            io.to(roomId).emit("room-state", {
              users: room.users,
              adminUserId: room.adminUserId,
              votesRevealed: room.votesRevealed
            });
          }
        }
      }
    }
  });
});

console.log("WebSocket server is running on port 3001");
