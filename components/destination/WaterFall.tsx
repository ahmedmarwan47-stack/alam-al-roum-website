import Button from "@/components/ui/Button";
import RevealText from "@/components/reveal/RevealText";
import { waterStrategy as W } from "@/lib/destination";
import { srcSet } from "@/lib/img";

/** The still sea, seen from straight above: turquoise shallows at the top deepening to navy at the foot, darker than
 *  the earlier photo so the copy has more contrast. Generated in the Alam El Roum Figma file (12 Nov, node 11543:5740;
 *  an alternative, darker open sea, is sea-open-dark.webp, node 11543:5741). */
const SEA = "/images/destination/sea-reef-dark.webp";
/** A fact that starts with a figure keeps its own case ("7.2 km", not the headings' "7.2 Km"). */
const fig = (h: string) => (/^\d/.test(h) ? "normal-case!" : "");

/**
 * Destination · "A city shaped by Water" (#65, 12 Nov review): the Limestone of the section above carries on and slowly gives way to a still photo of the sea seen
 * from above, as if falling from the land into the water; the copy sits on the sea, in Limestone. Nothing moves: the photo is
 * kept out of the site-wide photo sweep (data-no-blur, BlurInOut).
 * Matches the Figma section (Destination • Desktop, 11545:12304): 1294 tall at 1512, 80 px below the copy, 40 between
 * blocks; the fade is a long, eased gradient (many stops, so it never bands) from Limestone 500 to clear over the top
 * 38 %, and a Deep Sea shade (0 → 55 → 90 %) over the lower 60 % keeps the copy legible.
 */
export default function WaterFall() {
  return (
    <section data-nav="light" className="relative overflow-hidden bg-limestone-500">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img data-no-blur src={SEA} srcSet={srcSet(SEA)} alt="The sea seen from above" className="absolute inset-0 h-full w-full object-cover" />
      {/* Limestone → sea: solid at the top, eased out over the upper 38 % (Figma 11545:12304: 497 of 1294) */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-px h-[38.4%]"
        style={{ background: "linear-gradient(to bottom, #F4EADD 0%, #F4EADD 14%, rgb(244 234 221 / .94) 24%, rgb(244 234 221 / .8) 34%, rgb(244 234 221 / .6) 44%, rgb(244 234 221 / .38) 56%, rgb(244 234 221 / .18) 70%, rgb(244 234 221 / .06) 84%, rgb(244 234 221 / 0) 100%)" }} />
      {/* the deep water under the copy */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-b from-deepsea-500/0 via-deepsea-500/55 to-deepsea-500/90" />
      <div className="relative flex min-h-[max(160svh,1100px)] flex-col justify-end gap-10 pb-20 pt-[60svh] text-limestone-50 container-x lg:min-h-[1294px]">
        <div className="flex max-w-[760px] flex-col gap-4">
          <span className="t-label l-tag text-limestone-50/80">{W.tag}</span>
          {/* all Neue Haas (12 Nov, as in Figma): no Immortel accent on "Water" */}
          <RevealText as="h2" text={W.title.map((s) => s.t).join(" ")} className="t-heading hd-56" delay={0.05} />
          <p className="t-body b-18 max-w-[560px] text-limestone-50/85">{W.body}</p>
        </div>
        <div className="grid grid-cols-2 gap-x-4 lg:grid-cols-3 lg:gap-x-6">
          {W.facts.map(([h, b]) => (
            <div key={h} className="flex flex-col gap-1 border-t border-limestone-50/30 py-4 lg:gap-3 lg:py-6">
              <span className={`t-heading hd-24 max-md:text-[16px]! max-md:leading-6! ${fig(h)}`}>{h}</span>
              <span className="t-body b-16 text-limestone-50/80 max-md:text-[14px]! max-md:leading-5!">{b}</span>
            </div>))}
        </div>
        <div><Button label={W.cta} href={W.href} size={54} variant="outline-light" /></div>
      </div>
    </section>
  );
}
