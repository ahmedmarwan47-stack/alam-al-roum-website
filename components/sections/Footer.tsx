"use client";
import { useState, type ReactNode } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import RevealText from "@/components/reveal/RevealText";
import { footer as F } from "@/lib/content";
import { routes } from "@/lib/routes";

const EASE = "duration-[350ms] [transition-timing-function:var(--ease-fig-inout)]";   // the FAQ item's open / close

/**
 * A link group. From tablet up: its heading over its links, as in Figma. On phones: an accordion row, closed by
 * default, that opens its links with the FAQ's 0.35 s grid-rows ease while its plus turns into a cross; closed links
 * are hidden from taps and the keyboard (visibility flips only once the row has finished closing).
 */
const Group = ({ title, children }: { title: string; children: ReactNode }) => {
  const [on, setOn] = useState(false);
  return (
    <div className="flex flex-col md:gap-6">
      <span className="hidden t-label l-14 md:block">{title}</span>
      <button type="button" onClick={() => setOn(!on)} aria-expanded={on} className="flex h-14 w-full items-center justify-between text-left t-label l-16 md:hidden">
        {title}<Icon name="plus-sign" size={20} className={`transition-transform ${EASE} ${on ? "rotate-45" : ""}`} />
      </button>
      <div className={`grid transition-[grid-template-rows,visibility] ${EASE} md:visible md:grid-rows-[1fr] ${on ? "grid-rows-[1fr]" : "invisible grid-rows-[0fr]"}`}>
        <div className="overflow-hidden md:overflow-visible"><div className="flex flex-col gap-[18px] max-md:pb-6">{children}</div></div>
      </div>
    </div>
  );
};
const Links = ({ items }: { items: string[] }) => items.map((i) => <Link key={i} href={routes[i] ?? "#"} className="t-text x-16 hover:opacity-60">{i}</Link>);

const contactHref = (icon: string, t: string) =>
  icon === "call" ? `tel:${t}` : icon === "whatsapp" ? `https://wa.me/${t.replace(/\D/g, "")}` : icon === "mail-01" ? `mailto:${t}` : routes[t] ?? "#";

/**
 * Footer (Figma "Footer" 10921:11186 · Home 10970:12490): newsletter row, links, legal row, wordmark.
 * Every page uses Home's version, the lagoon film behind the lower part and a 200 px legal row (1035 tall),
 * so the footer is the same site-wide; `video={false}` gives Figma's plain Limestone variant (885 tall).
 */
export default function Footer({ video = true }: { video?: boolean }) {
  return (
    <footer className="relative overflow-hidden bg-limestone-50 text-deepsea-500">
      {/* the film rises out of the Limestone with no edge (Figma): it starts behind the address block and its top
          fades in over 260 px, so nothing reads as a divider between the newsletter row and the water */}
      {video && <video data-media-blur className="absolute inset-x-0 bottom-0 top-[42%] h-[58%] w-full object-cover [mask-image:linear-gradient(to_bottom,transparent_0,black_260px)] max-md:top-[55%] max-md:h-[45%]" src={F.video} autoPlay muted loop playsInline />}
      <div className="relative flex flex-col pt-10 container-x">
        <div className="flex flex-col justify-between gap-8 py-10 lg:flex-row lg:items-center">
          <div className="flex flex-col gap-2"><RevealText text={F.newsTitle} className="t-text x-28" /><span className="t-text x-16">{F.newsBody}</span></div>
          <div className="flex w-full max-w-[453px] flex-col gap-3">
            <form className="flex h-16 items-center gap-2 rounded-lg border border-limestone-600 bg-limestone-100 py-2 pl-5 pr-2">
              {/* min-w-0: the field gives way on a phone, so the Subscribe button keeps its chip inside the box */}
              <input type="email" aria-label={F.placeholder} placeholder={F.placeholder} className="min-w-0 flex-1 bg-transparent t-text x-16 text-deepsea-500 outline-none placeholder:text-limestone-800" />
              <Button label={F.subscribe} variant="primary" compact />
            </form>
            <span className="t-text x-12">{F.consent}</span>
          </div>
        </div>
        <div className="h-px bg-limestone-600" />
        <div className="flex flex-col justify-between gap-10 pt-[50px] lg:flex-row">
          <div className="flex flex-col gap-6">
            <p className="t-text x-28">{F.address.map((l) => <span key={l} className="block">{l}</span>)}</p>
            <span className="t-label l-12">{F.live}</span>
            {/* below lg the three links wrap whole, with room between them, instead of breaking inside a name */}
            <div className="flex flex-wrap gap-[6px] t-text x-16 max-lg:gap-x-5 max-lg:gap-y-0">{F.legal.map((l) => <a key={l} href="#" className="max-lg:whitespace-nowrap max-lg:py-2">{l}</a>)}</div>
          </div>
          {/* phones: the three groups stack as accordion rows (the Contact column used to run off-screen), with rules
              only between the rows */}
          <div className="flex flex-col max-md:divide-y max-md:divide-deepsea-500/20 md:flex-row md:gap-[120px]">
            <Group title="Discover"><Links items={F.discover} /></Group>
            <Group title="More"><Links items={F.more} /></Group>
            <Group title="Contact">
              {F.contact.map(([ic, t]) => { const h = contactHref(ic, t), C = h.startsWith("/") ? Link : "a"; return <C key={t} href={h} className="flex items-center gap-2 t-text x-16">{ic && <Icon name={ic} size={18} />}{t}</C>; })}
              {/* touch screens: 40 px targets round each icon, the first glyph still on the column edge */}
              <div className="flex gap-2 max-lg:-ml-[10px] max-lg:gap-0">{["whatsapp", "facebook-01", "instagram", "tiktok"].map((i) => <a key={i} href="#" aria-label={i.replace("-01", "")} className="max-lg:grid max-lg:size-10 max-lg:place-items-center"><Icon name={i} size={20} /></a>)}</div>
            </Group>
          </div>
        </div>
        {/* phones: the Qatari Diar mark and copyright first, the credit under them, all on the left */}
        <div className={`flex items-end justify-between pb-2 max-md:flex-col-reverse max-md:items-start max-md:gap-4 ${video ? "pt-[200px]" : "pt-[50px]"}`}>
          <span className="t-body b-12 text-limestone-950">{F.credit}</span>
          <div className="flex flex-col items-end gap-4 max-md:items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/qatari-diar.png" alt="Qatari Diar" width={64} height={64} />
            <span className="t-body b-12 text-limestone-950 max-md:text-pretty">{F.copyright}</span>
          </div>
        </div>
        <div className="h-px bg-deepsea-600" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/wordmark.svg" alt="Alam Al Roum" className="w-full pb-10 pt-6" />
      </div>
    </footer>
  );
}
