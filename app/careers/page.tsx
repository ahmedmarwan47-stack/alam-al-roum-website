import Navbar from "@/components/sections/Navbar";
import ListingHero from "@/components/sections/ListingHero";
import RoleList from "@/components/careers/RoleList";
import Cta from "@/components/sections/Cta";
import Footer from "@/components/sections/Footer";
import { careersHero } from "@/lib/careers";

export const metadata = { title: "Careers — Alam Al Roum" };

/** Careers (Figma "Careers • Desktop"): listing hero, then the filterable role cards. */
export default function CareersPage() {
  return (
    <main>
      <Navbar />
      <ListingHero title={careersHero.title} body={careersHero.body} />
      <RoleList />
      <Cta />
      <Footer />
    </main>
  );
}
