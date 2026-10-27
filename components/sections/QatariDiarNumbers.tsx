"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";

const STATS = [
  { n: "20", title: ["20 Years", "of building"], body: "Two decades of landmark destinations, built across five continents and backed by the Qatar Investment Authority.", cta: "About Qatari Diar", photo: "/images/photo/ui-expcenter-day.jpg" },
  { n: "42", title: ["42 Investment", "projects"], body: "Cities, districts and resorts delivered or underway, from Lusail to the Mediterranean shore of Alam Al Roum.", cta: "Our projects", photo: "/images/photo/ui-pm-visit.jpg" },
  { n: "35", title: ["$35Bn Global", "portfolio"], body: "A portfolio exceeding USD 35 billion, with over two decades of investment in Egypt.", cta: "Investment in Egypt", photo: "/images/photo/ui-g-coast.jpg" },
];
const REPS = 3;                  // each column holds 0–9 three times, so a roll can spin past the target
const JUMP = 3;                  // Möbius spins each digit ~3 places before it settles

/**
 * Below lg, as Möbius does on a phone: no pinned stage, the three stats stacked, each numeral above its copy.
 * The digits are the same photo-through-numerals, and spin into place (the same ~3-place roll) once, as the stat
 * comes into view. The photo fills the frame edge to edge, so a digit passing the edge never shows black.
 */
