import express from "express";

import {
  updateProfile,
  getProfile,
} from "../controllers/profile.controller.js";


const router = express.Router();

router.get("/", getProfile);

router.put("/update", updateProfile);

export default router;