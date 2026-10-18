
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getEventsById,
  updateEvents,
} from "../../services/event.service.js";

const INITIAL_FORM = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  image: "",
};

function extractEvent(response) {
  if (!response || typeof response !== "object") {
    return null;
  }

  if (response.event && typeof response.event === "object") {
    return response.event;
  }

  if (
    response.data?.event &&
    typeof response.data.event === "object"
  ) {
    return response.data.event;
  }

  if (
    response.data &&
    typeof response.data === "object" &&
    (response.data._id || response.data.id)
  ) {
    return response.data;
  }

  if (response._id || response.id) {
    return response;
  }

  return null;
}

function formatDateForInput(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const loadEvent = useCallback(async () => {
    if (!id) {
      setPageError("The event ID is missing from the URL.");
      setLoadingEvent(false);
      return;
    }

    setLoadingEvent(true);
    setPageError("");

    try {
      const response = await getEventsById(id);
      const event = extractEvent(response);

      if (!event) {
        setPageError(
          "The event could not be found or the server returned an unexpected response."
        );
        return;
      }

      setForm({
        title: event.title || "",
        description: event.description || "",
        date: formatDateForInput(event.date),
        time: event.time || "",
        location: event.location || "",
        image: event.image || "",
      });
    } catch (error) {
      setPageError(getErrorMessage(error));
    } finally {
      setLoadingEvent(false);
    }
  }, [id]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

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

    setSubmitError("");
  }

  function validateForm() {
    const errors = {};

    const title = form.title.trim();
    const description = form.description.trim();
    const location = form.location.trim();
    const time = form.time.trim();
    const image = form.image.trim();

    if (!title) {
      errors.title = "Event title is required.";
    } else if (title.length > 150) {
      errors.title = "Title cannot exceed 150 characters.";
    }

    if (!description) {
      errors.description = "Event description is required.";
    } else if (description.length > 5000) {
      errors.description =
        "Description cannot exceed 5,000 characters.";
    }

    if (!form.date) {
      errors.date = "Event date is required.";
    } else {
      const selectedDate = new Date(`${form.date}T00:00:00`);

      if (Number.isNaN(selectedDate.getTime())) {
        errors.date = "Enter a valid event date.";
      }
    }

    if (!location) {
      errors.location = "Event location is required.";
    } else if (location.length > 200) {
      errors.location =
        "Location cannot exceed 200 characters.";
    }

    if (time.length > 50) {
      errors.time = "Time cannot exceed 50 characters.";
    }

    if (image) {
      if (image.length > 2048) {
        errors.image = "Image URL is too long.";
      } else {
        try {
          const parsedUrl = new URL(image);

          if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            errors.image = "Image URL must use HTTP or HTTPS.";
          }
        } catch {
          errors.image = "Enter a valid image URL.";
        }
      }
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving || !validateForm()) {
      return;
    }

    setSaving(true);
    setSubmitError("");

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      date: form.date,
      location: form.location.trim(),
    };

    if (form.time.trim()) {
      payload.time = form.time.trim();
    }

    if (form.image.trim()) {
      payload.image = form.image.trim();
    }

    try {
      await updateEvents(id, payload);

      navigate("/admin/events", {
        replace: true,
        state: {
          successMessage: "Event updated successfully.",
        },
      });
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-700 focus:ring-2 focus:ring-green-700/20";

  const labelClass =
    "mb-2 block text-sm font-semibold text-gray-800";

  if (loadingEvent) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-gray-600">
            Loading event details...
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
            Unable to load event
          </h1>

          <p className="mt-3 text-sm text-red-700">
            {pageError}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadEvent}
              className="rounded-lg bg-green-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-900"
            >
              Try again
            </button>

            <Link
              to="/admin/events"
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Back to events
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
          to="/admin/events"
          className="text-sm font-semibold text-green-800 hover:text-green-950"
        >
          &larr; Back to events
        </Link>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Edit Event
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          Update the event information below. Changes will be saved
          to the website when you submit the form.
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
          <label htmlFor="title" className={labelClass}>
            Event title <span className="text-red-600">*</span>
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            maxLength={150}
            required
            aria-invalid={Boolean(fieldErrors.title)}
            aria-describedby={
              fieldErrors.title ? "title-error" : undefined
            }
            placeholder="Enter the event title"
            className={inputClass}
          />

          {fieldErrors.title && (
            <p id="title-error" className="mt-2 text-sm text-red-600">
              {fieldErrors.title}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>
            Description <span className="text-red-600">*</span>
          </label>

          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={6}
            maxLength={5000}
            required
            aria-invalid={Boolean(fieldErrors.description)}
            aria-describedby={
              fieldErrors.description
                ? "description-error"
                : undefined
            }
            placeholder="Describe the event, its purpose, and what attendees should know."
            className={`${inputClass} resize-y`}
          />

          <div className="mt-2 flex items-start justify-between gap-3">
            {fieldErrors.description ? (
              <p
                id="description-error"
                className="text-sm text-red-600"
              >
                {fieldErrors.description}
              </p>
            ) : (
              <span className="text-xs text-gray-500">
                Provide clear and accurate event information.
              </span>
            )}

            <span className="shrink-0 text-xs text-gray-500">
              {form.description.length}/5000
            </span>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="date" className={labelClass}>
              Event date <span className="text-red-600">*</span>
            </label>

            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
              aria-invalid={Boolean(fieldErrors.date)}
              aria-describedby={
                fieldErrors.date ? "date-error" : undefined
              }
              className={inputClass}
            />

            {fieldErrors.date && (
              <p id="date-error" className="mt-2 text-sm text-red-600">
                {fieldErrors.date}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="time" className={labelClass}>
              Event time
            </label>

            <input
              id="time"
              name="time"
              type="text"
              value={form.time}
              onChange={handleChange}
              maxLength={50}
              placeholder="e.g. 9:00 AM"
              aria-invalid={Boolean(fieldErrors.time)}
              aria-describedby={
                fieldErrors.time ? "time-error" : undefined
              }
              className={inputClass}
            />

            {fieldErrors.time && (
              <p id="time-error" className="mt-2 text-sm text-red-600">
                {fieldErrors.time}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="location" className={labelClass}>
            Location <span className="text-red-600">*</span>
          </label>

          <input
            id="location"
            name="location"
            type="text"
            value={form.location}
            onChange={handleChange}
            maxLength={200}
            required
            aria-invalid={Boolean(fieldErrors.location)}
            aria-describedby={
              fieldErrors.location ? "location-error" : undefined
            }
            placeholder="Enter the venue or location"
            className={inputClass}
          />

          {fieldErrors.location && (
            <p
              id="location-error"
              className="mt-2 text-sm text-red-600"
            >
              {fieldErrors.location}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="image" className={labelClass}>
            Event image URL
          </label>

          <input
            id="image"
            name="image"
            type="url"
            value={form.image}
            onChange={handleChange}
            maxLength={2048}
            aria-invalid={Boolean(fieldErrors.image)}
            aria-describedby={
              fieldErrors.image ? "image-error" : "image-help"
            }
            placeholder="https://example.com/event-image.jpg"
            className={inputClass}
          />

          {fieldErrors.image ? (
            <p id="image-error" className="mt-2 text-sm text-red-600">
              {fieldErrors.image}
            </p>
          ) : (
            <p id="image-help" className="mt-2 text-xs text-gray-500">
              Enter a publicly accessible image URL. This field does not
              upload files.
            </p>
          )}

          {form.image.trim() &&
            !fieldErrors.image &&
            /^https?:\/\//i.test(form.image.trim()) && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-gray-700">
                  Image preview
                </p>

                <img
                  src={form.image.trim()}
                  alt="Event preview"
                  className="max-h-64 w-full rounded-lg border border-gray-200 object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                  onLoad={(event) => {
                    event.currentTarget.style.display = "block";
                  }}
                />
              </div>
            )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
          <Link
            to="/admin/events"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center rounded-lg bg-green-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default EditEvent;
