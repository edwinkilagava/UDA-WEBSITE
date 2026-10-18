import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroImage from "../../assets/hero.jpg";
import MembershipModal from "../Membership/MembershipModal";
import { getRegisteredMemberCount } from "../../services/membership.service.js";

function Hero() {
  const [isMembershipOpen, setIsMembershipOpen] = useState(false);
  const [memberCount, setMemberCount] = useState(null);
  const [isLoadingCount, setIsLoadingCount] = useState(true);
  const [countError, setCountError] = useState(false);

  /* ---------- Count-up animation value (presentation only) ---------- */
  const [animatedCount, setAnimatedCount] = useState(0);

  /* ---------- Data fetch (UNCHANGED) ---------- */
  useEffect(() => {
    let isMounted = true;

    const loadMemberCount = async () => {
      try {
        setIsLoadingCount(true);
        setCountError(false);

        const count = await getRegisteredMemberCount();

        if (isMounted) {
          setMemberCount(count);
        }
      } catch (error) {
        console.error("Failed to load registered-member count:", error);

        if (isMounted) {
          setCountError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoadingCount(false);
        }
      }
    };

    loadMemberCount();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ---------- Count-up animation (presentation only) ---------- */
  useEffect(() => {
    if (isLoadingCount || countError || typeof memberCount !== "number") return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setAnimatedCount(memberCount);
      return;
    }

    const duration = 1600;
    const startTime = performance.now();
    let frameId;

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedCount(Math.round(memberCount * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [memberCount, isLoadingCount, countError]);

  const hasCount =
    !isLoadingCount && !countError && typeof memberCount === "number";

  return (
    <>
      <section
        className="relative isolate flex min-h-[calc(100vh-80px)] items-center overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Layered background treatment */}
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/85 to-black/45"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(250,204,21,0.16),transparent_55%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-black to-transparent"
          aria-hidden="true"
        />

        <div className="relative mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 lg:px-12 lg:py-24">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            {/* ============ LEFT — MESSAGE ============ */}
            <div className="max-w-2xl text-white">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-1 w-12 rounded-full bg-yellow-400" />

                <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
                  United Democratic Alliance
                </p>
              </div>

              <h1 className="text-5xl font-extrabold leading-[1.03] tracking-tight sm:text-6xl xl:text-7xl">
                Kazi ni Kazi
                <span className="mt-3 block text-yellow-400">
                  Every Hustle Matters.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-white/80 sm:text-lg">
                Together, we can build opportunities, empower communities,
                and create a better future for every Kenyan.
              </p>

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

              <div className="mt-12 flex items-center gap-4 text-sm text-white/60">
                <span className="h-px w-12 bg-yellow-400" />
                <span>Working together for a better Kenya</span>
              </div>
            </div>

            {/* ============ RIGHT — DRAMATIC MEMBER COUNTER ============ */}
            <div className="relative w-full max-w-xl lg:justify-self-end">
              {/* Ambient glow behind the card */}
              <div
                className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-yellow-400/20 blur-[70px]"
                aria-hidden="true"
              />

              <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-white/[0.06] p-7 shadow-[0_25px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-10">
                {/* Top hairline */}
                <div
                  className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/80 to-transparent"
                  aria-hidden="true"
                />

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-yellow-400/30 bg-yellow-400/10 text-yellow-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-6 w-6"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                        />
                        <circle cx="10" cy="7" r="4" />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                        />
                      </svg>
                    </span>

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/55">
                        Registered
                      </p>
                      <p className="text-lg font-bold leading-tight text-white">
                        Members
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-70" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-400" />
                    </span>
                    Live
                  </span>
                </div>

                {/* Accessible announcement of the final value */}
                <p className="sr-only" aria-live="polite">
                  {hasCount
                    ? `${memberCount.toLocaleString("en-KE")} registered members`
                    : isLoadingCount
                      ? "Loading registered member count"
                      : "Registered member count unavailable"}
                </p>

                {/* THE NUMBER */}
                <div className="mt-8 sm:mt-10" aria-hidden="true">
                  {hasCount ? (
                    <p className="bg-gradient-to-b from-white via-yellow-200 to-yellow-500 bg-clip-text text-[clamp(2.75rem,7vw,5.5rem)] font-black leading-[0.85] tracking-tighter text-transparent tabular-nums drop-shadow-[0_0_45px_rgba(250,204,21,0.35)]">
                      {animatedCount.toLocaleString("en-KE")}
                    </p>
                  ) : isLoadingCount ? (
                    <div className="h-14 w-48 animate-pulse rounded-lg bg-white/10 sm:h-20 sm:w-64" />
                  ) : (
                    <p className="text-3xl font-black tracking-tight text-white/45 sm:text-4xl">
                      Unavailable
                    </p>
                  )}
                </div>

                <div className="mt-8 h-px w-full bg-gradient-to-r from-yellow-400/50 via-white/10 to-transparent" />

                <p className="mt-6 text-sm leading-6 text-white/60">
                  Kenyans already standing with the movement.{" "}
                  <span className="font-semibold text-yellow-400">
                    Add your name.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isMembershipOpen && (
        <MembershipModal onClose={() => setIsMembershipOpen(false)} />
      )}
    </>
  );
}

export default Hero;