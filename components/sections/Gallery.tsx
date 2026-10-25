"use client";
import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";
import { gallery as G } from "@/lib/content";

/**
 * Sienna-style tile wall, as in the Figma "Gallery Marquee" prototype: rows drift one tile
 * (310px) every 12 s, linear, rows 1 and 3 to the left and row 2 to the right, endlessly.
 * Each row is rendered twice, so the loop is seamless. Tiles still wipe in on entry.
 */
export default function Gallery() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    const rows = gsap.utils.toArray<HTMLElement>("[data-row]", root.current);
    const tw = rows.map((r, k) => {
      const w = (r.children.length / 2) * 310, dur = (w / 310) * 12;
      return k % 2
        ? gsap.fromTo(r, { x: -w }, { x: 0, duration: dur, ease: "none", repeat: -1 })
        : gsap.fromTo(r, { x: 0 }, { x: -w, duration: dur, ease: "none", repeat: -1 });
    });
    return () => tw.forEach((t) => t.kill());
  }, []);
  return (
    <section ref={root} className="relative h-[1000px] overflow-hidden bg-deepsea-600">
      <div className="absolute inset-0 flex flex-col justify-center gap-[10px]">
        {G.rows.map((row, r) => (
          <div key={r} data-row className="flex gap-[10px]" style={{ marginLeft: [-100, -410, -250][r] }}>
            {[...row, ...row].map((src, k) => <RevealImage key={src + k} src={src} delay={(k % row.length) * 0.05 + r * 0.1} from={r % 2 ? "left" : "right"} className="h-[320px] w-[300px] flex-none rounded" />)}
          </div>))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-deepsea-950/20" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[60%] bg-gradient-to-r from-deepsea-900/90 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[220px] bg-gradient-to-b from-deepsea-600 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[220px] bg-gradient-to-t from-deepsea-600 to-transparent" />
      <div className="absolute left-[var(--gutter)] top-1/2 flex -translate-y-1/2 flex-col gap-4 text-limestone-50">
        <RevealText text={G.tag} className="t-label l-16" />
        <RevealText as="h2" segs={G.title} className="t-heading hd-48" delay={0.05} />
      </div>
    </section>
  );
}
