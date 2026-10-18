
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../services/api.js";

const INITIAL_FORM = {
  title: "",
  description: "",
  category: "",
  fileUrl: "",
};

const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_CATEGORY_LENGTH = 100;
const MAX_URL_LENGTH = 2048;

function getErrorMessage(error) {
  const responseData = error?.response?.data;

  if (Array.isArray(responseData?.errors)) {
    return responseData.errors
      .map((item) => item.message || item.msg)
      .filter(Boolean)
      .join(" ");
  }

  return (
    responseData?.message ||
    responseData?.error ||
    error?.message ||
    "Unable to upload the resource. Please try again."
  );
}

function validateUrl(value) {
  try {
    const url = new URL(value);

    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function validateForm(form) {
  const errors = {};

  const title = form.title.trim();
  const description = form.description.trim();
  const category = form.category.trim();
  const fileUrl = form.fileUrl.trim();

  if (!title) {
    errors.title = "Resource title is required.";
  } else if (title.length > MAX_TITLE_LENGTH) {
    errors.title = `Title cannot exceed ${MAX_TITLE_LENGTH} characters.`;
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.`;
  }

  if (!category) {
    errors.category = "Please provide a category.";
  } else if (category.length > MAX_CATEGORY_LENGTH) {
    errors.category = `Category cannot exceed ${MAX_CATEGORY_LENGTH} characters.`;
  }

  if (!fileUrl) {
    errors.fileUrl = "A resource URL is required.";
  } else if (fileUrl.length > MAX_URL_LENGTH) {
    errors.fileUrl = "The resource URL is too long.";
  } else if (!validateUrl(fileUrl)) {
    errors.fileUrl = "Enter a valid HTTP or HTTPS URL.";
  }

  return errors;
}

function UploadDownload() {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    setSubmitError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) return;

    const validationErrors = validateForm(form);

    setErrors(validationErrors);
    setSubmitError("");

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      fileUrl: form.fileUrl.trim(),
    };

    try {
      setSubmitting(true);

      await api.post("/downloads", payload);

      navigate("/admin/downloads", {
        replace: true,
        state: {
          successMessage: "Resource added successfully.",
        },
      });
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          to="/admin/downloads"
          className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
        >
          <span aria-hidden="true">←</span>
          Back to downloads
        </Link>

        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Add a resource
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          Add a resource that visitors can access from the UDA website.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
      >
        <div className="space-y-6 p-5 sm:p-8">
          {submitError && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
            >
              {submitError}
            </div>
          )}

          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              Resource title <span className="text-red-600">*</span>
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              maxLength={MAX_TITLE_LENGTH}
              value={form.title}
              onChange={handleChange}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "title-error" : "title-help"}
              placeholder="e.g. Party constitution"
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                errors.title
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-700 focus:ring-blue-100"
              }`}
            />

            {errors.title ? (
              <p id="title-error" className="mt-2 text-sm text-red-600">
                {errors.title}
              </p>
            ) : (
              <p id="title-help" className="mt-2 text-xs text-gray-500">
                Use a clear title that tells visitors what the resource contains.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={4}
              maxLength={MAX_DESCRIPTION_LENGTH}
              value={form.description}
              onChange={handleChange}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={
                errors.description ? "description-error" : undefined
              }
              placeholder="Briefly explain what this resource is about."
              className={`w-full resize-y rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                errors.description
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-700 focus:ring-blue-100"
              }`}
            />

            {errors.description && (
              <p
                id="description-error"
                className="mt-2 text-sm text-red-600"
              >
                {errors.description}
              </p>
            )}

            <p className="mt-2 text-right text-xs text-gray-500">
              {form.description.length}/{MAX_DESCRIPTION_LENGTH}
            </p>
          </div>

          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              Category <span className="text-red-600">*</span>
            </label>

            <input
              id="category"
              name="category"
              type="text"
              required
              maxLength={MAX_CATEGORY_LENGTH}
              value={form.category}
              onChange={handleChange}
              aria-invalid={Boolean(errors.category)}
              aria-describedby={errors.category ? "category-error" : undefined}
              placeholder="e.g. Policies, Publications, Forms"
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                errors.category
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-700 focus:ring-blue-100"
              }`}
            />

            {errors.category && (
              <p id="category-error" className="mt-2 text-sm text-red-600">
                {errors.category}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="fileUrl"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              Resource URL <span className="text-red-600">*</span>
            </label>

            <input
              id="fileUrl"
              name="fileUrl"
              type="url"
              required
              maxLength={MAX_URL_LENGTH}
              value={form.fileUrl}
              onChange={handleChange}
              aria-invalid={Boolean(errors.fileUrl)}
              aria-describedby={
                errors.fileUrl ? "fileUrl-error" : "fileUrl-help"
              }
              placeholder="https://example.com/resource.pdf"
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                errors.fileUrl
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-700 focus:ring-blue-100"
              }`}
            />

            {errors.fileUrl ? (
              <p id="fileUrl-error" className="mt-2 text-sm text-red-600">
                {errors.fileUrl}
              </p>
            ) : (
              <p id="fileUrl-help" className="mt-2 text-xs leading-5 text-gray-500">
                Enter a publicly accessible HTTP or HTTPS link to the document.
                This form stores a link; it does not upload a file from your computer.
              </p>
            )}

            {form.fileUrl.trim() && validateUrl(form.fileUrl.trim()) && (
              <a
                href={form.fileUrl.trim()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-sm font-semibold text-blue-800 underline underline-offset-4 hover:text-blue-950"
              >
                Preview resource link
              </a>
            )}
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">
              Before publishing
            </p>
            <p className="mt-1 text-sm leading-6 text-amber-800">
              Make sure the link points to the intended resource and that
              visitors have permission to access it. Only publish material
              approved for public distribution.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-8">
          <Link
            to="/admin/downloads"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-lg bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Saving resource..." : "Save resource"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default UploadDownload;
