"use client";
import { useState } from "react";
import Link from "next/link";
import SectionTitle from "./SectionTitle";
import MasterplanMap from "./MasterplanMap";
import RevealImage from "@/components/reveal/RevealImage";
import { comSection as S, communities } from "@/lib/communities";
import { communityPins, planViews } from "@/lib/masterplan";

/**
 * Segmented Toggle (Figma 10941:17875): the dark thumb slides across, Smart Animate 350 ms. Phones (below md): full
 * width, the options sharing it equally, as the phone buttons; `className` sizes it where the parent has no gutters.
 */
export function SegmentedToggle({ options, value, onChange, className = "max-md:w-full" }:
  { options: readonly string[]; value: number; onChange: (i: number) => void; className?: string }) {
  return (
    <div role="tablist" className={`relative flex rounded-full bg-[#f2f2f2] p-1 ${className}`} style={{ "--n": options.length } as React.CSSProperties}>
      <span className="absolute left-1 top-1 h-12 w-[clamp(120px,24vw,180px)] max-md:w-[calc((100%-8px)/var(--n))] rounded-full bg-deepsea-500 transition-transform duration-[350ms] [transition-timing-function:var(--ease-fig-inout)]"
        style={{ transform: `translateX(${value * 100}%)` }} />
      {options.map((o, k) => (
        <button key={o} role="tab" aria-selected={k === value} onClick={() => onChange(k)}
          className={`relative h-12 w-[clamp(120px,24vw,180px)] max-md:w-auto max-md:flex-1 t-label l-16 transition-colors duration-[350ms] ${k === value ? "text-white" : "text-deepsea-500/60"}`}>{o}</button>
      ))}
    </div>
  );
}

type Community = (typeof communities)[number];

/**
 * The staggered three-column community grid (Figma Communities · Grid). Card sizes belong to the grid slots,
 * so a shorter list (Other communities, the current one hidden) keeps the same rhythm. Below lg it runs in two
 * columns, phones included, as Discovery Land's communities grid does; on a phone the name drops to Heading/16.
 */
export function CommunityGrid({ items, className = "" }: { items: Community[]; className?: string }) {
  return (
    <div className={`grid w-full grid-cols-2 gap-x-3 gap-y-14 max-sm:gap-y-8 max-md:auto-rows-fr lg:grid-cols-[492fr_380fr_496fr] ${className}`}>
      {items.map((c, k) => {
        const slot = communities[k % communities.length].card;
        return (
          <Link key={c.slug} href={`/communities/${c.slug}`} className="group flex flex-col gap-[10px] self-start max-md:gap-0 max-md:self-stretch">
            {/* phones: every photo one 4:5 frame and every card its row's height (the staggered sizes are the desktop layout) */}
            <div className="overflow-hidden max-md:aspect-[4/5]!" style={{ aspectRatio: `${slot.w} / ${slot.h}` }}>
              <RevealImage src={c.photo} alt={c.name} delay={(k % 3) * 0.08} className="h-full w-full"
                imgClassName="transition-transform duration-[1.2s] [transition-timing-function:var(--ease-site)] group-hover:scale-[1.05]" />
            </div>
            {/* phones: name 14 / line 12, as the Home community cards */}
            <span className="t-heading hd-24 text-deepsea-500 max-md:mt-3 max-md:text-[14px]! max-md:leading-5! max-sm:break-words">{c.name}</span>
            <span className="t-body b-14 text-deepsea-500/60 max-md:mt-1 max-md:text-[12px]! max-md:leading-[18px]!">{c.body}</span>
          </Link>);
      })}
    </div>
  );
}

/**
 * Section / Communities (Map · Grid), Figma 10921:12509: one viewport with a Map / Grid toggle.
 * Map = the built-up city cropped from the masterplan, with the six communities' pins and names only (no other
 * places); Grid = the six community cards in a staggered flow.
 */
export default function CommunitiesExplorer() {
  // Grid is the default view; Map is one tap away
  const GRID = S.toggle.indexOf("Grid");
  const [view, setView] = useState(GRID);
  return (
    <section className="flex flex-col items-center gap-10 bg-limestone-50 pt-20">
      <SectionTitle tag={S.tag} title={S.title} body={S.body} className="container-x" />
      <SegmentedToggle options={S.toggle} value={view} onChange={setView} className="max-md:w-[calc(100%-2*var(--gutter))]" />
      {view !== GRID
        ? <MasterplanMap image={planViews.communities.src} view={planViews.communities} pins={communityPins} initial={-1} labels />
        : <CommunityGrid items={communities} className="pb-20 container-x" />}
    </section>
  );
}
