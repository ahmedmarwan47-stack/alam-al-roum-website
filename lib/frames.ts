/**
 * Frames for a scroll-scrubbed film (Home's marina, About's sky-fall). They download coarse to fine, a few at a time:
 * the first and last frame, then every 32nd, 16th … 1st, so on a slow line the whole film can be scrubbed early and
 * fills in as the rest arrive (all at once, every frame would land at about the same late moment). `nearest(i)` is the
 * loaded frame closest to `i`, so the canvas follows the scroll with the best frame it has instead of freezing.
 * `start()` begins the download; it is safe to call more than once.
 */
export function frameLoader(n: number, src: (i: number) => string, onLoad: (i: number) => void, parallel = 8) {
  const imgs: HTMLImageElement[] = new Array(n), ready = new Uint8Array(n), order: number[] = [], seen = new Set<number>();
  const add = (i: number) => { if (i >= 0 && i < n && !seen.has(i)) { seen.add(i); order.push(i); } };
  add(0); add(n - 1);
  for (let step = 32; step >= 1; step >>= 1) for (let i = 0; i < n; i += step) add(i);
  let next = 0, busy = 0, started = false;
  const pump = () => {
    while (busy < parallel && next < order.length) {
      const i = order[next++], im = new Image(); busy++;
      im.decoding = "async";
      im.onload = () => { ready[i] = 1; busy--; im.decode?.().catch(() => {}); onLoad(i); pump(); };
      im.onerror = () => { busy--; pump(); };
      im.src = src(i); imgs[i] = im;
    }
  };
  return {
    start() { if (!started) { started = true; pump(); } },
    /** The loaded frame nearest to `i` (ties go to the earlier one), and its index. */
    nearest(i: number): [HTMLImageElement, number] | undefined {
      for (let d = 0; d < n; d++) {
        if (i - d >= 0 && ready[i - d]) return [imgs[i - d], i - d];
        if (i + d < n && ready[i + d]) return [imgs[i + d], i + d];
      }
    },
    /** Start the download when the page has loaded or the element comes within `margin` of the screen, if sooner. */
    startWhenNear(el: Element, margin = "300% 0px") {
      const go = () => { io.disconnect(); window.removeEventListener("load", go); this.start(); };
      const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) go(); }, { rootMargin: margin });
      io.observe(el);
      if (document.readyState === "complete") go(); else window.addEventListener("load", go);
      return () => { io.disconnect(); window.removeEventListener("load", go); };
    },
  };
}
