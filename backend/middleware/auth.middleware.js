import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
         console.log("❌ No auth header");
        return res.status(401).json({ message: "Not authorized" });
    }

    const token = authHeader.split(" ")[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;  // ← attach full user
    next();
  } catch (error) {
        console.log("❌ VERIFY ERROR:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default protect;