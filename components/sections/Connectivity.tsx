import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import RevealText from "@/components/reveal/RevealText";
import RevealMask from "@/components/reveal/RevealMask";
import RadiusMap, { FlightTimes } from "./RadiusMap";
import { connectivity as c } from "@/lib/content";

/**
 * `tag` overrides the eyebrow; `compact` drops the visa card and button (Destination · To town, Figma 11012:15889).
 * Below lg the two columns dissolve (display: contents) and their blocks are re-ordered, so a phone reads the title
 * and body first, then the map (with the flight times listed under it), the visa card, the list and the button.
 */
export default function Connectivity({ tag, compact = false }: { tag?: string; compact?: boolean }) {
  return (
    <section className={`flex flex-col gap-10 bg-terracotta-500 py-20 text-limestone-50 container-x lg:flex-row ${compact ? "lg:items-center lg:gap-[72px]" : ""}`}>
      <div className="flex flex-col gap-10 max-lg:contents lg:w-1/2 lg:flex-none">
        <div className="flex flex-col gap-6 max-lg:order-3">
          <RevealMask><RadiusMap /></RevealMask>
          <FlightTimes className="md:hidden" />
        </div>
        {!compact && <div className="flex flex-col gap-4 rounded-[20px] border border-limestone-50/15 bg-limestone-50/10 p-6 max-lg:order-4">
          <span className="flex items-center gap-[10px] t-label l-16 text-limestone-50/80"><Icon name="airplane-landing-01" />{c.visa.label}</span>
          {/* side by side from sm; stacked on a phone, where two columns would be ~130px each */}
          <div className="flex flex-col gap-5 sm:flex-row sm:gap-7">
            {c.visa.points.map(([h, b], k) => (
              <div key={h} className={`flex flex-1 flex-col gap-2 ${k ? "relative border-t border-limestone-50/20 pt-5 sm:border-t-0 sm:pt-0 sm:before:absolute sm:before:-left-[14.5px] sm:before:inset-y-0 sm:before:w-px sm:before:bg-limestone-50/20" : ""}`}>
                <RevealText text={h} className="t-heading hd-24" /><RevealText text={b} className="t-body b-16 text-limestone-50/80" delay={0.08} /></div>))}
          </div>
        </div>}
      </div>
      <div className={`flex flex-1 flex-col justify-center max-lg:contents ${compact ? "gap-10" : "gap-8"}`}>
        <div className="flex flex-col gap-4 max-lg:order-1">
          <RevealText text={tag ?? c.tag} className="t-label l-16" />
          <RevealText as="h2" text={c.title} className="t-heading hd-48" delay={0.05} />
        </div>
        <RevealText text={c.body} className={`t-body b-18 max-lg:order-2 max-lg:-mt-2 ${compact ? "" : "max-w-[607px] text-limestone-50/60"}`} delay={0.1} />
        {/* Home: a quiet sentence-case label, rules between rows. To Town: an uppercase label, a rule above every row. */}
        <div className={`flex flex-col max-lg:order-5 ${compact ? "" : "gap-4"}`}>
          <span className={compact ? "pb-4 t-label l-16 uppercase" : "t-text x-16 text-limestone-50/60"}>{c.listLabel}</span>
          <div className="flex flex-col">
            {c.items.map((it, k) => (
              <div key={it.title} className={`flex gap-6 py-5 ${compact ? "border-t border-[#884C42]" : k ? "border-t border-limestone-50/15" : ""}`}>
                <span className={`t-label l-14 ${compact ? "" : "text-limestone-50/40"}`}>{String(k + 1).padStart(2, "0")}</span>
                <Icon name={it.icon} size={24} />
                <div className="flex flex-col gap-[6px]"><RevealText text={it.title} className="t-heading hd-14" /><RevealText text={it.body} className={`t-body b-16 ${compact ? "" : "text-limestone-50/60"}`} delay={0.06} /></div>
              </div>))}
          </div>
        </div>
        {!compact && <div className="max-lg:order-6"><Button label={c.cta} href="/destination" variant="light" /></div>}
      </div>
    </section>
  );
}
