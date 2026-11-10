import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * The site's one text entrance: a block of text blurs in as a whole (never split into lines, words or letters).
 * BLOCK_FROM is its resting state before it plays; RevealText, the inner-page heroes and the About / Destination
 * choreographies all use the same values, so every text block on the site appears the same way.
 */
export const BLOCK_FROM = { opacity: 0, filter: "blur(12px)", y: 16 };
// NEVER hand these shared objects to GSAP as they are: always a copy (`{ ...BLOCK_FROM }`). gsap.set and every
// timeline method write into the vars they are given (duration, immediateRender and, on a timeline, `parent`), so one
// `tl.set(x, BLOCK_FROM)` (About, The Story) made every later `gsap.set(el, BLOCK_FROM)` on the page join that pinned
// timeline; each ScrollTrigger.refresh (an FAQ opening) then rewound them and hid the text again (10 Nov).
export const BLOCK_TO = { opacity: 1, filter: "blur(0px)", y: 0 };

/** Plays the blur-in on one or more blocks (staggered 0.12 s when several), 1.1 s on the long ease-out. */
export const blurIn = (els: gsap.TweenTarget, { delay = 0, duration = 1.1, stagger = 0.12 } = {}) =>
  gsap.fromTo(els, { ...BLOCK_FROM }, { ...BLOCK_TO, duration, delay, stagger, ease: "siteOut", clearProps: "filter,transform" });

/**
 * The site's photo entrance: the frame opens upward from its bottom edge, its blur clearing, while the picture
 * inside settles back from a 1.12 zoom, 1.3 s on the mask in-out. `zoom` is the element to settle (the frame's inner
 * layer); leave it out for a bare <img>, which only wipes and sharpens.
 */
export const PHOTO_FROM = { clipPath: "inset(100% 0% 0% 0%)", filter: "blur(16px)" };
export const photoIn = (frame: Element, zoom?: Element | null, { delay = 0 } = {}) => {
  const tl = gsap.timeline({ delay, defaults: { duration: 1.3, ease: "maskInOut" } })
    .fromTo(frame, { ...PHOTO_FROM }, { clipPath: "inset(0% 0% 0% 0%)", clearProps: "clipPath" }, 0)
    .to(frame, { filter: "blur(0px)", duration: 1.5, ease: "siteOut", clearProps: "filter" }, 0.15);
  if (zoom) tl.fromTo(zoom, { scale: 1.12 }, { scale: 1, ease: "siteOut", duration: 1.6, clearProps: "scale" }, 0);
  return tl;
};

/**
 * Blur-only media entrance, for media that should simply appear rather than sweep in (the CTA and footer films,
 * the community coins): it fades up from a soft 20 px blur, 1.4 s on the long ease-out.
 */
export const MEDIA_BLUR_FROM = { opacity: 0, filter: "blur(20px)" };
export const mediaBlurIn = (el: Element, { delay = 0 } = {}) =>
  gsap.fromTo(el, { ...MEDIA_BLUR_FROM }, { opacity: 1, filter: "blur(0px)", duration: 1.4, delay, ease: "siteOut", clearProps: "filter,opacity" });

/**
 * When entrances play: once, as the section that holds `el` starts coming into view (its top reaches 85 % of the
 * viewport), so every block of a section is in place together by the time you reach it, rather than each one
 * waiting for its own spot on screen. Plays at once if the page is already past that point.
 */
export const whenSectionEnters = (el: Element, play: () => void) => onceInView(el.closest("section, header, footer") ?? el, "top 85%", play);

/**
 * Plays `play` once, when `trigger` reaches `start` (a ScrollTrigger start such as "top 80%"). Every entrance that
 * starts from a hidden state goes through here, never through a bare `once` ScrollTrigger: see the fail-safe below.
 * Returns the cleanup.
 */
export const onceInView = (trigger: Element, start: string, play: () => void) => {
  let done = false, io: IntersectionObserver | undefined;
  const sec = trigger;
  const go = () => { if (!done) { done = true; play(); io?.disconnect(); } };
  const st = ScrollTrigger.create({ trigger: sec, start, once: true, onEnter: go });
  const id = requestAnimationFrame(() => { if (st.scroll() >= st.start) go(); });
  // fail-safe (9 Nov, the About timeline title stayed at opacity 0 on the live site): a ScrollTrigger start measured
  // while the page was still settling (pinned scenes, fonts, a restored scroll position) can miss its moment, and a
  // `once` trigger never fires again. The browser's own visibility check plays the entrance whenever the section is
  // actually on screen, so text can never stay hidden in view.
  if (!done) {
    io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) go(); }, { rootMargin: "0px 0px -15% 0px" });
    io.observe(sec);
  }
  return () => { cancelAnimationFrame(id); st.kill(); io?.disconnect(); };
};
