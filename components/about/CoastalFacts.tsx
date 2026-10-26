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
/** A window's box in % of the 1512 × 1024 stage. */
const win = ([x, y, w, h]: number[]): Box => ({ left: p(x / 1512), top: p(y / 1024), width: p(w / 1512), height: p(h / 1024) });
/** The picture's box in % of its window, so both windows look onto one continuous photo when they meet. */
const pic = ([x, y, w, h]: number[], [ix, iy, iw, ih]: number[]): Box => ({ left: p((ix - x) / w), top: p((iy - y) / h), width: p(iw / w), height: p(ih / h) });
const boxes = (s: State) => {
  const { l, r, il, ir } = F.states[s];
  return { l: win(l), r: win(r), il: pic(l, il), ir: pic(r, ir) };
};

/** "A Fully Integrated / Coastal City": "Coastal City" always on its own line. */
const TITLE = [{ t: "A fully integrated" }, { t: "coastal city", br: true }];

/**
 * UI / Section / Split Merge, scroll-scrubbed while pinned (lg up). Split → Merged (Figma 1.2 s): the two
 * offset halves slide together into one 880 × 560 picture. Merged → Full (1.4 s, after 0.35 s): the halves
 * open to full bleed under a 40 % Deep Sea dim, the copy turns Limestone, the paragraph fades and the facts
 * row rises 40px into view. Both legs on the 0.76/0/0.24/1 in-out. Below lg the section stacks with the
 * standard line and image reveals.
 */
export default function CoastalFacts() {
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = stage.current!, q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const m = boxes("merged"), f = boxes("full");
      const [L, R, IL, IR] = ["[data-l]", "[data-r]", "[data-l] img", "[data-r] img"].map((s) => q(s));
      const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } })   // linear with the scroll; a reading hold at the end
        .to(L, { ...m.l, duration: 1.2 }, 0).to(R, { ...m.r, duration: 1.2 }, 0)
        .to(IL, { ...m.il, duration: 1.2 }, 0).to(IR, { ...m.ir, duration: 1.2 }, 0)
        .addLabel("full", 1.2)
        .to(L, { ...f.l, duration: 1.4 }, "full").to(R, { ...f.r, duration: 1.4 }, "full")
        .to(IL, { ...f.il, duration: 1.4 }, "full").to(IR, { ...f.ir, duration: 1.4 }, "full")
        .to(q("[data-dim]"), { opacity: 0.4, duration: 1.4 }, "full")
        .to(q("[data-ink]"), { color: token("limestone-50"), duration: 1 }, "full+=0.2")
        .to(q("[data-para]"), { opacity: 0, duration: 0.6 }, "full")
        .fromTo(q("[data-facts]"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 }, "full+=0.4")
        .fromTo(q("[data-fv]"), { color: token("deepsea-500") }, { color: token("limestone-50"), duration: 1 }, "full+=0.4")
        .fromTo(q("[data-fl]"), { color: token("limestone-800") }, { color: token("deepsea-200"), duration: 1 }, "full+=0.4")
        .fromTo(q("[data-fb]"), { borderColor: token("limestone-600") }, { borderColor: token("deepsea-400"), duration: 1 }, "full+=0.4");
      const vh = withHold(tl, 2, 0.6);
      if (reducedMotion()) { tl.progress(1); return () => tl.kill(); }
      const st = ScrollTrigger.create({ trigger: el, start: "top top", end: `+=${vh * 100}%`, pin: true, scrub: 1, animation: tl });
      return () => { st.kill(); tl.kill(); };
    });
    return () => mm.revert();
  }, []);

  const s = boxes("split");
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
        <div data-ink className="absolute left-[var(--gutter)] top-[9.375%] max-w-[780px] text-deepsea-500">
          <RevealText as="h2" segs={TITLE} className="t-heading hd-56" />
        </div>
        <p data-para className="absolute left-[72.22%] top-[78.125%] w-[300px] t-body b-14 text-deepsea-500">{F.body}</p>
        <div data-facts className="absolute inset-x-[var(--gutter)] top-[77.34%] grid grid-cols-4 gap-6 opacity-0">
          {F.items.map((x) => (
            <div key={x.value} data-fb className="flex flex-col gap-2 border-t border-limestone-600 pt-5">
              <span data-fv className="t-text text-deepsea-500" style={{ fontSize: "clamp(30px, calc(30px + 26 * (100vw - 390px) / 1122), 56px)", lineHeight: 60 / 56, letterSpacing: "-0.035em" }}>{x.value}</span>
              <span data-fl className="t-text x-16 text-limestone-800">{x.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* below lg: stacked */}
      <div className="flex flex-col gap-8 py-20 container-x lg:hidden">
        <RevealText as="h2" segs={TITLE} className="t-heading hd-56 text-deepsea-500" />
        <RevealText text={F.body} className="t-body b-14 max-w-[420px] text-deepsea-500" delay={0.1} />
        <RevealImage src={F.image} alt="The Experience Centre courtyard" className="aspect-[3/2] w-full" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-8">
          {F.items.map((x) => (
            <div key={x.value} className="flex flex-col gap-2 border-t border-limestone-600 pt-5">
              <span className="t-text text-deepsea-500" style={{ fontSize: 34, lineHeight: 1.1, letterSpacing: "-0.035em" }}>{x.value}</span>
              <span className="t-text x-16 text-limestone-800">{x.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
