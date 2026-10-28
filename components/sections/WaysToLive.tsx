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
      <span className="w-12 flex-none t-label l-14 md:w-[120px]">{num}</span>
      <span className="flex-1 t-heading hd-32 md:flex-[0_0_42%]">{r.title}</span>
      <span className="order-last basis-full pl-12 t-body b-16 md:order-none md:flex-1 md:basis-auto md:pl-10">{r.body}</span>
      <span className="h-11 w-11 flex-none" />
    </div>);
  return (
    <Link href={`/experiences/${slugify(r.title)}`} data-row={i} className="group relative flex items-center gap-4 py-5 md:gap-6 lg:gap-0 lg:px-8 lg:py-8">
      {/* below lg there is no cursor to carry the photo, so each row shows its own; from lg the copy column dissolves
          (display: contents) and number, title and body are the row's own flex items, as in Figma */}
      {/* (the span, not the img, carries lg:hidden: globals.css sets img { display: block } outside any layer) */}
      <span className="block aspect-[210/267] w-[72px] flex-none overflow-hidden rounded md:w-[96px] lg:hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={r.photo} alt="" loading="lazy" className="h-full w-full object-cover" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1 lg:contents">
        <span className="t-label l-14 text-limestone-800 transition-colors duration-300 group-hover:text-teal-600 lg:w-[120px] lg:flex-none">{num}</span>
        <span className="lg:flex-[0_0_42%]"><RevealText as="h3" text={r.title} className="t-heading hd-32" /></span>
        <span data-body className="pt-1 text-limestone-800 lg:flex-1 lg:basis-auto lg:pl-10 lg:pt-0"><RevealText text={r.body} className="t-body b-16" delay={0.08} /></span>
      </span>
      <span className="grid h-11 w-11 flex-none place-items-center rounded-full border border-limestone-600 transition-[background-color,border-color,color,transform] duration-500 [transition-timing-function:var(--ease-btn)] group-hover:border-deepsea-500 group-hover:bg-deepsea-500 group-hover:text-limestone-50 group-hover:-rotate-45">
        <Icon name="arrow-right-01-sharp" size={18} /></span>
    </Link>);
}

/**
 * Ways to live, after the Understory "Services" hover: the hovered row's photo (210×267) appears in a fixed spot for
 * that row (centred on the row, in the open space between the title and the description) and only leans a few pixels
 * toward the cursor, a damped magnet, rather than following it. Moving to another row glides it to that row's spot.
 * Text the photo covers is redrawn in Tropical Teal/200 through a copy of the list clipped to the photo's rectangle.
 * Below lg (touch, no cursor) each row shows its photo as a thumbnail instead.
 */
export default function WaysToLive() {
  const rows = waysToLive.rows as R[];
  const list = useRef<HTMLDivElement>(null), card = useRef<HTMLDivElement>(null), ghost = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const el = list.current!, c = card.current!, g = ghost.current!;
    if (reducedMotion()) return;
    // the photo is a desktop (lg, mouse) effect; below lg every row carries its own photo
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (hover: hover)", () => {
      const W = 210, H = 267, GAP = 32;          // photo size; its distance from the description column
      const PULL = 0.05, MAX_X = 10, MAX_Y = 6;   // the magnet: 5 % of the cursor's offset, at most 10 px across / 6 px down
      gsap.set(c, { xPercent: -50, yPercent: -50, x: 0, y: 0, autoAlpha: 0, scale: 0.92 });
      const qx = gsap.quickTo(c, "x", { duration: 0.7, ease: "power3.out" }), qy = gsap.quickTo(c, "y", { duration: 0.7, ease: "power3.out" });
      const clip = () => { const x = +gsap.getProperty(c, "x") - W / 2, y = +gsap.getProperty(c, "y") - H / 2, s = +gsap.getProperty(c, "scale");
        const dw = (W * (1 - s)) / 2, dh = (H * (1 - s)) / 2; const o = +gsap.getProperty(c, "opacity");
        g.style.clipPath = o < 0.02 ? "inset(100%)" : `polygon(${x + dw}px ${y + dh}px, ${x + W - dw}px ${y + dh}px, ${x + W - dw}px ${y + H - dh}px, ${x + dw}px ${y + H - dh}px)`; };
      gsap.ticker.add(clip);
      // the row's resting spot (list coordinates): vertically centred on the row, its right edge GAP px before the description
      const spot = (row: HTMLElement) => {
        const b = el.getBoundingClientRect(), r = row.getBoundingClientRect(), body = row.querySelector<HTMLElement>("[data-body]")!.getBoundingClientRect();
        return { x: Math.max(W / 2, body.left - b.left - GAP - W / 2), y: r.top - b.top + r.height / 2 };
      };
      const target = (e: PointerEvent, row: HTMLElement) => {
        const b = el.getBoundingClientRect(), p = spot(row);
        return { x: p.x + gsap.utils.clamp(-MAX_X, MAX_X, (e.clientX - b.left - p.x) * PULL), y: p.y + gsap.utils.clamp(-MAX_Y, MAX_Y, (e.clientY - b.top - p.y) * PULL) };
      };
      const rowAt = (e: PointerEvent) => (e.target as HTMLElement).closest<HTMLElement>("[data-row]");
      let shown = false;
      const move = (e: PointerEvent) => {
        const row = rowAt(e); if (!row) return;
        const t = target(e, row); setActive(+row.dataset.row!);
        if (!shown) { shown = true; gsap.set(c, { x: t.x, y: t.y }); gsap.to(c, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "power3.out", overwrite: "auto" }); }
        qx(t.x); qy(t.y);
      };
      const leave = () => { shown = false; gsap.to(c, { autoAlpha: 0, scale: 0.92, duration: 0.35, ease: "power2.inOut", overwrite: "auto" }); };
      el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
      return () => { gsap.ticker.remove(clip); g.style.clipPath = "inset(100%)"; el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
    });
    return () => mm.revert();
  }, []);
  return (
    <section className="flex flex-col gap-10 bg-limestone-50 py-20 container-x">
      <SectionTitle tag={waysToLive.tag} title={waysToLive.title} body={waysToLive.body} />
      <div ref={list} className="relative flex flex-col">
        {/* rules only between the rows: none above the first, none under the last */}
        <div className="flex flex-col divide-y divide-limestone-600">{rows.map((r, i) => <Row key={r.title} i={i} r={r} />)}</div>
        <div ref={card} className="pointer-events-none invisible absolute left-0 top-0 z-10 h-[267px] w-[210px] overflow-hidden rounded shadow-[0_30px_60px_rgb(1_15_26/.25)]">
          {rows.map((r, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={r.photo} src={r.photo} alt="" className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300" style={{ opacity: i === active ? 1 : 0 }} />))}
        </div>
        <div ref={ghost} className="pointer-events-none absolute inset-0 z-20 flex flex-col divide-y divide-transparent text-teal-200" style={{ clipPath: "inset(100%)" }}>
          {rows.map((r, i) => <div key={r.title}><Row i={i} r={r} ghost /></div>)}
        </div>
      </div>
    </section>
  );
}
