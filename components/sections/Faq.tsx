"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import RevealText from "@/components/reveal/RevealText";
import { faq as F } from "@/lib/content";

/** FAQ accordion: the Figma FAQ Item Open transition, 0.35 s ease-in-out, the plus turns 45° into a cross. */
export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="flex flex-col gap-10 bg-limestone-50 py-20 container-x lg:flex-row">
      <div className="flex flex-col gap-10 lg:w-[456px]">
        <div className="flex flex-col gap-3">
          <RevealText as="h2" text={F.title} className="t-heading hd-48" />
          <RevealText text={F.body} className="t-body b-18 text-limestone-800" delay={0.08} />
        </div>
        <div><Button label={F.cta} variant="outline" /></div>
      </div>
      <div className="flex flex-1 flex-col lg:pl-10">
        {F.items.map(([q, a], k) => {
          const on = open === k;
          return (
            <div key={q} className="border-b border-limestone-600">
              <button onClick={() => setOpen(on ? -1 : k)} className="flex w-full items-center justify-between gap-8 px-8 py-7 text-left">
                <RevealText text={q} className="t-text x-28" delay={k * 0.05} />
                <Icon name="plus-sign" size={24} className={`flex-none transition-transform duration-[350ms] [transition-timing-function:var(--ease-fig-inout)] ${on ? "rotate-45" : ""}`} />
              </button>
              <div className="grid transition-[grid-template-rows] duration-[350ms] [transition-timing-function:var(--ease-fig-inout)]" style={{ gridTemplateRows: on ? "1fr" : "0fr" }}>
                <div className="overflow-hidden"><p className="max-w-[740px] px-8 pb-8 t-body b-16 text-limestone-800">{a}</p></div>
              </div>
            </div>);
        })}
      </div>
    </section>
  );
}
