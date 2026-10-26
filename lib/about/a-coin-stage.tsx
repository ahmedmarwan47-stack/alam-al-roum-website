"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { idlePose, COIN_FILL, type CoinPose } from "@/components/ui/Coin3D";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import "@/lib/about/a-motion";
import { coin as C } from "@/lib/about/a-content";
import { BLOCK_FROM, BLOCK_TO } from "@/components/reveal/letters";

/** Figma frame (UI / Section / Landmark Reveal): 1512 × 1024. */
const FW = 1512, FH = 1024;
const MASK = `url(${C.mask}) no-repeat`;
const Coin3D = dynamic(() => import("@/components/ui/Coin3D"), { ssr: false });
/** The window opens a little after the coin has dissolved into it (timeline seconds). */
const COIN_GONE = 2.0;
/** Coin centre at rest: Figma's 379.5 raised by 20 so the turning coin keeps ~40 px clear of GRANDEUR. */
const COIN_CY = 359.5;
/** The sky-fall film as a frame sequence (every 2nd frame of grandeur-skyfall-v2, 1920 × 1080 WebP), drawn on a canvas. */
const FRAMES = 145;
const frameSrc = (i: number) => `/seq/skyfall/${String(i + 1).padStart(4, "0")}.webp`;

/**
 * UI / Section / Landmark Reveal (10979:18395), pinned and scrubbed as ONE continuous move (linear with the scroll,
 * smoothed scrub, no holds — Figma's pauses only existed because a prototype can't scroll):
 * 1 Spin: the landing page's 3D gold coin idles and bobs over GRANDEUR; scrolling turns it in place (1½ turns) onto its compass face.
 * 2 Reveal: the same 3D coin grows with the coin-shaped window (260 → 900) and dissolves into the film behind it,
 *   so there is no hand-over to a flat coin image.
 *   GRANDEUR fades and blurs out as the window's edge approaches it, so the two never overlap.
 * 3 Fill: the window grows past the screen (3000). 4 Restored: a soft Deep Sea shade, the headline, the subline and
 *   the history points blur in, block by block. The progress tick steps with it.
 * The film is scrubbed by the scroll from the reveal on (forwards down, backwards up); never blurred, no clouds.
 * It is a frame sequence painted on a canvas rather than a seeking <video>: the source has two keyframes in 12 s,
 * so every seek re-decoded from the start and the film stuttered; frames on a canvas follow the scroll smoothly.
 */
