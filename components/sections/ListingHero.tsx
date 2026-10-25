import RevealText from "@/components/reveal/RevealText";

/**
 * Listing hero (Events, Media Center, Careers, FAQ · Figma "Hero", 510 px): a centred Immortel title and
 * intro over the olive-light visual, which fades to white top and bottom inside the image itself.
 */
export default function ListingHero({ title, body }: { title: string; body: string }) {
  return (
    <section className="relative mt-[76px] flex min-h-[420px] items-center justify-center overflow-hidden bg-white px-[var(--gutter)] py-12 lg:h-[510px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/hero-olive.jpg" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
      <div className="relative flex max-w-[768px] flex-col items-center gap-6 text-center text-black">
        <RevealText as="h1" text={title} onLoad delay={0.2} className="t-body capitalize [font-size:clamp(44px,4.5vw,68px)] leading-[0.94]" />
        <RevealText text={body} onLoad delay={0.4} className="t-body b-18 max-w-[576px]" />
      </div>
    </section>
  );
}
