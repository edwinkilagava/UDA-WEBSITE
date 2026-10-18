
import { Link } from "react-router-dom";

function EventCard({ event }) {
  const {
    _id,
    id,
    title,
    excerpt,
    image,
    publishedAt,
  } = event;

  const eventId = _id || id;

  return (
    <article className="overflow-hidden rounded-lg bg-white shadow-sm">
      <img
        src={image || "/placeholder-event.jpg"}
        alt={title || "Event"}
        className="h-56 w-full object-cover"
      />

      <div className="p-6">
        <time
          dateTime={publishedAt || ""}
          className="text-sm font-medium text-green-700"
        >
          {publishedAt
            ? new Date(publishedAt).toLocaleDateString("en-KE", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Date to be announced"}
        </time>

        <h3 className="mt-2 text-xl font-bold text-gray-900">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          {excerpt}
        </p>

        {eventId && (
          <Link
            to={`/events/${eventId}`}
            className="mt-4 inline-block font-semibold text-green-700 hover:text-green-900"
          >
            Read More →
          </Link>
        )}
      </div>
    </article>
  );
}

export default EventCard;
