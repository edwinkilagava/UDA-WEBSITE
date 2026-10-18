
import express from "express";
import { createContributionController } from "../controllers/contribution.controller.js";

const router = express.Router();

router.post("/", createContributionController);

export default router;
