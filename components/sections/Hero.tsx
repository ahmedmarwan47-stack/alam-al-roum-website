import Button from "@/components/ui/Button";
import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";
import { hero } from "@/lib/content";

export default function Hero() {
  return (
    <section className="relative mt-[76px] h-[calc(100svh-76px)] min-h-[560px] overflow-hidden text-limestone-50">
      <RevealImage src={hero.video} video poster={hero.poster} onLoad delay={0.2} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[47%] bg-gradient-to-b from-transparent to-[#010F1A]/70" />
      <div className="absolute inset-x-0 bottom-[84px] flex items-end justify-between container-x">
        <div className="flex max-w-[716px] flex-col gap-5 md:max-w-none">
          <RevealText as="h1" segs={hero.title} onLoad delay={0.75} className="t-text x-80 capitalize md:whitespace-nowrap" />
          <RevealText text={hero.body} onLoad delay={1.05} className="t-body b-16 max-w-[400px]" />
          <div className="pt-1"><Button label={hero.cta} href="/contact" size={64} variant="primary" /></div>
        </div>
        <div className="hidden flex-col items-end gap-[10px] md:flex">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/qatari-diar.png" alt="Qatari Diar" width={60} height={60} />
          <span className="t-label l-18">{hero.proof}</span>
        </div>
      </div>
    </section>
  );
}
