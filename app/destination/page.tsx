import Navbar from "@/components/sections/Navbar";
import PageHero from "@/components/sections/PageHero";
import TheStory from "@/components/about/TheStory";
import CoinReveal from "@/components/about/CoinReveal";
import InTown from "@/components/destination/InTown";
import Connectivity from "@/components/sections/Connectivity";
import WaterFall from "@/components/destination/WaterFall";
import HistoryTrack from "@/components/destination/HistoryTrack";
import Landmarks from "@/components/sections/Landmarks";
import Faq from "@/components/sections/Faq";
import Cta from "@/components/sections/Cta";
import Footer from "@/components/sections/Footer";
import { destHero, destFaq } from "@/lib/destination";

export const metadata = { title: "Destination — Alam Al Roum" };

/**
 * Destination page, in the order of the Figma frame "Destination • Desktop" (11705:10134, 19 Nov): the place's story
 * joins it from About (Omnia #83): The Story and the coin after the hero, Since the Romans after the water.
 */
export default function Destination() {
  return (
    <main>
      <Navbar />
      <PageHero data={destHero} />
      <TheStory />
      <CoinReveal />
      <InTown />
      <Connectivity tag="To Town" compact visa />
      {/* #65 (12 Nov): the water section on a still sea, the limestone above falling into it (Figma 11545:12304) */}
      <WaterFall />
      <HistoryTrack />
      <Landmarks />
      <Faq data={destFaq} />
      <Cta />
      <Footer />
    </main>
  );
}
