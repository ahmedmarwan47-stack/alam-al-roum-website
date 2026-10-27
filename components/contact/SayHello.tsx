import { Suspense } from "react";
import Icon from "@/components/ui/Icon";
import RevealText from "@/components/reveal/RevealText";
import ContactForm from "./ContactForm";
import { sayHello as S } from "@/lib/contact";

/**
 * Contact · Say hello (Figma 11134:15381, the current version of 10921:9490): the infinity-pool photo under a
 * dark left-to-right wash, white heading and contact rows on the left, the frosted form panel on the right.
 */
export default function SayHello() {
  return (
    <section className="relative mt-[76px] overflow-hidden bg-deepsea-950 py-20 container-x">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={S.image} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/[.48] to-black/[.33]" />
      <div className="relative flex flex-col gap-10 lg:flex-row lg:items-stretch">
        <div className="flex flex-col justify-between gap-16 text-white lg:flex-1">
          <div className="flex flex-col gap-10">
            <RevealText as="h1" text={S.title} onLoad delay={0.15} className="t-label capitalize d-68 leading-[0.94] max-w-[525px]" />
            <RevealText text={S.body} onLoad delay={0.3} className="t-text x-18 max-w-[504px]" />
          </div>
          {/* Figma "Contact grid": the first row holds three cells, then one full-width row per office */}
          <div className="flex flex-col">
            {S.rows.map((row, r) => (
              <div key={r} className={r === 0 ? "grid gap-x-3 sm:grid-cols-3 sm:py-5" : "flex flex-col"}>
                {row.map(([icon, k, v, href]) => (
                  <div key={k} className="flex flex-col gap-2 border-t border-white/20 py-5">
                    <span className="flex items-center gap-2"><Icon name={icon} size={18} /><span className="t-label l-12 opacity-60">{k}</span></span>
                    {href ? <a href={href} className="t-text x-18 break-words hover:opacity-60">{v}</a> : <span className="t-text x-18">{v}</span>}
                  </div>))}
              </div>))}
          </div>
        </div>
        <div id="contact-form" className="scroll-mt-24 lg:flex-none"><Suspense><ContactForm /></Suspense></div>
      </div>
    </section>
  );
}
