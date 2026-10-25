"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import SectionTitle from "@/components/sections/SectionTitle";
import { milestones as M } from "@/lib/about/b-content";

const TICKS = 15;
/** Tick heights: 56 at rest (Figma Default), swelling to 136 at the focus (Figma Hover's peak). */
const LOW = 56, HIGH = 136;
/** The focus line sits at this fraction of the rail's visible width; the wave's half-width in px. */
const FOCUS = 0.3, SPREAD = 260;

/** One "UI / Milestone": the year, the tick rhythm, and its description and photo (revealed by the scroll). */
function Milestone({ i }: { i: number }) {
  const m = M.items[i];
  return (
    <div data-ms className="relative flex w-[320px] flex-none snap-start flex-col gap-10 lg:w-[400px]">
      <span data-ms-line className="absolute inset-y-0 left-0 w-px origin-top bg-deepsea-500" />
      <div className="flex flex-col gap-2 pl-4">
        <span className="relative t-text text-[44px] leading-[1.07] text-limestone-800 lg:text-[56px]">
          {m.year}<span data-ms-on aria-hidden className="absolute inset-0 text-deepsea-500 opacity-0">{m.year}</span>
        </span>
        <span data-ms-title className="t-text x-16 text-limestone-800">{m.title}</span>
      </div>
      <div className="flex h-[136px] items-center gap-6 pl-6" aria-hidden>
        {Array.from({ length: TICKS }, (_, k) => <i key={k} data-ms-tick className="block h-[136px] w-px flex-none origin-center bg-deepsea-500" />)}
      </div>
      <div data-ms-detail className="-mt-4 flex flex-col gap-6 px-6">
        <p className="t-body b-16 text-limestone-800">{m.body}</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={m.photo} alt={m.title} loading="lazy" className="aspect-[352/200] w-full rounded-lg object-cover" />
      </div>
    </div>);
}

/**
 * Milestones · phase one, as one continuous horizontal scroll (no hover, no steps — Figma's Default/Hover
 * states only stood in for this because a prototype can't scroll). On desktop the section pins and the rail
 * travels left with the scroll; below lg it swipes natively. Either way the ticks form a single wave that
 * rolls along the rail — each one scales up as it nears the focus line and back down as it passes — and each
 * milestone's year, description and photo come up as it reaches the focus and fade as it leaves.
 */
export default function Milestones() {
  const root = useRef<HTMLElement>(null), rail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!, r = rail.current!;
    const ticks = gsap.utils.toArray<HTMLElement>("[data-ms-tick]", el), cards = gsap.utils.toArray<HTMLElement>("[data-ms]", el);
    const rm = reducedMotion();
    // the wave: positions are read relative to the rail's viewport each frame (rail translate or native scroll)
    const paint = () => {
      const view = r.parentElement!.getBoundingClientRect();
      const fx = view.left + view.width * FOCUS;
      for (const t of ticks) {
        const b = t.getBoundingClientRect(), d = (b.left - fx) / SPREAD, k = Math.exp(-d * d);   // 1 at the focus → 0 away
        t.style.transform = `scaleY(${(LOW + (HIGH - LOW) * k) / HIGH})`;
      }
      for (const c of cards) {
        const b = c.getBoundingClientRect(), mid = b.left + Math.min(b.width, 400) * 0.35, d = (mid - fx) / (SPREAD * 1.6);
        const k = rm ? 1 : Math.max(0, Math.exp(-d * d) * 1.25 - 0.1), o = Math.min(1, k);
        const det = c.querySelector<HTMLElement>("[data-ms-detail]")!, on = c.querySelector<HTMLElement>("[data-ms-on]")!;
        det.style.opacity = String(o); det.style.transform = `translateY(${(1 - o) * 24}px)`;
        on.style.opacity = String(o);
      }
    };
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const dist = () => Math.max(0, r.scrollWidth - r.parentElement!.clientWidth * (1 - FOCUS) + 120);
      const tw = gsap.to(r, { x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: () => `+=${dist() * 1.1}`, pin: true, scrub: 1, invalidateOnRefresh: true, onRefresh: paint } });
      gsap.ticker.add(paint);
      return () => { gsap.ticker.remove(paint); tw.scrollTrigger?.kill(); tw.kill(); gsap.set(r, { clearProps: "transform" }); };
    });
    mm.add("(max-width: 1023px)", () => {
      r.addEventListener("scroll", paint, { passive: true }); window.addEventListener("scroll", paint, { passive: true }); paint();
      return () => { r.removeEventListener("scroll", paint); window.removeEventListener("scroll", paint); };
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="flex flex-col justify-center gap-16 overflow-hidden bg-limestone-50 py-20 lg:h-svh lg:min-h-[760px] lg:py-12">
      <SectionTitle tag={M.tag} title={M.title} body={M.body} className="mx-auto max-w-[920px] container-x" />
      <div className="container-x">
        <div ref={rail}
          className="-mx-[var(--gutter)] flex snap-x snap-mandatory items-start overflow-x-auto px-[var(--gutter)] [scrollbar-width:none] lg:mx-0 lg:snap-none lg:overflow-visible lg:px-0">
          {M.items.map((m, i) => <Milestone key={m.year} i={i} />)}
        </div>
      </div>
    </section>
  );
}
