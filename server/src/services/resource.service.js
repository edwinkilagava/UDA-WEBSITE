
import mongoose from "mongoose";
import path from "path";
import { randomUUID } from "crypto";
import { Readable } from "stream";

import Resource from "../models/Resource.js";
import cloudinary from "../config/cloudinary.js";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const ALLOWED_TYPES = {
  ".pdf": "application/pdf",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

const PUBLIC_RESOURCE_FIELDS =
  "title description category fileName fileUrl fileFormat fileSize publishedAt createdAt";

const ADMIN_RESOURCE_FIELDS =
  "title description category fileName fileUrl fileFormat fileSize status publishedAt uploadedBy createdAt updatedAt";

function createResourceError(message, statusCode = 500) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function validateResourceId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw createResourceError("Invalid resource ID.", 400);
  }
}

function createNotFoundError() {
  return createResourceError("Resource not found.", 404);
}

function validateDocument(file) {
  if (!file) {
    throw createResourceError(
      "Please select a document to upload.",
      400
    );
  }

  if (!file.buffer || file.size === 0) {
    throw createResourceError(
      "The selected document is empty or invalid.",
      400
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw createResourceError(
      "The document must not exceed 50 MiB.",
      400
    );
  }

  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  if (!Object.hasOwn(ALLOWED_TYPES, extension)) {
    throw createResourceError(
      "Only PDF and DOCX documents are allowed.",
      400
    );
  }

  if (file.mimetype !== ALLOWED_TYPES[extension]) {
    throw createResourceError(
      "The document type does not match its file extension.",
      400
    );
  }

  return extension;
}

/**
 * Uploads a PDF or DOCX document to Cloudinary.
 *
 * PDFs use the image resource type so they can be delivered
 * through Cloudinary's PDF delivery URLs.
 *
 * DOCX documents use the raw resource type.
 */
function uploadFileToCloudinary(file, extension) {
  const safeName =
    path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .slice(0, 80) || "document";

  const isPdf = extension === ".pdf";
  const resourceType = isPdf ? "image" : "raw";

  const publicId =
    `${randomUUID()}-${safeName}` +
    (isPdf ? "" : extension);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder: "uda-resources",
        public_id: publicId,

        ...(isPdf
          ? {
              format: "pdf",
            }
          : {}),
      },
      (error, result) => {
        if (error) {
          console.error(
            "Cloudinary upload error:",
            error
          );

          return reject(
            createResourceError(
              "Cloudinary could not upload the document. Check your Cloudinary configuration."
            )
          );
        }

        if (!result || !result.secure_url || !result.public_id) {
          return reject(
            createResourceError(
              "Cloudinary returned an incomplete upload result."
            )
          );
        }

        console.log("Cloudinary upload successful:", {
          resource_type: result.resource_type,
          format: result.format,
          public_id: result.public_id,
          secure_url: result.secure_url,
        });

        resolve({
          ...result,
          resource_type: resourceType,
        });
      }
    );

    uploadStream.on("error", (error) => {
      console.error("Cloudinary upload stream error:", error);
    });

    Readable.from(file.buffer).pipe(uploadStream);
  });
}

async function deleteCloudinaryFile(
  publicId,
  resourceType = "raw"
) {
  if (!publicId) return;

  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    type: "upload",
  });
}

// ADMIN: Create a resource.
export async function createResource(
  resourceData,
  file,
  uploadedBy
) {
  if (
    !uploadedBy ||
    !mongoose.isValidObjectId(uploadedBy)
  ) {
    throw createResourceError(
      "A valid authenticated admin is required.",
      401
    );
  }

  const title =
    typeof resourceData.title === "string"
      ? resourceData.title.trim()
      : "";

  const description =
    typeof resourceData.description === "string"
      ? resourceData.description.trim()
      : "";

  const category =
    typeof resourceData.category === "string"
      ? resourceData.category.trim()
      : "";

  if (!title || title.length > 150) {
    throw createResourceError(
      "Title is required and must not exceed 150 characters.",
      400
    );
  }

  if (description.length > 2000) {
    throw createResourceError(
      "Description must not exceed 2,000 characters.",
      400
    );
  }

  if (!category || category.length > 100) {
    throw createResourceError(
      "Category is required and must not exceed 100 characters.",
      400
    );
  }

  const extension = validateDocument(file);

  const status =
    resourceData.status === "published"
      ? "published"
      : "draft";

  let uploadedFile;

  try {
    uploadedFile = await uploadFileToCloudinary(
      file,
      extension
    );

    const resource = await Resource.create({
      title,
      description,
      category,
      fileName: path.basename(file.originalname),
      fileUrl: uploadedFile.secure_url,
      filePublicId: uploadedFile.public_id,
      fileFormat: extension.slice(1),
      fileSize: file.size,
      status,
      publishedAt:
        status === "published" ? new Date() : null,
      uploadedBy,
    });

    return resource.toObject();
  } catch (error) {
    if (uploadedFile?.public_id) {
      try {
        await deleteCloudinaryFile(
          uploadedFile.public_id,
          uploadedFile.resource_type
        );
      } catch (cleanupError) {
        console.error(
          "Cloudinary cleanup failed:",
          cleanupError.message
        );
      }
    }

    if (error.statusCode) {
      throw error;
    }

    console.error(
      "Resource creation failed:",
      error
    );

    throw createResourceError(
      "Unable to save the resource. Please try again."
    );
  }
}

// PUBLIC: Get published resources.
export async function getPublishedResources() {
  return Resource.find({
    status: "published",
  })
    .select(PUBLIC_RESOURCE_FIELDS)
    .sort({ publishedAt: -1, _id: -1 })
    .lean();
}

// PUBLIC: Get one published resource.
export async function getPublishedResourceById(id) {
  validateResourceId(id);

  const resource = await Resource.findOne({
    _id: id,
    status: "published",
  })
    .select(PUBLIC_RESOURCE_FIELDS)
    .lean();

  if (!resource) {
    throw createNotFoundError();
  }

  return resource;
}

// ADMIN: Get all resources, including drafts.
export async function getAllResources() {
  return Resource.find()
    .select(ADMIN_RESOURCE_FIELDS)
    .sort({ createdAt: -1, _id: -1 })
    .lean();
}

// ADMIN: Get any resource by ID.
export async function getResourceById(id) {
  validateResourceId(id);

  const resource = await Resource.findById(id)
    .select(ADMIN_RESOURCE_FIELDS)
    .lean();

  if (!resource) {
    throw createNotFoundError();
  }

  return resource;
}