"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, reducedMotion, withHold } from "@/lib/gsap";
import { token } from "@/lib/about/a-motion";
import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";
import { facts as F } from "@/lib/about/a-content";

type State = keyof typeof F.states;
type Box = { left: string; top: string; width: string; height: string };
const p = (v: number) => `${+(v * 100).toFixed(3)}%`;
/**
 * The Figma stage is 1512 × 1024. Up to that size the windows scale with the screen (% of the stage); on a wider or
 * taller screen the split and merged windows keep Figma's pixels in a 1512 × 1024 box centred on the stage, so they
 * stay inside the content edges like every other section (the full state still opens to the whole screen).
 */
const AW = 1512, AH = 1024;
const ax = (x: number) => `calc(max(0px, (100% - ${AW}px) / 2) + min(${p(x / AW)}, ${x}px))`;
const ay = (y: number) => `calc(max(0px, (100% - ${AH}px) / 2) + min(${p(y / AH)}, ${y}px))`;
/** A window's box on the stage (CSS, for the first paint). */
const win = ([x, y, w, h]: number[]): Box => ({ left: ax(x), top: ay(y), width: `min(${p(w / AW)}, ${w}px)`, height: `min(${p(h / AH)}, ${h}px)` });
/** The same box in px for the tweens, measured from the stage (re-read on every ScrollTrigger refresh). */
const winPx = (stage: HTMLElement, s: State, k: "l" | "r") => {
  const W = stage.clientWidth, H = stage.clientHeight;
  if (s === "full") return { left: k === "l" ? 0 : W / 2, top: 0, width: W / 2, height: H };
  const aw = Math.min(W, AW), ah = Math.min(H, AH), [x, y, w, h] = F.states[s][k];
  return { left: (W - aw) / 2 + (x * aw) / AW, top: (H - ah) / 2 + (y * ah) / AH, width: (w * aw) / AW, height: (h * ah) / AH };
};
const tweenBox = (stage: HTMLElement, s: State, k: "l" | "r") =>
  (["left", "top", "width", "height"] as const).reduce((o, prop) => ({ ...o, [prop]: () => winPx(stage, s, k)[prop] }), {} as Record<string, () => number>);
/** The picture's box in % of its window, so both windows look onto one continuous photo when they meet. */
const pic = ([x, y, w, h]: number[], [ix, iy, iw, ih]: number[]): Box => ({ left: p((ix - x) / w), top: p((iy - y) / h), width: p(iw / w), height: p(ih / h) });
const boxes = (s: State) => {
  const { l, r, il, ir } = F.states[s];
  return { l: win(l), r: win(r), il: pic(l, il), ir: pic(r, ir) };
};

/** "A Fully Integrated / Coastal City": "Coastal City" always on its own line. */
const TITLE = [{ t: "A fully integrated" }, { t: "coastal city", br: true }];

/**
 * UI / Section / Split Merge, scroll-scrubbed while pinned (lg up), simplified (29 Oct review): the picture starts
 * whole, at Figma's merged 880 × 560, and opens in one eased move to full bleed under a 40 % Deep Sea dim while the
 * title and paragraph turn Limestone (a soft shade comes up under the paragraph, so it keeps its contrast over the
 * bright courtyard). The split halves sliding together are gone. (The picture is still drawn as two halves, so it
 * opens from the centre outwards.)
 * The four figures that used to rise in at the end now have their own static section (CityNumbers, higher up),
 * so the paragraph stays and the reading hold is shorter. Below lg the section stacks with the standard reveals.
 */
export default function CoastalFacts() {
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = stage.current!, q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const m = boxes("merged"), f = boxes("full");
      const [L, R, IL, IR] = ["[data-l]", "[data-r]", "[data-l] img", "[data-r] img"].map((s) => q(s));
      const E = "power2.inOut";
      const tl = gsap.timeline({ paused: true })   // one eased opening with the scroll; a reading hold at the end
        .fromTo(L, tweenBox(el, "merged", "l"), { ...tweenBox(el, "full", "l"), duration: 1.4, ease: E }, 0)
        .fromTo(R, tweenBox(el, "merged", "r"), { ...tweenBox(el, "full", "r"), duration: 1.4, ease: E }, 0)
        .fromTo(IL, m.il, { ...f.il, duration: 1.4, ease: E }, 0).fromTo(IR, m.ir, { ...f.ir, duration: 1.4, ease: E }, 0)
        .to(q("[data-dim]"), { opacity: 0.4, duration: 1.4, ease: "none" }, 0)
        .to(q("[data-scrim]"), { opacity: 1, duration: 1.4, ease: "none" }, 0)
        .to(q("[data-ink]"), { color: token("limestone-50"), duration: 0.8, ease: "none" }, 0.5);
      const vh = withHold(tl, 1.2, 0.4);
      if (reducedMotion()) { tl.progress(1); return () => tl.kill(); }
      const st = ScrollTrigger.create({ trigger: el, start: "top top", end: `+=${vh * 100}%`, pin: true, scrub: 1, animation: tl, invalidateOnRefresh: true });
      return () => { st.kill(); tl.kill(); };
    });
    return () => mm.revert();
  }, []);

  const s = boxes("merged");
  return (
    <section className="relative bg-limestone-50">
      {/* lg up: the pinned split → merge stage */}
      <div ref={stage} className="relative hidden h-svh min-h-[640px] overflow-hidden lg:block">
        {(["l", "r"] as const).map((k) => (
          <div key={k} {...{ [`data-${k}`]: "" }} className="absolute overflow-hidden" style={s[k]}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={F.image} alt={k === "l" ? "The Experience Centre courtyard" : ""} className="absolute max-w-none object-cover" style={k === "l" ? s.il : s.ir} />
          </div>
        ))}
        <div data-dim className="pointer-events-none absolute inset-0 bg-deepsea-600 opacity-0" />
        {/* full state: a soft Deep Sea shade towards the bottom right, under the paragraph */}
        <div data-scrim className="pointer-events-none absolute inset-0 opacity-0"
          style={{ background: "radial-gradient(70% 60% at 85% 90%, rgb(3 30 46 / .6), rgb(3 30 46 / 0))" }} />
        <div data-ink className="absolute inset-0 text-deepsea-500">
          <div className="absolute left-[var(--gutter)] top-[calc(max(0px,(100%-1024px)/2)+min(9.375%,96px))] max-w-[780px]">
            <RevealText as="h2" segs={TITLE} className="t-heading hd-56" />
          </div>
          <p className="absolute left-[calc(max(0px,(100%-1512px)/2)+min(72.22%,1092px))] top-[calc(max(0px,(100%-1024px)/2)+min(78.125%,800px))] w-[300px] t-body b-14">{F.body}</p>
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
