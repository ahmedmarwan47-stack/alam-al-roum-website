"use client";
import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import { blurIn, BLOCK_FROM, whenSectionEnters } from "@/components/reveal/letters";
import RevealText from "@/components/reveal/RevealText";
import { cityNumbers as N } from "@/lib/about/a-content";

/**
 * About only: the masterplan's four figures (the ones Coastal Facts used to reveal), in the slot the pinned Qatari Diar
 * numbers held (Home keeps that animated stage). A calm, static section: the tag and heading (no developer credit,
 * 29 Oct review), then the four figures in a row (2 × 2 on a phone), with no rules (9 Nov). Nothing pins; the copy and
 * the figures blur in as the section arrives (the site's one text entrance) and each figure counts up from 0 to its
 * value, keeping its format ("20.58M", "4,902", "7.2 km"). The final value reserves the width (no shift while the digits
 * change) and screen readers get it at once; with reduced motion the figures simply show.
 */

/** "4,902" → prefix "", number 4902, 0 decimals, grouped; "7.2 km" → 7.2, 1 decimal, suffix " km". */
const parse = (v: string) => {
  const m = v.match(/^([^\d]*)([\d.,]+)(.*)$/);
  if (!m) return null;
  const num = m[2], dec = num.includes(".") ? num.split(".")[1].length : 0;
  return { pre: m[1], n: parseFloat(num.replace(/,/g, "")), dec, group: num.includes(","), post: m[3] };
};
const fmt = (p: NonNullable<ReturnType<typeof parse>>, x: number) =>
  p.pre + x.toLocaleString("en-US", { minimumFractionDigits: p.dec, maximumFractionDigits: p.dec, useGrouping: p.group }) + p.post;
export default function CityNumbers() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current; if (!el || reducedMotion()) return;
    const blocks = el.querySelectorAll("[data-fig]");
    gsap.set(blocks, BLOCK_FROM);
    const counters = [...el.querySelectorAll<HTMLElement>("[data-count]")].map((c) => ({ c, p: parse(c.dataset.count!) }));
    counters.forEach(({ c, p }) => { if (p) c.textContent = fmt(p, 0); });
    const tweens: gsap.core.Tween[] = [];
    const stop = whenSectionEnters(el, () => {
      blurIn(el.querySelectorAll("[data-fig]"), { delay: 0.25, stagger: 0.12 });
      counters.forEach(({ c, p }, k) => {
        if (!p) return;
        const o = { x: 0 };
        tweens.push(gsap.to(o, { x: p.n, duration: 1.8, delay: 0.25 + k * 0.12, ease: "power3.out",
          onUpdate: () => { c.textContent = fmt(p, o.x); }, onComplete: () => { c.textContent = c.dataset.count!; } }));
      });
    });
    return () => { stop(); tweens.forEach((t) => t.kill()); counters.forEach(({ c }) => { c.textContent = c.dataset.count!; }); };
  }, []);
  return (
    <section ref={root} aria-labelledby="city-numbers-title" className="bg-limestone-50 py-20 container-x lg:py-32">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-4">
          <RevealText text={N.tag} className="t-label l-tag text-deepsea-500" />
          <div id="city-numbers-title"><RevealText as="h2" text={N.title} className="t-heading hd-48 max-w-[620px] text-deepsea-500" delay={0.05} /></div>
        </div>
      </div>
      <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:mt-24 lg:grid-cols-4">
        {N.items.map((x) => (
          // 2 × 2 below lg, one row from lg, no rules (9 Nov). Phones: the figure 32 / 36 and its label 14 / 20.
          // The figure: the final value, invisible, holds the width; the counting copy sits on top of it
          <li key={x.value} data-fig data-reveal className="flex flex-col gap-3 lg:gap-4">
            <span className="grid t-text x-80 text-deepsea-500 max-md:text-[32px]! max-md:leading-9!" style={{ letterSpacing: "-0.035em" }}>
              <span className="invisible [grid-area:1/1]" aria-hidden>{x.value}</span>
              <span className="[grid-area:1/1]" data-count={x.value} aria-hidden>{x.value}</span>
              <span className="sr-only">{x.value}</span>
            </span>
            <span className="t-text x-16 max-w-[240px] text-limestone-800 max-md:text-[14px]! max-md:leading-5!">{x.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
