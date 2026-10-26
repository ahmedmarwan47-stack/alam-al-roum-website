"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import "@/lib/about/a-motion";
import { splitChars, writeIn } from "@/components/reveal/letters";
import { bloom as B } from "@/lib/about/a-content";

const pct = (v: number) => `${v}%`;

/**
 * UI / Section / Botanical Frame, scroll-scrubbed while pinned: Rest → Scrolled (Figma 1.2 s) → Full (1.3 s,
 * after 0.2 s), all on the 0.76/0/0.24/1 in-out. The framed photo opens from 1000 × 620 to 1200 × 740 to full
 * bleed (dim 25 → 30 %), while the scallop-shell and Ionic-capital cut-outs drift out past the corners, growing
 * 300 → 360 → 420px, turning further and fading on the last leg.
 * Before the pin, as the section scrolls up into place (the ERA Residence entrance): the flowers and olives ride
 * in from their corners — the top pair down from above, the bottom pair up from below — and once it lands the
 * title and the quote write themselves in, letter by letter from a pale blur.
 */
export default function LifeInBloom() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    const el = root.current!, q = gsap.utils.selector(el);
    // entrance: corners ride in with the scroll, then the copy writes in
    const cutsIn = gsap.fromTo(q("[data-cut-in]"), { y: (k) => (k < 2 ? -1 : 1) * window.innerHeight * 0.35, x: (k) => (k % 2 ? 1 : -1) * window.innerWidth * 0.06 },
      { y: 0, x: 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top top", scrub: 1 } });
    const copy = gsap.timeline({ paused: true })
      .add(writeIn(splitChars(q("[data-title]")[0] as HTMLElement), 0.045, 0.7))
      .add(writeIn(splitChars(q("[data-body]")[0] as HTMLElement), 0.008, 0.6), "-=0.4");
    const copyST = ScrollTrigger.create({ trigger: el, start: "top 35%", onEnter: () => copy.play(), onLeaveBack: () => copy.reverse() });
    const mm = gsap.matchMedia();
    mm.add({ lg: "(min-width: 1024px)", sm: "(max-width: 1023px)" }, (ctx) => {
      const lg = ctx.conditions!.lg;
      // frame insets [top, side] per state; narrower sides below lg so the photo keeps some width
      const rest = lg ? [20, 16.93] : [22, 8], mid = lg ? [13, 10.32] : [14, 4];
      const cuts = q("[data-cut]");
      const tl = gsap.timeline({
        defaults: { ease: "none" },   // linear with the scroll + a smoothed scrub: one continuous move, no stops
        scrollTrigger: { trigger: el, start: "top top", end: lg ? "+=150%" : "+=100%", pin: true, scrub: 1 },
      })
        .fromTo(q("[data-clip]"), { clipPath: `inset(${rest[0]}% ${rest[1]}%)` }, { clipPath: `inset(${mid[0]}% ${mid[1]}%)`, duration: 1.2 }, 0)
        .to(q("[data-clip]"), { clipPath: "inset(0% 0%)", duration: 1.3 }, 1.2)
        .fromTo(q("[data-clip] img"), { scale: 1.12 }, { scale: 1, duration: 2.5, ease: "none" }, 0)
        .to(q("[data-dim]"), { opacity: 0.3, duration: 1.3 }, 1.2);
      B.cutouts.forEach((c, k) => {
        tl.fromTo(cuts[k], { left: pct(c.rest[0]), top: pct(c.rest[1]), x: 0, y: 0, xPercent: -50, yPercent: -50, rotation: c.rest[2], scale: 1, opacity: 1 },
          { left: pct(c.scrolled[0]), top: pct(c.scrolled[1]), rotation: c.scrolled[2], scale: 1.2, duration: 1.2 }, 0)
          .to(cuts[k], { left: pct(c.full[0]), top: pct(c.full[1]), rotation: c.full[2], scale: 1.4, opacity: 0, duration: 1.3 }, 1.2);
      });
      return () => { tl.scrollTrigger?.kill(); tl.kill(); };
    });
    return () => { mm.revert(); cutsIn.scrollTrigger?.kill(); cutsIn.kill(); copyST.kill(); copy.kill(); };
  }, []);

  return (
    <section ref={root} className="relative h-svh min-h-[560px] overflow-hidden bg-limestone-50 lg:min-h-[640px]">
      <div data-clip className="absolute inset-0 overflow-hidden [clip-path:inset(22%_8%)] lg:[clip-path:inset(20%_16.93%)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={B.image} alt="A shaded dining terrace open to the sea" className="h-full w-full object-cover" />
        <div data-dim className="absolute inset-0 bg-deepsea-600 opacity-25" />
      </div>
      {B.cutouts.map((c, k) => (
        // the outer layer rides in (entrance), the inner one drifts out (pinned states)
        <div key={k} data-cut-in className="pointer-events-none absolute inset-0">
          <div data-cut className="absolute w-[36%] lg:w-[19.84%]"
            style={{ left: pct(c.rest[0]), top: pct(c.rest[1]), transform: `translate(-50%, -50%) rotate(${c.rest[2]}deg)` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.src} alt="" aria-hidden className="w-full" style={c.flip ? { transform: "scaleX(-1)" } : undefined} />
          </div>
        </div>
      ))}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center text-limestone-50 container-x">
        <h2 data-title data-no-blur className="t-heading hd-56">{B.title}</h2>
        <p data-body data-no-blur className="t-body b-14 max-w-[520px]">{B.body}</p>
      </div>
    </section>
  );
}
