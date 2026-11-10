import RevealText from "@/components/reveal/RevealText";
import { srcSet } from "@/lib/img";

/**
 * Listing hero (Events, Media Center, Careers, FAQ · Figma "Hero", 510 px): a centred Immortel title and
 * intro over the olive-light visual, which fades to white top and bottom inside the image itself; the image is
 * multiplied onto the Limestone page colour (9 Nov), so its white edges become Limestone and no seam shows.
 */
export default function ListingHero({ title, body }: { title: string; body: string }) {
  return (
    // phones: shorter, so the page's first content is not a screen away, and the olive (the right of the visual) behind the copy
    // it runs up under the glass bar (the visual's white top shows through it); the copy is centred below the bar
    // 10 Nov review ("too much space" under the FAQ intro): the hero ends just under its copy (32 / 40 / 48 px), so the gap to
    // the first content is that plus the next section's top padding (128 px on desktop, 108 on Events and Media) instead
    // of ~240 px; the space above the copy steps up with the screen. The visual now ends at the copy, so it fades out over
    // its lower half (a mask), leaving no edge where the next section starts
    <section data-hero className="relative flex items-center justify-center overflow-hidden bg-limestone-50 px-[var(--gutter)] pb-8 pt-[132px] md:pb-10 md:pt-[156px] lg:pb-12 lg:pt-[180px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/hero-olive.webp" srcSet={srcSet("/images/hero-olive.webp")} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover mix-blend-multiply [mask-image:linear-gradient(to_bottom,#000_45%,transparent)] max-md:object-[85%_50%]" />
      {/* as in Figma, the block takes the one-line title's width (never narrower than 680 px); the intro keeps a
          reading measure inside it (600 px, two even lines) */}
      <div className="relative flex max-w-[768px] flex-col items-center gap-6 text-center text-black md:w-min md:min-w-[680px] md:max-w-none">
        <RevealText as="h1" text={title} onLoad delay={0.2} className="t-serif capitalize d-68 [line-height:round(nearest,0.94em,4px)] hero-t md:whitespace-nowrap" />
        <RevealText text={body} onLoad delay={0.4} className="t-body b-18 hero-b wrap-balance w-full max-w-[600px]" />
      </div>
    </section>
  );
}
