"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import SectionTitle from "@/components/sections/SectionTitle";
import RevealText from "@/components/reveal/RevealText";
import { inTown as T } from "@/lib/destination";

/**
 * Transport · In town (Figma 11053:7173): one coin per mode. The coin stays on screen while three
 * 720 px scroll zones pass; the coin's photo swaps as each mode becomes active. The coin's edge turns slowly with the
 * scroll while its photo stays level (counter-rotated).
 * Every mode's tag, title and paragraph are always there to read: a mode turns active (full strength) as soon as
 * its zone is well into view, the others sit at 35 %, so nothing waits for the screen's centre to appear.
 */
export default function InTown() {
  const [active, setActive] = useState(0);
  const zones = useRef<(HTMLDivElement | null)[]>([]), coin = useRef<HTMLDivElement>(null), photos = useRef<HTMLDivElement>(null), wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // below lg the coin rides in a band at the top of the screen, so a mode turns active at the middle of what is
    // left under it (65 %) rather than 75 %; a function so a resize across lg re-reads it on refresh
    const line = () => (window.matchMedia("(min-width: 1024px)").matches ? "75%" : "65%");
    const sts = zones.current.map((z, k) => ScrollTrigger.create({
      trigger: z, start: () => `top ${line()}`, end: () => `bottom ${line()}`, onToggle: (s) => { if (s.isActive) setActive(k); },
    }));
    // the coin (its mask, so its edge) turns with the scroll; the photos inside turn the other way by the same amount on
    // the same timeline, so the picture stays level at every moment and only the coin's edge appears to rotate
    const spin = reducedMotion() ? null : gsap.timeline({ scrollTrigger: { trigger: wrap.current, start: "top bottom", end: "bottom top", scrub: 1 } })
      .fromTo(coin.current, { rotate: 4 }, { rotate: -14, ease: "none" }, 0)
      .fromTo(photos.current, { rotate: -4 }, { rotate: 14, ease: "none" }, 0);
    return () => { sts.forEach((s) => s.kill()); spin?.scrollTrigger?.kill(); spin?.kill(); };
  }, []);
  const mask = { WebkitMaskImage: `url(${T.mask})`, maskImage: `url(${T.mask})`, WebkitMaskSize: "93.4% 92.5%", maskSize: "93.4% 92.5%",
    WebkitMaskPosition: "center", maskPosition: "center", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat" } as const;
  return (
    <section className="flex flex-col items-center gap-20 overflow-x-clip bg-limestone-50 py-[120px] container-x">
      <SectionTitle tag={T.tag} title={T.title} body={T.body} className="max-w-[900px]" />
      <div ref={wrap} className="relative grid w-full max-w-[1392px] gap-10 lg:grid-cols-[656px_1fr] lg:gap-20">
        {/* below lg (one column) the coin sits in a band stuck to the top of the screen while the three modes scroll
            up under it, so each photo swap happens in view; a short fade softens the band's lower edge */}
        <div className="max-lg:sticky max-lg:top-0 max-lg:z-10 max-lg:bg-limestone-50 max-lg:py-4 max-lg:after:pointer-events-none max-lg:after:absolute max-lg:after:inset-x-0 max-lg:after:top-full max-lg:after:h-8 max-lg:after:bg-gradient-to-b max-lg:after:from-limestone-50 max-lg:after:to-transparent lg:h-full">
          <div className="mx-auto aspect-square w-full max-w-[656px] max-lg:w-[min(58vw,36svh,320px)] lg:sticky lg:top-[calc(50vh-328px)]">
            <div ref={coin} className="relative h-full w-full" style={mask}>
              <div ref={photos} className="absolute inset-0">
                {T.modes.map((m, k) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={m.photo} src={m.photo} alt="" className="absolute inset-0 h-full w-full object-cover transition-[opacity,scale] duration-700 [transition-timing-function:var(--ease-site)]"
                    style={{ opacity: k === active ? 1 : 0, scale: k === active ? "1" : "1.08" }} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          {T.modes.map((m, k) => {
            const on = k === active;
            return (
              <div key={m.title} ref={(el) => { zones.current[k] = el; }}
                className={`flex flex-col justify-center gap-3 py-10 transition-opacity duration-500 lg:h-[720px] lg:py-0 ${k ? "border-t border-limestone-300" : ""} ${on ? "opacity-100" : "lg:opacity-35"}`}>
                <span className="t-label l-16">{m.tag}</span>
                <RevealText as="h3" text={m.title} className="t-heading hd-40" />
                <p className="max-w-[560px] t-body b-16 text-limestone-800">{m.body}</p>
              </div>);
          })}
        </div>
      </div>
    </section>
  );
}
