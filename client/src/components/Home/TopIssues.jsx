const issues = [
  "Agricultural Transformation",
  "Housing",
  "Healthcare",
  "Digital Superhighway",
  "ICT",
  "Infrastructure",
  "Manufacturing",
  "Service Economy",
  "Sports",
  "Environment",
  "Education",
  "Women Agenda",
  "Social Protection",
  "Governance",
  "Foreign Policy",
];

function TopIssues() {
  const leftColumn = issues.slice(0, 8);
  const rightColumn = issues.slice(8);

  return (
    <section className="bg-[#cbd2e1] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="max-w-3xl text-5xl font-extrabold leading-[0.95] sm:text-6xl lg:text-7xl">
          <span className="text-green-600">Top Issues</span>{" "}
          <span className="text-white">
            that the United Democratic Alliance considers important
          </span>
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <ul className="space-y-2">
            {leftColumn.map((issue) => (
              <li
                key={issue}
                className="list-disc ml-5 text-sm font-semibold text-green-600"
              >
                {issue}
              </li>
            ))}
          </ul>

          <ul className="space-y-2">
            {rightColumn.map((issue) => (
              <li
                key={issue}
                className="list-disc ml-5 text-sm font-semibold text-green-600"
              >
                {issue}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default TopIssues;