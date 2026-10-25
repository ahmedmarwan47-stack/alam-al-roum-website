import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import RevealText from "@/components/reveal/RevealText";
import RevealMask from "@/components/reveal/RevealMask";
import RadiusMap from "./RadiusMap";
import { connectivity as c } from "@/lib/content";

export default function Connectivity() {
  return (
    <section className="flex flex-col gap-10 bg-terracotta-500 py-20 text-limestone-50 container-x lg:flex-row">
      <div className="flex flex-col gap-10 lg:w-[46%]">
        <RevealMask from="left"><RadiusMap /></RevealMask>
        <div className="flex flex-col gap-4 rounded-[20px] border border-limestone-50/15 bg-limestone-50/5 p-6">
          <span className="flex items-center gap-[10px] t-label l-16"><Icon name="airplane-01" />{c.visa.label}</span>
          <div className="grid grid-cols-2 gap-7">
            {c.visa.points.map(([h, b]) => (
              <div key={h} className="flex flex-col gap-2"><RevealText text={h} className="t-heading hd-24" /><RevealText text={b} className="t-body b-16 text-limestone-50/75" delay={0.08} /></div>))}
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-8 lg:pl-10">
        <div className="flex flex-col gap-4">
          <RevealText text={c.tag} className="t-label l-16" />
          <RevealText as="h2" text={c.title} className="t-heading hd-48" delay={0.05} />
        </div>
        <RevealText text={c.body} className="t-body b-18 max-w-[607px] text-limestone-50/80" delay={0.1} />
        <div className="flex flex-col gap-4">
          <span className="t-text x-16 text-limestone-50/70">{c.listLabel}</span>
          <div className="flex flex-col">
            {c.items.map((it, k) => (
              <div key={it.title} className="flex gap-4 border-b border-limestone-50/15 py-[18px]">
                <span className="w-6 t-label l-14 text-limestone-50/60">{String(k + 1).padStart(2, "0")}</span>
                <Icon name={it.icon} />
                <div className="flex flex-col gap-1"><RevealText text={it.title} className="t-heading hd-14" /><RevealText text={it.body} className="t-body b-16 text-limestone-50/75" delay={0.06} /></div>
              </div>))}
          </div>
        </div>
        <div><Button label={c.cta} variant="light" /></div>
      </div>
    </section>
  );
}
