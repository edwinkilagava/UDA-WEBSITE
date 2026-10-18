
import { Link } from "react-router-dom";

import { useAuth } from "../../Hooks/Auth.Hooks.js";

const ADMIN_SECTIONS = [
  {
    title: "News management",
    description: "Create, edit, and manage published news articles.",
    path: "/admin/news",
    action: "Manage news",
  },
  {
    title: "Events management",
    description: "Manage upcoming events and existing event listings.",
    path: "/admin/events",
    action: "Manage events",
  },
  {
    title: "Member management",
    description: "Review membership records and available member information.",
    path: "/admin/members",
    action: "Manage members",
  },
  {
    title: "Contributions",
    description: "Review contribution records and payment statuses.",
    path: "/admin/contributions",
    action: "View contributions",
  },
  {
    title: "Downloads and resources",
    description: "Manage public documents, publications, and other resources.",
    path: "/admin/downloads",
    action: "Manage resources",
  },
];

function Settings() {
  const { user, isAdmin } = useAuth();

  const adminName =
    user?.fullName ||
    user?.name ||
    user?.displayName ||
    "Administrator";

  const adminEmail = user?.email || "Email unavailable";

  const adminRole = user?.role || (isAdmin ? "admin" : "unknown");

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          to="/admin"
          className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
        >
          <span aria-hidden="true">←</span>
          Back to dashboard
        </Link>

        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Admin settings
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
          Review your administrator account and access the website management
          sections available to you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <aside className="space-y-4 lg:col-span-1">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="bg-blue-950 px-5 py-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-xl font-bold text-white">
                {adminName
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part.charAt(0).toUpperCase())
                  .join("") || "A"}
              </div>

              <h2 className="mt-4 text-lg font-bold text-white">
                {adminName}
              </h2>

              <p className="mt-1 break-all text-sm text-blue-100">
                {adminEmail}
              </p>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Account role
                </p>

                <div className="mt-2">
                  <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-800">
                    {adminRole}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Account information
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Account details are provided by the current authentication
                  session. Contact your system administrator if your account
                  information needs to be corrected.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-gray-900">
              Administration
            </h2>

            <nav aria-label="Administration navigation" className="mt-3 space-y-1">
              <Link
                to="/admin"
                className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Dashboard
              </Link>

              <Link
                to="/admin/settings"
                aria-current="page"
                className="flex items-center rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-900"
              >
                Settings
              </Link>
            </nav>
          </div>
        </aside>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="m19.4 15 .1.1a1.7 1.7 0 0 1-2.4 2.4l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a1.7 1.7 0 0 1-3.4 0v-.2a1.7 1.7 0 0 0-2.9-1.2l-.1.1a1.7 1.7 0 0 1-2.4-2.4l.1-.1a1.7 1.7 0 0 0-1.2-2.9H4a1.7 1.7 0 0 1 0-3.4h.2a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a1.7 1.7 0 0 1 2.4-2.4l.1.1a1.7 1.7 0 0 0 2.9-1.2V2a1.7 1.7 0 0 1 3.4 0v.2a1.7 1.7 0 0 0 2.9 1.2l.1-.1a1.7 1.7 0 0 1 2.4 2.4l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.2a1.7 1.7 0 0 1 0 3.4h-.2a1.7 1.7 0 0 0-1.3 2.9Z" />
                </svg>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Website management
                </h2>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Use the sections below to manage the website's content and
                  administrative records.
                </p>
              </div>
            </div>

            <div className="mt-6 divide-y divide-gray-100">
              {ADMIN_SECTIONS.map((section) => (
                <div
                  key={section.path}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {section.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      {section.description}
                    </p>
                  </div>

                  <Link
                    to={section.path}
                    className="inline-flex shrink-0 items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-800 hover:bg-blue-50 hover:text-blue-900"
                  >
                    {section.action}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
            <h2 className="text-base font-semibold text-amber-950">
              Security and account changes
            </h2>

            <p className="mt-2 text-sm leading-6 text-amber-900">
              Password changes, administrator invitations, role changes, and
              session security should be handled through dedicated,
              server-validated workflows. This page does not modify those
              settings or claim to save changes that the backend has not
              implemented.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Settings;
