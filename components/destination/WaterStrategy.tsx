import Button from "@/components/ui/Button";
import RevealText from "@/components/reveal/RevealText";
import { waterStrategy as W } from "@/lib/destination";

/** Environment · Water strategy (Figma 10999:13971): the shore loop fills the section, copy sits on the sand at the right. */
export default function WaterStrategy() {
  return (
    <section className="relative overflow-hidden bg-limestone-500">
      <video className="absolute inset-0 h-full w-full object-cover object-left" src={W.video} poster={W.poster} autoPlay muted loop playsInline aria-hidden />
      <div className="relative flex justify-end px-[var(--gutter)] pb-[200px] pt-20 lg:min-h-[1100px]">
        <div className="flex w-full max-w-[776px] flex-col gap-10 rounded-2xl bg-limestone-500/85 p-6 backdrop-blur-sm lg:rounded-none lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <div className="flex flex-col gap-4">
            <RevealText text={W.tag} className="t-label l-16" />
            <RevealText as="h2" segs={W.title} className="t-heading hd-56" delay={0.05} />
            <RevealText text={W.body} className="t-body b-18 text-limestone-800" delay={0.12} />
          </div>
          <div className="grid gap-x-6 sm:grid-cols-2">
            {W.facts.map(([h, b], k) => (
              <div key={h} className="flex flex-col gap-3 border-t border-limestone-300 py-6">
                <RevealText text={h} className="t-heading hd-24" delay={k * 0.04} />
                <RevealText text={b} className="t-body b-16 text-limestone-800" delay={0.08 + k * 0.04} />
              </div>))}
          </div>
          <div><Button label={W.cta} href={W.href} size={54} variant="outline" /></div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[166px] bg-gradient-to-t from-[#043447] to-transparent" />
    </section>
  );
}
