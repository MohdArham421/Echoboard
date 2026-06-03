import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import app from "./app.js";
import connectDB from "./config/db.js";
import Message from "./models/Message.model.js";

const PORT = process.env.PORT || 5000;

await connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

const onlineUsers = {};

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

  // SEND MESSAGE
  socket.on(
    "send_private_message",
    async (data) => {
      try {

        // SAVE MESSAGE
        const savedMessage =
          await Message.create({
            roomId: data.roomId,
        
            senderId: data.senderId,
        
            senderName: data.senderName,
        
            receiverId: data.receiverId,
        
            receiverName:
              data.receiverName,
        
            text: data.text,
          });

        // SEND TO ROOM
        io.to(data.roomId).emit(
          "receive_private_message",
          savedMessage
        );
      } catch (error) {
        console.log(error);
      }
    }
  );

  // DISCONNECT
  socket.on("disconnect", () => {

    for (const key in onlineUsers) {
      if (
        onlineUsers[key] === socket.id
      ) {
        delete onlineUsers[key];
      }
    }

    io.emit(
      "online_users",
      onlineUsers
    );
  });
});

server.listen(PORT, () => {
  console.log(
    `🚀 Server running on ${PORT}`
  );
});