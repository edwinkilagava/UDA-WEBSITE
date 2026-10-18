import leaderImage from "../../assets/leader.jpg";

function Leadership() {
  return (
    <section className="relative overflow-hidden bg-gray-900">
      <img
        src={leaderImage}
        alt="UDA leadership"
        className="h-[600px] w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/45" />

      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-7xl px-6">
          <blockquote className="max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            “The Hustler Nation is for the expansion of every business no
            matter how small”
          </blockquote>
        </div>
      </div>
    </section>
  );
}

export default Leadership;