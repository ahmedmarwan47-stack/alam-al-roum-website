import { notFound } from "next/navigation";
import Navbar from "@/components/sections/Navbar";
import Button from "@/components/ui/Button";
import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";
import SectionTitle from "@/components/sections/SectionTitle";
import { StoryCard } from "@/components/sections/Cards";
import ShareRow from "@/components/media/ShareRow";
import ArticleBody from "@/components/media/ArticleBody";
import Cta from "@/components/sections/Cta";
import Footer from "@/components/sections/Footer";
import { articleFor, related, stories } from "@/lib/listings";

export const dynamicParams = false;
export const generateStaticParams = () => stories.map((s) => ({ slug: s.slug! }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const a = articleFor((await params).slug);
  return { title: a ? `${a.title} — Alam Al Roum` : "Alam Al Roum", description: a?.sub || undefined };
}

/** Article detail (Figma "Article Detail • Desktop"): header, 1392×640 hero, reading column, then Related Articles. */
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const a = articleFor((await params).slug);
  if (!a) notFound();
  return (
    <main>
      <Navbar />
      <header className="mx-auto mt-[76px] flex max-w-[768px] flex-col items-center gap-6 px-[var(--gutter)] pt-[60px] pb-10 text-center lg:px-0">
        <span className="flex items-center gap-3 t-label l-14 text-black/70"><span>{a.tag}</span><i className="h-[14px] w-px bg-black/30" /><span>{a.date}</span></span>
        <RevealText as="h1" text={a.title} onLoad delay={0.15} className="t-heading hd-48 text-deepsea-500" />
        {a.sub && <RevealText text={a.sub} onLoad delay={0.3} className="t-body b-18 text-limestone-800" />}
        <div className="flex w-full flex-wrap items-center justify-between gap-4 pt-2 text-left">
          <div className="flex flex-col"><span className="t-label l-14 text-black">{a.byline[0]}</span>{a.byline[1] && <span className="t-text x-12 text-black/60">{a.byline[1]}</span>}</div>
          <ShareRow title={a.title} />
        </div>
      </header>
      <div className="container-x">
        {/* phones: a 4:3 crop, as the 1392 × 640 banner would be a thin strip there */}
        <div className="aspect-[4/3] overflow-hidden sm:aspect-[1392/640]"><RevealImage src={a.hero} alt={a.title} onLoad className="h-full w-full" /></div>
      </div>
      <section className="px-[var(--gutter)] py-[60px]">
        {a.body.length ? <ArticleBody a={a} /> : <p className="mx-auto max-w-[768px] t-body b-18 text-limestone-800">The full story will be published here soon.</p>}
      </section>
      {/* Related Articles (Figma 10921:10181): Keep Reading on Limestone, three story cards, View All */}
      <section className="flex flex-col items-center gap-10 bg-limestone-50 py-20 container-x">
        <SectionTitle title={related.title} body={related.body} />
        <div className="grid w-full gap-6 sm:grid-cols-2 md:grid-cols-3">
          {[...related.items, ...stories].filter((s, k, all) => s.slug !== a.slug && all.findIndex((x) => x.slug === s.slug) === k).slice(0, 3)
            .map((c, k) => <StoryCard key={c.slug} {...c} delay={k * 0.08} />)}
        </div>
        <Button label={related.cta} href="/media-center" variant="outline" />
      </section>
      <Cta />
      <Footer />
    </main>
  );
}
