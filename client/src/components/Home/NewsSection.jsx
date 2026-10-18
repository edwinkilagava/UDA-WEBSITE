import NewsCard from "../News/NewsCard";

function NewsSection({ news = [] }) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-wide text-green-700">
            News
          </p>

          <div className="mt-3 h-0.5 w-10 bg-green-700" />

          <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Latest News
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewsSection;