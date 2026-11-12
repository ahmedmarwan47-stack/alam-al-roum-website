"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { idlePose, COIN_FILL, type CoinPose } from "@/components/ui/Coin3D";
import { gsap, ScrollTrigger, reducedMotion, withHold } from "@/lib/gsap";
import "@/lib/about/a-motion";
import { coin as C } from "@/lib/about/a-content";
import { BLOCK_FROM, BLOCK_TO } from "@/components/reveal/letters";
import { frameLoader } from "@/lib/frames";
import { MQ, matches } from "@/lib/breakpoints";

/** Figma frame (UI / Section / Landmark Reveal): 1512 × 1024. */
const FW = 1512, FH = 1024;
const MASK = `url(${C.mask}) no-repeat`;
const Coin3D = dynamic(() => import("@/components/ui/Coin3D"), { ssr: false });
/** Radians: edge-on on the last half turn, where the gold is replaced by the window, and face-on as the window. */
const EDGE_ON = Math.PI * 3.5, TURNED = Math.PI * 4;
/** Timeline seconds: the flip ends, the window starts to grow. */
const FLIP_END = 1.4;
/** Coin centre at rest: Figma's 379.5 raised by 20 so the turning coin keeps ~40 px clear of the display word. */
const COIN_CY = 359.5;
/** The sky-fall film as a frame sequence (grandeur-skyfall-v2 at 30 fps: its 289 frames with in-between frames made by
 *  motion interpolation, 1920 × 1080 WebP), drawn on a canvas. 1080p on every screen: the frames are held decoded. */
const FRAMES = 359;
const frameSrc = (i: number) => `/seq/skyfall-30/${String(i + 1).padStart(4, "0")}.webp`;

/**
 * UI / Section / Landmark Reveal (10979:18395), pinned and scrubbed as ONE continuous move (linear with the scroll,
 * smoothed scrub, no holds — Figma's pauses only existed because a prototype can't scroll):
 * 1 Spin: the landing page's 3D gold coin idles and bobs over the display word (BEHIND / THE NAME, two lines at the
 *   Display/172 size; it replaced GRANDEUR); scrolling turns it in place.
 * 2 Reveal: the last half turn opens the window, at the coin's size, with no fade: the gold goes as the coin passes
 *   edge-on, so its back never shows, and the coin-shaped window turns on with the same angle. Only then does it grow (260 → 900).
 *   The word fades and blurs out as the window's edge approaches it, so the two never overlap.
 * 3 Fill: the window grows past the screen (3000). 4 Restored ("A landmark restored"): a soft Deep Sea shade, the headline, the subline and
 *   the history points blur in, block by block. The progress tick steps with it.
 * The film is scrubbed by the scroll from the reveal on (forwards down, backwards up); never blurred, no clouds.
 * It is a frame sequence painted on a canvas rather than a seeking <video>: the source has two keyframes in 12 s,
 * so every seek re-decoded from the start and the film stuttered; frames on a canvas follow the scroll smoothly.
 * The 3D coin's canvas stays the size of the section and the coin is scaled inside its scene: sizing the canvas with the
 * coin rebuilt its WebGL buffer as it grew, past 3000 px square, which is what lost the context and crashed the coin.
 */
