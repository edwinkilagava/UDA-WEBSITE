
import { Link } from "react-router-dom";

const ADMIN_MODULES = [
  {
    title: "News",
    description: "Create and manage website news articles.",
    path: "/admin/news",
    icon: "📰",
  },
  {
    title: "Events",
    description: "Manage upcoming and past party events.",
    path: "/admin/events",
    icon: "📅",
  },
  {
    title: "Members",
    description: "Review registered members.",
    path: "/admin/members",
    icon: "👥",
  },
  {
    title: "Contributions",
    description: "Review available contribution records.",
    path: "/admin/contributions",
    icon: "💳",
  },
  {
    title: "Downloads",
    description: "Manage documents and public resources.",
    path: "/admin/downloads",
    icon: "📁",
  },
  {
    title: "Settings",
    description: "Access administrator settings.",
    path: "/admin/settings",
    icon: "⚙️",
  },
];

export default function AdminDashboard() {
  return (
    <main className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-900 via-green-800 to-green-700 p-6 text-white shadow-sm sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <p className="text-sm font-medium tracking-wide text-green-100">
            UDA CONTENT MANAGEMENT
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Administration dashboard
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-green-50 sm:text-base">
            Manage website news, events, members and resources from one
            central workspace.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/admin/news/add"
              className="inline-flex min-h-11 items-center rounded-lg bg-white px-4 py-3 text-sm font-semibold text-green-900 transition hover:bg-green-50"
            >
              + Create news article
            </Link>

            <Link
              to="/admin/events/add"
              className="inline-flex min-h-11 items-center rounded-lg border border-white/40 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              + Create event
            </Link>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[32px] border-white/10"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 right-28 h-48 w-48 rounded-full bg-white/5"
        />
      </section>

      {/* Management overview */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-900">
            Management Overview
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Shortcuts to the main areas of your website.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {ADMIN_MODULES.map((module) => (
            <article
              key={module.path}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md sm:p-6"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl">
                  {module.icon}
                </span>

                <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-green-700">
                  ↗
                </span>
              </div>

              <h3 className="mt-5 text-base font-bold text-slate-900">
                {module.title}
              </h3>

              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                {module.description}
              </p>

              <Link
                to={module.path}
                className="mt-5 inline-flex items-center gap-2 rounded text-sm font-semibold text-green-800 hover:text-green-950 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
              >
                Manage {module.title}
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
        <p className="mt-1 text-sm text-slate-500">
          Jump straight into creating website content.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            to="/admin/news/add"
            className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-green-300 hover:bg-green-50/50"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-xl">
              📰
            </span>
            <span>
              <span className="block text-sm font-semibold text-slate-900">
                Create news article
              </span>
              <span className="mt-1 block text-xs text-slate-500">
                Publish a website update
              </span>
            </span>
            <span className="ml-auto text-slate-400">→</span>
          </Link>

          <Link
            to="/admin/events/add"
            className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-green-300 hover:bg-green-50/50"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-xl">
              📅
            </span>
            <span>
              <span className="block text-sm font-semibold text-slate-900">
                Create event
              </span>
              <span className="mt-1 block text-xs text-slate-500">
                Add an upcoming event
              </span>
            </span>
            <span className="ml-auto text-slate-400">→</span>
          </Link>
        </div>
      </section>

      <footer className="pb-4 text-center text-xs text-slate-400">
        UDA Administration Workspace
      </footer>
    </main>
  );
}
