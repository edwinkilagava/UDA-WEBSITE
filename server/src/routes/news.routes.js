
import express from "express";

import {
  listPublishedNews,
  getPublishedNewsArticle,
  listAllNews,
  getNewsArticle,
  createNewsArticle,
  updateNewsArticle,
  removeNewsArticle,
} from "../controllers/news.controller.js";

import authenticate from "../middleware/authenticate.middleware.js";
import authorize from "../middleware/authorize.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC NEWS ROUTES
|--------------------------------------------------------------------------
| Anyone can read published news without signing in.
*/

// GET /api/news
router.get("/", listPublishedNews);

/*
|--------------------------------------------------------------------------
| ADMIN NEWS ROUTES
|--------------------------------------------------------------------------
| Only authenticated administrators can manage news.
*/

// GET /api/news/admin
router.get(
  "/admin",
  authenticate,
  authorize("admin"),
  listAllNews
);

// GET /api/news/admin/:id
router.get(
  "/admin/:id",
  authenticate,
  authorize("admin"),
  getNewsArticle
);

// POST /api/news
router.post(
  "/",
  authenticate,
  authorize("admin"),
  createNewsArticle
);

/*
|--------------------------------------------------------------------------
| PUBLIC SINGLE-ARTICLE ROUTE
|--------------------------------------------------------------------------
| Keep this after the more specific admin GET routes.
*/

// GET /api/news/:id
router.get("/:id", getPublishedNewsArticle);

/*
|--------------------------------------------------------------------------
| ADMIN UPDATE AND DELETE ROUTES
|--------------------------------------------------------------------------
*/

// PATCH /api/news/:id
router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  updateNewsArticle
);

// DELETE /api/news/:id
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  removeNewsArticle
);

export default router;