function StackedStat({ x }: { x: (typeof STATS)[number] }) {
  const root = useRef<HTMLDivElement>(null), cols = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const at = (i: number) => ({ yPercent: (-i * 100) / (10 * REPS) });
    const ds = x.n.split("").map((d) => 10 + Number(d));
    if (reducedMotion()) { ds.forEach((to, k) => gsap.set(cols.current[k], at(to))); return; }
    ds.forEach((to, k) => gsap.set(cols.current[k], at(k === 0 ? to + JUMP : to - JUMP)));
    const st = ScrollTrigger.create({ trigger: root.current, start: "top 85%", once: true,
      onEnter: () => ds.forEach((to, k) => gsap.to(cols.current[k], { ...at(to), duration: 1.6, ease: "power3.out", overwrite: true })) });
    return () => st.kill();
  }, [x.n]);
  return (
    <div ref={root} className="flex flex-col gap-6">
      <div className="relative w-full max-w-[620px]" style={{ aspectRatio: "890 / 580" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={x.photo} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 flex justify-between bg-limestone-50 mix-blend-lighten">
          {x.n.split("").map((_, k) => (
            <div key={k} className="relative h-full w-1/2 overflow-hidden" style={{ containerType: "size" }}>
              <div ref={(el) => { cols.current[k] = el; }} className="absolute inset-x-0 top-0" style={{ height: `${10 * REPS * 100}%` }}>
                {Array.from({ length: 10 * REPS }, (_, d) => (
                  <span key={d} aria-hidden className="flex items-center justify-center font-bold text-black"
                    style={{ height: `${100 / (10 * REPS)}%`, fontFamily: "var(--font-haas)", fontSize: "123cqh", lineHeight: 1 }}>{d % 10}</span>))}
              </div>
            </div>))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="t-heading hd-48 text-deepsea-500">{x.title.map((l) => <span key={l} className="block">{l}</span>)}</h2>
        <p className="max-w-[405px] t-body b-18 text-limestone-800">{x.body}</p>
      </div>
    </div>
  );
}

/**
 * Qatari Diar in numbers. One sticky stage, a viewport of scroll per stat. Left: exactly the Figma copy block
 * (UI / Qatari Diar · Numbers: Qatari Diar logo 80, Heading/48 title, Body/18 body, centred vertically at x 60),
 * the stat's title and body swapping in place. Right: the Möbius numerals — a giant two-digit number filling the
 * 890 × 580 Numerals frame; when the stat changes both digits spin ~3 places (left down, right up) and settle over 1.6 s
 * (power3.out), with the photo showing through the digits (Limestone sheet + mix-blend-lighten).
 */
export default function QatariDiarNumbers() {
  const [s, setS] = useState(0); const prev = useRef(0);
  const root = useRef<HTMLElement>(null), cols = useRef<(HTMLDivElement | null)[]>([]);
  // position = index into the repeated column; the middle copy holds the resting digits
  const idx = (d: string) => 10 + Number(d);
  useEffect(() => {   // GSAP owns the column transforms from the start
    STATS[0].n.split("").forEach((d, k) => gsap.set(cols.current[k], { yPercent: (-idx(d) * 100) / (10 * REPS) }));
    // the active stat = which third of the section's scroll we're in
    const pick = (p: number) => setS(Math.min(STATS.length - 1, Math.max(0, Math.floor(p * STATS.length))));
    // the pinned stage is desktop only (below lg the stats are stacked and scroll like any other content)
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const st = ScrollTrigger.create({ trigger: root.current, start: "top top", end: "bottom bottom", onUpdate: (t) => pick(t.progress), onRefresh: (t) => pick(t.progress) });
      return () => st.kill();
    });
    return () => mm.revert();
  }, []);
  useEffect(() => {
    if (prev.current === s) return; prev.current = s;
    STATS[s].n.split("").forEach((d, k) => {
      const c = cols.current[k]; if (!c) return; const to = idx(d);
      if (reducedMotion()) { gsap.set(c, { yPercent: (-to * 100) / (10 * REPS) }); return; }
      const from = k === 0 ? to + JUMP : to - JUMP;   // left digit rolls down into place, right digit rolls up
      gsap.fromTo(c, { yPercent: (-from * 100) / (10 * REPS) }, { yPercent: (-to * 100) / (10 * REPS), duration: 1.6, ease: "power3.out", overwrite: true });
    });
  }, [s]);
  return (
    <section ref={root} data-no-blur className="relative bg-limestone-50 lg:h-[var(--qd-h)]" style={{ "--qd-h": `${STATS.length * 100}svh` } as CSSProperties}>
      {/* below lg: the stats stacked, nothing pinned */}
      <div className="flex flex-col gap-16 py-20 container-x lg:hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/qatari-diar.png" alt="Qatari Diar" width={80} height={80} className="-mb-6 h-14 w-14" />
        {STATS.map((x) => <StackedStat key={x.n} x={x} />)}
      </div>
      <div className="sticky top-0 hidden h-svh flex-col justify-center gap-10 container-x lg:flex lg:flex-row lg:items-center lg:justify-start lg:gap-0">
        {/* Figma "Copy" block: logo 80, 24 gap, Heading/48 (440 wide), 24 gap, Body/18 (≈405 wide) */}
        <div className="relative z-10 w-full max-w-[440px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/qatari-diar.png" alt="Qatari Diar" width={80} height={80} className="mb-6 h-14 w-14 lg:h-20 lg:w-20" />
          <div className="grid">
            {STATS.map((x, k) => (
              <div key={x.n} aria-hidden={k !== s} className="col-start-1 row-start-1 flex flex-col gap-6">
                <h2 className="overflow-hidden t-heading hd-48 text-deepsea-500">
                  {x.title.map((l, j) => (
                    <span key={l} className="block transition-[transform,opacity] duration-700 [transition-timing-function:var(--ease-site)]"
                      style={{ transform: k === s ? "translateY(0)" : `translateY(${k < s ? -105 : 105}%)`, opacity: k === s ? 1 : 0, transitionDelay: k === s ? `${j * 70}ms` : "0ms" }}>{l}</span>))}
                </h2>
                <p className="max-w-[405px] t-body b-18 text-limestone-800 transition-[transform,opacity] duration-700 [transition-timing-function:var(--ease-site)]"
                  style={{ transform: k === s ? "translateY(0)" : "translateY(16px)", opacity: k === s ? 1 : 0, transitionDelay: k === s ? "160ms" : "0ms" }}>{x.body}</p>
              </div>))}
          </div>
        </div>
        <div className="pointer-events-none w-full max-w-[620px] lg:absolute lg:inset-y-0 lg:right-[var(--gutter)] lg:flex lg:w-[min(58.9vw,890px)] lg:max-w-none lg:items-center">
          <div className="flex w-full items-center justify-end">
            <div className="relative w-full" style={{ aspectRatio: "890 / 580" }}>
              {STATS.map((x, k) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={x.photo} src={x.photo} alt="" className="absolute inset-[3px] h-[calc(100%-6px)] w-[calc(100%-6px)] object-cover transition-opacity duration-700" style={{ opacity: k === s ? 1 : 0 }} />))}
              {/* Limestone sheet with black digits; lighten keeps the photo only where the digits are */}
              <div className="absolute inset-0 flex justify-between bg-limestone-50 mix-blend-lighten">
                {[0, 1].map((k) => (
                  <div key={k} className="relative h-full w-1/2 overflow-hidden" style={{ containerType: "size" }}>
                    <div ref={(el) => { cols.current[k] = el; }} className="absolute inset-x-0 top-0"
                      style={{ height: `${10 * REPS * 100}%` }}>
                      {Array.from({ length: 10 * REPS }, (_, d) => (
                        <span key={d} className="flex items-center justify-center font-bold text-black"
                          style={{ height: `${100 / (10 * REPS)}%`, fontFamily: "var(--font-haas)", fontSize: "123cqh", lineHeight: 1 }}>{d % 10}</span>))}
                    </div>
                  </div>))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
