"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { gsap, reducedMotion } from "@/lib/gsap";
import { experiences } from "@/lib/experiences";

type Sub = "communities" | "experiences" | null;

/** The bar's MENU button box. CLOSE uses the same classes, in a row with the bar's height and side padding, so it sits
 *  exactly where MENU was (same x / y, typeface, size, weight, colour; the 24 px menu glyph becomes a 24 px ×). */
/* a step up from the label scale (10 Nov review: MENU read small): icon 28, word 18/28 → 20/28 from lg; CLOSE shares it */
export const MENU_BTN = "flex items-center gap-2 text-deepsea-500 t-label text-[18px] leading-7 lg:text-[20px] max-sm:-ml-[8px] max-sm:size-11 max-sm:justify-center";

/**
 * The menu glyph (12 Nov review): two lines, a little wider than the old three-line icon (32 px), that turn into a ×
 * when the menu opens and back into two lines when it closes (both lines meet in the middle and rotate ±45°).
 * The bar's MENU shows it closed; the panel's CLOSE, which opens exactly over it, shows `open`, so the lines are seen
 * to turn as the panel wipes in.
 */
export function MenuGlyph({ open = false }: { open?: boolean }) {
  const line = "absolute left-0 h-[2px] w-full rounded-full bg-current transition-transform duration-500 [transition-timing-function:cubic-bezier(.65,0,.35,1)]";
  return (
    <span aria-hidden className="relative block h-7 w-8 flex-none">
      <span className={`${line} top-[9px] ${open ? "translate-y-[4px] rotate-45" : ""}`} />
      <span className={`${line} top-[17px] ${open ? "-translate-y-[4px] -rotate-45" : ""}`} />
    </span>
  );
}

const items: [string, string | Exclude<Sub, null>][] = [
  ["Home", "/"], ["About", "/about"], ["Destination", "/destination"], ["Communities", "communities"],
  ["Experiences & Lifestyle", "experiences"], ["Sustainability", "/sustainability"], ["Media Center", "/media-center"], ["Events", "/events"],
];
/** Column 2 · Communities (Figma 11012:14516): the four featured districts, with the menu's own short lines. */
const featured: [string, string, string][] = [
  ["beachfront", "Beachfront community", "Shoreline · 7.2 km of sand"],
  ["lagoon", "Lagoon neighbourhood", "Waterways · 22 km of waterfront and lagoons"],
  ["marina-boulevard", "Marina boulevard", "Waterfront · The social heart"],
  ["golf", "Golf community", "Greens · 18 holes by the sea"],
];
const HOVER_EASE = "[transition-timing-function:cubic-bezier(.22,1,.36,1)]";   // a soft ease-out for hovers and the panel's width
const useIsoLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Menu (Figma component 11012:14922): MENU opens a 348 px Limestone panel from the left over a 25 % black scrim; click
 * outside or Escape closes it. Opening: the scrim fades up while the panel wipes open from the left edge on the site's
 * long ease-out (a reveal, not a slide, so CLOSE never moves from under the cursor), its two lines turn into a ×, and the links
 * follow a beat later, staggered, each easing 16 px in from the left. Closing plays a shorter version back. With
 * reduced motion it simply fades. Communities and Experiences & Lifestyle widen the panel to 696 px with a second
 * column (a text list since the 12 Nov review); below 720 px that column opens inline under its item.
 */
