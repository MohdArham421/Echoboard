import express from "express";
import Message from "../models/Message.model.js";

const router = express.Router();

/*

GET ALL MESSAGES OF ROOM

*/

router.get("/:roomId", async (req, res) => {
  try {
    const messages = await Message.find({
      roomId: req.params.roomId,
    })
      .populate("senderId", "username")
      .populate("receiverId", "username")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch messages",
    });
  }
});

/*

GET CHAT USERS

*/

router.get("/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { senderId: userId },
        { receiverId: userId },
      ],
    })
      .populate("senderId", "username")
      .populate("receiverId", "username")
      .sort({ updatedAt: -1 });

    const usersMap = new Map();

    messages.forEach((msg) => {
      const otherUser =
        String(msg.senderId._id) ===
        String(userId)
          ? msg.receiverId
          : msg.senderId;

      usersMap.set(
        String(otherUser._id),
        otherUser
      );
    });

    res.json([...usersMap.values()]);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
});

export default router;