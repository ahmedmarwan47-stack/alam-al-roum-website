import SectionTitle from "./SectionTitle";
import MasterplanMap from "./MasterplanMap";
import { masterplan } from "@/lib/content";
import { communities } from "@/lib/communities";
import { cityPlaces, fullPlan } from "@/lib/masterplan";

const hrefFor = (title: string) => {
  const c = communities.find((x) => x.name.toLowerCase().startsWith(title.toLowerCase().split(" ")[0]));
  return c ? `/communities/${c.slug}` : "/communities";
};

/**
 * The whole Alam Al Roum masterplan with Interactive-Hotspots pins: hover shows the name, click opens the card.
 * Home: the communities. About (`places`): the client's USP board — twelve numbered highlights and the seven gates,
 * at the board's positions projected onto the render (lib/masterplan.ts, cityPlaces).
 */
export default function Masterplan({ places = false }: { places?: boolean }) {
  const pins = places ? cityPlaces : masterplan.pins.map((p) => ({ ...p, href: hrefFor(p.title) }));
  return (
    <section className="flex flex-col gap-10 bg-limestone-50 pt-20">
      <SectionTitle tag={masterplan.tag} title={masterplan.title} body={masterplan.body} bodyWidth={704} className="container-x" />
      <MasterplanMap image={fullPlan.src} pins={pins} initial={places ? -1 : 0} phoneScale={places ? 1.8 : 1} />
    </section>
  );
}
