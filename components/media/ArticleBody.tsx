import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";
import type { Article } from "@/lib/listings";

/**
 * Article body (Figma 10921:10164): a 768 px reading column with the key-takeaways panel, headings, lists and 16:9
 * captioned images. Two callouts beyond the Figma frame: a pull quote (an Immortel italic line on a Deep Sea rule)
 * and a key-figures row (the Overview facts style: hairline, heading-size value, a line of body).
 */
export default function ArticleBody({ a }: { a: Article }) {
  return (
    <div className="mx-auto flex w-full max-w-[768px] flex-col gap-6 text-black">
      {a.takeaways && (
        <div className="flex flex-col gap-3 bg-[#f4f4f4] p-6">
          <span className="t-heading hd-16">{a.takeawaysTitle ?? "Key takeaways"}</span>
          <ul className="flex flex-col gap-2 t-body b-14">{a.takeaways.map((t) => <li key={t}>• {t}</li>)}</ul>
        </div>)}
      {a.body.map((b, k) =>
        b.img ? (
          <figure key={k} className="flex flex-col gap-3">
            <div className="aspect-[768/432] overflow-hidden"><RevealImage src={b.img} alt={b.caption ?? ""} className="h-full w-full" /></div>
            {b.caption && <figcaption className="t-text x-12 text-black/50">{b.caption}</figcaption>}
          </figure>
        ) : b.h ? <RevealText key={k} as="h2" text={b.h} className="t-heading hd-32 pt-2" />
        : b.list ? <ul key={k} className="t-body b-18">{b.list.map((l) => <li key={l}>• {l}</li>)}</ul>
        : b.quote ? (
          <blockquote key={k} className="my-2 flex flex-col gap-3 border-l border-deepsea-500 py-1 pl-6 lg:my-4 lg:pl-8">
            <RevealText text={`“${b.quote}”`} className="t-accent x-28 text-deepsea-500" />
            {b.cite && <span className="t-label l-14 text-limestone-700">{b.cite}</span>}
          </blockquote>
        ) : b.figures ? (
          // phones: one figure per row; from sm, one column per figure
          <div key={k} className="my-2 grid gap-x-6 sm:auto-cols-fr sm:grid-flow-col lg:my-4">
            {b.figures.map(([v, l], j) => (
              // stacked on phones: rules only between the figures; from sm each column keeps its hairline cap
              <div key={l} className="flex flex-col gap-2 border-t border-limestone-300 py-5 max-sm:first:border-t-0 max-sm:first:pt-0">
                <RevealText text={v} className="t-heading hd-32 text-deepsea-500" delay={j * 0.05} />
                <RevealText text={l} className="t-body b-16 text-limestone-800" delay={0.08 + j * 0.05} />
              </div>))}
          </div>
        ) : <p key={k} className="t-body b-18">{b.p}</p>)}
    </div>
  );
}
