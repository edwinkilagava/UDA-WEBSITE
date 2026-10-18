
import { useEffect, useState } from "react";
import NewsCard from "../../components/News/NewsCard.jsx";
import { getNews } from "../../services/news.service.js";

function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        setError("");

        const data = await getNews();

        // Support either an array or an API response containing data.
        const articles = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];

        setNews(articles);
      } catch (error) {
        console.error("Failed to load news:", error);
        setError("We were unable to load the latest news.");
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, []);

  return (
    <main>
      <section className="bg-[#f7c821] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-bold uppercase tracking-wide text-green-800">
            UDA News
          </p>

          <div className="mt-3 h-0.5 w-10 bg-green-800" />

          <h1 className="mt-4 text-4xl font-bold text-gray-900 sm:text-5xl">
            Latest News
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-800">
            Stay informed with the latest news, updates, and developments
            from the United Democratic Alliance.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          {loading && (
            <div className="py-12 text-center">
              <p className="text-gray-600">Loading news...</p>
            </div>
          )}

          {!loading && error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-6 text-center"
            >
              <p className="font-medium text-red-700">{error}</p>
            </div>
          )}

          {!loading && !error && news.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-600">
                No news articles are available at the moment.
              </p>
            </div>
          )}

          {!loading && !error && news.length > 0 && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {news.map((item, index) => (
                <NewsCard
                  key={item._id ?? item.id ?? index}
                  news={item}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default News;
