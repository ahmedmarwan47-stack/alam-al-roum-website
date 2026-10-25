import Navbar from "@/components/sections/Navbar";
import SingleHero from "@/components/sections/SingleHero";
import Overview from "@/components/sections/Overview";
import Landmarks from "@/components/sections/Landmarks";
import WaterTrack from "@/components/sustainability/WaterTrack";
import Faq from "@/components/sections/Faq";
import Cta from "@/components/sections/Cta";
import Footer from "@/components/sections/Footer";
import { susHero, susOverview, commitments, susFaq } from "@/lib/sustainability";

export const metadata = { title: "Sustainability — Alam Al Roum" };

/** Sustainability, in the order of the Figma UI Design frame "Sustainability • Desktop" (10921:10266). */
export default function Sustainability() {
  return (
    <main>
      <Navbar />
      <SingleHero data={susHero} />
      <Overview data={susOverview} />
      <Landmarks data={commitments} />
      <WaterTrack />
      <Faq data={susFaq} />
      <Cta />
      <Footer />
    </main>
  );
}
