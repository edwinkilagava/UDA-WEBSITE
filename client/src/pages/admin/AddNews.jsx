
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createNews } from "../../services/news.service.js";

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

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.data?.message ||
    error?.message ||
    "Unable to create the news article. Please try again."
  );
}

function validateImageUrl(value) {
  try {
    const url = new URL(value);

    return (
      ["http:", "https:"].includes(url.protocol) &&
      Boolean(url.hostname)
    );
  } catch {
    return false;
  }
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

  if (!image) {
    errors.image = "Featured image URL is required.";
  } else if (image.length > MAX_IMAGE_URL_LENGTH) {
    errors.image = "Image URL cannot exceed 2,048 characters.";
  } else if (!validateImageUrl(image)) {
    errors.image = "Enter a valid HTTP or HTTPS image URL.";
  }

  if (!ALLOWED_STATUSES.includes(form.status)) {
    errors.status = "Choose draft or published status.";
  }

  return errors;
}

function AddNews() {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);
  const [imagePreviewError, setImagePreviewError] = useState(false);

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

    if (saving) {
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
      await createNews(payload);

      navigate("/admin/news", {
        replace: true,
        state: {
          successMessage:
            payload.status === "published"
              ? "News article published successfully."
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
          Create News Article
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          Prepare an article for the UDA website. Review the details
          before saving it as a draft or publishing it.
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
              This summary can be displayed on news cards and article
              previews.
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
            <p
              id="image-error"
              className="mt-2 text-sm text-red-600"
            >
              {fieldErrors.image}
            </p>
          ) : (
            <p id="image-help" className="mt-2 text-xs text-gray-500">
              Enter a publicly accessible image URL. This field does
              not upload files.
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
              The image preview could not be loaded. Check that the
              URL points to an accessible image.
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
              Use clear paragraphs and verify names, dates, and facts
              before publishing.
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
            <option value="published">Publish immediately</option>
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
            Drafts remain unpublished. Published articles can appear
            on the public website.
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
              ? "Saving article..."
              : form.status === "published"
                ? "Publish Article"
                : "Save Draft"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddNews;
