"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import { slugify } from "@/lib/routes";
import Icon from "@/components/ui/Icon";
import RevealText from "@/components/reveal/RevealText";
import SectionTitle from "./SectionTitle";
import { waysToLive } from "@/lib/content";

type R = { title: string; body: string; photo: string };

/** One row. `ghost` renders the same layout as plain light text for the clipped overlay. */
function Row({ i, r, ghost }: { i: number; r: R; ghost?: boolean }) {
  const num = String(i + 1).padStart(2, "0");
  if (ghost) return (
    <div className="flex flex-wrap items-center gap-y-2 py-6 md:flex-nowrap md:px-8 md:py-8" aria-hidden>
      <span className="w-12 t-label l-14 md:w-[120px]">{num}</span>
      <span className="flex-1 t-heading hd-32 md:flex-[0_0_42%]">{r.title}</span>
      <span className="order-last basis-full pl-12 t-body b-16 md:order-none md:flex-1 md:basis-auto md:pl-10">{r.body}</span>
      <span className="h-11 w-11" />
    </div>);
  return (
    <Link href={`/experiences/${slugify(r.title)}`} data-row={i} className="group relative flex flex-wrap items-center gap-y-2 border-b border-limestone-600 py-6 md:flex-nowrap md:px-8 md:py-8">
      <span className="w-12 t-label l-14 text-limestone-800 transition-colors duration-300 group-hover:text-teal-600 md:w-[120px]">{num}</span>
      <span className="flex-1 md:flex-[0_0_42%]"><RevealText as="h3" text={r.title} className="t-heading hd-32" /></span>
      <span className="order-last basis-full pl-12 text-limestone-800 md:order-none md:flex-1 md:basis-auto md:pl-10"><RevealText text={r.body} className="t-body b-16" delay={0.08} /></span>
      <span className="grid h-11 w-11 place-items-center rounded-full border border-limestone-600 transition-[background-color,border-color,color,transform] duration-500 [transition-timing-function:var(--ease-btn)] group-hover:border-deepsea-500 group-hover:bg-deepsea-500 group-hover:text-limestone-50 group-hover:-rotate-45">
        <Icon name="arrow-right-01-sharp" size={18} /></span>
    </Link>);
}

/**
 * Ways to live, after the Understory "Services" hover: the hovered row's photo (210×267) trails the
 * cursor on a soft catch-up (~0.45 s), and the text it passes over is redrawn in Tropical Teal/200
 * through a copy of the list clipped to the photo's rectangle.
 */
export default function WaysToLive() {
  const rows = waysToLive.rows as R[];
  const list = useRef<HTMLDivElement>(null), card = useRef<HTMLDivElement>(null), ghost = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const el = list.current!, c = card.current!, g = ghost.current!;
    if (reducedMotion() || matchMedia("(hover: none)").matches) return;
    const W = 210, H = 267;
    gsap.set(c, { xPercent: -50, yPercent: -50, x: 0, y: 0, autoAlpha: 0, scale: 0.85 });
    const qx = gsap.quickTo(c, "x", { duration: 0.45, ease: "power3.out" }), qy = gsap.quickTo(c, "y", { duration: 0.45, ease: "power3.out" });
    const clip = () => { const x = +gsap.getProperty(c, "x") - W / 2, y = +gsap.getProperty(c, "y") - H / 2, s = +gsap.getProperty(c, "scale");
      const dw = (W * (1 - s)) / 2, dh = (H * (1 - s)) / 2; const o = +gsap.getProperty(c, "opacity");
      g.style.clipPath = o < 0.02 ? "inset(100%)" : `polygon(${x + dw}px ${y + dh}px, ${x + W - dw}px ${y + dh}px, ${x + W - dw}px ${y + H - dh}px, ${x + dw}px ${y + H - dh}px)`; };
    gsap.ticker.add(clip);
    const move = (e: PointerEvent) => { const b = el.getBoundingClientRect(); qx(e.clientX - b.left); qy(e.clientY - b.top);
      const row = (e.target as HTMLElement).closest<HTMLElement>("[data-row]"); if (row) setActive(+row.dataset.row!); };
    const enter = (e: PointerEvent) => { const b = el.getBoundingClientRect(); gsap.set(c, { x: e.clientX - b.left, y: e.clientY - b.top });
      gsap.to(c, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power3.out" }); };
    const leave = () => gsap.to(c, { autoAlpha: 0, scale: 0.85, duration: 0.35, ease: "power2.inOut" });
    el.addEventListener("pointermove", move); el.addEventListener("pointerenter", enter); el.addEventListener("pointerleave", leave);
    return () => { gsap.ticker.remove(clip); el.removeEventListener("pointermove", move); el.removeEventListener("pointerenter", enter); el.removeEventListener("pointerleave", leave); };
  }, []);
  return (
    <section className="flex flex-col gap-10 bg-limestone-50 py-20 container-x">
      <SectionTitle tag={waysToLive.tag} title={waysToLive.title} body={waysToLive.body} />
      <div ref={list} className="relative flex flex-col">
        {rows.map((r, i) => <Row key={r.title} i={i} r={r} />)}
        <div ref={card} className="pointer-events-none invisible absolute left-0 top-0 z-10 h-[267px] w-[210px] overflow-hidden rounded shadow-[0_30px_60px_rgb(1_15_26/.25)]">
          {rows.map((r, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={r.photo} src={r.photo} alt="" className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300" style={{ opacity: i === active ? 1 : 0 }} />))}
        </div>
        <div ref={ghost} className="pointer-events-none absolute inset-0 z-20 flex flex-col text-teal-200" style={{ clipPath: "inset(100%)" }}>
          {rows.map((r, i) => <div key={r.title} className="border-b border-transparent"><Row i={i} r={r} ghost /></div>)}
        </div>
      </div>
    </section>
  );
}
