"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import Button from "@/components/ui/Button";
import RevealText from "@/components/reveal/RevealText";
import { grandeur, lighthouse } from "@/lib/content";

const FRAMES = 185;
const src = (i: number) => `/seq/marina-hd/${String(i + 1).padStart(4, "0")}.webp`;
const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const Bars = () => (
  <span className="flex h-7 items-end gap-[3px]">{[9, 15, 12, 20, 27].map((h, k) => <i key={k} className="block w-[6px] rounded-[1px] bg-deepsea-300" style={{ height: h }} />)}</span>
);
/** Parallax speed per card (px of drift over the section's pass): each card rises at its own pace. */
const SPEED = [140, 90, 170, 110, 60, 150, 80, 190, 70, 130, 100, 160];

/**
 * Grandeur + Lighthouse as one tall section over a single scroll-scrubbed film:
 * the camera tilts down and descends, so the picture rises with the scroll.
 * The film is drawn from a frame sequence on a sticky canvas (smooth in every browser).
 * Grandeur is the Figma "UI / Grandeur Constellation" (10921:28032): the cards start stacked behind the headline,
 * scatter outward as the section comes in (Smart animate 1.4 s, cubic-bezier(.16,1,.3,1)), then drift upward
 * at different speeds with the scroll.
 */
export default function ScrollStory() {
  const wrap = useRef<HTMLElement>(null), canvas = useRef<HTMLCanvasElement>(null), stageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const c = canvas.current!, ctx = c.getContext("2d")!; const imgs: HTMLImageElement[] = []; let cur = 0;
    const draw = (i: number) => {
      const img = imgs[i]; if (!img || !img.complete || !img.naturalWidth) return;
      const s = Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight), w = img.naturalWidth * s, h = img.naturalHeight * s;
      ctx.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h);
    };
    const size = () => { const r = c.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2); c.width = r.width * d; c.height = r.height * d; draw(cur); };
    for (let i = 0; i < FRAMES; i++) { const im = new Image(); im.decoding = "async"; im.src = src(i); im.onload = () => { if (i === cur) draw(i); }; imgs.push(im); }
    size(); window.addEventListener("resize", size);
    const st = ScrollTrigger.create({
      trigger: wrap.current, start: "top top", end: "bottom bottom",
      onUpdate: (self) => { const i = Math.round(self.progress * (FRAMES - 1)); if (i !== cur) { cur = i; draw(i); } },
    });
    // constellation: stacked behind the headline → scattered (once, as it comes in) → parallax drift (scrubbed)
    const stage = stageRef.current!;
    const cards = gsap.utils.toArray<HTMLElement>("[data-card]", stage);
    const tweens: gsap.core.Animation[] = [];
    if (!reducedMotion()) {
      const unit = () => stage.offsetWidth / 1512;
      cards.forEach((el, k) => {
        const c = grandeur.cards[k];
        gsap.set(el.firstElementChild, { x: () => (c.sx - c.x) * unit(), y: () => (c.sy - c.y) * unit() });
        tweens.push(gsap.fromTo(el, { y: 0 }, { y: () => -SPEED[k] * unit() * 1.5, ease: "none",
          scrollTrigger: { trigger: stage, start: "top bottom", end: "bottom top", scrub: 1, invalidateOnRefresh: true } }));
      });
      tweens.push(gsap.to(cards.map((el) => el.firstElementChild), { x: 0, y: 0, duration: 1.4, ease: "siteOut", stagger: 0.03,
        scrollTrigger: { trigger: stage, start: "top 50%", toggleActions: "play none none none" } }));
    }
    return () => { st.kill(); tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); }); window.removeEventListener("resize", size); };
  }, []);

  return (
    <section ref={wrap} className="relative">
      <div className="pointer-events-none absolute inset-0">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <canvas ref={canvas} className="h-full w-full" />
        </div>
      </div>

      {/* Grandeur · the constellation over the sky */}
      <div ref={stageRef} className="relative w-full" style={{ aspectRatio: "1512 / 1080" }}>
        {grandeur.cards.map((c, k) => (
          // outer: scattered slot + parallax; inner: offset to the stacked slot, released on scroll-in
          <div key={k} data-card className="absolute hidden md:block" style={{ left: pct(c.x, 1512), top: pct(c.y, 1080), width: pct(c.w, 1512) }}>
            {c.kind === "image" ? (
              <div className="overflow-hidden rounded-lg" style={{ aspectRatio: `${c.w} / ${c.h}` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.src} alt="" className="h-full w-full object-cover" />
              </div>
            ) : c.kind === "stat" ? (
              <div className="flex flex-col gap-3 rounded-lg bg-deepsea-500 px-4 py-[14px]">
                <span className="t-label l-12 text-deepsea-200">{c.label}</span>
                <span className="flex items-end justify-between"><span className="t-text x-28 text-limestone-50">{c.value}</span><Bars /></span>
                <span className="t-text x-12 text-deepsea-200">{c.note}</span>
              </div>
            ) : (
              <span className={`inline-flex items-center gap-2 whitespace-nowrap rounded-md px-[14px] py-2 t-label l-12 ${c.dark ? "bg-deepsea-500 text-limestone-50" : "bg-limestone-100 text-deepsea-500"}`}>
                <i className={`block h-2 w-2 rounded-full ${c.dark ? "bg-limestone-50" : "bg-deepsea-600"}`} />{c.label}
              </span>
            )}
          </div>
        ))}
        <div className="relative z-10 mx-auto flex w-[min(760px,90%)] flex-col items-center gap-6 pt-16 text-center md:absolute md:left-1/2 md:top-[34.8%] md:-translate-x-1/2 md:pt-0">
          <span className="rounded bg-limestone-100 px-[10px] py-1 t-label l-12">{grandeur.tag}</span>
          <RevealText as="h2" text={grandeur.title} className="t-heading hd-56 text-deepsea-500" />
          <RevealText text={grandeur.body} className="t-body b-18 max-w-[620px] text-limestone-800" delay={0.15} />
        </div>
      </div>

      {/* Lighthouse · the film arrives at the boardwalk */}
      <div className="relative flex w-full flex-col items-center justify-end gap-8 pb-20 text-center" style={{ aspectRatio: "1512 / 1185" }}>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-b from-transparent to-[#010F1A]/60" />
        <RevealText as="h2" segs={lighthouse.title} className="relative t-heading hd-56 max-w-[1100px] text-limestone-50" />
        <Button label={lighthouse.cta} href="/about" size={54} variant="outline-light" className="relative" />
      </div>
    </section>
  );
}
