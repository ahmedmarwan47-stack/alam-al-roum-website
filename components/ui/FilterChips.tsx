"use client";

/**
 * Figma Filter Chip (10401:3300): pill chips, the active one filled #121212. Used by Careers and the FAQ page.
 * Below lg the chips stay on one row that scrolls sideways out to the screen edges (no scrollbar; the first and last
 * chips line up with the gutter) instead of wrapping into several rows. A centred row (`justify-center`) stays centred
 * while it fits and starts at the gutter once it overflows (auto margins, so no chip is ever cut off on the left).
 */
export default function FilterChips({ options, value, onChange, className = "" }:
  { options: readonly string[]; value: string; onChange: (v: string) => void; className?: string }) {
  const centred = /\bjustify-center\b/.test(className);
  return (
    <div role="tablist" className={`flex flex-wrap gap-3 ${className} max-lg:-mx-[var(--gutter)] max-lg:flex-nowrap max-lg:justify-start max-lg:overflow-x-auto max-lg:overscroll-x-contain max-lg:px-[var(--gutter)] max-lg:scroll-px-[var(--gutter)] max-lg:snap-x max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden ${centred ? "max-lg:[&>button:first-child]:ml-auto max-lg:[&>button:last-child]:mr-auto" : ""}`}>
      {options.map((x) => (
        <button key={x} role="tab" aria-selected={value === x} onClick={() => onChange(x)}
          className={`rounded-full border px-5 py-[10px] t-label l-14 transition-colors duration-300 max-lg:flex-none max-lg:snap-start max-lg:whitespace-nowrap ${value === x ? "border-[#121212] bg-[#121212] text-white" : "border-black/20 text-[#121212] hover:border-black/50"}`}>{x}</button>))}
    </div>
  );
}
