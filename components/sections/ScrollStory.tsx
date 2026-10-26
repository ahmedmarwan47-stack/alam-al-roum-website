"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Button from "@/components/ui/Button";
import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";
import { grandeur, lighthouse } from "@/lib/content";

const FRAMES = 185;
const src = (i: number) => `/seq/marina-hd/${String(i + 1).padStart(4, "0")}.webp`;
const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const Bars = () => (
  <span className="flex h-7 items-end gap-[3px]">{[9, 15, 12, 20, 27].map((h, k) => <i key={k} className="block w-[6px] rounded-[1px] bg-deepsea-300" style={{ height: h }} />)}</span>
);

/**
 * Grandeur + Lighthouse as one tall section over a single scroll-scrubbed film:
 * the camera tilts down and descends, so the picture rises with the scroll.
 * The film is drawn from a frame sequence on a sticky canvas (smooth in every browser).
 */
export default function ScrollStory() {
  const wrap = useRef<HTMLElement>(null), canvas = useRef<HTMLCanvasElement>(null);
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
    // stat cards and chips drift up slightly faster than the page, like the reference's floating constellation
    const drift = gsap.utils.toArray<HTMLElement>("[data-drift]", wrap.current).map((el) =>
      gsap.fromTo(el, { y: 60 }, { y: -60, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 } }));
    return () => { st.kill(); drift.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); }); window.removeEventListener("resize", size); };
  }, []);

  return (
    <section ref={wrap} className="relative">
      <div className="pointer-events-none absolute inset-0">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <canvas ref={canvas} className="h-full w-full" />
        </div>
      </div>

      {/* Grandeur · numbers over the sky */}
      <div className="relative w-full" style={{ aspectRatio: "1512 / 1080" }}>
        {grandeur.images.map((im, k) => (
          <div key={k} className="absolute hidden overflow-hidden rounded-lg md:block" style={{ left: pct(im.x, 1512), top: pct(im.y, 1080), width: pct(im.w, 1512), aspectRatio: `${im.w} / ${im.h}` }}>
            <RevealImage src={im.src} delay={k * 0.06} from={k % 2 ? "left" : "right"} className="h-full w-full" />
          </div>
        ))}
        {grandeur.stats.map((s, k) => (
          <div key={k} data-drift className="absolute hidden flex-col gap-3 rounded-lg bg-deepsea-500 px-4 py-[14px] md:flex" style={{ left: pct(s.x, 1512), top: pct(s.y, 1080), width: s.w }}>
            <span className="t-label l-12 text-deepsea-200">{s.label}</span>
            <span className="flex items-end justify-between"><span className="t-text x-28 text-limestone-50">{s.value}</span><Bars /></span>
            <span className="t-text x-12 text-deepsea-200">{s.note}</span>
          </div>
        ))}
        {grandeur.chips.map((c, k) => (
          <span key={k} data-drift className={`absolute hidden items-center gap-2 rounded-md px-[14px] py-2 t-label l-12 md:inline-flex ${c.dark ? "bg-deepsea-500 text-limestone-50" : "bg-limestone-100 text-deepsea-500"}`} style={{ left: pct(c.x, 1512), top: pct(c.y, 1080) }}>
            <i className={`block h-2 w-2 rounded-full ${c.dark ? "bg-limestone-50" : "bg-deepsea-600"}`} />{c.label}
          </span>
        ))}
        <div className="absolute left-1/2 top-[34.8%] flex w-[min(760px,90%)] -translate-x-1/2 flex-col items-center gap-6 text-center">
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
