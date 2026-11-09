"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import Button from "@/components/ui/Button";
import RevealText from "@/components/reveal/RevealText";
import { grandeur, lighthouse, type GrandeurCard } from "@/lib/content";
import { srcSet } from "@/lib/img";
import { frameLoader } from "@/lib/frames";
import { MQ } from "@/lib/breakpoints";

const FRAMES = 229;
/** 1920 × 1080 WebP frames on every screen, at 30 fps (the 24 fps film with in-between frames made by motion
 *  interpolation, so each frame covers less scroll): held decoded, a 4K set would be ~6 GB, enough for Safari to
 *  reload the page (a 4K AVIF set of the 24 fps film is kept in docs/upscale/4k/seq-avif). */
const src = (i: number) => `/seq/marina-30/${String(i + 1).padStart(4, "0")}.webp`;
const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const Bars = () => (
  <span className="flex h-7 items-end gap-[3px]">{[9, 15, 12, 20, 27].map((h, k) => <i key={k} className="block w-[6px] rounded-[1px] bg-deepsea-300" style={{ height: h }} />)}</span>
);
/** One constellation card: a photo, a Figma stat tile ($29.7Bn, 22 km …) or a chip */
const Card = ({ c, fill = false }: { c: GrandeurCard; fill?: boolean }) =>
  c.kind === "image" ? (
    <div className="overflow-hidden" style={{ aspectRatio: `${c.w} / ${c.h}` }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={c.src} srcSet={srcSet(c.src)} alt="" className="h-full w-full object-cover" />
    </div>
  ) : c.kind === "stat" ? (
    // a container: a narrow tile (the phone side columns) drops its bars and note and keeps its value on one line;
    // `fill` stretches it to its slot (a phone band sizes it to match the photo beside it)
    <div className={`@container flex flex-col gap-3 ${fill ? "h-full justify-between" : ""} rounded-lg bg-deepsea-500 px-4 py-[14px] text-left max-lg:gap-2 max-lg:px-3 max-lg:py-[10px]`}>
      <span className="t-label l-12 text-deepsea-200">{c.label}</span>
      <span className="flex items-end justify-between"><span className="whitespace-nowrap t-text x-28 text-limestone-50">{c.value}</span><span className="hidden @min-[100px]:block"><Bars /></span></span>
      <span className="t-text x-12 text-deepsea-200 @max-[120px]:hidden">{c.note}</span>
    </div>
  ) : (
    <span className={`inline-flex items-center gap-2 whitespace-nowrap rounded px-[14px] py-2 t-label l-12 ${c.dark ? "bg-deepsea-500 text-limestone-50" : "bg-limestone-100 text-deepsea-500"}`}>
      <i className={`block h-2 w-2 rounded-full ${c.dark ? "bg-limestone-50" : "bg-deepsea-600"}`} />{c.label}
    </span>
  );
/** Parallax speed per card (px of drift over the section's pass): each card rises at its own pace. */
const SPEED = [140, 90, 170, 110, 60, 150, 80, 190, 70, 130, 100, 160];

/**
 * Phones and tablets: the constellation in two bands, one above the copy and one below, so no card ever crosses the
 * text (no chips on phones: photos and numbers only). Positions are px on a 350-wide band (scaled with the band),
 * each band as tall as BH; `k` is the card in grandeur.cards, `v` its upward drift in px over the section's pass
 * (always up, and less than the band's gap to the copy, so the lower band never reaches the body and no card ever
 * moves down towards the lighthouse). The drifts differ only a little, so the cards keep their alignment as they
 * rise. Both bands share the same edges: a 104 left column at x 0 and a right edge at 350, tops aligned per row,
 * and a stat tile with `h` takes that height, so it lines up with the photo beside it.
 * The lower band is still on screen when the film's lighthouse tower rises into the middle of the frame, so it
 * keeps a clear centre (x 104–246): two side columns, with the tower between them.
 */
const BW = 350, BH = [134, 208];
const BANDS: { k: number; x: number; y: number; w: number; h?: number; v: number }[][] = [
  [ // above the copy, tops aligned: facade | $29.7Bn | lounge
    { k: 0, x: 0, y: 0, w: 104, v: 22 },
    { k: 1, x: 116, y: 0, w: 152, h: 134, v: 18 },   // as tall as the facade
    { k: 2, x: 280, y: 0, w: 70, v: 26 },
  ],
  [ // below the copy, two 104 columns clear of the tower: court over colonnade | 22 km over pool
    { k: 7, x: 0, y: 0, w: 104, v: 20 },
    { k: 3, x: 246, y: 0, w: 104, h: 90, v: 24 },    // as tall as the court
    { k: 9, x: 0, y: 104, w: 104, v: 16 },
    { k: 4, x: 246, y: 104, w: 104, v: 20 },
  ],
];

/**
 * Grandeur + Lighthouse as one tall section over a single scroll-scrubbed film:
 * the camera tilts down and descends, so the picture rises with the scroll.
 * The film is drawn from a frame sequence on a sticky canvas (smooth in every browser).
 * Grandeur is the Figma "UI / Grandeur Constellation" (10921:28032): the cards start stacked behind the headline,
 * scatter outward as the section comes in (Smart animate 1.4 s, cubic-bezier(.16,1,.3,1)), then drift upward
 * at different speeds with the scroll. Below lg the same three beats play on the two bands (BANDS).
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
    // constellation: stacked behind the headline → scattered (once, as it comes in) → parallax drift (scrubbed)
    const stage = stageRef.current!;
    const mm = gsap.matchMedia();
    if (!reducedMotion()) {
      mm.add(MQ.lg, () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-card]", stage);
        const unit = () => stage.offsetWidth / 1512;
        cards.forEach((el, k) => {
          const c = grandeur.cards[k];
          gsap.set(el.firstElementChild, { x: () => (c.sx - c.x) * unit(), y: () => (c.sy - c.y) * unit() });
          gsap.fromTo(el, { y: 0 }, { y: () => -SPEED[k] * unit() * 1.5, ease: "none",
            scrollTrigger: { trigger: stage, start: "top bottom", end: "bottom top", scrub: 1, invalidateOnRefresh: true } });
        });
        gsap.to(cards.map((el) => el.firstElementChild), { x: 0, y: 0, duration: 1.4, ease: "siteOut", stagger: 0.03,
          scrollTrigger: { trigger: stage, start: "top 80%", toggleActions: "play none none none" } });
      });
      mm.add(MQ.belowLg, () => {
        const copy = copyRef.current!;
        const cards = gsap.utils.toArray<HTMLElement>("[data-pcard]", stage);
        // gathered: each card pulled most of the way to the copy's centre, small and clear, so the scatter reads as
        // the cards flying out from behind the headline (measured at play time, after the layout has settled)
        const gather = (el: HTMLElement) => {
          const a = el.getBoundingClientRect(), b = copy.getBoundingClientRect();
          return { x: (b.left + b.width / 2 - (a.left + a.width / 2)) * 0.6, y: (b.top + b.height / 2 - (a.top + a.height / 2)) * 0.6 };
        };
        gsap.set(cards.map((el) => el.firstElementChild), { opacity: 0, scale: 0.8 });
        cards.forEach((el) => {
          gsap.fromTo(el, { y: 0 }, { y: -Number(el.dataset.v), ease: "none",
            scrollTrigger: { trigger: stage, start: "top bottom", end: "bottom top", scrub: 1 } });
        });
        ScrollTrigger.create({ trigger: stage, start: "top 75%", once: true, onEnter: () => {
          const inner = cards.map((el) => el.firstElementChild as HTMLElement);
          inner.forEach((el, k) => gsap.set(el, gather(cards[k])));
          gsap.to(inner, { x: 0, y: 0, opacity: 1, scale: 1, duration: 1.4, ease: "siteOut", stagger: 0.04, delay: 0.2 });
        } });
      });
    }
    return () => { mm.revert(); stopLoading(); st.kill(); window.removeEventListener("resize", size); };
  }, []);

  const band = (i: number) => (
    <div className={`relative z-0 mx-auto w-[min(calc(100%-2*var(--gutter)),440px)] lg:hidden ${i ? "mt-12" : "mb-8"}`} style={{ aspectRatio: `${BW} / ${BH[i]}` }}>
      {BANDS[i].map(({ k, x, y, w, h, v }) => (
        // outer: the band slot + upward drift; inner: offset to the gathered slot, released on scroll-in
        <div key={k} data-pcard data-v={v} className="absolute" style={{ left: pct(x, BW), top: pct(y, BH[i]), width: pct(w, BW) }}>
          <div style={h ? { aspectRatio: `${w} / ${h}` } : undefined}><Card c={grandeur.cards[k]} fill={!!h} /></div>
        </div>
      ))}
    </div>
  );

  return (
    <section ref={wrap} className="relative">
      {/* clip (not hidden) so the sticky film still sticks, yet never spills past the section on short screens */}
      <div className="pointer-events-none absolute inset-0 overflow-clip">
        <div className="sticky top-0 h-svh w-full overflow-hidden">
          <canvas ref={canvas} className="h-full w-full" />
        </div>
      </div>

      {/* Grandeur · the constellation over the sky (laptops: the Figma scatter around the headline; phones and
          tablets: two bands of cards, above and below the copy) */}
      <div ref={stageRef} className="relative flex min-h-svh w-full flex-col justify-center pb-8 pt-16 lg:block lg:min-h-0 lg:aspect-[1512/1080] lg:p-0">
        {/* Figma fill over the paused film: Limestone/50 solid to halfway, clearing to the sunrise at the bottom */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-limestone-50 via-limestone-50 via-50% to-limestone-50/0" />
        {grandeur.cards.map((c, k) => (
          // outer: scattered slot + parallax; inner: offset to the stacked slot, released on scroll-in
          <div key={k} data-card className="absolute hidden lg:block" style={{ left: pct(c.x, 1512), top: pct(c.y, 1080), width: pct(c.w, 1512) }}>
            <div><Card c={c} /></div>
          </div>
        ))}
        {band(0)}
        <div ref={copyRef} className="relative z-10 mx-auto flex w-[min(760px,90%)] flex-col items-center gap-6 text-center lg:absolute lg:left-1/2 lg:top-[34.8%] lg:-translate-x-1/2">
          <span className="rounded bg-limestone-100 px-[10px] py-1 t-label l-12">{grandeur.tag}</span>
          <RevealText as="h2" text={grandeur.title} className="t-heading hd-56 text-deepsea-500" />
          <RevealText text={grandeur.body} className="t-body b-18 max-w-[620px] text-limestone-800" delay={0.15} />
        </div>
        {band(1)}
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
