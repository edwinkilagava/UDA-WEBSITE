import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllResources } from "../../services/resource.service.js";

function formatDate(date) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function extractResources(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;

  return [];
}

function StatusBadge({ status }) {
  const published = status === "published";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        published
          ? "bg-green-100 text-green-800"
          : "bg-amber-100 text-amber-800"
      }`}
    >
      <span
        className={`mr-2 h-1.5 w-1.5 rounded-full ${
          published ? "bg-green-600" : "bg-amber-500"
        }`}
      />
      {published ? "Published" : "Draft"}
    </span>
  );
}

export default function ManageResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadResources = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAllResources();
      setResources(extractResources(response));
    } catch (err) {
      setError(
        err.message || "Unable to load resources. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const categories = [
    ...new Set(
      resources.map((resource) => resource.category).filter(Boolean)
    ),
  ].sort((a, b) => a.localeCompare(b));

  const normalizedSearch = search.trim().toLowerCase();

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = [
      resource.title,
      resource.description,
      resource.category,
      resource.fileName,
    ]
      .filter(Boolean)
      .some((value) =>
        value.toLowerCase().includes(normalizedSearch)
      );

    const matchesCategory =
      categoryFilter === "all" ||
      resource.category === categoryFilter;

    const matchesStatus =
      statusFilter === "all" ||
      resource.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const publishedCount = resources.filter(
    (resource) => resource.status === "published"
  ).length;

  const draftCount = resources.filter(
    (resource) => resource.status === "draft"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-green-800">
              Content management
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Resources
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Manage official documents, reports, policies, and other
              downloadable materials.
            </p>
          </div>

          <Link
            to="/admin/resources/upload"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
          >
            <span aria-hidden="true">+</span>
            Upload resource
          </Link>
        </div>

        {/* Summary cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total resources
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {resources.length}
            </p>
          </div>

          <div className="rounded-2xl border border-green-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Published
            </p>

            <p className="mt-3 text-3xl font-bold text-green-800">
              {publishedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Drafts
            </p>

            <p className="mt-3 text-3xl font-bold text-amber-700">
              {draftCount}
            </p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mt-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between"
          >
            <p>{error}</p>

            <button
              type="button"
              onClick={loadResources}
              className="self-start rounded-lg border border-red-300 px-3 py-2 font-semibold hover:bg-red-100 sm:self-auto"
            >
              Try again
            </button>
          </div>
        )}

        {/* Resource management section */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Search and filters */}
          <div className="border-b border-slate-200 p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  All documents
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredResources.length} of {resources.length}{" "}
                  resources
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:flex">
                <label
                  className="sr-only"
                  htmlFor="resource-search"
                >
                  Search resources
                </label>

                <input
                  id="resource-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search documents..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20 lg:w-64"
                />

                <label
                  className="sr-only"
                  htmlFor="category-filter"
                >
                  Filter by category
                </label>

                <select
                  id="category-filter"
                  value={categoryFilter}
                  onChange={(event) =>
                    setCategoryFilter(event.target.value)
                  }
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
                >
                  <option value="all">All categories</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <label
                  className="sr-only"
                  htmlFor="status-filter"
                >
                  Filter by status
                </label>

                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
                >
                  <option value="all">All statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="flex min-h-64 items-center justify-center p-8">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-green-800" />

                <p className="mt-4 text-sm text-slate-500">
                  Loading resources...
                </p>
              </div>
            </div>
          ) : error && resources.length === 0 ? (
            /* Failed loading state */
            <div className="p-10 text-center text-sm text-slate-500">
              Resources could not be loaded.
            </div>
          ) : filteredResources.length === 0 ? (
            /* Empty state */
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                ▤
              </div>

              <h4 className="mt-4 text-base font-semibold text-slate-900">
                {resources.length === 0
                  ? "No resources uploaded yet"
                  : "No matching resources"}
              </h4>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {resources.length === 0
                  ? "Upload your first document to get started."
                  : "Try changing your search or filters."}
              </p>

              {resources.length === 0 && (
                <Link
                  to="/admin/resources/upload"
                  className="mt-5 inline-flex items-center justify-center rounded-xl bg-green-800 px-5 py-3 text-sm font-semibold text-white hover:bg-green-900"
                >
                  Upload first resource
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">
                        Document
                      </th>

                      <th className="px-6 py-4 font-semibold">
                        Category
                      </th>

                      <th className="px-6 py-4 font-semibold">
                        File
                      </th>

                      <th className="px-6 py-4 font-semibold">
                        Status
                      </th>

                      <th className="px-6 py-4 font-semibold">
                        Published
                      </th>

                      <th className="px-6 py-4 text-right font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredResources.map((resource) => (
                      <tr
                        key={resource._id || resource.id}
                        className="transition hover:bg-slate-50/70"
                      >
                        <td className="max-w-xs px-6 py-5">
                          <p className="truncate font-semibold text-slate-900">
                            {resource.title}
                          </p>

                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                            {resource.description || "No description"}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-600">
                          {resource.category}
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-xs font-bold uppercase text-slate-700">
                            {resource.fileFormat || "FILE"}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {formatFileSize(resource.fileSize)}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <StatusBadge status={resource.status} />
                        </td>

                        <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-600">
                          {formatDate(resource.publishedAt)}
                        </td>

                        <td className="whitespace-nowrap px-6 py-5 text-right">
                          {resource.fileUrl && (
                            <a
                              href={resource.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm font-semibold text-green-800 hover:text-green-950"
                            >
                              View file ↗
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="divide-y divide-slate-100 md:hidden">
                {filteredResources.map((resource) => (
                  <article
                    key={resource._id || resource.id}
                    className="space-y-3 p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="break-words font-semibold text-slate-900">
                          {resource.title}
                        </h4>

                        <p className="mt-1 text-sm text-slate-500">
                          {resource.category}
                        </p>
                      </div>

                      <StatusBadge status={resource.status} />
                    </div>

                    <p className="text-sm leading-6 text-slate-600">
                      {resource.description || "No description provided."}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                      <span>
                        {(resource.fileFormat || "FILE").toUpperCase()} ·{" "}
                        {formatFileSize(resource.fileSize)}
                      </span>

                      <span>{formatDate(resource.publishedAt)}</span>
                    </div>

                    {resource.fileUrl && (
                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex text-sm font-semibold text-green-800 hover:text-green-950"
                      >
                        View file ↗
                      </a>
                    )}
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}