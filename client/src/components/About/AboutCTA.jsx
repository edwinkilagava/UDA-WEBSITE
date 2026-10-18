
import { Link } from "react-router-dom";

function AboutCTA() {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-6 sm:flex-row">
        <Link
          to="/resources"
          className="inline-flex min-w-[180px] items-center justify-center rounded-md bg-green-700 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-green-800"
        >
          Our Manifesto
        </Link>

        <Link
          to="/contact"
          className="inline-flex min-w-[180px] items-center justify-center rounded-md border border-green-700 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-green-700 transition-colors hover:bg-green-700 hover:text-white"
        >
          Contact Us
        </Link>
      </div>
    </section>
  );
}

export default AboutCTA;

