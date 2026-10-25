"use client";
import { createElement, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";

/** A run of text; `i` marks the Immortel italic accent word, `br` forces a new line before it. */
export type Seg = { t: string; i?: boolean; br?: boolean };
type Word = { t: string; i?: boolean; br?: boolean };

const toWords = (segs: Seg[]): Word[] => {
  const out: Word[] = [];
  segs.forEach((s) => s.t.split(/\s+/).filter(Boolean).forEach((w, k) => out.push({ t: w, i: s.i, br: s.br && k === 0 })));
  return out;
};

/**
 * Hassan Allam's text reveal: the copy is measured into its real rendered lines, each
 * line sits in its own mask, and the lines rise into place one after another.
 */
export default function RevealText({ as = "p", segs, text, className = "", onLoad = false, delay = 0, stagger = 0.09 }:
  { as?: string; segs?: Seg[]; text?: string; className?: string; onLoad?: boolean; delay?: number; stagger?: number }) {
  const words = toWords(segs ?? [{ t: text ?? "" }]);
  const root = useRef<HTMLElement>(null);
  const [lines, setLines] = useState<number[][] | null>(null);
  const revealed = useRef(false);

  const measure = useCallback(() => {
    const el = root.current; if (!el) return;
    const spans = el.querySelectorAll<HTMLElement>("[data-w]");
    const groups: number[][] = []; let top = -1;
    spans.forEach((s, idx) => {
      const y = s.offsetTop;
      if (groups.length === 0 || Math.abs(y - top) > 4 || words[idx].br) { groups.push([idx]); top = y; } else groups[groups.length - 1].push(idx);
    });
    setLines(groups);
  }, [words]);

  useLayoutEffect(() => { if (!lines) measure(); }, [lines, measure]);
  useEffect(() => {
    let w = window.innerWidth;
    const onResize = () => { if (window.innerWidth !== w) { w = window.innerWidth; setLines(null); } };
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(() => setLines(null));
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const el = root.current; if (!el || !lines) return;
    const inners = el.querySelectorAll(".rt-inner");
    if (revealed.current || reducedMotion()) { gsap.set(inners, { yPercent: 0 }); return; }
    gsap.set(inners, { yPercent: 115 });
    const play = () => { revealed.current = true; gsap.to(inners, { yPercent: 0, duration: 1.15, ease: "siteOut", stagger, delay }); };
    if (onLoad) { play(); return; }
    const st = ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: play });
    return () => st.kill();
  }, [lines, onLoad, delay, stagger]);

  const word = (w: Word, idx: number, last: boolean) => (
    <span key={idx} data-w className={w.i ? "t-accent" : undefined}>{w.t}{last ? "" : " "}</span>
  );
  const body = !lines
    ? words.map((w, idx) => [w.br && idx > 0 ? <br key={`b${idx}`} /> : null, word(w, idx, idx === words.length - 1)])
    : lines.map((g, li) => (
        <span key={li} className="rt-line"><span className="rt-inner">{g.map((idx, k) => word(words[idx], idx, k === g.length - 1))}</span></span>
      ));
  return createElement(as, { ref: root, className, style: !lines ? { visibility: "hidden" } : undefined }, body);
}
