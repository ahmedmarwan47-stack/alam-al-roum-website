"use client";
import { Fragment, useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import { blurIn } from "@/components/reveal/letters";
import type { Seg } from "@/components/reveal/RevealText";
import { srcSet } from "@/lib/img";

export type PageHeroData = { pre: string; title: Seg[]; body: string; photo: string; alt?: string };

/**
 * Inner-page hero (Destination, Communities, Experiences). 12 Nov review: no scroll animation (it used to pin and grow
 * a small photo to full bleed): the photo fills the screen and stays still, up under the glass bar, and the copy sits
 * at its foot in Limestone, anchored like the Home hero's (84 px up), over a lighter fade (`.hero-page-shade`).
 * On load only the copy blurs in, block by block (pre-headline, headline, paragraph).
 */
export default function PageHero({ data: H }: { data: PageHeroData }) {
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    const q = gsap.utils.selector(wrap.current);
    const intro = gsap.timeline({ delay: 0.3 }).add(blurIn(q("[data-pre], h1, [data-body]")));
    return () => { intro.kill(); };
  }, []);
  return (
    <section data-hero data-nav="light">
      <div ref={wrap} className="relative h-[100svh] min-h-[636px] overflow-hidden bg-deepsea-500 lg:min-h-[716px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={H.photo} srcSet={srcSet(H.photo)} alt={H.alt ?? ""} className="absolute inset-0 h-full w-full object-cover" />
        <div className="hero-page-shade pointer-events-none absolute inset-0" />
        <div className="absolute inset-x-0 bottom-12 flex flex-col gap-4 text-limestone-50 container-x md:bottom-[84px]">
          <span data-pre data-reveal className="t-label l-tag">{H.pre}</span>
          <h1 data-reveal className="t-heading hd-56 hero-t max-w-[1000px]">
            {H.title.map((s, k) => (
              <Fragment key={k}>{s.br && <br />}{k > 0 && !s.br && " "}{s.i ? <span className="t-accent">{s.t}</span> : s.t}</Fragment>))}
          </h1>
          <div data-body data-reveal className="text-limestone-50/90">
            <p className="t-body b-18 hero-b wrap-balance max-w-[520px]">{H.body}</p></div>
        </div>
      </div>
    </section>
  );
}
