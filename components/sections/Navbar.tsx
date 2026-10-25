"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { nav } from "@/lib/content";

/** Fixed bar: hides while scrolling down, returns on the way up. */
export default function Navbar() {
  const bar = useRef<HTMLElement>(null);
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
    <header ref={bar} className="fixed inset-x-0 top-0 z-50 flex h-[76px] items-center justify-between bg-limestone-50 container-x transition-transform duration-500 [transition-timing-function:var(--ease-site)]">
      <button className="flex items-center gap-[10px] text-deepsea-500 t-label l-18"><Icon name="menu-01" size={24} />{nav.menu}</button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <Link href="/" className="absolute left-1/2 -translate-x-1/2"><img src="/images/logotype.svg" alt="Alam Al Roum" width={255} height={22} className="h-auto w-[150px] md:w-[255px]" /></Link>
      {/* the register button needs the room of a tablet-wide bar; on phones the menu carries it */}
      <div className="hidden md:block"><Button label={nav.cta} size={48} variant="primary" /></div>
    </header>
  );
}
