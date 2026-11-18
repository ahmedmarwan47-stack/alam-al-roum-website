import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import RevealText from "@/components/reveal/RevealText";
import LazyMap from "@/components/connectivity/LazyMap";
import { connectivity as c } from "@/lib/content";

/**
 * Destination & Connectivity (redesigned 16 Nov): the map is the section. A header row (tag and title, then the
 * body), the interactive map (components/connectivity: click a country and its route draws to Alam Al Roum with the
 * distance, estimated flight time, miles and direction), then the five ways the city is connected in a row and the
 * visa facts with the button.
 * `tag` overrides the eyebrow; `compact` is Destination · To Town: no button, the body at full Deep Sea.
 * `visa` shows the Visiting Egypt facts (default: on Home, off when compact; Destination passes it).
 */
export default function Connectivity({ tag, compact = false, visa = !compact }: { tag?: string; compact?: boolean; visa?: boolean }) {
  return (
    <section className="bg-limestone-500 py-12 text-deepsea-500 lg:py-20">
      {/* 40 px between the header, the map, the list and the button at every size (18 Nov review; was 56 from lg) */}
      <div className="container-x flex flex-col gap-10">
        <header className="grid gap-4 lg:grid-cols-2 lg:items-end lg:gap-14">
          <div className="flex flex-col gap-4 lg:gap-3">
            <RevealText text={tag ?? c.tag} className="t-label l-tag" />
            <RevealText as="h2" text={c.title} className="t-heading hd-48" delay={0.05} />
          </div>
          <RevealText text={c.body} className={`t-body b-18 lg:max-w-[560px] lg:justify-self-end ${compact ? "" : "text-deepsea-500/70"}`} delay={0.1} />
        </header>

        <LazyMap />

        {/* the five ways in, in a row on desktop, a list on phones */}
        <div className="flex flex-col gap-4 lg:gap-6">
          <span className="t-label l-16 capitalize text-deepsea-500/70">{c.listLabel}</span>
          <div className="grid lg:grid-cols-5 lg:gap-8">
            {c.items.map((it, k) => (
              <div key={it.title} className="flex gap-4 py-4 lg:flex-col lg:gap-3 lg:py-0">
                <span className="flex-none"><Icon name={it.icon} size={24} /></span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <RevealText text={it.title} className="t-heading hd-14 lg:text-[16px] lg:leading-6" delay={k * 0.04} />
                  {it.dist && <span className="t-label l-14 text-deepsea-500">{it.dist}</span>}
                  <p className="t-body b-14 text-deepsea-500/70">{it.body}</p>
                </div>
              </div>))}
          </div>
        </div>

        {(visa || !compact) && (
          // with the visa facts the button sits at their right; alone (Home, 18 Nov review) it is centred
          <div className={visa ? "flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between" : "flex flex-col items-center"}>
            {visa && (
              <div className="flex flex-col gap-4 lg:gap-3">
                <span className="t-label l-16 capitalize text-deepsea-500/70">{c.visa.label}</span>
                <div className="grid grid-cols-2 gap-6 lg:flex lg:gap-14">
                  {c.visa.points.map(([hd, b], k) => (
                    <div key={hd} className="flex flex-col gap-1 lg:max-w-[260px]">
                      <RevealText text={hd} className="t-heading text-[24px] leading-8 lg:text-[32px] lg:leading-9" delay={k * 0.06} />
                      <RevealText text={b} className="t-body b-14 text-deepsea-500/70" delay={0.08 + k * 0.06} />
                    </div>))}
                </div>
              </div>)}
            {!compact && <Button label={c.cta} href="/destination" variant="outline" />}
          </div>)}
      </div>
    </section>
  );
}
