import {
  getPublishedNews,
  getPublishedNewsById,
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
} from "../services/news.service.js";

// GET /api/news
// Public: retrieve published news.
export async function listPublishedNews(req, res) {
  const articles = await getPublishedNews();

  return res.status(200).json({
    success: true,
    count: articles.length,
    data: articles,
  });
}

// GET /api/news/:id
// Public: retrieve one published article.
export async function getPublishedNewsArticle(req, res) {
  const article = await getPublishedNewsById(req.params.id);

  return res.status(200).json({
    success: true,
    data: article,
  });
}

// GET /api/news/admin
// Admin-only once authentication is implemented.
export async function listAllNews(req, res) {
  const articles = await getAllNews();

  return res.status(200).json({
    success: true,
    count: articles.length,
    data: articles,
  });
}

// GET /api/news/admin/:id
// Admin-only once authentication is implemented.
export async function getNewsArticle(req, res) {
  const article = await getNewsById(req.params.id);

  return res.status(200).json({
    success: true,
    data: article,
  });
}

// POST /api/news
// Admin-only once authentication is implemented.
export async function createNewsArticle(req, res) {
  const article = await createNews(req.body);

  return res.status(201).json({
    success: true,
    message: "News article created successfully.",
    data: article,
  });
}

// PATCH /api/news/:id
// Admin-only once authentication is implemented.
export async function updateNewsArticle(req, res) {
  const article = await updateNews(req.params.id, req.body);

  return res.status(200).json({
    success: true,
    message: "News article updated successfully.",
    data: article,
  });
}

// DELETE /api/news/:id
// Admin-only once authentication is implemented.
export async function removeNewsArticle(req, res) {
  await deleteNews(req.params.id);

  return res.status(200).json({
    success: true,
    message: "News article deleted successfully.",
  });
}