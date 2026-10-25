"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";

/** Hassan Allam's counter-sliding mask around any block (used where the content is more than one image). */
export default function RevealMask({ children, className = "", from = "right", delay = 0 }:
  { children: React.ReactNode; className?: string; from?: "right" | "left" | "bottom"; delay?: number }) {
  const outer = useRef<HTMLDivElement>(null), inner = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    const axis = from === "bottom" ? "yPercent" : "xPercent", s = from === "left" ? -100 : 100;
    gsap.set(outer.current, { [axis]: s }); gsap.set(inner.current, { [axis]: -s });
    const st = ScrollTrigger.create({ trigger: outer.current!.parentElement, start: "top 85%", once: true,
      onEnter: () => gsap.to([outer.current, inner.current], { [axis]: 0, duration: 1.15, ease: "maskInOut", delay }) });
    return () => st.kill();
  }, [from, delay]);
  return <div className={`overflow-hidden ${className}`}><div ref={outer} className="ri-outer"><div ref={inner} className="ri-inner relative">{children}</div></div></div>;
}
