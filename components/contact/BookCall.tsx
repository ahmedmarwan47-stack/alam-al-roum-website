"use client";
import { useState } from "react";
import Icon from "@/components/ui/Icon";
import SectionTitle from "@/components/sections/SectionTitle";
import { bookCall as B } from "@/lib/contact";

const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

/**
 * Book a Call (Figma 10921:9540): the Cal.com booker's layout — event info, month grid, time slots — in the site's
 * own palette and type rather than Cal.com's default greys: Deep Sea for ink and the picked day and time, Limestone
 * for the open days, Teal for the free-slot dots. (Cal.com's embed takes a brand colour and theme, so the live
 * embed can carry the same look.) It stands in for the embed: picking a day and a time works, and a picked slot
 * opens the contact form.
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
      {/* below lg the three panes stack: event info, the month, then the day's slots two by two */}
      <div className="w-full max-w-[890px] overflow-hidden rounded-xl border border-deepsea-500/10 bg-white text-deepsea-500 shadow-[0_24px_60px_-30px_rgba(7,41,60,0.25)]">
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-col gap-5 border-b border-deepsea-500/10 px-6 py-7 lg:w-[274px] lg:flex-none lg:border-b-0 lg:border-r">
            <span aria-hidden className="grid size-[51px] place-items-center rounded-full bg-deepsea-500 t-label l-16 text-limestone-50">{B.host.split(" ").map((w) => w[0]).join("")}</span>
            <div className="flex flex-col gap-1.5"><span className="t-label l-14 text-limestone-800">{B.host}</span><span className="t-heading hd-24">{B.event}</span></div>
            <p className="t-body b-14 text-limestone-800">{B.body}</p>
            <div className="flex flex-col gap-3">{B.meta.map(([i, t]) => <span key={t} className="flex items-center gap-2 t-label l-14"><Icon name={i} size={16} className="text-teal-600" />{t}</span>)}</div>
          </div>
          <div className="flex flex-col gap-5 px-5 py-7 sm:px-6 lg:w-[384px] lg:flex-none">
            <div className="flex items-center justify-between">
              <span className="flex items-baseline gap-1.5"><span className="t-heading hd-20">{month}</span><span className="t-text x-14 text-limestone-700">{B.year}</span></span>
              <span className="flex gap-1.5">{["arrow-left-01-sharp", "arrow-right-01-sharp"].map((n) => <span key={n} className="grid size-8 place-items-center rounded-full border border-deepsea-500/15"><Icon name={n} size={14} /></span>)}</span>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((d) => <span key={d} className="grid h-7 place-items-center t-label l-12 text-limestone-700">{d}</span>)}
              {Array.from({ length: first }, (_, k) => <span key={`e${k}`} />)}
              {Array.from({ length: total }, (_, k) => k + 1).map((n) => {
                const open = B.open.includes(n), on = n === day;
                return (
                  <button key={n} disabled={!open} onClick={() => setDay(n)}
                    className={`grid h-11 place-items-center rounded-md t-body b-14 transition-colors ${on ? "bg-deepsea-500 text-limestone-50" : open ? "bg-limestone-300 text-deepsea-500 hover:bg-limestone-500" : "text-limestone-600"}`}>{n}</button>);
              })}
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-3 border-t border-deepsea-500/10 px-5 py-7 lg:border-l lg:border-t-0">
            <div className="flex items-center justify-between pb-1">
              <span className="t-label l-14">{weekday} <span className="text-limestone-700">{day}</span></span>
              <span className="flex rounded-md border border-deepsea-500/15 p-[3px] t-label l-12">
                {["12h", "24h"].map((f, k) => <button key={f} onClick={() => setH24(k === 1)} className={`rounded px-1.5 py-0.5 max-lg:px-3 max-lg:py-2 ${h24 === (k === 1) ? "bg-limestone-300" : "text-limestone-700"}`}>{f}</button>)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-col lg:gap-3">
            {B.times.map((t, k) => (
              <a key={t} href="#contact-form" onClick={() => setSlot(k)}
                className={`flex h-[46px] items-center justify-center gap-2 rounded-md border t-label l-14 transition-colors ${slot === k ? "border-deepsea-500 bg-deepsea-500 text-limestone-50" : "border-deepsea-500/15 hover:border-deepsea-500"}`}>
                {slot !== k && <i className="size-1.5 rounded-full bg-teal-500" />}{h24 ? to24(t) : t}
              </a>))}
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-4 border-t border-deepsea-500/10 bg-limestone-100 px-6 py-3.5 t-text x-12 text-limestone-800"><span>{B.tz}</span><span className="text-limestone-700">Powered by Cal.com</span></div>
      </div>
    </section>
  );
}