export default function CoinStage({ poster }: { poster?: string }) {
  const [coinLive, setCoinLive] = useState(true);   // stop rendering the 3D coin once the window has taken its place
  const root = useRef<HTMLElement>(null), win = useRef<HTMLDivElement>(null), filmRef = useRef<HTMLCanvasElement>(null), canvas = useRef<HTMLDivElement>(null), word = useRef<HTMLParagraphElement>(null);
  const pose = useRef<CoinPose>(idlePose());
  useEffect(() => {
    const el = root.current!, w = win.current!, v = filmRef.current!, cv = canvas.current!, wd = word.current!, q = gsap.utils.selector(el);

    // geometry in Figma frame units: positions scale with the height, sizes with the frame's contain / cover scale
    const fit = () => Math.min(el.offsetWidth / FW, el.offsetHeight / FH);
    const cover = () => Math.max(el.offsetWidth / FW, el.offsetHeight / FH);
    // below lg the frame's contain scale leaves a portrait screen a tiny coin (67 px on a phone): there the coin rests
    // at 38 % of the width (≤ 200 px, ≤ 22 % of the height, so it stays clear of the word) and the window opens to 92 %
    // of the width (≤ 80 % of the height), so the reveal reads as a coin, not a dot
    const small = () => !matches(MQ.lg);   // the lg breakpoint, scrollbar included
    const coinAt = (figma: number, ofW: number, px: number, ofH: number) =>
      small() ? Math.max(figma * fit(), Math.min(ofW * el.offsetWidth, px, ofH * el.offsetHeight)) : figma * fit();
    const rest = () => coinAt(260, 0.38, 200, 0.22);
    const P = { size: 0, cy: COIN_CY / FH };                   // silhouette width (px), centre (fraction of height)
    const draw = () => {
      const W = el.offsetWidth, H = el.offsetHeight, s = P.size, sh = s * (259.04 / 260), cx = W / 2, cy = P.cy * H;
      // past edge-on the window takes the coin's place: its width follows the same turn
      const a = pose.current.rotY, open = a >= EDGE_ON, sw = s * Math.max(Math.abs(Math.cos(a)), 0.001);
      for (const pre of ["", "-webkit-"]) {
        w.style.setProperty(`${pre}mask-size`, `${sw}px ${sh}px`);
        w.style.setProperty(`${pre}mask-position`, `${cx - sw / 2}px ${cy - sh / 2}px`);
      }
      w.style.opacity = open ? "1" : "0";
      // the 3D coin's face matches the silhouette exactly: scaled and placed in its scene, the canvas never resizes
      pose.current.scale = s / (COIN_FILL * H);
      pose.current.y = (0.5 - P.cy) * (2.2 / COIN_FILL);
      cv.style.visibility = open ? "hidden" : "visible";
      // the word fades (and blurs) out from the coin's first growth, gone before its edge would touch it
      const r = rest(), restGap = Math.max(wd.offsetTop - ((COIN_CY / FH) * H + (r * (259.04 / 260)) / 2), 1);
      const gap = wd.offsetTop - (cy + sh / 2), o = s > r + 0.5 ? Math.min(Math.max(gap / Math.min(0.07 * H, restGap), 0), 1) : 1;
      wd.style.opacity = String(o); wd.style.filter = o < 1 ? `blur(${(1 - o) * 14}px)` : "";
    };

    // the film is scrubbed by the scroll: it starts when the flip ends and reaches its last frame at the end
    // of the pin; scrolling up plays it backwards. A frame is painted only when the frame index changes.
    const ctx = v.getContext("2d")!;
    let cur = -1, want = 0, motionEnd = 1;
    // the frame the scroll asks for, or the nearest one that has arrived (the film never freezes waiting on one)
    const paint = (i: number) => {
      const f = frames.nearest(i); if (!f) return false;
      const [img] = f;
      const k = Math.max(v.width / img.naturalWidth, v.height / img.naturalHeight), iw = img.naturalWidth * k, ih = img.naturalHeight * k;
      ctx.drawImage(img, (v.width - iw) / 2, (v.height - ih) / 2, iw, ih); cur = f[1]; return true;
    };
    const film = (t: number) => {
      want = Math.round(Math.min(Math.max((t - FLIP_END) / (motionEnd - FLIP_END), 0), 1) * (FRAMES - 1));
      if (want !== cur) paint(want);
    };
    const size = () => { const d = Math.min(window.devicePixelRatio || 1, 2); v.width = v.offsetWidth * d; v.height = v.offsetHeight * d; cur = -1; paint(want); };
    // a frame that lands closer to where the scroll is than the one on screen replaces it
    const frames = frameLoader(FRAMES, frameSrc, (i) => { if (cur < 0 || Math.abs(i - want) < Math.abs(cur - want)) paint(want); });
    const stopLoading = frames.startWhenNear(el);
    size(); window.addEventListener("resize", size);
    const tl = gsap.timeline({ paused: true, defaults: { ease: "none" }, onUpdate: () => {
      pose.current.spin = tl.time() < 0.02 ? idlePose().spin : 0;   // idle turn at rest, the scroll drives it after
      pose.current.bob = tl.time() < 0.02 ? idlePose().bob : 0;
      draw(); film(tl.time());
      setCoinLive(tl.time() < FLIP_END);
    } })
      // 1 · Spin: two turns in place, the last half opening the window (draw() swaps the coin for it at edge-on)
      .fromTo(pose.current, { rotY: 0 }, { rotY: TURNED, duration: FLIP_END, ease: "power1.inOut" }, 0)
      // 2 · Reveal: the window, now face-on, grows
      .fromTo(P, { size: rest, cy: COIN_CY / FH }, { size: () => coinAt(900, 0.92, Infinity, 0.8), cy: 512.5 / FH, duration: 2.4 - FLIP_END }, FLIP_END)
      .fromTo(v, { y: () => (-132 / FH) * el.offsetHeight }, { y: 0, duration: 2.4 - FLIP_END }, FLIP_END)
      .to(q("[data-tick]"), { y: 48, duration: 2.4 - FLIP_END }, FLIP_END)
      // 3 · Fill
      .to(P, { size: () => 3000 * cover(), duration: 1.3 }, 2.4)
      .to(q("[data-tick]"), { y: 96, duration: 1.3 }, 2.4)
      // 4 · Restored
      .to(q("[data-shade]"), { opacity: 1, duration: 1.5 }, 3.7)
      .fromTo(q("[data-rise]"), { ...BLOCK_FROM }, { ...BLOCK_TO, duration: 1.0, stagger: 0.15 }, 3.9)
      .fromTo(q("[data-points]"), { ...BLOCK_FROM }, { ...BLOCK_TO, duration: 1.0 }, 4.3)
      .to(q("[data-tick]"), { y: 192, duration: 1.5 }, 3.7);
    // the film reaches its last frame with the motion; then a reading hold on the finished copy before the pin lets go
    motionEnd = tl.duration();
    const vh = withHold(tl, 4.5, 0.8);
    // below lg the same sequence plays over 40 % of the scroll (~2.1 screens instead of 5.3), so a phone isn't held long
    const pinVh = () => (small() ? vh * 0.4 : vh);
    let st: ScrollTrigger | undefined;
    if (reducedMotion()) { tl.progress(1); film(tl.time()); }
    else st = ScrollTrigger.create({ trigger: el, start: "top top", end: () => `+=${pinVh() * 100}%`, pin: true, scrub: 1, animation: tl, invalidateOnRefresh: true, onRefresh: draw });
    draw();
    window.addEventListener("resize", draw);
    return () => { st?.kill(); tl.kill(); stopLoading(); window.removeEventListener("resize", draw); window.removeEventListener("resize", size); };
  }, []);

  return (
    <section ref={root} className="relative h-svh min-h-[600px] overflow-hidden bg-deepsea-700 text-limestone-50">
      {/* Beat 1 word · Display/172 (scales with the frame like the coin, so the 24px gap under the coin holds), on two
          lines so the longer phrase keeps GRANDEUR's size: the wider line, THE NAME, is no wider than GRANDEUR was */}
      <p ref={word} data-word aria-hidden className="absolute inset-x-0 top-[52.05%] text-center font-bold uppercase [line-height:round(nearest,0.94em,4px)]"
        style={{ fontSize: "clamp(56px, min(11.38vw, 16.8svh), 172px)", letterSpacing: "0.02em" }}>
        {C.word.map((l) => <span key={l} className="block whitespace-nowrap">{l}</span>)}
      </p>

      {/* coin window: the film, cut to the coin's silhouette */}
      <div ref={win} className="absolute inset-0" style={{ mask: MASK, WebkitMask: MASK, opacity: 0 }}>
        <canvas ref={filmRef} className="absolute inset-0 h-full w-full bg-cover bg-center" style={poster ? { backgroundImage: `url(${poster})` } : undefined} aria-hidden />
      </div>

      {/* the landing page's 3D coin: idles at rest, turns with the scroll, and the last half turn swaps it for the window */}
      <div ref={canvas} className="pointer-events-none absolute inset-0"><Coin3D pose={pose} active={coinLive} maxDpr={1.5} className="h-full w-full" /></div>

      {/* Scrim (to the bottom) and Dim (from the left), as in Figma but a soft Deep Sea 700 instead of black */}
      <div data-shade className="pointer-events-none absolute inset-0 opacity-0"
        style={{ background: "linear-gradient(180deg, rgb(3 30 46 / 0), rgb(3 30 46 / .4))" }} />
      <div data-shade className="pointer-events-none absolute inset-0 opacity-0"
        style={{ background: "linear-gradient(90deg, rgb(3 30 46 / .55), rgb(3 30 46 / .35) 45%, rgb(3 30 46 / 0) 75%)" }} />
      {/* below lg the copy runs the full width, over the bright tower: an even shade behind the whole top of the frame */}
      <div data-shade className="pointer-events-none absolute inset-0 opacity-0 lg:hidden"
        style={{ background: "linear-gradient(180deg, rgb(3 30 46 / .55), rgb(3 30 46 / .45) 60%, rgb(3 30 46 / .15))" }} />

      {/* Beat 5 copy · Heading/80 (600 wide), Body/20 at 85% (520 wide), history points 260 + 32 + 260. Phones: body
          16 / 24 and the two points stacked full width (side by side they were ~150 px columns of 4–5 short lines) */}
      <div className="absolute left-[var(--gutter)] right-[var(--gutter)] top-[16%] flex max-w-[600px] flex-col gap-7 lg:top-[29.3%]">
        {/* the owner's break (9 Nov), as in Figma: "A landmark" / "restored", at every width (a deliberate design break
            wins over the no-orphans rule) */}
        <h2 data-rise className="t-heading hd-80 max-md:text-[32px]! max-md:leading-9!">{C.title.replace(/ (\S+)$/, "")}<br />{C.title.match(/\S+$/)![0]}</h2>
        <p data-rise className="max-w-[520px] t-body b-20 text-limestone-50/85 max-md:text-[16px]! max-md:leading-6!">{C.body}</p>
        <div data-points className="mt-5 grid max-w-[552px] grid-cols-2 gap-8 max-md:grid-cols-1 max-md:gap-5">
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
