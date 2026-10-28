"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, reducedMotion, withHold } from "@/lib/gsap";
import "@/lib/about/a-motion";
import { blurIn } from "@/components/reveal/letters";
import { bloom as B } from "@/lib/about/a-content";

/**
 * UI / Section / Botanical Frame, scroll-scrubbed while pinned: Rest → Scrolled (Figma 1.2 s) → Full (1.3 s,
 * after 0.2 s), all on the 0.76/0/0.24/1 in-out. The framed photo opens from 1000 × 620 to 1200 × 740 to full
 * bleed (dim 25 → 30 %). Figma's floating cut-outs (scallop shells, Ionic capitals) were removed at the client's request.
 * As the section arrives, the title and then the quote blur in, each as one block; at the end a reading hold.
 */
export default function LifeInBloom() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    const el = root.current!, q = gsap.utils.selector(el);
    // entrance: the copy blurs in once the section lands
    const copy = gsap.timeline({ paused: true }).add(blurIn(q("[data-title], [data-body]"), { stagger: 0.2 }));
    const copyST = ScrollTrigger.create({ trigger: el, start: "top 80%", once: true, onEnter: () => copy.play() });
    const mm = gsap.matchMedia();
    mm.add({ lg: "(min-width: 1024px)", sm: "(max-width: 1023px)" }, (ctx) => {
      const lg = ctx.conditions!.lg;
      // frame insets [top, side] per state; narrower sides below lg so the photo keeps some width
      const rest = lg ? [20, 16.93] : [22, 8], mid = lg ? [13, 10.32] : [14, 4];
      const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } })   // linear with the scroll + a smoothed scrub
        .fromTo(q("[data-clip]"), { clipPath: `inset(${rest[0]}% ${rest[1]}%)` }, { clipPath: `inset(${mid[0]}% ${mid[1]}%)`, duration: 1.2 }, 0)
        .to(q("[data-clip]"), { clipPath: "inset(0% 0%)", duration: 1.3 }, 1.2)
        .fromTo(q("[data-clip] img"), { scale: 1.12 }, { scale: 1, duration: 2.5, ease: "none" }, 0)
        .to(q("[data-dim]"), { opacity: lg ? 0.3 : 0.45, duration: 1.3 }, 1.2);   // deeper below lg: the copy spans the narrow frame
      const vh = withHold(tl, lg ? 1.5 : 1);
      const st = ScrollTrigger.create({ trigger: el, start: "top top", end: `+=${vh * 100}%`, pin: true, scrub: 1, animation: tl });
      return () => { st.kill(); tl.kill(); };
    });
    return () => { mm.revert(); copyST.kill(); copy.kill(); };
  }, []);

  return (
    <section ref={root} className="relative h-svh min-h-[560px] overflow-hidden bg-limestone-50 lg:min-h-[640px]">
      <div data-clip className="absolute inset-0 overflow-hidden [clip-path:inset(22%_8%)] lg:[clip-path:inset(20%_16.93%)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={B.image} alt="A shaded dining terrace open to the sea" className="h-full w-full object-cover" />
        <div data-dim className="absolute inset-0 bg-deepsea-600 opacity-25 max-lg:opacity-40" />
      </div>
      {/* the copy stays inside the framed photo at rest (light type, so it would vanish on the Limestone around it) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-[14%] text-center text-limestone-50 lg:px-[20%]">
        <h2 data-title data-reveal className="t-heading hd-56 text-balance">{B.title}</h2>
        <p data-body data-reveal className="t-body b-14 max-w-[520px]">{B.body}</p>
      </div>
    </section>
  );
}
