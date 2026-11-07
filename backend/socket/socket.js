import { Server } from "socket.io";

const onlineUsers = {};

const setupSocket = (server) => {
  const clientUrls = (process.env.CLIENT_URL || "")
    .split(",")
    .map((url) => url.trim().replace(/\/$/, ""))
    .filter(Boolean);

  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    ...clientUrls,
  ];

  const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app") || process.env.NODE_ENV !== "production") {
          return callback(null, true);
        }
        return callback(null, true);
      },
      credentials: true,
    },
  });

  io.on("connection", (socket) => {

    // REGISTER USER
    socket.on(
      "register_user",
      (userId) => {
        onlineUsers[userId] =
          socket.id;

        io.emit(
          "online_users",
          onlineUsers
        );
      }
    );

    // JOIN ROOM
    socket.on(
      "join_room",
      (roomId) => {
        socket.join(roomId);
      }
    );

    // RECEIVE MESSAGE
    socket.on(
      "send_private_message",
      async (msg) => {

        // SEND BACK TO ROOM
        io.to(msg.roomId).emit(
          "receive_private_message",
          {
            ...msg,
            _id: Date.now(),
            createdAt:
              new Date(),
          }
        );
      }
    );

    socket.on("disconnect", () => {
    });
  });
};

export default setupSocket;