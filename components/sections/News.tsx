import Button from "@/components/ui/Button";
import { StoryCard } from "./Cards";
import SectionTitle from "./SectionTitle";
import { news as N } from "@/lib/content";

const card = (it: (typeof N.items)[number]) => ({ tag: it.tag, meta: it.read, title: it.title, photo: it.photo, href: it.href });

export default function News() {
  return (
    <section className="flex flex-col items-center gap-10 bg-limestone-200 py-20 container-x">
      <SectionTitle tag={N.tag} title={N.title} body={N.body} />
      <div className="grid w-full gap-6 lg:grid-cols-2">
        <StoryCard {...card(N.items[0])} big ratio="aspect-[684/456]" />
        <div className="grid grid-cols-2 gap-6">{N.items.slice(1).map((it, k) => <StoryCard key={it.title} {...card(it)} ratio="aspect-[330/220]" delay={0.12 + k * 0.1} />)}</div>
      </div>
      <Button label={N.cta} href="/media-center" variant="outline" />
    </section>
  );
}
