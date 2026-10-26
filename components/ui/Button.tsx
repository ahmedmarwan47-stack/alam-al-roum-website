import Icon from "./Icon";

type Variant = "primary" | "light" | "outline" | "outline-light";

/** UI / Button: fill rises on hover (0.5 s), label recolours after 0.15 s, the icon exits top-right and re-enters bottom-left.
 *  Renders a link by default, or a form submit button with `submit`. */
export default function Button({ label, href = "#", variant = "primary", size = 48, icon = "arrow-up-right", className = "", submit = false }:
  { label: string; href?: string; variant?: Variant; size?: 48 | 54 | 64; icon?: string; className?: string; submit?: boolean }) {
  const text = size === 64 ? "x-20" : "x-16";
  const cls = `btn btn-${variant} btn-${size} t-text ${text} ${className}`;
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
  return submit ? <button type="submit" className={cls}>{inner}</button> : <a href={href} className={cls}>{inner}</a>;
}
