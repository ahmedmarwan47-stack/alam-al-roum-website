"use client";
import { useState } from "react";
import { SegmentedToggle } from "./CommunitiesExplorer";
import { EventCard, StoryCard } from "./Cards";
import type { ListCard } from "@/lib/listings";

/**
 * Listing body (Events: Upcoming / Past, Media Center: Blog / News): the Segmented Toggle above a three-column
 * grid of the same cards Home uses — story cards for the Media Center, event cards for Events.
 */
export default function TabbedGrid({ tabs, lists, kind }: { tabs: readonly string[]; lists: ListCard[][]; kind: "story" | "event" }) {
  const [t, setT] = useState(0);
  return (
    <section className="flex flex-col items-center gap-10 bg-white px-[var(--gutter)] py-[60px]">
      <SegmentedToggle options={tabs} value={t} onChange={setT} />
      <div className="grid w-full gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {lists[t].map((c, k) => kind === "story"
          ? <StoryCard key={`${t}-${c.title}`} {...c} delay={(k % 3) * 0.08} />
          : <EventCard key={`${t}-${c.title}`} {...c} delay={(k % 3) * 0.08} />)}
      </div>
    </section>
  );
}
