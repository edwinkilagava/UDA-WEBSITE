
import api from "./api";

// Validate event ID before making a request.
function validateId(id) {
  if (!id) {
    throw new Error("Event ID is required");
  }
}

// Handle API errors consistently.
function handleApiError(error, action) {
  const status = error.response?.status;
  const message =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "An unexpected error occurred.";

  console.error(`${action} failed:`, {
    status,
    message,
    response: error.response?.data,
  });

  throw new Error(message);
}

// GET /api/events
// Retrieve all published events.
export async function getEvents() {
  try {
    const response = await api.get("/events");
    return response.data;
  } catch (error) {
    handleApiError(error, "Fetching events");
  }
}

// GET /api/events/:id
// Retrieve one published event.
export async function getEventsById(id) {
  validateId(id);

  try {
    const response = await api.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "Fetching event");
  }
}

// POST /api/events
// Create a new event.
export async function createEvents(eventData) {
  try {
    const response = await api.post("/events", eventData);
    return response.data;
  } catch (error) {
    handleApiError(error, "Creating event");
  }
}

// PATCH /api/events/:id
// Update an existing event.
export async function updateEvents(id, eventData) {
  validateId(id);

  try {
    const response = await api.patch(`/events/${id}`, eventData);
    return response.data;
  } catch (error) {
    handleApiError(error, "Updating event");
  }
}

// DELETE /api/events/:id
// Delete an event.
export async function deleteEvents(id) {
  validateId(id);

  try {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "Deleting event");
  }
}
