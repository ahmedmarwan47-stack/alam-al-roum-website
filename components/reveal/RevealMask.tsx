"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import { photoIn, PHOTO_FROM } from "./letters";

/** The photo entrance (`photoIn`) around any block, for media made of more than one image (a map, a slideshow). */
export default function RevealMask({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const frame = useRef<HTMLDivElement>(null), zoom = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const f = frame.current; if (!f || reducedMotion()) return;
    gsap.set(f, { ...PHOTO_FROM, visibility: "visible" });
    let done = false;
    const play = () => { if (!done) { done = true; photoIn(f, zoom.current, { delay }); } };
    const st = ScrollTrigger.create({ trigger: f, start: "top 88%", once: true, onEnter: play });
    const id = requestAnimationFrame(() => { if (st.scroll() >= st.start) play(); });
    return () => { cancelAnimationFrame(id); st.kill(); };
  }, [delay]);
  return <div ref={frame} data-reveal-img className={`overflow-hidden ${className}`}><div ref={zoom} className="ri-inner relative">{children}</div></div>;
}
