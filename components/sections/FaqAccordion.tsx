"use client";
import { useState } from "react";
import FilterChips from "@/components/ui/FilterChips";
import { FaqList } from "./Faq";
import { faqPage as P } from "@/lib/faq";

/** FAQ page body (Figma "FAQ Accordion" 10921:9434): category chips centred over a 922 px accordion. */
export default function FaqAccordion() {
  const [cat, setCat] = useState<string>(P.categories[0]);
  const items = cat === P.categories[0] ? P.items : P.items.filter((x) => x.cat === cat);
  return (
    <section className="flex flex-col items-center bg-white py-20 container-x">
      <div className="flex w-full max-w-[922px] flex-col gap-10">
        <FilterChips options={P.categories} value={cat} onChange={setCat} className="justify-center" />
        <FaqList key={cat} items={items.map((x) => [x.q, x.a] as [string, string])} />
      </div>
    </section>
  );
}
