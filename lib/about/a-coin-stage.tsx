"use client";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { idlePose, type CoinPose } from "@/components/ui/Coin3D";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import "@/lib/about/a-motion";
import { coin as C } from "@/lib/about/a-content";

/** Figma frame (UI / Section / Landmark Reveal): 1512 × 1024. */
const FW = 1512, FH = 1024;
/** Coin render vs. the coin silhouette (Figma: 317 render at 605,227 over the 260 mask at 626,250). */
const RENDER = 317 / 260, RDX = 7.5 / 260, RDY = 6.5 / 260;
const MASK = `url(${C.mask}) no-repeat`;
const Coin3D = dynamic(() => import("@/components/ui/Coin3D"), { ssr: false });
/** The 3D coin fills ~74% of its canvas (camera at 5.2, fov 32, coin 2.2 units). */
const COIN_FILL = 0.74;

/**
 * UI / Section / Landmark Reveal (10979:18395), pinned and scrubbed as ONE continuous move (linear with the scroll,
 * smoothed scrub, no holds — Figma's pauses only existed because a prototype can't scroll):
 * 1 Spin: the landing page's 3D gold coin idles and bobs over GRANDEUR; scrolling turns it in place (1½ turns) onto its compass face.
 * 2 Reveal: it hands over to the coin-shaped window, which grows (260 → 900) and centres while the film shows through.
 *   GRANDEUR fades and blurs out as the window's edge approaches it, so the two never overlap.
 * 3 Fill: the window grows past the screen (3000). 4 Restored: a soft Deep Sea shade, the headline and subline rise
 *   through their masks, the history points rise into place. The progress tick steps with it.
 * The film is scrubbed by the scroll from the reveal on (forwards down, backwards up); never blurred, no clouds.
 */
