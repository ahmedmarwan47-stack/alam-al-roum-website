import Button from "@/components/ui/Button";
import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";
import { hero } from "@/lib/content";

export default function Hero() {
  return (
    // full viewport, running up under the glass bar, so the film shows through it
    <section data-hero data-nav="light" className="relative h-[100svh] min-h-[636px] overflow-hidden text-limestone-50">
      <RevealImage src={hero.video} src4k={hero.video4k} video poster={hero.poster} onLoad delay={0.2} className="absolute inset-0" />
      {/* the shade the copy sits on, measured over every frame of the film (`.hero-film-shade`) */}
      <div className="hero-film-shade pointer-events-none absolute inset-0" />
      <div className="absolute inset-x-0 bottom-[84px] flex items-end justify-between container-x">
        <div className="flex max-w-[716px] flex-col gap-5 md:max-w-none">
          <RevealText as="h1" segs={hero.title} onLoad delay={0.75} className="t-heading x-80 hero-t md:whitespace-nowrap" />
          {/* a comfortable measure: two even lines of about 65 characters on desktop; on tablets 480 px, so it stays
              clear of the Qatari Diar tab on the right edge */}
          <RevealText text={hero.body} onLoad delay={1.05} className="t-body b-18 hero-b wrap-balance max-w-[560px] md:max-lg:max-w-[480px]" />
          <div className="pt-1"><Button label={hero.cta} href="/contact" size={64} variant="light" className="btn-on-film" /></div>
        </div>
      </div>
      {/* the backer (10 Nov review): a glass tab fixed to the right edge of the screen, its foot level with the copy's
          (84 px up). Limestone at 15 % over a background blur, a hairline on the three open sides, 8 px corners on the
          left only (the right side runs into the screen edge). Logo at its own 60 px; "Backed by" a step smaller than
          "Qatari Diar", set on two lines on purpose */}
      <div className="absolute bottom-[84px] right-0 hidden items-center gap-4 rounded-l-lg border border-r-0 border-limestone-50/20 bg-limestone-50/15 py-3 pl-3 pr-6 backdrop-blur-md md:flex">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/qatari-diar.png" alt="Qatari Diar" width={60} height={60} />
        <span className="flex flex-col">
          <span className="t-label l-14 text-limestone-50/80">{hero.proof[0]}</span>
          <span className="t-label l-18">{hero.proof[1]}</span>
        </span>
      </div>
    </section>
  );
}
