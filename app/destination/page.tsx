import Navbar from "@/components/sections/Navbar";
import PageHero from "@/components/sections/PageHero";
import InTown from "@/components/destination/InTown";
import Connectivity from "@/components/sections/Connectivity";
import WaterFall from "@/components/destination/WaterFall";
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
      {/* #65 (12 Nov): the water section on a still sea, the limestone above falling into it (Figma 11545:12304) */}
      <WaterFall />
      {/* 12 Nov review: Since the Romans (the history track) moved to About (#66); the mirror-arch sea section removed (#67) */}
      <Landmarks />
      <Faq data={destFaq} />
      <Cta />
      <Footer />
    </main>
  );
}
