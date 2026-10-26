"use client";
import { useState } from "react";
import Icon from "@/components/ui/Icon";
import SectionTitle from "@/components/sections/SectionTitle";
import { bookCall as B } from "@/lib/contact";

const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const ink = "text-[#2c2929]";

/**
 * Book a Call (Figma 10921:9540): the Cal.com booker as designed — event info, month grid, time slots.
 * It stands in for the live embed: picking a day and a time works, and a picked slot opens the contact form.
 */
export default function BookCall() {
  const [day, setDay] = useState(B.initial);
  const [slot, setSlot] = useState(2);
  const [h24, setH24] = useState(false);
  const first = new Date(B.year, B.month, 1).getDay();
  const total = new Date(B.year, B.month + 1, 0).getDate();
  const month = new Date(B.year, B.month).toLocaleString("en", { month: "long" });
  const weekday = new Date(B.year, B.month, day).toLocaleString("en", { weekday: "short" });
  const to24 = (t: string) => { const [, h, m, ap] = t.match(/(\d+):(\d+)(am|pm)/)!; return `${(+h % 12) + (ap === "pm" ? 12 : 0)}:${m}`; };
  return (
    <section className="flex flex-col items-center gap-12 bg-limestone-50 py-[60px] container-x">
      <SectionTitle tag={B.tag} title={B.title} />
      <div className="w-full max-w-[890px] overflow-x-auto rounded-xl border border-black/10 bg-white">
        <div className="flex min-w-[820px]">
          <div className={`flex w-[274px] flex-none flex-col gap-5 border-r border-black/10 px-6 py-7 ${ink}`}>
            <span className="size-[51px] rounded-full bg-[#c4c4c4]" />
            <div className="flex flex-col gap-1.5"><span className="t-label l-14 text-black/70">{B.host}</span><span className="t-text x-20">{B.event}</span></div>
            <p className="t-body b-14 text-black/70">{B.body}</p>
            <div className="flex flex-col gap-3">{B.meta.map(([i, t]) => <span key={t} className="flex items-center gap-2 t-label l-14"><Icon name={i} size={16} />{t}</span>)}</div>
          </div>
          <div className="flex w-[384px] flex-none flex-col gap-5 px-6 py-7">
            <div className={`flex items-center justify-between ${ink}`}>
              <span className="flex items-baseline gap-1.5"><span className="t-text x-20">{month}</span><span className="t-text x-14 text-black/60">{B.year}</span></span>
              <span className="flex gap-2 text-black/40"><Icon name="arrow-left-01-sharp" size={16} /><Icon name="arrow-right-01-sharp" size={16} /></span>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((d) => <span key={d} className="grid h-7 place-items-center t-label l-12 text-black/60">{d}</span>)}
              {Array.from({ length: first }, (_, k) => <span key={`e${k}`} />)}
              {Array.from({ length: total }, (_, k) => k + 1).map((n) => {
                const open = B.open.includes(n), on = n === day;
                return (
                  <button key={n} disabled={!open} onClick={() => setDay(n)}
                    className={`grid h-11 place-items-center rounded-md t-body b-14 transition-colors ${on ? "bg-[#2c2929] text-white" : open ? "bg-black/[0.07] text-black hover:bg-black/15" : "text-black/30"}`}>{n}</button>);
              })}
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-3 border-l border-black/10 px-5 py-7">
            <div className={`flex items-center justify-between pb-1 ${ink}`}>
              <span className="t-label l-14">{weekday} <span className="text-black/60">{day}</span></span>
              <span className="flex rounded-md border border-black/10 p-[3px] t-label l-12">
                {["12h", "24h"].map((f, k) => <button key={f} onClick={() => setH24(k === 1)} className={`rounded px-1.5 py-0.5 ${h24 === (k === 1) ? "bg-black/[0.07]" : "text-black/60"}`}>{f}</button>)}
              </span>
            </div>
            {B.times.map((t, k) => (
              <a key={t} href="#contact-form" onClick={() => setSlot(k)}
                className={`flex h-[46px] items-center justify-center gap-2 rounded-md border t-label l-14 transition-colors ${slot === k ? "border-[#2c2929] bg-[#2c2929] text-white" : `border-black/15 ${ink} hover:border-black/40`}`}>
                {slot !== k && <i className="size-1.5 rounded-full bg-[#8b8a5e]" />}{h24 ? to24(t) : t}
              </a>))}
          </div>
        </div>
        <div className="flex justify-between border-t border-black/10 px-6 py-3.5 t-text x-12 text-black/70"><span>{B.tz}</span><span className="text-black/40">Powered by Cal.com</span></div>
      </div>
    </section>
  );
}
