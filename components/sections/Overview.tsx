import RevealText from "@/components/reveal/RevealText";
import type { Seg } from "@/components/reveal/RevealText";

export type OverviewData = { tag: string; title: string | Seg[]; body: string; facts?: [string, string][] };

/**
 * Overview (Sustainability, single experience, single community): a standalone section, about two thirds to three
 * quarters of the viewport on desktop. The tag sits right over the title (no hairline, 28 Oct review), set large as the
 * page's statement (7 of 12 columns); the paragraph starts beside it on the tag's line, and the key facts end the section as a row of
 * figures over hairlines.
 */
export default function Overview({ data: O }: { data: OverviewData }) {
  const facts = O.facts ?? [];
  return (
    <section className="flex flex-col justify-center bg-white py-20 container-x lg:min-h-[70svh] lg:py-24">
      <div className="grid gap-x-6 gap-y-8 lg:grid-cols-12 lg:items-start">
        <div className="flex flex-col gap-4 lg:col-span-7">
          <RevealText text={O.tag} className="t-label l-16" />
          <RevealText as="h2" {...(typeof O.title === "string" ? { text: O.title } : { segs: O.title })}
            className="t-heading hd-56l wrap-balance" delay={0.05} />
        </div>
        <RevealText text={O.body} className="t-body b-20 max-w-[560px] text-limestone-800 lg:col-span-4 lg:col-start-9" delay={0.12} />
      </div>
      {facts.length > 0 && (
        <div className={`grid grid-cols-2 gap-x-6 pt-12 lg:pt-20 ${facts.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {facts.map(([v, l], k) => (
            // below lg the facts run two by two: rules only between the rows; from lg one row, each fact under its cap
            <div key={l} className="flex flex-col gap-2 border-t border-limestone-300 pb-2 pt-5 max-lg:[&:nth-child(-n+2)]:border-t-0 max-lg:[&:nth-child(-n+2)]:pt-0">
              <RevealText text={v} className="t-heading hd-32" delay={0.18 + k * 0.05} />
              <RevealText text={l} className="t-body b-16 text-limestone-800" delay={0.24 + k * 0.05} />
            </div>))}
        </div>)}
    </section>
  );
}
