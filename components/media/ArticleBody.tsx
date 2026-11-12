import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";
import type { Article } from "@/lib/listings";

/** Article and event body (Figma 10921:10164): a 768 px reading column of titles, paragraphs and 16:9 pictures, nothing else. */
export default function ArticleBody({ a }: { a: Article }) {
  return (
    <div className="mx-auto flex w-full max-w-[768px] flex-col gap-6 text-black">
      {a.body.map((b, k) =>
        b.img ? <div key={k} className="aspect-[768/432] overflow-hidden"><RevealImage src={b.img} alt={b.caption ?? ""} className="h-full w-full" /></div>
        : b.h ? <RevealText key={k} as="h2" text={b.h} className="t-heading hd-32 pt-2" />
        : <p key={k} className="t-body b-18">{b.p}</p>)}
    </div>
  );
}
