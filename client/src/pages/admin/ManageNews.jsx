
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  deleteNews,
  getAllNews,
} from "../../services/news.service.js";

const INPUT_CLASS =
  "w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-700/15";

function Icon({ name, size = 18, className = "" }) {
  const drawings = {
    search: (
      <>
        <circle cx="10.8" cy="10.8" r="6.3" />
        <path d="m16 16 4.2 4.2" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    news: (
      <>
        <path d="M5 3.5h10l4 4V20H5z" />
        <path d="M15 3.5V8h4M8 12h8M8 15.5h8" />
      </>
    ),
    calendar: (
      <>
        <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
        <path d="M7.5 3v4M16.5 3v4M3.5 9.5h17" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
    refresh: (
      <>
        <path d="M20 7v5h-5M4 17v-5h5" />
        <path d="M5.5 9a7 7 0 0 1 11.8-2L20 12M4 12l2.7 5a7 7 0 0 0 11.8-2" />
      </>
    ),
    empty: (
      <>
        <rect x="5" y="3.5" width="14" height="17" rx="2" />
        <path d="M8.5 8h7M8.5 12h7M8.5 16h4" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {drawings[name] || drawings.news}
    </svg>
  );
}

function extractNews(response) {
  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  if (Array.isArray(response?.data?.news)) {
    return response.data.news;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.news)) {
    return response.news;
  }

  if (Array.isArray(response)) {
    return response;
  }

  return [];
}

function getNewsId(article) {
  return article?._id || article?.id || "";
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

function formatDate(value) {
  if (!value) return "Not specified";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function StatusBadge({ status }) {
  const published = status === "published";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold ${
        published
          ? "bg-green-50 text-green-800 ring-1 ring-inset ring-green-200"
          : "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          published ? "bg-green-600" : "bg-slate-400"
        }`}
      />
      {published ? "Published" : "Draft"}
    </span>
  );
}

function Notice({ type, message, onDismiss }) {
  const success = type === "success";

  return (
    <div
      role={success ? "status" : "alert"}
      className={`mb-5 flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${
        success
          ? "border-green-200 bg-green-50 text-green-900"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
    >
      <p className="leading-6">{message}</p>

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="shrink-0 rounded p-1 opacity-70 hover:bg-black/5 hover:opacity-100"
      >
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}

function ManageNews() {
  const location = useLocation();
  const navigate = useNavigate();

  const [news, setNews] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || ""
  );
  const [deletingId, setDeletingId] = useState("");
  const [brokenImages, setBrokenImages] = useState([]);

  const loadNews = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      const response = await getAllNews();
      setNews(extractNews(response));
      setBrokenImages([]);
    } catch (error) {
      setPageError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  useEffect(() => {
    if (!location.state?.successMessage) return;

    setSuccessMessage(location.state.successMessage);

    navigate(location.pathname, {
      replace: true,
      state: null,
    });
  }, [location.pathname, location.state, navigate]);

  const query = search.trim().toLowerCase();

  const filteredNews = news.filter((article) => {
    if (!query) return true;

    const searchableText = [
      article?.title,
      article?.excerpt,
      article?.content,
      article?.status,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query);
  });

  async function handleDelete(article) {
    const id = getNewsId(article);

    if (!id) {
      setActionError("This news article does not have a valid ID.");
      return;
    }

    if (deletingId) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${
        article.title || "this article"
      }"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(id);
    setActionError("");
    setSuccessMessage("");

    try {
      await deleteNews(id);

      setNews((currentNews) =>
        currentNews.filter((entry) => getNewsId(entry) !== id)
      );

      setSuccessMessage("News article deleted successfully.");
    } catch (error) {
      setActionError(getErrorMessage(error));
    } finally {
      setDeletingId("");
    }
  }

  function handleImageError(id) {
    setBrokenImages((current) =>
      current.includes(id) ? current : [...current, id]
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/80">
      <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-7 sm:py-9 lg:px-9">
        {/* Page heading */}
        <header className="mb-7 flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <nav
              aria-label="Breadcrumb"
              className="mb-4 flex items-center gap-2 text-xs text-slate-500"
            >
              <Link
                to="/admin/dashboard"
                className="transition hover:text-green-800"
              >
                Administration
              </Link>
              <span aria-hidden="true">/</span>
              <span className="font-medium text-slate-700">
                News
              </span>
            </nav>

            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-green-800">
              Content management
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              News & Publications
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Create, review and manage news articles published on the
              public website.
            </p>
          </div>

          <Link
            to="/admin/news/add"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-green-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
          >
            <Icon name="plus" size={17} />
            Add news article
          </Link>
        </header>

        {successMessage && (
          <Notice
            type="success"
            message={successMessage}
            onDismiss={() => setSuccessMessage("")}
          />
        )}

        {actionError && (
          <Notice
            type="error"
            message={actionError}
            onDismiss={() => setActionError("")}
          />
        )}

        {/* Search and result count */}
        <section
          aria-label="News article filters"
          className="mb-5 rounded-xl border border-slate-200 bg-white p-4 sm:p-5"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="w-full sm:max-w-lg">
              <label
                htmlFor="news-search"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Search articles
              </label>

              <div className="relative">
                <Icon
                  name="search"
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="news-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by title, content or status"
                  className={INPUT_CLASS}
                />
              </div>
            </div>

            <div className="flex min-h-10 items-center justify-between gap-3 sm:justify-end">
              <p className="text-sm text-slate-500" aria-live="polite">
                {loading
                  ? "Loading articles..."
                  : `${filteredNews.length} of ${news.length} ${
                      news.length === 1 ? "article" : "articles"
                    }`}
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-sm font-semibold text-green-800 hover:text-green-950"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Loading state */}
        {!pageError && loading && (
          <section
            role="status"
            className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center"
          >
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-green-700" />
            <p className="text-sm font-medium text-slate-700">
              Loading news articles
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Please wait while the records are retrieved.
            </p>
          </section>
        )}

        {/* Error state */}
        {pageError && !loading && (
          <section className="rounded-xl border border-red-200 bg-white p-7 sm:p-10">
            <div className="mx-auto max-w-md text-center">
              <h2 className="text-base font-semibold text-slate-900">
                Unable to load news
              </h2>

              <p role="alert" className="mt-2 text-sm leading-6 text-slate-600">
                {pageError}
              </p>

              <button
                type="button"
                onClick={loadNews}
                className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-green-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
              >
                <Icon name="refresh" size={16} />
                Try again
              </button>
            </div>
          </section>
        )}

        {/* Empty state */}
        {!pageError && !loading && news.length === 0 && (
          <section className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center sm:py-20">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 text-green-800">
              <Icon name="empty" size={26} />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              No news articles yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Articles you create will appear here, where you can review
              and manage them.
            </p>

            <Link
              to="/admin/news/add"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-green-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-900"
            >
              <Icon name="plus" size={17} />
              Create first article
            </Link>
          </section>
        )}

        {/* No search matches */}
        {!pageError &&
          !loading &&
          news.length > 0 &&
          filteredNews.length === 0 && (
            <section className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <Icon name="search" size={23} />
              </div>

              <h2 className="mt-4 text-base font-semibold text-slate-900">
                No matching articles
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Try a different search term or clear your search.
              </p>

              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-4 text-sm font-semibold text-green-800 hover:text-green-950"
              >
                Clear search
              </button>
            </section>
          )}

        {/* Articles table */}
        {!pageError && !loading && filteredNews.length > 0 && (
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex flex-col gap-1 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <h2 className="text-sm font-semibold text-slate-900">
                All articles
              </h2>
              <p className="text-xs text-slate-500">
                Select an action to manage an article.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    {["Article", "Status", "Date", "Actions"].map(
                      (heading) => (
                        <th
                          key={heading}
                          scope="col"
                          className="px-5 py-3.5 text-xs font-semibold text-slate-500 sm:px-6"
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredNews.map((article, index) => {
                    const id = getNewsId(article);
                    const title = article.title || "Untitled article";
                    const status = article.status || "draft";
                    const imageKey = id || `article-${index}`;
                    const imageIsBroken = brokenImages.includes(imageKey);

                    return (
                      <tr
                        key={id || imageKey}
                        className="transition-colors hover:bg-slate-50/80"
                      >
                        <td className="max-w-[460px] px-5 py-4 sm:px-6">
                          <div className="flex min-w-0 items-start gap-3.5">
                            {article.image && !imageIsBroken ? (
                              <img
                                src={article.image}
                                alt=""
                                loading="lazy"
                                onError={() => handleImageError(imageKey)}
                                className="h-14 w-20 shrink-0 rounded-md border border-slate-200 bg-slate-50 object-cover"
                              />
                            ) : (
                              <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-400">
                                <Icon name="news" size={22} />
                              </div>
                            )}

                            <div className="min-w-0 pt-0.5">
                              <p className="break-words text-sm font-semibold leading-5 text-slate-900">
                                {title}
                              </p>

                              <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500">
                                {article.excerpt || "No excerpt available."}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 sm:px-6">
                          <StatusBadge status={status} />
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600 sm:px-6">
                          {formatDate(
                            article.publishedAt ||
                              article.createdAt ||
                              article.updatedAt
                          )}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 sm:px-6">
                          <div className="flex items-center gap-4">
                            <Link
                              to={
                                id
                                  ? `/admin/news/edit/${encodeURIComponent(id)}`
                                  : "/admin/news"
                              }
                              onClick={(event) => {
                                if (!id) event.preventDefault();
                              }}
                              aria-disabled={!id}
                              className="rounded text-sm font-semibold text-green-800 hover:text-green-950 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 aria-disabled:pointer-events-none aria-disabled:opacity-50"
                            >
                              Edit
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleDelete(article)}
                              disabled={!id || Boolean(deletingId)}
                              className="rounded text-sm font-medium text-slate-500 transition hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {deletingId === id ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-200 bg-slate-50/60 px-5 py-3.5 sm:px-6">
              <p className="text-xs leading-5 text-slate-500">
                Showing {filteredNews.length}{" "}
                {filteredNews.length === 1 ? "article" : "articles"}
                {query ? " matching your search." : "."}
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default ManageNews;
