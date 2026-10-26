import Button from "@/components/ui/Button";
import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";
import { cta as C } from "@/lib/content";

/** CTA / Live Greatness (Figma 10921:12607): the portal film under a white radial vignette; left-aligned copy, 720 px. */
export default function Cta() {
  return (
    <section className="relative h-[720px] overflow-hidden bg-limestone-50">
      <RevealImage src={C.video} video className="absolute inset-0" />
      {/* Figma "White vignette": 60 % of a radial fade to Limestone 50 (0 → 5 % at half → 80 % → solid) */}
      <div className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: "radial-gradient(farthest-side, rgb(251 250 248 / 0) 0%, rgb(251 250 248 / .05) 50%, rgb(251 250 248 / .8) 75%, #FBFAF8 90%)" }} />
      <div className="relative flex h-full flex-col justify-center gap-10 container-x">
        <div className="flex max-w-[768px] flex-col gap-6">
          <RevealText as="h2" segs={C.title} className="t-heading hd-48" />
          <RevealText text={C.body} className="t-body b-20 max-w-[420px] text-limestone-800" delay={0.1} />
        </div>
        <div><Button label={C.cta} href="/contact" size={64} variant="light" /></div>
      </div>
    </section>
  );
}
