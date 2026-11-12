import Navbar from "@/components/sections/Navbar";
import ListingHero from "@/components/sections/ListingHero";
import FaqAccordion from "@/components/sections/FaqAccordion";
import Cta from "@/components/sections/Cta";
import Footer from "@/components/sections/Footer";
import { faqPage } from "@/lib/faq";

export const metadata = { title: "FAQ — Alam Al Roum" };

/** FAQ (Figma "FAQ • Desktop", 10921:9428): listing hero, then the category chips over the accordion. */
export default function FaqPage() {
  return (
    <main>
      <Navbar />
      <ListingHero title={faqPage.title} body={faqPage.body} />
      <FaqAccordion />
      <Cta />
      <Footer />
    </main>
  );
}
