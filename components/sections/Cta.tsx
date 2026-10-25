import Button from "@/components/ui/Button";
import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";
import { cta as C } from "@/lib/content";

/** Live Greatness: the portal film fades to white; left-aligned copy (Figma CTA · 720 px, fixed). */
export default function Cta() {
  return (
    <section className="relative h-[720px] overflow-hidden bg-limestone-50">
      <RevealImage src={C.video} video className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 opacity-35" style={{ background: "radial-gradient(ellipse at center, transparent 30%, #FBFAF8 85%)" }} />
      <div className="relative flex h-full flex-col justify-center gap-10 container-x">
        <div className="flex max-w-[768px] flex-col gap-6">
          <RevealText as="h2" segs={C.title} className="t-heading hd-48" />
          <RevealText text={C.body} className="t-body b-20 max-w-[420px] text-limestone-800" delay={0.1} />
        </div>
        <div><Button label={C.cta} size={64} variant="light" /></div>
      </div>
    </section>
  );
}
