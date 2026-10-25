"use client";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import RevealImage from "@/components/reveal/RevealImage";
import SectionTitle from "./SectionTitle";

export type Hotel = { name: string; type: string; photo: string; card: { w: number; h: number } };
export type HotelsData = { tag: string; title: string; body: string; items: Hotel[] };

/** Hotels list (Figma 10921:10498): the staggered three-column flow; a card opens the detail drawer from the right. */
export default function HotelsList({ data: D }: { data: HotelsData }) {
  const [open, setOpen] = useState<number | null>(null);
  const h = open === null ? null : D.items[open];
  useEffect(() => {
    if (open === null) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    window.addEventListener("keydown", esc);
    document.documentElement.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", esc); document.documentElement.style.overflow = ""; };
  }, [open]);
  return (
    <section className="flex flex-col items-center gap-14 bg-white py-20 container-x">
      <SectionTitle tag={D.tag} title={D.title} body={D.body} className="max-w-[870px]" />
      <div className="grid w-full gap-x-3 gap-y-14 sm:grid-cols-2 lg:grid-cols-[492fr_380fr_496fr]">
        {D.items.map((it, k) => (
          <button key={it.name} onClick={() => setOpen(k)} className="group flex flex-col gap-[10px] self-start text-left">
            <div className="overflow-hidden" style={{ aspectRatio: `${it.card.w} / ${it.card.h}` }}>
              <RevealImage src={it.photo} alt={it.name} delay={(k % 3) * 0.08} className="h-full w-full"
                imgClassName="transition-transform duration-[1.2s] [transition-timing-function:var(--ease-site)] group-hover:scale-[1.05]" />
            </div>
            <span className="t-heading hd-24 text-black">{it.name}</span>
            <span className="t-text x-16 text-black/60">{it.type}</span>
          </button>))}
      </div>
      {/* Drawer */}
      <div className={`fixed inset-0 z-[60] transition-[visibility] ${h ? "visible" : "invisible delay-500"}`} aria-hidden={!h}>
        <button aria-label="Close" onClick={() => setOpen(null)} className={`absolute inset-0 bg-deepsea-950/50 transition-opacity duration-500 ${h ? "opacity-100" : "opacity-0"}`} />
        <aside role="dialog" aria-modal="true" aria-label={h?.name}
          className={`absolute inset-y-0 right-0 flex w-full max-w-[560px] flex-col gap-6 overflow-y-auto bg-limestone-50 p-6 transition-transform duration-500 [transition-timing-function:var(--ease-site)] lg:p-10 ${h ? "translate-x-0" : "translate-x-full"}`}>
          <button onClick={() => setOpen(null)} className="ml-auto grid h-10 w-10 place-items-center rounded-full border border-deepsea-500/30" aria-label="Close drawer">
            <Icon name="plus-sign" size={18} className="rotate-45" />
          </button>
          {h && <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={h.photo} alt={h.name} className="aspect-[4/5] w-full rounded-lg object-cover" />
            <div className="flex flex-col gap-2">
              <span className="t-label l-16 text-limestone-800">{D.tag}</span>
              <h3 className="t-heading hd-40">{h.name}</h3>
              <p className="t-text x-16 text-limestone-800">{h.type}</p>
            </div>
            <div><Button label="Register interest" href="/contact" variant="primary" /></div>
          </>}
        </aside>
      </div>
    </section>
  );
}
