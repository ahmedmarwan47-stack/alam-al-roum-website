"use client";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Button from "@/components/ui/Button";
import Drawer from "@/components/ui/Drawer";
import Icon from "@/components/ui/Icon";
import RevealImage from "@/components/reveal/RevealImage";
import { srcSet } from "@/lib/img";
import { MQ, matches } from "@/lib/breakpoints";

/** `n` is the number drawn in the pin (default: its place among the map's pins); `kind: "gate"` draws a gate. */
export type MapPin = { title: string; body: string; x: number; y: number; photo: string; href?: string; side?: "left" | "right"; n?: number; kind?: "gate" };
/** The box of the master plan a map shows, in plan units (lib/masterplan.ts); pins use the same units. */
export type MapView = { x: number; y: number; w: number; h: number };
const FULL: MapView = { x: 0, y: 0, w: 1512, h: 839 };

/** One numbered place: a row in the phone list, drawn as one or more pins (a place can be marked in several spots). */
type Item = { key: string; n: number; gate: boolean; pins: number[] };

/**
 * Aerial masterplan with Interactive-Hotspots pins (Figma Masterplan Pin): hover shows the name, click opens the card.
 * Highlights are limestone pins, gates smaller rust ones. On desktop each pin is a plus that turns to a cross when open;
 * below lg, where the map has its list, each highlight shows its number instead and a gate is a plain rust dot.
 * Below lg the gates are one place ("City gates", one row and one sheet, 9 Nov): seven chips with the same text read
 * as noise, and their numbers clashed with the highlights' 1–7 on the map.
 * Below lg (phones, tablets: touch, no hover) a floating card would cover its neighbours, so the map is followed by a
 * numbered list of its places, and a pin or a row opens that place in the bottom sheet (photo, text, Explore, and
 * previous / next through the list). A row also slides the map to its pin, and the chosen place stays highlighted on
 * the map after the sheet closes. On phones the map is drawn wide in a sideways-swipeable strip, opened on the pins,
 * so the pins sit far enough apart to tap and the plan is big enough to read.
 * `view` is the part of the master plan the image shows (default: all of it); pins outside it are left out.
 * `labels` keeps every pin's name on show from xl (1280 px; below that the names would touch) rather than on hover;
 * `phoneScale` widens the phone strip for a map with many close pins (About's board).
 */
