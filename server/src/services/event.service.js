import mongoose from "mongoose";
import Events from "../models/Events.js";

const EVENTS_SELECT_FIELDS =
  "title excerpt content image publishedAt status createdAt updatedAt";

function validateEventsId(id) {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error("Invalid events article ID.");
    error.statusCode = 400;
    throw error;
  }
}

function createNotFoundError() {
  const error = new Error("Events article not found.");
  error.statusCode = 404;
  return error;
}

// Public: return published news, newest first.
export async function getPublishedEvents() {
  return Events.find({ status: "published" })
    .select(EVENTS_SELECT_FIELDS)
    .sort({ publishedAt: -1, _id: -1 })
    .lean();
}

// Public: retrieve one published article.
export async function getPublishedEventsById(id) {
  validateEventsId(id);

  const article = await Events.findOne({
    _id: id,
    status: "published",
  })
    .select(EVENTS_SELECT_FIELDS)
    .lean();

  if (!article) {
    throw createNotFoundError();
  }

  return article;
}

// Admin functionality: create a news article.
export async function createEvents(EventsData) {
  const article = await Events.create(EventsData);

  return article.toObject();
}

// Admin functionality: list all articles, including drafts.
export async function getAllEvents() {
  return Events.find()
    .select(EVENTS_SELECT_FIELDS)
    .sort({ createdAt: -1, _id: -1 })
    .lean();
}

// Admin functionality: retrieve an article by ID.
export async function getEventsById(id) {
  validateEventsId(id);

  const article = await Events.findById(id)
    .select(EVENTS_SELECT_FIELDS)
    .lean();

  if (!article) {
    throw createNotFoundError();
  }

  return article;
}

// Admin functionality: update an article.
export async function updateEvents(id, newsData) {
  validateEventsId(id);

  const article = await Events.findById(id);

  if (!article) {
    throw createNotFoundError();
  }

  for (const [key, value] of Object.entries(newsData)) {
    article.set(key, value);
  }

  await article.save();

  return article.toObject();
}

// Admin functionality: delete an article.
export async function deleteEvents(id) {
  validateEventsId(id);

  const article = await Events.findByIdAndDelete(id);

  if (!article) {
    throw createNotFoundError();
  }

  return { id: article._id };
}