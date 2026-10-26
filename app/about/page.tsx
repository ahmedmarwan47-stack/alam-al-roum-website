import Navbar from "@/components/sections/Navbar";
import Manifesto from "@/components/about/Manifesto";
import LifeInBloom from "@/components/about/LifeInBloom";
import QatariDiarNumbers from "@/components/sections/QatariDiarNumbers";
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

/** About page, in the order of the Figma UI Design frame "About • Desktop" (10921:8193). */
export default function About() {
  return (
    <main>
      <Navbar />
      <Manifesto />
      <QatariDiarNumbers />
      <LifeInBloom />
      <CoinReveal />
      <CoastalFacts />
      <TheStory />
      <Masterplan />
      <Milestones />
      <Nearby />
      <Faq data={visaFaq} />
      <Cta />
      <Footer />
    </main>
  );
}
