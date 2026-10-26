"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, reducedMotion, withHold } from "@/lib/gsap";
import { token } from "@/lib/about/a-motion";
import { blurIn } from "@/components/reveal/letters";
import { manifesto as M } from "@/lib/about/a-content";

/**
 * UI / Headline / Accent. On load it plays the Figma states in order: Hidden → Line 1 (after 0.3 s) → Shown:
 * the headline blurs in as one block, then the paragraph (the same blur-in), the small photo (60px up) and the rule. From lg up, Shown → Full is
 * scroll-scrubbed while the section is pinned: the photo opens to full bleed, the dim comes up to 75 % and the
 * copy turns Limestone as the photo reaches it (Figma 1.3 s in-out, here one viewport), then a reading hold.
 */
export default function Manifesto() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current!, q = gsap.utils.selector(el);
    if (reducedMotion()) return;
    const intro = gsap.timeline({ delay: 0.3, defaults: { ease: "aSettle" } })
      .add(blurIn(q("h1")))
      .addLabel("shown", "-=0.6")
      .add(blurIn(q("[data-body]")), "shown")
      .fromTo(q("[data-media]"), { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, "shown")
      .fromTo(q("[data-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.1 }, "shown");

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      // the small photo's box (Figma 360 × 240, gutter from the right, 40px above the bottom) as clip-path insets
      const box = () => {
        const W = el.offsetWidth, H = el.offsetHeight, w = W * (360 / 1512), h = w * (240 / 360), g = W * (60 / 1512), b = 40;
        return `inset(${H - b - h}px ${g}px ${b}px ${W - g - w}px)`;
      };
      const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } })
        .fromTo(q("[data-clip]"), { clipPath: box }, { clipPath: "inset(0px 0px 0px 0px)", duration: 1 }, 0)
        .fromTo(q("[data-clip] img"), { scale: 1.15 }, { scale: 1, duration: 1 }, 0)
        .fromTo(q("[data-dim]"), { opacity: 0 }, { opacity: 0.75, duration: 0.3 }, 0.7)
        .fromTo(q("[data-copy]"), { color: token("deepsea-500") }, { color: token("limestone-50"), duration: 0.1 }, 0.9)
        .to(q("[data-rule-wrap]"), { opacity: 0, duration: 0.3 }, 0);
      const vh = withHold(tl, 1);   // same length as the inner-page heroes
      const st = ScrollTrigger.create({ trigger: el, start: "top 76px", end: `+=${vh * 100}%`, pin: true, scrub: 1, invalidateOnRefresh: true, animation: tl });
      return () => { st.kill(); tl.kill(); };
    });
    return () => { intro.kill(); mm.revert(); };
  }, []);

  return (
    <section ref={root} className="relative mt-[76px] overflow-hidden bg-limestone-50 lg:h-[calc(100svh-76px)] lg:min-h-[640px]">
      <div data-copy className="relative z-10 flex flex-col gap-3 py-16 text-deepsea-500 container-x lg:absolute lg:inset-0 lg:justify-center lg:py-0">
        <h1 data-reveal className="t-heading hd-56 leading-none!" style={{ textTransform: "capitalize" }}>
          <span className="block">{M.line1} <span className="t-accent" style={{ textTransform: "capitalize" }}>{M.accent}</span></span>
          <span className="block">{M.line2}</span>
        </h1>
        <p data-body data-reveal className="t-body b-18 max-w-[300px]">{M.body}</p>
      </div>

      {/* photo: in the flow below lg, a clipped full-bleed layer from lg up */}
      <div data-media data-reveal className="relative mx-[var(--gutter)] mb-16 aspect-[3/2] overflow-hidden lg:absolute lg:inset-0 lg:m-0 lg:aspect-auto">
        <div data-clip className="absolute inset-0 overflow-hidden lg:[clip-path:inset(calc(100%_-_40px_-_15.87vw)_3.97vw_40px_calc(100%_-_27.78vw))]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={M.image} alt="The Mediterranean off Alam Al Roum" className="h-full w-full object-cover" />
          <div data-dim className="absolute inset-0 hidden bg-gradient-to-r from-black to-transparent opacity-0 lg:block" />
        </div>
      </div>
      <div data-rule-wrap className="pointer-events-none absolute inset-x-[var(--gutter)] bottom-10 hidden lg:block">
        <div data-rule className="h-px origin-left bg-limestone-200" />
      </div>
    </section>
  );
}
