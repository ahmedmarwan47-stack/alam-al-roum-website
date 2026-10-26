import Navbar from "@/components/sections/Navbar";
import ListingHero from "@/components/sections/ListingHero";
import TabbedGrid from "@/components/sections/TabbedGrid";
import Cta from "@/components/sections/Cta";
import Footer from "@/components/sections/Footer";
import { mediaPage } from "@/lib/listings";

export const metadata = { title: "Media Center — Alam Al Roum" };

/** Media Center (Figma "Media Center • Desktop" 10921:9167): listing hero, then Blog / News cards. */
export default function MediaCenterPage() {
  return (
    <main>
      <Navbar />
      <ListingHero title={mediaPage.title} body={mediaPage.body} />
      <TabbedGrid tabs={mediaPage.tabs} lists={[mediaPage.blog, mediaPage.news]} kind="story" />
      <Cta />
      <Footer />
    </main>
  );
}
