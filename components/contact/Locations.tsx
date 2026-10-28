import Icon from "@/components/ui/Icon";
import RevealImage from "@/components/reveal/RevealImage";
import SectionTitle from "@/components/sections/SectionTitle";
import { locations as L } from "@/lib/contact";

const maps = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

/** Locations (Figma 10921:9743): the regional map with three pins, then one column per office. */
export default function Locations() {
  return (
    <section className="flex flex-col gap-10 bg-white py-[60px] container-x">
      <SectionTitle tag={L.tag} title={L.title} align="left" />
      {/* full bleed on phones, where the strip is short; each pin is a point the labels hang from */}
      <div className="relative -mx-[var(--gutter)] aspect-[2784/960] overflow-hidden md:mx-0">
        <RevealImage src={L.map} alt="Map of Egypt and the Gulf with the three Alam Al Roum offices" className="h-full w-full" />
        {L.pins.map(([name, x, y]) => (
          <span key={name} style={{ left: `${x}%`, top: `${y}%` }} className="absolute">
            {/* md up: Figma's pill, its left edge on the spot */}
            <span className="absolute left-0 top-0 hidden -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3 py-1.5 t-label l-12 text-black shadow-[0_2px_8px_rgba(0,0,0,0.12)] md:flex">
              <Icon name="location-01" size={14} />{name}
            </span>
            {/* phones: a dot on the spot and a small label above it (below for Cairo, so it clears the North Coast) */}
            <span className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ring-2 ring-black/70 md:hidden" />
            <span className={`absolute -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-2 py-0.5 t-label l-12 text-black shadow-[0_2px_8px_rgba(0,0,0,0.12)] md:hidden ${name === "Cairo" ? "top-2" : "bottom-2"}`}>{name}</span>
          </span>))}
        <span className="absolute inset-x-0 bottom-0 hidden bg-white/70 px-2 py-1 t-text text-[10px] leading-3 truncate max-lg:text-[12px] max-lg:leading-4 text-black/80 md:block">{L.credit}</span>
      </div>
      <div className="grid gap-10 md:grid-cols-3 md:gap-6">
        {L.offices.map((o) => (
          // phones stack the offices: rules only between them; from md each column keeps its hairline cap
          <div key={o.city} className="flex flex-col gap-4 border-t border-black/15 pt-6 text-black max-md:first:border-t-0 max-md:first:pt-0">
            <span className="t-label l-12 text-black/60">{o.label}</span>
            <span className="t-heading hd-32">{o.city}</span>
            <div className="flex flex-col gap-2 t-text x-16">
              <span className="flex items-center gap-2"><Icon name="location-01" size={18} />{o.address}</span>
              {/^\d/.test(o.phone) ? <a href={`tel:${o.phone}`} className="flex items-center gap-2 hover:opacity-60"><Icon name="call" size={18} />{o.phone}</a>
                : <span className="flex items-center gap-2"><Icon name="call" size={18} />{o.phone}</span>}
              <span className="flex items-center gap-2"><Icon name="clock-01" size={18} />{L.hours}</span>
            </div>
            <a href={maps(o.address)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 pt-1 t-label l-14 hover:opacity-60">{L.directions}<Icon name="arrow-up-right" size={16} /></a>
          </div>))}
      </div>
    </section>
  );
}
