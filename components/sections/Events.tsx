"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";
import SectionTitle from "./SectionTitle";
import { events as E } from "@/lib/content";

export default function Events() {
  const [past, setPast] = useState(false);
  const list = past ? E.past : E.upcoming;
  return (
    <section className="flex flex-col items-center gap-10 bg-deepsea-800 py-20 text-limestone-50 container-x">
      <div className="flex flex-col items-center gap-4">
        <SectionTitle tag={E.tag} title={E.title} dark />
        <div className="relative flex rounded-full bg-limestone-50 p-1 t-label l-16 text-deepsea-500">
          <span className="absolute top-1 h-12 w-[180px] rounded-full bg-deepsea-500 transition-transform duration-500 [transition-timing-function:var(--ease-site)]" style={{ transform: `translateX(${past ? 180 : 0}px)` }} />
          {["Upcoming", "Past"].map((l, k) => (
            <button key={l} onClick={() => setPast(k === 1)} className={`relative h-12 w-[180px] rounded-full transition-colors duration-500 ${past === (k === 1) ? "text-limestone-50" : ""}`}>{l}</button>))}
        </div>
      </div>
      <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
        {list.map(([cat, date, title, p], k) => (
          <a key={`${past}-${k}`} href="#" className="group flex flex-col gap-4">
            <RevealImage src={`/images/photo/${p}.jpg`} delay={k * 0.08} className="aspect-[336/376] w-full" imgClassName="transition-transform duration-[1.2s] [transition-timing-function:var(--ease-site)] group-hover:scale-105" />
            <span className="flex items-center gap-3 t-label l-14 text-limestone-50/70"><span>{cat}</span><i className="h-3 w-px bg-limestone-50/30" /><span>{date}</span></span>
            <RevealText text={title} className="t-text x-20" delay={0.1 + k * 0.05} />
          </a>))}
      </div>
      <Button label={E.cta} variant="outline-light" />
    </section>
  );
}
