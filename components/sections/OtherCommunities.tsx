import Link from "next/link";
import SectionTitle from "./SectionTitle";
import MasterplanMap from "./MasterplanMap";
import RevealImage from "@/components/reveal/RevealImage";
import { communities } from "@/lib/communities";

const pinsFor = () => communities.filter((c) => c.pin).map((c) => ({ title: c.name, body: c.line, x: c.pin!.x, y: c.pin!.y, photo: c.pinPhoto, href: `/communities/${c.slug}` }));

/** "<Name> on the masterplan" (Figma 10921:9835): the shared masterplan with this community's pin open. */
export function CommunityOnMasterplan({ slug, title, body }: { slug: string; title: string; body: string }) {
  const pins = pinsFor();
  const k = pins.findIndex((p) => p.href.endsWith(`/${slug}`));
  return (
    <section className="flex flex-col gap-10 bg-white pt-20">
      <SectionTitle tag="Masterplan" title={title} body={body} className="container-x" />
      <MasterplanMap image="/images/communities/masterplan.jpg" pins={pins} initial={k} />
    </section>
  );
}

/** Other communities (Figma 11128:16022): the grid cards, with the current community hidden. */
export default function OtherCommunities({ exclude }: { exclude: string }) {
  const items = communities.filter((c) => c.slug !== exclude);
  return (
    <section className="flex flex-col items-center gap-10 bg-white py-20 container-x">
      <SectionTitle tag="Communities" title="More communities" body="Each district has its own character. All share the sea." />
      <div className="grid w-full gap-x-3 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c, k) => (
          <Link key={c.slug} href={`/communities/${c.slug}`} className="group flex flex-col gap-[10px]">
            <div className="aspect-[4/5] overflow-hidden">
              <RevealImage src={c.photo} alt={c.name} delay={(k % 3) * 0.08} className="h-full w-full"
                imgClassName="transition-transform duration-[1.2s] [transition-timing-function:var(--ease-site)] group-hover:scale-[1.05]" />
            </div>
            <span className="t-heading hd-24 text-black">{c.name}</span>
            <span className="t-body b-14 text-black/60">{c.body}</span>
          </Link>))}
      </div>
    </section>
  );
}