export default function SiteMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sub, setSub] = useState<Sub>(null);
  // the second column shows `view`, which follows `sub` only once the outgoing list has played out (12 Nov review: the
  // switch between Communities and Experiences, and to / from closed, is choreographed rather than a hard swap)
  const [view, setView] = useState<Sub>(null);
  const col2 = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null), scrim = useRef<HTMLDivElement>(null), panel = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);   // mounted visible: true from the moment it opens until its exit has played

  useEffect(() => {
    if (!open) { const t = setTimeout(() => setSub(null), 400); return () => clearTimeout(t); }
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", esc);
    return () => { document.documentElement.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [open, onClose]);

  useIsoLayout(() => { if (open) setShown(true); }, [open]);

  // open / close choreography
  useIsoLayout(() => {
    if (!shown) return;
    const q = gsap.utils.selector(root.current), staged = q("[data-stagger]");
    const rm = reducedMotion();
    if (open) {
      (panel.current?.querySelector("[data-close]") as HTMLElement | null)?.focus({ preventScroll: true });
      if (rm) {
        const tl = gsap.timeline().fromTo([scrim.current, panel.current], { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "none", clearProps: "opacity" });
        return () => { tl.kill(); };
      }
      const tl = gsap.timeline({ defaults: { ease: "siteOut" } })
        .fromTo(scrim.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power1.out" }, 0)
        .fromTo(panel.current, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, clearProps: "clipPath" }, 0)
        .fromTo(staged, { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.8, stagger: 0.035, clearProps: "opacity,transform" }, 0.12);
      return () => { tl.kill(); };
    }
    // closing: the links let go first, then the panel wipes back to the left edge and the scrim clears
    if (rm) {
      const tl = gsap.timeline({ onComplete: () => setShown(false) }).to([scrim.current, panel.current], { opacity: 0, duration: 0.15, ease: "none" });
      return () => { tl.kill(); gsap.set([scrim.current, panel.current], { clearProps: "opacity" }); };
    }
    const tl = gsap.timeline({ onComplete: () => setShown(false) })
      .to(staged, { opacity: 0, x: -8, duration: 0.2, stagger: { each: 0.015, from: "end" }, ease: "power2.in" }, 0)
      .fromTo(panel.current, { clipPath: "inset(0% 0% 0% 0%)" }, { clipPath: "inset(0% 100% 0% 0%)", duration: 0.55, ease: "power3.inOut" }, 0.1)
      .to(scrim.current, { opacity: 0, duration: 0.45, ease: "power1.in" }, 0.15);
    return () => { tl.kill(); gsap.set([staged, panel.current, scrim.current], { clearProps: "opacity,transform,clipPath" }); };
  }, [open, shown]);

  const toggle = (s: Exclude<Sub, null>) => setSub((v) => (v === s ? null : s));

  // outgoing: the list lets go (a short fade, drifting 8 px left, last item first), then the next one takes its place;
  // the panel narrows only after the list has gone, and widens before the new one arrives
  useEffect(() => {
    if (sub === view) return;
    const items = col2.current?.querySelectorAll("[data-sub-item]");
    if (!view || !items?.length || reducedMotion()) { setView(sub); return; }
    const tw = gsap.to(items, { opacity: 0, x: -8, duration: 0.18, stagger: { each: 0.02, from: "end" }, ease: "power2.in", onComplete: () => setView(sub) });
    return () => { tw.kill(); };
  }, [sub, view]);
  // incoming: heading, rows and button rise 14 px into place one after another, on the site's long ease-out, a beat
  // after the panel has started to widen
  useIsoLayout(() => {
    if (!view || reducedMotion()) return;
    const items = col2.current?.querySelectorAll("[data-sub-item]");
    if (!items?.length) return;
    const tw = gsap.fromTo(items, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.045, delay: 0.12, ease: "siteOut", clearProps: "opacity,transform" });
    return () => { tw.kill(); };
  }, [view]);

  const second = (which: Exclude<Sub, null>, inline = false) => (
    // inline (phone accordion): flush left with its heading (9 Nov), no indent
    <div className={`flex flex-col gap-6 ${inline ? "pb-4 pt-2" : "px-6 pb-6 pt-10"}`}>
      {!inline && <span data-sub-item className="t-body b-20 text-deepsea-500">{which === "communities" ? "Communities" : "Experiences & Lifestyle"}</span>}
      {/* 12 Nov review: text only, no thumbnails; each a larger name over its one-line description.
          Hover (darkens, never fades): a Deep Sea tint fills the row from the left, the name goes from 80 % to full Deep
          Sea and steps 6 px right, and an arrow slides in on the right; no rules between the rows */}
      <div className="-mx-3 flex flex-col">
        {(which === "communities"
          ? featured.map(([slug, name, line]) => ({ href: `/communities/${slug}`, name, line }))
          : experiences.map((x) => ({ href: `/experiences/${x.slug}`, name: x.title, line: x.note }))
        ).map(({ href, name, line }) => (
          <Link key={href} href={href} onClick={onClose} data-sub-item
            className="group relative flex items-center gap-3 overflow-hidden rounded-md px-3 py-3">
            <span aria-hidden className={`absolute inset-0 origin-left scale-x-0 bg-deepsea-500/[.06] transition-transform duration-500 ${HOVER_EASE} group-hover:scale-x-100 group-focus-visible:scale-x-100`} />
            <span className={`relative flex flex-1 flex-col gap-1 transition-transform duration-500 ${HOVER_EASE} group-hover:translate-x-1.5`}>
              <span className="t-body b-20 text-deepsea-500/80 transition-colors duration-300 group-hover:text-deepsea-500">{name}</span>
              <span className="t-body b-14 text-limestone-800 transition-colors duration-300 group-hover:text-limestone-900">{line}</span>
            </span>
            <Icon name="arrow-right-01-sharp" size={18} className={`relative -translate-x-2 text-deepsea-500 opacity-0 transition-[opacity,transform] duration-500 ${HOVER_EASE} group-hover:translate-x-0 group-hover:opacity-100`} />
          </Link>))}
      </div>
      <div data-sub-item><Button label={which === "communities" ? "View All Communities" : "View All Experiences"} href={which === "communities" ? "/communities" : "/experiences"}
        variant="outline" className="w-full" /></div>
    </div>
  );

  return (
    <div ref={root} data-site-menu className={`fixed inset-0 z-[60] ${shown ? "" : "invisible pointer-events-none"} ${open ? "" : "pointer-events-none"}`} inert={!open}>
      <div ref={scrim} onClick={onClose} className="absolute inset-0 bg-black/25" />
      <div ref={panel} id="site-menu" role="dialog" aria-modal="true" aria-label="Site menu"
        className={`absolute inset-y-0 left-0 flex w-full max-w-[348px] overflow-hidden rounded-r-lg bg-limestone-50 transition-[max-width] duration-500 ${HOVER_EASE} ${sub || view ? "min-[720px]:max-w-[696px]" : ""} max-sm:max-w-none max-sm:rounded-none`}>
        {/* Column 1 */}
        <div data-lenis-prevent className="flex h-full w-full flex-none flex-col justify-between overflow-y-auto pb-5 min-[720px]:w-[348px]">
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* the bar's own row: same height and side padding as the header, so CLOSE lands exactly on MENU (the
                hairline is an inset shadow, so it takes no height from the row) */}
            <div className="flex h-[76px] flex-none items-center px-5 shadow-[inset_0_-1px_0_rgb(7_41_60/0.15)] md:px-10">
              <button data-close onClick={onClose} className={MENU_BTN}>
                <MenuGlyph open={open} /><span className="max-sm:sr-only">CLOSE</span>
              </button>
            </div>
            {/* the links share CLOSE's left edge (the bar's gutter) */}
            <ul className="flex flex-col pr-5">
              {items.map(([label, to]) => {
                const expandable = !to.startsWith("/"), on = sub === to;
                // hover (12 Nov review: darkens, never fades): 75 % → full Deep Sea; the open section stays full Deep Sea
                const cls = `flex w-full items-center justify-between py-[10px] text-left t-body b-20 [line-height:32px] transition-colors duration-300 hover:text-deepsea-500 ${on ? "text-deepsea-500" : "text-deepsea-500/75"}`;
                return (
                  <li key={label} data-stagger className="pl-5 md:pl-10">
                    {expandable ? (
                      <>
                        <button onClick={() => toggle(to as Exclude<Sub, null>)} aria-expanded={on} className={cls}>
                          {label}<Icon name="plus-sign" size={14} className={`transition-transform duration-500 ${HOVER_EASE} ${on ? "rotate-45" : ""}`} />
                        </button>
                        {on && <div className="min-[720px]:hidden">{second(to as Exclude<Sub, null>, true)}</div>}
                      </>
                    ) : <Link href={to} onClick={onClose} className={cls}>{label}</Link>}
                  </li>);
              })}
            </ul>
          </div>
          <div data-stagger className="flex flex-col gap-5 px-5 pt-10 md:pl-10">
            {/* touch screens: each line a 40 px target */}
            <div className="flex flex-col gap-3 t-label l-16 text-deepsea-500 max-lg:gap-0">
              <Link href="/careers" onClick={onClose} className="text-deepsea-500/75 transition-colors duration-300 hover:text-deepsea-500 max-lg:py-2">Careers</Link>
              <Link href="/faq" onClick={onClose} className="text-deepsea-500/75 transition-colors duration-300 hover:text-deepsea-500 max-lg:py-2">FAQ</Link>
              <a href="tel:16922" className="flex items-center gap-2 text-limestone-800 transition-colors duration-300 hover:text-deepsea-500 max-lg:py-2"><Icon name="call" size={16} />16922</a>
            </div>
            <Button label="Register interest" href="/contact" className="w-full" />
          </div>
        </div>
        {/* Column 2 */}
        <div ref={col2} data-lenis-prevent className="hidden h-full w-[348px] flex-none overflow-y-auto bg-limestone-100 min-[720px]:block">
          {view && second(view)}
        </div>
      </div>
    </div>
  );
}
