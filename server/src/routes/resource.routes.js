import express from "express";

import {
  listPublishedResources,
  getPublishedResource,
  listAllResources,
  getAdminResource,
  createResourceDocument,
} from "../controllers/resource.controller.js";

import authenticate from "../middleware/authenticate.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import uploadResourceFile from "../middleware/resourceUpload.middleware.js";

const router = express.Router();

// PUBLIC ROUTES

// GET /api/resources
router.get("/", listPublishedResources);

// ADMIN ROUTES

// GET /api/resources/admin
router.get(
  "/admin",
  authenticate,
  authorize("admin"),
  listAllResources
);

// GET /api/resources/admin/:id
router.get(
  "/admin/:id",
  authenticate,
  authorize("admin"),
  getAdminResource
);

// POST /api/resources
router.post(
  "/",
  authenticate,
  authorize("admin"),
  uploadResourceFile.single("file"),
  createResourceDocument
);

// PUBLIC SINGLE-RESOURCE ROUTE
// Keep this after the more specific admin GET routes.
router.get("/:id", getPublishedResource);

export default router;