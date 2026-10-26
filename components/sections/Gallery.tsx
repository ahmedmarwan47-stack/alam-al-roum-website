"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import RevealMask from "@/components/reveal/RevealMask";
import RevealText from "@/components/reveal/RevealText";
import { gallery } from "@/lib/content";
import type { Seg } from "@/components/reveal/RevealText";

export type GalleryData = { tag: string; title: Seg[]; rows: string[][] };

/** Figma start offsets of the three rows (px at a 1000 px tall wall) and their drift: rows 1 and 3 left, row 2 right. */
const START = [100, 410, 250], DIR = [-1, 1, -1];
const COPIES = 3;              // each row repeats its tiles so the loop never shows an edge, even on very wide screens

/**
 * Section / Gallery Marquee (Figma 10921:12398, ref. the Sienna Framer template): a viewport-tall wall of three
 * tile rows. Two motions run together on one ticker:
 *  · the loop — each row drifts one tile every 12 s (rows 1 and 3 left, row 2 right), endlessly;
 *  · the scroll — the rows slide apart with the page scroll (a parallax of ±12 % of the width over the section's
 *    pass) and the scroll speed pushes them along, forwards when scrolling down, backwards when scrolling up,
 *    easing back to the loop speed once the page stops.
 * The whole wall blurs in as one block (no sweep); the tiles themselves don't animate in one by one.
 */
export default function Gallery({ data = gallery }: { data?: GalleryData }) {
  const G = data;
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    const el = root.current!, rows = gsap.utils.toArray<HTMLElement>("[data-row]", el);
    const pos = rows.map(() => 0);
    let step = 310, setW = 2170, unit = 1, vel = 0, push = 0, prog = 0, active = false;
    const measure = () => {
      const t = rows[0]?.children[0] as HTMLElement | undefined; if (!t) return;
      step = t.offsetWidth + 10; setW = (rows[0].children.length / COPIES) * step; unit = el.offsetHeight / 1000;
      rows.forEach((_, k) => { pos[k] = -START[k] * unit; });
    };
    measure();
    const st = ScrollTrigger.create({ trigger: el, start: "top bottom", end: "bottom top",
      onUpdate: (s) => { vel = s.getVelocity(); prog = s.progress; }, onToggle: (s) => { active = s.isActive; } });
    const tick = (_: number, dt: number) => {
      if (!active) return;
      const s = Math.min(dt, 64) / 1000;
      push += (gsap.utils.clamp(-900, 900, vel * 0.35) - push) * 0.08;   // follows the scroll speed, smoothed
      vel *= 0.9;                                                           // and lets go when the page stops
      rows.forEach((r, k) => {
        pos[k] += DIR[k] * (step / 12 + push) * s;
        const shift = DIR[k] * (prog - 0.5) * 0.24 * el.offsetWidth;        // the scroll-linked slide
        gsap.set(r, { x: gsap.utils.wrap(-setW, 0, pos[k] + shift) });
      });
    };
    gsap.ticker.add(tick);
    window.addEventListener("resize", measure);
    return () => { gsap.ticker.remove(tick); st.kill(); window.removeEventListener("resize", measure); };
  }, []);
  return (
    <section ref={root} data-no-blur className="relative h-svh min-h-[600px] overflow-hidden bg-deepsea-600 lg:max-h-[1100px]">
      <RevealMask blur className="absolute inset-0">
        <div className="absolute inset-x-0 top-0 bottom-[2%] flex flex-col gap-[10px]">
          {G.rows.map((row, r) => (
            <div key={r} data-row className="flex min-h-0 flex-1 gap-[10px] will-change-transform">
              {Array.from({ length: COPIES }, () => row).flat().map((src, k) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={k} src={src} alt="" aria-hidden={k >= row.length} className="aspect-[300/320] h-full w-auto flex-none rounded object-cover" />))}
            </div>))}
        </div>
      </RevealMask>
      {/* exactly Figma's overlays and no more, so the photos stay visible: a 10 % dim, the left fade behind the headline (900 of 1512), the top and bottom fades */}
      <div className="pointer-events-none absolute inset-0 bg-deepsea-950/10" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[59.5%] min-w-[min(520px,100%)] bg-[linear-gradient(to_right,rgb(17_12_7/.6),rgb(17_12_7/.3)_55%,rgb(17_12_7/0))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[22%] bg-gradient-to-b from-deepsea-800 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%] bg-[linear-gradient(to_bottom,rgb(17_12_7/0),rgb(17_12_7/.6))]" />
      <div className="absolute left-[var(--gutter)] top-1/2 flex -translate-y-1/2 flex-col gap-4 text-limestone-50">
        <RevealText text={G.tag} className="t-label l-16" />
        <RevealText as="h2" segs={G.title} className="t-heading hd-48" delay={0.1} />
      </div>
    </section>
  );
}
