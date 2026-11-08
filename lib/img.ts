import widths from "./img-sizes.json";

/**
 * `srcset` for a photo with smaller copies (scripts/img-variants.py makes <name>-800.jpg and <name>-1400.jpg and
 * records the original's width): the browser picks the smallest copy that fills the image at the screen's pixel
 * density. Without a `sizes` attribute it assumes the image is as wide as the screen, so it never picks one too small.
 * Undefined for anything without copies (icons, logos, small images).
 */
export const srcSet = (src?: string) => {
  if (!src) return undefined;
  const w = (widths as Record<string, number>)[src.replace(/^\/alam-al-roum-website/, "")];
  if (!w) return undefined;
  const base = src.slice(0, -4);
  return [800, 1400].filter((v) => v < w && (v === 800 || w > 1600)).map((v) => `${base}-${v}.jpg ${v}w`).concat(`${src} ${w}w`).join(", ");
};