export default function MasterplanMap({ image, pins: all, initial = 0, view = FULL, labels = false, phoneScale = 1 }:
  { image: string; pins: MapPin[]; initial?: number; view?: MapView; labels?: boolean; phoneScale?: number }) {
  const pins = useMemo(() => all.filter((p) => p.x >= view.x && p.x <= view.x + view.w && p.y >= view.y && p.y <= view.y + view.h), [all, view]);
  const fx = useCallback((p: MapPin) => (p.x - view.x) / view.w, [view]), fy = (p: MapPin) => (p.y - view.y) / view.h;

  // the numbered places: highlights in number order, then the gates; unnumbered pins count up in list order
  const { items, itemOf } = useMemo(() => {
    const byKey = new Map<string, Item>(), itemOf: string[] = [];
    let auto = 0;
    pins.forEach((p, k) => {
      // all the gates are one place, keyed "g"
      const gate = p.kind === "gate", n = gate ? 0 : p.n ?? ++auto, key = gate ? "g" : `p${n}`;
      itemOf.push(key);
      const it = byKey.get(key);
      if (it) it.pins.push(k); else byKey.set(key, { key, n, gate, pins: [k] });
    });
    const items = [...byKey.values()].sort((a, b) => Number(a.gate) - Number(b.gate) || a.n - b.n);
    return { items, itemOf };
  }, [pins]);
  const places = items.filter((i) => !i.gate), gates = items.filter((i) => i.gate);
  // many pins (About's board): no breathing rings at rest, so the map stays readable
  const calm = pins.length > 8;

  const [open, setOpen] = useState(initial);
  const [phone, setPhone] = useState(false), [sheet, setSheet] = useState(false), [active, setActive] = useState<string | null>(null);
  const closeSheet = useCallback(() => setSheet(false), []);
  useEffect(() => {
    const mq = window.matchMedia(MQ.belowLg), sync = () => setPhone(mq.matches);
    sync(); mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  // phones: open the swipeable strip on the pins (their span fits one screen at 180vw), or on the open community's pin
  const pan = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sc = pan.current; if (!sc || !matches(MQ.belowMd)) return;
    const xs = pins.map((p) => fx(p) * sc.scrollWidth), mid = (Math.min(...xs) + Math.max(...xs)) / 2;
    const k = pins[initial] ? xs[initial] : mid, edge = 56;
    const c = k < mid - sc.clientWidth / 2 + edge || k > mid + sc.clientWidth / 2 - edge ? k : mid;
    sc.scrollLeft = c - sc.clientWidth / 2;
  }, [pins, initial, fx]);
  // slide the phone strip so a pin sits in the middle of the screen
  const reveal = useCallback((k: number) => {
    const sc = pan.current; if (!sc || sc.scrollWidth <= sc.clientWidth || !pins[k]) return;
    sc.scrollTo({ left: fx(pins[k]) * sc.scrollWidth - sc.clientWidth / 2, behavior: "smooth" });
  }, [pins, fx]);
  const show = (key: string, slide: boolean) => {
    const it = items.find((i) => i.key === key); if (!it) return;
    setActive(key); setSheet(true);
    if (slide) reveal(it.pins[0]);
  };
  const tap = (k: number) => { if (phone) show(itemOf[k], false); else setOpen(open === k ? -1 : k); };
  const at = items.findIndex((i) => i.key === active), cur = items[at];
  const step = (by: number) => { const next = items[(at + by + items.length) % items.length]; setActive(next.key); reveal(next.pins[0]); };
  const first = cur ? pins[cur.pins[0]] : undefined;
  const d = first && cur?.gate ? { ...first, title: GATES_TITLE, body: `The city's ${cur.pins.length} gates, each staffed around the clock.` } : first;

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
      <RevealImage src={image} className="absolute inset-0" />
      {pins.map((p, k) => {
        const it = items.find((i) => i.key === itemOf[k])!, gate = it.gate;
        const on = phone ? active === it.key : open === k, px = fx(p) * w, right = px + 28 + 300 <= w - 12;
        const labelRight = p.side ? p.side === "right" : px + 28 + 200 <= w;
        return (
          <div key={`${p.title}-${k}`} className={`group absolute ${on ? "z-20" : "z-10 hover:z-20"}`} style={{ left: `${fx(p) * 100}%`, top: `${fy(p) * 100}%` }}>
            {/* Pulse ring: 56px at rest (breathing), grows to 72px on hover — Figma Masterplan Pin, 0.25 s ease-out */}
            {/* the ring never takes a tap: on a phone the pins sit close and a ring would cover its neighbour's button */}
            <span className={`pointer-events-none absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-limestone-50/60 transition-[transform,opacity] duration-[250ms] [transition-timing-function:var(--ease-fig-out)] ${gate ? "h-[52px] w-[52px]" : "h-[64px] w-[64px]"} ${on ? "scale-100" : "scale-[.78] group-hover:scale-100"} ${calm && !on ? "opacity-0 group-hover:opacity-100" : ""}`}>
              {!on && !calm && <span className="absolute inset-0 animate-ping rounded-full border border-limestone-50/50 [animation-duration:2.4s]" />}
            </span>
            {/* below lg the pin takes taps over a circle 8px wider. The pin is in flow, so this wrapper is the pin's
                width from its centre: a label or card on the left hangs off its left edge (right-full), 28px clear */}
            <button onClick={() => tap(k)} aria-label={gate ? p.title : `${it.n}. ${p.title}`}
              className={`relative grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full shadow-[0_2px_8px_rgb(1_15_26/.25)] transition-colors duration-[250ms] [transition-timing-function:var(--ease-fig-out)] max-lg:before:absolute max-lg:before:-inset-1 max-lg:before:rounded-full
                ${gate ? "h-4 w-4 lg:h-[26px] lg:w-[26px]" : "h-7 w-7 text-[12px] lg:h-8 lg:w-8 lg:text-[14px]"}
                ${on ? "bg-deepsea-500 text-limestone-50 ring-2 ring-limestone-50" : gate ? "bg-rust-500 text-limestone-50 group-hover:bg-deepsea-500" : "bg-limestone-50 text-deepsea-500 group-hover:bg-deepsea-500 group-hover:text-limestone-50"}`}>
              {/* phones and tablets: the number, matching the list under the map; desktop has no list, so the plus */}
              {!gate && <span className="t-label leading-none tabular-nums lg:hidden">{it.n}</span>}
              <span className="grid place-items-center max-lg:hidden"><Icon name="plus-sign" size={gate ? 14 : 16} className={`transition-transform duration-300 [transition-timing-function:var(--ease-fig-out)] ${on ? "rotate-45" : ""}`} /></span>
            </button>
            {!on && <span className={`pointer-events-none absolute top-0 hidden -translate-y-1/2 whitespace-nowrap lg:block ${labelRight ? "left-7" : "right-full mr-7"} rounded-full bg-limestone-50 px-[14px] py-2 t-label l-14 shadow-[0_2px_10px_rgb(1_15_26/.18)] transition-opacity duration-[250ms] [transition-timing-function:var(--ease-fig-out)] ${labels ? "opacity-0 group-hover:opacity-100 xl:opacity-100" : "opacity-0 group-hover:opacity-100"}`}>{p.title}</span>}
            {on && !phone && <PinCard p={p} className={`absolute -top-[76px] hidden w-[300px] lg:flex ${right ? "left-7 origin-left" : "right-full mr-7 origin-right"}`} />}
          </div>
        );
      })}
    </div>
    </div>
    {/* desktop: no key under the map (removed 9 Nov at the owner's request; phones keep it above the list) */}

    {/* phones and tablets: the numbered list of the map's places; a row opens the place in the sheet */}
    <div className="mt-4 px-[var(--gutter)] lg:hidden">
      {/* the key in place of an instruction (9 Nov): what a white numbered pin and a rust dot are */}
      {gates.length > 0 && <Key />}
      {/* rules only between the rows: none above the first, none under the last (9 Nov) */}
      <ol className="mt-4">
        {places.map((it) => {
          const p = pins[it.pins[0]], on = active === it.key;
          return (
            <li key={it.key} className="border-b border-deepsea-500/10 last:border-b-0">
              <button onClick={() => show(it.key, true)} className={`flex min-h-14 w-full items-center gap-4 py-3 text-left transition-colors ${on ? "text-deepsea-500" : "text-limestone-900"}`}>
                <Num n={it.n} on={on} />
                <span className="flex-1 t-body b-16">{p.title}</span>
                <Icon name="arrow-right-01-sharp" size={18} className="flex-none text-deepsea-500/60" />
              </button>
            </li>
          );
        })}
        {gates.map((it) => {
          const on = active === it.key;
          return (
            <li key={it.key} className="border-b border-deepsea-500/10 last:border-b-0">
              <button onClick={() => show(it.key, true)} className={`flex min-h-14 w-full items-center gap-4 py-3 text-left transition-colors ${on ? "text-deepsea-500" : "text-limestone-900"}`}>
                <Num n={0} gate on={on} />
                <span className="flex flex-1 flex-col gap-1">
                  <span className="t-body b-16">{GATES_TITLE}</span>
                  <span className="t-label l-12 text-limestone-800">{it.pins.length} entrances</span>
                </span>
                <Icon name="arrow-right-01-sharp" size={18} className="flex-none text-deepsea-500/60" />
              </button>
            </li>
          );
        })}
      </ol>
    </div>

    {/* phones and tablets: the place in the bottom sheet (the Figma Drawer, as on the hotel and unit cards) */}
    {d && cur && <Drawer open={sheet} onClose={closeSheet} label={d.title}
      footer={<div className="flex items-center justify-between gap-4">
        {d.href ? <Button label="Explore" href={d.href} size={54} variant="primary" /> : <span />}
        {items.length > 1 && <div className="flex items-center gap-2">
          <button onClick={() => step(-1)} aria-label="Previous place" className="grid size-11 place-items-center rounded-full border border-deepsea-500/20 text-deepsea-500"><Icon name="arrow-left-01-sharp" size={18} /></button>
          <span className="min-w-12 text-center t-label l-14 tabular-nums text-limestone-800">{at + 1} / {items.length}</span>
          <button onClick={() => step(1)} aria-label="Next place" className="grid size-11 place-items-center rounded-full border border-deepsea-500/20 text-deepsea-500"><Icon name="arrow-right-01-sharp" size={18} /></button>
        </div>}
      </div>}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img key={d.photo} src={d.photo} srcSet={srcSet(d.photo)} alt={d.title} loading="lazy" className="h-[240px] w-full object-cover" />
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Num n={cur.n} gate={cur.gate} />
          <span className="t-label l-14 text-limestone-800">{cur.gate ? `${cur.pins.length} entrances, the rust dots on the map` : `On the masterplan${cur.pins.length > 1 ? ` · marked in ${cur.pins.length} places` : ""}`}</span>
        </div>
        <h3 className="t-heading hd-32">{d.title}</h3>
        <p className="t-body b-16 text-limestone-800">{d.body}</p>
      </div>
    </Drawer>}
    </div>
  );
}

