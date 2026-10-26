import { gsap } from "@/lib/gsap";

/**
 * The ERA Residence letter reveal (the reference behind the Motion Studies): each character comes up from a pale,
 * softly blurred ghost to full ink, one after another from left to right, so a headline "writes" itself in.
 */

/** Wraps every character of `el`'s text in a span (spaces stay text, words never break). Idempotent. */
export function splitChars(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split) return Array.from(el.querySelectorAll<HTMLElement>("[data-ch]"));
  el.dataset.split = "1";
  const walk = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        for (const word of (child.textContent ?? "").split(/(\s+)/)) {
          if (!word) continue;
          if (/^\s+$/.test(word)) { frag.append(word); continue; }
          const w = document.createElement("span");
          w.style.display = "inline-block"; w.style.whiteSpace = "nowrap";
          for (const c of word) {
            const s = document.createElement("span");
            s.dataset.ch = ""; s.style.display = "inline-block"; s.textContent = c;
            w.append(s);
          }
          frag.append(w);
        }
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) walk(child);
    }
  };
  walk(el);
  return Array.from(el.querySelectorAll<HTMLElement>("[data-ch]"));
}

/** Ghost state of a letter before it is written in. */
export const LETTER_FROM = { opacity: 0.08, filter: "blur(6px)" };
export const LETTER_TO = { opacity: 1, filter: "blur(0px)" };

/** A timeline-ready tween writing `chars` in, left to right. `each` is the gap between letters (s). */
export const writeIn = (chars: HTMLElement[], each = 0.035, duration = 0.6) =>
  gsap.fromTo(chars, LETTER_FROM, { ...LETTER_TO, duration, ease: "power2.out", stagger: each });
