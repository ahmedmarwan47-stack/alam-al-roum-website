"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import Icon from "@/components/ui/Icon";
import RevealText from "@/components/reveal/RevealText";
import RevealMask from "@/components/reveal/RevealMask";
import { landmarks } from "@/lib/content";

export type LandmarksData = { title: string; body: string; rows: { title: string; body: string; large: string; inset: string }[] };

/**
 * UI / Landmarks (Residence Types style, Figma 10979:15280; pattern from Ayana Residences' "Residence Types").
 * Desktop: clicking a row makes it active — it turns dark while the backdrop wipes up and the inset wipes down
 * (1 s, cubic .165,.84,.44,1). The inset is the row's photo, large (66 % × 68 % of the column); the backdrop behind it
 * is the same photo, softly blurred. The section scrolls like any other, so the page never feels held.
 * Below lg the photo column goes, as on Ayana: the rows are an accordion, all closed, and tapping one opens its photo.
 * Used on Home, Destination, Sustainability (commitments), the neighbourhoods (facilities) and the experiences.
 */
export default function Landmarks({ data = landmarks }: { data?: LandmarksData }) {
  const L = data;
  const [a, setA] = useState(0); const prev = useRef(0);
  const [open, setOpen] = useState(-1);
  const big = useRef<(HTMLDivElement | null)[]>([]), ins = useRef<(HTMLDivElement | null)[]>([]);
  const panel = useRef<(HTMLImageElement | null)[]>([]);
  useEffect(() => {
    if (prev.current === a) return;
    big.current.forEach((el, k) => gsap.set(el, { zIndex: k === a ? 2 : k === prev.current ? 1 : 0 }));
    ins.current.forEach((el, k) => gsap.set(el, { zIndex: k === a ? 2 : k === prev.current ? 1 : 0 }));
    gsap.fromTo(big.current[a], { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "slideWipe" });
    gsap.fromTo(ins.current[a], { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "slideWipe", delay: 0.08 });
    prev.current = a;
  }, [a]);
  // the opened photo rises in from the bottom, settling from a slight zoom, while its row unfolds
  useEffect(() => {
    const img = panel.current[open];
    if (img) gsap.fromTo(img, { clipPath: "inset(100% 0% 0% 0%)", scale: 1.08 }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 0.9, ease: "slideWipe" });
  }, [open]);
  return (
    <section className="bg-limestone-50">
    <div className="flex flex-col bg-limestone-50 lg:h-svh lg:max-h-[1024px] lg:flex-row">
      <div className="flex flex-col justify-center gap-10 py-16 pl-[var(--gutter)] pr-[var(--gutter)] lg:w-1/2 lg:gap-[60px] lg:py-20 lg:pr-24">
        <div className="flex flex-col gap-2">
          <RevealText as="h2" text={L.title} className="t-heading hd-40" />
          <RevealText text={L.body} className="t-body b-16 max-w-[460px] text-deepsea-500/70" delay={0.08} />
        </div>
        {/* desktop: click to switch the photos */}
        <div className="hidden flex-col lg:flex">
          {L.rows.map((r, k) => {
            const on = k === a;
            return (
              <button key={r.title} onClick={() => setA(k)} aria-pressed={on}
                className={`flex items-center gap-10 p-6 text-left [&:not(:last-child)]:border-b transition-colors duration-500 ${on ? "border-deepsea-500 bg-deepsea-500 text-limestone-50" : "border-limestone-600 hover:bg-limestone-100"}`}>
                <span className={`t-label l-12 ${on ? "text-deepsea-200" : ""}`}>({String(k + 1).padStart(2, "0")})</span>
                <span className="flex flex-1 flex-col gap-2">
                  <RevealText text={r.title} className="t-heading hd-24" />
                  <span className={`t-body b-14 ${on ? "text-deepsea-200" : "text-deepsea-500/60"}`}>{r.body}</span>
                </span>
              </button>);
          })}
        </div>
        {/* phones and tablets: an accordion, each row opens onto its photo (rules only between the rows) */}
        <div className="flex flex-col divide-y divide-limestone-600 lg:hidden">
          {L.rows.map((r, k) => {
            const on = k === open;
            return (
              <div key={r.title}>
                <button onClick={() => setOpen(on ? -1 : k)} aria-expanded={on} className="flex w-full items-start gap-5 py-5 text-left">
                  <span className="t-label l-12 pt-1.5">({String(k + 1).padStart(2, "0")})</span>
                  <span className="flex flex-1 flex-col gap-1.5">
                    <RevealText text={r.title} className="t-heading hd-24" />
                    <span className="t-body b-14 text-deepsea-500/60">{r.body}</span>
                  </span>
                  <Icon name="arrow-down-01-sharp" size={20} className={`mt-1 flex-none transition-transform duration-[350ms] [transition-timing-function:var(--ease-fig-inout)] ${on ? "rotate-180" : ""}`} />
                </button>
                <div className="grid transition-[grid-template-rows] duration-[450ms] [transition-timing-function:var(--ease-fig-inout)]" style={{ gridTemplateRows: on ? "1fr" : "0fr" }}>
                  <div className="overflow-hidden">
                    <div className="mb-6 aspect-[4/3] overflow-hidden sm:aspect-[16/10]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img ref={(el) => { panel.current[k] = el; }} src={r.large} alt={r.title} loading="lazy" className="h-full w-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>);
          })}
        </div>
      </div>
      <RevealMask className="relative hidden lg:block lg:w-1/2">
        <div className="absolute inset-0">
          {/* the backdrop is the inset's own photo, softly blurred (scaled up so the blur never shows a pale edge) */}
          {L.rows.map((r, k) => (
            <div key={r.title} ref={(el) => { big.current[k] = el; }} className="absolute inset-0 overflow-hidden" style={{ zIndex: k === 0 ? 2 : 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.inset} alt="" className="h-full w-full scale-[1.08] object-cover blur-[12px] will-change-transform" />
            </div>))}
          <div className="absolute left-[17%] top-[16%] z-10 h-[68%] w-[66%] shadow-[0_30px_80px_rgb(1_15_26/.28)]">
            {L.rows.map((r, k) => (
              <div key={r.inset} ref={(el) => { ins.current[k] = el; }} className="absolute inset-0" style={{ zIndex: k === 0 ? 2 : 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.inset} alt="" className="h-full w-full object-cover" />
              </div>))}
          </div>
        </div>
      </RevealMask>
    </div>
    </section>
  );
}
