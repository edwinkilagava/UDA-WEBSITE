
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroImage from "../../assets/hero.jpg";
import MembershipModal from "../Membership/MembershipModal";

function Hero() {
  const [isMembershipOpen, setIsMembershipOpen] = useState(false);

  const [memberCount, setMemberCount] = useState(null);
  const [isLoadingCount, setIsLoadingCount] = useState(true);
  const [countError, setCountError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchMemberCount = async () => {
      try {
        setIsLoadingCount(true);
        setCountError(false);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/members/count`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch registered member count.");
        }

        const result = await response.json();

        if (
          !result.success ||
          !Number.isSafeInteger(result.count) ||
          result.count < 0
        ) {
          throw new Error("Invalid member count response.");
        }

        setMemberCount(result.count);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error("Failed to load registered member count:", error);
        setCountError(true);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingCount(false);
        }
      }
    };

    fetchMemberCount();

    return () => controller.abort();
  }, []);

  return (
    <>
      <section
        className="relative isolate flex min-h-[calc(100vh-80px)] items-center overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />

        <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-10 lg:px-12">
          <div className="max-w-3xl text-white">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-1 w-12 rounded-full bg-yellow-400" />

              <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
                United Democratic Alliance
              </p>
            </div>

            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-8xl">
              Kazi ni Kazi
              <span className="mt-3 block text-yellow-400">
                Every Hustle Matters.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/85 sm:text-lg lg:text-xl">
              Together, we can build opportunities, empower communities,
              and create a better future for every Kenyan.
            </p>

            {/* Registered member counter */}
            <div
              className="mt-8 inline-flex items-center gap-4 rounded-lg border border-white/20 bg-black/30 px-5 py-4 backdrop-blur-sm"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-yellow-400/15 text-yellow-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="10" cy="7" r="4" />
                  <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>

              <div>
                <p className="text-2xl font-extrabold text-white sm:text-3xl">
                  {isLoadingCount
                    ? "Loading..."
                    : countError
                      ? "Unavailable"
                      : memberCount.toLocaleString("en-KE")}
                </p>

                <p className="mt-1 text-sm font-medium text-white/75">
                  Registered Members
                </p>

                {countError && (
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-2 text-sm font-semibold text-yellow-400 underline underline-offset-4 hover:text-yellow-300"
                  >
                    Reload to try again
                  </button>
                )}
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => setIsMembershipOpen(true)}
                className="inline-flex min-h-14 items-center justify-center rounded-md bg-yellow-400 px-8 py-4 text-center font-bold text-gray-950 shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-black"
              >
                Register as Our Member
                <span className="ml-3 text-xl" aria-hidden="true">
                  →
                </span>
              </button>

              <Link
                to="/donate"
                className="inline-flex min-h-14 items-center justify-center rounded-md border border-white/80 bg-white/5 px-8 py-4 text-center font-bold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-yellow-400 hover:bg-yellow-400 hover:text-gray-950 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
              >
                Donate
              </Link>
            </div>

            <div className="mt-14 flex items-center gap-4 text-sm text-white/70">
              <span className="h-px w-12 bg-yellow-400" />
              <span>Working together for a better Kenya</span>
            </div>
          </div>
        </div>
      </section>

      {isMembershipOpen && (
        <MembershipModal
          onClose={() => setIsMembershipOpen(false)}
        />
      )}
    </>
  );
}

export default Hero;
