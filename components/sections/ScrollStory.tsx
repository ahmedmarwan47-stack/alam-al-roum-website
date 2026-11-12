"use client";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import Button from "@/components/ui/Button";
import RevealText from "@/components/reveal/RevealText";
import { grandeur, lighthouse } from "@/lib/content";
import { frameLoader } from "@/lib/frames";

const FRAMES = 229;
/** 1920 × 1080 WebP frames on every screen, at 30 fps (the 24 fps film with in-between frames made by motion
 *  interpolation, so each frame covers less scroll): held decoded, a 4K set would be ~6 GB, enough for Safari to
 *  reload the page (a 4K AVIF set of the 24 fps film is kept in docs/upscale/4k/seq-avif). */
const src = (i: number) => `/seq/marina-30/${String(i + 1).padStart(4, "0")}.webp`;
/** The four Grandeur figures ($29.7Bn, 22 km, Minutes, 2–5 hrs), as one calm row under the intro (12 Nov review, #51:
 *  the scattered photo and stat cards read as cluttered; the film and the lighthouse are unchanged). */
const stats = grandeur.cards.filter((c) => c.kind === "stat");

/**
 * Grandeur + Lighthouse as one tall section over a single scroll-scrubbed film:
 * the camera tilts down and descends, so the picture rises with the scroll.
 * The film is drawn from a frame sequence on a sticky canvas (smooth in every browser).
 * Grandeur is the headline, its intro and the four figures in one row over the paused first frame (12 Nov review:
 * the Figma constellation of scattered photo and stat cards was removed as too cluttered).
 */
export default function ScrollStory() {
  const wrap = useRef<HTMLElement>(null), canvas = useRef<HTMLCanvasElement>(null), stageRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const c = canvas.current!, ctx = c.getContext("2d")!; let cur = 0, shown = -1;
    // the frame the scroll asks for, or the nearest one that has arrived (the film never freezes waiting on one)
    const draw = (i: number) => {
      const f = frames.nearest(i); if (!f) return;
      const [img] = f; shown = f[1];
      const s = Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight), w = img.naturalWidth * s, h = img.naturalHeight * s;
      ctx.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h);
    };
    const size = () => { const r = c.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2); c.width = r.width * d; c.height = r.height * d; draw(cur); };
    // a frame that lands closer to where the scroll is than the one on screen replaces it
    const frames = frameLoader(FRAMES, src, (i) => { if (shown < 0 || Math.abs(i - cur) < Math.abs(shown - cur)) draw(cur); });
    const stopLoading = frames.startWhenNear(wrap.current!);
    size(); window.addEventListener("resize", size);
    const st = ScrollTrigger.create({
      trigger: wrap.current, start: "top top", end: "bottom bottom",
      onUpdate: (self) => { const i = Math.round(self.progress * (FRAMES - 1)); if (i !== cur) { cur = i; draw(i); } },
    });
    return () => { stopLoading(); st.kill(); window.removeEventListener("resize", size); };
  }, []);

  return (
    <section ref={wrap} className="relative">
      {/* clip (not hidden) so the sticky film still sticks, yet never spills past the section on short screens */}
      <div className="pointer-events-none absolute inset-0 overflow-clip">
        <div className="sticky top-0 h-svh w-full overflow-hidden">
          <canvas ref={canvas} className="h-full w-full" />
        </div>
      </div>

      {/* Grandeur · the headline, its intro and the four figures over the sky (12 Nov review: one row of numbers in
          place of the scattered photo and stat cards); the film beneath is untouched */}
      <div ref={stageRef} className="relative flex min-h-svh w-full flex-col justify-center pb-40 pt-24 lg:block lg:min-h-0 lg:aspect-[1512/1080] lg:p-0">
        {/* Figma fill over the paused film: Limestone/50 solid, clearing to the sunrise at the bottom; held solid a
            little lower than before (60 %), so the figures under the intro stay on Limestone */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-limestone-50 via-limestone-50 via-72% to-limestone-50/0 lg:via-60%" />
        <div ref={copyRef} className="relative z-10 mx-auto flex w-[min(1040px,calc(100%-2*var(--gutter)))] flex-col items-center gap-6 text-center lg:absolute lg:left-1/2 lg:top-[22%] lg:-translate-x-1/2">
          <span className="rounded bg-limestone-100 px-[10px] py-1 t-label l-12">{grandeur.tag}</span>
          <RevealText as="h2" text={grandeur.title} className="t-heading hd-56 max-w-[760px] text-deepsea-500" />
          <RevealText text={grandeur.body} className="t-body b-18 max-w-[620px] text-limestone-800" delay={0.15} />
          {/* phones: two by two; from lg one row of four, hairlines between */}
          <dl className="mt-6 grid w-full grid-cols-2 gap-x-6 gap-y-8 lg:mt-10 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-deepsea-500/15">
            {stats.map((c, k) => (
              <div key={c.label} className="flex flex-col items-center gap-2 lg:px-6">
                <RevealText as="dd" text={c.value!} className="order-2 t-heading hd-40 normal-case! text-deepsea-500" delay={0.2 + k * 0.06} />
                <dt className="order-1 t-label l-12 uppercase text-limestone-800">{c.label}</dt>
                <RevealText as="dd" text={c.note!} className="order-3 t-body b-14 text-limestone-800" delay={0.26 + k * 0.06} />
              </div>))}
          </dl>
        </div>
      </div>

      {/* Lighthouse · the film arrives at the boardwalk */}
      <div className="relative flex min-h-svh w-full flex-col items-center justify-end gap-8 px-[var(--gutter)] pb-20 text-center lg:min-h-0 lg:aspect-[1512/1185]">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-b from-transparent to-[#010F1A]/60" />
        <RevealText as="h2" segs={lighthouse.title} className="relative t-heading hd-56 max-w-[1100px] text-limestone-50" />
        <Button label={lighthouse.cta} href="/about" size={54} variant="outline-light" className="relative" />
      </div>
    </section>
  );
}
