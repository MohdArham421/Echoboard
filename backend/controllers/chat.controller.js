import Message from "../models/Message.model.js";

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .populate("sender", "username email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch messages",
    });
  }
};