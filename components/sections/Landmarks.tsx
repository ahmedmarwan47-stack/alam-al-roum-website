"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import RevealText from "@/components/reveal/RevealText";
import RevealMask from "@/components/reveal/RevealMask";
import { landmarks } from "@/lib/content";

export type LandmarksData = { title: string; body: string; rows: { title: string; body: string; large: string; inset: string }[] };

/**
 * UI / Landmarks (Residence Types style, Figma 10979:15280): the list is driven by the scroll — the section pins and
 * each row takes its turn as you scroll (about 60 % of a screen per row); the active row turns dark while the large
 * photo wipes up and the inset wipes down (1 s, cubic .165,.84,.44,1). Clicking a row scrolls to its turn.
 * Used on Home, Destination, Sustainability (commitments), the neighbourhoods (facilities) and the experiences.
 */
export default function Landmarks({ data = landmarks }: { data?: LandmarksData }) {
  const L = data;
  const [a, setA] = useState(0); const prev = useRef(0);
  const pin = useRef<HTMLDivElement>(null), st = useRef<ScrollTrigger | null>(null);
  const n = L.rows.length;
  useEffect(() => {
    if (reducedMotion() || !window.matchMedia("(min-width: 1024px)").matches) return;
    st.current = ScrollTrigger.create({ trigger: pin.current, start: "top top", end: () => `+=${window.innerHeight * 0.6 * n}`, pin: true,
      onUpdate: (self) => setA(Math.min(n - 1, Math.floor(self.progress * n))) });
    return () => { st.current?.kill(); st.current = null; };
  }, [n]);
  // a click scrolls to the middle of that row's turn (or, without the pin, simply selects it)
  const go = (k: number) => {
    const t = st.current;
    if (!t) return setA(k);
    window.scrollTo({ top: t.start + ((k + 0.5) / n) * (t.end - t.start), behavior: "smooth" });
  };
  const big = useRef<(HTMLDivElement | null)[]>([]), ins = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    if (prev.current === a) return;
    big.current.forEach((el, k) => gsap.set(el, { zIndex: k === a ? 2 : k === prev.current ? 1 : 0 }));
    ins.current.forEach((el, k) => gsap.set(el, { zIndex: k === a ? 2 : k === prev.current ? 1 : 0 }));
    gsap.fromTo(big.current[a], { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "slideWipe" });
    gsap.fromTo(ins.current[a], { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "slideWipe", delay: 0.08 });
    prev.current = a;
  }, [a]);
  return (
    <section className="bg-limestone-50">
    <div ref={pin} className="flex flex-col bg-limestone-50 lg:h-svh lg:max-h-[1024px] lg:flex-row">
      <div className="flex flex-col justify-center gap-[60px] py-20 pl-[var(--gutter)] pr-[var(--gutter)] lg:w-1/2 lg:pr-24">
        <div className="flex flex-col gap-2">
          <RevealText as="h2" text={L.title} className="t-heading hd-40" />
          <RevealText text={L.body} className="t-body b-16 max-w-[460px] text-deepsea-500/70" delay={0.08} />
        </div>
        <div className="flex flex-col">
          {L.rows.map((r, k) => {
            const on = k === a;
            return (
              <button key={r.title} onClick={() => go(k)}
                className={`flex items-center gap-10 border-b p-6 text-left transition-colors duration-500 ${on ? "border-deepsea-500 bg-deepsea-500 text-limestone-50" : "border-limestone-600"}`}>
                <span className={`t-label l-12 ${on ? "text-deepsea-200" : ""}`}>({String(k + 1).padStart(2, "0")})</span>
                <span className="flex flex-1 flex-col gap-2">
                  <RevealText text={r.title} className="t-heading hd-24" />
                  <span className={`t-body b-14 ${on ? "text-deepsea-200" : "text-deepsea-500/60"}`}>{r.body}</span>
                </span>
              </button>);
          })}
        </div>
      </div>
      <RevealMask className="relative h-[70vh] lg:h-auto lg:w-1/2">
        <div className="absolute inset-0">
          {L.rows.map((r, k) => (
            <div key={r.large} ref={(el) => { big.current[k] = el; }} className="absolute inset-0" style={{ zIndex: k === 0 ? 2 : 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.large} alt="" className="h-full w-full object-cover" />
            </div>))}
          <div className="absolute left-[23.5%] top-[26.6%] z-10 h-[46.9%] w-[52.9%]">
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
