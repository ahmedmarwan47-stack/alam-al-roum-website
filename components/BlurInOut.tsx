"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import { blurIn, BLOCK_FROM, photoIn, PHOTO_FROM, mediaBlurIn, MEDIA_BLUR_FROM, whenSectionEnters } from "@/components/reveal/letters";

/** Text blocks, photos and films. 15 Nov sweep: links, buttons, list items, labels and loose spans count as text too
 *  (they were the static ones: tags, captions, button rows, the footer), and the footer is covered as well as main. */
const SEL = ":is(main, footer) :is(h1, h2, h3, h4, h5, h6, p, li, blockquote, figcaption, dt, dd, label, a, button, span, img, video, [data-blur])";
/** Text-only kinds: they count only when they hold text and no photo (a card that holds a photo is entered piece by piece). */
const LOOSE = new Set(["LI", "A", "BUTTON", "SPAN", "LABEL", "DT", "DD", "FIGCAPTION", "BLOCKQUOTE"]);

type TrackEl = HTMLElement & { track?: gsap.core.Tween };

/**
 * Site-wide entrances for every text block and photo that has none of its own, as its section comes into view:
 * text blurs in as one block (RevealText's blur-in, the site's one text motion), photos and films open with the photo
 * wipe (RevealImage's). Anything that already animates is left alone — RevealText / RevealImage blocks ([data-reveal],
 * [data-reveal-img]), pinned scenes, the header, photos shown through a blend or mask, anything another animation is
 * holding hidden — and so is everything already on screen when the page opens, so nothing visible flashes out and back.
 * Text in a horizontal track (PinnedTrack) enters as the track brings it on screen, not as the section arrives.
 */
export default function BlurInOut() {
  const path = usePathname();
  useEffect(() => {
    if (reducedMotion()) return;
    let kill: (() => void) | undefined;
    const id = requestAnimationFrame(() => {
      const picked: HTMLElement[] = [];
      const heldHidden = (el: HTMLElement) => {
        for (let e: HTMLElement | null = el; e && e !== document.body; e = e.parentElement) {
          const cs = getComputedStyle(e);
          if (+cs.opacity < 0.05 || cs.visibility === "hidden") return true;
        }
        return false;
      };
      for (const el of gsap.utils.toArray<HTMLElement>(SEL)) {
        // [data-hydrate-late]: a part React hydrates later (the contact form): styling it first is a hydration mismatch
        if (el.closest("header, [data-no-blur], [data-reveal], [data-reveal-img], [aria-hidden=true], [data-hydrate-late]:not([data-hydrated])")) continue;
        if (el.closest("[class*=mix-blend], [style*=mask]")) continue;
        if (el.tagName === "IMG" && (el.closest("footer") || /\.svg($|\?)/.test((el as HTMLImageElement).src))) continue;   // logos are not photos: no wipe
        const inTrack = !!el.closest("[data-track]");
        if (el.closest(".pin-spacer") && !inTrack) continue;   // pinned scenes run their own motion
        if (LOOSE.has(el.tagName) && (!el.textContent?.trim() || el.querySelector("img, video, picture"))) continue;
        if (picked.some((p) => p.contains(el))) continue;
        const r = el.getBoundingClientRect();
        if (r.height < 8 || r.width < 4 || r.top < innerHeight) continue;
        if (heldHidden(el)) continue;
        picked.push(el);
      }
      // films marked data-media-blur (the footer's) only blur in; other photos sweep; text blurs in
      const kind = (el: HTMLElement) => (el.hasAttribute("data-media-blur") ? "soft" : el.tagName === "IMG" || el.tagName === "VIDEO" ? "photo" : "text");
      const play = (el: HTMLElement) => {
        const k = kind(el);
        if (k !== "text") return void (k === "soft" ? mediaBlurIn : photoIn)(el);
        // a CSS transition on the element (hover colours, `transition-all`) would drag every frame: off while it plays
        el.style.transition = "none";
        blurIn(el).eventCallback("onComplete", () => { el.style.transition = ""; });
      };
      picked.forEach((el) => gsap.set(el, { ...{ soft: MEDIA_BLUR_FROM, photo: PHOTO_FROM, text: BLOCK_FROM }[kind(el)] }));
      const offs = picked.map((el) => {
        const track = el.closest<TrackEl>("[data-track]");
        // in a horizontal track, what starts off to the right enters as the track carries it in
        if (track && el.getBoundingClientRect().left > innerWidth * 0.9) {
          let st: ScrollTrigger | undefined;
          const build = () => { if (st || !track.track) return;
            st = ScrollTrigger.create({ trigger: el, containerAnimation: track.track, start: "left 90%", once: true, onEnter: () => play(el) }); };
          build(); track.addEventListener("track-ready", build);
          return () => { track.removeEventListener("track-ready", build); st?.kill(); };
        }
        return whenSectionEnters(el, () => play(el));
      });
      ScrollTrigger.refresh();
      kill = () => { offs.forEach((off) => off()); gsap.set(picked, { clearProps: "opacity,filter,transform,clipPath,transition" }); };
    });
    return () => { cancelAnimationFrame(id); kill?.(); };
  }, [path]);
  return null;
}
