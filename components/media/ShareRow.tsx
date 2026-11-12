"use client";
import Icon from "@/components/ui/Icon";

const targets: [string, (u: string, t: string) => string][] = [
  ["whatsapp", (u, t) => `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`)}`],
  ["linkedin-01", (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}`],
  ["facebook-01", (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`],
];

/** "Share via" + WhatsApp / LinkedIn / Facebook; the share URL is read at click time so it is always the live page. */
export default function ShareRow({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="t-text x-16 text-black">Share via</span>
      {targets.map(([icon, url]) => (
        // below lg each icon gets a 40 px tap target; the negative margin keeps the icons where they were
        <button key={icon} aria-label={`Share on ${icon.split("-")[0]}`} className="text-black transition-opacity hover:opacity-60 max-lg:-m-[10px] max-lg:grid max-lg:size-10 max-lg:place-items-center"
          onClick={() => window.open(url(window.location.href, title), "_blank", "noopener,noreferrer")}>
          <Icon name={icon} size={20} />
        </button>))}
    </div>
  );
}