export default function CoinStage({ poster }: { poster?: string }) {
  const root = useRef<HTMLElement>(null), win = useRef<HTMLDivElement>(null), render = useRef<HTMLImageElement>(null), video = useRef<HTMLVideoElement>(null), canvas = useRef<HTMLDivElement>(null), word = useRef<HTMLParagraphElement>(null);
  const pose = useRef<CoinPose>(idlePose());
  useEffect(() => {
    const el = root.current!, w = win.current!, r = render.current!, v = video.current!, cv = canvas.current!, wd = word.current!, q = gsap.utils.selector(el);

    // geometry in Figma frame units: positions scale with the height, sizes with the frame's contain / cover scale
    const fit = () => Math.min(el.offsetWidth / FW, el.offsetHeight / FH);
    const cover = () => Math.max(el.offsetWidth / FW, el.offsetHeight / FH);
    const P = { size: 0, cy: 379.5 / FH, win: 0 };           // silhouette width (px), centre (fraction of height), window shown 0–1
    const draw = () => {
      const W = el.offsetWidth, H = el.offsetHeight, s = P.size, sh = s * (259.04 / 260), cx = W / 2, cy = P.cy * H;
      for (const pre of ["", "-webkit-"]) {
        w.style.setProperty(`${pre}mask-size`, `${s}px ${sh}px`);
        w.style.setProperty(`${pre}mask-position`, `${cx - s / 2}px ${cy - sh / 2}px`);
      }
      const rs = s * RENDER;
      Object.assign(r.style, { width: `${rs}px`, height: `${rs}px`, left: `${cx + s * RDX - rs / 2}px`, top: `${cy + s * RDY - rs / 2}px` });
      const cs = rs / COIN_FILL;   // the 3D coin sits exactly on the render
      Object.assign(cv.style, { width: `${cs}px`, height: `${cs}px`, left: `${cx + s * RDX - cs / 2}px`, top: `${cy + s * RDY - cs / 2}px` });
      w.style.opacity = String(P.win);
      // GRANDEUR fades (and blurs) out over the last 7% of height before the growing window would touch it
      const gap = wd.offsetTop - (cy + sh / 2), o = P.win > 0 ? Math.min(Math.max(gap / (0.07 * H), 0), 1) : 1;
      wd.style.opacity = String(o); wd.style.filter = o < 1 ? `blur(${(1 - o) * 14}px)` : "";
    };

    // the film is scrubbed by the scroll: it starts as the coin opens (OPEN) and reaches its last frame at the end
    // of the pin; one seek at a time so the decoder keeps up, and scrolling up plays it backwards
    const OPEN = 1.0;
    let want = 0;
    const film = (t: number) => { want = Math.min(Math.max((t - OPEN) / (tl.duration() - OPEN), 0), 1); };
    const seek = () => {
      if (!v.duration || v.seeking) return;
      const at = want * (v.duration - 0.05);
      if (Math.abs(v.currentTime - at) > 1 / 30) v.currentTime = at;
    };
    gsap.ticker.add(seek);
    const prime = () => { v.play().then(() => v.pause()).catch(() => {}); };   // iOS paints seeks only after a play
    v.addEventListener("loadedmetadata", prime, { once: true });
    const tl = gsap.timeline({ paused: true, defaults: { ease: "none" }, onUpdate: () => {
      pose.current.spin = tl.time() < 0.02 ? idlePose().spin : 0;   // idle turn at rest, the scroll drives it after
      pose.current.bob = tl.time() < 0.02 ? idlePose().bob : 0;
      draw(); film(tl.time());
    } })
      // 1 · Spin: a turn and a half in place, landing on the compass face — the face the window opens with
      .fromTo(pose.current, { rotY: 0 }, { rotY: Math.PI * 3, duration: 1.0, ease: "power1.inOut" }, 0)
      // hand-over: the coin window (same coin, same place) takes over from the 3D coin
      .fromTo(P, { win: 0 }, { win: 1, duration: 0.12 }, 1.0)
      .fromTo(cv, { opacity: 1 }, { opacity: 0, duration: 0.15 }, 1.02)
      // 2 · Reveal
      .fromTo(P, { size: () => 260 * fit(), cy: 379.5 / FH }, { size: () => 900 * fit(), cy: 512.5 / FH, duration: 1.4 }, 1.0)
      .fromTo(r, { rotation: 0, opacity: 1 }, { rotation: 75, opacity: 0, duration: 1.4 }, 1.0)
      .fromTo(v, { y: () => (-132 / FH) * el.offsetHeight }, { y: 0, duration: 1.4 }, 1.0)
      .to(q("[data-tick]"), { y: 48, duration: 1.4 }, 1.0)
      // 3 · Fill
      .to(P, { size: () => 3000 * cover(), duration: 1.3 }, 2.4)
      .to(q("[data-tick]"), { y: 96, duration: 1.3 }, 2.4)
      // 4 · Restored
      .to(q("[data-shade]"), { opacity: 1, duration: 1.5 }, 3.7)
      .fromTo(q("[data-rise]"), { yPercent: 115 }, { yPercent: 0, duration: 1.3, stagger: 0.15 }, 3.9)
      .fromTo(q("[data-points]"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.2 }, 4.3)
      .to(q("[data-tick]"), { y: 192, duration: 1.5 }, 3.7);
    let st: ScrollTrigger | undefined;
    if (reducedMotion()) { tl.progress(1); film(tl.time()); }
    else st = ScrollTrigger.create({ trigger: el, start: "top top", end: "+=450%", pin: true, scrub: 1, animation: tl, invalidateOnRefresh: true, onRefresh: draw });
    draw();
    window.addEventListener("resize", draw);
    return () => { st?.kill(); tl.kill(); gsap.ticker.remove(seek); v.removeEventListener("loadedmetadata", prime); window.removeEventListener("resize", draw); };
  }, []);

  return (
    <section ref={root} className="relative h-svh min-h-[600px] overflow-hidden bg-deepsea-700 text-limestone-50">
      {/* Beat 1 word · Display/172 (scales with the frame like the coin, so the 24px gap under the coin holds) */}
      <p ref={word} data-word aria-hidden className="absolute inset-x-0 top-[52.05%] text-center font-bold leading-none"
        style={{ fontSize: "clamp(56px, min(11.38vw, 16.8svh), 172px)", letterSpacing: "0.02em" }}>
        {C.word}
      </p>

      {/* coin window: the film and the coin render, cut to the coin's silhouette */}
      <div ref={win} className="absolute inset-0" style={{ mask: MASK, WebkitMask: MASK, opacity: 0 }}>
        <video ref={video} src={C.video} poster={poster} className="absolute inset-0 h-full w-full object-cover" muted playsInline preload="auto" aria-hidden />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={render} src={C.render} alt="" className="absolute max-w-none" />
      </div>

      {/* the landing page's 3D coin: idles at rest, turns with the scroll, then hands over to the window */}
      <div ref={canvas} className="pointer-events-none absolute"><Coin3D pose={pose} className="h-full w-full" /></div>

      {/* Scrim (to the bottom) and Dim (from the left), as in Figma but a soft Deep Sea 700 instead of black */}
      <div data-shade className="pointer-events-none absolute inset-0 opacity-0"
        style={{ background: "linear-gradient(180deg, rgb(3 30 46 / 0), rgb(3 30 46 / .4))" }} />
      <div data-shade className="pointer-events-none absolute inset-0 opacity-0"
        style={{ background: "linear-gradient(90deg, rgb(3 30 46 / .55), rgb(3 30 46 / .35) 45%, rgb(3 30 46 / 0) 75%)" }} />

      {/* Beat 5 copy · Heading/80 (600 wide), Body/20 at 85% (520 wide), history points 260 + 32 + 260 */}
      <div className="absolute left-[var(--gutter)] right-[var(--gutter)] top-[16%] flex max-w-[600px] flex-col gap-7 lg:top-[29.3%]">
        <h2 className="overflow-hidden t-heading hd-80"><span data-rise className="block">{C.title}</span></h2>
        <p className="max-w-[520px] overflow-hidden t-body b-20"><span data-rise className="block opacity-85">{C.body}</span></p>
        <div data-points className="mt-5 grid max-w-[552px] grid-cols-2 gap-8 opacity-0">
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
