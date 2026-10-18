
import api from "./api.js";

// Get all published resources for the public Resources page.
export async function getPublishedResources() {
  const response = await api.get("/resources");
  return response.data;
}

// Get one published resource by its ID.
export async function getPublishedResourceById(id) {
  if (!id) {
    throw new Error("Resource ID is required.");
  }

  const response = await api.get(
    `/resources/${encodeURIComponent(id)}`
  );

  return response.data;
}

// Get all resources, including drafts, for the admin.
export async function getAllResources() {
  const response = await api.get("/resources/admin");
  return response.data;
}

// Get one resource by its ID in the admin area.
export async function getAdminResourceById(id) {
  if (!id) {
    throw new Error("Resource ID is required.");
  }

  const response = await api.get(
    `/resources/admin/${encodeURIComponent(id)}`
  );

  return response.data;
}

// Upload a PDF or DOCX document.
export async function createResource(resourceData) {
  const { title, description, category, status, file } =
    resourceData;

  if (!(file instanceof File)) {
    throw new Error(
      "No valid document was provided. Please select a file again."
    );
  }

  if (file.size === 0) {
    throw new Error("The selected document is empty.");
  }

  const formData = new FormData();

  formData.append("title", title.trim());
  formData.append("description", description.trim());
  formData.append("category", category.trim());
  formData.append("status", status);
  formData.append("file", file, file.name);

  // Let Axios/browser set the multipart boundary automatically.
  const response = await api.post("/resources", formData);

  return response.data;
}
