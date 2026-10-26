"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { nav, footer } from "@/lib/content";
import { routes } from "@/lib/routes";

/** Fixed bar: hides while scrolling down, returns on the way up. MENU opens a full-screen Deep Sea panel with every page. */
export default function Navbar() {
  const bar = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const path = usePathname();
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
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", esc);
    return () => { document.documentElement.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [open]);
  const links = [...footer.discover, ...footer.more];
  return (
    <>
      <header ref={bar} className="fixed inset-x-0 top-0 z-50 flex h-[76px] items-center justify-between bg-limestone-50 container-x transition-transform duration-500 [transition-timing-function:var(--ease-site)]">
        <button onClick={() => setOpen(true)} aria-expanded={open} aria-controls="site-menu" className="flex items-center gap-[10px] text-deepsea-500 t-label l-18"><Icon name="menu-01" size={24} />{nav.menu}</button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2"><img src="/images/logotype.svg" alt="Alam Al Roum" width={255} height={22} className="h-auto w-[150px] md:w-[255px]" /></Link>
        {/* the register button needs the room of a tablet-wide bar; on phones the menu carries it */}
        <div className="hidden md:block"><Button label={nav.cta} href="/contact" size={48} variant="primary" /></div>
      </header>
      <div id="site-menu" role="dialog" aria-modal="true" aria-label="Site menu" inert={!open}
        className={`fixed inset-0 z-[60] flex flex-col bg-deepsea-500 text-limestone-50 container-x transition-[clip-path] duration-700 [transition-timing-function:var(--ease-site)] ${open ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]"}`}>
        <div className="flex h-[76px] flex-none items-center justify-between">
          <button onClick={() => setOpen(false)} className="flex items-center gap-[10px] t-label l-18"><Icon name="cancel-01" size={24} />Close</button>
          <div className="hidden md:block"><Button label={nav.cta} href="/contact" size={48} variant="light" /></div>
        </div>
        <nav className="flex flex-1 flex-col justify-between gap-10 overflow-y-auto py-10 lg:flex-row lg:items-end">
          <ul className="flex flex-col gap-1">
            {links.map((l, k) => (
              <li key={l} className="overflow-hidden">
                <Link href={routes[l]} onClick={() => setOpen(false)}
                  style={{ transitionDelay: open ? `${150 + k * 40}ms` : "0ms" }}
                  className={`inline-block t-heading hd-48 transition-[transform,opacity] duration-700 [transition-timing-function:var(--ease-site)] hover:opacity-60 ${open ? "translate-y-0" : "translate-y-full"} ${routes[l] === path ? "text-teal-300" : ""}`}>{l}</Link>
              </li>))}
          </ul>
          <div className="flex flex-col gap-3 t-text x-16 text-limestone-50/80">
            <Link href="/contact" onClick={() => setOpen(false)} className="t-label l-14 text-limestone-50">Contact Us</Link>
            <a href="tel:16922">16922</a>
            <a href="mailto:info@alamalroumegypt.com">info@alamalroumegypt.com</a>
            <span>{footer.address.join(", ")}</span>
          </div>
        </nav>
      </div>
    </>
  );
}
