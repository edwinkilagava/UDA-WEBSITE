
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createResource } from "../../services/resource.service.js";

const INITIAL_FORM = {
  title: "",
  description: "",
  category: "",
  status: "draft",
};

const CATEGORIES = [
  "Party Documents",
  "Policies",
  "Reports",
  "Constitution",
  "Election Materials",
  "Membership",
  "Other",
];

// 50 MiB (50 × 1024 × 1024 bytes).
const MAX_FILE_SIZE = 50 * 1024 * 1024;

const ACCEPTED_EXTENSIONS = ["pdf", "docx"];

function validateFile(file) {
  if (!file) {
    return "Please select a document to upload.";
  }

  const extension = file.name.split(".").pop()?.toLowerCase();

  if (!ACCEPTED_EXTENSIONS.includes(extension)) {
    return "Only PDF and DOCX files are allowed.";
  }

  if (file.size === 0) {
    return "The selected file is empty.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "The document must not exceed 50 MiB (approximately 52.4 MB).";
  }

  return "";
}

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function UploadResource() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(INITIAL_FORM);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0] ?? null;

    setFile(selectedFile);
    setFileError("");
    setError("");
    setSuccess("");

    if (selectedFile) {
      const validationError = validateFile(selectedFile);

      if (validationError) {
        setFileError(validationError);
      }
    }
  }

  function removeFile() {
    setFile(null);
    setFileError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setError("");
    setSuccess("");
    setFileError("");

    const title = form.title.trim();
    const description = form.description.trim();
    const category = form.category.trim();

    if (!title) {
      setError("Please enter a document title.");
      return;
    }

    if (title.length > 150) {
      setError("The title must not exceed 150 characters.");
      return;
    }

    if (description.length > 2000) {
      setError("The description must not exceed 2,000 characters.");
      return;
    }

    if (!category) {
      setError("Please select a document category.");
      return;
    }

    // Read the actual input as a fallback if React state is empty.
    const selectedFile =
      file ?? fileInputRef.current?.files?.[0] ?? null;

    const validationError = validateFile(selectedFile);

    if (validationError) {
      setFileError(validationError);
      return;
    }

    setFile(selectedFile);
    setSubmitting(true);

    try {
      const response = await createResource({
        title,
        description,
        category,
        status: form.status,
        file: selectedFile,
      });

      setSuccess(
        response?.message ||
          "The resource was uploaded successfully."
      );

      setForm(INITIAL_FORM);
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      window.setTimeout(() => {
        navigate("/admin/resources");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Unable to upload the document. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Page heading */}
        <div className="mb-8">
          <Link
            to="/admin/resources"
            className="inline-flex items-center gap-2 text-sm font-medium text-green-800 transition hover:text-green-950"
          >
            <span aria-hidden="true">←</span>
            Back to Resources
          </Link>

          <div className="mt-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-green-800">
              Resource management
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Upload a document
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Upload official documents for visitors to access
              through the UDA website.
            </p>
          </div>
        </div>

        {/* Upload form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="space-y-7 p-5 sm:p-8">
            {/* General error */}
            {error && (
              <div
                role="alert"
                className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
              >
                <span aria-hidden="true">!</span>
                <p>{error}</p>
              </div>
            )}

            {/* Success message */}
            {success && (
              <div
                role="status"
                className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
              >
                {success}
              </div>
            )}

            {/* Document title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Document title <span className="text-red-600">*</span>
              </label>

              <input
                id="title"
                name="title"
                type="text"
                required
                maxLength={150}
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. UDA Party Constitution"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
              />

              <p className="mt-1.5 text-right text-xs text-slate-500">
                {form.title.length}/150 characters
              </p>
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Category <span className="text-red-600">*</span>
              </label>

              <select
                id="category"
                name="category"
                required
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
              >
                <option value="">Select a category</option>

                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={5}
                maxLength={2000}
                value={form.description}
                onChange={handleChange}
                placeholder="Explain what this document contains and who may find it useful..."
                className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
              />

              <p className="mt-1.5 text-right text-xs text-slate-500">
                {form.description.length}/2000 characters
              </p>
            </div>

            {/* Document upload */}
            <div>
              <label
                htmlFor="file"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Document file <span className="text-red-600">*</span>
              </label>

              <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 transition hover:border-green-600 sm:p-8">
                <input
                  ref={fileInputRef}
                  id="file"
                  name="file"
                  type="file"
                  required={!file}
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  aria-describedby="file-help"
                  aria-invalid={Boolean(fileError)}
                  className="block w-full cursor-pointer text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-green-800 file:px-4 file:py-2.5 file:font-semibold file:text-white hover:file:bg-green-900"
                />

                <p
                  id="file-help"
                  className="mt-3 text-xs leading-5 text-slate-500"
                >
                  Accepted formats: PDF and DOCX. Maximum file
                  size: 50 MiB (approximately 52.4 MB). Large PDFs
                  with hundreds of pages are supported when within
                  the file-size limit.
                </p>
              </div>

              {/* Selected file */}
              {file && (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-50 text-lg">
                      {file.name.toLowerCase().endsWith(".pdf")
                        ? "📕"
                        : "📄"}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {file.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={removeFile}
                    className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              )}

              {fileError && (
                <p
                  role="alert"
                  className="mt-2 text-sm text-red-700"
                >
                  {fileError}
                </p>
              )}
            </div>

            {/* Publication status */}
            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-slate-800">
                Publication status
              </legend>

              <div className="grid gap-3 sm:grid-cols-2">
                <label
                  className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
                    form.status === "draft"
                      ? "border-amber-400 bg-amber-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={form.status === "draft"}
                    onChange={handleChange}
                    className="mt-1 accent-amber-600"
                  />

                  <span>
                    <span className="block text-sm font-semibold text-slate-900">
                      Save as draft
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-slate-600">
                      Save the document without displaying it
                      on the public website.
                    </span>
                  </span>
                </label>

                <label
                  className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
                    form.status === "published"
                      ? "border-green-500 bg-green-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value="published"
                    checked={form.status === "published"}
                    onChange={handleChange}
                    className="mt-1 accent-green-700"
                  />

                  <span>
                    <span className="block text-sm font-semibold text-slate-900">
                      Publish now
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-slate-600">
                      Make the document available on the
                      public Resources page.
                    </span>
                  </span>
                </label>
              </div>
            </fieldset>
          </div>

          {/* Form actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <Link
              to="/admin/resources"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                  />
                  Uploading document...
                </>
              ) : (
                <>
                  <span aria-hidden="true">↑</span>
                  {form.status === "published"
                    ? "Upload and publish"
                    : "Upload as draft"}
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-4 text-xs leading-5 text-slate-500">
          Uploaded documents are stored using Cloudinary. Only
          published resources appear on the public Resources page.
        </p>
      </div>
    </main>
  );
}
