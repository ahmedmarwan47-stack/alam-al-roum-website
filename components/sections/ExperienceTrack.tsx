import Link from "next/link";
import Icon from "@/components/ui/Icon";
import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";
import { track as T, experiences } from "@/lib/experiences";

/**
 * Experiences · Track (Figma 10921:7608, "The Drop" style): a 3-column grid of tall cards; each photo
 * opens with the mask reveal, then slowly scales on hover while the Explore chip lifts.
 * `exclude` hides the card for the page you are on (detail pages reuse this track).
 */
export default function ExperienceTrack({ exclude, title }: { exclude?: string; title?: typeof T.title }) {
  const items = experiences.filter((x) => x.slug !== exclude);
  return (
    <section className="flex flex-col gap-10 bg-white py-20 container-x">
      <div className="flex max-w-[917px] flex-col gap-4">
        <RevealText text={T.tag} className="t-label l-16" />
        <RevealText as="h2" segs={title ?? T.title} className="t-label hd-56 capitalize" delay={0.05} />
        <RevealText text={T.body} className="t-body b-18 opacity-70" delay={0.12} />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((x, k) => (
          <Link key={x.slug} href={`/experiences/${x.slug}`} className="group flex flex-col gap-4">
            <div className="relative aspect-[448/587] overflow-hidden">
              <RevealImage src={x.photo} alt={x.title} delay={(k % 3) * 0.08} className="h-full w-full"
                imgClassName="transition-transform duration-[1.2s] [transition-timing-function:var(--ease-site)] group-hover:scale-[1.06]" />
              <span className="absolute bottom-4 right-4 flex items-center gap-[6px] rounded-full bg-white px-[14px] py-2 t-label l-12 text-black transition-transform duration-500 [transition-timing-function:var(--ease-site)] group-hover:-translate-y-1">
                {T.cta}<Icon name="arrow-up-right" size={14} />
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-4 text-black">
              <span className="t-heading hd-24">{x.title}</span>
              <span className="t-body b-14 text-right opacity-60">{x.note}</span>
            </div>
          </Link>))}
      </div>
    </section>
  );
}
