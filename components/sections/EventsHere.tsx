import Link from "next/link";
import Button from "@/components/ui/Button";
import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";

export type EventCard = { location: string; date: string; title: string; photo: string; href?: string };
export type EventsHereData = { tag: string; title: string[]; items: EventCard[] };

/** Events here (Marina, Hotels): a near-black band with four event cards (`location | date`) and View all (Figma 10921:10426).
 *  The title runs on one line (29 Oct review; `title` keeps its two parts for reuse).
 *  Cards are row subgrids, like the shared EventCard, so a two-line title never knocks a row out of line.
 *  On a phone the four cards sit on one swipe row running to the screen edges (as Groupe Montoni's cards do), still a
 *  grid (a column per card, three shared rows) so the subgrid alignment holds. */
export default function EventsHere({ data: E }: { data: EventsHereData }) {
  return (
    <section className="flex flex-col items-center gap-10 bg-[#0e0e0e] py-20 text-white container-x">
      <div className="flex flex-col items-center gap-4 text-center">
        <RevealText text={E.tag} className="t-label l-16" />
        <h2 className="t-heading hd-48">{E.title.join(" ")}</h2>
      </div>
      <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4 max-sm:-mx-[var(--gutter)] max-sm:w-auto max-sm:snap-x max-sm:snap-mandatory max-sm:auto-cols-[72vw] max-sm:grid-flow-col max-sm:grid-cols-none max-sm:grid-rows-[auto_auto_auto] max-sm:self-stretch max-sm:overflow-x-auto max-sm:scroll-px-[var(--gutter)] max-sm:px-[var(--gutter)] max-sm:[scrollbar-width:none] max-sm:[&::-webkit-scrollbar]:hidden max-sm:[&>a]:snap-start">
        {E.items.map((e, k) => (
          <Link key={e.title} href={e.href ?? "/events"} className="group row-span-3 grid grid-rows-subgrid gap-y-4">
            <RevealImage src={e.photo} alt={e.title} delay={k * 0.08} className="aspect-[336/376] w-full" imgClassName="transition-transform duration-[1.2s] [transition-timing-function:var(--ease-site)] group-hover:scale-105" />
            <span className="flex items-center gap-3 self-start t-label l-14 text-white/60"><span>{e.location}</span><i className="h-[14px] w-px bg-white/30" /><span>{e.date}</span></span>
            <RevealText text={e.title} className="self-start t-text x-20" delay={0.1 + k * 0.05} />
          </Link>))}
      </div>
      <Button label="View all" href="/events" variant="outline-light" />
    </section>
  );
}
