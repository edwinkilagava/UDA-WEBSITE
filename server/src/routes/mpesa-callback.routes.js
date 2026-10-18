
import express from "express";
import {
  mpesaCallbackController,
} from "../controllers/mpesa-callback.controller.js";

const router = express.Router();

router.post("/", mpesaCallbackController);

export default router;
