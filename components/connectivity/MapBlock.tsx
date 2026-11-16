"use client";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Icon from "@/components/ui/Icon";
import { MQ } from "@/lib/breakpoints";
import { gsap, reducedMotion } from "@/lib/gsap";
import FlatMap from "./FlatMap";
import { AAR, COUNTRIES, byKey, fmtFlight, fmtKm, type Country } from "./geo";
import { BLOCK, GLASS, SEA } from "./shared";

/**
 * The Connectivity map block (16 Nov): a large interactive map centred on Alam Al Roum. Hover a country for its name,
 * click it (or search) and a route draws from that country to Alam Al Roum with its distance; pinch to zoom and swipe
 * to move on a trackpad. On desktop the light glass info card sits over the map's lower left and the map frames its
 * view in the room to its right; below lg the card rides up over the map's foot (the map frames its view above it).
 * Loaded lazily (LazyMap), so the map code and the country shapes stay out of the page's first load.
 */
export default function MapBlock() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const hoverRef = useRef<string | null>(null), tip = useRef<HTMLDivElement>(null), stage = useRef<HTMLDivElement>(null);
  const lg = useSyncExternalStore(
    (cb) => { const m = matchMedia(MQ.lg); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); },
    () => matchMedia(MQ.lg).matches, () => false);
  const inset = useMemo(() => (lg ? { l: 388, r: 0, t: 0, b: 0 } : { l: 0, r: 0, t: 0, b: 64 }), [lg]);

  const onHover = useCallback((k: string | null, x?: number, y?: number) => {
    if (k !== hoverRef.current) { hoverRef.current = k; setHoverKey(k); }
    const el = tip.current, W = stage.current?.clientWidth ?? 0;
    if (k && el && x != null && y != null) {
      const flip = x > W - 220;   // near the right edge the name sits left of the pointer
      el.style.transform = `translate(${x + (flip ? -16 : 16)}px, ${y - 14}px) translate(${flip ? "-100%" : "0"}, -100%)`;
    }
  }, []);
  const hovered = hoverKey ? byKey.get(hoverKey) : null;
  // the map reports how far its route has drawn; the card's count, line and plane listen, so the two move together
  const listeners = useRef(new Set<(t: number) => void>());
  const onProgress = useCallback((t: number) => { listeners.current.forEach((f) => f(t)); }, []);
  const follow = useCallback((f: (t: number) => void) => { listeners.current.add(f); return () => { listeners.current.delete(f); }; }, []);

  return (
    <div className={BLOCK} style={{ background: SEA }}>
      <div ref={stage} className="relative max-md:aspect-[4/5] md:max-lg:aspect-[4/3] lg:absolute lg:inset-0">
        <FlatMap selected={selected} onSelect={setSelected} onHover={onHover} inset={inset} onProgress={onProgress} />
        {/* the hover name: follows the pointer (mouse and pen only) */}
        <div ref={tip} aria-hidden className={`pointer-events-none absolute left-0 top-0 z-10 transition-opacity duration-150 ${hovered ? "opacity-100" : "opacity-0"}`}>
          {hovered && (
            <div className={`flex flex-col whitespace-nowrap rounded-lg px-3 py-2 text-deepsea-500 ${GLASS}`}>
              <span className="t-label text-[14px] leading-5">{hovered.name}</span>
              <span className="t-label text-[12px] leading-4 text-deepsea-400">{hovered.key === selected ? fmtKm(hovered.km) : hovered.home ? "Home of Alam Al Roum" : "Click to see how far"}</span>
            </div>)}
        </div>
      </div>
      <InfoCard selected={selected} onSelect={setSelected} follow={follow} />
    </div>
  );
}

/** Miles and the compass direction, the route's two small facts besides the estimated flight time. */
const fmtMi = (km: number) => (Math.round((km * 0.621371) / 10) * 10).toLocaleString("en-US");
const COMPASS = ["North", "North-east", "East", "South-east", "South", "South-west", "West", "North-west"];
const direction = ([lon, lat]: [number, number]) => {
  const r = Math.PI / 180, [l1, p1, l2, p2] = [AAR[0] * r, AAR[1] * r, lon * r, lat * r];
  const b = Math.atan2(Math.sin(l2 - l1) * Math.cos(p2), Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(l2 - l1)) / r;
  return COMPASS[Math.round(((b + 360) % 360) / 45) % 8];
};

