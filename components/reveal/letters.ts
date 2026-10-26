import { gsap } from "@/lib/gsap";

/**
 * The site's one text entrance: a block of text blurs in as a whole (never split into lines, words or letters).
 * BLOCK_FROM is its resting state before it plays; RevealText, the inner-page heroes and the About / Destination
 * choreographies all use the same values, so every text block on the site appears the same way.
 */
export const BLOCK_FROM = { opacity: 0, filter: "blur(12px)", y: 16 };
export const BLOCK_TO = { opacity: 1, filter: "blur(0px)", y: 0 };

/** Plays the blur-in on one or more blocks (staggered 0.12 s when several), 1.1 s on the long ease-out. */
export const blurIn = (els: gsap.TweenTarget, { delay = 0, duration = 1.1, stagger = 0.12 } = {}) =>
  gsap.fromTo(els, BLOCK_FROM, { ...BLOCK_TO, duration, delay, stagger, ease: "siteOut", clearProps: "filter,transform" });

/**
 * The site's one photo entrance: the frame opens upward from its bottom edge while the picture inside settles
 * back from a 1.12 zoom, 1.3 s on the mask in-out. `zoom` is the element to settle (the frame's inner layer);
 * leave it out for a bare <img>, which only wipes.
 */
export const PHOTO_FROM = { clipPath: "inset(100% 0% 0% 0%)" };
export const photoIn = (frame: Element, zoom?: Element | null, { delay = 0 } = {}) => {
  const tl = gsap.timeline({ delay, defaults: { duration: 1.3, ease: "maskInOut" } })
    .fromTo(frame, PHOTO_FROM, { clipPath: "inset(0% 0% 0% 0%)", clearProps: "clipPath" }, 0);
  if (zoom) tl.fromTo(zoom, { scale: 1.12 }, { scale: 1, ease: "siteOut", duration: 1.6, clearProps: "scale" }, 0);
  return tl;
};
