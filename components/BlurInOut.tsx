"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";

const SEL = "main :is(h1, h2, h3, h4, p, img, video, [data-blur])";

/**
 * Site-wide blur in / blur out: text and media sharpen from a 12px blur as they rise into view and soften again
 * as they leave at the top, scrubbed (smoothed) with the scroll. Pinned sections run their own choreography,
 * so anything inside a pin is left alone, as are the header and elements nested in an already-blurred one.
 * Mounted after the page, so the pins already exist when it looks.
 */
export default function BlurInOut() {
  const path = usePathname();
  useEffect(() => {
    if (reducedMotion()) return;
    let kill: (() => void) | undefined;
    const id = requestAnimationFrame(() => {
      const picked: HTMLElement[] = [];
      for (const el of gsap.utils.toArray<HTMLElement>(SEL)) {
        if (el.closest(".pin-spacer, header, [data-no-blur]")) continue;
        // photos shown through a blend / mask (e.g. the Qatari Diar digits) would bleed their blurred edges: skip them
        if (el.closest("[class*=mix-blend], [style*=mask]")) continue;
        if (el.getBoundingClientRect().height < 12) continue;
        if (picked.some((p) => p.contains(el))) continue;
        picked.push(el);
      }
      const tweens = picked.flatMap((el) => [
        gsap.fromTo(el, { filter: "blur(12px)", opacity: 0.35 }, { filter: "blur(0px)", opacity: 1, ease: "none",
          scrollTrigger: { trigger: el, start: "top 98%", end: "top 74%", scrub: 1 } }),
        gsap.fromTo(el, { filter: "blur(0px)", opacity: 1 }, { filter: "blur(12px)", opacity: 0.35, ease: "none", immediateRender: false,
          scrollTrigger: { trigger: el, start: "bottom 26%", end: "bottom 2%", scrub: 1 } }),
      ]);
      ScrollTrigger.refresh();
      kill = () => tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); gsap.set(t.targets(), { clearProps: "filter,opacity" }); });
    });
    return () => { cancelAnimationFrame(id); kill?.(); };
  }, [path]);
  return null;
}
