
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getAdminNewsById,
  updateNews,
} from "../../services/news.service.js";

const INITIAL_FORM = {
  title: "",
  excerpt: "",
  content: "",
  image: "",
  status: "draft",
};

const MAX_CONTENT_LENGTH = 50000;
const MAX_IMAGE_URL_LENGTH = 2048;
const ALLOWED_STATUSES = ["draft", "published"];

const INPUT_CLASS =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-700 focus:ring-2 focus:ring-green-700/20 disabled:cursor-not-allowed disabled:opacity-60";

const LABEL_CLASS = "mb-2 block text-sm font-semibold text-gray-800";

function extractNews(response) {
  const article =
    response?.data?.data ??
    response?.data?.news ??
    response?.data ??
    response?.news ??
    response;

  if (
    !article ||
    typeof article !== "object" ||
    !(article._id || article.id)
  ) {
    return null;
  }

  return article;
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

function validateImageUrl(value) {
  if (!value) {
    return "Featured image URL is required.";
  }

  if (value.length > MAX_IMAGE_URL_LENGTH) {
    return "Image URL cannot exceed 2,048 characters.";
  }

  try {
    const url = new URL(value);

    if (
      !["http:", "https:"].includes(url.protocol) ||
      !url.hostname
    ) {
      return "Enter a valid HTTP or HTTPS image URL.";
    }
  } catch {
    return "Enter a valid image URL.";
  }

  return "";
}

function validateForm(form) {
  const errors = {};

  const title = form.title.trim();
  const excerpt = form.excerpt.trim();
  const content = form.content.trim();
  const image = form.image.trim();

  if (title.length < 5) {
    errors.title = "Title must be at least 5 characters.";
  } else if (title.length > 200) {
    errors.title = "Title cannot exceed 200 characters.";
  }

  if (excerpt.length < 10) {
    errors.excerpt = "Excerpt must be at least 10 characters.";
  } else if (excerpt.length > 500) {
    errors.excerpt = "Excerpt cannot exceed 500 characters.";
  }

  if (content.length < 20) {
    errors.content = "Content must be at least 20 characters.";
  } else if (content.length > MAX_CONTENT_LENGTH) {
    errors.content = "Content cannot exceed 50,000 characters.";
  }

  const imageError = validateImageUrl(image);

  if (imageError) {
    errors.image = imageError;
  }

  if (!ALLOWED_STATUSES.includes(form.status)) {
    errors.status = "Choose a valid publication status.";
  }

  return errors;
}

function EditNews() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [imagePreviewError, setImagePreviewError] = useState(false);

  const loadArticle = useCallback(async () => {
    if (!id) {
      setPageError("The news article ID is missing from the URL.");
      setLoadingArticle(false);
      return;
    }

    setLoadingArticle(true);
    setPageError("");
    setSubmitError("");
    setFieldErrors({});
    setImagePreviewError(false);

    try {
      const response = await getAdminNewsById(id);
      const article = extractNews(response);

      if (!article) {
        setPageError(
          "The article could not be found or the server returned an unexpected response."
        );
        return;
      }

      setForm({
        title: article.title ?? "",
        excerpt: article.excerpt ?? "",
        content: article.content ?? "",
        image: article.image ?? "",
        status: article.status ?? "draft",
      });
    } catch (error) {
      setPageError(getErrorMessage(error));
    } finally {
      setLoadingArticle(false);
    }
  }, [id]);

  useEffect(() => {
    loadArticle();
  }, [loadArticle]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setFieldErrors((current) => ({
      ...current,
      [name]: "",
    }));

    if (name === "image") {
      setImagePreviewError(false);
    }

    setSubmitError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving || !id) {
      return;
    }

    const errors = validateForm(form);

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setSubmitError("");
      return;
    }

    setSaving(true);
    setSubmitError("");

    const payload = {
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      image: form.image.trim(),
      status: form.status,
    };

    try {
      await updateNews(id, payload);

      navigate("/admin/news", {
        replace: true,
        state: {
          successMessage:
            payload.status === "published"
              ? "News article updated and published successfully."
              : "News article saved as a draft successfully.",
        },
      });
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  const imageUrl = form.image.trim();

  if (loadingArticle) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div
          role="status"
          className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm"
        >
          <p className="text-sm text-gray-600">
            Loading article details...
          </p>
        </div>
      </section>
    );
  }

  if (pageError) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-bold text-gray-900">
            Unable to load article
          </h1>

          <p role="alert" className="mt-3 text-sm text-red-700">
            {pageError}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadArticle}
              className="rounded-lg bg-green-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-900"
            >
              Try again
            </button>

            <Link
              to="/admin/news"
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Back to news
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          to="/admin/news"
          className="text-sm font-semibold text-green-800 hover:text-green-950"
        >
          &larr; Back to news
        </Link>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Edit News Article
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          Update the article details below. Changes are saved when
          you submit the form.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8"
      >
        {submitError && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {submitError}
          </div>
        )}

        <div>
          <label htmlFor="title" className={LABEL_CLASS}>
            Article title <span className="text-red-600">*</span>
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            minLength={5}
            maxLength={200}
            required
            disabled={saving}
            aria-invalid={Boolean(fieldErrors.title)}
            aria-describedby={
              fieldErrors.title ? "title-error" : undefined
            }
            placeholder="Enter a clear, descriptive headline"
            className={INPUT_CLASS}
          />

          {fieldErrors.title && (
            <p id="title-error" className="mt-2 text-sm text-red-600">
              {fieldErrors.title}
            </p>
          )}

          <p className="mt-1 text-right text-xs text-gray-500">
            {form.title.length}/200
          </p>
        </div>

        <div>
          <label htmlFor="excerpt" className={LABEL_CLASS}>
            Short summary <span className="text-red-600">*</span>
          </label>

          <textarea
            id="excerpt"
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            rows={3}
            minLength={10}
            maxLength={500}
            required
            disabled={saving}
            aria-invalid={Boolean(fieldErrors.excerpt)}
            aria-describedby={
              fieldErrors.excerpt
                ? "excerpt-error"
                : "excerpt-help"
            }
            placeholder="Write a concise summary of the article."
            className={`${INPUT_CLASS} resize-y`}
          />

          {fieldErrors.excerpt ? (
            <p
              id="excerpt-error"
              className="mt-2 text-sm text-red-600"
            >
              {fieldErrors.excerpt}
            </p>
          ) : (
            <p id="excerpt-help" className="mt-2 text-xs text-gray-500">
              This summary can appear on news cards and article previews.
            </p>
          )}

          <p className="mt-1 text-right text-xs text-gray-500">
            {form.excerpt.length}/500
          </p>
        </div>

        <div>
          <label htmlFor="image" className={LABEL_CLASS}>
            Featured image URL <span className="text-red-600">*</span>
          </label>

          <input
            id="image"
            name="image"
            type="url"
            value={form.image}
            onChange={handleChange}
            maxLength={MAX_IMAGE_URL_LENGTH}
            required
            disabled={saving}
            aria-invalid={Boolean(fieldErrors.image)}
            aria-describedby={
              fieldErrors.image ? "image-error" : "image-help"
            }
            placeholder="https://example.com/news-image.jpg"
            className={INPUT_CLASS}
          />

          {fieldErrors.image ? (
            <p id="image-error" className="mt-2 text-sm text-red-600">
              {fieldErrors.image}
            </p>
          ) : (
            <p id="image-help" className="mt-2 text-xs text-gray-500">
              Use a publicly accessible image URL. This field does not
              upload files.
            </p>
          )}

          {imageUrl &&
            !fieldErrors.image &&
            !imagePreviewError && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-semibold text-gray-800">
                  Image preview
                </p>

                <img
                  src={imageUrl}
                  alt="Article featured image preview"
                  loading="lazy"
                  className="max-h-72 w-full rounded-lg border border-gray-200 object-cover"
                  onError={() => setImagePreviewError(true)}
                />
              </div>
            )}

          {imagePreviewError && !fieldErrors.image && (
            <p className="mt-2 text-sm text-amber-700">
              The image preview could not be loaded. Check that the URL
              points to an accessible image.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="content" className={LABEL_CLASS}>
            Article content <span className="text-red-600">*</span>
          </label>

          <textarea
            id="content"
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={12}
            minLength={20}
            maxLength={MAX_CONTENT_LENGTH}
            required
            disabled={saving}
            aria-invalid={Boolean(fieldErrors.content)}
            aria-describedby={
              fieldErrors.content
                ? "content-error"
                : "content-help"
            }
            placeholder="Write the full news article here..."
            className={`${INPUT_CLASS} resize-y`}
          />

          {fieldErrors.content ? (
            <p
              id="content-error"
              className="mt-2 text-sm text-red-600"
            >
              {fieldErrors.content}
            </p>
          ) : (
            <p id="content-help" className="mt-2 text-xs text-gray-500">
              Review names, dates, facts, and wording before saving.
            </p>
          )}

          <p className="mt-1 text-right text-xs text-gray-500">
            {form.content.length}/{MAX_CONTENT_LENGTH}
          </p>
        </div>

        <div>
          <label htmlFor="status" className={LABEL_CLASS}>
            Publication status <span className="text-red-600">*</span>
          </label>

          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            required
            disabled={saving}
            aria-invalid={Boolean(fieldErrors.status)}
            aria-describedby={
              fieldErrors.status ? "status-error" : undefined
            }
            className={INPUT_CLASS}
          >
            <option value="draft">Save as draft</option>
            <option value="published">Published</option>
          </select>

          {fieldErrors.status && (
            <p
              id="status-error"
              className="mt-2 text-sm text-red-600"
            >
              {fieldErrors.status}
            </p>
          )}

          <p className="mt-2 text-xs text-gray-500">
            Draft articles are not publicly displayed. Published articles
            can appear on the website.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
          <Link
            to="/admin/news"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center rounded-lg bg-green-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving changes..."
              : form.status === "published"
                ? "Save and Publish"
                : "Save Draft"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default EditNews;
