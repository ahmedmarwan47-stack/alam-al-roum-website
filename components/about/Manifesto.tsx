"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, reducedMotion, withHold } from "@/lib/gsap";
import { blurIn } from "@/components/reveal/letters";
import { manifesto as M } from "@/lib/about/a-content";

/**
 * UI / Headline / Accent. On load it plays the Figma states in order: Hidden → Line 1 (after 0.3 s) → Shown:
 * the headline blurs in as one block, then the paragraph (the same blur-in), the small photo (60px up) and the rule. From lg up, Shown → Full is
 * scroll-scrubbed while the section is pinned: the photo opens to full bleed (Figma 1.3 s in-out, here one viewport)
 * and a Limestone copy of the text, clipped to the photo's box over its shade, takes over line by line; then a reading hold.
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
      // the small photo's box (Figma 360 × 240, gutter from the right, 40px above the bottom) as clip-path insets; wider
      // than 1512 it keeps Figma's 360 × 240 on the right content edge (the 1392 px measure every section keeps)
      const box = () => {
        const W = el.offsetWidth, H = el.offsetHeight, w = Math.min(W * (360 / 1512), 360), h = w * (240 / 360), g = Math.max(W * (60 / 1512), (W - 1392) / 2), b = 40;
        return `inset(${H - b - h}px ${g}px ${b}px ${W - g - w}px)`;
      };
      const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } })
        .fromTo(q("[data-clip]"), { clipPath: box }, { clipPath: "inset(0px 0px 0px 0px)", duration: 1 }, 0)
        // the light copy rides on a layer clipped to the same box, over the photo's shade (as PageHero)
        .fromTo(q("[data-lit]"), { clipPath: box }, { clipPath: "inset(0px 0px 0px 0px)", duration: 1 }, 0)
        .fromTo(q("[data-clip] img"), { scale: 1.15 }, { scale: 1, duration: 1 }, 0)
        .fromTo(q("[data-shade]"), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.05)
        .to(q("[data-rule-wrap]"), { opacity: 0, duration: 0.3 }, 0);
      const vh = withHold(tl, 1);   // same length as the inner-page heroes
      const st = ScrollTrigger.create({ trigger: el, start: "top top", end: `+=${vh * 100}%`, pin: true, scrub: 1, invalidateOnRefresh: true, animation: tl });
      return () => { st.kill(); tl.kill(); };
    });
    return () => { intro.kill(); mm.revert(); };
  }, []);

  const copy = (light: boolean) => (
    <div aria-hidden={light || undefined} className={`relative z-10 flex flex-col gap-3 py-16 container-x lg:absolute lg:inset-0 lg:justify-center lg:py-0 lg:pt-[76px] ${light ? "text-limestone-50" : "text-deepsea-500"}`}>
      {(() => {
        const Tag = light ? "div" : "h1";
        return (
          <Tag data-reveal={light ? undefined : ""} className="t-heading hd-56 leading-none!" style={{ textTransform: "capitalize" }}>
            <span className="block">{M.line1} <span className="t-accent" style={{ textTransform: "capitalize" }}>{M.accent}</span></span>
            <span className="block">{M.line2}</span>
          </Tag>);
      })()}
      <p data-body={light ? undefined : ""} data-reveal={light ? undefined : ""} className={`t-body b-18 wrap-balance max-w-[520px] ${light ? "text-limestone-50/90" : ""}`}>{M.body}</p>
    </div>
  );
  return (
    // phones: copy under the glass bar, then the photo; from lg the hero runs up under the bar and pins at the top
    <section ref={root} data-hero className="relative mt-[76px] overflow-hidden bg-limestone-50 lg:mt-0 lg:h-svh lg:min-h-[716px]">
      {copy(false)}

      {/* photo: in the flow below lg (portrait on a phone, so the opening screen is copy + photo), a clipped full-bleed layer from lg up */}
      <div data-media data-reveal className="relative mx-[var(--gutter)] mb-16 aspect-[4/5] overflow-hidden md:aspect-[3/2] lg:absolute lg:inset-0 lg:z-[11] lg:m-0 lg:aspect-auto">
        <div data-clip className="absolute inset-0 overflow-hidden lg:[clip-path:inset(calc(100%_-_40px_-_min(15.87vw,240px))_max(3.97vw,var(--gutter))_40px_calc(100%_-_max(3.97vw,var(--gutter))_-_min(23.81vw,360px)))]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={M.image} alt="The Mediterranean off Alam Al Roum" className="h-full w-full object-cover" />
        </div>
      </div>
      {/* the light copy over the photo's shade, clipped to the photo's box: wherever the photo has reached a line, that
          line is light on shade, elsewhere it stays dark on Limestone (never dark copy on the photo) */}
      <div data-lit aria-hidden className="pointer-events-none absolute inset-0 z-[12] hidden [clip-path:inset(calc(100%_-_40px_-_min(15.87vw,240px))_max(3.97vw,var(--gutter))_40px_calc(100%_-_max(3.97vw,var(--gutter))_-_min(23.81vw,360px)))] lg:block">
        <div data-shade className="hero-side-shade absolute inset-0 opacity-0" />
        {copy(true)}
      </div>
      <div data-rule-wrap className="pointer-events-none absolute inset-x-[var(--gutter)] bottom-10 hidden lg:block">
        <div data-rule className="h-px origin-left bg-limestone-200" />
      </div>
    </section>
  );
}
