"use client";
import { useEffect } from "react";

const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const PHOTO = /\.(webp|jpe?g)(\?|$)/i;

/**
 * Pairs with the photo placeholder in globals.css: marks each photo [data-loaded] once it has loaded, so the pulsing
 * mark behind it goes (it would show through transparent pixels or contain-fit margins). A photo that fails keeps the
 * placeholder pulsing: its src becomes a blank pixel ([data-ph-error]), so no broken-image icon or alt text shows.
 * Watches for photos added later and for src changes (carousels), which bring the placeholder back until they load.
 */
export default function ImagePlaceholders() {
  useEffect(() => {
    const watch = (img: HTMLImageElement) => {
      if (img.dataset.phError !== undefined || !PHOTO.test(img.getAttribute("src") ?? "")) return;
      if (img.complete) {
        if (img.naturalWidth > 0) img.dataset.loaded = ""; else fail(img);
        return;
      }
      delete img.dataset.loaded;
      img.addEventListener("load", () => { img.dataset.loaded = ""; }, { once: true });
      img.addEventListener("error", () => fail(img), { once: true });
    };
    const fail = (img: HTMLImageElement) => {
      img.dataset.phError = "";
      delete img.dataset.loaded;
      img.removeAttribute("srcset");
      img.src = BLANK;
    };
    document.querySelectorAll("img").forEach(watch);
    const mo = new MutationObserver((recs) => {
      for (const r of recs) {
        if (r.type === "attributes") {
          const img = r.target as HTMLImageElement;
          if (img.getAttribute("src") === BLANK) continue;
          delete img.dataset.phError;
          watch(img);
        } else r.addedNodes.forEach((n) => {
          if (n instanceof HTMLImageElement) watch(n);
          else if (n instanceof HTMLElement) n.querySelectorAll("img").forEach(watch);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] });
    return () => mo.disconnect();
  }, []);
  return null;
}
