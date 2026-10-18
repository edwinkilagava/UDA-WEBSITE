import mongoose from "mongoose";
import News from "../models/News.js";

const NEWS_SELECT_FIELDS =
  "title excerpt content image publishedAt status createdAt updatedAt";

function validateNewsId(id) {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error("Invalid news article ID.");
    error.statusCode = 400;
    throw error;
  }
}

function createNotFoundError() {
  const error = new Error("News article not found.");
  error.statusCode = 404;
  return error;
}

// Public: return published news, newest first.
export async function getPublishedNews() {
  return News.find({ status: "published" })
    .select(NEWS_SELECT_FIELDS)
    .sort({ publishedAt: -1, _id: -1 })
    .lean();
}

// Public: retrieve one published article.
export async function getPublishedNewsById(id) {
  validateNewsId(id);

  const article = await News.findOne({
    _id: id,
    status: "published",
  })
    .select(NEWS_SELECT_FIELDS)
    .lean();

  if (!article) {
    throw createNotFoundError();
  }

  return article;
}

// Admin functionality: create a news article.
export async function createNews(newsData) {
  const article = await News.create(newsData);

  return article.toObject();
}

// Admin functionality: list all articles, including drafts.
export async function getAllNews() {
  return News.find()
    .select(NEWS_SELECT_FIELDS)
    .sort({ createdAt: -1, _id: -1 })
    .lean();
}

// Admin functionality: retrieve an article by ID.
export async function getNewsById(id) {
  validateNewsId(id);

  const article = await News.findById(id)
    .select(NEWS_SELECT_FIELDS)
    .lean();

  if (!article) {
    throw createNotFoundError();
  }

  return article;
}

// Admin functionality: update an article.
export async function updateNews(id, newsData) {
  validateNewsId(id);

  const article = await News.findById(id);

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
export async function deleteNews(id) {
  validateNewsId(id);

  const article = await News.findByIdAndDelete(id);

  if (!article) {
    throw createNotFoundError();
  }

  return { id: article._id };
}