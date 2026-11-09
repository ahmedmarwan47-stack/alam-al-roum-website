import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";

export type WeekData = { tag: string; title: string; body: string; items: { title: string; body: string; photo: string; alt: string }[] };

/**
 * Life in the community (experience pages): four parts of everyday life around the experience, each a 4:5 photo
 * that opens with the site's wipe, a title (Heading/24) and two lines of body. The cards are row subgrids, so titles
 * and bodies stay in line across a row when one title wraps. Tablets: two per row; phones: one per row.
 * (28 Oct review: visuals and content in place of the earlier day-and-time schedule.)
 */
export default function ExperienceWeek({ data: W }: { data: WeekData }) {
  return (
    <section className="bg-limestone-50 py-20 container-x lg:py-[120px]">
      <div className="mx-auto flex max-w-[1392px] flex-col gap-12">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-end lg:gap-24">
          <div className="flex flex-col gap-4">
            <RevealText text={W.tag} className="t-label l-tag" />
            <RevealText as="h2" text={W.title} className="t-heading hd-48 [text-wrap:balance]" delay={0.05} />
          </div>
          <RevealText text={W.body} className="t-body b-18 max-w-[560px] text-limestone-800" delay={0.12} />
        </div>
        <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {W.items.map((d, k) => (
            // phones (one column): a plain stack with the site's card spacing (photo → title 12 px, title → text 4 px; a
            // subgrid would leak the list's 48 px row gap into the card). From sm the row subgrid keeps titles and
            // texts aligned across the row, with Figma's 16 + 4 px
            <li key={d.title} className="flex flex-col sm:row-span-3 sm:grid sm:grid-rows-subgrid sm:gap-y-4">
              <RevealImage src={d.photo} alt={d.alt} delay={k * 0.06} className="aspect-[4/5] w-full" />
              <RevealText as="h3" text={d.title} className="t-heading hd-24 pt-3 sm:pt-1" delay={0.05 + k * 0.06} />
              <RevealText text={d.body} className="t-body b-16 pt-1 text-limestone-800 sm:pt-0" delay={0.1 + k * 0.06} />
            </li>))}
        </ul>
      </div>
    </section>
  );
}
