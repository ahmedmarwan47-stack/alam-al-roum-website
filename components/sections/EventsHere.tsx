import Link from "next/link";
import Button from "@/components/ui/Button";
import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";

export type EventCard = { cat: string; date: string; title: string; photo: string; href?: string };
export type EventsHereData = { tag: string; title: string[]; items: EventCard[] };

/** Events here (Marina, Hotels): a near-black band with four event cards and View all (Figma 10921:10426).
 *  Cards are row subgrids, like the shared EventCard, so a two-line title never knocks a row out of line. */
export default function EventsHere({ data: E }: { data: EventsHereData }) {
  return (
    <section className="flex flex-col items-center gap-10 bg-[#0e0e0e] py-20 text-white container-x">
      <div className="flex flex-col items-center gap-4 text-center">
        <RevealText text={E.tag} className="t-label l-16" />
        <h2 className="t-heading hd-48">{E.title.map((l) => <span key={l} className="block">{l}</span>)}</h2>
      </div>
      <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
        {E.items.map((e, k) => (
          <Link key={e.title} href={e.href ?? "/events"} className="group row-span-3 grid grid-rows-subgrid gap-y-4">
            <RevealImage src={e.photo} alt={e.title} delay={k * 0.08} className="aspect-[336/376] w-full" imgClassName="transition-transform duration-[1.2s] [transition-timing-function:var(--ease-site)] group-hover:scale-105" />
            <span className="flex items-center gap-3 self-start t-label l-14 text-white/60"><span>{e.cat}</span><i className="h-[14px] w-px bg-white/30" /><span>{e.date}</span></span>
            <RevealText text={e.title} className="self-start t-text x-20" delay={0.1 + k * 0.05} />
          </Link>))}
      </div>
      <Button label="View all" href="/events" variant="outline-light" />
    </section>
  );
}
