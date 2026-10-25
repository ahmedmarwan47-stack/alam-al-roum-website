"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";

/**
 * Hassan Allam's image reveal: two nested masks slide in opposite directions by the
 * same amount, so the window opens across a photo that itself stays still.
 * ~1.1 s on a strong in-out curve, once, when the frame enters the viewport.
 */
export default function RevealImage({ src, alt = "", className = "", video = false, from = "right", delay = 0, onLoad, imgClassName = "", poster }:
  { src: string; alt?: string; className?: string; video?: boolean; from?: "right" | "left" | "bottom"; delay?: number; onLoad?: boolean; imgClassName?: string; poster?: string }) {
  const outer = useRef<HTMLDivElement>(null), inner = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reducedMotion() || !outer.current || !inner.current) return;
    const axis = from === "bottom" ? "yPercent" : "xPercent";
    const s = from === "left" ? -100 : 100;
    gsap.set(outer.current, { [axis]: s }); gsap.set(inner.current, { [axis]: -s });
    const tween = () => gsap.to([outer.current, inner.current], { [axis]: 0, duration: 1.15, ease: "maskInOut", delay });
    if (onLoad) { const t = tween(); return () => { t.kill(); }; }
    const st = ScrollTrigger.create({ trigger: outer.current.parentElement, start: "top 88%", once: true, onEnter: tween });
    return () => st.kill();
  }, [from, delay, onLoad]);
  return (
    <div className={`overflow-hidden ${className}`}>
      <div ref={outer} className="ri-outer">
        <div ref={inner} className="ri-inner">
          {video
            ? <video className={imgClassName} src={src} poster={poster} autoPlay muted loop playsInline />
            : /* eslint-disable-next-line @next/next/no-img-element */ <img className={imgClassName} src={src} alt={alt} loading="lazy" />}
        </div>
      </div>
    </div>
  );
}
