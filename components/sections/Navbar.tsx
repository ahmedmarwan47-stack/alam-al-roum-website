"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { nav } from "@/lib/content";
import SiteMenu, { MENU_BTN } from "./SiteMenu";

/** Bar height; every hero runs up under it. */
const BAR_H = 76;

/** The page's hero: one marked `data-hero`, else the first block after the bar (GSAP's pin-spacer once a hero is pinned). */
const heroOf = (bar: HTMLElement) => document.querySelector<HTMLElement>("[data-hero]")
  ?? ([...(bar.parentElement?.children ?? [])].find((c) => c !== bar && !c.hasAttribute("data-site-menu")) as HTMLElement | undefined);

/**
 * Fixed glass bar (a Limestone gradient over a backdrop blur, `.nav-glass`), so the hero's photo or film shows
 * through it. Over a full-bleed photo or film hero (`data-nav="light"`: Home, the single pages) the bar is all but
 * clear instead (`.nav-veil`, 29 Oct review) and its MENU and logo turn Limestone. It stays put until the hero has scrolled past it (pinned heroes included), then hides while scrolling
 * down and returns on the way up, with a hairline once it sits over the page. MENU opens the side menu (Figma "Menu"
 * 11012:14922), whose CLOSE takes MENU's exact place.
 */
export default function Navbar() {
  const bar = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    const el = bar.current!;
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY, hero = heroOf(el);
      const past = !hero || hero.getBoundingClientRect().bottom <= BAR_H;
      el.dataset.over = past ? "page" : hero?.closest("[data-nav=light]") || hero?.querySelector("[data-nav=light]") ? "media" : "hero";
      el.style.transform = past && y > last && y > 120 ? "translateY(-100%)" : "translateY(0)";
      last = y;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <>
      <header ref={bar} data-over="hero" className="group/bar fixed inset-x-0 top-0 z-50 flex h-[76px] items-center justify-between px-5 md:px-10 transition-transform duration-500 [transition-timing-function:var(--ease-site)]">
        <div aria-hidden className="nav-glass pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500 group-data-[over=media]/bar:opacity-0" />
        <div aria-hidden className="nav-veil pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-data-[over=media]/bar:opacity-100" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-deepsea-500/12 opacity-0 transition-opacity duration-500 group-data-[over=page]/bar:opacity-100" />
        {/* phones: the menu icon alone (a 44 px target, its glyph on the gutter), as on Discovery Land; the word from 640 up.
            SiteMenu's CLOSE copies this box exactly (MENU_BTN), so it opens where the cursor already is */}
        <button onClick={() => setOpen(true)} aria-expanded={open} aria-controls="site-menu" className={`${MENU_BTN} transition-colors duration-500 group-data-[over=media]/bar:text-limestone-50 group-data-[over=media]/bar:drop-shadow-[0_1px_6px_rgb(1_15_26/.45)]`}>
          <Icon name="menu-01" size={24} /><span className="max-sm:sr-only">{nav.menu}</span></button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 max-lg:py-[14px]"><img src="/images/logotype.svg" alt="Alam Al Roum" width={255} height={22} className="h-auto w-[150px] transition-[filter] duration-500 group-data-[over=media]/bar:brightness-0 group-data-[over=media]/bar:invert group-data-[over=media]/bar:drop-shadow-[0_1px_6px_rgb(1_15_26/.45)] md:w-[200px] lg:w-[255px]" /></Link>
        {/* the full register button from tablet up; below that, its arrow chip alone, so menu / logo / register stay balanced */}
        <div className="hidden md:block"><Button label={nav.cta} href="/contact" size={48} variant="primary" compact /></div>
        <Link href="/contact" aria-label={nav.cta} className="grid size-10 place-items-center rounded-lg bg-deepsea-500 text-limestone-500 md:hidden">
          <Icon name="arrow-up-right" size={20} /></Link>
      </header>
      <SiteMenu open={open} onClose={close} />
    </>
  );
}
