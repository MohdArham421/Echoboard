import express from "express";
import { createPost, deletePost, getPosts } from "../controllers/post.controller.js";
import  protect from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), createPost);
router.get("/", getPosts);
router.delete("/:id", protect, deletePost);

export default router;