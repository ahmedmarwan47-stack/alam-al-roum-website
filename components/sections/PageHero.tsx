"use client";
import { Fragment, useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import "@/lib/about/a-motion";
import { blurIn } from "@/components/reveal/letters";
import type { Seg } from "@/components/reveal/RevealText";

export type PageHeroData = { pre: string; title: Seg[]; body: string; photo: string; alt?: string };

/**
 * Inner-page hero (Figma "UI / Headline / Destination", 11053:7571) — the same motion as the About hero
 * (Manifesto, "UI / Headline / Accent"), since both are one concept:
 * on load, after 0.3 s, the pre-headline, the headline and the paragraph blur in, block by block; the photo rises 60 px into its 360 × 240 slot and the rule draws across (0.22/1/0.36/1 settle).
 * On scroll (pinned, linear from the first pixel, one viewport long) the photo grows to full bleed easing back from
 * a 1.15 zoom, the dim comes up to 75 %, the copy turns Limestone and the rule fades. The box itself grows, so the
 * photo is re-framed at every size and its subject stays in view.
 */
export default function PageHero({ data: H }: { data: PageHeroData }) {
  const wrap = useRef<HTMLDivElement>(null), photo = useRef<HTMLDivElement>(null), dim = useRef<HTMLDivElement>(null),
    rule = useRef<HTMLDivElement>(null), copy = useRef<HTMLDivElement>(null), body = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = photo.current!, q = gsap.utils.selector(wrap.current);
    if (reducedMotion()) return;
    const intro = gsap.timeline({ delay: 0.3, defaults: { ease: "aSettle" } })
      .add(blurIn(q("[data-pre], h1, [data-body]")))
      .addLabel("shown", 0.5)
      .fromTo(el, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, "shown")
      .fromTo(rule.current, { scaleX: 0 }, { scaleX: 1, duration: 1.1 }, "shown");
    if (!window.matchMedia("(min-width: 1024px)").matches) return () => { intro.kill(); };
    const tl = gsap.timeline({ defaults: { ease: "none" },
      scrollTrigger: { trigger: wrap.current, start: "top 76px", end: "+=100%", scrub: 1, pin: true } });   // 76 = under the bar
    tl.to(el, { left: "0%", top: "0%", width: "100%", height: "100%", borderRadius: 0 }, 0)
      .fromTo(el.querySelector("img"), { scale: 1.15 }, { scale: 1 }, 0)
      .to(dim.current, { opacity: 0.75 }, 0)
      .to(rule.current, { opacity: 0 }, 0)
      .to(copy.current, { color: "#FBFAF8" }, 0)
      .to(body.current, { color: "rgba(251, 250, 248, 0.85)" }, 0);
    return () => { intro.kill(); tl.scrollTrigger?.kill(); tl.kill(); };
  }, []);
  return (
    // the pinned node is the inner div, so GSAP's pin-spacer never wraps the element React owns
    <section className="mt-[76px]">
    <div ref={wrap} className="relative overflow-hidden bg-limestone-50 lg:h-[calc(100svh-76px)] lg:min-h-[640px]">
      {/* slot from Figma (1512 × 760): left 1092, top 480, 360 × 240 */}
      <div ref={photo} data-reveal className="relative h-[60vh] overflow-hidden lg:absolute lg:left-[72.2%] lg:top-[63.2%] lg:h-[31.6%] lg:w-[23.8%] lg:rounded-[2px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={H.photo} alt={H.alt ?? ""} className="h-full w-full object-cover" />
        <div ref={dim} className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-0" />
      </div>
      <div ref={copy} className="relative flex flex-col gap-4 py-16 text-deepsea-500 container-x lg:absolute lg:left-0 lg:top-[30.3%] lg:py-0">
        <span data-pre data-reveal className="t-label l-16">{H.pre}</span>
        <h1 data-reveal className="t-label hd-56 max-w-[1000px] capitalize">
          {H.title.map((s, k) => (
            <Fragment key={k}>{s.br && <br />}{k > 0 && !s.br && " "}{s.i ? <span className="t-accent">{s.t}</span> : s.t}</Fragment>))}
        </h1>
        <div ref={body} data-body data-reveal className="text-limestone-800"><p className="t-body b-18 max-w-[300px]">{H.body}</p></div>
      </div>
      <div ref={rule} className="absolute inset-x-[var(--gutter)] top-[94.7%] hidden h-px origin-left bg-limestone-300 lg:block" />
    </div>
    </section>
  );
}
