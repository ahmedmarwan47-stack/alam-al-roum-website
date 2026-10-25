import RevealText from "@/components/reveal/RevealText";
import type { Seg } from "@/components/reveal/RevealText";

/** Tagline + heading (+ optional body), centred or left, with the line reveal. */
export default function SectionTitle({ tag, title, body, align = "center", dark = false, className = "" }:
  { tag?: string; title: string | Seg[]; body?: string; align?: "center" | "left"; dark?: boolean; className?: string }) {
  const c = dark ? "text-limestone-50" : "text-deepsea-500";
  return (
    <div className={`flex flex-col gap-4 ${align === "center" ? "items-center text-center" : "items-start"} ${className}`}>
      {tag && <RevealText text={tag} className={`t-label l-16 ${c}`} />}
      <RevealText as="h2" {...(typeof title === "string" ? { text: title } : { segs: title })} className={`t-heading hd-48 ${c}`} delay={0.05} />
      {body && <RevealText text={body} className={`t-body b-18 max-w-[870px] ${dark ? "text-limestone-50/80" : "text-limestone-800"}`} delay={0.15} />}
    </div>
  );
}
