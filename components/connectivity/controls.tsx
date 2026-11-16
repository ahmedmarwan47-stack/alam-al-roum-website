import { GLASS } from "./shared";

/** Zoom in, zoom out and back to the route (or the opening view): light glass, top right of the map. */
export default function ZoomControls({ onIn, onOut, onReset }: { onIn: () => void; onOut: () => void; onReset: () => void }) {
  const btn = "grid h-10 w-10 place-items-center transition-colors hover:bg-white/60";
  return (
    <div className={`absolute right-4 top-4 flex flex-col overflow-hidden rounded-lg text-deepsea-500 md:right-6 md:top-6 ${GLASS}`}
      onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
      <button aria-label="Zoom in" onClick={onIn} className={btn}>
        <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M7 1.5v11M1.5 7h11" /></svg>
      </button>
      <button aria-label="Zoom out" onClick={onOut} className={`${btn} border-t border-deepsea-500/10`}>
        <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1.5 7h11" /></svg>
      </button>
      <button aria-label="Reset the view" onClick={onReset} className={`${btn} border-t border-deepsea-500/10`}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="5.5" /><circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none" /><path d="M8 0.5v2.5M8 13v2.5M0.5 8H3M13 8h2.5" /></svg>
      </button>
    </div>
  );
}
