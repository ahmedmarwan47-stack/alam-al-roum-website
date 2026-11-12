import Link from "next/link";
import Icon from "./Icon";

/**
 * Back link and breadcrumb for detail pages (10 Nov review: job, story and event pages had no way back to their list):
 * "← Careers / Senior urban planner". The parent is the link (arrow included, a 44 px tall target); the current page
 * closes the row, on one line, ending in "…" when it doesn't fit.
 */
export default function Breadcrumb({ parent, href, current, className = "" }: { parent: string; href: string; current: string; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={`flex max-w-full min-w-0 ${className}`}>
      <ol className="flex min-w-0 items-center gap-2 t-label l-14 text-deepsea-500/60">
        <li className="flex-none">
          <Link href={href} className="group/bc -my-3 flex items-center gap-2 py-3 text-deepsea-500 transition-opacity hover:opacity-60">
            <Icon name="arrow-left-01-sharp" size={16} className="transition-transform duration-300 group-hover/bc:-translate-x-1" />{parent}
          </Link>
        </li>
        <li aria-hidden className="flex-none">/</li>
        <li aria-current="page" className="min-w-0 truncate">{current}</li>
      </ol>
    </nav>
  );
}
