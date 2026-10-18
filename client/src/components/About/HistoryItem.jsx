function HistoryItem({ year, title, description, image, reverse = false }) {
  return (
    <article
      className={`grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12 ${
        reverse ? "md:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div className="overflow-hidden rounded-lg">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-bold uppercase tracking-wider text-green-700">
          {year}
        </p>

        <h3 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
          {title}
        </h3>

        <p className="text-base leading-7 text-gray-600">
          {description}
        </p>
      </div>
    </article>
  );
}

export default HistoryItem;