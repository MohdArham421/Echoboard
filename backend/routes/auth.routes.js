import express from "express";
import {
  signup,
  login,
  refreshTokenHandler,
  logout
} from "../controllers/auth.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refreshTokenHandler);
router.post("/logout", logout);

// Test protected route
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

export default router;