"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import RevealText from "@/components/reveal/RevealText";
import { departments, roles } from "@/lib/careers";

/** Open positions (Figma 10921:9339): department filter chips over full-width role cards. */
export default function RoleList() {
  const [d, setD] = useState<string>(departments[0]);
  const list = d === departments[0] ? roles : roles.filter((r) => r.dept === d);
  return (
    <section className="flex flex-col gap-10 bg-white pt-20 pb-[120px] container-x">
      <div role="tablist" className="flex flex-wrap gap-2">
        {departments.map((x) => (
          <button key={x} role="tab" aria-selected={d === x} onClick={() => setD(x)}
            className={`h-[42px] rounded-full border px-4 t-label l-14 transition-colors duration-300 ${d === x ? "border-black bg-black text-white" : "border-black/15 text-black hover:border-black/40"}`}>{x}</button>))}
      </div>
      <div className="flex flex-col gap-4">
        {list.length ? list.map((r) => (
          <article key={r.slug} className="flex flex-col justify-between gap-6 bg-limestone-100 p-7 lg:flex-row lg:items-end">
            <div className="flex max-w-[720px] flex-col gap-4 text-black">
              <span className="t-label l-12 text-black/60">{r.dept}</span>
              <RevealText as="h2" text={r.title} className="t-heading hd-32" />
              <p className="t-body b-16 text-black/80">{r.body}</p>
              <div className="flex flex-wrap gap-7 t-text x-16">
                {([["location-01", r.location], ["briefcase-01", r.type], ["clock-01", r.mode]] as const).map(([i, t]) => (
                  <span key={i} className="flex items-center gap-2"><Icon name={i} size={20} />{t}</span>))}
              </div>
            </div>
            <Button label="Explore Vacancy" href={`/careers/${r.slug}`} variant="outline" className="self-start lg:self-end" />
          </article>
        )) : <p className="t-body b-18 text-limestone-800">There are no open roles in {d} right now.</p>}
      </div>
    </section>
  );
}
