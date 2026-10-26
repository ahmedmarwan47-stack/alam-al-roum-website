"use client";
import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import { photoIn, PHOTO_FROM, mediaBlurIn, MEDIA_BLUR_FROM, whenSectionEnters } from "./letters";

/** The photo entrance (`photoIn`, or with `blur` the blur-only `mediaBlurIn`) around any block, for media made of more than one image. */
export default function RevealMask({ children, className = "", delay = 0, blur = false }: { children: React.ReactNode; className?: string; delay?: number; blur?: boolean }) {
  const frame = useRef<HTMLDivElement>(null), zoom = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const f = frame.current; if (!f || reducedMotion()) return;
    gsap.set(f, { ...(blur ? MEDIA_BLUR_FROM : PHOTO_FROM), visibility: "visible" });
    return whenSectionEnters(f, () => (blur ? mediaBlurIn(f, { delay }) : photoIn(f, zoom.current, { delay })));
  }, [delay, blur]);
  return <div ref={frame} data-reveal-img className={`overflow-hidden ${className}`}><div ref={zoom} className="ri-inner relative">{children}</div></div>;
}
