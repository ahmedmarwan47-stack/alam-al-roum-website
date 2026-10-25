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

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger };
