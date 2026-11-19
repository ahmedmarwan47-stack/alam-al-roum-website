"use client";
import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import { blurIn, BLOCK_FROM } from "@/components/reveal/letters";
import SectionTitle from "@/components/sections/SectionTitle";
import RevealText from "@/components/reveal/RevealText";
import { inTown as T } from "@/lib/destination";
import { srcSet } from "@/lib/img";
import { MQ, matches } from "@/lib/breakpoints";

/**
 * Transport · In town.
 * From lg (19 Nov, Figma 11705:12322 "UI / Transport · In town (coins)"): the three modes side by side, each a coin
 * (437 wide at 1512, 40 apart) over its centred title (Heading/32) and paragraph (16 / 24), 30 below the coin. Nothing
 * pins. 19 Nov ("a nice animation of the coins"): as the row arrives the coins flip onto their face one after another,
 * left to right, like coins tossed onto a table: each turns in from edge-on (a quarter turn about its upright axis, in
 * perspective) while it rises 48 px, grows from 80 % and sharpens out of a blur, settling slowly (1.8 s, expo out);
 * each paragraph blurs in under its coin as that coin lands. Then each coin's edge turns slowly with the scroll while
 * its photo stays level (counter-rotated), the middle one the other way.
 * Below lg (9 Nov, unchanged) the coin and the text are one centred, pinned scene: the modes sit on top of one another
 * under the coin, and the scroll cross-fades them (the photo eases in from a slight zoom, the text blurs out upward and
 * the next one in), a fine scrubbed switch instead of a jump.
 */
export default function InTown() {
  const zones = useRef<(HTMLDivElement | null)[]>([]), coin = useRef<HTMLDivElement>(null), photos = useRef<HTMLDivElement>(null), wrap = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    // from lg: the row of three coins
    if (matches(MQ.lg)) {
      const el = row.current!, coins = el.querySelectorAll("[data-coin-in]"), copy = el.querySelectorAll("[data-copy]");
      gsap.set(coins, { opacity: 0, rotationY: -88, scale: 0.8, y: 48, filter: "blur(10px)", transformPerspective: 1400, transformOrigin: "50% 50%" });
      gsap.set(copy, { ...BLOCK_FROM });
      // played once a third of the row is on screen (not as the section's top enters, 328 px above the coins, which
      // left most of the flip happening below the fold); the browser's own visibility check, so it can never be missed
      const io = new IntersectionObserver((es) => {
        if (!es.some((e) => e.intersectionRatio >= 0.35)) return;
        io.disconnect();
        gsap.to(coins, { opacity: 1, rotationY: 0, scale: 1, y: 0, filter: "blur(0px)", duration: 1.8, ease: "expo.out", stagger: 0.2, delay: 0.05 });
        blurIn(copy, { delay: 0.5, stagger: 0.2 });
      }, { threshold: [0.35] });
      io.observe(el);
      const stop = () => io.disconnect();
      const spins = gsap.utils.toArray<HTMLElement>("[data-coin]", el).map((c, k) => {
        const s = k === 1 ? -1 : 1;
        return gsap.timeline({ scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 } })
          .fromTo(c, { rotate: 4 * s }, { rotate: -14 * s, ease: "none" }, 0)
          .fromTo(c.firstElementChild, { rotate: -4 * s }, { rotate: 14 * s, ease: "none" }, 0);
      });
      return () => { stop(); spins.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); }); gsap.set([...coins, ...copy], { clearProps: "all" }); };
    }
    // below lg: pin the coin and the text together, centred, and scrub the switch between modes
    const imgs = [...photos.current!.querySelectorAll("img")], texts = zones.current.filter(Boolean) as HTMLDivElement[];
    gsap.set(imgs, { opacity: (k) => (k ? 0 : 1), scale: (k) => (k ? 1.08 : 1) });
    gsap.set(texts.slice(1), { opacity: 0, y: 16, filter: "blur(12px)" });   // the site's text motion
    const scene = gsap.timeline({ defaults: { ease: "power1.inOut" },
      scrollTrigger: { trigger: wrap.current, start: "center center", end: `+=${(texts.length - 1) * 90 + 40}%`, pin: true,
        pinSpacing: true,   // explicit: the section is a flex column, where ScrollTrigger would otherwise leave it off
        scrub: 1, invalidateOnRefresh: true } });
    for (let k = 1; k < texts.length; k++) {
      const t = k - 0.5;   // each switch takes the middle half of its step, so every mode rests in view
      scene.to(imgs[k - 1], { opacity: 0, duration: 0.5 }, t)
        .fromTo(imgs[k], { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.5 }, t)
        .to(texts[k - 1], { opacity: 0, y: -16, filter: "blur(12px)", duration: 0.3 }, t)
        .to(texts[k], { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.3 }, t + 0.2);
    }
    scene.to({}, { duration: 0.4 });   // a short rest on the last mode before the pin lets go
    // the coin (its mask, so its edge) turns with the scroll; the photos inside turn the other way by the same amount on
    // the same timeline, so the picture stays level at every moment and only the coin's edge appears to rotate
    const spin = gsap.timeline({ scrollTrigger: { trigger: wrap.current, start: "top bottom", end: "bottom top", scrub: 1 } })
      .fromTo(coin.current, { rotate: 4 }, { rotate: -14, ease: "none" }, 0)
      .fromTo(photos.current, { rotate: -4 }, { rotate: 14, ease: "none" }, 0);
    return () => { scene.scrollTrigger?.kill(); scene.kill(); spin.scrollTrigger?.kill(); spin.kill(); };
  }, []);
  const mask = (size: string) => ({ WebkitMaskImage: `url(${T.mask})`, maskImage: `url(${T.mask})`, WebkitMaskSize: size, maskSize: size,
    WebkitMaskPosition: "center", maskPosition: "center", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat" }) as const;
  return (
    <section className="flex flex-col items-center gap-20 overflow-x-clip bg-limestone-50 py-12 container-x lg:py-20">
      <SectionTitle tag={T.tag} title={T.title} body={T.body} className="max-w-[900px]" />

      {/* from lg: the three coins in a row (Figma: 437 × 436 coins, the photo 108 % of the coin, 40 apart) */}
      <div ref={row} className="hidden w-full max-w-[1392px] grid-cols-3 gap-10 lg:grid">
        {T.modes.map((m) => (
          <div key={m.title} className="flex flex-col items-center gap-[30px] text-center">
            <div data-coin-in className="w-full">
              <div data-coin className="relative aspect-[437/436] w-full" style={mask("100% 100%")}>
                <div className="absolute -inset-[4%]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.photo} srcSet={srcSet(m.photo)} alt="" loading="lazy" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <RevealText as="h3" text={m.title} className="t-heading hd-32 text-deepsea-500" />
              <p data-copy className="t-body b-16 text-limestone-800">{m.body}</p>
            </div>
          </div>))}
      </div>

      {/* below lg: one coin centred above the text, the pair pinned in the middle of the screen */}
      <div ref={wrap} className="relative grid w-full gap-10 lg:hidden">
        <div className="mx-auto aspect-square w-[min(58vw,36svh,320px)]">
          <div ref={coin} className="relative h-full w-full" style={mask("93.4% 92.5%")}>
            <div ref={photos} className="absolute inset-0">
              {T.modes.map((m, k) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={m.photo} src={m.photo} srcSet={srcSet(m.photo)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-[opacity,scale] duration-700 [transition-timing-function:var(--ease-site)]"
                  style={{ opacity: k ? 0 : 1, scale: k ? "1.08" : "1" }} />
              ))}
            </div>
          </div>
        </div>
        {/* the modes share one cell; the scene cross-fades them */}
        <div className="grid">
          {T.modes.map((m, k) => (
            <div key={m.title} ref={(el) => { zones.current[k] = el; }} className="flex flex-col items-center gap-3 text-center [grid-area:1/1]">
              <span className="t-label l-tag">{m.tag}</span>
              <RevealText as="h3" text={m.title} className="t-heading hd-40" />
              <p className="max-w-[560px] t-body b-16 text-limestone-800">{m.body}</p>
            </div>))}
        </div>
      </div>
    </section>
  );
}
