
import {
  createResource,
  getPublishedResources,
  getPublishedResourceById,
  getAllResources,
  getResourceById,
} from "../services/resource.service.js";

// GET /api/resources
// Public: list published resources.
export async function listPublishedResources(req, res) {
  const resources = await getPublishedResources();

  return res.status(200).json({
    success: true,
    count: resources.length,
    data: resources,
  });
}

// GET /api/resources/:id
// Public: retrieve one published resource.
export async function getPublishedResource(req, res) {
  const resource = await getPublishedResourceById(
    req.params.id
  );

  return res.status(200).json({
    success: true,
    data: resource,
  });
}

// GET /api/resources/admin
// Admin-only: list all resources, including drafts.
export async function listAllResources(req, res) {
  const resources = await getAllResources();

  return res.status(200).json({
    success: true,
    count: resources.length,
    data: resources,
  });
}

// GET /api/resources/admin/:id
// Admin-only: retrieve a resource by ID.
export async function getAdminResource(req, res) {
  const resource = await getResourceById(req.params.id);

  return res.status(200).json({
    success: true,
    data: resource,
  });
}

// POST /api/resources
// Admin-only: upload a document and create a resource.
export async function createResourceDocument(req, res) {
  const uploadedBy = req.user?._id || req.user?.id;

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message:
        "No document reached the controller. Check the upload middleware and ensure the file field is named 'file'.",
    });
  }

  const resource = await createResource(
    req.body,
    req.file,
    uploadedBy
  );

  return res.status(201).json({
    success: true,
    message: "Resource uploaded successfully.",
    data: resource,
  });
}
