import { useEffect, useRef, useState, type RefObject } from "react";

/** What every map design takes from the section: the chosen country, hover and pick callbacks, and the room the info card covers. */
export type MapProps = {
  selected: string | null;
  onSelect: (key: string) => void;
  /** the hovered country (null: none) and the pointer, in px inside the map */
  onHover: (key: string | null, x?: number, y?: number) => void;
  /** px of the map hidden under overlays (the info card on desktop): the map frames its view in what is left */
  inset: { l: number; r: number; t: number; b: number };
  /** how far the route has drawn (0 to 1), every frame, so the info card moves in step with the map */
  onProgress?: (t: number) => void;
};

/** The element's size, kept current. */
export function useSize(ref: RefObject<HTMLElement | null>) {
  const [s, set] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => set({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return s;
}

/** How long the route takes to draw: longer routes a little longer, never slow. */
export const drawTime = (km: number) => 0.9 + Math.min(km / 9000, 1) * 0.7;

/** Pointer travel (px) under which a press counts as a click, not a drag. */
export const CLICK_SLOP = 5;

/** The quick-pick pins: which side of the pin each name sits on, clear of its neighbours (Doha, Dubai and Riyadh are close). */
export const PIN_SIDE: Record<string, "l" | "r" | "t" | "b"> = {
  Qatar: "t", Italy: "r", "United Arab Emirates": "r", "Saudi Arabia": "b", "United Kingdom": "l", France: "r",
};
/** each side's offset from the pin */
export const PIN_TR = { l: "translate(calc(-100% - 13px), -50%)", r: "translate(13px, -50%)", t: "translate(-50%, calc(-100% - 12px))", b: "translate(-50%, 12px)" } as const;
/** a name that would run off the map's edge moves: off the left to the right (London), off the right to below (Dubai: on its left sits Doha) */
export const flipNearEdge = (side: "l" | "r" | "t" | "b", x: number, w: number) => (side === "l" && x < 72 ? "r" : side === "r" && x > w - 72 ? "b" : side);

/**
 * Trackpad (and wheel) on a map. A pinch zooms: Chrome and Firefox send it as a wheel with ctrlKey, Safari as gesture
 * events. A two-finger swipe moves the map: a sideways one always; an up-down one only once the visitor is using the
 * map (has moved the pointer over it, pressed or pinched in it), so scrolling the page past the map with the pointer
 * resting on it still scrolls the page, and a swipe that began as a page scroll stays one until it ends. A mouse
 * wheel's notches always scroll the page. Leaving the map hands the swipe back to the page.
 */
export function useTrackpad(ref: RefObject<HTMLElement | null>, on: { pan: (dx: number, dy: number) => void; zoom: (f: number, x: number, y: number) => void }) {
  const cb = useRef(on);
  useEffect(() => { cb.current = on; });
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let engaged = false, passing = false, last = 0, pinching = false, scale = 1;
    const unit = (e: WheelEvent) => (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? el.clientHeight : 1);
    const at = (e: { clientX: number; clientY: number }) => { const r = el.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] as const; };
    const take = (e: Event) => { e.preventDefault(); e.stopPropagation(); };   // and Lenis (on window) never sees it
    const onWheel = (e: WheelEvent) => {
      const now = performance.now(), fresh = now - last > 220; last = now;
      if (e.ctrlKey) { take(e); engaged = true; passing = false; if (!pinching) { const [x, y] = at(e); cb.current.zoom(Math.exp(-e.deltaY * unit(e) * 0.01), x, y); } return; }
      if (fresh) {
        const notch = e.deltaMode !== 0 || (e.deltaX === 0 && Math.abs(e.deltaY) >= 50);
        passing = notch || (!engaged && Math.abs(e.deltaY) >= Math.abs(e.deltaX));
      }
      if (passing) return;   // the page scrolls
      take(e); engaged = true;
      cb.current.pan(e.deltaX * unit(e), e.deltaY * unit(e));
    };
    const onMove = (e: PointerEvent) => { if (e.pointerType === "mouse" && (e.movementX || e.movementY)) engaged = true; };
    const onDown = () => { engaged = true; };
    const onLeave = () => { engaged = false; };
    type Gesture = Event & { scale: number; clientX: number; clientY: number };
    const gs = (e: Event) => { take(e); pinching = engaged = true; scale = 1; };
    const gc = (e: Event) => { take(e); const g = e as Gesture, [x, y] = at(g); cb.current.zoom(g.scale / scale, x, y); scale = g.scale; };
    const ge = (e: Event) => { take(e); pinching = false; };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointermove", onMove); el.addEventListener("pointerdown", onDown); el.addEventListener("pointerleave", onLeave);
    el.addEventListener("gesturestart", gs); el.addEventListener("gesturechange", gc); el.addEventListener("gestureend", ge);
    return () => {
      el.removeEventListener("wheel", onWheel); el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerleave", onLeave); el.removeEventListener("gesturestart", gs); el.removeEventListener("gesturechange", gc); el.removeEventListener("gestureend", ge);
    };
  }, [ref]);
}

/**
 * The maps' look (16 Nov): light, like a printed map. Flat colour, no glow, no gradients, nothing pulsing: a pale
 * teal-grey sea, near-white land (Egypt a warm limestone), borders as hairlines of the sea, lines, pins and names in
 * Deep Sea, the chosen country in the brand's rust.
 */
export const SEA = "#BFD0CC";
/** country borders: a shade deeper than the sea, so they read on the white land */
export const BORDER = "#AFC1BD";
export const landClass = (inert: boolean, home: boolean) => inert
  ? "pointer-events-none fill-[#efebe4]"
  : `cursor-pointer hover:fill-[#e6d8c2] ${home ? "fill-[#eee2d0]" : "fill-limestone-50"}`;
/** the light glass the info card, the zoom buttons and the hover name share */
export const GLASS = "border border-deepsea-500/10 bg-limestone-50/80 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_32px_-8px_rgb(1_15_26/0.45)]";
/** the map block's frame (MapBlock and its loading placeholder share it, so nothing jumps when the map arrives) */
export const BLOCK = "relative overflow-hidden rounded-lg max-lg:flex max-lg:flex-col max-md:-mx-[var(--gutter)] max-md:rounded-none lg:h-[clamp(600px,84svh,880px)]";
