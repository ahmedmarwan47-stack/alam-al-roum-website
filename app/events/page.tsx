import Navbar from "@/components/sections/Navbar";
import ListingHero from "@/components/sections/ListingHero";
import TabbedGrid from "@/components/sections/TabbedGrid";
import Cta from "@/components/sections/Cta";
import Footer from "@/components/sections/Footer";
import { eventsPage } from "@/lib/listings";

export const metadata = { title: "Events — Alam Al Roum" };

/** Events (Figma "Events • Desktop" 10921:8974): listing hero, then Upcoming / Past cards. */
export default function EventsPage() {
  return (
    <main>
      <Navbar />
      <ListingHero title={eventsPage.title} body={eventsPage.body} />
      <TabbedGrid tabs={eventsPage.tabs} lists={[eventsPage.upcoming, eventsPage.past]} aspect="443 / 495" />
      <Cta />
      <Footer />
    </main>
  );
}
