
import express from "express";

import {
  createContactMessage,
  getContactMessages,
  getContactMessageById,
  updateContactMessage,
  deleteContactMessage,
} from "../controllers/contact.controller.js";

import authenticate from "../middleware/authenticate.middleware.js";
import authorize from "../middleware/authorize.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC CONTACT ROUTES
|--------------------------------------------------------------------------
| Anyone can submit a contact message without signing in.
*/

// POST /api/contact
router.post("/", createContactMessage);

/*
|--------------------------------------------------------------------------
| ADMIN CONTACT ROUTES
|--------------------------------------------------------------------------
| Only authenticated administrators can manage contact messages.
*/

// GET /api/contact/admin
router.get(
  "/admin",
  authenticate,
  authorize("admin"),
  getContactMessages
);

// GET /api/contact/admin/:id
router.get(
  "/admin/:id",
  authenticate,
  authorize("admin"),
  getContactMessageById
);

// PATCH /api/contact/admin/:id
router.patch(
  "/admin/:id",
  authenticate,
  authorize("admin"),
  updateContactMessage
);

// DELETE /api/contact/admin/:id
router.delete(
  "/admin/:id",
  authenticate,
  authorize("admin"),
  deleteContactMessage
);

export default router;
