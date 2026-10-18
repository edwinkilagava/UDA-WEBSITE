
import {
  getPublishedEvents,
  getPublishedEventsById,
  createEvents,
  getAllEvents,
  getEventsById,
  updateEvents,
  deleteEvents,
} from "../services/event.service.js";

// GET /api/events
// Public: retrieve all published events.
export async function listPublishedEvents(req, res) {
  const events = await getPublishedEvents();

  return res.status(200).json({
    success: true,
    count: events.length,
    data: events,
  });
}

// GET /api/events/:id
// Public: retrieve one published event.
export async function getPublishedEventsArticle(req, res) {
  const event = await getPublishedEventsById(req.params.id);

  return res.status(200).json({
    success: true,
    data: event,
  });
}

// GET /api/events/admin
// Admin-only: retrieve all events.
export async function listAllEvents(req, res) {
  const events = await getAllEvents();

  return res.status(200).json({
    success: true,
    count: events.length,
    data: events,
  });
}

// GET /api/events/admin/:id
// Admin-only: retrieve one event.
export async function getEventArticle(req, res) {
  const event = await getEventsById(req.params.id);

  return res.status(200).json({
    success: true,
    data: event,
  });
}

// POST /api/events
// Admin-only: create an event.
export async function createEventArticle(req, res) {
  const event = await createEvents(req.body);

  return res.status(201).json({
    success: true,
    message: "Event created successfully.",
    data: event,
  });
}

// PATCH /api/events/:id
// Admin-only: update an event.
export async function updateEventArticle(req, res) {
  const event = await updateEvents(req.params.id, req.body);

  return res.status(200).json({
    success: true,
    message: "Event updated successfully.",
    data: event,
  });
}

// DELETE /api/events/:id
// Admin-only: delete an event.
export async function removeEventArticle(req, res) {
  await deleteEvents(req.params.id);

  return res.status(200).json({
    success: true,
    message: "Event deleted successfully.",
  });
}
