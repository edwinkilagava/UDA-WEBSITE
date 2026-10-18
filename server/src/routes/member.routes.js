import express from "express";
import {
  registerMemberController,
  getRegisteredMemberCountController,
} from "../controllers/member.controller.js";

const router = express.Router();

// Register a new member.
router.post("/register", registerMemberController);

// Get the number of registered members.
router.get("/count", getRegisteredMemberCountController);

export default router;