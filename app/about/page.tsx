import Navbar from "@/components/sections/Navbar";
import Manifesto from "@/components/about/Manifesto";
import LifeInBloom from "@/components/about/LifeInBloom";
import CityNumbers from "@/components/about/CityNumbers";
import CoastalFacts from "@/components/about/CoastalFacts";
import CoinReveal from "@/components/about/CoinReveal";
import TheStory from "@/components/about/TheStory";
import Milestones from "@/components/about/Milestones";
import Masterplan from "@/components/sections/Masterplan";
import Nearby from "@/components/about/Nearby";
import Faq from "@/components/sections/Faq";
import Cta from "@/components/sections/Cta";
import Footer from "@/components/sections/Footer";
import { visaFaq } from "@/lib/about/b-content";

export const metadata = { title: "About — Alam Al Roum" };

/**
 * About page, in the order of the Figma UI Design frame "About • Desktop" (10921:8193), with the 28 Oct edits:
 * the masterplan figures (CityNumbers) take the Qatari Diar numbers' slot as a static section (Home keeps that stage).
 */
export default function About() {
  return (
    <main>
      <Navbar />
      <Manifesto />
      <CityNumbers />
      <LifeInBloom />
      <CoinReveal />
      <CoastalFacts />
      <TheStory />
      <Masterplan places />
      <Milestones />
      <Nearby />
      <Faq data={visaFaq} />
      <Cta />
      <Footer />
    </main>
  );
}
