import Button from "@/components/ui/Button";
import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";
import SectionTitle from "./SectionTitle";
import { news as N } from "@/lib/content";

function Card({ item, big, delay }: { item: (typeof N.items)[number]; big?: boolean; delay: number }) {
  return (
    <a href="#" className="group flex flex-col">
      <RevealImage src={item.photo} delay={delay} className={big ? "aspect-[684/456] w-full" : "aspect-[330/220] w-full"} imgClassName="transition-transform duration-[1.2s] [transition-timing-function:var(--ease-site)] group-hover:scale-105" />
      <span className="flex items-center gap-2 bg-deepsea-500 px-3 py-2 t-label l-14 text-limestone-50"><span>{item.tag}</span><i className="h-3 w-px bg-limestone-50/40" /><span>{item.read}</span></span>
      <RevealText text={item.title} className={`pt-4 t-text ${big ? "x-28" : "x-20"}`} delay={delay + 0.1} />
    </a>
  );
}

export default function News() {
  return (
    <section className="flex flex-col items-center gap-10 bg-limestone-200 py-20 container-x">
      <SectionTitle tag={N.tag} title={N.title} body={N.body} />
      <div className="grid w-full gap-6 lg:grid-cols-2">
        <Card item={N.items[0]} big delay={0} />
        <div className="grid grid-cols-2 gap-6">{N.items.slice(1).map((it, k) => <Card key={it.title} item={it} delay={0.12 + k * 0.1} />)}</div>
      </div>
      <Button label={N.cta} variant="outline" />
    </section>
  );
}
