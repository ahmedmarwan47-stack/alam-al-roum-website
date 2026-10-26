"use client";
import { useEffect, useRef, type ElementType } from "react";
import { blurIn, BLOCK_FROM } from "./letters";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";

/** A run of text; `i` marks the Immortel italic accent word, `br` forces a new line before it. */
export type Seg = { t: string; i?: boolean; br?: boolean };

/**
 * Text reveal: the whole block blurs in at once (opacity, a 12 px blur and a 16 px rise clearing together,
 * 1.1 s on the site's long ease-out), when it comes into view or, with `onLoad`, as the page opens.
 * No line, word or letter splitting, so the text never re-flows or jumps as it appears.
 */
export default function RevealText({ as = "p", segs, text, className = "", onLoad = false, delay = 0 }:
  { as?: string; segs?: Seg[]; text?: string; className?: string; onLoad?: boolean; delay?: number; stagger?: number }) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current; if (!el || reducedMotion()) return;
    gsap.set(el, BLOCK_FROM);
    if (onLoad) { const t = blurIn(el, { delay }); return () => { t.kill(); }; }
    let done = false;
    const play = () => { if (!done) { done = true; blurIn(el, { delay }); } };
    const st = ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: play });
    // a block already above that line (page opened mid-way, a tab switched in) plays straight away
    const id = requestAnimationFrame(() => { if (st.scroll() >= st.start) play(); });
    return () => { cancelAnimationFrame(id); st.kill(); };
  }, [onLoad, delay]);
  // no orphans: the block's last two words never part (a no-break space), whether they share a run or not
  const list = segs ?? [{ t: text ?? "" }], last = list.length - 1;
  const words = list.reduce((n, x) => n + x.t.trim().split(/\s+/).length, 0);
  const lastRun = list[last]?.t.trim() ?? "", single = !/\s/.test(lastRun);
  const body = list.map((s, k) => {
    const t = k === last && words > 2 && !single ? s.t.trim().replace(/\s+(\S+)$/, "\u00a0$1") : s.t;
    const gap = k === 0 ? null : s.br ? <br key={`b${k}`} /> : k === last && words > 2 && single ? "\u00a0" : " ";
    return [gap, s.i ? <span key={k} className="t-accent">{t}</span> : <span key={k}>{t}</span>];
  });
  const Tag = as as ElementType;
  return <Tag ref={root} className={className} data-reveal="">{body}</Tag>;
}
