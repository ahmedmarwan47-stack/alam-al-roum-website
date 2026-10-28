"use client";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Button from "@/components/ui/Button";
import Drawer from "@/components/ui/Drawer";
import Icon from "@/components/ui/Icon";
import RevealImage from "@/components/reveal/RevealImage";

export type MapPin = { title: string; body: string; x: number; y: number; photo: string; href?: string; side?: "left" | "right" };
/** The box of the master plan a map shows, in plan units (lib/masterplan.ts); pins use the same units. */
export type MapView = { x: number; y: number; w: number; h: number };
const FULL: MapView = { x: 0, y: 0, w: 1512, h: 839 };

/**
 * Aerial masterplan with Interactive-Hotspots pins (Figma Masterplan Pin): hover shows the name, click opens the card.
 * Below lg (phones, tablets: touch, no hover) a floating card would cover its neighbours: a tapped pin opens its card
 * in the side drawer instead. On phones the map is drawn at 180vw in a sideways-swipeable strip, opened on the pins,
 * so the pins sit far enough apart to tap and the plan is big enough to read.
 * `view` is the part of the master plan the image shows (default: all of it); pins outside it are left out.
 * `labels` keeps every pin's name on show from xl (1280 px; below that the names would touch) rather than on hover; `phoneScale` widens the phone strip for
 * a map with many close pins (About's eleven places).
 */
