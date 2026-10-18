
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPublishedResourceById } from "../../services/resource.service.js";

export default function ResourceReader() {
  const { id } = useParams();

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadResource() {
      setLoading(true);
      setError("");

      try {
        const response = await getPublishedResourceById(id);
        const document = response?.data ?? response;

        if (!document?._id && !document?.id) {
          throw new Error("The requested document could not be found.");
        }

        if (active) {
          setResource(document);
        }
      } catch (err) {
        if (active) {
          setError(
            err.message || "Unable to load this document."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadResource();

    return () => {
      active = false;
    };
  }, [id]);

  const fileUrl = resource?.fileUrl;
  const format = (
    resource?.fileFormat ||
    resource?.fileName?.split(".").pop() ||
    ""
  ).toLowerCase();

  const isPdf = format === "pdf";

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-green-900 px-4 py-8 text-white sm:px-6">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/resources"
            className="text-sm font-semibold text-green-100 hover:text-white"
          >
            ← Back to Resources
          </Link>

          <h1 className="mt-5 break-words text-2xl font-bold sm:text-3xl">
            {resource?.title || "Document Reader"}
          </h1>

          {resource?.description && (
            <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-6 text-green-50">
              {resource.description}
            </p>
          )}

          {resource && (
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-green-100">
              <span>{resource.category || "General"}</span>
              <span>·</span>
              <span>{format.toUpperCase() || "Document"}</span>
            </div>
          )}
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {loading && (
          <div className="rounded-xl bg-white p-10 text-center">
            Loading document...
          </div>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-white p-8 text-center"
          >
            <h2 className="text-lg font-bold text-slate-900">
              Unable to open document
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              {error}
            </p>

            <Link
              to="/resources"
              className="mt-5 inline-block font-semibold text-green-800 hover:underline"
            >
              Return to Resources
            </Link>
          </div>
        )}

        {!loading && !error && resource && !fileUrl && (
          <div className="rounded-xl bg-white p-8 text-center">
            This document does not have a valid file URL.
          </div>
        )}

        {!loading && !error && fileUrl && isPdf && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4">
              <p className="text-sm text-slate-600">
                Read the PDF below or open it in a new tab.
              </p>

              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-green-800 px-4 py-2 text-sm font-semibold text-white hover:bg-green-900"
              >
                Open PDF in new tab ↗
              </a>
            </div>

            <iframe
              src={fileUrl}
              title={resource?.title || "PDF document"}
              className="h-[75vh] min-h-[500px] w-full"
            />

            <div className="border-t border-slate-200 p-4">
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-green-800 hover:underline"
              >
                Open or download the original PDF
              </a>
            </div>
          </div>
        )}

        {!loading && !error && fileUrl && !isPdf && (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <div className="text-4xl" aria-hidden="true">
              ▤
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              {resource?.fileName || "Document"}
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              This file format cannot be displayed in the PDF reader.
              Open the document or download it to view its contents.
            </p>

            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-lg bg-green-800 px-5 py-3 font-semibold text-white hover:bg-green-900"
            >
              Open document
            </a>
          </div>
        )}
      </section>
    </main>
  );
}
