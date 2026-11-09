"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import SectionTitle from "@/components/sections/SectionTitle";
import RevealText from "@/components/reveal/RevealText";
import { inTown as T } from "@/lib/destination";
import { srcSet } from "@/lib/img";
import { MQ, matches } from "@/lib/breakpoints";

/**
 * Transport · In town (Figma 11053:7173): one coin per mode. The coin stays on screen while three
 * 720 px scroll zones pass; the coin's photo swaps as each mode becomes active. The coin's edge turns slowly with the
 * scroll while its photo stays level (counter-rotated).
 * Every mode's tag, title and paragraph are always there to read: a mode turns active (full strength) as soon as
 * its zone is well into view, the others sit at 35 %, so nothing waits for the screen's centre to appear (phones too,
 * 9 Nov, as on desktop).
 * Below lg (9 Nov) the coin and the text are one centred, pinned scene: the modes sit on top of one another under
 * the coin, and the scroll cross-fades them (the photo eases in from a slight zoom, the text blurs out upward and the
 * next one in), a fine scrubbed switch instead of a jump.
 */
export default function InTown() {
  const [active, setActive] = useState(0);
  const zones = useRef<(HTMLDivElement | null)[]>([]), coin = useRef<HTMLDivElement>(null), photos = useRef<HTMLDivElement>(null), wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const phone = !matches(MQ.lg);
    // desktop: each mode's 720 px zone turns it active as it passes 75 % of the screen
    const sts = phone ? [] : zones.current.map((z, k) => ScrollTrigger.create({
      trigger: z, start: "top 75%", end: "bottom 75%", onToggle: (s) => { if (s.isActive) setActive(k); },
    }));
    // below lg: pin the coin and the text together, centred, and scrub the switch between modes
    let scene: gsap.core.Timeline | undefined;
    if (phone && !reducedMotion()) {
      const imgs = [...photos.current!.querySelectorAll("img")], texts = zones.current.filter(Boolean) as HTMLDivElement[];
      gsap.set(imgs, { opacity: (k) => (k ? 0 : 1), scale: (k) => (k ? 1.08 : 1) });
      gsap.set(texts.slice(1), { opacity: 0, y: 16, filter: "blur(8px)" });
      scene = gsap.timeline({ defaults: { ease: "power1.inOut" },
        scrollTrigger: { trigger: wrap.current, start: "center center", end: `+=${(texts.length - 1) * 90 + 40}%`, pin: true,
          pinSpacing: true,   // explicit: the section is a flex column, where ScrollTrigger would otherwise leave it off
          scrub: 1, invalidateOnRefresh: true } });
      for (let k = 1; k < texts.length; k++) {
        const t = k - 0.5;   // each switch takes the middle half of its step, so every mode rests in view
        scene.to(imgs[k - 1], { opacity: 0, duration: 0.5 }, t)
          .fromTo(imgs[k], { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.5 }, t)
          .to(texts[k - 1], { opacity: 0, y: -16, filter: "blur(8px)", duration: 0.3 }, t)
          .to(texts[k], { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.3 }, t + 0.2);
      }
      scene.to({}, { duration: 0.4 });   // a short rest on the last mode before the pin lets go
    }
    // the coin (its mask, so its edge) turns with the scroll; the photos inside turn the other way by the same amount on
    // the same timeline, so the picture stays level at every moment and only the coin's edge appears to rotate
    const spin = reducedMotion() ? null : gsap.timeline({ scrollTrigger: { trigger: wrap.current, start: "top bottom", end: "bottom top", scrub: 1 } })
      .fromTo(coin.current, { rotate: 4 }, { rotate: -14, ease: "none" }, 0)
      .fromTo(photos.current, { rotate: -4 }, { rotate: 14, ease: "none" }, 0);
    return () => { sts.forEach((s) => s.kill()); scene?.scrollTrigger?.kill(); scene?.kill(); spin?.scrollTrigger?.kill(); spin?.kill(); };
  }, []);
  const mask = { WebkitMaskImage: `url(${T.mask})`, maskImage: `url(${T.mask})`, WebkitMaskSize: "93.4% 92.5%", maskSize: "93.4% 92.5%",
    WebkitMaskPosition: "center", maskPosition: "center", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat" } as const;
  return (
    <section className="flex flex-col items-center gap-20 overflow-x-clip bg-limestone-50 py-[120px] container-x">
      <SectionTitle tag={T.tag} title={T.title} body={T.body} className="max-w-[900px]" />
      <div ref={wrap} className="relative grid w-full max-w-[1392px] gap-10 lg:grid-cols-[min(656px,45%)_1fr] lg:gap-20">
        {/* below lg the coin sits centred above the text, the pair pinned in the middle of the screen */}
        <div className="lg:h-full">
          <div className="mx-auto aspect-square w-full max-w-[656px] max-lg:w-[min(58vw,36svh,320px)] lg:sticky lg:top-[calc(50vh-328px)]">
            <div ref={coin} className="relative h-full w-full" style={mask}>
              <div ref={photos} className="absolute inset-0">
                {T.modes.map((m, k) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={m.photo} src={m.photo} srcSet={srcSet(m.photo)} alt="" className="absolute inset-0 h-full w-full object-cover transition-[opacity,scale] duration-700 [transition-timing-function:var(--ease-site)]"
                    style={{ opacity: k === active ? 1 : 0, scale: k === active ? "1" : "1.08" }} />
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* below lg the modes share one cell (the scene cross-fades them); from lg they stack, one 720 px zone each */}
        <div className="flex flex-col max-lg:grid">
          {T.modes.map((m, k) => {
            const on = k === active;
            return (
              <div key={m.title} ref={(el) => { zones.current[k] = el; }}
                className={`flex flex-col justify-center gap-3 max-lg:[grid-area:1/1] max-lg:justify-start max-lg:text-center max-lg:items-center lg:h-[720px] lg:transition-opacity lg:duration-500 ${k ? "lg:border-t lg:border-limestone-300" : ""} ${on ? "lg:opacity-100" : "lg:opacity-35"}`}>
                <span className="t-label l-tag">{m.tag}</span>
                <RevealText as="h3" text={m.title} className="t-heading hd-40" />
                <p className="max-w-[560px] t-body b-16 text-limestone-800">{m.body}</p>
              </div>);
          })}
        </div>
      </div>
    </section>
  );
}
