import "@/lib/gsap";                       // registers ScrollTrigger + CustomEase first
import { CustomEase } from "gsap/CustomEase";

if (!CustomEase.get("aSettle")) {
  /** Figma "UI / Headline / Accent" entrance curve (Hidden → Line 1 → Shown). */
  CustomEase.create("aSettle", "0.22, 1, 0.36, 1");
  /** Figma in-out used by every About state change (Shown → Full, Rest → Scrolled, Split → Merged, beats). */
  CustomEase.create("aInOut", "0.76, 0, 0.24, 1");
}

/** A theme colour's resolved value, so GSAP can interpolate it (it can't tween between `var()` strings). */
export const token = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`).trim();
