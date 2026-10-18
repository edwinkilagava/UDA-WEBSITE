
import { Link } from "react-router-dom";
import heroImage from "../../assets/hero.jpg";

const coreValues = [
  {
    number: "01",
    title: "Unity",
    description:
      "Bringing Kenyans together across communities and backgrounds to build a shared future.",
    symbol: "◎",
  },
  {
    number: "02",
    title: "Integrity",
    description:
      "Promoting honesty, accountability, transparency, and responsible leadership in public service.",
    symbol: "◇",
  },
  {
    number: "03",
    title: "Service",
    description:
      "Keeping the needs, dignity, and aspirations of citizens at the heart of public leadership.",
    symbol: "♡",
  },
  {
    number: "04",
    title: "Opportunity",
    description:
      "Supporting an environment where people can develop their talents and pursue their ambitions.",
    symbol: "↗",
  },
  {
    number: "05",
    title: "Economic Growth",
    description:
      "Encouraging enterprise, innovation, productive work, and opportunities for livelihoods.",
    symbol: "△",
  },
  {
    number: "06",
    title: "Accountability",
    description:
      "Encouraging leaders and institutions to act responsibly and remain answerable to citizens.",
    symbol: "✓",
  },
];

function SectionLabel({ children }) {
  return (
    <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-yellow-600">
      {children}
    </p>
  );
}

function HistoryAndValues() {
  return (
    <main className="overflow-hidden bg-white text-gray-800">
      {/* Hero */}
      <section className="relative flex min-h-[520px] items-center bg-gray-900 sm:min-h-[600px]">
        <img
          src={heroImage}
          alt="United Democratic Alliance and its journey in Kenya"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-green-950/95 via-green-950/75 to-black/30" />

        <div className="relative mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 lg:px-12">
          <div className="max-w-3xl">
            <nav
              aria-label="Breadcrumb"
              className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/75"
            >
              <Link to="/" className="transition hover:text-yellow-400">
                Home
              </Link>
              <span>/</span>
              <Link
                to="/about"
                className="transition hover:text-yellow-400"
              >
                About Us
              </Link>
              <span>/</span>
              <span className="text-yellow-400">
                History and Values
              </span>
            </nav>

            <p className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-yellow-400 sm:text-base">
              Our Story. Our Principles. Our Future.
            </p>

            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-7xl">
              OUR HISTORY
              <span className="block text-yellow-400">
                &amp; VALUES
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
              Discover the journey, principles, and aspirations that
              shape the United Democratic Alliance and its vision
              for Kenya.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#our-history"
                className="inline-flex items-center justify-center rounded-md bg-yellow-400 px-7 py-4 font-bold text-green-950 transition hover:bg-yellow-300"
              >
                Discover Our Story
                <span className="ml-3" aria-hidden="true">
                  ↓
                </span>
              </a>

              <a
                href="#our-values"
                className="inline-flex items-center justify-center rounded-md border border-white/60 px-7 py-4 font-bold text-white transition hover:border-yellow-400 hover:text-yellow-400"
              >
                Explore Our Values
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-2 w-full bg-yellow-400" />
      </section>

      {/* Introduction */}
      <section
        id="our-history"
        className="scroll-mt-20 px-6 py-20 sm:px-10 lg:px-12 lg:py-28"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionLabel>Who We Are</SectionLabel>

            <h2 className="text-3xl font-extrabold leading-tight text-green-950 sm:text-4xl lg:text-5xl">
              A journey shaped by purpose
            </h2>

            <div className="mt-6 h-1.5 w-20 rounded-full bg-yellow-400" />

            <p className="mt-7 text-base leading-8 text-gray-600">
              The United Democratic Alliance (UDA) is a political
              party in Kenya. Its story forms part of the country's
              continuing democratic journey and the participation of
              citizens in shaping their leadership and future.
            </p>

            <p className="mt-5 text-base leading-8 text-gray-600">
              Understanding a political party means understanding
              its origins, the ideas it advances, and the principles
              it seeks to uphold. This page introduces those themes
              and provides a foundation for learning more about UDA.
            </p>

            <Link
              to="/about"
              className="mt-8 inline-flex items-center font-bold text-green-900 transition hover:text-yellow-700"
            >
              Learn More About Us
              <span className="ml-2" aria-hidden="true">
                →
              </span>
            </Link>
          </div>

          <div className="relative">
            <div className="absolute -bottom-4 -left-4 h-28 w-28 rounded-bl-3xl border-b-8 border-l-8 border-yellow-400 sm:-bottom-6 sm:-left-6" />

            <img
              src={heroImage}
              alt="A visual representation of Kenya's democratic journey"
              loading="lazy"
              className="relative z-10 h-[340px] w-full rounded-lg object-cover shadow-xl sm:h-[440px]"
            />

            <div className="absolute -right-3 -top-3 z-20 h-20 w-20 rounded-tr-3xl bg-green-900 sm:-right-5 sm:-top-5 sm:h-28 sm:w-28" />
          </div>
        </div>
      </section>

      {/* History */}
      <section className="bg-gray-50 px-6 py-20 sm:px-10 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>Our History</SectionLabel>

            <h2 className="text-3xl font-extrabold text-green-950 sm:text-4xl">
              Understanding our journey
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              A meaningful history is built from real events,
              decisions, and milestones. Explore the story of the
              party through verified historical records and official
              information.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            <article className="rounded-xl border border-gray-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <span className="text-3xl font-extrabold text-yellow-600">
                01
              </span>
              <h3 className="mt-5 text-xl font-bold text-green-950">
                Origins
              </h3>
              <p className="mt-4 leading-7 text-gray-600">
                Learn about the formation of the party, its
                background, and the political circumstances
                surrounding its emergence.
              </p>
            </article>

            <article className="rounded-xl border border-gray-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <span className="text-3xl font-extrabold text-yellow-600">
                02
              </span>
              <h3 className="mt-5 text-xl font-bold text-green-950">
                Milestones
              </h3>
              <p className="mt-4 leading-7 text-gray-600">
                Explore important events, electoral milestones,
                and developments that have influenced the party's
                journey.
              </p>
            </article>

            <article className="rounded-xl border border-gray-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <span className="text-3xl font-extrabold text-yellow-600">
                03
              </span>
              <h3 className="mt-5 text-xl font-bold text-green-950">
                The Road Ahead
              </h3>
              <p className="mt-4 leading-7 text-gray-600">
                Discover the party's stated priorities and its
                aspirations for Kenya's democratic and economic
                future.
              </p>
            </article>
          </div>

          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-gray-500">
            Editorial note: Add verified dates, historical events,
            and official party records to these sections before
            publishing the page.
          </p>
        </div>
      </section>

      {/* Values */}
      <section
        id="our-values"
        className="scroll-mt-20 px-6 py-20 sm:px-10 lg:px-12 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>What Guides Us</SectionLabel>

            <h2 className="text-3xl font-extrabold text-green-950 sm:text-4xl lg:text-5xl">
              The principles that guide us
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              Values provide a framework for leadership, public
              service, and engagement with citizens. The themes
              below are proposed for this page and should be
              checked against UDA's official statements.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((value) => (
              <article
                key={value.number}
                className="group rounded-xl border border-gray-200 bg-white p-7 transition duration-300 hover:-translate-y-2 hover:border-yellow-400 hover:shadow-xl sm:p-8"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 text-3xl text-green-900 transition group-hover:bg-green-900 group-hover:text-yellow-400">
                    {value.symbol}
                  </span>

                  <span className="text-sm font-bold tracking-widest text-gray-300">
                    {value.number}
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-extrabold text-green-950">
                  {value.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-600">
                  {value.description}
                </p>

                <div className="mt-6 h-1 w-12 rounded-full bg-yellow-400 transition-all group-hover:w-20" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Vision and Mission */}
      <section className="bg-green-950 px-6 py-20 text-white sm:px-10 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
          <article className="rounded-xl border border-white/15 bg-white/5 p-8 sm:p-10">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-400">
              Looking Forward
            </span>

            <h2 className="mt-5 text-3xl font-extrabold">
              Our Vision
            </h2>

            <p className="mt-5 leading-8 text-white/75">
              Present the party's official vision here: the long-term
              future it seeks for Kenya and the aspirations it
              communicates to the public.
            </p>
          </article>

          <article className="rounded-xl border border-white/15 bg-white/5 p-8 sm:p-10">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-400">
              Putting Purpose into Action
            </span>

            <h2 className="mt-5 text-3xl font-extrabold">
              Our Mission
            </h2>

            <p className="mt-5 leading-8 text-white/75">
              Present the party's official mission here: the purpose,
              priorities, and actions through which it intends to
              advance its stated vision.
            </p>
          </article>
        </div>

        <p className="mx-auto mt-8 max-w-4xl text-center text-sm leading-6 text-white/50">
          Replace the vision and mission descriptions with the
          party's verified official wording before publication.
        </p>
      </section>

      {/* Call to action */}
      <section className="px-6 py-20 sm:px-10 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-5xl rounded-2xl bg-yellow-400 px-6 py-12 text-center sm:px-12 sm:py-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-950/70">
            The Journey Continues
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold leading-tight text-green-950 sm:text-4xl">
            Explore how citizens connect with the party
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-green-950/80">
            Learn more about the organization, discover upcoming
            events, or get in touch to find out more.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/about"
              className="rounded-md bg-green-950 px-7 py-4 font-bold text-white transition hover:bg-green-900"
            >
              About Us
            </Link>

            <Link
              to="/events"
              className="rounded-md border-2 border-green-950 px-7 py-4 font-bold text-green-950 transition hover:bg-green-950 hover:text-white"
            >
              Explore Events
            </Link>

            <Link
              to="/contact"
              className="rounded-md border-2 border-green-950/30 px-7 py-4 font-bold text-green-950 transition hover:border-green-950"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HistoryAndValues;
