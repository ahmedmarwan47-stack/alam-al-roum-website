import RevealText from "@/components/reveal/RevealText";

/**
 * Listing hero (Events, Media Center, Careers, FAQ · Figma "Hero", 510 px): a centred Immortel title and
 * intro over the olive-light visual, which fades to white top and bottom inside the image itself.
 */
export default function ListingHero({ title, body }: { title: string; body: string }) {
  return (
    // phones: shorter, so the page's first content is not a screen away, and the olive (the right of the visual) behind the copy
    <section className="relative mt-[76px] flex min-h-[340px] items-center justify-center overflow-hidden bg-white px-[var(--gutter)] py-12 md:min-h-[420px] lg:h-[510px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/hero-olive.jpg" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover max-md:object-[85%_50%]" />
      {/* as in Figma, the intro wraps to the one-line title, never narrower than 680 px */}
      <div className="relative flex max-w-[768px] flex-col items-center gap-6 text-center text-black md:w-min md:min-w-[680px] md:max-w-none">
        <RevealText as="h1" text={title} onLoad delay={0.2} className="t-body capitalize d-68 leading-[0.94] md:whitespace-nowrap" />
        <RevealText text={body} onLoad delay={0.4} className="t-body b-18 w-full" />
      </div>
    </section>
  );
}
