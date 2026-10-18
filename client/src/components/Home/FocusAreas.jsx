import {
  HeartHandshake,
  GraduationCap,
  ChartNoAxesCombined,
  Scale,
  Leaf,
  Landmark,
} from "lucide-react";

const focusAreas = [
  {
    title: "Healthcare",
    icon: HeartHandshake,
  },
  {
    title: "Education",
    icon: GraduationCap,
  },
  {
    title: "Economy",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Judicial Reforms",
    icon: Scale,
  },
  {
    title: "Environment",
    icon: Leaf,
  },
  {
    title: "Governance",
    icon: Landmark,
    highlighted: true,
  },
];

function FocusAreas() {
  return (
    <section className="bg-[#f7c821] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-8">
          <p className="text-sm font-bold text-white">
            Focus Areas
          </p>

          <div className="mt-4 h-0.5 w-10 bg-white" />

          <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl">
            How we plan to build a better country!
          </h2>
        </div>

        <div className="grid grid-cols-1 border border-white/30 sm:grid-cols-2 lg:grid-cols-3">
          {focusAreas.map((area) => {
            const Icon = area.icon;

            return (
              <article
                key={area.title}
                className="border-b border-white/30 p-6 last:border-b-0 sm:border-r lg:p-8"
              >
                <div
                  className={`flex h-28 w-28 items-center justify-center rounded-md ${
                    area.highlighted ? "bg-green-600" : "bg-white"
                  }`}
                >
                  <Icon
                    size={52}
                    strokeWidth={1.8}
                    className={
                      area.highlighted
                        ? "text-white"
                        : "text-green-600"
                    }
                  />
                </div>

                <h3 className="mt-8 text-xl font-bold text-green-700">
                  {area.title}
                </h3>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FocusAreas;