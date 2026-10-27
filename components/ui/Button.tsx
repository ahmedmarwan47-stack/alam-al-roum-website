import Link from "next/link";
import Icon from "./Icon";

type Variant = "primary" | "light" | "outline" | "outline-light";

/** UI / Button: fill rises on hover (0.5 s), label recolours after 0.15 s, the icon exits top-right and re-enters bottom-left.
 *  Renders a link by default (Next `Link` for internal paths, so the site works under a base path), or a form submit button with `submit`.
 *  Below lg every button takes one 44 px size, full width on phones (globals.css); `compact` keeps its desktop size, for a
 *  button that shares a row with other controls (the navbar's, the footer's Subscribe inside the email field). */
export default function Button({ label, href = "#", variant = "primary", size = 48, icon = "arrow-up-right", className = "", submit = false, compact = false }:
  { label: string; href?: string; variant?: Variant; size?: 48 | 54 | 64; icon?: string; className?: string; submit?: boolean; compact?: boolean }) {
  const text = size === 64 ? "x-18" : "x-16";   // Figma Button/18 on 64, Button/16 on 48 and 54
  const cls = `btn btn-${variant} btn-${size} t-text ${text} ${compact ? "btn-keep" : ""} ${className}`;
  const inner = (
    <>
      <span className="btn-fill" />
      <span className="btn-label">{label}</span>
      <span className="btn-chip">
        <Icon name={icon} className="a" size={size === 64 ? 24 : 20} />
        <Icon name={icon} className="b" size={size === 64 ? 24 : 20} />
      </span>
    </>
  );
  if (submit) return <button type="submit" className={cls}>{inner}</button>;
  return href.startsWith("/") ? <Link href={href} className={cls}>{inner}</Link> : <a href={href} className={cls}>{inner}</a>;
}
