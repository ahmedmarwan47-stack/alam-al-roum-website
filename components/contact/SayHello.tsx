import { Suspense } from "react";
import Icon from "@/components/ui/Icon";
import RevealText from "@/components/reveal/RevealText";
import ContactForm from "./ContactForm";
import { sayHello as S } from "@/lib/contact";
import { srcSet } from "@/lib/img";

/**
 * Contact · Say hello (Figma 11134:15381, the current version of 10921:9490): the infinity-pool photo under a
 * dark left-to-right wash, white heading and contact rows on the left, the frosted form panel on the right.
 */
export default function SayHello() {
  return (
    <section data-hero className="relative overflow-hidden bg-deepsea-950 pb-20 pt-[156px] container-x">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={S.image} srcSet={srcSet(S.image)} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
      {/* Deep Sea wash, held at 56 %+ across the copy column so its 12 px labels pass AA on the bright water (measured);
          phones: the copy spans the full width, so the wash is even */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgb(1_15_26/.66)_0%,rgb(1_15_26/.58)_52%,rgb(1_15_26/.42)_100%)] max-md:bg-[linear-gradient(0deg,rgb(1_15_26/.64),rgb(1_15_26/.64))]" />
      <div className="relative flex flex-col gap-10 lg:flex-row lg:items-stretch">
        <div className="flex flex-col justify-between gap-16 text-white lg:flex-1">
          <div className="flex flex-col gap-3">
            {/* 18 Nov: the site's hero type (as PageHero / ListingHero): Heading/56 regular, Body/18, not the bold label face;
                12 px from the title to the line */}
            <RevealText as="h1" text={S.title} onLoad delay={0.15} className="t-heading capitalize hd-56 hero-t max-w-[560px]" />
            <RevealText text={S.body} onLoad delay={0.3} className="t-body b-18 hero-b wrap-balance max-w-[504px]" />
          </div>
          {/* Figma "Contact grid" (11697:7868, 18 Nov): three cells in the first row (12 px apart), then the two offices side by
              side, each with a hairline above; no rule above the first row (on phones, where the cells stack, between them);
              labels Haas Md 12 in pure white (owner's call, 18 Nov), values 18 / 28 */}
          <div className="flex flex-col">
            {S.rows.map((row, r) => (
              <div key={r} className={r === 0 ? "grid gap-x-3 sm:grid-cols-3" : "grid sm:grid-cols-2"}>
                {row.map(([icon, k, v, href], c) => (
                  <div key={k} className={`flex flex-col gap-2 py-5 ${r > 0 ? "border-t border-white/20" : c > 0 ? "border-t border-white/20 sm:border-t-0" : ""}`}>
                    <span className="flex items-center gap-2"><Icon name={icon} size={18} /><span className="t-label l-12 text-white">{k}</span></span>
                    {href ? <a href={href} className="t-text x-18 break-words hover:opacity-60">
                      {/* an email may wrap only after the @, never mid-word */}
                      {v.includes("@") ? <>{v.split("@")[0]}@<wbr />{v.split("@")[1]}</> : v}
                    </a> : <span className="t-text x-18">{v}</span>}
                  </div>))}
              </div>))}
          </div>
        </div>
        {/* data-hydrate-late: NoOrphans leaves the form alone until it has hydrated (it streams in after the page) */}
        <div id="contact-form" data-hydrate-late className="scroll-mt-24 lg:flex-none"><Suspense><ContactForm /></Suspense></div>
      </div>
    </section>
  );
}
