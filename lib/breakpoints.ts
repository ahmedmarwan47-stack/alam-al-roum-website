/**
 * The site's breakpoints for JS (GSAP matchMedia, resize logic), the same edges as Tailwind's `md:` / `lg:` and the
 * `width < 48rem` / `width < 64rem` rules in globals.css. Media queries measure the viewport with the scrollbar, as
 * window.innerWidth does, so `innerWidth >= BP.lg` and `matchMedia(MQ.lg)` agree.
 */
export const BP = { md: 768, lg: 1024 } as const;

export const MQ = {
  /** tablets and up (Tailwind `md:`) */
  md: `(min-width: ${BP.md}px)`,
  /** laptops and up (Tailwind `lg:`): the desktop layouts and pinned scroll scenes */
  lg: `(min-width: ${BP.lg}px)`,
  /** phones (Tailwind `max-md:`) */
  belowMd: `(max-width: ${BP.md - 1}px)`,
  /** phones and tablets (Tailwind `max-lg:`) */
  belowLg: `(max-width: ${BP.lg - 1}px)`,
  /** desktop width with a real pointer, for hover-driven scenes */
  lgHover: `(min-width: ${BP.lg}px) and (hover: hover)`,
} as const;

/** true when the query matches now (false during SSR) */
export const matches = (q: string) => typeof window !== "undefined" && window.matchMedia(q).matches;
