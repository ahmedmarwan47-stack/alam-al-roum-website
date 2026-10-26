import Button from "@/components/ui/Button";
import RevealText from "@/components/reveal/RevealText";
import { waterStrategy as W } from "@/lib/destination";

/**
 * Environment · Water strategy (Figma 10999:13971): one viewport tall; the shore loop fills it and the content
 * column (776 wide) sits top-right, 80 px from the top: Environment / A CITY SHAPED BY *Water* / body (16 · 16),
 * then 40 px down the six facts (two 376 columns, 24 apart, each a Limestone 300 hairline, 24 px padding,
 * Heading/24 over Body/16, 12 apart), then 40 px down the 54 px outline button. A 166 px Deep Sea fade closes it.
 */
export default function WaterStrategy() {
  return (
    <section className="relative overflow-hidden bg-limestone-50">
      <video className="absolute inset-0 h-full w-full object-cover object-left" src={W.video} poster={W.poster} autoPlay muted loop playsInline aria-hidden />
      <div className="relative flex justify-end px-[var(--gutter)] pb-[166px] pt-20 lg:h-svh lg:min-h-[760px]">
        <div className="flex w-full max-w-[776px] flex-col items-start gap-10 rounded-2xl bg-limestone-500/85 p-6 text-deepsea-500 backdrop-blur-sm lg:rounded-none lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <div className="flex w-full flex-col gap-4">
            <span className="t-label l-16">{W.tag}</span>
            <RevealText as="h2" segs={W.title} className="t-heading hd-56" delay={0.05} />
            <p className="t-body b-18 text-limestone-800">{W.body}</p>
          </div>
          <div className="grid w-full gap-x-6 sm:grid-cols-2">
            {W.facts.map(([h, b]) => (
              <div key={h} className="flex flex-col gap-3 border-t border-limestone-300 py-6">
                <span className="t-heading hd-24">{h}</span>
                <span className="t-body b-16 text-limestone-800">{b}</span>
              </div>))}
          </div>
          <Button label={W.cta} href={W.href} size={54} variant="outline" />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[166px] bg-gradient-to-t from-[#043447] to-[rgb(4_52_71/0)]" />
    </section>
  );
}