export default function CoinStage({ poster }: { poster?: string }) {
  const [coinLive, setCoinLive] = useState(true);   // stop rendering the 3D coin once it has dissolved
  const root = useRef<HTMLElement>(null), win = useRef<HTMLDivElement>(null), filmRef = useRef<HTMLCanvasElement>(null), canvas = useRef<HTMLDivElement>(null), word = useRef<HTMLParagraphElement>(null);
  const pose = useRef<CoinPose>(idlePose());
  useEffect(() => {
    const el = root.current!, w = win.current!, v = filmRef.current!, cv = canvas.current!, wd = word.current!, q = gsap.utils.selector(el);

    // geometry in Figma frame units: positions scale with the height, sizes with the frame's contain / cover scale
    const fit = () => Math.min(el.offsetWidth / FW, el.offsetHeight / FH);
    const cover = () => Math.max(el.offsetWidth / FW, el.offsetHeight / FH);
    const P = { size: 0, cy: COIN_CY / FH, win: 0 };           // silhouette width (px), centre (fraction of height), window shown 0–1
    const draw = () => {
      const W = el.offsetWidth, H = el.offsetHeight, s = P.size, sh = s * (259.04 / 260), cx = W / 2, cy = P.cy * H;
      for (const pre of ["", "-webkit-"]) {
        w.style.setProperty(`${pre}mask-size`, `${s}px ${sh}px`);
        w.style.setProperty(`${pre}mask-position`, `${cx - s / 2}px ${cy - sh / 2}px`);
      }
      const cs = s / COIN_FILL;   // the 3D coin's face matches the silhouette exactly
      Object.assign(cv.style, { width: `${cs}px`, height: `${cs}px`, left: `${cx - cs / 2}px`, top: `${cy - cs / 2}px` });
      w.style.opacity = String(P.win);
      // GRANDEUR fades (and blurs) out over the last 7% of height before the growing window would touch it
      const gap = wd.offsetTop - (cy + sh / 2), o = P.win > 0 ? Math.min(Math.max(gap / (0.07 * H), 0), 1) : 1;
      wd.style.opacity = String(o); wd.style.filter = o < 1 ? `blur(${(1 - o) * 14}px)` : "";
    };

    // the film is scrubbed by the scroll: it starts as the coin opens (OPEN) and reaches its last frame at the end
    // of the pin; scrolling up plays it backwards. A frame is painted only when the frame index changes.
    const OPEN = 1.0, ctx = v.getContext("2d")!, imgs: HTMLImageElement[] = [];
    let cur = -1, want = 0;
    const paint = (i: number) => {
      const img = imgs[i]; if (!img?.complete || !img.naturalWidth) return false;
      const k = Math.max(v.width / img.naturalWidth, v.height / img.naturalHeight), iw = img.naturalWidth * k, ih = img.naturalHeight * k;
      ctx.drawImage(img, (v.width - iw) / 2, (v.height - ih) / 2, iw, ih); cur = i; return true;
    };
    const film = (t: number) => {
      want = Math.round(Math.min(Math.max((t - OPEN) / (tl.duration() - OPEN), 0), 1) * (FRAMES - 1));
      if (want !== cur) paint(want);
    };
    const size = () => { const d = Math.min(window.devicePixelRatio || 1, 2); v.width = v.offsetWidth * d; v.height = v.offsetHeight * d; cur = -1; paint(want); };
    for (let i = 0; i < FRAMES; i++) {
      const im = new Image(); im.decoding = "async"; im.src = frameSrc(i);
      // decode ahead, so the first pass through the film never waits on a frame
      im.onload = () => { im.decode?.().catch(() => {}); if (i === want) paint(i); }; imgs.push(im);
    }
    size(); window.addEventListener("resize", size);
    const tl = gsap.timeline({ paused: true, defaults: { ease: "none" }, onUpdate: () => {
      pose.current.spin = tl.time() < 0.02 ? idlePose().spin : 0;   // idle turn at rest, the scroll drives it after
      pose.current.bob = tl.time() < 0.02 ? idlePose().bob : 0;
      draw(); film(tl.time());
      setCoinLive(tl.time() < COIN_GONE);
    } })
      // 1 · Spin: a turn and a half in place, landing on the compass face — the face the window opens with
      .fromTo(pose.current, { rotY: 0 }, { rotY: Math.PI * 3, duration: 1.0, ease: "power1.inOut" }, 0)
      // the window opens under the 3D coin, which keeps growing with it and dissolves into the film
      .fromTo(P, { win: 0 }, { win: 1, duration: 0.12 }, 1.0)
      .fromTo(cv, { opacity: 1 }, { opacity: 0, duration: 0.85, ease: "power1.in" }, 1.05)
      // 2 · Reveal
      .fromTo(P, { size: () => 260 * fit(), cy: COIN_CY / FH }, { size: () => 900 * fit(), cy: 512.5 / FH, duration: 1.4 }, 1.0)
      .fromTo(v, { y: () => (-132 / FH) * el.offsetHeight }, { y: 0, duration: 1.4 }, 1.0)
      .to(q("[data-tick]"), { y: 48, duration: 1.4 }, 1.0)
      // 3 · Fill
      .to(P, { size: () => 3000 * cover(), duration: 1.3 }, 2.4)
      .to(q("[data-tick]"), { y: 96, duration: 1.3 }, 2.4)
      // 4 · Restored
      .to(q("[data-shade]"), { opacity: 1, duration: 1.5 }, 3.7)
      .fromTo(q("[data-rise]"), BLOCK_FROM, { ...BLOCK_TO, duration: 1.0, stagger: 0.15 }, 3.9)
      .fromTo(q("[data-points]"), BLOCK_FROM, { ...BLOCK_TO, duration: 1.0 }, 4.3)
      .to(q("[data-tick]"), { y: 192, duration: 1.5 }, 3.7);
    let st: ScrollTrigger | undefined;
    if (reducedMotion()) { tl.progress(1); film(tl.time()); }
    else st = ScrollTrigger.create({ trigger: el, start: "top top", end: "+=450%", pin: true, scrub: 1, animation: tl, invalidateOnRefresh: true, onRefresh: draw });
    draw();
    window.addEventListener("resize", draw);
    return () => { st?.kill(); tl.kill(); window.removeEventListener("resize", draw); window.removeEventListener("resize", size); };
  }, []);

  return (
    <section ref={root} className="relative h-svh min-h-[600px] overflow-hidden bg-deepsea-700 text-limestone-50">
      {/* Beat 1 word · Display/172 (scales with the frame like the coin, so the 24px gap under the coin holds) */}
      <p ref={word} data-word aria-hidden className="absolute inset-x-0 top-[52.05%] text-center font-bold leading-none"
        style={{ fontSize: "clamp(56px, min(11.38vw, 16.8svh), 172px)", letterSpacing: "0.02em" }}>
        {C.word}
      </p>

      {/* coin window: the film, cut to the coin's silhouette */}
      <div ref={win} className="absolute inset-0" style={{ mask: MASK, WebkitMask: MASK, opacity: 0 }}>
        <canvas ref={filmRef} className="absolute inset-0 h-full w-full bg-cover bg-center" style={poster ? { backgroundImage: `url(${poster})` } : undefined} aria-hidden />
      </div>

      {/* the landing page's 3D coin: idles at rest, turns with the scroll, then grows with the window and dissolves */}
      <div ref={canvas} className="pointer-events-none absolute"><Coin3D pose={pose} active={coinLive} className="h-full w-full" /></div>

      {/* Scrim (to the bottom) and Dim (from the left), as in Figma but a soft Deep Sea 700 instead of black */}
      <div data-shade className="pointer-events-none absolute inset-0 opacity-0"
        style={{ background: "linear-gradient(180deg, rgb(3 30 46 / 0), rgb(3 30 46 / .4))" }} />
      <div data-shade className="pointer-events-none absolute inset-0 opacity-0"
        style={{ background: "linear-gradient(90deg, rgb(3 30 46 / .55), rgb(3 30 46 / .35) 45%, rgb(3 30 46 / 0) 75%)" }} />

      {/* Beat 5 copy · Heading/80 (600 wide), Body/20 at 85% (520 wide), history points 260 + 32 + 260 */}
      <div className="absolute left-[var(--gutter)] right-[var(--gutter)] top-[16%] flex max-w-[600px] flex-col gap-7 lg:top-[29.3%]">
        <h2 data-rise className="t-heading hd-80">{C.title}</h2>
        <p data-rise className="max-w-[520px] t-body b-20 text-limestone-50/85">{C.body}</p>
        <div data-points className="mt-5 grid max-w-[552px] grid-cols-2 gap-8">
          {C.points.map((x) => (
            <div key={x.title} className="flex flex-col gap-2 border-t border-deepsea-400 pt-4">
              <h3 className="t-heading hd-20">{x.title}</h3>
              <p className="t-body b-16">{x.body}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Figma keeps the caption under its mask in every beat, so it is never on screen; kept for screen readers */}
      <p className="sr-only">{C.caption}</p>

      {/* beat progress · track 240 (Deep Sea 400), tick 48 (Limestone 50) at 28, 392 / 1024 */}
      <div aria-hidden className="absolute left-7 top-[38.28%] hidden h-[240px] w-px overflow-hidden bg-deepsea-400 lg:block">
        <div data-tick className="h-12 w-px bg-limestone-50" />
      </div>
    </section>
  );
}
