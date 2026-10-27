"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { EventCard } from "./Cards";
import SectionTitle from "./SectionTitle";
import { events as E } from "@/lib/content";

/** `hrefs` maps an event title to its detail page (worked out on the server from lib/listings); a title without one opens /events. */
export default function Events({ hrefs = {} }: { hrefs?: Record<string, string> }) {
  const [past, setPast] = useState(false);
  const list = past ? E.past : E.upcoming;
  return (
    <section className="flex flex-col items-center gap-10 bg-deepsea-800 py-20 text-limestone-50 container-x">
      <div className="flex flex-col items-center gap-4">
        <SectionTitle tag={E.tag} title={E.title} dark />
        {/* each half is 180px, narrowed below lg so the pill never runs past a phone's gutters (2 × 180 + 8 > 350) */}
        <div className="relative flex rounded-full bg-limestone-50 p-1 t-label l-16 text-deepsea-500">
          <span className="absolute top-1 h-12 w-[min(180px,calc(50vw-var(--gutter)-4px))] rounded-full bg-deepsea-500 transition-transform duration-500 [transition-timing-function:var(--ease-site)] lg:w-[180px]" style={{ transform: `translateX(${past ? "100%" : "0px"})` }} />
          {["Upcoming", "Past"].map((l, k) => (
            <button key={l} onClick={() => setPast(k === 1)} aria-pressed={past === (k === 1)} className={`relative h-12 w-[min(180px,calc(50vw-var(--gutter)-4px))] rounded-full transition-colors duration-500 lg:w-[180px] ${past === (k === 1) ? "text-limestone-50" : ""}`}>{l}</button>))}
        </div>
      </div>
      <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
        {list.map(([cat, date, title, p], k) => (
          <EventCard key={`${past}-${k}`} tag={cat} meta={date} title={title} photo={`/images/photo/${p}.jpg`} href={hrefs[title] ?? "/events"} delay={k * 0.08} dark />))}
      </div>
      <Button label={E.cta} href="/events" variant="outline-light" />
    </section>
  );
}
