
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getEventsById } from "../../services/event.service.js";

function EventDetails() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        setError("");

        const response = await getEventsById(id);

        // Support either a direct event object or a wrapped response.
        const eventData =
          response?.data?.event ??
          response?.event ??
          response?.data ??
          response;

        if (!eventData || typeof eventData !== "object") {
          throw new Error("Invalid event response.");
        }

        setEvent(eventData);
      } catch (err) {
        console.error("Failed to load event:", err);

        setError(
          "We could not load this event. It may have been removed or is temporarily unavailable."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadEvent();
    } else {
      setError("Event ID is missing.");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center px-6">
        <p className="text-gray-600" role="status">
          Loading event details...
        </p>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="mx-auto min-h-[50vh] max-w-3xl px-6 py-16">
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-6"
        >
          <h1 className="text-xl font-bold text-red-800">
            Event unavailable
          </h1>

          <p className="mt-2 text-red-700">
            {error || "The requested event could not be found."}
          </p>

          <Link
            to="/events"
            className="mt-5 inline-block font-semibold text-green-700 hover:text-green-900"
          >
            ← Back to Events
          </Link>
        </div>
      </main>
    );
  }

  const {
    title,
    excerpt,
    description,
    content,
    image,
    publishedAt,
    date,
    eventDate,
    location,
  } = event;

  const displayDate = eventDate || date || publishedAt;
  const fullDescription = description || content || excerpt;

  return (
    <main className="min-h-screen bg-white">
      {/* Event header */}
      <section className="bg-[#f7c821] py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-6">
          <Link
            to="/events"
            className="inline-block font-semibold text-green-800 hover:text-green-950"
          >
            ← Back to Events
          </Link>

          <p className="mt-6 text-sm font-bold uppercase tracking-wide text-green-800">
            UDA Events
          </p>

          <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-5xl">
            {title || "Event Details"}
          </h1>

          {displayDate && (
            <p className="mt-4 font-medium text-gray-800">
              {new Date(displayDate).toLocaleDateString("en-KE", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}

          {location && (
            <p className="mt-2 text-gray-800">
              <span className="font-semibold">Location:</span> {location}
            </p>
          )}
        </div>
      </section>

      {/* Full event content */}
      <section className="py-12 sm:py-16">
        <article className="mx-auto max-w-5xl px-6">
          {image && (
            <img
              src={image}
              alt={title || "Event"}
              className="max-h-[520px] w-full rounded-xl object-cover"
            />
          )}

          {fullDescription ? (
            <div className="mt-8 whitespace-pre-line text-base leading-8 text-gray-700">
              {fullDescription}
            </div>
          ) : (
            <p className="mt-8 text-gray-600">
              No additional description is available for this event.
            </p>
          )}

          <div className="mt-10 border-t border-gray-200 pt-6">
            <Link
              to="/events"
              className="inline-block font-semibold text-green-700 hover:text-green-900"
            >
              ← View All Events
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}

export default EventDetails;
