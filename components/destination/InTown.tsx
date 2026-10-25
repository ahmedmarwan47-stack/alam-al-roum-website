"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import SectionTitle from "@/components/sections/SectionTitle";
import RevealText from "@/components/reveal/RevealText";
import { inTown as T } from "@/lib/destination";

/**
 * Transport · In town (Figma 11053:7173): one coin per mode. The coin stays on screen while three
 * 720 px scroll zones pass; the active mode is full strength, the others sit at 35 %, and the coin's
 * photo swaps (with a slow quarter turn) as each mode becomes active.
 */
export default function InTown() {
  const [active, setActive] = useState(0);
  const zones = useRef<(HTMLDivElement | null)[]>([]), coin = useRef<HTMLDivElement>(null), wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sts = zones.current.map((z, k) => ScrollTrigger.create({
      trigger: z, start: "top 55%", end: "bottom 55%", onToggle: (s) => { if (s.isActive) setActive(k); },
    }));
    const spin = reducedMotion() ? null : gsap.fromTo(coin.current, { rotate: 4 }, {
      rotate: -14, ease: "none", scrollTrigger: { trigger: wrap.current, start: "top bottom", end: "bottom top", scrub: 1 },
    });
    return () => { sts.forEach((s) => s.kill()); spin?.scrollTrigger?.kill(); spin?.kill(); };
  }, []);
  const mask = { WebkitMaskImage: `url(${T.mask})`, maskImage: `url(${T.mask})`, WebkitMaskSize: "93.4% 92.5%", maskSize: "93.4% 92.5%",
    WebkitMaskPosition: "center", maskPosition: "center", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat" } as const;
  return (
    <section className="flex flex-col items-center gap-20 bg-limestone-50 py-[120px] container-x">
      <SectionTitle tag={T.tag} title={T.title} body={T.body} className="max-w-[900px]" />
      <div ref={wrap} className="relative grid w-full max-w-[1392px] gap-10 lg:grid-cols-[656px_1fr] lg:gap-20">
        <div className="lg:h-full">
          <div className="sticky top-[calc(50vh-328px)] mx-auto aspect-square w-full max-w-[656px]">
            <div ref={coin} className="relative h-full w-full" style={mask}>
              {T.modes.map((m, k) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={m.photo} src={m.photo} alt="" className="absolute inset-0 h-full w-full object-cover transition-[opacity,scale] duration-700 [transition-timing-function:var(--ease-site)]"
                  style={{ opacity: k === active ? 1 : 0, scale: k === active ? "1" : "1.08" }} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          {T.modes.map((m, k) => {
            const on = k === active;
            return (
              <div key={m.title} ref={(el) => { zones.current[k] = el; }}
                className={`flex flex-col justify-center gap-3 py-10 transition-opacity duration-500 lg:h-[720px] lg:py-0 ${k ? "border-t border-limestone-300" : ""} ${on ? "opacity-100" : "lg:opacity-35"}`}>
                <span className={`t-label l-16 transition-opacity duration-500 ${on ? "opacity-100" : "lg:opacity-0"}`}>{m.tag}</span>
                <RevealText as="h3" text={m.title} className="t-heading hd-40" />
                <p className={`max-w-[560px] t-body b-16 text-limestone-800 transition-opacity duration-500 ${on ? "opacity-100" : "lg:opacity-0"}`}>{m.body}</p>
              </div>);
          })}
        </div>
      </div>
    </section>
  );
}
