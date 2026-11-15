"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import { srcSet } from "@/lib/img";
import { onceInView } from "@/components/reveal/letters";

const STATS = [
  { n: "20", title: ["20 Years", "of building"], body: "Two decades of landmark destinations, built across five continents and backed by the Qatar Investment Authority.", cta: "About Qatari Diar", photo: "/images/photo/ui-expcenter-day.webp" },
  { n: "42", title: ["42 Investment", "projects"], body: "Cities, districts and resorts delivered or underway, from Lusail to the Mediterranean shore of Alam Al Roum.", cta: "Our projects", photo: "/images/photo/ui-pm-visit.webp" },
  { n: "35", title: ["$35Bn Global", "portfolio"], body: "A portfolio exceeding USD 35 billion, with over two decades of investment in Egypt.", cta: "Investment in Egypt", photo: "/images/photo/ui-g-coast.webp" },
];
const REPS = 3;                  // each column holds 0–9 three times, so a roll can spin past the target
const JUMP = 3;                  // Möbius spins each digit ~3 places before it settles

/**
 * Qatari Diar in numbers. One sticky stage, a viewport of scroll per stat. Left: exactly the Figma copy block
 * (UI / Qatari Diar · Numbers: Qatari Diar logo 80, Heading/48 title, Body/18 body, centred vertically at x 60),
 * the stat's title and body swapping in place. Right: the Möbius numerals — a giant two-digit number filling the
 * 890 × 580 Numerals frame; when the stat changes both digits spin ~3 places (left down, right up) and settle over 1.6 s
 * (power3.out), with the photo showing through the digits (Limestone sheet + mix-blend-lighten).
 * Phones and tablets get the same pinned stage and the same three beats, stacked: the copy, then the numerals under it.
 */
export default function QatariDiarNumbers() {
  const [s, setS] = useState(0); const prev = useRef(0);
  // the first stat's copy blurs in as the section arrives, like all text (15 Nov); until then every stat is "off"
  const [shown, setShown] = useState(false);
  const root = useRef<HTMLElement>(null), cols = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => onceInView(root.current!, "top 85%", () => setShown(true)), []);
  // position = index into the repeated column; the middle copy holds the resting digits
  const idx = (d: string) => 10 + Number(d);
  useEffect(() => {   // GSAP owns the column transforms from the start
    STATS[0].n.split("").forEach((d, k) => gsap.set(cols.current[k], { yPercent: (-idx(d) * 100) / (10 * REPS) }));
    // the active stat = which third of the section's scroll we're in
    const pick = (p: number) => setS(Math.min(STATS.length - 1, Math.max(0, Math.floor(p * STATS.length))));
    const st = ScrollTrigger.create({ trigger: root.current, start: "top top", end: "bottom bottom", onUpdate: (t) => pick(t.progress), onRefresh: (t) => pick(t.progress) });
    return () => st.kill();
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
    <section ref={root} data-no-blur className="relative h-[var(--qd-h)] bg-limestone-50" style={{ "--qd-h": `${STATS.length * 100}svh` } as CSSProperties}>
      <div className="sticky top-0 flex h-svh flex-col justify-center gap-10 container-x lg:flex-row lg:items-center lg:justify-start lg:gap-0">
        {/* Figma "Copy" block: logo 80, 24 gap, Heading/48 (440 wide), 24 gap, Body/18 (≈405 wide) */}
        <div className="relative z-10 w-full max-w-[440px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/qatari-diar.png" alt="Qatari Diar" width={80} height={80} className="mb-6 h-14 w-14 lg:h-20 lg:w-20" />
          <div className="grid">
            {STATS.map((x, k) => (
              <div key={x.n} aria-hidden={k !== s} className="col-start-1 row-start-1 flex flex-col gap-6">
                {/* the site's one text motion (15 Nov): the copy blurs out and the next blurs in, no line slides */}
                <h2 className="t-swap t-heading hd-48 text-deepsea-500" data-off={!shown || k !== s || undefined}
                  style={{ transitionDelay: k === s ? "120ms" : "0ms" }}>
                  {x.title.map((l) => <span key={l} className="block">{l}</span>)}
                </h2>
                <p className="t-swap max-w-[405px] t-body b-18 text-limestone-800" data-off={!shown || k !== s || undefined}
                  style={{ transitionDelay: k === s ? "240ms" : "0ms" }}>{x.body}</p>
              </div>))}
          </div>
        </div>
        <div className="pointer-events-none w-full max-w-[620px] lg:absolute lg:inset-y-0 lg:right-[var(--gutter)] lg:flex lg:w-[min(58.9vw,890px)] lg:max-w-none lg:items-center">
          <div className="flex w-full items-center justify-end">
            <div className="relative w-full" style={{ aspectRatio: "890 / 580" }}>
              {STATS.map((x, k) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={x.photo} src={x.photo} srcSet={srcSet(x.photo)} alt="" className="absolute inset-[3px] h-[calc(100%-6px)] w-[calc(100%-6px)] object-cover transition-opacity duration-700" style={{ opacity: k === s ? 1 : 0 }} />))}
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
