"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { nav } from "@/lib/content";
import SiteMenu from "./SiteMenu";

/** Fixed bar: hides while scrolling down, returns on the way up. MENU opens the side menu (Figma "Menu" 11012:14922). */
export default function Navbar() {
  const bar = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY, el = bar.current; if (!el) return;
      el.style.transform = y > last && y > 120 ? "translateY(-100%)" : "translateY(0)";
      last = y;
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <>
      <header ref={bar} className="fixed inset-x-0 top-0 z-50 flex h-[76px] items-center justify-between border-b border-deepsea-500/15 bg-limestone-50 px-5 md:px-10 transition-transform duration-500 [transition-timing-function:var(--ease-site)]">
        {/* phones: the menu icon alone (a 44 px target, its glyph on the gutter), as on Discovery Land; the word from 640 up */}
        <button onClick={() => setOpen(true)} aria-expanded={open} aria-controls="site-menu"
          className="flex items-center gap-2 text-deepsea-500 t-label l-18 max-sm:-ml-[10px] max-sm:size-11 max-sm:justify-center">
          <Icon name="menu-01" size={24} /><span className="max-sm:sr-only">{nav.menu}</span></button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 max-lg:py-[14px]"><img src="/images/logotype.svg" alt="Alam Al Roum" width={255} height={22} className="h-auto w-[150px] md:w-[200px] lg:w-[255px]" /></Link>
        {/* the full register button from tablet up; below that, its arrow chip alone, so menu / logo / register stay balanced */}
        <div className="hidden md:block"><Button label={nav.cta} href="/contact" size={48} variant="primary" compact /></div>
        <Link href="/contact" aria-label={nav.cta} className="grid size-10 place-items-center rounded-lg bg-deepsea-500 text-limestone-500 md:hidden">
          <Icon name="arrow-up-right" size={20} /></Link>
      </header>
      <SiteMenu open={open} onClose={close} />
    </>
  );
}
