"use client";
import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import { blurIn, BLOCK_FROM, whenSectionEnters } from "@/components/reveal/letters";
import RevealText from "@/components/reveal/RevealText";
import { developerNumbers as N } from "@/lib/about/a-content";

/**
 * Qatari Diar in numbers (Figma 11705:12611, 19 Nov; it takes the slot of the masterplan figures). A calm, static
 * section on Limestone: the navy Qatari Diar mark beside the tag and heading, as tall as the two (96 at 1512), then the
 * four figures in a row (2 × 2 on a phone), 96 below. Nothing pins and nothing counts up (Home keeps the animated
 * Qatari Diar stage); the copy and the figures blur in as the section arrives, the site's one text entrance.
 */
export default function DeveloperNumbers() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current; if (!el || reducedMotion()) return;
    const blocks = el.querySelectorAll("[data-fig]");
    gsap.set(blocks, { ...BLOCK_FROM });
    return whenSectionEnters(el, () => blurIn(blocks, { delay: 0.25, stagger: 0.12 }));
  }, []);
  return (
    <section ref={root} aria-labelledby="developer-numbers-title" className="bg-limestone-50 py-12 container-x lg:py-20">
      <div className="flex items-end gap-4 lg:gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img data-fig src={N.logo} alt="Qatari Diar" width={96} height={96} className="size-16 flex-none md:size-20 lg:size-24" />
        <div className="flex flex-col gap-2 lg:gap-4">
          <RevealText text={N.tag} className="t-label l-tag text-deepsea-500" />
          <div id="developer-numbers-title"><RevealText as="h2" text={N.title} className="t-heading hd-48 max-w-[620px] text-deepsea-500" delay={0.05} /></div>
        </div>
      </div>
      <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:mt-24 lg:grid-cols-4">
        {N.items.map((x) => (
          // Phones: the figure 32 / 36 and its label 14 / 20 (as the masterplan figures were); the last label runs the
          // column's full width (Figma), the others stop at 240
          <li key={x.value} data-fig data-reveal className="flex flex-col gap-3 lg:gap-4">
            <span className="t-text x-80 text-deepsea-500 max-md:text-[32px]! max-md:leading-9!">{x.value}</span>
            <span className="t-text x-20 max-w-[240px] text-limestone-800 max-md:text-[14px]! max-md:leading-5! [li:last-child>&]:max-w-[330px]">{x.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
