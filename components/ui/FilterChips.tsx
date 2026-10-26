"use client";

/** Figma Filter Chip (10401:3300): pill chips, the active one filled #121212. Used by Careers and the FAQ page. */
export default function FilterChips({ options, value, onChange, className = "" }:
  { options: readonly string[]; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <div role="tablist" className={`flex flex-wrap gap-3 ${className}`}>
      {options.map((x) => (
        <button key={x} role="tab" aria-selected={value === x} onClick={() => onChange(x)}
          className={`rounded-full border px-5 py-[10px] t-label l-14 transition-colors duration-300 ${value === x ? "border-[#121212] bg-[#121212] text-white" : "border-black/20 text-[#121212] hover:border-black/50"}`}>{x}</button>))}
    </div>
  );
}
