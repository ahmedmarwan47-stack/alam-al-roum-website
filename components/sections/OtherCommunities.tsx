import SectionTitle from "./SectionTitle";
import MasterplanMap from "./MasterplanMap";
import { CommunityGrid } from "./CommunitiesExplorer";
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

/** Other communities (Figma 11128:16022): the Communities grid, with the current community hidden. */
export default function OtherCommunities({ exclude }: { exclude: string }) {
  return (
    <section className="flex flex-col items-center gap-10 bg-white py-20 container-x">
      <SectionTitle tag="Communities" title="More communities" body="Each district has its own character. All share the sea." />
      <CommunityGrid items={communities.filter((c) => c.slug !== exclude)} />
    </section>
  );
}
