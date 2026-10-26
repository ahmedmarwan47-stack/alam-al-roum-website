import { Suspense } from "react";
import Icon from "@/components/ui/Icon";
import RevealText from "@/components/reveal/RevealText";
import ContactForm from "./ContactForm";
import { sayHello as S } from "@/lib/contact";

/** Contact · Say hello (Figma 10921:9490): heading and contact grid on the olive visual, form panel on the right. */
export default function SayHello() {
  return (
    <section className="relative mt-[76px] overflow-hidden bg-white py-20 container-x">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={S.image} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
      <div className="relative flex flex-col gap-10 lg:flex-row lg:justify-center">
        <div className="flex flex-col justify-between gap-16 lg:max-w-[764px] lg:flex-1 lg:py-10">
          <div className="flex flex-col gap-6 text-black">
            <RevealText as="h1" text={S.title} onLoad delay={0.15} className="t-body capitalize [font-size:clamp(44px,4.5vw,68px)] leading-[1] max-w-[520px]" />
            <RevealText text={S.body} onLoad delay={0.3} className="t-body b-18" />
          </div>
          <div className="flex flex-col">
            {S.rows.map((row, r) => (
              <div key={r} className="grid gap-3 sm:grid-flow-col sm:auto-cols-fr">
                {row.map(([icon, k, v, href]) => (
                  <div key={k} className="flex flex-col gap-2 border-t border-limestone-500 py-5 text-deepsea-500">
                    <span className="flex items-center gap-2"><Icon name={icon} size={18} /><span className="t-label l-12 opacity-60">{k}</span></span>
                    {href ? <a href={href} className="t-text x-16 lg:[font-size:18px] lg:leading-7 hover:opacity-60">{v}</a> : <span className="t-text x-16 lg:[font-size:18px] lg:leading-7">{v}</span>}
                  </div>))}
              </div>))}
          </div>
        </div>
        <div id="contact-form" className="scroll-mt-24 lg:flex-none"><Suspense><ContactForm /></Suspense></div>
      </div>
    </section>
  );
}
