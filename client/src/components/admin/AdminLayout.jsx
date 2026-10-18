
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../Hooks/Auth.Hooks.js";

const SIDEBAR_LINKS = [
  { label: "Overview", path: "/admin/dashboard", icon: "▦" },
  { label: "News", path: "/admin/news", icon: "▤" },
  { label: "Events", path: "/admin/events", icon: "▣" },
  { label: "Members", path: "/admin/members", icon: "♙" },
  { label: "Contributions", path: "/admin/contributions", icon: "◇" },

  // Contact form messages
  { label: "Messages", path: "/admin/messages", icon: "✉" },

  { label: "Downloads", path: "/admin/downloads", icon: "⇩" },
  { label: "Resources", path: "/admin/resources", icon: "▧" },
  { label: "Settings", path: "/admin/settings", icon: "⚙" },
];

export default function AdminLayout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminName =
    user?.name?.trim() ||
    user?.fullName?.trim() ||
    user?.email ||
    "Administrator";

  const initials =
    adminName
      .split(/[\s@.]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "AD";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      )}

      {/* Persistent sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col overflow-hidden border-r border-white/10 bg-slate-950 text-white transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-6">
          <Link
            to="/admin/dashboard"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-700 text-lg font-extrabold">
              U
            </span>

            <span>
              <span className="block text-lg font-bold tracking-wide">
                UDA
              </span>
              <span className="block text-xs text-slate-400">
                Admin workspace
              </span>
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"
          >
            ✕
          </button>
        </div>

        {/* Navigation heading */}
        <div className="shrink-0 px-7 pb-2 pt-7">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Workspace
          </p>
        </div>

        {/* Independently scrollable links */}
        <nav
          aria-label="Admin navigation"
          className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain px-4 py-2"
        >
          {SIDEBAR_LINKS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin/dashboard"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 ${
                  isActive
                    ? "bg-green-700 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center text-lg">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Fixed sidebar footer */}
        <div className="shrink-0 border-t border-white/10 p-4">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <span aria-hidden="true">↗</span>
            View public website
          </Link>
        </div>
      </aside>

      {/* Main area */}
      <div className="min-h-screen lg:pl-64">
        {/* Sticky top bar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={sidebarOpen}
              className="shrink-0 rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-green-700 lg:hidden"
            >
              ☰
            </button>

            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500">
                UDA / Administration
              </p>
              <h1 className="mt-1 truncate text-sm font-bold text-slate-900 sm:text-base">
                Admin workspace
              </h1>
            </div>
          </div>

          <div className="ml-3 flex shrink-0 items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="max-w-48 truncate text-sm font-semibold text-slate-800">
                {adminName}
              </p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>

            <div
              className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-800 ring-2 ring-green-50"
              title={adminName}
            >
              {initials}
            </div>
          </div>
        </header>

        {/* Each admin page renders here */}
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
