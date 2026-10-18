
import api from "./api.js";

// Public contact form submission
export async function createContactMessage(messageData) {
  const response = await api.post("/contact", messageData);
  return response.data;
}

// Admin: retrieve all contact messages
export async function getContactMessages() {
  const response = await api.get("/contact/admin");
  return response.data;
}

// Admin: retrieve one message
export async function getContactMessageById(id) {
  const response = await api.get(`/contact/admin/${id}`);
  return response.data;
}

// Admin: update message status
export async function updateContactMessage(id, updates) {
  const response = await api.patch(`/contact/admin/${id}`, updates);
  return response.data;
}

// Admin: delete a message
export async function deleteContactMessage(id) {
  const response = await api.delete(`/contact/admin/${id}`);
  return response.data;
}
