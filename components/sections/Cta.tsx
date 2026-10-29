import Button from "@/components/ui/Button";
import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";
import RegisterForm from "./RegisterForm";
import { cta as C } from "@/lib/content";

/**
 * CTA / Live Greatness (Figma 10921:12607): the portal film under a white radial vignette; left-aligned copy
 * (Live 80 / Greatness 76 italic), 720 px. Neighbourhood pages pass `form` (Figma 11128:16156): a full-bleed photo
 * (the brand's children on the shore, extended to 16:9 so they run clear of the panel) with the Register Interest
 * panel in place of the copy and no vignette; from lg the section is one screen tall and the panel's spacing follows
 * the screen height, so the whole form fits the viewport (80 px above and below at 1512 × 982).
 */
export default function Cta({ form }: { form?: string }) {
  return (
    <section className={`relative overflow-hidden bg-limestone-50 ${form ? "py-20 lg:flex lg:h-svh lg:min-h-[680px] lg:items-center lg:py-[clamp(24px,6svh,80px)]" : "h-[720px] max-lg:h-auto"}`}>
      {/* below lg the film sits on top, framed on the portal, and melts into the Limestone under the copy (a soft fade
          in, a longer one out), so film and copy read as one block as on desktop, where the copy sits on the film */}
      <div className={`absolute inset-0 ${form ? "" : "max-lg:relative max-lg:h-[min(125vw,560px)]"}`}>
        {/* with the form: a still photo (29 Oct review), so nothing moves beside the fields; on a phone the children
            stay in frame (the photo is held to its right) */}
        {form
          ? <RevealImage src={C.still} blur className="absolute inset-0" imgClassName="object-[72%_50%] lg:object-center" />
          : <RevealImage src={C.video} video blur className="absolute inset-0" imgClassName="max-lg:object-[68%_50%]" />}
        {!form && <>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[16%] bg-gradient-to-b from-limestone-50/80 to-limestone-50/0 lg:hidden" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-b from-limestone-50/0 via-limestone-50/70 via-60% to-limestone-50 lg:hidden" />
        </>}
      </div>
      {/* Figma "White vignette": 60 % of a radial fade to Limestone 50 (0 → 5 % at half → 80 % → solid) */}
      <div className={`pointer-events-none absolute inset-0 opacity-60 ${form ? "hidden" : "max-lg:hidden"}`}
        style={{ background: "radial-gradient(farthest-side, rgb(251 250 248 / 0) 0%, rgb(251 250 248 / .05) 50%, rgb(251 250 248 / .8) 75%, #FBFAF8 90%)" }} />
      {/* desktop: the film's foot melts into the Limestone the footer starts on, so there is no seam between the two */}
      {!form && <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[22%] bg-gradient-to-b from-limestone-50/0 to-limestone-50 lg:block" />}
      {form ? <div className="relative w-full container-x"><RegisterForm about={form} /></div> : (
        <div className="relative flex h-full flex-col justify-center gap-10 container-x max-lg:-mt-24 max-lg:gap-8 max-lg:pb-8">
          <div className="flex max-w-[768px] flex-col gap-6">
            <RevealText as="h2" segs={C.title} className="t-heading hd-80 normal-case! [&_.t-accent]:text-[.95em]" />
            <RevealText text={C.body} className="t-body b-20 max-w-[420px] text-limestone-800" delay={0.1} />
          </div>
          <div><Button label={C.cta} href="/contact" size={64} variant="primary" /></div>
        </div>)}
    </section>
  );
}
