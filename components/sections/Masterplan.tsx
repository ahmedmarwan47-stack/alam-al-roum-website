import SectionTitle from "./SectionTitle";
import MasterplanMap from "./MasterplanMap";
import { masterplan } from "@/lib/content";
import { communities } from "@/lib/communities";

const hrefFor = (title: string) => {
  const c = communities.find((x) => x.name.toLowerCase().startsWith(title.toLowerCase().split(" ")[0]));
  return c ? `/communities/${c.slug}` : "/communities";
};

/** Aerial masterplan with Interactive-Hotspots pins: hover shows the name, click opens the card. */
export default function Masterplan() {
  return (
    <section className="flex flex-col gap-10 bg-limestone-50 pt-20">
      <SectionTitle tag={masterplan.tag} title={masterplan.title} body={masterplan.body} className="container-x" />
      <MasterplanMap image={masterplan.image} pins={masterplan.pins.map((p) => ({ ...p, href: hrefFor(p.title) }))} />
    </section>
  );
}
