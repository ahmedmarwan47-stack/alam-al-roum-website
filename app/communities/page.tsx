import Navbar from "@/components/sections/Navbar";
import PageHero from "@/components/sections/PageHero";
import CommunitiesExplorer from "@/components/sections/CommunitiesExplorer";
import Cta from "@/components/sections/Cta";
import Footer from "@/components/sections/Footer";
import { comHero } from "@/lib/communities";

export const metadata = { title: "Communities — Alam Al Roum" };

/** Communities list, in the order of the Figma UI Design frame "List Neighbourhoods/Communities • Desktop" (10921:7384). */
export default function Communities() {
  return (
    <main>
      <Navbar />
      <PageHero data={comHero} />
      <CommunitiesExplorer />
      <Cta />
      <Footer />
    </main>
  );
}
