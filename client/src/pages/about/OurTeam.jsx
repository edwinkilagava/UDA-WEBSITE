
import { Link } from "react-router-dom";

import heroImage from "../../assets/hero.jpg";
import rutoImage from "../../assets/osero.jpg";
import kindikiImage from "../../assets/kindiki.jpg";
import sakagaImage from "../../assets/sakaja.jpg";
import railaImage from "../../assets/raila.jpg";

const teamMembers = [
  {
    name: "William Samoei Ruto",
    position: "President of Kenya",
    category: "National Leadership",
    image: heroImage,
  },
  {
    name: "Kithure Kindiki",
    position: "Deputy President of Kenya",
    category: "National Leadership",
    image: kindikiImage,
  },
  {
    name: "Raila Odinga",
    position: "Historical Leadership Profile",
    category: "Leadership",
    image: railaImage,
  },
  {
    name: "Edwin Kilagava",
    position: "Secretary General",
    category: "Party Leadership",
    image: rutoImage,
  },
  {
    name: "Johnson Sakaga",
    position: "Secretary",
    category: "Party Leadership",
    image: sakagaImage,
  },
  {
    name: "Leadership Member Six",
    position: "Position to be confirmed",
    category: "Party Leadership",
    image: heroImage,
  },
  {
    name: "Leadership Member Seven",
    position: "Position to be confirmed",
    category: "Party Leadership",
    image: heroImage,
  },
];

function OurTeam() {
  return (
    <main className="overflow-hidden bg-white text-gray-800">
      {/* Hero section */}
      <section className="relative flex min-h-[420px] items-center bg-green-950 sm:min-h-[500px]">
        <img
          src={heroImage}
          alt="Leadership and community"
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

            <span className="text-yellow-400">Our Team</span>
          </nav>

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-400">
            Leadership &amp; Service
          </p>

          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-7xl">
            MEET OUR
            <span className="block text-yellow-400">TEAM</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
            Meet the people featured in our leadership directory
            and learn about the roles they serve.
          </p>

          <a
            href="#leadership"
            className="mt-8 inline-flex rounded-md bg-yellow-400 px-7 py-4 font-bold text-green-950 transition hover:bg-yellow-300"
          >
            Meet the Team
            <span className="ml-3" aria-hidden="true">
              ↓
            </span>
          </a>
        </div>

        <div className="absolute bottom-0 left-0 h-2 w-full bg-yellow-400" />
      </section>

      {/* Introduction */}
      <section className="px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-600">
            Our Leadership
          </p>

          <h2 className="mt-4 text-3xl font-extrabold text-green-950 sm:text-4xl">
            People and purpose
          </h2>

          <p className="mt-5 leading-8 text-gray-600">
            Explore the leadership profiles and responsibilities
            represented in this directory.
          </p>
        </div>
      </section>

      {/* Team cards */}
      <section
        id="leadership"
        className="scroll-mt-20 bg-gray-50 px-6 py-16 sm:px-10 lg:px-12 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-600">
              The People
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-green-950 sm:text-4xl">
              Meet our leadership
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-gray-600">
              Browse the leadership profiles below.
            </p>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {teamMembers.map((member) => (
              <article
                key={member.name}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-yellow-400 hover:shadow-xl"
              >
                {/* Member image */}
                <div className="relative overflow-hidden bg-green-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-green-950/70 via-transparent to-transparent" />

                  <span className="absolute bottom-4 left-4 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-green-950">
                    {member.category}
                  </span>
                </div>

                <div className="p-6">
                  <div className="mb-3 h-1 w-12 rounded-full bg-yellow-400 transition-all group-hover:w-20" />

                  <h3 className="text-xl font-extrabold leading-snug text-green-950">
                    {member.name}
                  </h3>

                  <p className="mt-2 text-sm font-semibold leading-6 text-gray-600">
                    {member.position}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Closing section */}
      <section className="px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-5xl rounded-2xl bg-green-950 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-400">
            Learn More
          </p>

          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
            Discover what guides our team
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-white/75">
            Learn about our history, principles, and aspirations.
          </p>

          <Link
            to="/about/history-and-values"
            className="mt-8 inline-flex rounded-md bg-yellow-400 px-7 py-4 font-bold text-green-950 transition hover:bg-yellow-300"
          >
            Explore Our Values
            <span className="ml-3" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default OurTeam;
