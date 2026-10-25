import RevealText from "@/components/reveal/RevealText";
import type { Seg } from "@/components/reveal/RevealText";

export type OverviewData = { tag: string; title: string | Seg[]; body: string; facts?: [string, string][] };

/** Overview · key facts (Sustainability, Marina, Hotels, Neighbourhood): tag, heading, a paragraph and an optional row of facts. */
export default function Overview({ data: O }: { data: OverviewData }) {
  return (
    <section className="flex flex-col gap-12 bg-limestone-50 py-20 container-x">
      <div className="flex max-w-[917px] flex-col gap-4">
        <RevealText text={O.tag} className="t-label l-16" />
        <RevealText as="h2" {...(typeof O.title === "string" ? { text: O.title } : { segs: O.title })} className="t-heading hd-48" delay={0.05} />
        <RevealText text={O.body} className="t-body b-18 text-limestone-800" delay={0.12} />
      </div>
      {O.facts && (
        <div className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
          {O.facts.map(([v, l], k) => (
            <div key={l} className="flex flex-col gap-3 border-t border-limestone-300 py-6">
              <RevealText text={v} className="t-heading hd-32" delay={k * 0.05} />
              <RevealText text={l} className="t-body b-16 text-limestone-800" delay={0.08 + k * 0.05} />
            </div>))}
        </div>)}
    </section>
  );
}
