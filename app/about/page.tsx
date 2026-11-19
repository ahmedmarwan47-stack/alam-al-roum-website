import Navbar from "@/components/sections/Navbar";
import Manifesto from "@/components/about/Manifesto";
import DeveloperNumbers from "@/components/about/DeveloperNumbers";
import LifeInBloom from "@/components/about/LifeInBloom";
import MissionValues from "@/components/about/MissionValues";
import QdEgypt from "@/components/about/QdEgypt";
import Masterplan from "@/components/sections/Masterplan";
import Milestones from "@/components/about/Milestones";
import Nearby from "@/components/about/Nearby";
import Faq from "@/components/sections/Faq";
import Cta from "@/components/sections/Cta";
import Footer from "@/components/sections/Footer";
import { visaFaq } from "@/lib/about/b-content";

export const metadata = { title: "About — Alam Al Roum" };

/**
 * About page, in the order of the Figma frame "About • Desktop" (11705:10575, 19 Nov): About is the developer's page
 * (Omnia #82): Qatari Diar in numbers, who they are, their mission and values, Qatari Diar Egypt, then the masterplan
 * and the timeline since 2005. The place's story (The Story, the coin, Since the Romans) moved to Destination (#83).
 */
export default function About() {
  return (
    <main>
      <Navbar />
      <Manifesto />
      <DeveloperNumbers />
      <LifeInBloom />
      <MissionValues />
      <QdEgypt />
      <Masterplan places flushTop />
      <Milestones />
      <Nearby />
      <Faq data={visaFaq} />
      <Cta />
      <Footer />
    </main>
  );
}
