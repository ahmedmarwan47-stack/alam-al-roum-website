import { notFound } from "next/navigation";
import Navbar from "@/components/sections/Navbar";
import Button from "@/components/ui/Button";
import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";
import SectionTitle from "@/components/sections/SectionTitle";
import { EventCard } from "@/components/sections/Cards";
import ShareRow from "@/components/media/ShareRow";
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
 * header, 1392×640 hero, the reading column with the event's details in the summary panel — then More Events.
 */
export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const e = eventFor((await params).slug);
  if (!e) notFound();
  const more = (e.past ? eventsPage.past : eventsPage.upcoming).filter((x) => x.slug !== e.slug).slice(0, 3);
  return (
    <main>
      <Navbar />
      <header className="mx-auto mt-[76px] flex max-w-[768px] flex-col items-center gap-6 px-[var(--gutter)] pt-[60px] pb-10 text-center lg:px-0">
        <span className="flex items-center gap-3 t-label l-14 text-black/70"><span>{e.tag}</span><i className="h-[14px] w-px bg-black/30" /><span>{e.date}</span></span>
        <RevealText as="h1" text={e.title} onLoad delay={0.15} className="t-heading hd-48 text-deepsea-500" />
        {e.sub && <RevealText text={e.sub} onLoad delay={0.3} className="t-body b-18 text-limestone-800" />}
        <div className="flex w-full flex-wrap items-center justify-between gap-4 pt-2 text-left">
          <div className="flex flex-col"><span className="t-label l-14 text-black">{e.byline[0]}</span>{e.byline[1] && <span className="t-text x-12 text-black/60">{e.byline[1]}</span>}</div>
          <ShareRow title={e.title} />
        </div>
      </header>
      <div className="container-x">
        {/* phones: a 4:3 crop, as the 1392 × 640 banner would be a thin strip there */}
        <div className="aspect-[4/3] overflow-hidden sm:aspect-[1392/640]"><RevealImage src={e.hero} alt={e.title} onLoad className="h-full w-full" /></div>
      </div>
      <section className="px-[var(--gutter)] py-[60px]">
        <ArticleBody a={e} />
        {!e.past && <div className="mx-auto mt-10 flex max-w-[768px]"><Button label="Register interest" href="/contact" /></div>}
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