export default function MasterplanMap({ image, pins: all, initial = 0, view = FULL, labels = false, phoneScale = 1 }:
  { image: string; pins: MapPin[]; initial?: number; view?: MapView; labels?: boolean; phoneScale?: number }) {
  const pins = useMemo(() => all.filter((p) => p.x >= view.x && p.x <= view.x + view.w && p.y >= view.y && p.y <= view.y + view.h), [all, view]);
  const fx = (p: MapPin) => (p.x - view.x) / view.w, fy = (p: MapPin) => (p.y - view.y) / view.h;
  const [open, setOpen] = useState(initial);
  const [phone, setPhone] = useState(false), [sheet, setSheet] = useState(false), [last, setLast] = useState(0);
  const closeSheet = useCallback(() => setSheet(false), []);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)"), sync = () => setPhone(mq.matches);
    sync(); mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  // phones: open the swipeable strip on the pins (their span fits one screen at 180vw), or on the open community's pin
  const pan = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sc = pan.current; if (!sc || !window.matchMedia("(max-width: 767px)").matches) return;
    const xs = pins.map((p) => ((p.x - view.x) / view.w) * sc.scrollWidth), mid = (Math.min(...xs) + Math.max(...xs)) / 2;
    const k = pins[initial] ? xs[initial] : mid, edge = 56;
    const c = k < mid - sc.clientWidth / 2 + edge || k > mid + sc.clientWidth / 2 - edge ? k : mid;
    sc.scrollLeft = c - sc.clientWidth / 2;
  }, [pins, initial, view]);
  const tap = (k: number) => { if (phone) { setLast(k); setSheet(true); } else setOpen(open === k ? -1 : k); };
  const d = pins[last];
  // the card and the hover label open to the right of a pin unless that would run past the map's edge
  const box = useRef<HTMLDivElement>(null), [w, setW] = useState(1512);
  useEffect(() => {
    const el = box.current; if (!el) return;
    const ro = new ResizeObserver(() => setW(el.offsetWidth)); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="w-full overflow-x-clip">
    <div ref={pan} className="max-md:overflow-x-auto max-md:overscroll-x-contain max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden">
    {/* phones: the strip keeps the Home map's height (180vw at 1512:839), so a wider view is a longer strip */}
    <div ref={box} className="relative w-full max-md:w-[var(--strip)]"
      style={{ aspectRatio: `${view.w} / ${view.h}`, "--strip": `${(180 * phoneScale * (view.w / view.h)) / (1512 / 839)}vw` } as CSSProperties}>
      <RevealImage src={image} className="absolute inset-0 rounded-lg" />
      {pins.map((p, k) => {
        const on = phone ? sheet && last === k : open === k, px = fx(p) * w, right = px + 28 + 300 <= w - 12;
        const labelRight = p.side ? p.side === "right" : px + 28 + 200 <= w;
        return (
          <div key={p.title} className={`group absolute ${on ? "z-20" : "z-10"}`} style={{ left: `${fx(p) * 100}%`, top: `${fy(p) * 100}%` }}>
            {/* Pulse ring: 56px at rest (breathing), grows to 72px on hover — Figma Masterplan Pin, 0.25 s ease-out */}
            {/* the ring never takes a tap: on a phone the pins sit close and a ring would cover its neighbour's button */}
            <span className={`pointer-events-none absolute left-0 top-0 h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-limestone-50/60 transition-transform duration-[250ms] [transition-timing-function:var(--ease-fig-out)] ${on ? "scale-100" : "scale-[.78] group-hover:scale-100"}`}>
              {!on && <span className="absolute inset-0 animate-ping rounded-full border border-limestone-50/50 [animation-duration:2.4s]" />}
            </span>
            {/* below lg the 36px pin takes taps over a 44px circle. The pin is in flow, so this wrapper is 36px wide from
                the pin's centre: a label or card on the left hangs off its left edge (right-full), 28px clear of the centre */}
            <button onClick={() => tap(k)} aria-label={p.title}
              className={`relative grid h-9 w-9 max-lg:before:absolute max-lg:before:-inset-1 max-lg:before:rounded-full -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full transition-colors duration-[250ms] [transition-timing-function:var(--ease-fig-out)] ${on ? "bg-deepsea-500 text-limestone-50" : "bg-limestone-50 text-deepsea-500 group-hover:bg-deepsea-500 group-hover:text-limestone-50"}`}>
              <Icon name="plus-sign" size={16} className={`transition-transform duration-300 [transition-timing-function:var(--ease-fig-out)] ${on ? "rotate-45" : ""}`} />
            </button>
            {!on && <span className={`pointer-events-none absolute top-0 hidden -translate-y-1/2 whitespace-nowrap lg:block ${labelRight ? "left-7" : "right-full mr-7"} rounded-full bg-limestone-50 px-[14px] py-2 t-label l-14 shadow-[0_2px_10px_rgb(1_15_26/.18)] transition-opacity duration-[250ms] [transition-timing-function:var(--ease-fig-out)] ${labels ? "opacity-0 group-hover:opacity-100 xl:opacity-100" : "opacity-0 group-hover:opacity-100"}`}>{p.title}</span>}
            {on && <PinCard p={p} className={`absolute -top-[76px] hidden w-[300px] lg:flex ${right ? "left-7 origin-left" : "right-full mr-7 origin-right"}`} />}
          </div>
        );
      })}
    </div>
    </div>
    <p className="mt-4 px-[var(--gutter)] t-label l-14 text-limestone-800 lg:hidden"><span className="md:hidden">Swipe the map, tap a pin to explore</span><span className="hidden md:inline">Tap a pin to explore</span></p>
    {/* phones and tablets: the Figma Drawer, as on the hotel and unit cards */}
    {d && <Drawer open={sheet} onClose={closeSheet} label={d.title}
      footer={d.href ? <div><Button label="Explore" href={d.href} size={54} variant="primary" /></div> : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={d.photo} alt={d.title} loading="lazy" className="h-[260px] w-full rounded-[2px] object-cover" />
      <div className="flex flex-col gap-3">
        <h3 className="t-heading hd-32">{d.title}</h3>
        <p className="t-body b-16 text-limestone-800">{d.body}</p>
      </div>
    </Drawer>}
    </div>
  );
}

/** Masterplan Pin · Active tooltip card: image, Heading/20 title, Body/14 description, Explore (0.3 s ease-out). */
function PinCard({ p, className }: { p: MapPin; className: string }) {
  return (
    <div className={`flex-col gap-3 rounded-xl bg-limestone-50 p-3 pb-4 shadow-[0_16px_40px_rgb(0_0_0/.16)] animate-[pinCard_.3s_var(--ease-fig-out)_both] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.photo} alt="" className="h-[150px] w-full rounded-lg object-cover" />
      <span className="t-heading hd-20">{p.title}</span>
      <span className="t-body b-14 text-limestone-800">{p.body}</span>
      {p.href && <span><Button label="Explore" href={p.href} variant="outline" /></span>}
    </div>
  );
}
