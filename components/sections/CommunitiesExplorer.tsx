"use client";
import { useState } from "react";
import Link from "next/link";
import SectionTitle from "./SectionTitle";
import MasterplanMap from "./MasterplanMap";
import RevealImage from "@/components/reveal/RevealImage";
import { comSection as S, communities } from "@/lib/communities";

/** Segmented Toggle (Figma 10941:17875): the dark thumb slides across, Smart Animate 350 ms. */
export function SegmentedToggle({ options, value, onChange }: { options: readonly string[]; value: number; onChange: (i: number) => void }) {
  return (
    <div role="tablist" className="relative flex rounded-full bg-[#f2f2f2] p-1">
      <span className="absolute left-1 top-1 h-12 w-[clamp(120px,24vw,180px)] rounded-full bg-deepsea-500 transition-transform duration-[350ms] [transition-timing-function:var(--ease-fig-inout)]"
        style={{ transform: `translateX(${value * 100}%)` }} />
      {options.map((o, k) => (
        <button key={o} role="tab" aria-selected={k === value} onClick={() => onChange(k)}
          className={`relative h-12 w-[clamp(120px,24vw,180px)] t-label l-16 transition-colors duration-[350ms] ${k === value ? "text-white" : "text-black/60"}`}>{o}</button>
      ))}
    </div>
  );
}

/**
 * Section / Communities (Map · Grid), Figma 10921:12509: one viewport with a Map / Grid toggle.
 * Map = the masterplan with pins (Beachfront open), Grid = the six community cards in a staggered flow.
 */
export default function CommunitiesExplorer() {
  const [view, setView] = useState(0);
  const pins = communities.filter((c) => c.pin).map((c) => ({ title: c.name, body: c.line, x: c.pin!.x, y: c.pin!.y, photo: c.pinPhoto, href: `/communities/${c.slug}` }));
  return (
    <section className="flex flex-col items-center gap-10 bg-white pt-20">
      <SectionTitle tag={S.tag} title={S.title} body={S.body} className="container-x" />
      <SegmentedToggle options={S.toggle} value={view} onChange={setView} />
      {view === 0
        ? <MasterplanMap image={S.masterplan} pins={pins} />
        : (
          <div className="grid w-full gap-x-3 gap-y-14 pb-20 container-x sm:grid-cols-2 lg:grid-cols-[492fr_380fr_496fr]">
            {communities.map((c, k) => (
              <Link key={c.slug} href={`/communities/${c.slug}`} className="group flex flex-col gap-[10px] self-start">
                <div className="overflow-hidden" style={{ aspectRatio: `${c.card.w} / ${c.card.h}` }}>
                  <RevealImage src={c.photo} alt={c.name} delay={(k % 3) * 0.08} className="h-full w-full"
                    imgClassName="transition-transform duration-[1.2s] [transition-timing-function:var(--ease-site)] group-hover:scale-[1.05]" />
                </div>
                <span className="t-heading hd-24 text-black">{c.name}</span>
                <span className="t-body b-14 text-black/60">{c.body}</span>
              </Link>))}
          </div>)}
    </section>
  );
}
