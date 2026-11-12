"use client";
import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import { HI_RES } from "@/lib/hi-res";
import { photoIn, PHOTO_FROM, mediaBlurIn, MEDIA_BLUR_FROM, whenSectionEnters } from "./letters";
import { srcSet } from "@/lib/img";

/** Whether the connection can carry a 4K film: Chrome's own estimate where it has one (it reports at most 10 Mbps),
 *  elsewhere the speed of this page's own larger downloads so far; data-saver always says no. */
const fast = () => {
  const c = (navigator as Navigator & { connection?: { downlink?: number; saveData?: boolean } }).connection;
  if (c?.saveData) return false;
  if (typeof c?.downlink === "number" && c.downlink > 0) return c.downlink >= 10;
  const big = (performance.getEntriesByType("resource") as PerformanceResourceTiming[])
    .filter((e) => e.encodedBodySize > 150e3 && e.responseEnd - e.responseStart > 20);
  if (!big.length) return false;
  return big.reduce((n, e) => n + (e.encodedBodySize * 8) / ((e.responseEnd - e.responseStart) / 1000), 0) / big.length >= 15e6;
};

/**
 * A looping background film that waits for the page: nothing downloads until the page has loaded (or until 1.5 s
 * after it wakes up, if sooner), so the film never competes with the scripts, fonts and photos the page needs first; the poster shows
 * meanwhile. `src4k` (AV1, HEVC, H.264) is used on sharp large screens (`HI_RES`) with a fast connection, the
 * 1080p `src` everywhere else.
 */
function Film({ src, src4k, poster, className }: { src: string; src4k?: { src: string; type: string }[]; poster?: string; className: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current!; let started = false;
    const start = () => {
      if (started) return; started = true;
      const cuts = src4k && window.matchMedia(HI_RES).matches && fast() ? [...src4k, { src, type: "" }] : [{ src, type: "" }];
      for (const c of cuts) { const s = document.createElement("source"); s.src = c.src; if (c.type) s.type = c.type; v.appendChild(s); }
      v.load(); v.play().catch(() => {});
    };
    if (document.readyState === "complete") start(); else window.addEventListener("load", start, { once: true });
    const t = setTimeout(start, 1500);
    return () => { clearTimeout(t); window.removeEventListener("load", start); };
  }, [src, src4k]);
  return <video ref={ref} className={className} poster={poster} muted loop playsInline preload="none" />;
}

/**
 * Photo reveal (the site's one photo entrance, see `photoIn`): the frame opens upward while the photo settles
 * back from a slight zoom, once, as its section comes into view (or with `onLoad`, as the page opens).
 * `blur` swaps the sweep for the blur-only entrance (`mediaBlurIn`). The frame is hidden from first paint on
 * scripted pages, so a photo never shows, vanishes and wipes back in.
 */
export default function RevealImage({ src, src4k, alt = "", className = "", video = false, delay = 0, onLoad, imgClassName = "", poster, blur = false }:
  { src: string; src4k?: { src: string; type: string }[]; alt?: string; className?: string; video?: boolean; delay?: number; onLoad?: boolean; imgClassName?: string; poster?: string; blur?: boolean }) {
  const frame = useRef<HTMLDivElement>(null), zoom = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const f = frame.current; if (!f || reducedMotion()) return;
    gsap.set(f, { ...(blur ? MEDIA_BLUR_FROM : PHOTO_FROM), visibility: "visible" });
    if (onLoad) { const t = (blur ? mediaBlurIn(f, { delay }) : photoIn(f, zoom.current, { delay })); return () => { t.kill(); }; }
    return whenSectionEnters(f, () => (blur ? mediaBlurIn(f, { delay }) : photoIn(f, zoom.current, { delay })));
  }, [delay, onLoad, blur]);
  return (
    <div ref={frame} data-reveal-img className={`overflow-hidden ${className}`}>
      <div ref={zoom} className="ri-inner">
        {video
          ? <Film src={src} src4k={src4k} poster={poster} className={imgClassName} />
          // eslint-disable-next-line @next/next/no-img-element
          : <img className={imgClassName} src={src} srcSet={srcSet(src)} alt={alt} loading="lazy" />}
      </div>
    </div>
  );
}
