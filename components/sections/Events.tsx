"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { EventCard } from "./Cards";
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
          <EventCard key={`${past}-${k}`} tag={cat} meta={date} title={title} photo={`/images/photo/${p}.jpg`} href="/events" delay={k * 0.08} dark />))}
      </div>
      <Button label={E.cta} href="/events" variant="outline-light" />
    </section>
  );
}
