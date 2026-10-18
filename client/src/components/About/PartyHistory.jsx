
import HistoryItem from "./HistoryItem";

import img1 from "../../assets/img1.jpg";
import img2 from "../../assets/img2.jpg";
import img3 from "../../assets/img3.jpg";

function PartyHistory() {
  const history = [
    {
      year: "Our Beginning",
      title: "Building a Movement",
      description:
        "The United Democratic Alliance was formed around the idea of bringing people together and creating a political movement focused on opportunity, inclusion, and national development.",
      image: img1,
    },
    {
      year: "Our Growth",
      title: "Growing Across the Country",
      description:
        "The movement continued to expand by connecting with communities across the country and strengthening its grassroots presence.",
      image: img2,
    },
    {
      year: "Our Future",
      title: "Looking Ahead",
      description:
        "We continue to work toward a future where every Kenyan has an opportunity to participate, contribute, and prosper.",
      image: img3,
    },
  ];

  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-wider text-green-700">
            Our Journey
          </p>

          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Party History
          </h2>

          <p className="mt-4 text-base leading-7 text-gray-600">
            Discover the journey, milestones, and vision that continue to
            shape our movement.
          </p>
        </div>

        <div className="space-y-16">
          {history.map((item, index) => (
            <HistoryItem
              key={item.year}
              {...item}
              reverse={index % 2 !== 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PartyHistory;

