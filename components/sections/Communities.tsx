import Button from "@/components/ui/Button";
import RevealText from "@/components/reveal/RevealText";
import SectionTitle from "./SectionTitle";
import { communities } from "@/lib/content";

/** Coin-shaped photos: no mask reveal here (by design). Hover = the Figma Coin Crop spring: the coin tilts −10° and the photo grows 12%. */
export default function Communities() {
  return (
    <section className="flex flex-col items-center gap-10 bg-limestone-50 py-20 container-x">
      <SectionTitle tag={communities.tag} title={communities.title} />
      <div className="grid w-full grid-cols-2 gap-6 lg:grid-cols-4">
        {communities.items.map((c) => (
          <a key={c.name} href={`/communities/${c.slug}`} className="group flex flex-col gap-5">
            <div className="relative aspect-square w-full overflow-hidden transition-transform duration-[.8s] [transition-timing-function:var(--ease-coin-spring)] group-hover:-rotate-[10deg]"
              style={{ WebkitMask: "url(/images/coin-silhouette.svg) center / contain no-repeat", mask: "url(/images/coin-silhouette.svg) center / contain no-repeat" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.photo} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[.8s] [transition-timing-function:var(--ease-coin-spring)] group-hover:scale-[1.12]" />
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <RevealText text={c.name} className="t-label l-18" />
              <RevealText text={c.line} className="t-body b-16 text-limestone-800" delay={0.08} />
            </div>
          </a>
        ))}
      </div>
      <Button label={communities.cta} href="/communities" variant="outline" />
    </section>
  );
}
