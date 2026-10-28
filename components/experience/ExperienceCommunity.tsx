import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";

export type CommunityData = { tag: string; title: string; body: string[]; photos: [string, string]; alt: [string, string]; points: [string, string][] };

/**
 * The community (experience pages): a Deep Terracotta band (the brand red) about the people around an experience —
 * clubs, membership, the life it brings — with a photo pair (a tall photo and a smaller one over its corner) beside
 * the copy and a two-column list of what the community does, on Limestone hairlines.
 */
export default function ExperienceCommunity({ data: C }: { data: CommunityData }) {
  return (
    <section className="bg-terracotta-500 py-20 text-limestone-50 container-x lg:py-[120px]">
      <div className="mx-auto grid max-w-[1392px] items-center gap-12 lg:grid-cols-2 lg:gap-24">
        <div className="relative pb-[14%]">
          <RevealImage src={C.photos[0]} alt={C.alt[0]} className="aspect-[4/5] w-[78%]" />
          <RevealImage src={C.photos[1]} alt={C.alt[1]} delay={0.15} className="absolute bottom-0 right-0 aspect-square w-[46%]" />
        </div>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <RevealText text={C.tag} className="t-label l-16 text-limestone-50/70" />
            <RevealText as="h2" text={C.title} className="t-heading hd-48 [text-wrap:balance]" delay={0.05} />
            {C.body.map((p, k) => <RevealText key={k} text={p} className="t-body b-18 text-limestone-50/80" delay={0.12 + k * 0.05} />)}
          </div>
          <dl className="grid gap-x-8 sm:grid-cols-2">
            {C.points.map(([t, b], k) => (
              <div key={t} className="flex flex-col gap-2 border-t border-limestone-50/20 py-5 first:border-t-0 first:pt-0 sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(2)]:pt-0">
                <dt><RevealText text={t} className="t-heading hd-20" delay={k * 0.04} /></dt>
                <dd><RevealText text={b} className="t-body b-16 text-limestone-50/70" delay={0.06 + k * 0.04} /></dd>
              </div>))}
          </dl>
        </div>
      </div>
    </section>
  );
}
