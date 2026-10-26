"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { communities } from "@/lib/communities";
import { experiences } from "@/lib/experiences";

type Sub = "communities" | "experiences" | null;

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

/**
 * Menu (Figma component 11012:14922): the MENU button opens a 348 px Limestone panel from the left over a 25% black
 * scrim (Move in, 0.3 s ease-out; click outside closes). The items fade and slide in. Communities and Experiences &
 * Lifestyle widen the panel to 696 px with a second column (Smart animate 0.3 s ease-out) whose thumbnails grow
 * from their centre. Below 720 px the second column opens inline under its item instead.
 */
export default function SiteMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sub, setSub] = useState<Sub>(null);
  useEffect(() => {
    if (!open) { const t = setTimeout(() => setSub(null), 300); return () => clearTimeout(t); }
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", esc);
    return () => { document.documentElement.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [open, onClose]);
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
    <div className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`} inert={!open}>
      <div onClick={onClose} className={`absolute inset-0 bg-black/25 transition-opacity duration-300 ${EASE} ${open ? "opacity-100" : "opacity-0"}`} />
      <div id="site-menu" role="dialog" aria-modal="true" aria-label="Site menu"
        className={`absolute inset-y-0 left-0 flex w-full max-w-[348px] overflow-hidden rounded-r-lg bg-limestone-50 transition-[transform,max-width] duration-300 ${EASE} ${open ? "translate-x-0" : "-translate-x-full"} ${sub ? "min-[720px]:max-w-[696px]" : ""}`}>
        {/* Column 1 */}
        <div data-lenis-prevent className="flex h-full w-full flex-none flex-col justify-between overflow-y-auto pb-5 pr-5 min-[720px]:w-[348px]">
          <div className="flex flex-col gap-8">
            <div className="flex h-[60px] flex-none items-center border-b border-deepsea-500/15 pl-5">
              <button onClick={onClose} className="flex items-center gap-2 t-label l-12 text-deepsea-500"><Icon name="cancel-01" size={14} />CLOSE</button>
            </div>
            <ul className="flex flex-col">
              {items.map(([label, to], k) => {
                const expandable = !to.startsWith("/"), on = sub === to;
                const cls = "flex w-full items-center justify-between py-[10px] text-left t-body b-20 [line-height:32px] text-deepsea-500 transition-opacity hover:opacity-60";
                return (
                  <li key={label} style={{ transitionDelay: open ? `${80 + k * 35}ms` : "0ms" }}
                    className={`pl-5 transition-[opacity,transform] duration-300 ${EASE} ${open ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"}`}>
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
          <div className="flex flex-col gap-5 pl-5 pt-10">
            <div className="flex flex-col gap-3 t-label l-16 text-deepsea-500">
              <Link href="/careers" onClick={onClose} className="hover:opacity-60">Careers</Link>
              <Link href="/faq" onClick={onClose} className="hover:opacity-60">FAQ</Link>
              <a href="tel:16922" className="flex items-center gap-2 text-limestone-800 hover:opacity-60"><Icon name="call" size={16} />16922</a>
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
