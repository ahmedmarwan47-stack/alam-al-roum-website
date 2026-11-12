"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import Icon from "@/components/ui/Icon";
import RevealText from "@/components/reveal/RevealText";
import RevealMask from "@/components/reveal/RevealMask";
import { landmarks } from "@/lib/content";
import { srcSet } from "@/lib/img";

export type LandmarksData = { title: string; body: string; rows: { title: string; body: string; large: string; inset: string }[] };

/**
 * UI / Landmarks (Residence Types style, Figma 10979:15280; pattern from Ayana Residences' "Residence Types").
 * Desktop: hovering a row (after a 140 ms pause) or clicking it makes it active — it turns dark while its photo wipes up
 * over the whole right column (1 s, cubic .165,.84,.44,1; one full photo, no blur or inset since the 12 Nov review).
 * The section scrolls like any other, so the page never feels held.
 * Below lg the photo column goes, as on Ayana: the rows are an accordion, the first open, and tapping a row opens its
 * photo and closes the one that was open (one at a time; tapping the open row closes it).
 * Used on Home, Destination, Sustainability (commitments), the neighbourhoods (facilities) and the experiences.
 */
export default function Landmarks({ data = landmarks }: { data?: LandmarksData }) {
  const L = data;
  const [a, setA] = useState(0); const prev = useRef(0);
  // phones and tablets: one row open at a time, the first one from the start
  const [open, setOpen] = useState(0); const opened = useRef(0);
  const big = useRef<(HTMLDivElement | null)[]>([]);
  const panel = useRef<(HTMLImageElement | null)[]>([]);
  // desktop (10 Nov review): resting the mouse on a row switches it, after a short pause so a pointer passing over
  // the rows on its way elsewhere doesn't fire a wipe for each one; a click (and the keyboard) still switches at once
  const intent = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hoverRow = (k: number) => { clearTimeout(intent.current); intent.current = setTimeout(() => setA(k), 140); };
  const leaveRow = () => clearTimeout(intent.current);
  useEffect(() => () => clearTimeout(intent.current), []);
  useEffect(() => {
    if (prev.current === a) return;
    big.current.forEach((el, k) => gsap.set(el, { zIndex: k === a ? 2 : k === prev.current ? 1 : 0 }));
    gsap.fromTo(big.current[a], { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "slideWipe" });
    prev.current = a;
  }, [a]);
  // the opened photo rises in from the bottom, settling from a slight zoom, while its row unfolds (not for the row
  // that is open from the start: its photo is simply there)
  useEffect(() => {
    if (opened.current === open) return; opened.current = open;
    const img = panel.current[open];
    if (img) gsap.fromTo(img, { clipPath: "inset(100% 0% 0% 0%)", scale: 1.08 }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 0.9, ease: "slideWipe" });
  }, [open]);
  return (
    <section className="bg-limestone-50">
    {/* desktop: one screen tall (12 Nov review: it ran taller than the viewport at 1024 px), at most Figma's 1024; the
        padding, the gap and the rows tighten with the screen height so the copy fits, and it only grows if it can't */}
    <div className="flex flex-col bg-limestone-50 lg:min-h-[min(100svh,1024px)] lg:flex-row">
      <div className="flex flex-col justify-center gap-10 py-16 pl-[var(--gutter)] pr-[var(--gutter)] lg:w-1/2 lg:gap-[clamp(24px,4.5svh,60px)] lg:py-[clamp(40px,7svh,80px)] lg:pr-24">
        <div className="flex flex-col gap-2">
          <RevealText as="h2" text={L.title} className="t-heading hd-40" />
          <RevealText text={L.body} className="t-body b-16 max-w-[460px] text-deepsea-500/70" delay={0.08} />
        </div>
        {/* desktop: click to switch the photos */}
        <div className="hidden flex-col lg:flex">
          {L.rows.map((r, k) => {
            const on = k === a;
            return (
              <button key={r.title} onClick={() => { clearTimeout(intent.current); setA(k); }} onMouseEnter={() => hoverRow(k)} onMouseLeave={leaveRow} aria-pressed={on}
                className={`flex items-center gap-10 px-6 py-[clamp(12px,2.2svh,24px)] text-left [&:not(:last-child)]:border-b transition-colors duration-500 ${on ? "border-deepsea-500 bg-deepsea-500 text-limestone-50" : "border-limestone-600 hover:bg-limestone-100"}`}>
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
                      <img ref={(el) => { panel.current[k] = el; }} src={r.large} srcSet={srcSet(r.large)} alt={r.title} loading="lazy" className="h-full w-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>);
          })}
        </div>
      </div>
      <RevealMask className="relative hidden lg:block lg:w-1/2">
        <div className="absolute inset-0">
          {/* 12 Nov review ("full image without the effect"): the row's photo fills the column, with no blurred
              backdrop and no floating, shadowed inset */}
          {L.rows.map((r, k) => (
            <div key={r.title} ref={(el) => { big.current[k] = el; }} className="absolute inset-0 overflow-hidden" style={{ zIndex: k === 0 ? 2 : 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.inset} srcSet={srcSet(r.inset)} alt="" className="h-full w-full object-cover" />
            </div>))}
        </div>
      </RevealMask>
    </div>
    </section>
  );
}
