import Button from "@/components/ui/Button";
import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";
import { hero } from "@/lib/content";

export default function Hero() {
  return (
    // full viewport, running up under the glass bar, so the film shows through it
    <section data-hero className="relative h-[100svh] min-h-[636px] overflow-hidden text-limestone-50">
      <RevealImage src={hero.video} video poster={hero.poster} onLoad delay={0.2} className="absolute inset-0" />
      {/* the shade the copy sits on, measured over every frame of the film (`.hero-film-shade`) */}
      <div className="hero-film-shade pointer-events-none absolute inset-0" />
      <div className="absolute inset-x-0 bottom-[84px] flex items-end justify-between container-x">
        <div className="flex max-w-[716px] flex-col gap-5 md:max-w-none">
          <RevealText as="h1" segs={hero.title} onLoad delay={0.75} className="t-text x-80 capitalize md:whitespace-nowrap" />
          {/* a comfortable measure: two even lines of about 65 characters on desktop */}
          <RevealText text={hero.body} onLoad delay={1.05} className="t-body b-18 wrap-balance max-w-[560px]" />
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
