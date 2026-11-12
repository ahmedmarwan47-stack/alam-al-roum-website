"use client";
import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import { blurIn } from "@/components/reveal/letters";
import { manifesto as M } from "@/lib/about/a-content";
import { srcSet } from "@/lib/img";

/**
 * About hero (UI / Headline / Accent). 12 Nov review (#58, "remove the animation"): the same treatment as the inner-page
 * heroes (PageHero): no pin and no scroll-grown photo, the photo fills the screen and stays still, up under the glass
 * bar, and the copy sits at its foot in Limestone over the lighter fade (`.hero-page-shade`). On load only the copy
 * blurs in, the headline then the paragraph.
 */
export default function Manifesto() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    const q = gsap.utils.selector(root.current);
    const intro = gsap.timeline({ delay: 0.3 }).add(blurIn(q("h1"))).add(blurIn(q("[data-body]")), "-=0.75");
    return () => { intro.kill(); };
  }, []);
  return (
    <section ref={root} data-hero data-nav="light" className="relative h-svh min-h-[636px] overflow-hidden bg-deepsea-500 lg:min-h-[716px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={M.image} srcSet={srcSet(M.image)} alt="The Mediterranean off Alam Al Roum" className="absolute inset-0 h-full w-full object-cover" />
      <div className="hero-page-shade pointer-events-none absolute inset-0" />
      <div className="absolute inset-x-0 bottom-12 flex flex-col gap-4 text-limestone-50 container-x md:bottom-[84px]">
        <h1 data-reveal className="t-heading hd-56 hero-t max-w-[1000px]" style={{ textTransform: "capitalize" }}>
          <span className="block">{M.line1} <span className="t-accent" style={{ textTransform: "capitalize" }}>{M.accent}</span></span>
          <span className="block">{M.line2}</span>
        </h1>
        <p data-body data-reveal className="t-body b-18 hero-b wrap-balance max-w-[520px] text-limestone-50/90">{M.body}</p>
      </div>
    </section>
  );
}
