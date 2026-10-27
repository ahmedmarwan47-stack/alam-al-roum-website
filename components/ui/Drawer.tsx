"use client";
import { useEffect, useRef, type ReactNode, type TouchEvent } from "react";
import Icon from "./Icon";

/**
 * The Figma Drawer (10480:3695): docked right over a dimmed page, 560 wide, sliding in on the site ease. Below lg it
 * is a bottom sheet instead: it rises from the foot of the screen with rounded top corners and a drag handle, at most
 * 88 % of the screen tall and scrolling inside itself. Escape, the backdrop and the close button dismiss it, and on
 * the sheet so does a swipe down (from the handle, or anywhere once its content is scrolled to the top); the page
 * behind stays still while it is open. `children` is the body under the close button, `footer` the actions at the
 * bottom; callers keep the last item's content mounted so it slides out with the panel. `onClose` should be stable.
 */
export default function Drawer({ open, onClose, label, children, footer }:
  { open: boolean; onClose: () => void; label?: string; children?: ReactNode; footer?: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    document.documentElement.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", esc); document.documentElement.style.overflow = ""; };
  }, [open, onClose]);

  // swipe down to dismiss (bottom sheet only): the sheet follows the finger, then closes past 90 px or a quick flick
  const panel = useRef<HTMLElement>(null), drag = useRef<{ y: number; t: number; dy: number } | null>(null);
  const sheet = () => window.matchMedia("(width < 64rem)").matches;
  const start = (e: TouchEvent, handle = false) => {
    const el = panel.current; if (!el || !sheet() || (!handle && el.scrollTop > 0)) return;
    drag.current = { y: e.touches[0].clientY, t: performance.now(), dy: 0 };
  };
  const move = (e: TouchEvent) => {
    const d = drag.current, el = panel.current; if (!d || !el) return;
    d.dy = Math.max(0, e.touches[0].clientY - d.y);
    if (d.dy > 0) { el.style.transition = "none"; el.style.translate = `0 ${d.dy}px`; }
  };
  const end = () => {
    const d = drag.current, el = panel.current; drag.current = null; if (!d || !el) return;
    el.style.transition = ""; el.style.translate = "";
    if (d.dy > 90 || (d.dy > 30 && d.dy / (performance.now() - d.t) > 0.5)) onClose();
  };

  return (
    <div className={`fixed inset-0 z-[60] transition-[visibility] ${open ? "visible" : "invisible delay-500"}`} aria-hidden={!open}>
      <button aria-label="Close" tabIndex={-1} onClick={onClose} className={`absolute inset-0 bg-deepsea-950/50 transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`} />
      <aside ref={panel} role="dialog" aria-modal="true" aria-label={label} data-lenis-prevent
        onTouchStart={(e) => start(e)} onTouchMove={move} onTouchEnd={end} onTouchCancel={end}
        className={`absolute inset-y-0 right-0 flex w-full max-w-[560px] flex-col justify-between gap-10 overflow-y-auto bg-limestone-50 p-5 transition-transform duration-500 [transition-timing-function:var(--ease-site)] sm:p-7 ${open ? "translate-x-0" : "translate-x-full"}
          max-lg:top-auto max-lg:bottom-0 max-lg:overscroll-contain max-lg:max-h-[88svh] max-lg:max-w-none max-lg:justify-start max-lg:gap-8 max-lg:rounded-t-2xl max-lg:pt-0 ${footer ? "max-lg:pb-0" : ""} max-lg:translate-x-0 ${open ? "max-lg:translate-y-0" : "max-lg:translate-y-full"}`}>
        <div className="flex flex-col gap-6">
          {/* sheet: the drag handle, and the close button beside it as a 44 px target */}
          <div onTouchStart={(e) => { e.stopPropagation(); start(e, true); }}
            className="sticky top-0 z-10 -mx-5 flex h-14 flex-none items-center justify-end bg-limestone-50 px-2 sm:-mx-7 sm:px-4 lg:hidden">
            <span aria-hidden className="absolute left-1/2 top-2.5 h-1 w-10 -translate-x-1/2 rounded-full bg-deepsea-500/25" />
            <button onClick={onClose} className="grid size-11 place-items-center text-deepsea-500" aria-label="Close drawer"><Icon name="cancel-01" size={24} /></button>
          </div>
          <button onClick={onClose} className="self-start text-deepsea-500 max-lg:hidden" aria-label="Close drawer"><Icon name="cancel-01" size={24} /></button>
          {children}
        </div>
        {/* sheet: the actions stay in view at the foot while the body scrolls under them */}
        {footer && <div className="max-lg:sticky max-lg:bottom-0 max-lg:-mx-5 max-lg:border-t max-lg:border-deepsea-500/10 max-lg:bg-limestone-50 max-lg:px-5 max-lg:pb-[max(20px,env(safe-area-inset-bottom))] max-lg:pt-4 sm:max-lg:-mx-7 sm:max-lg:px-7">{footer}</div>}
      </aside>
    </div>
  );
}
