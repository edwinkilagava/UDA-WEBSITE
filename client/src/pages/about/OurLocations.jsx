
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import heroImage from "../../assets/hero.jpg";

const locations = [
  {
    name: "National Office",
    county: "Nairobi",
    town: "Nairobi",
    address: "Official address to be confirmed",
    phone: "",
    hours: "Confirm official office hours",
    type: "National Office",
    verified: false,
  },
  {
    name: "County Office",
    county: "Kirinyaga",
    town: "Kerugoya",
    address: "Official address to be confirmed",
    phone: "",
    hours: "Confirm official office hours",
    type: "County Office",
    verified: false,
  },
  {
    name: "County Office",
    county: "Mombasa",
    town: "Mombasa",
    address: "Official address to be confirmed",
    phone: "",
    hours: "Confirm official office hours",
    type: "County Office",
    verified: false,
  },
];

function OurLocations() {
  const [search, setSearch] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("All counties");

  const counties = useMemo(
    () => [
      "All counties",
      ...new Set(locations.map((location) => location.county)),
    ],
    []
  );

  const filteredLocations = locations.filter((location) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      location.name.toLowerCase().includes(query) ||
      location.town.toLowerCase().includes(query) ||
      location.county.toLowerCase().includes(query);

    const matchesCounty =
      selectedCounty === "All counties" ||
      location.county === selectedCounty;

    return matchesSearch && matchesCounty;
  });

  return (
    <main className="overflow-hidden bg-white text-gray-800">
      {/* Hero */}
      <section className="relative flex min-h-[420px] items-center bg-green-950 sm:min-h-[500px]">
        <img
          src={heroImage}
          alt="Kenya and its communities"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-green-950/95 via-green-950/80 to-black/40" />

        <div className="relative mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 lg:px-12">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/75"
          >
            <Link to="/" className="hover:text-yellow-400">
              Home
            </Link>
            <span>/</span>
            <Link to="/about" className="hover:text-yellow-400">
              About Us
            </Link>
            <span>/</span>
            <span className="text-yellow-400">Our Locations</span>
          </nav>

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-400">
            Connecting Communities
          </p>

          <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl lg:text-7xl">
            OUR <span className="text-yellow-400">LOCATIONS</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
            Find information about our offices and how to connect
            with the United Democratic Alliance across Kenya.
          </p>

          <a
            href="#find-office"
            className="mt-8 inline-flex rounded-md bg-yellow-400 px-7 py-4 font-bold text-green-950 transition hover:bg-yellow-300"
          >
            Find a Location
            <span className="ml-3" aria-hidden="true">↓</span>
          </a>
        </div>

        <div className="absolute bottom-0 left-0 h-2 w-full bg-yellow-400" />
      </section>

      {/* Introduction */}
      <section className="px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-600">
            Find Us
          </p>

          <h2 className="mt-4 text-3xl font-extrabold text-green-950 sm:text-4xl">
            Connecting with our communities
          </h2>

          <p className="mt-5 leading-8 text-gray-600">
            Use the directory below to explore office locations.
            Contact details and addresses will be published once
            they have been confirmed by the party.
          </p>
        </div>
      </section>

      {/* Search and location directory */}
      <section
        id="find-office"
        className="scroll-mt-20 bg-gray-50 px-6 py-16 sm:px-10 lg:px-12 lg:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-7">
            <div>
              <label
                htmlFor="location-search"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                Search by town or county
              </label>

              <div className="flex items-center gap-3 rounded-lg border border-gray-300 px-4 focus-within:border-green-800">
                <span aria-hidden="true" className="text-gray-400">⌕</span>
                <input
                  id="location-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="e.g. Nairobi or Kirinyaga"
                  className="w-full bg-transparent py-3 outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="county-filter"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                Filter by county
              </label>

              <select
                id="county-filter"
                value={selectedCounty}
                onChange={(event) => setSelectedCounty(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-800"
              >
                {counties.map((county) => (
                  <option key={county} value={county}>
                    {county}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-yellow-700">
                LOCATION DIRECTORY
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-green-950 sm:text-3xl">
                Explore our offices
              </h2>
            </div>

            <p className="text-sm text-gray-500">
              {filteredLocations.length}{" "}
              {filteredLocations.length === 1 ? "result" : "results"}
            </p>
          </div>

          <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredLocations.map((location, index) => (
              <article
                key={`${location.county}-${location.town}-${index}`}
                className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-yellow-400 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-2xl text-green-900">
                    ⌖
                  </span>

                  <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-800">
                    {location.type}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-extrabold text-green-950">
                  {location.name}
                </h3>

                <p className="mt-2 text-sm font-medium text-gray-500">
                  {location.town}, {location.county} County
                </p>

                <div className="mt-5 space-y-4 text-sm leading-6 text-gray-600">
                  <div className="flex items-start gap-3">
                    <span aria-hidden="true">⌖</span>
                    <p>{location.address}</p>
                  </div>

                  <div className="flex items-start gap-3">
                    <span aria-hidden="true">◷</span>
                    <p>{location.hours}</p>
                  </div>

                  {location.phone && (
                    <div className="flex items-start gap-3">
                      <span aria-hidden="true">☎</span>
                      <a
                        href={`tel:${location.phone}`}
                        className="hover:text-green-900"
                      >
                        {location.phone}
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-6">
                  {location.verified ? (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${location.address}, ${location.town}, Kenya`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex font-bold text-green-900 transition hover:text-yellow-700"
                    >
                      Get Directions
                      <span className="ml-2" aria-hidden="true">→</span>
                    </a>
                  ) : (
                    <p className="border-t border-gray-100 pt-4 text-xs leading-5 text-gray-500">
                      Office details awaiting confirmation.
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>

          {filteredLocations.length === 0 && (
            <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
              <h3 className="text-xl font-bold text-green-950">
                No matching locations
              </h3>
              <p className="mt-3 text-gray-600">
                Try another town or select a different county.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCounty("All counties");
                }}
                className="mt-5 rounded-md bg-green-950 px-5 py-3 font-bold text-white hover:bg-green-900"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Contact call to action */}
      <section className="px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-5xl rounded-2xl bg-green-950 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-400">
            Need Assistance?
          </p>

          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
            We would like to hear from you
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-white/75">
            Contact us for more information about office locations
            and ways to connect with the party.
          </p>

          <Link
            to="/contact"
            className="mt-8 inline-flex rounded-md bg-yellow-400 px-7 py-4 font-bold text-green-950 transition hover:bg-yellow-300"
          >
            Contact Us
            <span className="ml-3" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default OurLocations;
