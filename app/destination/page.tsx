import Navbar from "@/components/sections/Navbar";
import PageHero from "@/components/sections/PageHero";
import InTown from "@/components/destination/InTown";
import Connectivity from "@/components/sections/Connectivity";
import WaterStrategy from "@/components/destination/WaterStrategy";
import HistoryTrack from "@/components/destination/HistoryTrack";
import ArchSea from "@/components/destination/ArchSea";
import Landmarks from "@/components/sections/Landmarks";
import Faq from "@/components/sections/Faq";
import Cta from "@/components/sections/Cta";
import Footer from "@/components/sections/Footer";
import { destHero, destFaq } from "@/lib/destination";

export const metadata = { title: "Destination — Alam Al Roum" };

/** Destination page, in the order of the Figma UI Design frame "Destination • Desktop" (10921:7791). */
export default function Destination() {
  return (
    <main>
      <Navbar />
      <PageHero data={destHero} />
      <InTown />
      <Connectivity tag="To Town" compact visa />
      <WaterStrategy />
      <HistoryTrack />
      <ArchSea />
      <Landmarks />
      <Faq data={destFaq} />
      <Cta />
      <Footer />
    </main>
  );
}
