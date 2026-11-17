import Button from "@/components/ui/Button";
import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";
import RegisterForm from "./RegisterForm";
import { cta as C } from "@/lib/content";

/**
 * CTA / Live Greatness (Figma 10921:12607): the portal on the beach, a still photo (17 Nov: Figma's own, clearer and
 * less washed than the film frame it replaces, with the sky cut out so the gate stands against the page; the white vignette and the white fade at its foot are off, as in Figma); left-aligned copy
 * (Live 80 / Greatness 76 italic), 720 px. Neighbourhood pages pass `form` (Figma 11128:16156): a full-bleed photo
 * (the brand's children on the shore, extended to 16:9 so they run clear of the panel) with the Register Interest
 * panel in place of the copy and no vignette; from lg the section is one screen tall and the panel's spacing follows
 * the screen height, so the whole form fits the viewport (80 px above and below at 1512 × 982).
 * Below lg (9 Nov) the photo is a band of its own on top (the children in view) and the card rises 64 px over its
 * lower edge, rather than a full-height card leaving the photo as a thin frame around it.
 */
export default function Cta({ form }: { form?: string }) {
  return (
    <section className={`relative overflow-hidden bg-limestone-50 ${form ? "pb-12 lg:flex lg:h-svh lg:min-h-[680px] lg:items-center lg:py-20" : "h-[720px] max-lg:h-auto"}`}>
      {/* below lg the photo sits on top, the gate in the middle of the frame with both pillars whole, and melts into
          the Limestone under the copy, so photo and copy read as one block as on desktop, where the copy sits on it */}
      <div className={`absolute inset-0 ${form ? "max-lg:relative max-lg:h-[min(100vw,480px)]" : "max-lg:relative max-lg:h-[min(125vw,560px)]"}`}>
        {/* with the form: a still photo (29 Oct review), so nothing moves beside the fields; on a phone the children
            stay in frame (the photo is held to its right) */}
        {form
          ? <RevealImage src={C.still} blur className="absolute inset-0" imgClassName="object-[72%_50%] lg:object-center" />
          : <>
            {/* phones: a crop of their own (17 Nov), 4:5 like the band and centred on the gate and the woman, so the photo
                is sharp instead of a small slice of the wide one enlarged; tablets keep the wide photo, centred on the gate */}
            <RevealImage src={C.photoPhone} blur className="absolute inset-0 sm:hidden" />
            <RevealImage src={C.photo} blur className="absolute inset-0 max-sm:hidden" imgClassName="max-lg:object-[64%_50%]" />
          </>}
        {!form && <>
          {/* no fade at the top now the sky is cut out; a short one at the foot, under the copy, that leaves the woman clear (on
              phones the copy starts just under her feet) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%] max-sm:h-[12%] bg-gradient-to-b from-limestone-50/0 via-limestone-50/70 via-60% to-limestone-50 lg:hidden" />
        </>}
      </div>
      {form ? <div className="relative w-full container-x max-lg:-mt-16"><RegisterForm about={form} /></div> : (
        <div className="relative flex h-full flex-col justify-center gap-10 container-x max-lg:-mt-24 max-sm:-mt-4 max-lg:gap-8 max-lg:pb-8">
          <div className="flex max-w-[768px] flex-col gap-6">
            <RevealText as="h2" segs={C.title} className="t-heading hd-80 [&_.t-accent]:[font-size:round(nearest,.95em,4px)]" />
            <RevealText text={C.body} className="t-body b-20 max-w-[420px] text-limestone-800" delay={0.1} />
          </div>
          <div><Button label={C.cta} href="/contact" size={64} variant="primary" className="btn-on-pale" /></div>
        </div>)}
    </section>
  );
}
