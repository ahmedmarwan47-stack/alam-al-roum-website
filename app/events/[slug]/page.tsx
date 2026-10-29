import { notFound } from "next/navigation";
import Navbar from "@/components/sections/Navbar";
import Button from "@/components/ui/Button";
import RevealImage from "@/components/reveal/RevealImage";
import SectionTitle from "@/components/sections/SectionTitle";
import { EventCard } from "@/components/sections/Cards";
import DetailHeader from "@/components/media/DetailHeader";
import ArticleBody from "@/components/media/ArticleBody";
import Cta from "@/components/sections/Cta";
import Footer from "@/components/sections/Footer";
import { allEvents, eventFor, eventsPage } from "@/lib/listings";

export const dynamicParams = false;
export const generateStaticParams = () => allEvents.filter((e) => eventFor(e.slug!)).map((e) => ({ slug: e.slug! }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const e = eventFor((await params).slug);
  return { title: e ? `${e.title} — Alam Al Roum Events` : "Alam Al Roum", description: e?.sub || undefined };
}

/**
 * Event detail: Figma has no event frame, so it follows "Article Detail (Blog / News) • Desktop" (10921:10137) —
 * the shared detail header (location | date, no byline), 1392×640 hero, the reading column (no details panel: the
 * header already gives the venue and date, 29 Oct review) — then More Events.
 */
export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const e = eventFor((await params).slug);
  if (!e) notFound();
  const more = (e.past ? eventsPage.past : eventsPage.upcoming).filter((x) => x.slug !== e.slug).slice(0, 3);
  return (
    <main>
      <Navbar />
      <DetailHeader tag={e.tag} date={e.date} title={e.title} sub={e.sub} />
      <div className="container-x">
        {/* phones: a 4:3 crop, as the 1392 × 640 banner would be a thin strip there */}
        <div className="aspect-[4/3] overflow-hidden sm:aspect-[1392/640]"><RevealImage src={e.hero} alt={e.title} onLoad className="h-full w-full" /></div>
      </div>
      <section className="px-[var(--gutter)] py-[60px]">
        <ArticleBody a={e} />
      </section>
      <section className="flex flex-col items-center gap-10 bg-limestone-50 py-20 container-x">
        <SectionTitle title={e.past ? "More moments" : "More events"} body="A calendar of culture, sport, and conversation." />
        {/* phones: one swipe row to the screen edges (as Events here and Groupe Montoni's cards); a column per card keeps the subgrid rows */}
        <div className="grid w-full gap-6 sm:grid-cols-2 md:grid-cols-3 max-sm:-mx-[var(--gutter)] max-sm:w-auto max-sm:self-stretch max-sm:snap-x max-sm:snap-mandatory max-sm:auto-cols-[72vw] max-sm:grid-flow-col max-sm:grid-rows-[auto_auto_auto] max-sm:gap-4 max-sm:overflow-x-auto max-sm:scroll-px-[var(--gutter)] max-sm:px-[var(--gutter)] max-sm:[scrollbar-width:none] max-sm:[&::-webkit-scrollbar]:hidden max-sm:[&>a]:snap-start">
          {more.map((c, k) => <EventCard key={c.slug} {...c} delay={k * 0.08} />)}
        </div>
        <Button label="View all" href="/events" variant="outline" />
      </section>
      <Cta />
      <Footer />
    </main>
  );
}
