"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import RevealText from "@/components/reveal/RevealText";
import type { Seg } from "@/components/reveal/RevealText";
import { faq } from "@/lib/content";

type FaqData = { title: string | Seg[]; body: string; cta: string; href?: string; items: string[][] | [string, string][] };

/**
 * Figma FAQ Item (10370:3370) list: click toggles Default ↔ Open (0.35 s ease-in-out), the plus turns 45° into a
 * cross. Shared by the FAQ sections (Home, About, Destination, Sustainability) and the FAQ page.
 */
export function FaqList({ items, first = 0 }: { items: string[][] | [string, string][]; first?: number }) {
  const [open, setOpen] = useState(first);
  return (
    <div className="flex flex-col">
      {items.map(([q, a], k) => {
        const on = open === k;
        return (
          <div key={q} className="border-b border-limestone-600">
            <button onClick={() => setOpen(on ? -1 : k)} aria-expanded={on} className="flex w-full items-center justify-between gap-8 px-5 py-6 text-left sm:px-8 sm:py-7">
              <RevealText text={q} className="t-text x-28" delay={Math.min(k, 5) * 0.05} />
              <Icon name="plus-sign" size={24} className={`flex-none transition-transform duration-[350ms] [transition-timing-function:var(--ease-fig-inout)] ${on ? "rotate-45" : ""}`} />
            </button>
            <div className="grid transition-[grid-template-rows] duration-[350ms] [transition-timing-function:var(--ease-fig-inout)]" style={{ gridTemplateRows: on ? "1fr" : "0fr" }}>
              <div className="overflow-hidden"><p className="max-w-[768px] px-5 pb-8 t-body b-16 text-limestone-800 sm:pl-8 sm:pr-[120px]">{a}</p></div>
            </div>
          </div>);
      })}
    </div>
  );
}

/** FAQ section: title, intro and a button on the left, the accordion on the right. */
export default function Faq({ data = faq }: { data?: FaqData }) {
  const F = data;
  return (
    <section className="flex flex-col gap-10 bg-limestone-50 py-20 container-x lg:flex-row">
      <div className="flex flex-col gap-10 lg:w-[456px] lg:flex-none">
        <div className="flex flex-col gap-3">
          <RevealText as="h2" {...(typeof F.title === "string" ? { text: F.title } : { segs: F.title })} className="t-heading hd-48" />
          <RevealText text={F.body} className="t-body b-18 text-limestone-800" delay={0.08} />
        </div>
        <div><Button label={F.cta} href={F.href ?? "/faq"} variant="outline" /></div>
      </div>
      <div className="flex-1 lg:pl-10"><FaqList items={F.items} /></div>
    </section>
  );
}
