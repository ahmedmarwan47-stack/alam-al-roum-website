"use client";
import { useCallback, useState } from "react";
import Button from "@/components/ui/Button";
import Drawer from "@/components/ui/Drawer";
import Icon from "@/components/ui/Icon";
import RevealImage from "@/components/reveal/RevealImage";
import SectionTitle from "./SectionTitle";

/** A drawer spec row: icon name, label, value. */
export type Spec = [string, string, string];
export type Hotel = { name: string; type: string; photo: string; card: { w: number; h: number }; body?: string; specs?: Spec[] };
export type HotelsData = { tag: string; title: string; body: string; items: Hotel[]; cols?: string; bodyWidth?: number; kind?: "hotel" | "unit"; extra?: string[] };

/**
 * Card grid that opens the Figma Drawer (10480:3695) from the right. Hotels list (Figma 10921:10498) uses the
 * staggered three-column flow; Unit types (Figma 10921:9816) pass `cols` for three equal columns and `kind: "unit"`
 * for the unit drawer's two actions (Register Interest, Download Brochure); hotels get Visit Website.
 */
export default function HotelsList({ data: D }: { data: HotelsData }) {
  // `last` keeps the drawer's content in place while it slides out
  const [open, setOpen] = useState(false), [last, setLast] = useState(0);
  const [shot, setShot] = useState(0);
  const h = D.items[last];
  // the drawer gallery (4 shots): the item's own photo first, then the other cards, then any extra photos
  const shots = [...[h, ...D.items.filter((_, k) => k !== last)].map((x) => x.photo), ...(D.extra ?? [])].slice(0, 4);
  const close = useCallback(() => setOpen(false), []);
  const show = (k: number) => { setShot(0); setLast(k); setOpen(true); };
  return (
    <section className="flex flex-col items-center gap-10 bg-white py-20 container-x">
      <SectionTitle tag={D.tag} title={D.title} body={D.body} bodyWidth={D.bodyWidth} className="max-w-[870px]" />
      <div className={`grid w-full gap-x-3 gap-y-14 sm:grid-cols-2 ${D.cols ?? "lg:grid-cols-[492fr_380fr_496fr]"}`}>
        {D.items.map((it, k) => (
          <button key={it.name} onClick={() => show(k)} className="group flex flex-col gap-[10px] self-start text-left">
            <div className="w-full overflow-hidden" style={{ aspectRatio: `${it.card.w} / ${it.card.h}` }}>
              <RevealImage src={it.photo} alt={it.name} delay={(k % 3) * 0.08} className="h-full w-full"
                imgClassName="transition-transform duration-[1.2s] [transition-timing-function:var(--ease-site)] group-hover:scale-[1.05]" />
            </div>
            <span className="t-heading hd-24 text-black">{it.name}</span>
            <span className="t-body b-14 text-black/60">{it.type}</span>
          </button>))}
      </div>
      {/* Drawer (Figma 11128:14825 hotel · 11128:14826 unit type) */}
      <Drawer open={open} onClose={close} label={h.name}
        footer={D.kind === "unit"
          ? <div className="flex flex-col gap-3 sm:flex-row">
              <Button label="Register Interest" href="/contact" size={54} variant="primary" className="gap-5! sm:flex-1" />
              <Button label="Download Brochure" href="#" size={54} variant="outline" icon="download-04" className="gap-5! sm:flex-1" />
            </div>
          : <div><Button label="Visit Website" href="#" size={54} variant="primary" /></div>}>
        <div className="flex flex-col gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shots[shot]} alt={h.name} loading="lazy" className="h-[260px] w-full rounded-[2px] object-cover" />
          <div className="flex gap-2">
            {shots.map((s, k) => (
              <button key={s} onClick={() => setShot(k)} aria-label={`Photo ${k + 1}`}
                className={`h-20 overflow-hidden rounded-[2px] transition-opacity duration-300 ${k === 0 ? "w-[148px] flex-none" : "min-w-0 flex-1"} ${k === shot ? "opacity-100" : "opacity-70 hover:opacity-100"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="t-heading hd-32">{h.name}</h3>
          {h.body && <p className="t-body b-16 text-limestone-800">{h.body}</p>}
        </div>
        {h.specs && (
          <div className="flex flex-col">
            {h.specs.map(([icon, label, value], k) => (
              <div key={label} className={`flex items-start justify-between gap-4 py-3 ${k < h.specs!.length - 1 ? "border-b border-black/15" : ""}`}>
                <span className="flex items-center gap-2 t-label l-14 text-limestone-700"><Icon name={icon} size={24} />{label}</span>
                <span className="t-text x-16 text-right">{value}</span>
              </div>))}
          </div>)}
      </Drawer>
    </section>
  );
}
