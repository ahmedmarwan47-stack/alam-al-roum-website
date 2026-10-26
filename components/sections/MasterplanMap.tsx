"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import Drawer from "@/components/ui/Drawer";
import Icon from "@/components/ui/Icon";
import RevealImage from "@/components/reveal/RevealImage";

export type MapPin = { title: string; body: string; x: number; y: number; photo: string; href?: string };

/**
 * Aerial masterplan with Interactive-Hotspots pins (Figma Masterplan Pin): hover shows the name, click opens the card.
 * Below md the map is too small to float a card over it: a tapped pin opens its card in the side drawer instead.
 */
export default function MasterplanMap({ image, pins, initial = 0 }: { image: string; pins: MapPin[]; initial?: number }) {
  const [open, setOpen] = useState(initial);
  const [phone, setPhone] = useState(false), [sheet, setSheet] = useState(false), [last, setLast] = useState(0);
  const closeSheet = useCallback(() => setSheet(false), []);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)"), sync = () => setPhone(mq.matches);
    sync(); mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
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
    <div ref={box} className="relative w-full" style={{ aspectRatio: "1512 / 839" }}>
      <RevealImage src={image} className="absolute inset-0 rounded-lg" />
      {pins.map((p, k) => {
        const on = phone ? sheet && last === k : open === k, px = (p.x / 1512) * w, right = px + 28 + 300 <= w - 12, labelRight = px + 28 + 200 <= w;
        return (
          <div key={p.title} className="group absolute z-10" style={{ left: `${(p.x / 1512) * 100}%`, top: `${(p.y / 839) * 100}%` }}>
            {/* Pulse ring: 56px at rest (breathing), grows to 72px on hover — Figma Masterplan Pin, 0.25 s ease-out */}
            {/* the ring never takes a tap: on a phone the pins sit close and a ring would cover its neighbour's button */}
            <span className={`pointer-events-none absolute left-0 top-0 h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-limestone-50/60 transition-transform duration-[250ms] [transition-timing-function:var(--ease-fig-out)] ${on ? "scale-100" : "scale-[.78] group-hover:scale-100"}`}>
              {!on && <span className="absolute inset-0 animate-ping rounded-full border border-limestone-50/50 [animation-duration:2.4s]" />}
            </span>
            <button onClick={() => tap(k)} aria-label={p.title}
              className={`relative grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full transition-colors duration-[250ms] [transition-timing-function:var(--ease-fig-out)] ${on ? "bg-deepsea-500 text-limestone-50" : "bg-limestone-50 text-deepsea-500 group-hover:bg-deepsea-500 group-hover:text-limestone-50"}`}>
              <Icon name="plus-sign" size={16} className={`transition-transform duration-300 [transition-timing-function:var(--ease-fig-out)] ${on ? "rotate-45" : ""}`} />
            </button>
            {!on && <span className={`pointer-events-none absolute top-0 hidden -translate-y-1/2 whitespace-nowrap md:block ${labelRight ? "left-7" : "right-7"} rounded-full bg-limestone-50 px-[14px] py-2 t-label l-14 opacity-0 transition-opacity duration-[250ms] [transition-timing-function:var(--ease-fig-out)] group-hover:opacity-100`}>{p.title}</span>}
            {on && <PinCard p={p} className={`absolute -top-[76px] hidden w-[300px] md:flex ${right ? "left-7 origin-left" : "right-7 origin-right"}`} />}
          </div>
        );
      })}
    </div>
    {/* phones: the Figma Drawer, as on the hotel and unit cards */}
    <Drawer open={sheet} onClose={closeSheet} label={d.title}
      footer={<div><Button label="Explore" href={d.href ?? "/communities"} size={54} variant="primary" /></div>}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={d.photo} alt={d.title} loading="lazy" className="h-[260px] w-full rounded-[2px] object-cover" />
      <div className="flex flex-col gap-3">
        <h3 className="t-heading hd-32">{d.title}</h3>
        <p className="t-body b-16 text-limestone-800">{d.body}</p>
      </div>
    </Drawer>
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
      <span><Button label="Explore" href={p.href ?? "/communities"} variant="outline" /></span>
    </div>
  );
}
