"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import Icon from "@/components/ui/Icon";
import RevealText from "@/components/reveal/RevealText";
import RevealMask from "@/components/reveal/RevealMask";
import { landmarks } from "@/lib/content";

export type LandmarksData = { title: string; body: string; rows: { title: string; body: string; large: string; inset: string }[] };

/** Ayana-style list, click-triggered like the Figma prototype: the active row turns dark; the large photo wipes up while the inset wipes down (1 s, cubic .165,.84,.44,1). */
export default function Landmarks({ data = landmarks }: { data?: LandmarksData }) {
  const L = data;
  const [a, setA] = useState(0); const prev = useRef(0);
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
    <section className="flex flex-col bg-limestone-50 lg:h-[1024px] lg:flex-row">
      <div className="flex flex-col justify-center gap-[60px] py-20 pl-[var(--gutter)] pr-[var(--gutter)] lg:w-1/2 lg:pr-24">
        <div className="flex flex-col gap-2">
          <RevealText as="h2" text={L.title} className="t-heading hd-40" />
          <RevealText text={L.body} className="t-body b-16 max-w-[460px] text-limestone-800" delay={0.08} />
        </div>
        <div className="flex flex-col">
          {L.rows.map((r, k) => {
            const on = k === a;
            return (
              <button key={r.title} onClick={() => setA(k)}
                className={`flex items-center gap-6 border-b px-6 py-6 text-left transition-colors duration-500 ${on ? "border-deepsea-500 bg-deepsea-500 text-limestone-50" : "border-limestone-600"}`}>
                <span className={`t-label l-12 ${on ? "text-deepsea-200" : ""}`}>({String(k + 1).padStart(2, "0")})</span>
                <span className="flex flex-1 flex-col gap-1">
                  <RevealText text={r.title} className="t-heading hd-24" />
                  <span className={`t-body b-14 ${on ? "text-deepsea-200" : "text-limestone-800"}`}>{r.body}</span>
                </span>
                <Icon name="arrow-right-01-sharp" size={18} className={`transition-transform duration-500 ${on ? "translate-x-0" : "-translate-x-2 opacity-0"}`} />
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
    </section>
  );
}
