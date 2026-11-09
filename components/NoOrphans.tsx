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
 * italic accent span) and swaps it for a no-break space. A two-word block is tied only while the pair still fits its
 * box (so a long two-word title in a narrow card can still wrap; re-checked on resize). Idempotent.
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
  const pair = words === 2;
  if (pair && block.hasAttribute("data-tie2-off")) return;   // found not to fit; re-checked on the next resize
  // a pair we tied earlier: untie it if it no longer fits (a resize), and stop there
  if (pair && block.hasAttribute("data-tie2")) {
    if (block.scrollWidth > block.clientWidth + 1) {
      for (const t of texts) if (t.data.includes(NBSP)) { t.data = t.data.replace(NBSP, " "); break; }
      block.removeAttribute("data-tie2");
    }
    return;
  }
  let seenWord = false;
  for (let k = texts.length - 1; k >= 0; k--) {
    const t = texts[k], s = t.data;
    for (let i = s.length - 1; i >= 0; i--) {
      const c = s[i];
      if (c === NBSP) { if (seenWord) return; continue; }     // already tied (or a deliberate no-break space)
      if (/\s/.test(c)) {
        if (!seenWord) continue;                                // trailing space after the last word
        t.data = s.slice(0, i) + NBSP + s.slice(i + 1);
        if (pair) {
          // keep the pair together only if it fits; otherwise put the space back
          if (block.scrollWidth > block.clientWidth + 1) { block.setAttribute("data-tie2-off", ""); t.data = s; }
          else block.setAttribute("data-tie2", "");
        }
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
    mo.observe(document.body, { subtree: true, childList: true, characterData: true });
    // a resize changes what fits: re-check the tied pairs and tie any pair that fits now
    let rt: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(() => { document.querySelectorAll("[data-tie2-off]").forEach((b) => b.removeAttribute("data-tie2-off")); run(document.body); }, 200);
    };
    window.addEventListener("resize", onResize);
    return () => { mo.disconnect(); window.removeEventListener("resize", onResize); clearTimeout(rt); };
  }, []);
  return null;
}
