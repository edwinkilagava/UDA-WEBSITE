import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getNewsById } from "../../services/news.service.js";

function NewsDetails() {
  const { id } = useParams();

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchNews() {
      try {
        setLoading(true);
        setError("");

        const response = await getNewsById(id);

        // Support APIs returning either an article directly
        // or an article inside a "data" property.
        const article = response?.data ?? response;

        if (!article || !article._id && !article.id) {
          // Some APIs return the article without an ID in
          // the response body, so only reject empty results.
          if (!article) {
            throw new Error("News article not found.");
          }
        }

        if (isMounted) {
          setNews(article);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.status === 404
              ? "This news article could not be found."
              : err.message || "Failed to load the news article."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (id) {
      fetchNews();
    } else {
      setError("No news article ID was provided.");
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <p className="text-center text-gray-600">
          Loading news article...
        </p>
      </main>
    );
  }

  if (error || !news) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <p className="mb-6 text-center text-red-600">
          {error || "News article not found."}
        </p>

        <div className="text-center">
          <Link
            to="/news"
            className="font-medium text-green-700 hover:underline"
          >
            Back to News
          </Link>
        </div>
      </main>
    );
  }

  const title = news.title || "Untitled News Article";

  const image =
    news.imageUrl ||
    news.image ||
    news.imageURL ||
    "";

  const content =
    news.content ||
    news.body ||
    news.description ||
    news.excerpt ||
    "";

  const publishedDate = news.publishedAt || news.createdAt;

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <article className="mx-auto max-w-4xl rounded-xl bg-white p-5 shadow-sm sm:p-8">
        <Link
          to="/news"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:underline"
        >
          <span aria-hidden="true">←</span>
          Back to News
        </Link>

        {news.category && (
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-green-700">
            {news.category}
          </p>
        )}

        <h1 className="mb-4 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
          {title}
        </h1>

        {publishedDate && (
          <p className="mb-6 text-sm text-gray-500">
            {new Date(publishedDate).toLocaleDateString("en-KE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}

        {image && (
          <img
            src={image}
            alt={title}
            className="mb-8 max-h-[480px] w-full rounded-xl object-cover"
          />
        )}

        {news.excerpt && (
          <p className="mb-6 text-lg font-medium leading-8 text-gray-700">
            {news.excerpt}
          </p>
        )}

        <div className="whitespace-pre-wrap break-words text-base leading-8 text-gray-700">
          {content}
        </div>
      </article>
    </main>
  );
}

export default NewsDetails;