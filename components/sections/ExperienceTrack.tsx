"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";
import { track as T, experiences } from "@/lib/experiences";

type X = (typeof experiences)[number];

/** One tall card: photo (mask reveal, slow hover zoom) with the Explore chip, then name + fact. `num` adds the slider's index. */
/** `grid`: a card of the Experiences page grid, which is two columns below lg, so the phone card rules apply there
 *  (name 14/20 over the note 12/18, photo → name 12 px, 4 px between the lines). */
function Card({ x, delay, num, grid = false, className = "" }: { x: X; delay: number; num?: number; grid?: boolean; className?: string }) {
  return (
    <Link href={`/experiences/${x.slug}`} className={`group flex flex-col ${grid ? "gap-3 md:gap-4" : "gap-4"} ${className}`}>
      <div className="relative aspect-[448/587] overflow-hidden">
        <RevealImage src={x.photo} alt={x.title} delay={delay} className="h-full w-full"
          imgClassName="transition-transform duration-[1.2s] [transition-timing-function:var(--ease-site)] group-hover:scale-[1.06]" />
        {num !== undefined && <span className="absolute left-4 top-4 t-label l-12 text-black">{String(num).padStart(2, "0")}</span>}
        {/* the arrow alone (9 Nov: no "Explore" word); the card's name labels the link */}
        <span aria-hidden className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-white text-black transition-transform duration-500 [transition-timing-function:var(--ease-site)] group-hover:-translate-y-1 md:bottom-4 md:right-4 md:size-10">
          <Icon name="arrow-up-right" size={16} />
        </span>
      </div>
      {grid
        ? <div className="flex min-w-0 flex-col gap-1 text-black md:flex-row md:items-baseline md:justify-between md:gap-4">
            <span className="t-heading hd-24 max-md:text-[14px]! max-md:leading-5!">{x.title}</span>
            <span className="t-body b-14 opacity-60 max-md:text-[12px]! max-md:leading-[18px]! md:text-right">{x.note}</span>
          </div>
        : <div className="flex items-baseline justify-between gap-4 text-black">
            <span className="t-heading hd-24">{x.title}</span>
            <span className="t-body b-14 text-right opacity-60">{x.note}</span>
          </div>}
    </Link>
  );
}

/**
 * Detail pages (Figma 11128:14102): the same cards on one horizontal track, 440 px wide, with a progress bar
 * (the visible share of the track, moving with it) and round prev / next controls that step one card at a time.
 * `grid` (the Experiences page): a grid at every size (9 Nov), two columns below lg and three from lg, with no
 * controls; the detail pages keep the swipe track.
 */
function Slider({ grid = false }: { grid?: boolean }) {
  const rail = useRef<HTMLDivElement>(null);
  const [bar, setBar] = useState({ w: 0.3, x: 0, start: true, end: false });
  const update = useCallback(() => {
    const r = rail.current; if (!r) return;
    const max = r.scrollWidth - r.clientWidth, w = r.clientWidth / r.scrollWidth;
    setBar({ w, x: max > 0 ? (r.scrollLeft / max) * (1 - w) : 0, start: r.scrollLeft < 4, end: r.scrollLeft > max - 4 });
  }, []);
  useEffect(() => { update(); window.addEventListener("resize", update); return () => window.removeEventListener("resize", update); }, [update]);
  const step = (dir: 1 | -1) => {
    const r = rail.current; if (!r) return;
    const card = r.firstElementChild as HTMLElement | null;
    r.scrollBy({ left: dir * ((card?.offsetWidth ?? 440) + 24), behavior: "smooth" });
  };
  const btn = "grid h-11 w-11 place-items-center rounded-full border border-black/30 text-black transition-opacity duration-300 disabled:opacity-30";
  return (
    <>
      <div ref={rail} onScroll={update}
        className={grid ? "grid grid-cols-2 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-10 lg:grid-cols-3 lg:gap-6"
          : "-mx-[var(--gutter)] flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-[var(--gutter)] px-[var(--gutter)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"}>
        {experiences.map((x, k) => grid
          ? <Card key={x.slug} x={x} grid delay={(k % 2) * 0.08} className="min-w-0" />
          : <div key={x.slug} className="w-[min(440px,78vw)] flex-none snap-start"><Card x={x} delay={Math.min(k, 3) * 0.08} num={k + 1} /></div>)}
      </div>
      {!grid && <div className="flex items-center gap-10">
        <div className="relative h-[2px] flex-1 overflow-hidden bg-black/15">
          <span className="absolute inset-y-0 left-0 bg-black transition-transform duration-300" style={{ width: `${bar.w * 100}%`, transform: `translateX(${(bar.x / bar.w) * 100}%)` }} />
        </div>
        <div className="flex gap-[14px]">
          <button type="button" aria-label="Previous" onClick={() => step(-1)} disabled={bar.start} className={btn}><Icon name="arrow-left-01-sharp" /></button>
          <button type="button" aria-label="Next" onClick={() => step(1)} disabled={bar.end} className={btn}><Icon name="arrow-right-01-sharp" /></button>
        </div>
      </div>}
    </>
  );
}

/**
 * Experiences · Track (Figma 10921:7608, "The Drop" style). The Experiences page lays the nine tall cards
 * out as a 3-column grid (a swipe track below lg); detail pages pass `slider` for the horizontal track. Each photo opens with the
 * mask reveal, then slowly scales on hover while the Explore chip lifts.
 */
export default function ExperienceTrack({ slider = false, title }: { slider?: boolean; title?: typeof T.title }) {
  return (
    <section className={`flex flex-col gap-10 overflow-hidden bg-white container-x ${slider ? "py-[60px]" : "py-20"}`}>
      <div className="flex max-w-[917px] flex-col gap-4">
        <RevealText text={T.tag} className="t-label l-tag" />
        <RevealText as="h2" segs={title ?? T.title} className="t-heading hd-56" delay={0.05} />
        <RevealText text={T.body} className="t-body b-18 opacity-70" delay={0.12} />
      </div>
      <Slider grid={!slider} />
    </section>
  );
}
