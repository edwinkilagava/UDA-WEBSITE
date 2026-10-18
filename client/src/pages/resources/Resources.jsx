
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { getPublishedResources } from "../../services/resource.service.js";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function extractResources(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.resources)) return response.resources;
  if (Array.isArray(response?.data?.resources)) {
    return response.data.resources;
  }
  return [];
}

function formatFileSize(bytes) {
  if (!Number.isFinite(Number(bytes)) || Number(bytes) < 0) {
    return "";
  }

  const size = Number(bytes);

  return size < 1024 * 1024
    ? `${(size / 1024).toFixed(1)} KB`
    : `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(date) {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "";

  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function getFileFormat(resource) {
  return (
    resource?.fileFormat ||
    resource?.fileName?.split(".").pop() ||
    ""
  ).toLowerCase().replace(".", "");
}

function DocumentIcon({ format }) {
  const isPdf = format === "pdf";

  return (
    <div
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${
        isPdf
          ? "bg-red-50 text-red-700"
          : "bg-blue-50 text-blue-700"
      }`}
      aria-label={`${format || "Document"} file`}
    >
      <div className="text-center">
        <span className="block text-xl" aria-hidden="true">
          ▤
        </span>
        <span className="text-[10px] font-bold uppercase">
          {format || "FILE"}
        </span>
      </div>
    </div>
  );
}

