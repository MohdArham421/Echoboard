import { Server } from "socket.io";

const onlineUsers = {};

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
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