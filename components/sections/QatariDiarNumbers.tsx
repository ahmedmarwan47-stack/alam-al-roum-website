"use client";
import { useEffect, useRef } from "react";
import RevealText from "@/components/reveal/RevealText";
import { onceInView } from "@/components/reveal/letters";
import { gsap, reducedMotion } from "@/lib/gsap";
import { srcSet } from "@/lib/img";

const STATS = [
  { n: "20", title: ["20 Years", "of building"], body: "Two decades of landmark destinations, built across five continents and backed by the Qatar Investment Authority.", cta: "About Qatari Diar", photo: "/images/photo/ui-expcenter-day.webp" },
  { n: "42", title: ["42 Investment", "projects"], body: "Cities, districts and resorts delivered or underway, from Lusail to the Mediterranean shore of Alam Al Roum.", cta: "Our projects", photo: "/images/photo/ui-pm-visit.webp" },
  { n: "35", title: ["$35Bn Global", "portfolio"], body: "A portfolio exceeding USD 35 billion, with over two decades of investment in Egypt.", cta: "Investment in Egypt", photo: "/images/photo/ui-g-coast.webp" },
];
const INTRO = {
  title: "Built by Qatari Diar",
  body: "The real estate company of the Qatar Investment Authority, building cities, districts and resorts around the world, and the developer of Alam Al Roum.",
};

/**
 * Qatari Diar in numbers. Since the 18 Nov review (Omnia #80: the scroll-driven version was hard to read) a still
 * section: the Qatari Diar logo and an intro, then the three numbers side by side, each stat readable at once. The
 * Möbius numerals are kept as the section's look: each two-digit number is a Limestone sheet with black digits over
 * its photo (mix-blend-lighten), so the photo shows only through the digits. They play once as they come into view
 * (18 Nov): every digit rolls slowly up the last few places and settles on its figure, the three numbers a beat apart;
 * nothing is tied to the scroll. The text blurs in as everywhere. Phones: the stats one under another, numbers smaller.
 */
export default function QatariDiarNumbers() {
  return (
    // a screen of its own (18 Nov review), its content centred in it, so it reads apart from the FAQs below (same Limestone)
    <section className="flex min-h-svh flex-col justify-center bg-limestone-50 py-12 lg:py-20">
      <div className="flex flex-col gap-10 container-x lg:gap-16">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-14">
          <div className="flex items-center gap-5 lg:gap-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/qatari-diar.png" alt="Qatari Diar" width={80} height={80} className="h-14 w-14 flex-none lg:h-20 lg:w-20" />
            <RevealText as="h2" text={INTRO.title} className="t-heading hd-48 text-deepsea-500" />
          </div>
          <RevealText text={INTRO.body} className="t-body b-18 text-limestone-800 md:max-w-[440px]" delay={0.1} />
        </header>
        {/* phones: the stats one under another on hairlines, each number at 60 % width over its words; from md three columns */}
        <div className="grid divide-y divide-deepsea-500/15 md:grid-cols-3 md:gap-6 md:divide-y-0 lg:gap-10">
          {STATS.map((x, k) => (
            <article key={x.n} className="flex flex-col gap-4 py-8 first:pt-0 last:pb-0 md:gap-5 md:py-0 lg:gap-6">
              <div className="max-md:w-[60%]"><Numeral n={x.n} photo={x.photo} delay={k * 0.1} /></div>
              <div className="flex flex-col gap-1 md:gap-2 lg:gap-3">
                <RevealText as="h3" text={x.title.join(" ")} className="t-heading hd-32 text-deepsea-500" delay={k * 0.08} />
                <RevealText text={x.body} className="t-body b-16 text-limestone-800 max-md:text-[14px] max-md:leading-5" delay={0.1 + k * 0.08} />
              </div>
            </article>))}
        </div>
      </div>
    </section>
  );
}

const REPS = 3;   // each digit column holds 0–9 three times, so every digit has room to roll into place
const ROLL = 4;   // how many places each digit rolls before it settles (18 Nov: a short, slow roll, not a spin)
const at = (i: number) => ({ yPercent: (-i * 100) / (10 * REPS) });

/**
 * A two-digit Möbius numeral: the photo shows through black digits on a Limestone sheet (Figma "Numerals", 890 × 580).
 * Each digit is a column of 0–9 three times over; it rests on the middle turn (the figure, also the server render).
 * As soon as the numeral comes into view each digit rolls up the last four places to its figure (1.8 s, power2.out:
 * moving at once, slowing softly into place; 18 Nov, between the first fast spin and a too-slow 3 s version), the right
 * digit a beat after the left and each number a beat after the one before; with reduced motion they show the figure.
 */
function Numeral({ n, photo, delay = 0 }: { n: string; photo: string; delay?: number }) {
  const box = useRef<HTMLDivElement>(null), cols = useRef<(HTMLDivElement | null)[]>([]);
  const digits = n.split("").map(Number);
  useEffect(() => {
    if (reducedMotion()) return;
    const els = cols.current, ds = n.split("").map(Number);
    // each digit waits ROLL places short of its figure until the numeral is seen
    ds.forEach((d, k) => els[k] && gsap.set(els[k], { ...at(10 + d - ROLL), y: 0 }));
    // starts the moment the numbers come into view (no ease-in, no wait), then slows into place
    const off = onceInView(box.current!, "top 95%", () => ds.forEach((d, k) =>
      gsap.to(els[k], { ...at(10 + d), duration: 1.8, ease: "power2.out", delay: delay + k * 0.08 })));
    return () => { off(); els.forEach((c) => c && gsap.killTweensOf(c)); };
  }, [n, delay]);
  return (
    <div ref={box} data-no-blur className="relative w-full" style={{ aspectRatio: "890 / 580" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo} srcSet={srcSet(photo)} sizes="(min-width: 768px) 33vw, 100vw" alt="" className="absolute inset-[3px] h-[calc(100%-6px)] w-[calc(100%-6px)] object-cover" />
      <div aria-hidden className="absolute inset-0 flex bg-limestone-50 mix-blend-lighten">
        {digits.map((d, k) => (
          // clipped top and bottom only: a wide digit (the 4's bar) may run into its neighbour's half, still on the sheet
          <div key={k} className="relative h-full w-1/2 overflow-y-clip" style={{ containerType: "size" }}>
            <div ref={(el) => { cols.current[k] = el; }} className="absolute inset-x-0 top-0"
              style={{ height: `${10 * REPS * 100}%`, transform: `translateY(${(-(10 + d) * 100) / (10 * REPS)}%)` }}>
              {Array.from({ length: 10 * REPS }, (_, i) => (
                <span key={i} className="flex items-center justify-center font-bold text-black"
                  style={{ height: `${100 / (10 * REPS)}%`, fontFamily: "var(--font-haas)", fontSize: "123cqh", lineHeight: 1 }}>{i % 10}</span>))}
            </div>
          </div>))}
      </div>
      <span className="sr-only">{n}</span>
    </div>
  );
}
