import RevealText from "@/components/reveal/RevealText";

/**
 * Listing hero (Events, Media Center, Careers, FAQ · Figma "Hero", 510 px): a centred Deep Sea title and
 * intro on plain Limestone (the olive-light visual was removed, 12 Nov review).
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
      {/* 12 Nov review: no olive-shadow visual behind the copy, and the title in Deep Sea and the site's heading face
          (Haas, as every other hero), not black Immortel; as in Figma, the block takes the one-line title's width
          (never narrower than 680 px, 880 from lg); the intro runs that full width, so it sets as two even lines (12 Nov review: it was three at 600 px) */}
      <div className="relative flex max-w-[768px] flex-col items-center gap-6 text-center text-deepsea-500 md:w-min md:min-w-[680px] md:max-w-none lg:min-w-[880px]">
        <RevealText as="h1" text={title} onLoad delay={0.2} className="t-heading capitalize hd-56 hero-t md:whitespace-nowrap" />
        <RevealText text={body} onLoad delay={0.4} className="t-body b-18 hero-b wrap-balance w-full max-w-[880px]" />
      </div>
    </section>
  );
}
