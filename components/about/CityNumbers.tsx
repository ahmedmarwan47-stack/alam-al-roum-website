"use client";
import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import { blurIn, BLOCK_FROM, whenSectionEnters } from "@/components/reveal/letters";
import RevealText from "@/components/reveal/RevealText";
import { cityNumbers as N } from "@/lib/about/a-content";

/**
 * About only: the masterplan's four figures (the ones Coastal Facts used to reveal), in the slot the pinned Qatari Diar
 * numbers held (Home keeps that animated stage). A calm, static section: the tag and heading (no developer credit,
 * 29 Oct review), then the four figures in a row under thin rules (2 × 2 on a phone). Nothing pins; the copy and the figures blur in as the section arrives (the site's one text entrance).
 */
export default function CityNumbers() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current; if (!el || reducedMotion()) return;
    const blocks = el.querySelectorAll("[data-fig]");
    gsap.set(blocks, BLOCK_FROM);
    return whenSectionEnters(el, () => { blurIn(el.querySelectorAll("[data-fig]"), { delay: 0.25, stagger: 0.12 }); });
  }, []);
  return (
    <section ref={root} aria-labelledby="city-numbers-title" className="bg-limestone-50 py-20 container-x lg:py-32">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-4">
          <RevealText text={N.tag} className="t-label l-16 text-deepsea-500" />
          <div id="city-numbers-title"><RevealText as="h2" text={N.title} className="t-heading hd-48 max-w-[620px] text-deepsea-500" delay={0.05} /></div>
        </div>
      </div>
      <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:mt-24 lg:grid-cols-4">
        {N.items.map((x) => (
          // 2 × 2 below lg: rules only between the rows; from lg one row, each figure under its own rule
          <li key={x.value} data-fig data-reveal className="flex flex-col gap-3 border-t border-limestone-600 pt-5 max-lg:[&:nth-child(-n+2)]:border-t-0 max-lg:[&:nth-child(-n+2)]:pt-0 lg:gap-4 lg:pt-6">
            <span className="t-text x-80 text-deepsea-500" style={{ letterSpacing: "-0.035em" }}>{x.value}</span>
            <span className="t-text x-16 max-w-[240px] text-limestone-800">{x.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
