"use client";
import { useEffect } from "react";

const NBSP = " ";
const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT", "SELECT", "OPTION", "CODE", "PRE"]);

/** The box a run of text lays out in: the nearest ancestor (or itself) that is not inline. */
const blockOf = (el: Element): Element => {
  let e: Element | null = el;
  while (e && e !== document.body) {
    const d = getComputedStyle(e).display;
    if (d !== "inline" && d !== "contents") return e;
    e = e.parentElement;
  }
  return document.body;
};

/**
 * Ties a block's last two words with a no-break space, so its last line never holds one word alone. Walks the
 * block's text backwards to the last space before its final word (which may sit in another text node, e.g. an
 * italic accent span) and swaps it for a no-break space. The tie is kept only while the tied words still fit the
 * block's box: if joining them would push past it (a large heading in a narrow column, e.g. "A landmark restored"
 * at 80 px in 600 px, where it left "A" alone and ran "Landmark Restored" off the column), the space goes back.
 * Re-checked on resize. Idempotent.
 */
const tie = (block: Element) => {
  const texts: Text[] = [];
  const walk = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.parentElement && (SKIP.has(n.parentElement.tagName) || n.parentElement.closest("svg")) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  // only the text laid out in this block's own lines (a nested block is tied on its own)
  for (let n = walk.nextNode(); n; n = walk.nextNode()) if (blockOf((n as Text).parentElement!) === block) texts.push(n as Text);
  const all = texts.map((t) => t.data).join("");
  const words = (all.trim().match(/[^\s\u00a0]+/g) ?? []).length;
  if (words < 2) return;
  // already handled: tied by us, or found not to fit (a resize clears both and starts again)
  if (block.hasAttribute("data-tie2") || block.hasAttribute("data-tie2-off")) return;
  let seenWord = false;
  for (let k = texts.length - 1; k >= 0; k--) {
    const t = texts[k], s = t.data;
    for (let i = s.length - 1; i >= 0; i--) {
      const c = s[i];
      if (c === NBSP) { if (seenWord) return; continue; }     // already tied (or a deliberate no-break space)
      if (/\s/.test(c)) {
        if (!seenWord) continue;                                // trailing space after the last word
        // keep the words together only if they fit: undo the tie when it is what pushed the block wider than its box
        // (a block not laid out yet, or one that already overflows for other reasons, e.g. a scaled rail, keeps it)
        const before = block.scrollWidth;
        t.data = s.slice(0, i) + NBSP + s.slice(i + 1);
        const after = block.scrollWidth;
        if (block.clientWidth > 0 && after > Math.max(before, block.clientWidth) + 1) { block.setAttribute("data-tie2-off", ""); t.data = s; }
        else block.setAttribute("data-tie2", "");
        return;
      }
      seenWord = true;
    }
  }
};

/**
 * Site-wide no-orphans rule (owner, 9 Nov: never a single word on a block's last line). CSS `text-wrap: pretty` on
 * body does most of it where browsers support it; this pass makes it hold everywhere (Firefox, and the cases Chrome's
 * pretty skips). It runs after hydration, then again on any change to the page (navigation, accordions, sheets),
 * touching only the text nodes it needs to. Text is unchanged apart from that one space.
 */
export default function NoOrphans() {
  useEffect(() => {
    const run = (root: ParentNode) => {
      const blocks = new Set<Element>();
      const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (let n = walk.nextNode(); n; n = walk.nextNode()) {
        const p = n.parentElement;
        if (!p || !n.textContent?.trim() || SKIP.has(p.tagName) || p.closest("svg")) continue;
        // a late-loading (Suspense) part is left alone until it has hydrated: editing its server HTML before React
        // adopts it makes React throw a hydration mismatch and re-render it on the client
        if (p.closest("[data-hydrate-late]:not([data-hydrated])")) continue;
        blocks.add(blockOf(p));
      }
      blocks.forEach(tie);
    };
    run(document.body);
    let queued = false;
    const pending = new Set<Node>();
    const mo = new MutationObserver((list) => {
      list.forEach((m) => pending.add(m.type === "characterData" ? (m.target.parentElement ?? m.target) : m.target));
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        const roots = [...pending]; pending.clear();
        roots.forEach((r) => { if (r.isConnected) run(r instanceof Element ? blockOf(r) : (r as ParentNode)); });
      });
    });
    mo.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["data-hydrated"] });
    // a resize changes what fits: start again from untied text
    let rt: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        // undo our ties (the last no-break space in each tied block) and decide again at the new width
        document.querySelectorAll("[data-tie2]").forEach((b) => {
          const w = document.createTreeWalker(b, NodeFilter.SHOW_TEXT), ts: Text[] = [];
          for (let n = w.nextNode(); n; n = w.nextNode()) ts.push(n as Text);
          for (let k = ts.length - 1; k >= 0; k--) { const i = ts[k].data.lastIndexOf(NBSP); if (i >= 0) { ts[k].data = ts[k].data.slice(0, i) + " " + ts[k].data.slice(i + 1); break; } }
          b.removeAttribute("data-tie2");
        });
        document.querySelectorAll("[data-tie2-off]").forEach((b) => b.removeAttribute("data-tie2-off"));
        run(document.body);
      }, 200);
    };
    window.addEventListener("resize", onResize);
    return () => { mo.disconnect(); window.removeEventListener("resize", onResize); clearTimeout(rt); };
  }, []);
  return null;
}
