"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import RevealText from "@/components/reveal/RevealText";
import { story as S } from "@/lib/about/b-content";
import { srcSet } from "@/lib/img";
import { MQ, matches } from "@/lib/breakpoints";

/**
 * The Story. 15 Nov, "sticky chapters" (chosen from three previews; the 12 Nov version, three full-screen blocks with
 * arched tops, is in git history): one photo holds still while two chapters (the shoreline's history, then the
 * Experience Center) scroll past, and it crossfades to each chapter's picture as that chapter reaches the middle of
 * the screen. No chapter labels or numbers, and the third chapter ("Greatness Is What Remains") is gone (15 Nov).
 * From lg the photo fills the left half, the full height of the screen; on phones and tablets it is a strip across
 * the top (40 % of the screen) with the chapters scrolling up beneath it, each only as tall as its copy (no
 * blank band between the strip and the text). Below lg the strip and the copy pin together and the scroll cross-fades
 * the chapters in place, as Destination · In town does (15 Nov). The copy blurs in (the site's entrance);
 * with reduced motion the first photo simply stays.
 */

const C = S.culture;
const CH = [
  // the same type as the next chapter (15 Nov): the whole title in the heading face (no italic accent line), then a paragraph
  { k: "history", lines: ["This Shoreline Guided", "Sailors Home For", "Two Thousand Years."], accent: "", body: S.history.body,
    photo: S.history.photo, alt: "The shoreline at Alam Al Roum" },
  { k: "culture", lines: C.lines, accent: "", body: C.body,
    photo: C.photos[0].src, alt: C.photos[0].alt },
];

/** A chapter's heading: its lines, then the italic accent if it has one. */
const Heading = ({ c, className = "" }: { c: (typeof CH)[number]; className?: string }) => (
  <h2 className={`flex flex-col ${className}`}>
    {c.lines.map((l) => <span key={l} className="t-heading hd-48">{l}</span>)}
    {c.accent && <span className="t-accent hd-48">{c.accent}</span>}
  </h2>
);

/** A · sticky chapters. */
function StoryA() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current; if (!el || reducedMotion()) return;
    const pics = [...el.querySelectorAll<HTMLElement>("[data-pic]")], chs = [...el.querySelectorAll<HTMLElement>("[data-ch]")];
    // below lg (15 Nov, as Destination · In town): the photo strip and the chapters are one pinned scene, the chapters
    // stacked in one cell, and the scroll cross-fades them (the photo eases in from a slight zoom, the copy blurs out
    // upward and the next one in), a scrubbed switch instead of the chapters scrolling past
    if (!matches(MQ.lg)) {
      gsap.set(pics, { opacity: (k) => (k ? 0 : 1), scale: (k) => (k ? 1.08 : 1) });
      gsap.set(chs.slice(1), { opacity: 0, y: 16, filter: "blur(12px)" });   // the site's text motion
      const tl = gsap.timeline({ defaults: { ease: "power1.inOut" },
        scrollTrigger: { trigger: pin.current,
          // pinned at the top; if the scene is taller than the screen, pinned by its foot so the copy stays readable
          start: () => (pin.current!.offsetHeight > innerHeight ? "bottom bottom" : "top top"),
          end: `+=${(chs.length - 1) * 90 + 40}%`, pin: true, pinSpacing: true, scrub: 1, invalidateOnRefresh: true } });
      for (let k = 1; k < chs.length; k++) {
        const t = k - 0.5;   // each switch takes the middle half of its step, so every chapter rests in view
        tl.to(pics[k - 1], { opacity: 0, duration: 0.5 }, t)
          .fromTo(pics[k], { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.5 }, t)
          .to(chs[k - 1], { opacity: 0, y: -16, filter: "blur(12px)", duration: 0.3 }, t)
          .to(chs[k], { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.3 }, t + 0.2);
      }
      tl.to({}, { duration: 0.4 });   // a short rest on the last chapter before the pin lets go
      return () => { tl.scrollTrigger?.kill(); tl.kill(); };
    }
    const show = (i: number) => pics.forEach((p, j) => gsap.to(p, { opacity: j === i ? 1 : 0, scale: j === i ? 1 : 1.04, duration: 0.9, ease: "power2.out", overwrite: true }));
    const sts = chs.map((ch, i) =>
      ScrollTrigger.create({ trigger: ch, start: "top 70%", end: "bottom 70%", onToggle: (s) => { if (s.isActive) show(i); } }));
    return () => sts.forEach((s) => s.kill());
  }, []);
  return (
    <section ref={root} className="relative bg-limestone-500 text-deepsea-500">
      <div ref={pin} className="bg-limestone-500 lg:grid lg:grid-cols-2">
        {/* the photo holds still while the chapters scroll: a strip across the top on phones, the left half from lg */}
        <div className="relative z-10 h-[40svh] self-start overflow-hidden lg:sticky lg:top-0 lg:h-svh">
          {CH.map((c, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={c.k} data-pic data-no-blur src={c.photo} srcSet={srcSet(c.photo)} alt={c.alt}
              className="absolute inset-0 h-full w-full object-cover" style={{ opacity: i ? 0 : 1 }} />))}
        </div>
        {/* below lg the chapters share one cell (the scene cross-fades them); with reduced motion they simply stack */}
        <div className="max-lg:motion-safe:grid">
          {CH.map((c) => (
            <article key={c.k} data-ch className="flex flex-col justify-center gap-6 max-lg:justify-start max-lg:motion-safe:[grid-area:1/1] px-[var(--gutter)] py-12 lg:min-h-svh lg:px-[clamp(40px,6vw,104px)] lg:py-20">
              <Heading c={c} />
              {c.body && <RevealText text={c.body} className="t-body b-18 max-w-[480px] text-limestone-800" delay={0.1} />}
            </article>))}
        </div>
      </div>
    </section>
  );
}

export default function TheStory() {
  return <StoryA />;
}
