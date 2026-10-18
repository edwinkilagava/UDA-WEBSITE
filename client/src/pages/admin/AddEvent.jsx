
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createEvents } from "../../services/event.service.js";

const INITIAL_FORM = {
  title: "",
  excerpt: "",
  content: "",
  date: "",
  time: "",
  location: "",
  image: "",
  status: "draft",
};

const FIELD_LIMITS = {
  title: 200,
  excerpt: 500,
  content: 10000,
  location: 200,
  time: 50,
  image: 2048,
};

const inputClassName =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-slate-100";

function validateForm(form) {
  const errors = {};

  if (form.title.trim().length < 5) {
    errors.title = "The title must contain at least 5 characters.";
  } else if (form.title.trim().length > FIELD_LIMITS.title) {
    errors.title = "The title cannot exceed 200 characters.";
  }

  if (form.excerpt.trim().length < 10) {
    errors.excerpt = "The excerpt must contain at least 10 characters.";
  } else if (form.excerpt.trim().length > FIELD_LIMITS.excerpt) {
    errors.excerpt = "The excerpt cannot exceed 500 characters.";
  }

  if (form.content.trim().length < 20) {
    errors.content = "The content must contain at least 20 characters.";
  }

  if (!form.image.trim()) {
    errors.image = "An event image URL is required.";
  } else {
    try {
      const url = new URL(form.image.trim());

      if (!["http:", "https:"].includes(url.protocol)) {
        errors.image = "Use a valid HTTP or HTTPS image URL.";
      }
    } catch {
      errors.image = "Enter a valid image URL.";
    }
  }

  if (form.status === "published" && !form.date) {
    errors.date = "Select a publication date for this event.";
  }

  if (
    form.date &&
    Number.isNaN(new Date(`${form.date}T00:00:00`).getTime())
  ) {
    errors.date = "Enter a valid date.";
  }

  if (!["draft", "published"].includes(form.status)) {
    errors.status = "Choose draft or published.";
  }

  return errors;
}

