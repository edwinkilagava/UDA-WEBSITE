
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import api from "../../services/api.js";

function extractDownloads(response) {
  const data = response?.data ?? response;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.downloads)) return data.downloads;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.downloads)) return data.data.downloads;

  return [];
}

function getDownloadId(download) {
  return download?._id || download?.id || "";
}

function getFileUrl(download) {
  const candidate =
    download?.fileUrl ||
    download?.downloadUrl ||
    download?.url ||
    "";

  if (typeof candidate !== "string" || !candidate.trim()) {
    return "";
  }

  try {
    const parsedUrl = new URL(candidate);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return "";
    }

    return parsedUrl.href;
  } catch {
    return "";
  }
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Unable to load downloads. Please try again."
  );
}

function ManageDownloads() {
  const location = useLocation();

  const [downloads, setDownloads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || ""
  );

  const loadDownloads = useCallback(async ({ refresh = false } = {}) => {
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await api.get("/downloads");
      setDownloads(extractDownloads(response));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDownloads();
  }, [loadDownloads]);

  useEffect(() => {
    if (!successMessage) return;

    const timeoutId = setTimeout(() => {
      setSuccessMessage("");
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [successMessage]);

  const categories = useMemo(() => {
    const values = downloads
      .map((download) => download?.category)
      .filter((category) => typeof category === "string" && category.trim());

    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
  }, [downloads]);

  const filteredDownloads = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return downloads.filter((download) => {
      const searchableText = [
        download?.title,
        download?.name,
        download?.description,
        download?.category,
        download?.fileName,
        download?.type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      const matchesCategory =
        categoryFilter === "all" ||
        download?.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [downloads, searchTerm, categoryFilter]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/admin"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            <span aria-hidden="true">←</span>
            Back to dashboard
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Manage downloads
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
            Review and access resources published on the UDA website.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => loadDownloads({ refresh: true })}
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          <Link
            to="/admin/downloads/upload"
            className="inline-flex items-center justify-center rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Upload resource
          </Link>
        </div>
      </div>

      {successMessage && (
        <div
          role="status"
          className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          {successMessage}
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total resources
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {loading ? "—" : downloads.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Categories
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {loading ? "—" : categories.length}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-200 p-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <label
              htmlFor="download-search"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Search resources
            </label>

            <input
              id="download-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search title, category, or filename..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="w-full sm:w-56">
            <label
              htmlFor="download-category"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Filter by category
            </label>

            <select
              id="download-category"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All categories</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="m-4 rounded-lg border border-red-200 bg-red-50 p-4"
          >
            <p className="text-sm text-red-800">{error}</p>

            <button
              type="button"
              onClick={() => loadDownloads()}
              className="mt-3 text-sm font-semibold text-red-800 underline underline-offset-4 hover:text-red-950"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="px-6 py-16 text-center">
            <div
              className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-900"
              aria-label="Loading downloads"
              role="status"
            />
            <p className="mt-4 text-sm text-gray-500">
              Loading resources...
            </p>
          </div>
        ) : !error && filteredDownloads.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <h2 className="text-base font-semibold text-gray-900">
              {downloads.length === 0
                ? "No resources available"
                : "No matching resources"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              {downloads.length === 0
                ? "Resources published through the admin system will appear here."
                : "Try another search term or choose a different category."}
            </p>

            {downloads.length === 0 && (
              <Link
                to="/admin/downloads/upload"
                className="mt-5 inline-flex items-center justify-center rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Upload a resource
              </Link>
            )}
          </div>
        ) : !error ? (
          <>
            <div className="border-b border-gray-200 px-4 py-3">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {filteredDownloads.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {downloads.length}
                </span>{" "}
                resources
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      Resource
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      File type
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      Date added
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredDownloads.map((download, index) => {
                    const id = getDownloadId(download);
                    const fileUrl = getFileUrl(download);
                    const title =
                      download?.title ||
                      download?.name ||
                      download?.fileName ||
                      "Untitled resource";

                    return (
                      <tr
                        key={id || `${title}-${index}`}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="max-w-sm px-5 py-4">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {title}
                          </p>

                          {download?.description && (
                            <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                              {download.description}
                            </p>
                          )}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                          {download?.category || "Uncategorized"}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                          {download?.type ||
                            download?.mimeType ||
                            download?.fileType ||
                            "—"}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                          {formatDate(
                            download?.createdAt ||
                              download?.uploadedAt ||
                              download?.date
                          )}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-right">
                          {fileUrl ? (
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-700 hover:text-blue-800"
                            >
                              Open resource
                            </a>
                          ) : (
                            <span className="text-sm text-gray-400">
                              No file link
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

export default ManageDownloads;
