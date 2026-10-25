import Navbar from "@/components/sections/Navbar";
import PageHero from "@/components/sections/PageHero";
import ExperienceTrack from "@/components/sections/ExperienceTrack";
import Cta from "@/components/sections/Cta";
import Footer from "@/components/sections/Footer";
import { expHero } from "@/lib/experiences";

export const metadata = { title: "Experiences & Lifestyle — Alam Al Roum" };

/** Experiences & Lifestyle, in the order of the Figma UI Design frame "Experiences & Lifestyle • Desktop" (10921:7596). */
export default function Experiences() {
  return (
    <main>
      <Navbar />
      <PageHero data={expHero} />
      <ExperienceTrack />
      <Cta />
      <Footer />
    </main>
  );
}