/**
 * The info card (16 Nov, compact): light glass, the site's 8 px card radius, over the map's lower left on desktop;
 * below lg it rides up over the map's foot, inset to the page's gutters. The chosen route, or one line asking where
 * you are travelling from, and the search under it (the six markets are pins on the map). Muted text is solid Deep
 * Sea 400, never a see-through Deep Sea: 6.9:1 on the glass.
 */
type Follow = (f: (t: number) => void) => () => void;
function InfoCard({ selected, onSelect, follow }: { selected: string | null; onSelect: (k: string | null) => void; follow: Follow }) {
  const sel = selected ? byKey.get(selected)! : null;
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const s = q.trim().toLowerCase(); if (!s) return [];
    const all = COUNTRIES.filter((x) => !x.inert && (x.name.toLowerCase().includes(s) || x.city?.toLowerCase().includes(s)));
    return all.sort((a, b) => Number(!a.name.toLowerCase().startsWith(s)) - Number(!b.name.toLowerCase().startsWith(s)) || a.km - b.km).slice(0, 5);
  }, [q]);
  const pick = (k: string) => { onSelect(k); setQ(""); };

  return (
    <div className={`relative z-20 flex flex-col gap-4 rounded-lg p-5 text-deepsea-500 ${GLASS} max-lg:-mt-16 max-md:mx-[var(--gutter)] max-md:mb-[var(--gutter)] md:max-lg:mx-6 md:max-lg:mb-6 lg:absolute lg:bottom-6 lg:left-6 lg:w-[340px]`}>
      {sel ? <Route key={sel.key} c={sel} onClear={() => onSelect(null)} follow={follow} /> : (
        <div className="flex flex-col gap-1">
          <span className="t-label text-[12px] leading-4 text-deepsea-400">Distance to Alam Al Roum</span>
          <h3 className="t-heading text-[20px] leading-7">Where are you travelling from?</h3>
        </div>)}
      <div className="flex flex-col gap-1">
        <label className="flex h-10 items-center gap-2.5 rounded-lg border border-deepsea-500/15 bg-white/70 px-3 transition-colors focus-within:border-deepsea-500/40">
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" className="flex-none text-deepsea-400"><circle cx="8" cy="8" r="5.75" /><path d="m12.5 12.5 4 4" strokeLinecap="round" /></svg>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a country or city" aria-label="Search a country or city"
            onKeyDown={(e) => { if (e.key === "Enter" && results[0]) pick(results[0].key); if (e.key === "Escape") setQ(""); }}
            className="min-w-0 flex-1 bg-transparent t-text text-[16px] leading-6 text-deepsea-500 outline-none placeholder:text-deepsea-400" />
        </label>
        {q.trim() && (
          <ul className="-mx-2 flex flex-col">
            {results.length ? results.map((r) => (
              <li key={r.key}><button onClick={() => pick(r.key)} className="flex w-full items-center justify-between gap-4 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/70">
                <span className="t-label l-14">{r.name}{r.city && r.city !== r.name && <span className="text-deepsea-400"> · {r.city}</span>}</span>
                <span className="t-label text-[12px] leading-4 tabular-nums text-deepsea-400">{fmtKm(r.km)}</span></button></li>))
              : <li className="px-2 py-2 t-body b-14 text-deepsea-400">No country by that name</li>}
          </ul>)}
      </div>
    </div>
  );
}

/**
 * The chosen route, compact: the distance as the figure (counting up with the map's line) beside the close button,
 * the destination and Alam Al Roum joined by a line a small plane flies along towards Alam Al Roum, then the small facts: estimated flight time, miles, direction.
 */
function Route({ c, onClear, follow }: { c: Country; onClear: () => void; follow: Follow }) {
  const num = useRef<HTMLSpanElement>(null), head = useRef<HTMLDivElement>(null), trail = useRef<HTMLSpanElement>(null), plane = useRef<HTMLSpanElement>(null), end = useRef<HTMLSpanElement>(null);
  // the card's line, plane and count follow the map's route frame by frame (see `follow`); at the end the plane
  // lands and Alam Al Roum's dot pops
  useEffect(() => {
    const el = num.current!, tr = trail.current!, pl = plane.current!, en = end.current!;
    if (!reducedMotion()) gsap.fromTo(head.current, { opacity: 0, y: 8, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "siteOut" });
    let landed = false;
    gsap.set(en, { scale: 0 });
    return follow((t) => {
      el.textContent = fmtKm(c.km * t);
      tr.style.transform = `scaleX(${t})`; pl.style.left = `${t * 100}%`; pl.style.opacity = t >= 0.999 ? "0" : "1";
      if (t >= 0.999 && !landed) { landed = true; gsap.fromTo(en, { scale: 0 }, { scale: 1, duration: 0.35, ease: "back.out(2)" }); }
      if (t < 0.999 && landed) { landed = false; gsap.set(en, { scale: 0 }); }
    });
  }, [c, follow]);
  const facts: [string, string][] = [[fmtFlight(c.flightMin), "Est. flight"], [fmtMi(c.km), "Miles"], [direction(c.to), "Direction"]];
  return (
    <div ref={head} className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col">
          <span ref={num} className="t-heading normal-case! text-[32px] leading-9 tabular-nums">0 km</span>
          <span className="t-label text-[12px] leading-4 text-deepsea-400">Straight-line distance</span>
        </div>
        <button onClick={onClear} aria-label="Clear the route" className="grid h-8 w-8 flex-none place-items-center rounded-lg border border-deepsea-500/15 bg-white/50 transition-colors hover:bg-white/90">
          <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1 1l8 8M9 1l-8 8" /></svg>
        </button>
      </div>
      {/* the two ends, read left to right as the journey: the destination, then Alam Al Roum; the line between them on
          the names' middle (14 / 20 type: 10 px down), a small plane flying it towards Alam Al Roum */}
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 max-w-[45%] flex-col">
          <span className="t-label l-14">{c.city ?? c.name}</span>
          {c.city && c.city !== c.name && <span className="t-label text-[12px] leading-4 text-deepsea-400">{c.name}</span>}
        </div>
        <div className="relative mt-2.5 min-w-8 flex-1">
          <span className="absolute inset-x-0 top-0 border-t border-dashed border-deepsea-500/30" />
          <span ref={trail} className="absolute inset-x-0 top-0 h-px origin-left bg-deepsea-500" style={{ transform: "scaleX(0)" }} />
          <span className="absolute -left-[3px] -top-[2.5px] size-1.5 rounded-full bg-rust-500" />
          <span ref={end} className="absolute -right-[3px] -top-[2.5px] size-1.5 rounded-full bg-deepsea-500" />
          <span ref={plane} className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 text-deepsea-500">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden><path d="M15 8 10.4 6.7 7.4 1.6H6.1l1.3 4.8-3.7-.2-1.2-1.8h-1l.6 3.6-.6 3.6h1l1.2-1.8 3.7-.2-1.3 4.8h1.3l3-5.1z" /></svg>
          </span>
        </div>
        <div className="flex flex-none flex-col items-end text-right"><span className="t-label l-14">Alam Al Roum</span><span className="t-label text-[12px] leading-4 text-deepsea-400">Egypt</span></div>
      </div>
      {/* each fact as wide as its words (never "North-" / "west"), the hairlines between them */}
      <dl className="flex divide-x divide-deepsea-500/10 border-t border-deepsea-500/10 pt-3">
        {facts.map(([v, l]) => (
          <div key={l} className="flex flex-auto flex-col whitespace-nowrap px-3 first:pl-0 last:pr-0">
            <dd className="order-1 t-label l-14 tabular-nums">{v}</dd>
            <dt className="order-2 t-label text-[12px] leading-4 text-deepsea-400">{l}</dt>
          </div>))}
      </dl>
      {c.note && <p className="flex items-start gap-2 t-body b-14 text-deepsea-400"><span className="mt-px flex-none"><Icon name="road" size={16} /></span>{c.note}</p>}
    </div>
  );
}

