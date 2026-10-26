"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import { blurIn, BLOCK_FROM, photoIn, PHOTO_FROM, mediaBlurIn, MEDIA_BLUR_FROM, whenSectionEnters } from "@/components/reveal/letters";

const SEL = "main :is(h1, h2, h3, h4, p, img, video, [data-blur])";

/**
 * Site-wide entrances for every text block and photo that has none of its own, as its section comes into view:
 * text blurs in as one block (RevealText's blur-in), photos and films open with the photo wipe (RevealImage's). Anything that already
 * animates is left alone — RevealText / RevealImage blocks ([data-reveal], [data-reveal-img]), pinned sections,
 * the header, photos shown through a blend or mask — and so is everything already on screen when the page opens,
 * so nothing that is visible ever flashes out and back in.
 */
export default function BlurInOut() {
  const path = usePathname();
  useEffect(() => {
    if (reducedMotion()) return;
    let kill: (() => void) | undefined;
    const id = requestAnimationFrame(() => {
      const picked: HTMLElement[] = [];
      for (const el of gsap.utils.toArray<HTMLElement>(SEL)) {
        if (el.closest(".pin-spacer, header, [data-no-blur], [data-reveal], [data-reveal-img], [aria-hidden=true]")) continue;
        if (el.closest("[class*=mix-blend], [style*=mask]")) continue;
        const r = el.getBoundingClientRect();
        if (r.height < 12 || r.top < innerHeight) continue;
        if (picked.some((p) => p.contains(el))) continue;
        picked.push(el);
      }
      // films marked data-media-blur (the footer's) only blur in; other photos sweep; text blurs in
      const kind = (el: HTMLElement) => (el.hasAttribute("data-media-blur") ? "soft" : el.tagName === "IMG" || el.tagName === "VIDEO" ? "photo" : "text");
      picked.forEach((el) => gsap.set(el, { soft: MEDIA_BLUR_FROM, photo: PHOTO_FROM, text: BLOCK_FROM }[kind(el)]));
      const offs = picked.map((el) => whenSectionEnters(el, () => { ({ soft: mediaBlurIn, photo: photoIn, text: blurIn }[kind(el)](el)); }));
      ScrollTrigger.refresh();
      kill = () => { offs.forEach((off) => off()); gsap.set(picked, { clearProps: "opacity,filter,transform,clipPath" }); };
    });
    return () => { cancelAnimationFrame(id); kill?.(); };
  }, [path]);
  return null;
}
