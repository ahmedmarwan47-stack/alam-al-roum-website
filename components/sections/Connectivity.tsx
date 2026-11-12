import type { CSSProperties } from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import RevealText from "@/components/reveal/RevealText";
import RevealMask from "@/components/reveal/RevealMask";
import RadiusMap, { FlightTimes } from "./RadiusMap";
import { connectivity as c } from "@/lib/content";

/**
 * `tag` overrides the eyebrow; `compact` is Destination · To town (Figma 11012:15889): no button, uppercase list label.
 * `visa` shows the visa card under the map (default: on Home, off when compact; Destination passes it).
 * Desktop (lg): the section is one viewport tall. The map and the visa card share one column whose width follows the
 * screen height (the map is 696:720, so its width = the height left after the padding and the card × 696/720, at most
 * half the row), and the list rows are tighter, so the whole section fits 1440×900 and 1512×982 without scrolling.
 * Below lg the two columns dissolve (display: contents) and their blocks are re-ordered, so a phone reads the title
 * and body first, then the map (with the flight times listed under it), the "Connected to Egypt" list, the
 * Visiting Egypt card and the button.
 */
export default function Connectivity({ tag, compact = false, visa = !compact }: { tag?: string; compact?: boolean; visa?: boolean }) {
  // the visa block's height on desktop (label, figures, two lines of text), plus the 24 px gap above it (10 Nov review)
  const col = { "--conn-pad": "clamp(32px, 5.4svh, 48px)", "--visa-h": visa ? "144px" : "0px", "--conn-w": "min(50%, calc((100svh - 2 * var(--conn-pad) - var(--visa-h)) * 696 / 720))" } as CSSProperties;
  return (
    <section className={`flex flex-col gap-10 bg-terracotta-500 py-20 text-limestone-50 container-x lg:min-h-svh lg:flex-row lg:items-center lg:py-[clamp(32px,5.4svh,48px)] ${compact ? "lg:gap-[72px]" : "lg:gap-14"}`}>
      <div className="flex flex-col gap-10 max-lg:contents lg:w-[var(--conn-w)] lg:flex-none lg:gap-6" style={col}>
        <div className="flex flex-col gap-6 max-lg:order-3">
          <RevealMask><RadiusMap /></RevealMask>
          <FlightTimes className="md:hidden" />
        </div>
        {/* Visiting Egypt (10 Nov review: the glass card with its icon read as generic UI): no box (and no rule above it), a plain
            label and two facts set like the site's numbers; 24 px under the block above at every size (the section's
            40 px gap less 16 below lg), the figure large and its line under it */}
        {visa && <div className="flex flex-col gap-4 max-lg:order-5 max-lg:-mt-4 lg:gap-3">
          <span className="t-label l-14 uppercase text-limestone-50/60">{c.visa.label}</span>
          <div className="grid grid-cols-2 gap-6 lg:gap-8">
            {c.visa.points.map(([h, b], k) => (
              <div key={h} className="flex flex-col gap-1">
                <RevealText text={h} className="t-heading text-[24px] leading-8 lg:text-[32px] lg:leading-9" delay={k * 0.06} />
                <RevealText text={b} className="t-body b-14 text-limestone-50/70 lg:text-[14px]! lg:leading-5!" delay={0.08 + k * 0.06} /></div>))}
          </div>
        </div>}
      </div>
      <div className={`flex flex-1 flex-col justify-center max-lg:contents ${compact ? "gap-10 lg:gap-[clamp(18px,3svh,28px)]" : "gap-8 lg:gap-[clamp(14px,2.6svh,24px)]"}`}>
        <div className="flex flex-col gap-4 max-lg:order-1 lg:gap-3">
          <RevealText text={tag ?? c.tag} className="t-label l-tag" />
          <RevealText as="h2" text={c.title} className="t-heading hd-48" delay={0.05} />
        </div>
        <RevealText text={c.body} className={`t-body b-18 max-lg:order-2 max-lg:-mt-2 ${compact ? "" : "max-w-[607px] text-limestone-50/60"}`} delay={0.1} />
        {/* Home: a quiet sentence-case label. To Town: an uppercase label. Both: rules only between the rows */}
        <div className={`flex flex-col max-lg:order-4 ${compact ? "" : "gap-4 lg:gap-2"}`}>
          <span className={compact ? "pb-4 t-label l-16 uppercase lg:pb-2" : "t-text x-16 text-limestone-50/60"}>{c.listLabel}</span>
          <div className="flex flex-col">
            {c.items.map((it, k) => (
              <div key={it.title} className={`flex gap-6 py-5 lg:py-[clamp(8px,1.5svh,20px)] ${k ? (compact ? "border-t border-[#884C42]" : "border-t border-limestone-50/15") : ""}`}>
                <span className={`t-label l-14 ${compact ? "" : "text-limestone-50/40"}`}>{String(k + 1).padStart(2, "0")}</span>
                <Icon name={it.icon} size={24} />
                <div className="flex flex-col gap-[6px] lg:gap-1"><RevealText text={it.title} className="t-heading hd-14" /><RevealText text={it.body} className={`t-body b-16 ${compact ? "" : "text-limestone-50/60"}`} delay={0.06} /></div>
              </div>))}
          </div>
        </div>
        {!compact && <div className="max-lg:order-6"><Button label={c.cta} href="/destination" variant="light" /></div>}
      </div>
    </section>
  );
}
