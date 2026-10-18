
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  deleteEvents,
  getEvents,
} from "../../services/event.service.js";

function extractEvents(response) {
  // Support the common response shapes used by the existing API.
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.events)) return response.events;
  if (Array.isArray(response?.data?.events)) return response.data.events;

  return [];
}

function getEventId(event) {
  return event?._id || event?.id || "";
}

function formatDate(value) {
  if (!value) return "Date not set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Invalid date";

  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

function ManageEvents() {
  const location = useLocation();

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(
    location.state?.successMessage || ""
  );
  const [deletingId, setDeletingId] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getEvents();
      setEvents(extractEvents(response));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return events;

    return events.filter((event) => {
      const title = String(event?.title || "").toLowerCase();
      const location = String(event?.location || "").toLowerCase();
      const description = String(event?.description || "").toLowerCase();

      return (
        title.includes(query) ||
        location.includes(query) ||
        description.includes(query)
      );
    });
  }, [events, search]);

  async function handleDelete(event) {
    const id = getEventId(event);

    if (!id) {
      setDeleteError("This event does not have a valid ID.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${event.title || "this event"}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(id);
    setDeleteError("");
    setSuccess("");

    try {
      await deleteEvents(id);

      setEvents((currentEvents) =>
        currentEvents.filter((item) => getEventId(item) !== id)
      );

      setSuccess("Event deleted successfully.");
    } catch (requestError) {
      setDeleteError(getErrorMessage(requestError));
    } finally {
      setDeletingId("");
    }
  }

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
              UDA Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Manage Events
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              View and manage events published on the website.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
            >
              Back to Dashboard
            </Link>

            <Link
              to="/admin/events/add"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
            >
              + Add Event
            </Link>
          </div>
        </div>

        {/* Notifications */}
        {success && (
          <div
            role="status"
            className="mt-6 flex items-start justify-between gap-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"
          >
            <span>{success}</span>
            <button
              type="button"
              onClick={() => setSuccess("")}
              aria-label="Dismiss success message"
              className="font-bold hover:text-green-950"
            >
              ×
            </button>
          </div>
        )}

        {(error || deleteError) && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            {deleteError || error}
          </div>
        )}

        {/* Table container */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-slate-900">All Events</h2>
              <p className="mt-1 text-sm text-slate-500">
                {loading
                  ? "Loading event records..."
                  : `${filteredEvents.length} event${filteredEvents.length === 1 ? "" : "s"} found`}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="event-search">
                Search events
              </label>

              <input
                id="event-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search events..."
                className="min-h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 sm:w-64"
              />

              <button
                type="button"
                onClick={loadEvents}
                disabled={loading}
                className="min-h-11 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-48 items-center justify-center gap-3 p-8 text-sm text-slate-600">
              <span
                aria-hidden="true"
                className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-green-700"
              />
              Loading events...
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="font-semibold text-slate-900">
                Events could not be loaded.
              </p>
              <p className="mt-2 text-sm text-slate-600">{error}</p>
              <button
                type="button"
                onClick={loadEvents}
                className="mt-4 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
              >
                Try Again
              </button>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="p-10 text-center">
              <div className="text-4xl" aria-hidden="true">
                📅
              </div>

              <h3 className="mt-3 font-bold text-slate-900">
                {events.length === 0
                  ? "No events available"
                  : "No matching events"}
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                {events.length === 0
                  ? "Create an event to get started."
                  : "Try another search term."}
              </p>

              {events.length === 0 && (
                <Link
                  to="/admin/events/add"
                  className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
                >
                  Create First Event
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-semibold">
                      Event
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredEvents.map((event, index) => {
                    const id = getEventId(event);

                    return (
                      <tr
                        key={id || `event-${index}`}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            {event.image ? (
                              <img
                                src={event.image}
                                alt=""
                                loading="lazy"
                                referrerPolicy="no-referrer"
                                className="h-12 w-16 rounded-lg border border-slate-200 object-cover"
                              />
                            ) : (
                              <div
                                aria-hidden="true"
                                className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-green-50 text-xl"
                              >
                                📅
                              </div>
                            )}

                            <div className="max-w-sm">
                              <p className="font-semibold text-slate-900">
                                {event.title || "Untitled event"}
                              </p>

                              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                {event.description || "No description provided"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-6 py-5 text-slate-600">
                          {formatDate(event.date)}
                          {event.time && (
                            <p className="mt-1 text-xs text-slate-500">
                              {event.time}
                            </p>
                          )}
                        </td>

                        <td className="px-6 py-5 text-slate-600">
                          {event.location || "Not specified"}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-2">
                            {id ? (
                              <Link
                                to={`/admin/events/edit/${encodeURIComponent(id)}`}
                                className="inline-flex min-h-9 items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-green-600"
                              >
                                Edit
                              </Link>
                            ) : (
                              <span className="text-xs text-slate-400">
                                No ID
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDelete(event)}
                              disabled={!id || deletingId === id}
                              className="inline-flex min-h-9 items-center justify-center rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingId === id ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs leading-5 text-slate-500">
          Changes made here are sent to the server. Deletion is permanent if
          the backend does not support recovery.
        </p>
      </div>
    </section>
  );
}

export default ManageEvents;
