import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";
import type { Article } from "@/lib/listings";

/** Article body (Figma 10921:10164): a 768 px reading column with the key-takeaways panel, headings, lists and 16:9 images. */
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
            <div className="aspect-[768/432] overflow-hidden"><RevealImage src={b.img} alt="" className="h-full w-full" /></div>
            {b.caption && <figcaption className="t-text x-12 text-black/50">{b.caption}</figcaption>}
          </figure>
        ) : b.h ? <RevealText key={k} as="h2" text={b.h} className="t-heading hd-32 pt-2" />
        : b.list ? <ul key={k} className="t-body b-18">{b.list.map((l) => <li key={l}>• {l}</li>)}</ul>
        : <p key={k} className="t-body b-18">{b.p}</p>)}
    </div>
  );
}
