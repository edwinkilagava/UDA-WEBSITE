
import heroImage from "../../assets/hero.jpg";

import PageHero from "../../components/common/PageHero.jsx";
import ValuesSection from "../../components/About/ValuesSection.jsx";
import AboutCTA from "../../components/About/AboutCTA.jsx";
import PartyHistory from "../../components/About/PartyHistory.jsx";

function About() {
  return (
    <main>
      <PageHero
        image={heroImage}
        eyebrow="Our Values"
        title="About Us"
      />

      <ValuesSection />

      <AboutCTA />

      <PartyHistory />
    </main>
  );
}

export default About;