function PdfReader({ resource, onClose }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pageWidth, setPageWidth] = useState(800);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const readerBodyRef = useRef(null);

  const fileKey =
    resource?._id || resource?.id || resource?.fileUrl;

  useEffect(() => {
    setCurrentPage(1);
    setTotalPages(0);
    setZoom(1);
    setError("");
    setLoading(true);
  }, [fileKey]);

  useEffect(() => {
    const container = readerBodyRef.current;

    if (!container) return undefined;

    const updateWidth = () => {
      setPageWidth(
        Math.max(240, Math.min(container.clientWidth - 32, 1000))
      );
    };

    updateWidth();

    let observer;

    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(updateWidth);
      observer.observe(container);
    } else {
      window.addEventListener("resize", updateWidth);
    }

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();

      if (event.key === "ArrowLeft") {
        setCurrentPage((page) => Math.max(1, page - 1));
      }

      if (event.key === "ArrowRight") {
        setCurrentPage((page) =>
          totalPages ? Math.min(totalPages, page + 1) : page
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, totalPages]);

  const handleLoadSuccess = useCallback(({ numPages }) => {
    console.log("TOTAL PDF PAGES:", numPages);
    setTotalPages(numPages);
    setCurrentPage(1);
    setLoading(false);
    setError("");
  }, []);

  const handleLoadError = useCallback((err) => {
    console.error("PDF loading error:", err);
    setError(
      err?.message ||
        "The PDF could not be loaded. Check its URL and access permissions."
    );
    setLoading(false);
  }, []);

  const handlePageError = useCallback((err) => {
    console.error("PDF page rendering error:", err);
    setError(
      err?.message || "This PDF page could not be displayed."
    );
  }, []);

  const retry = () => {
    setError("");
    setLoading(true);
    setTotalPages(0);
    setCurrentPage(1);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-slate-950"
      role="dialog"
      aria-modal="true"
      aria-label={`PDF reader: ${resource.title || "Document"}`}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 bg-slate-900 px-4 py-3 text-white">
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-bold">
            {resource.title || "PDF document"}
          </h2>
          <p className="text-xs text-slate-300">
            {totalPages
              ? `Page ${currentPage} of ${totalPages}`
              : loading
                ? "Loading PDF..."
                : "PDF reader"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setZoom((value) =>
                Math.max(0.5, Number((value - 0.1).toFixed(1)))
              )
            }
            disabled={zoom <= 0.5}
            className="rounded-lg bg-slate-700 px-3 py-2 disabled:opacity-40"
            aria-label="Zoom out"
          >
            −
          </button>

          <span className="min-w-14 text-center text-sm">
            {Math.round(zoom * 100)}%
          </span>

          <button
            type="button"
            onClick={() =>
              setZoom((value) =>
                Math.min(2, Number((value + 0.1).toFixed(1)))
              )
            }
            disabled={zoom >= 2}
            className="rounded-lg bg-slate-700 px-3 py-2 disabled:opacity-40"
            aria-label="Zoom in"
          >
            +
          </button>

          <a
            href={resource.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold hover:bg-slate-600"
          >
            Open original ↗
          </a>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold hover:bg-red-800"
          >
            Close
          </button>
        </div>
      </header>

      <div
        ref={readerBodyRef}
        className="flex min-h-0 flex-1 justify-center overflow-auto p-3 sm:p-6"
      >
        {error ? (
          <div className="m-auto max-w-xl rounded-xl bg-white p-6 text-center">
            <h3 className="text-lg font-bold text-red-700">
              Unable to display this PDF
            </h3>

            <p className="mt-3 break-words text-sm text-slate-600">
              {error}
            </p>

            <p className="mt-3 text-sm text-slate-600">
              The PDF must be accessible to the browser without
              requiring a user login.
            </p>

            <a
              href={resource.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block font-semibold text-green-800 underline"
            >
              Open original PDF
            </a>

            <button
              type="button"
              onClick={retry}
              className="ml-4 mt-5 font-semibold text-slate-700 underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <Document
            key={fileKey}
            file={resource.fileUrl}
            onLoadSuccess={handleLoadSuccess}
            onLoadError={handleLoadError}
            onSourceError={handleLoadError}
            loading={
              <p className="m-auto text-white">
                Loading PDF document...
              </p>
            }
            className="flex items-start justify-center"
          >
            {totalPages > 0 && (
              <Page
                key={`${fileKey}-${currentPage}`}
                pageNumber={currentPage}
                width={pageWidth}
                scale={zoom}
                renderTextLayer
                renderAnnotationLayer
                onLoadError={handlePageError}
                loading={
                  <p className="text-white">
                    Rendering page {currentPage}...
                  </p>
                }
              />
            )}
          </Document>
        )}
      </div>

      {!error && (
        <footer className="flex items-center justify-center gap-4 border-t border-slate-700 bg-slate-900 px-4 py-3 text-white">
          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) => Math.max(1, page - 1))
            }
            disabled={currentPage <= 1 || loading || !totalPages}
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-sm tabular-nums">
            {totalPages ? `${currentPage} / ${totalPages}` : "—"}
          </span>

          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) =>
                Math.min(totalPages, page + 1)
              )
            }
            disabled={
              currentPage >= totalPages || loading || !totalPages
            }
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Next
          </button>
        </footer>
      )}
    </div>
  );
}

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedResource, setSelectedResource] = useState(null);

  const loadResources = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getPublishedResources();
      setResources(extractResources(response));
    } catch (err) {
      console.error("Loading resources failed:", err);
      setError(
        err?.message || "Unable to load resources. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const availableCategories = useMemo(() => {
    const categories = [
      ...new Set(
        resources
          .map((resource) => resource.category)
          .filter(Boolean)
      ),
    ];

    return [
      "All",
      ...categories.sort((a, b) => a.localeCompare(b)),
    ];
  }, [resources]);

  const filteredResources = useMemo(() => {
    const term = search.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesCategory =
        category === "All" || resource.category === category;

      const searchableText = [
        resource.title,
        resource.description,
        resource.category,
        resource.fileName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesCategory && searchableText.includes(term);
    });
  }, [resources, search, category]);

  const openResource = useCallback((resource) => {
    if (!resource?.fileUrl) return;

    if (getFileFormat(resource) !== "pdf") {
      window.open(
        resource.fileUrl,
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }

    setSelectedResource(resource);
  }, []);

  const closeReader = useCallback(() => {
    setSelectedResource(null);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-green-900 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-200">
            Information and publications
          </p>

          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Resources
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-green-50 sm:text-lg">
            Explore official documents, policies, reports, party
            publications, and other materials available from the
            United Democratic Alliance.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Document library
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Find and read documents without leaving this page.
              </p>
            </div>

            <div className="w-full lg:max-w-sm">
              <label
                htmlFor="resource-search"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Search documents
              </label>
              <input
                id="resource-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by title or keyword..."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
              />
            </div>
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            {availableCategories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  category === item
                    ? "border-green-800 bg-green-800 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-green-700 hover:text-green-800"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {!loading && !error && (
            <p className="mb-5 text-sm text-slate-500">
              Showing {filteredResources.length}{" "}
              {filteredResources.length === 1 ? "document" : "documents"}
            </p>
          )}

          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
              <div
                className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-green-800"
                role="status"
                aria-label="Loading documents"
              />
              <p className="mt-4 text-sm text-slate-600">
                Loading resources...
              </p>
            </div>
          )}

          {!loading && error && (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-white px-6 py-12 text-center"
            >
              <h3 className="text-lg font-bold text-slate-900">
                We couldn't load the documents
              </h3>
              <p className="mt-2 text-sm text-slate-600">{error}</p>
              <button
                type="button"
                onClick={loadResources}
                className="mt-5 rounded-xl bg-green-800 px-5 py-3 text-sm font-semibold text-white hover:bg-green-900"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && filteredResources.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-2xl text-green-800">
                ▤
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                {resources.length === 0
                  ? "No documents available yet"
                  : "No matching documents"}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                {resources.length === 0
                  ? "Published documents will appear here when available."
                  : "Try another search term or select a different category."}
              </p>

              {(search || category !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                  }}
                  className="mt-5 text-sm font-semibold text-green-800 hover:text-green-950"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {!loading && !error && filteredResources.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredResources.map((resource) => {
                const format = getFileFormat(resource);

                return (
                  <article
                    key={resource._id || resource.id}
                    className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md sm:p-6"
                  >
                    <div className="flex items-start gap-4">
                      <DocumentIcon format={format} />
                      <div className="min-w-0 flex-1">
                        <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
                          {resource.category || "General"}
                        </span>
                        <h3 className="mt-3 break-words text-lg font-bold leading-6 text-slate-900">
                          {resource.title}
                        </h3>
                      </div>
                    </div>

                    <p className="mt-4 flex-1 whitespace-pre-line text-sm leading-6 text-slate-600">
                      {resource.description ||
                        "Open this document to view its contents."}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-100 pt-4 text-xs text-slate-500">
                      <span className="font-semibold uppercase">
                        {format || "Document"}
                      </span>

                      {resource.fileSize != null && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{formatFileSize(resource.fileSize)}</span>
                        </>
                      )}

                      {resource.publishedAt && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{formatDate(resource.publishedAt)}</span>
                        </>
                      )}
                    </div>

                    {resource.fileUrl ? (
                      <button
                        type="button"
                        onClick={() => openResource(resource)}
                        className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-800 px-4 py-3 text-sm font-semibold text-white hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
                      >
                        {format === "pdf" ? "Read PDF" : "Open document"}
                        <span aria-hidden="true">↗</span>
                      </button>
                    ) : (
                      <p className="mt-5 text-sm text-slate-500">
                        Document link unavailable.
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {selectedResource && (
        <PdfReader
          resource={selectedResource}
          onClose={closeReader}
        />
      )}
    </main>
  );
}