function FormField({ id, label, error, required, hint, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </label>

      {children}

      {hint && !error && (
        <p className="mt-1.5 text-xs leading-5 text-slate-500">{hint}</p>
      )}

      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function AddEvent() {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [imagePreviewError, setImagePreviewError] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => {
      const updated = { ...current };
      delete updated[name];
      return updated;
    });

    setSubmitError("");

    if (name === "image") {
      setImagePreviewError(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) return;

    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    setSubmitError("");

    if (Object.keys(validationErrors).length > 0) {
      document.getElementById(Object.keys(validationErrors)[0])?.focus();
      return;
    }

    const payload = {
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      image: form.image.trim(),
      status: form.status,
    };

    if (form.status === "published") {
      payload.publishedAt = form.date
        ? new Date(`${form.date}T00:00:00`).toISOString()
        : new Date().toISOString();
    } else {
      payload.publishedAt = null;
    }

    // These fields must also exist in your Events.js schema
    // if you want MongoDB to save them.
    if (form.date) payload.date = form.date;
    if (form.time.trim()) payload.time = form.time.trim();
    if (form.location.trim()) payload.location = form.location.trim();

    setSubmitting(true);

    try {
      await createEvents(payload);

      navigate("/admin/events", {
        replace: true,
        state: {
          successMessage: "Event created successfully.",
        },
      });
    } catch (error) {
      console.error("Create event failed:", error.response?.data || error);

      setSubmitError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Unable to create the event. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm">
          <ol className="flex flex-wrap items-center gap-2 text-slate-500">
            <li>
              <Link to="/admin" className="hover:text-green-700">
                Dashboard
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/admin/events" className="hover:text-green-700">
                Events
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-semibold text-slate-900">
              Add Event
            </li>
          </ol>
        </nav>

        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
            Content Management
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Create an Event
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Add the event details below. Required fields are marked with an
            asterisk.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="space-y-7 p-5 sm:p-8">
            {submitError && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
              >
                <p className="font-semibold">Event could not be created</p>
                <p className="mt-1">{submitError}</p>
              </div>
            )}

            <section>
              <h2 className="border-b border-slate-200 pb-3 text-lg font-bold text-slate-900">
                Event Details
              </h2>

              <div className="mt-5 space-y-5">
                <FormField
                  id="title"
                  label="Event title"
                  required
                  error={errors.title}
                >
                  <input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    maxLength={FIELD_LIMITS.title}
                    disabled={submitting}
                    placeholder="e.g. UDA County Leaders Meeting"
                    className={inputClassName}
                  />
                </FormField>

                <FormField
                  id="excerpt"
                  label="Short excerpt"
                  required
                  error={errors.excerpt}
                  hint="A short summary displayed on the events listing page."
                >
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    value={form.excerpt}
                    onChange={handleChange}
                    maxLength={FIELD_LIMITS.excerpt}
                    rows={3}
                    disabled={submitting}
                    placeholder="Write a short summary of the event..."
                    className={inputClassName}
                  />
                </FormField>

                <FormField
                  id="content"
                  label="Full event description"
                  required
                  error={errors.content}
                  hint="Provide the complete details of the event."
                >
                  <textarea
                    id="content"
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    maxLength={FIELD_LIMITS.content}
                    rows={6}
                    disabled={submitting}
                    placeholder="Describe the purpose, activities, and details..."
                    className={inputClassName}
                  />
                </FormField>
              </div>
            </section>

            <section>
              <h2 className="border-b border-slate-200 pb-3 text-lg font-bold text-slate-900">
                Date and Location
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                  id="date"
                  label="Event date"
                  error={errors.date}
                  hint="Required when publishing."
                >
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    disabled={submitting}
                    className={inputClassName}
                  />
                </FormField>

                <FormField id="time" label="Event time" error={errors.time}>
                  <input
                    id="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    maxLength={FIELD_LIMITS.time}
                    disabled={submitting}
                    placeholder="e.g. 10:00 AM EAT"
                    className={inputClassName}
                  />
                </FormField>

                <div className="sm:col-span-2">
                  <FormField
                    id="location"
                    label="Event location"
                    error={errors.location}
                  >
                    <input
                      id="location"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      maxLength={FIELD_LIMITS.location}
                      disabled={submitting}
                      placeholder="e.g. UDA Headquarters, Nairobi"
                      className={inputClassName}
                    />
                  </FormField>
                </div>
              </div>
            </section>

            <section>
              <h2 className="border-b border-slate-200 pb-3 text-lg font-bold text-slate-900">
                Event Image
              </h2>

              <div className="mt-5">
                <FormField
                  id="image"
                  label="Image URL"
                  required
                  error={errors.image}
                  hint="Enter a direct HTTP or HTTPS image URL."
                >
                  <input
                    id="image"
                    name="image"
                    type="url"
                    value={form.image}
                    onChange={handleChange}
                    maxLength={FIELD_LIMITS.image}
                    disabled={submitting}
                    placeholder="https://example.com/event-image.jpg"
                    className={inputClassName}
                  />
                </FormField>

                {form.image.trim() && !errors.image && (
                  <div className="mt-4">
                    {imagePreviewError ? (
                      <p className="text-sm text-amber-700">
                        The image preview could not be loaded. Check the URL.
                      </p>
                    ) : (
                      <img
                        src={form.image.trim()}
                        alt="Event preview"
                        referrerPolicy="no-referrer"
                        onError={() => setImagePreviewError(true)}
                        onLoad={() => setImagePreviewError(false)}
                        className="max-h-64 w-full rounded-xl border border-slate-200 object-cover"
                      />
                    )}
                  </div>
                )}
              </div>
            </section>

            <section>
              <h2 className="border-b border-slate-200 pb-3 text-lg font-bold text-slate-900">
                Publication
              </h2>

              <div className="mt-5">
                <FormField
                  id="status"
                  label="Event status"
                  required
                  error={errors.status}
                  hint="Draft events are not visible to the public."
                >
                  <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    disabled={submitting}
                    className={inputClassName}
                  >
                    <option value="draft">Save as draft</option>
                    <option value="published">Publish event</option>
                  </select>
                </FormField>
              </div>
            </section>
          </div>

          <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p className="text-xs text-slate-500">* Required fields</p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/admin/events"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Creating Event..." : "Create Event"}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </section>
  );
}

export default AddEvent;
