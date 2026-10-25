import Navbar from "@/components/sections/Navbar";
import ListingHero from "@/components/sections/ListingHero";
import Faq from "@/components/sections/Faq";
import Cta from "@/components/sections/Cta";
import Footer from "@/components/sections/Footer";
import { faq } from "@/lib/content";
import { destFaq } from "@/lib/destination";

export const metadata = { title: "FAQ — Alam Al Roum" };

const items = [...faq.items, ...destFaq.items].filter(([q], k, all) => all.findIndex(([x]) => x === q) === k);

/** FAQ (Figma "FAQ • Desktop"): listing hero, then every question from the home and destination FAQs. */
export default function FaqPage() {
  return (
    <main>
      <Navbar />
      <ListingHero title="Frequently Asked Questions"
        body="Find clear answers about Alam Al Roum. We have gathered the questions most often asked by residents, investors, and visitors." />
      <Faq data={{ title: "All questions", body: "Still curious? Our team is one call away.", cta: "Contact Us", href: "/contact", items }} />
      <Cta />
      <Footer />
    </main>
  );
}
