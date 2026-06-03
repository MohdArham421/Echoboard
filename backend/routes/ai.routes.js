import express from "express";
import { generatePost } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/generate", generatePost);

export default router;