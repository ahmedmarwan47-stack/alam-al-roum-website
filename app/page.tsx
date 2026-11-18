import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import ScrollStory from "@/components/sections/ScrollStory";
import Communities from "@/components/sections/Communities";
import Masterplan from "@/components/sections/Masterplan";
import WaysToLive from "@/components/sections/WaysToLive";
import Connectivity from "@/components/sections/Connectivity";
import QatariDiarNumbers from "@/components/sections/QatariDiarNumbers";
import Events from "@/components/sections/Events";
import Gallery from "@/components/sections/Gallery";
import News from "@/components/sections/News";
import Faq from "@/components/sections/Faq";
import Cta from "@/components/sections/Cta";
import Footer from "@/components/sections/Footer";
import { events } from "@/lib/content";
import { allEvents, eventFor } from "@/lib/listings";

/** Each Home event card opens its detail page (/events/<slug>) where one is written, else the Events listing. */
const eventHrefs = Object.fromEntries([...events.upcoming, ...events.past].map(([, , title]) => {
  const e = allEvents.find((x) => x.title === title);
  return [title, e?.slug && eventFor(e.slug) ? `/events/${e.slug}` : "/events"];
}));

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ScrollStory />
      <Communities />
      <Masterplan flushTop />
      <WaysToLive />
      {/* 18 Nov review (Omnia #78): no Visiting Egypt facts on Home; Destination keeps them */}
      <Connectivity visa={false} />
      {/* 18 Nov review (Omnia #79): News and Events switch places, so the Deep Sea events band now follows the gallery */}
      <News />
      <Gallery />
      <Events hrefs={eventHrefs} />
      {/* 12 Nov review: "20 Years of Building" (Qatari Diar) moves to the end of the page, before the FAQ (#53);
          Landmarks and Leisure is removed from Home (#54) */}
      <QatariDiarNumbers />
      <Faq />
      {/* Omnia #77: the lead form on the page itself */}
      <Cta lead />
      <Footer />
    </main>
  );
}
