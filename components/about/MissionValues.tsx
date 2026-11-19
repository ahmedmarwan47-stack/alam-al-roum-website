"use client";
import RevealText from "@/components/reveal/RevealText";
import RevealImage from "@/components/reveal/RevealImage";
import { values as V } from "@/lib/about/a-content";

/** Phones: the four cards on one swipe row running to the screen edges, as the Unit types cards. */
const swipe = "max-sm:-mx-[var(--gutter)] max-sm:snap-x max-sm:snap-mandatory max-sm:auto-cols-[72vw] max-sm:grid-flow-col max-sm:overflow-x-auto max-sm:scroll-px-[var(--gutter)] max-sm:px-[var(--gutter)] max-sm:[scrollbar-width:none] max-sm:[&::-webkit-scrollbar]:hidden max-sm:[&>li]:snap-start";

/**
 * Mission & values (Figma 11738:16356, 19 Nov). On white: the tag and the two-line heading on the left, Qatari Diar's
 * mission and vision on the right, their feet aligned; then the four values as tall photo cards in the Unit types
 * style (photo 339 × 509 at 1512, the name at Heading/24, one line at 14 / 20 in Limestone at 60 %), 12 apart. The
 * cards are not links. The photos open with the site's photo sweep, one after another; the copy blurs in.
 */
export default function MissionValues() {
  return (
    <section aria-labelledby="values-title" className="flex flex-col gap-10 bg-white py-12 container-x lg:py-20">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-20">
        <div className="flex flex-col gap-4">
          <RevealText text={V.tag} className="t-label l-tag text-deepsea-500" />
          <div id="values-title"><RevealText as="h2" segs={V.title} className="t-heading hd-56 text-deepsea-500" delay={0.05} /></div>
        </div>
        <div className="max-w-[499px]"><RevealText text={V.body} className="t-body b-20 text-limestone-800" delay={0.15} /></div>
      </div>
      <ul className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-4 ${swipe}`}>
        {V.items.map((v, k) => (
          <li key={v.title} className="flex flex-col gap-[10px]">
            <div className="aspect-[339/509] w-full overflow-hidden">
              <RevealImage src={v.photo} alt={v.alt} delay={k * 0.08} className="h-full w-full" />
            </div>
            <h3 className="t-heading hd-24 text-deepsea-500">{v.title}</h3>
            <p className="t-body b-14 text-limestone-800/60">{v.body}</p>
          </li>))}
      </ul>
    </section>
  );
}
