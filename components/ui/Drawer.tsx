"use client";
import { useEffect, type ReactNode } from "react";
import Icon from "./Icon";

/**
 * The Figma Drawer (10480:3695): docked right over a dimmed page, 560 wide (the full width on a phone), sliding in
 * on the site ease. Escape, the backdrop and the close button dismiss it, and the page behind stays still while it
 * is open. `children` is the body under the close button, `footer` the actions pinned to the bottom; callers keep
 * the last item's content mounted so it slides out with the panel. `onClose` should be stable (a state setter).
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
  return (
    <div className={`fixed inset-0 z-[60] transition-[visibility] ${open ? "visible" : "invisible delay-500"}`} aria-hidden={!open}>
      <button aria-label="Close" tabIndex={-1} onClick={onClose} className={`absolute inset-0 bg-deepsea-950/50 transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`} />
      <aside role="dialog" aria-modal="true" aria-label={label}
        data-lenis-prevent className={`absolute inset-y-0 right-0 flex w-full max-w-[560px] flex-col justify-between gap-10 overflow-y-auto bg-limestone-50 p-5 transition-transform duration-500 [transition-timing-function:var(--ease-site)] sm:p-7 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col gap-6">
          <button onClick={onClose} className="self-start text-deepsea-500" aria-label="Close drawer"><Icon name="cancel-01" size={24} /></button>
          {children}
        </div>
        {footer}
      </aside>
    </div>
  );
}
