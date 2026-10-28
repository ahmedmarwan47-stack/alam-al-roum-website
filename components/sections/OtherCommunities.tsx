import SectionTitle from "./SectionTitle";
import MasterplanMap from "./MasterplanMap";
import { CommunityGrid } from "./CommunitiesExplorer";
import { communities } from "@/lib/communities";
import { districtPins, planViews } from "@/lib/masterplan";

/**
 * "<Name> on the masterplan" (Figma 10921:9835): the community's own masterplan, a crop of the master around the
 * district (scripts/masterplan-crops.py) with pins for the places inside it, named on the map.
 */
export function CommunityOnMasterplan({ slug, title, body }: { slug: string; title: string; body: string }) {
  const view = planViews[slug] ?? planViews.communities;
  return (
    <section className="flex flex-col gap-10 bg-white pt-20">
      <SectionTitle tag="Masterplan" title={title} body={body} className="container-x" />
      <MasterplanMap image={view.src} view={view} pins={districtPins[slug] ?? []} initial={-1} labels />
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
