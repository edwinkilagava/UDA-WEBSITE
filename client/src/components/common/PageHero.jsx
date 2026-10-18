function PageHero({ image, eyebrow, title }) {
  return (
    <section
      className="relative flex min-h-[405px] items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* Green overlay */}
      <div className="absolute inset-0 bg-green-900/70" />

      {/* Hero content */}
      <div className="relative z-10 px-6 text-center text-white">
        <p className="text-base font-semibold">
          {eyebrow}
        </p>

        <div className="mx-auto mt-3 h-0.5 w-10 bg-white" />

        <h1 className="mt-4 text-5xl font-bold sm:text-6xl">
          {title}
        </h1>
      </div>
    </section>
  );
}

export default PageHero;