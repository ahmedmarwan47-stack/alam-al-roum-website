import type { CSSProperties } from "react";

/** Huge-icon SVGs exported from Figma, painted with currentColor via CSS mask. */
export default function Icon({ name, size = 20, className = "" }: { name: string; size?: number; className?: string }) {
  const style = { "--src": `url(/icons/icon-${name}.svg)`, width: size, height: size } as CSSProperties;
  return <span aria-hidden className={`icon ${className}`} style={style} />;
}
