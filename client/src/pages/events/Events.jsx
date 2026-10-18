import { useEffect, useState } from "react";
import EventCard from "../../components/Events/EventCard.jsx";
import { getEvents } from "../../services/event.service.js";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setError("");

        const response = await getEvents();

        // Support an array or an API response containing a data array.
        const eventList = Array.isArray(response)
          ? response
          : response?.data;

        // Do not mistake an unexpected API response for an empty list.
        if (!Array.isArray(eventList)) {
          throw new Error("Invalid events response from the server.");
        }

        setEvents(eventList);
      } catch (error) {
        console.error("Failed to load events:", error);

        setError(
          "We were unable to load the latest events. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  return (
    <main>
      {/* Events hero section */}
      <section className="bg-[#f7c821] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-bold uppercase tracking-wide text-green-800">
            UDA Events
          </p>

          <div className="mt-3 h-0.5 w-10 bg-green-800" />

          <h1 className="mt-4 text-4xl font-bold text-gray-900 sm:text-5xl">
            Latest Events
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-800">
            Stay informed about upcoming events, activities, and developments
            from the United Democratic Alliance.
          </p>
        </div>
      </section>

      {/* Events content section */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          {loading && (
            <div className="py-12 text-center" role="status">
              <p className="text-gray-600">Loading events...</p>
            </div>
          )}

          {!loading && error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-6 text-center"
            >
              <p className="font-medium text-red-700">{error}</p>
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <div className="py-12 text-center">
              <h2 className="text-xl font-semibold text-gray-900">
                No events available
              </h2>

              <p className="mt-2 text-gray-600">
                There are no events available at the moment.
                Please check back later.
              </p>
            </div>
          )}

          {!loading && !error && events.length > 0 && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {events.map((item) => (
                <EventCard
                  key={item._id ?? item.id}
                  event={item}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Events;