import api from "./api.js";

/**
 * Validate a news article ID before making a request.
 */
function validateId(id) {
  if (typeof id !== "string" || !id.trim()) {
    throw new Error("A valid news article ID is required.");
  }

  return encodeURIComponent(id.trim());
}

/**
 * PUBLIC: Retrieve published news articles.
 * GET /api/news
 */
export async function getNews() {
  const response = await api.get("/news");
  return response.data;
}

/**
 * PUBLIC: Retrieve one published news article.
 * GET /api/news/:id
 */
export async function getNewsById(id) {
  const articleId = validateId(id);
  const response = await api.get(`/news/${articleId}`);

  return response.data;
}

/**
 * ADMIN: Retrieve all articles, including drafts.
 * GET /api/news/admin
 */
export async function getAllNews() {
  const response = await api.get("/news/admin");

  return response.data;
}

/**
 * ADMIN: Retrieve one article, including drafts.
 * GET /api/news/admin/:id
 */
export async function getAdminNewsById(id) {
  const articleId = validateId(id);
  const response = await api.get(`/news/admin/${articleId}`);

  return response.data;
}

/**
 * ADMIN: Create a news article.
 * POST /api/news
 */
export async function createNews(newsData) {
  const response = await api.post("/news", newsData);

  return response.data;
}

/**
 * ADMIN: Update a news article.
 * PATCH /api/news/:id
 */
export async function updateNews(id, newsData) {
  const articleId = validateId(id);
  const response = await api.patch(`/news/${articleId}`, newsData);

  return response.data;
}

/**
 * ADMIN: Delete a news article.
 * DELETE /api/news/:id
 */
export async function deleteNews(id) {
  const articleId = validateId(id);
  const response = await api.delete(`/news/${articleId}`);

  return response.data;
}
