"use client";
import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import { HI_RES } from "@/lib/hi-res";
import { photoIn, PHOTO_FROM, mediaBlurIn, MEDIA_BLUR_FROM, whenSectionEnters } from "./letters";

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
          // `src4k`: the 4K cuts on sharp large screens (`HI_RES`), the 1080p file everywhere else
          ? src4k
            ? <video className={imgClassName} poster={poster} autoPlay muted loop playsInline>
                {src4k.map((s) => <source key={s.src} src={s.src} type={s.type} media={HI_RES} />)}<source src={src} />
              </video>
            : <video className={imgClassName} src={src} poster={poster} autoPlay muted loop playsInline />
          // eslint-disable-next-line @next/next/no-img-element
          : <img className={imgClassName} src={src} alt={alt} loading="lazy" />}
      </div>
    </div>
  );
}
