"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import { photoIn, PHOTO_FROM } from "./letters";

/**
 * Photo reveal (the site's one photo entrance, see `photoIn`): the frame opens upward while the photo settles
 * back from a slight zoom, once, when the frame comes into view (or with `onLoad`, as the page opens).
 * The frame is hidden from first paint on scripted pages, so a photo never shows, vanishes and wipes back in.
 */
export default function RevealImage({ src, alt = "", className = "", video = false, delay = 0, onLoad, imgClassName = "", poster }:
  { src: string; alt?: string; className?: string; video?: boolean; delay?: number; onLoad?: boolean; imgClassName?: string; poster?: string }) {
  const frame = useRef<HTMLDivElement>(null), zoom = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const f = frame.current; if (!f || reducedMotion()) return;
    gsap.set(f, { ...PHOTO_FROM, visibility: "visible" });
    if (onLoad) { const t = photoIn(f, zoom.current, { delay }); return () => { t.kill(); }; }
    let done = false;
    const play = () => { if (!done) { done = true; photoIn(f, zoom.current, { delay }); } };
    const st = ScrollTrigger.create({ trigger: f, start: "top 90%", once: true, onEnter: play });
    const id = requestAnimationFrame(() => { if (st.scroll() >= st.start) play(); });
    return () => { cancelAnimationFrame(id); st.kill(); };
  }, [delay, onLoad]);
  return (
    <div ref={frame} data-reveal-img className={`overflow-hidden ${className}`}>
      <div ref={zoom} className="ri-inner">
        {video
          ? <video className={imgClassName} src={src} poster={poster} autoPlay muted loop playsInline />
          // eslint-disable-next-line @next/next/no-img-element
          : <img className={imgClassName} src={src} alt={alt} loading="lazy" />}
      </div>
    </div>
  );
}