const GATES_TITLE = "City gates";

/** The pin's badge for the list and the sheet: a highlight's number, or the gates' rust dot (as drawn on the map). */
function Num({ n, gate = false, on = false }: { n: number; gate?: boolean; on?: boolean }) {
  if (gate) return (
    <span className="grid size-8 flex-none place-items-center"><span className={`size-4 rounded-full ${on ? "bg-deepsea-500" : "bg-rust-500"}`} /></span>);
  return (
    <span className={`grid size-8 flex-none place-items-center rounded-full t-label text-[12px] leading-none tabular-nums
      ${on ? "bg-deepsea-500 text-limestone-50" : "border border-deepsea-500/20 bg-limestone-50 text-deepsea-500"}`}>{n}</span>
  );
}

/** Highlights · Gates key. */
function Key({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-5 t-label l-12 text-limestone-800 ${className}`}>
      <span className="flex items-center gap-2"><span className="size-3 rounded-full border border-deepsea-500/30 bg-limestone-50" />Highlights</span>
      <span className="flex items-center gap-2"><span className="size-3 rounded-full bg-rust-500" />Gates</span>
    </div>
  );
}

/** Masterplan Pin · Active tooltip card: image, Heading/20 title, Body/14 description, Explore (0.3 s ease-out). */
function PinCard({ p, className }: { p: MapPin; className: string }) {
  return (
    <div className={`flex-col gap-3 rounded-lg bg-limestone-50 p-3 pb-4 shadow-[0_16px_40px_rgb(0_0_0/.16)] animate-[pinCard_.3s_var(--ease-fig-out)_both] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.photo} srcSet={srcSet(p.photo)} alt="" className="h-[150px] w-full object-cover" />
      <span className="t-heading hd-20">{p.title}</span>
      <span className="t-body b-14 text-limestone-800">{p.body}</span>
      {p.href && <span><Button label="Explore" href={p.href} variant="outline" /></span>}
    </div>
  );
}
