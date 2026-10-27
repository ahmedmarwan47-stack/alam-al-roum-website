"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";
import { track as T, experiences } from "@/lib/experiences";

type X = (typeof experiences)[number];

/** One tall card: photo (mask reveal, slow hover zoom) with the Explore chip, then name + fact. `num` adds the slider's index. */
function Card({ x, delay, num, className = "" }: { x: X; delay: number; num?: number; className?: string }) {
  return (
    <Link href={`/experiences/${x.slug}`} className={`group flex flex-col gap-4 ${className}`}>
      <div className="relative aspect-[448/587] overflow-hidden">
        <RevealImage src={x.photo} alt={x.title} delay={delay} className="h-full w-full"
          imgClassName="transition-transform duration-[1.2s] [transition-timing-function:var(--ease-site)] group-hover:scale-[1.06]" />
        {num !== undefined && <span className="absolute left-4 top-4 t-label l-12 text-black">{String(num).padStart(2, "0")}</span>}
        <span className="absolute bottom-4 right-4 flex items-center gap-[6px] rounded-full bg-white px-[14px] py-2 t-label l-12 text-black transition-transform duration-500 [transition-timing-function:var(--ease-site)] group-hover:-translate-y-1">
          {T.cta}<Icon name="arrow-up-right" size={14} />
        </span>
      </div>
      <div className="flex items-baseline justify-between gap-4 text-black">
        <span className="t-heading hd-24">{x.title}</span>
        <span className="t-body b-14 text-right opacity-60">{x.note}</span>
      </div>
    </Link>
  );
}

/**
 * Detail pages (Figma 11128:14102): the same cards on one horizontal track, 440 px wide, with a progress bar
 * (the visible share of the track, moving with it) and round prev / next controls that step one card at a time.
 * `grid` (the Experiences page): below lg the cards swipe on this track, as The Drop does on a phone; from lg up the
 * same rail is the three-column grid and the controls hide.
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
        className={`-mx-[var(--gutter)] flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-[var(--gutter)] px-[var(--gutter)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${grid ? "lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0" : ""}`}>
        {experiences.map((x, k) => grid
          ? <Card key={x.slug} x={x} delay={(k % 3) * 0.08} className="w-[min(440px,78vw)] flex-none snap-start lg:w-auto" />
          : <div key={x.slug} className="w-[min(440px,78vw)] flex-none snap-start"><Card x={x} delay={Math.min(k, 3) * 0.08} num={k + 1} /></div>)}
      </div>
      <div className={`flex items-center gap-10 ${grid ? "lg:hidden" : ""}`}>
        <div className="relative h-[2px] flex-1 overflow-hidden bg-black/15">
          <span className="absolute inset-y-0 left-0 bg-black transition-transform duration-300" style={{ width: `${bar.w * 100}%`, transform: `translateX(${(bar.x / bar.w) * 100}%)` }} />
        </div>
        <div className="flex gap-[14px]">
          <button type="button" aria-label="Previous" onClick={() => step(-1)} disabled={bar.start} className={btn}><Icon name="arrow-left-01-sharp" /></button>
          <button type="button" aria-label="Next" onClick={() => step(1)} disabled={bar.end} className={btn}><Icon name="arrow-right-01-sharp" /></button>
        </div>
      </div>
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
        <RevealText text={T.tag} className="t-label l-16" />
        <RevealText as="h2" segs={title ?? T.title} className="t-label hd-56 capitalize" delay={0.05} />
        <RevealText text={T.body} className="t-body b-18 opacity-70" delay={0.12} />
      </div>
      <Slider grid={!slider} />
    </section>
  );
}
