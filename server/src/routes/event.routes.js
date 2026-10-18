import express from "express";

import {
  listPublishedEvents,
  getPublishedEventsArticle,
  listAllEvents,
  getEventArticle,
  createEventArticle,
  updateEventArticle,
  removeEventArticle,
} from "../controllers/event.controller.js";

import authenticate from "../middleware/authenticate.middleware.js";
import authorize from "../middleware/authorize.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC EVENT ROUTES
|--------------------------------------------------------------------------
| Anyone can read published events without signing in.
*/

// GET /api/events
router.get("/", listPublishedEvents);

/*
|--------------------------------------------------------------------------
| ADMIN EVENT ROUTES
|--------------------------------------------------------------------------
| Only authenticated administrators can manage events.
*/

// GET /api/events/admin
router.get(
  "/admin",
  authenticate,
  authorize("admin"),
  listAllEvents
);

// GET /api/events/admin/:id
router.get(
  "/admin/:id",
  authenticate,
  authorize("admin"),
  getEventArticle
);

// POST /api/events
router.post(
  "/",
  authenticate,
  authorize("admin"),
  createEventArticle
);

/*
|--------------------------------------------------------------------------
| PUBLIC SINGLE-EVENT ROUTE
|--------------------------------------------------------------------------
| Keep this after the more specific admin GET routes.
*/

// GET /api/events/:id
router.get("/:id", getPublishedEventsArticle);

/*
|--------------------------------------------------------------------------
| ADMIN UPDATE AND DELETE ROUTES
|--------------------------------------------------------------------------
*/

// PATCH /api/events/:id
router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  updateEventArticle
);

// DELETE /api/events/:id
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  removeEventArticle
);

export default router;