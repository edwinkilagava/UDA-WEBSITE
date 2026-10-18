
import { Link } from "react-router-dom";

function NewsCard({ news }) {
  const {
    _id,
    id,
    title,
    excerpt,
    image,
    publishedAt,
  } = news;

  const newsId = _id || id;

  return (
    <article className="overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md">
      {image && (
        <img
          src={image}
          alt={title || "News article"}
          className="h-56 w-full object-cover"
        />
      )}

      <div className="p-6">
        {publishedAt && (
          <time
            dateTime={publishedAt}
            className="text-sm font-medium text-green-700"
          >
            {new Date(publishedAt).toLocaleDateString("en-KE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
        )}

        <h3 className="mt-2 text-xl font-bold text-gray-900">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          {excerpt}
        </p>

        {newsId && (
          <Link
            to={`/news/${newsId}`}
            className="mt-5 inline-flex items-center gap-2 font-semibold text-green-700 transition-colors hover:text-green-900"
          >
            Read More
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </article>
  );
}

export default NewsCard;
