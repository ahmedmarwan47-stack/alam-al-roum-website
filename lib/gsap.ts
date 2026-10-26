import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, CustomEase);
ScrollTrigger.config({ ignoreMobileResize: true });

if (!CustomEase.get("siteOut")) {
  /** Long, soft ease-out for text lines. */
  CustomEase.create("siteOut", "0.16, 1, 0.3, 1");
  /** Hassan Allam's image mask: slow start, fast middle, long settle (~1 s). */
  CustomEase.create("maskInOut", "0.77, 0, 0.18, 1");
  /** Landmarks slide wipe (Figma prototype curve). */
  CustomEase.create("slideWipe", "0.165, 0.84, 0.44, 1");
}

/**
 * Reading hold: how far (in viewport heights of scroll) a pinned, scroll-scrubbed section rests on its finished
 * state before the page moves on, so its copy can be read without stopping the scroll at one exact point.
 */
export const HOLD_VH = 0.5;

/**
 * Appends a reading hold to a scrubbed timeline whose motion is meant to take `motionVh` viewports of scroll, and
 * returns the pin length to use (motion + hold, in viewports). Call it once the timeline is fully built.
 */
export const withHold = (tl: gsap.core.Timeline, motionVh: number, holdVh = HOLD_VH) => {
  tl.to({}, { duration: (tl.duration() * holdVh) / motionVh });
  return motionVh + holdVh;
};

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger };
