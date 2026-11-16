"use client";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { geoAzimuthalEquidistant, geoGraticule10, geoPath } from "d3-geo";
import { gsap, reducedMotion } from "@/lib/gsap";
import { whenSectionEnters } from "@/components/reveal/letters";
import { AAR, COUNTRIES, PICKS, SEAS, byKey, fmtKm } from "./geo";
import { CLICK_SLOP, PIN_SIDE, PIN_TR, SEA, BORDER, drawTime, flipNearEdge, landClass, useSize, useTrackpad, type MapProps } from "./shared";
import ZoomControls from "./controls";

/**
 * The Connectivity map: a flat map centred on Alam Al Roum (azimuthal equidistant, so every straight line from the
 * centre is the shortest route and true to scale, and the dashed rings are exact distances). Hover a country for
 * its name; click it and the map eases to frame the route, which draws in from the destination to Alam Al Roum with its distance
 * counting up. Drag (mouse) or swipe (trackpad) to move, pinch or + / − to zoom.
 */

const R_EARTH = 6371.0088;
/** in km: 1 unit = 1 km, Alam Al Roum at (0, 0) */
const proj = geoAzimuthalEquidistant().rotate([-AAR[0], -AAR[1]]).scale(R_EARTH).translate([0, 0]).precision(8);
const toKm = (ll: [number, number]) => proj(ll) as [number, number];
let cache: { d: Map<string, string>; grat: string } | null = null;
const paths = () => {
  if (cache) return cache;
  const p = geoPath(proj).digits(0);
  return (cache = { d: new Map(COUNTRIES.map((c) => [c.key, p(c.shape) ?? ""])), grat: p(geoGraticule10()) ?? "" });
};

type View = { k: number; fx: number; fy: number };   // px per km, and the km point at the frame's centre
type Box = [number, number, number, number];
const fit = (b: Box, fw: number, fh: number, pad: number): View => ({
  k: Math.min((fw - 2 * pad) / Math.max(b[2] - b[0], 1), (fh - 2 * pad) / Math.max(b[3] - b[1], 1)),
  fx: (b[0] + b[2]) / 2, fy: (b[1] + b[3]) / 2,
});
/** the six markets and Alam Al Roum: the opening view */
const HOME_BOX: Box = (() => {
  const pts = [[0, 0], ...PICKS.map((k) => toKm(byKey.get(k)!.to))];
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  return [Math.min(...xs) - 250, Math.min(...ys) - 420, Math.max(...xs) + 250, Math.max(...ys) + 260];
})();
const RING_STEPS = [1000, 2000, 2500, 5000];

/** Countries, drawn once (only the group around them moves). */
const Countries = memo(function Countries() {
  const { d, grat } = paths();
  return (
    <>
      <path d={grat} fill="none" vectorEffect="non-scaling-stroke" className="stroke-deepsea-500/[0.06]" strokeWidth={0.6} />
      {COUNTRIES.map((c) => (
        <path key={c.key} d={d.get(c.key)} data-k={c.inert ? undefined : c.key} vectorEffect="non-scaling-stroke" strokeWidth={0.6} strokeLinejoin="round"
          stroke={BORDER} className={`transition-[fill] duration-200 ${landClass(c.inert, c.home)}`} />))}
    </>
  );
});

export default function FlatMap({ selected, onSelect, onHover, inset, onProgress }: MapProps) {
  const box = useRef<HTMLDivElement>(null);
  const { w, h } = useSize(box);
  const fw = w - inset.l - inset.r, fh = h - inset.t - inset.b, cx = inset.l + fw / 2, cy = inset.t + fh / 2;
  const home = useMemo(() => (fw > 0 ? fit(HOME_BOX, fw, fh, Math.min(56, fw * 0.08)) : null), [fw, fh]);
  const kMin = fw > 0 ? Math.min(fw, fh) / (2 * 20015) : 0;

  const [view, setViewState] = useState<View | null>(null);
  const viewRef = useRef<View | null>(null);
  const setView = useCallback((v: View) => { viewRef.current = v; setViewState(v); }, []);
  const [route, setRoute] = useState<{ key: string; t: number } | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  /** the view that shows Alam Al Roum and `key` together: the opening view when the route already reads well in it */
  const viewFor = useCallback((key: string | null): View | null => {
    if (!home) return null;
    if (!key) return home;
    const [dx, dy] = toKm(byKey.get(key)!.to), len = Math.hypot(dx, dy) * home.k, short = Math.min(140, 0.25 * Math.min(fw, fh));
    const sx = (dx - home.fx) * home.k, sy = (dy - home.fy) * home.k;
    if (len > short && Math.abs(sx) < fw / 2 - 110 && Math.abs(sy) < fh / 2 - 90) return home;
    // the route's box, then again with room past the destination for its name (about 90 px on, in the route's direction)
    const pad = Math.min(96, fw * 0.14), D = Math.hypot(dx, dy) || 1;
    const boxWith = (m: number): Box => { const ex = dx + (dx / D) * m, ey = dy + (dy / D) * m; return [Math.min(0, ex), Math.min(0, ey), Math.max(0, ex), Math.max(0, ey)]; };
    const v = fit(boxWith(90 / fit(boxWith(0), fw, fh, pad).k), fw, fh, pad);
    // short routes zoom in until the route spans about a third of the frame, never past 6× the opening view
    const k = Math.min(v.k, home.k * 6, len < short ? (0.36 * Math.min(fw, fh)) / Math.max(Math.hypot(dx, dy), 1) : Infinity);
    return { k: Math.max(k, kMin), fx: v.fx, fy: v.fy };
  }, [home, fw, fh, kMin]);

  /** eases the view to `to` (zoom in log space, so it feels even), appended to `t` */
  const glide = useCallback((t: gsap.core.Timeline, to: View, at: number | string = 0, dur = 1) => {
    const from = viewRef.current; if (!from) { setView(to); return false; }
    if (Math.abs(Math.log(to.k / from.k)) < 0.01 && Math.hypot(to.fx - from.fx, to.fy - from.fy) * to.k < 2) return false;
    const o = { p: 0 };
    t.to(o, { p: 1, duration: dur, ease: "power3.inOut", onUpdate: () => setView({
      k: from.k * Math.pow(to.k / from.k, o.p), fx: from.fx + (to.fx - from.fx) * o.p, fy: from.fy + (to.fy - from.fy) * o.p }) }, at);
    return true;
  }, [setView]);

  // first size: the opening view; later resizes keep the current choice framed
  useEffect(() => {
    const v = viewFor(selected); if (!v) return;
    tl.current?.kill();
    tl.current = gsap.timeline().call(() => { setView(v); if (selected) setRoute({ key: selected, t: 1 }); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fw, fh]);

  // entrance: the map settles in from a little further out, as the section arrives (until then it waits zoomed out;
  // if it is torn down first, a resize or React's dev double-run, it is put back in place)
  const entered = useRef(false);
  useEffect(() => {
    if (!home || entered.current || reducedMotion()) return;
    setView({ ...home, k: home.k * 0.72 });
    const off = whenSectionEnters(box.current!, () => {
      entered.current = true; tl.current?.kill();
      glide((tl.current = gsap.timeline()), viewFor(selected) ?? home, 0, 1.8);
    });
    return () => { off(); if (!entered.current) setView(viewFor(selected) ?? home); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [home]);

  // a new pick: glide to frame it, then draw the route
  useEffect(() => {
    if (!home) return;
    tl.current?.kill();
    const t = (tl.current = gsap.timeline());
    const target = viewFor(selected)!, key = selected;
    if (!key) { t.call(() => setRoute(null)); glide(t, target); return; }
    const c = byKey.get(key)!;
    if (reducedMotion()) { t.call(() => { setView(target); setRoute({ key, t: 1 }); }); return; }
    t.call(() => setRoute({ key, t: 0 }));
    const moved = glide(t, target);
    const o = { t: 0 };
    t.to(o, { t: 1, duration: drawTime(c.km), ease: "power2.inOut", onUpdate: () => setRoute({ key, t: o.t }) }, moved ? ">-0.3" : 0);
    return () => { t.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const zoom = (f: number) => {
    const v = viewRef.current; if (!v || !home) return;
    tl.current?.kill(); const t = (tl.current = gsap.timeline());
    if (route) setRoute({ ...route, t: 1 });
    glide(t, { ...v, k: Math.min(Math.max(v.k * f, kMin), home.k * 8) }, 0, 0.6);
  };
  const reset = () => { tl.current?.kill(); const t = (tl.current = gsap.timeline()); if (route) setRoute({ ...route, t: 1 }); glide(t, viewFor(selected)!, 0, 0.9); };
  /** a hand on the map stops any glide and finishes the route at once */
  // the card follows the line
  useEffect(() => { onProgress?.(route?.t ?? 0); }, [route, onProgress]);
  const takeOver = () => { tl.current?.kill(); if (route && route.t < 1) setRoute({ ...route, t: 1 }); };

  // trackpad: swipe moves the map, pinch zooms about the pointer (the point under it stays put)
  useTrackpad(box, {
    pan: (dx, dy) => { const v = viewRef.current; if (!v) return; takeOver(); setView({ ...v, fx: v.fx + dx / v.k, fy: v.fy + dy / v.k }); },
    zoom: (f, x, y) => {
      const v = viewRef.current; if (!v || !home) return; takeOver();
      const k = Math.min(Math.max(v.k * f, kMin), home.k * 8), px = v.fx + (x - cx) / v.k, py = v.fy + (y - cy) / v.k;
      setView({ k, fx: px - (x - cx) / k, fy: py - (y - cy) / k });
    },
  });

  // pointer: hover names, mouse-drag pans, a press that doesn't travel is a click
  const drag = useRef<{ x: number; y: number; v: View; moved: boolean } | null>(null);
  const swallow = useRef(false);
  const [grabbing, setGrabbing] = useState(false);
  const keyAt = (t: EventTarget) => (t as Element).closest?.("[data-k]")?.getAttribute("data-k") ?? null;
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || !viewRef.current) return;
    drag.current = { x: e.clientX, y: e.clientY, v: viewRef.current, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (d) {
      const dx = e.clientX - d.x, dy = e.clientY - d.y;
      if (!d.moved && Math.hypot(dx, dy) > CLICK_SLOP) { d.moved = true; setGrabbing(true); tl.current?.kill(); if (route) setRoute({ ...route, t: 1 }); }
      if (d.moved) { setView({ k: d.v.k, fx: d.v.fx - dx / d.v.k, fy: d.v.fy - dy / d.v.k }); onHover(null); setHover(null); return; }
    }
    if (e.pointerType === "touch") return;
    const k = keyAt(e.target), r = box.current!.getBoundingClientRect();
    if (k !== hover) setHover(k);
    onHover(k, e.clientX - r.left, e.clientY - r.top);
  };
  const onPointerUp = () => { swallow.current = !!drag.current?.moved; drag.current = null; setGrabbing(false); };
  const onClick = (e: React.MouseEvent) => {
    if (swallow.current) { swallow.current = false; return; }
    const k = keyAt(e.target); if (!k) return;
    onSelect(k);
    if (e.nativeEvent instanceof PointerEvent && e.nativeEvent.pointerType !== "touch") { const r = box.current!.getBoundingClientRect(); setHover(k); onHover(k, e.clientX - r.left, e.clientY - r.top); }
  };
  const onLeave = () => { drag.current = null; setGrabbing(false); setHover(null); onHover(null); };

  const v = view;
  const S = (p: [number, number]): [number, number] => (v ? [cx + (p[0] - v.fx) * v.k, cy + (p[1] - v.fy) * v.k] : [0, 0]);
  const [ox, oy] = S([0, 0]);
  const { d } = paths();
  const inFrame = (p: [number, number], m = 0) => p[0] > -m && p[0] < w + m && p[1] > -m && p[1] < h + m;

  // rings: at least 100 px apart, out to the farthest corner
  const step = v ? (RING_STEPS.find((s) => s * v.k >= 100) ?? 5000) : 1000;
  const far = v ? Math.max(Math.hypot(ox, oy), Math.hypot(w - ox, oy), Math.hypot(ox, h - oy), Math.hypot(w - ox, h - oy)) / v.k : 0;
  const rings = v ? Array.from({ length: Math.min(Math.floor(Math.min(far, 20000) / step), 40) }, (_, i) => (i + 1) * step) : [];

  const sel = route ? byKey.get(route.key)! : null;
  const dest = sel ? S(toKm(sel.to)) : null;
  // the route travels from the destination to Alam Al Roum: `tip` is its leading end, on its way to the badge
  const tip: [number, number] | null = dest && route ? [dest[0] + (ox - dest[0]) * route.t, dest[1] + (oy - dest[1]) * route.t] : null;
  const u = dest ? (() => { const L = Math.hypot(dest[0] - ox, dest[1] - oy) || 1; return [(dest[0] - ox) / L, (dest[1] - oy) / L]; })() : [0, 0];
  const done = !!route && route.t >= 0.999;
  // the rings' labels: upper right, or whichever diagonal is furthest from the route (and not under the info card)
  const off = (a: number, b: number) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
  const bearing = dest ? Math.atan2(u[1], u[0]) : null;
  const A = bearing == null ? (-38 * Math.PI) / 180
    : [-38, -142, 38, 142].filter((d) => !(inset.l > 0 && d === 142)).map((d) => (d * Math.PI) / 180).sort((a, b) => off(b, bearing) - off(a, bearing))[0];

  return (
    <div ref={box} className={`absolute inset-0 select-none overflow-hidden ${grabbing ? "cursor-grabbing" : ""}`} style={{ touchAction: "pan-y" }}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onLeave} onClick={onClick}>
      {v && (
        <svg width={w} height={h} className="absolute inset-0" role="img" aria-label="Map of the world centred on Alam Al Roum">
          <rect width={w} height={h} fill={SEA} />
          <g transform={`translate(${cx - v.fx * v.k} ${cy - v.fy * v.k}) scale(${v.k})`}>
            <Countries />
            {hover && hover !== selected && <path d={d.get(hover)} vectorEffect="non-scaling-stroke" className="pointer-events-none fill-none stroke-deepsea-500 animate-[fm-in_.2s_ease-out]" strokeWidth={1.25} strokeLinejoin="round" />}
            {selected && <path key={selected} d={d.get(selected)} vectorEffect="non-scaling-stroke" className="pointer-events-none fill-[#e6d3c9] stroke-rust-500 animate-[fm-in_.35s_ease-out]" strokeWidth={1.25} strokeLinejoin="round" />}
          </g>
          {/* distance rings: exact on this projection */}
          {rings.map((r) => <circle key={r} cx={ox} cy={oy} r={r * v.k} fill="none" className="pointer-events-none stroke-deepsea-500/30" strokeWidth={1} strokeDasharray="2 5" />)}
          {/* countries too small to point at: a dot of their own */}
          {COUNTRIES.filter((c) => c.small).map((c) => {
            const p = S(toKm(c.to)); if (!inFrame(p, 10)) return null;
            return <g key={c.key} data-k={c.key} className="cursor-pointer"><circle cx={p[0]} cy={p[1]} r={10} fill="transparent" />
              <circle cx={p[0]} cy={p[1]} r={hover === c.key || selected === c.key ? 3.5 : 2} className={selected === c.key ? "fill-rust-500 stroke-white" : "fill-deepsea-500/50"} strokeWidth={1} /></g>;
          })}
          {/* the route: one plain line */}
          {tip && route && route.t > 0 && <>
            <line x1={dest![0]} y1={dest![1]} x2={tip[0]} y2={tip[1]} className="pointer-events-none stroke-deepsea-500" strokeWidth={2} strokeLinecap="round" />
            {!done && <circle cx={tip[0]} cy={tip[1]} r={4} className="pointer-events-none fill-deepsea-500" stroke={SEA} strokeWidth={1.5} />}
          </>}
          {/* the six markets: plain pins */}
          {PICKS.map((k) => {
            const p = S(toKm(byKey.get(k)!.to)); if (!inFrame(p, 10)) return null;
            const on = selected === k;
            return <g key={k} data-k={k} className="cursor-pointer">
              <circle cx={p[0]} cy={p[1]} r={12} fill="transparent" />
              <circle cx={p[0]} cy={p[1]} r={on && route && route.t > 0 ? 5.5 : 4.5} className={`transition-[r] duration-300 ${on ? "fill-rust-500 stroke-white" : "fill-deepsea-500"}`} stroke={on ? undefined : SEA} strokeWidth={1.5} />
            </g>;
          })}
          {dest && route && route.t > 0 && !PICKS.includes(route.key) && <circle cx={dest[0]} cy={dest[1]} r={5.5} className="pointer-events-none fill-rust-500 stroke-white animate-[fm-pop_.4s_cubic-bezier(.34,1.56,.64,1)]" strokeWidth={1.5} style={{ transformOrigin: `${dest[0]}px ${dest[1]}px` }} />}
        </svg>
      )}
      {v && <>
        {/* seas, quietly */}
        {SEAS.map((s) => { const p = S(toKm(s.at)); return inFrame(p, -40) && (
          <span key={s.n} className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap t-label text-[12px] leading-4 tracking-[0.04em] text-deepsea-400 max-md:hidden" style={{ left: p[0], top: p[1] }}>{s.n}</span>); })}
        {rings.map((r) => { const p: [number, number] = [ox + Math.cos(A) * r * v.k, oy + Math.sin(A) * r * v.k];
          return inFrame(p, -24) && !(p[0] > w - 90 && p[1] < 190) && !(dest && Math.hypot(p[0] - dest[0], p[1] - dest[1]) < 70) && <span key={r} className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-[4px] px-1 t-label text-[12px] leading-4 tabular-nums text-deepsea-400" style={{ left: p[0], top: p[1], background: SEA }}>{r.toLocaleString("en-US")} km</span>; })}
        {/* the six markets' names */}
        {PICKS.map((k) => {
          const c = byKey.get(k)!, p = S(toKm(c.to)), side = flipNearEdge(PIN_SIDE[k], p[0], w);
          if (!inFrame(p, 10) || (selected === k && route) || (dest && route && route.t > 0 && Math.hypot(p[0] - dest[0], p[1] - dest[1]) < 90)) return null;
          const tr = PIN_TR[side];
          return <span key={k} className={`pointer-events-none absolute whitespace-nowrap t-label text-[12px] leading-4 transition-colors duration-300 ${selected ? "text-deepsea-400" : "text-deepsea-500"}`} style={{ left: p[0], top: p[1], transform: tr }}>{c.city}</span>;
        })}
        {/* Alam Al Roum: the brand coin pair on a deep-sea badge, its name under it */}
        <span className="pointer-events-none absolute flex h-7 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[1.5px] border-limestone-50 bg-deepsea-500 md:h-8 md:w-16" style={{ left: ox, top: oy }}>
          <span aria-hidden className="block w-[76%] bg-limestone-50" style={{ aspectRatio: "591 / 271", mask: "url(/images/icon-pair.svg) center / contain no-repeat", WebkitMask: "url(/images/icon-pair.svg) center / contain no-repeat" }} />
        </span>
        <span className="pointer-events-none absolute -translate-x-1/2 whitespace-nowrap t-label text-[12px] leading-4 text-deepsea-500 md:text-[14px] md:leading-5" style={{ left: ox, top: oy + 20 }}>Alam Al Roum</span>
        {/* the distance, riding the middle of the drawn line and counting up with it */}
        {tip && route && route.t > 0.02 && sel && (
          <span className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-[4px] bg-deepsea-500 px-2 py-0.5 t-label text-[14px] leading-5 tabular-nums text-limestone-50"
            style={{ left: (dest![0] + tip[0]) / 2, top: (dest![1] + tip[1]) / 2 }}>{fmtKm(sel.km * route.t)}</span>)}
        {/* the destination's name, on the far side of its pin */}
        {dest && route && route.t > 0 && sel && (
          <span className="pointer-events-none absolute flex flex-col whitespace-nowrap text-deepsea-500 animate-[fm-label_.6s_cubic-bezier(.16,1,.3,1)]"
            style={{ left: dest[0] + u[0] * 14, top: dest[1] + u[1] * 14, transform: `translate(${u[0] > 0.35 ? 0 : u[0] < -0.35 ? -100 : -50}%, ${u[1] < -0.35 ? -100 : u[1] > 0.35 ? 0 : -50}%)`, alignItems: u[0] > 0.35 ? "flex-start" : u[0] < -0.35 ? "flex-end" : "center" }}>
            <span className="t-label text-[14px] leading-5 md:text-[16px] md:leading-6">{sel.city ?? sel.name}</span>
            {sel.city && sel.city !== sel.name && <span className="t-label text-[12px] leading-4 text-deepsea-400">{sel.name}</span>}
          </span>)}
      </>}
      <ZoomControls onIn={() => zoom(1.6)} onOut={() => zoom(1 / 1.6)} onReset={reset} />
    </div>
  );
}
