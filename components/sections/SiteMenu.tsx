"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { gsap, reducedMotion } from "@/lib/gsap";
import { communities } from "@/lib/communities";
import { experiences } from "@/lib/experiences";

type Sub = "communities" | "experiences" | null;

/** The bar's MENU button box. CLOSE uses the same classes, in a row with the bar's height and side padding, so it sits
 *  exactly where MENU was (same x / y, typeface, size, weight, colour; the 24 px menu glyph becomes a 24 px ×). */
export const MENU_BTN = "flex items-center gap-2 text-deepsea-500 t-label l-18 max-sm:-ml-[10px] max-sm:size-11 max-sm:justify-center";

const items: [string, string | Exclude<Sub, null>][] = [
  ["Home", "/"], ["About", "/about"], ["Destination", "/destination"], ["Communities", "communities"],
  ["Experiences & Lifestyle", "experiences"], ["Sustainability", "/sustainability"], ["Media Center", "/media-center"], ["Events", "/events"],
];
/** Column 2 · Communities (Figma 11012:14516): the four featured districts, with the menu's own short lines. */
const featured: [string, string, string][] = [
  ["beachfront", "Beachfront communities", "Shoreline · 7.2 km of sand"],
  ["lagoon", "Lagoon neighbourhoods", "Waterways · 22 km of waterfront and lagoons"],
  ["marina-boulevard", "Marina boulevard", "Waterfront · The social heart"],
  ["golf", "Golf community", "Greens · 18 holes by the sea"],
];
const photoOf = (slug: string) => communities.find((c) => c.slug === slug)?.photo ?? "";
const EASE = "[transition-timing-function:cubic-bezier(0,0,.58,1)]";   // Figma "Ease out"
const useIsoLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Menu (Figma component 11012:14922): MENU opens a 348 px Limestone panel from the left over a 25 % black scrim; click
 * outside or Escape closes it. Opening: the scrim fades up while the panel wipes open from the left edge on the site's
 * long ease-out (a reveal, not a slide, so CLOSE never moves from under the cursor), its × turns in, and the links
 * follow a beat later, staggered, each easing 16 px in from the left. Closing plays a shorter version back. With
 * reduced motion it simply fades. Communities and Experiences & Lifestyle widen the panel to 696 px with a second
 * column whose thumbnails grow from their centre; below 720 px that column opens inline under its item.
 */
