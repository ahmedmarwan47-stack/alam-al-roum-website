"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, reducedMotion, withHold } from "@/lib/gsap";
import { token } from "@/lib/about/a-motion";
import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";
import { facts as F } from "@/lib/about/a-content";
import { srcSet } from "@/lib/img";
import { MQ } from "@/lib/breakpoints";

type Box = { left: string; top: string; width: string; height: string };
const p = (v: number) => `${+(v * 100).toFixed(3)}%`;
/**
 * The Figma stage is 1512 × 1024. Up to that size the window scales with the screen (% of the stage); on a wider or
 * taller screen it keeps Figma's pixels in a 1512 × 1024 box centred on the stage, so it stays inside the content
 * edges like every other section (the full state still opens to the whole screen).
 */
const AW = 1512, AH = 1024;
const ax = (x: number) => `calc(max(0px, (100% - ${AW}px) / 2) + min(${p(x / AW)}, ${x}px))`;
const ay = (y: number) => `calc(max(0px, (100% - ${AH}px) / 2) + min(${p(y / AH)}, ${y}px))`;
/** The window's box on the stage (CSS, for the first paint). */
const win = ([x, y, w, h]: number[]): Box => ({ left: ax(x), top: ay(y), width: `min(${p(w / AW)}, ${w}px)`, height: `min(${p(h / AH)}, ${h}px)` });
/** The same box in px for the tweens, measured from the stage (re-read on every ScrollTrigger refresh). */
const mergedPx = (stage: HTMLElement) => {
  const W = stage.clientWidth, H = stage.clientHeight, aw = Math.min(W, AW), ah = Math.min(H, AH), [x, y, w, h] = F.merged.win;
  return { left: (W - aw) / 2 + (x * aw) / AW, top: (H - ah) / 2 + (y * ah) / AH, width: (w * aw) / AW, height: (h * ah) / AH };
};
/** The picture's box in % of the window. */
const pic = ([x, y, w, h]: number[], [ix, iy, iw, ih]: number[]): Box => ({ left: p((ix - x) / w), top: p((iy - y) / h), width: p(iw / w), height: p(ih / h) });
const WIN = win(F.merged.win), PIC = pic(F.merged.win, F.merged.pic);

/** "A Fully Integrated / Coastal City": "Coastal City" always on its own line. */
const TITLE = [{ t: "A fully integrated" }, { t: "coastal city", br: true }];

/**
 * UI / Section / Split Merge, scroll-scrubbed while pinned (lg up), simplified (29 Oct review): the picture starts
 * whole, at Figma's merged 880 × 560, and opens in one eased move to full bleed under a 33 % black dim while the
 * title and paragraph turn Limestone and the paragraph (Body/20, 498 wide) eases 60 px to the right (Figma's
 * updated Merged → Full, 29 Oct). It is one picture in one window: drawn as two halves meeting in the centre, the join showed as a cut line.
 * The four figures that used to rise in at the end now have their own static section (CityNumbers, higher up),
 * so the paragraph stays and the reading hold is shorter. Below lg the section stacks with the standard reveals.
 */
export default function CoastalFacts() {
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = stage.current!, q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();
    mm.add(MQ.lg, () => {
      const box = (k: "left" | "top" | "width" | "height") => () => mergedPx(el)[k];
      const E = "power2.inOut";
      const tl = gsap.timeline({ paused: true })   // one eased opening with the scroll; a reading hold at the end
        .fromTo(q("[data-win]"), { left: box("left"), top: box("top"), width: box("width"), height: box("height") },
          { left: 0, top: 0, width: () => el.clientWidth, height: () => el.clientHeight, duration: 1.4, ease: E }, 0)
        .fromTo(q("[data-win] img"), PIC, { left: "0%", top: "0%", width: "100%", height: "100%", duration: 1.4, ease: E }, 0)
        .to(q("[data-dim]"), { opacity: 0.33, duration: 1.4, ease: "none" }, 0)
        .to(q("[data-para]"), { x: () => (60 * Math.min(el.clientWidth, AW)) / AW, duration: 1.4, ease: E }, 0)
        .to(q("[data-ink]"), { color: token("limestone-50"), duration: 0.8, ease: "none" }, 0.5);
      const vh = withHold(tl, 1.2, 0.4);
      if (reducedMotion()) { tl.progress(1); return () => tl.kill(); }
      const st = ScrollTrigger.create({ trigger: el, start: "top top", end: `+=${vh * 100}%`, pin: true, scrub: 1, animation: tl, invalidateOnRefresh: true });
      return () => { st.kill(); tl.kill(); };
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="relative bg-limestone-50">
      {/* lg up: the pinned merged → full stage */}
      <div ref={stage} className="relative hidden h-svh min-h-[640px] overflow-hidden lg:block">
        <div data-win className="absolute overflow-hidden" style={WIN}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={F.image} srcSet={srcSet(F.image)} alt="The Experience Centre courtyard" className="absolute max-w-none object-cover" style={PIC} />
        </div>
        <div data-dim className="pointer-events-none absolute inset-0 bg-black opacity-0" />
        <div data-ink className="absolute inset-0 text-deepsea-500">
          <div className="absolute left-[var(--gutter)] top-[calc(max(0px,(100%-1024px)/2)+min(7.8125%,80px))] max-w-[780px]">
            <RevealText as="h2" segs={TITLE} className="t-heading hd-56" />
          </div>
          <p data-para className="absolute left-[calc(max(0px,(100%-1512px)/2)+min(59.13%,894px))] top-[calc(max(0px,(100%-1024px)/2)+min(79.6875%,816px))] w-[min(32.94%,498px)] t-body b-20">{F.body}</p>
        </div>
      </div>

      {/* below lg: stacked */}
      <div className="flex flex-col gap-8 py-20 container-x lg:hidden">
        <RevealText as="h2" segs={TITLE} className="t-heading hd-56 text-deepsea-500" />
        <RevealText text={F.body} className="t-body b-14 max-w-[420px] text-deepsea-500" delay={0.1} />
        <RevealImage src={F.image} alt="The Experience Centre courtyard" className="aspect-[3/2] w-full" />
      </div>
    </section>
  );
}