export default function SiteMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sub, setSub] = useState<Sub>(null);
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
    const q = gsap.utils.selector(root.current), staged = q("[data-stagger]"), x = q("[data-x]");
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
        .fromTo(x, { rotate: -90 }, { rotate: 0, duration: 0.8, clearProps: "rotate" }, 0)
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

  // thumbnails mount at scale 0 and grow from their centre a frame later
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    if (!sub) return;
    let f2 = 0;
    const f1 = requestAnimationFrame(() => { f2 = requestAnimationFrame(() => setGrown(true)); });
    return () => { cancelAnimationFrame(f1); cancelAnimationFrame(f2); };
  }, [sub]);
  const toggle = (s: Exclude<Sub, null>) => { setGrown(false); setSub((v) => (v === s ? null : s)); };

  const second = (which: Exclude<Sub, null>, inline = false) => (
    <div className={`flex flex-col gap-6 ${inline ? "pb-4 pl-5 pt-2" : "px-6 pb-6 pt-10"}`}>
      {!inline && <span className="t-body b-20 text-deepsea-500">{which === "communities" ? "Communities" : "Experiences & Lifestyle"}</span>}
      {which === "communities" ? (
        <div className="flex flex-col gap-[25px]">
          {featured.map(([slug, name, line], k) => (
            <Link key={slug} href={`/communities/${slug}`} onClick={onClose} className="group flex items-center gap-[14px]">
              <span className="relative h-[45px] w-[60px] flex-none overflow-hidden rounded-[2px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoOf(slug)} alt="" style={{ transitionDelay: `${60 + k * 50}ms` }}
                  className={`absolute inset-0 h-full w-full object-cover transition-transform duration-300 ${EASE} ${grown ? "scale-100" : "scale-0"}`} />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="t-label l-14 text-deepsea-500 group-hover:underline">{name}</span>
                <span className="t-body b-14 text-limestone-800">{line}</span>
              </span>
            </Link>))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {experiences.map((x, k) => (
            <Link key={x.slug} href={`/experiences/${x.slug}`} onClick={onClose} className="group flex flex-col gap-2">
              <span className="relative aspect-[142/106] overflow-hidden rounded-[2px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={x.photo} alt="" style={{ transitionDelay: `${60 + k * 30}ms` }}
                  className={`absolute inset-0 h-full w-full object-cover transition-transform duration-300 ${EASE} ${grown ? "scale-100" : "scale-0"}`} />
              </span>
              <span className="t-label l-12 text-deepsea-500">{x.title}</span>
            </Link>))}
        </div>
      )}
      <Button label={which === "communities" ? "View All Communities" : "View All Experiences"} href={which === "communities" ? "/communities" : "/experiences"}
        variant="outline" className="w-full" />
    </div>
  );

  return (
    <div ref={root} data-site-menu className={`fixed inset-0 z-[60] ${shown ? "" : "invisible pointer-events-none"} ${open ? "" : "pointer-events-none"}`} inert={!open}>
      <div ref={scrim} onClick={onClose} className="absolute inset-0 bg-black/25" />
      <div ref={panel} id="site-menu" role="dialog" aria-modal="true" aria-label="Site menu"
        className={`absolute inset-y-0 left-0 flex w-full max-w-[348px] overflow-hidden rounded-r-lg bg-limestone-50 transition-[max-width] duration-300 ${EASE} ${sub ? "min-[720px]:max-w-[696px]" : ""} max-sm:max-w-none max-sm:rounded-none`}>
        {/* Column 1 */}
        <div data-lenis-prevent className="flex h-full w-full flex-none flex-col justify-between overflow-y-auto pb-5 min-[720px]:w-[348px]">
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* the bar's own row: same height and side padding as the header, so CLOSE lands exactly on MENU (the
                hairline is an inset shadow, so it takes no height from the row) */}
            <div className="flex h-[76px] flex-none items-center px-5 shadow-[inset_0_-1px_0_rgb(7_41_60/0.15)] md:px-10">
              <button data-close onClick={onClose} className={MENU_BTN}>
                <span data-x className="flex"><Icon name="cancel-01" size={24} /></span><span className="max-sm:sr-only">CLOSE</span>
              </button>
            </div>
            {/* the links share CLOSE's left edge (the bar's gutter) */}
            <ul className="flex flex-col pr-5">
              {items.map(([label, to]) => {
                const expandable = !to.startsWith("/"), on = sub === to;
                const cls = "flex w-full items-center justify-between py-[10px] text-left t-body b-20 [line-height:32px] text-deepsea-500 transition-opacity hover:opacity-60";
                return (
                  <li key={label} data-stagger className="pl-5 md:pl-10">
                    {expandable ? (
                      <>
                        <button onClick={() => toggle(to as Exclude<Sub, null>)} aria-expanded={on} className={cls}>
                          {label}<Icon name={on ? "minus-sign" : "plus-sign"} size={14} />
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
              <Link href="/careers" onClick={onClose} className="hover:opacity-60 max-lg:py-2">Careers</Link>
              <Link href="/faq" onClick={onClose} className="hover:opacity-60 max-lg:py-2">FAQ</Link>
              <a href="tel:16922" className="flex items-center gap-2 text-limestone-800 hover:opacity-60 max-lg:py-2"><Icon name="call" size={16} />16922</a>
            </div>
            <Button label="Register interest" href="/contact" className="w-full" />
          </div>
        </div>
        {/* Column 2 */}
        <div data-lenis-prevent className="hidden h-full w-[348px] flex-none overflow-y-auto bg-limestone-100 min-[720px]:block">
          {sub && second(sub)}
        </div>
      </div>
    </div>
  );
}
