import { notFound } from "next/navigation";
import Navbar from "@/components/sections/Navbar";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RevealText from "@/components/reveal/RevealText";
import Cta from "@/components/sections/Cta";
import Footer from "@/components/sections/Footer";
import { offer, roleDetail, roles } from "@/lib/careers";

export const dynamicParams = false;
/** 15 Nov: each fact in the Position details band leads with its icon (the site's Huge icons, Figma 10261:675), no rules */
const FACT_ICON: Record<string, string> = { Location: "location-01", Department: "briefcase-01", Type: "clock-01", Posted: "calendar-03" };
export const generateStaticParams = () => roles.map((r) => ({ slug: r.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = roles.find((x) => x.slug === slug);
  return { title: r ? `${r.title} — Careers — Alam Al Roum` : "Careers — Alam Al Roum" };
}

const Numbered = ({ title, items }: { title: string; items: string[] }) => (
  <div className="flex flex-col gap-6 lg:flex-row lg:gap-0">
    <RevealText as="h2" text={title} className="t-heading hd-32 text-deepsea-500 lg:w-[480px] lg:flex-none" />
    <ol className="flex flex-1 flex-col">
      {items.map((t, k) => (
        <li key={t} className="flex items-baseline gap-5 border-b border-deepsea-500/10 py-4 first:pt-0 last:border-0">
          <span className="t-label l-12 text-deepsea-500/60">{String(k + 1).padStart(2, "0")}</span>
          <span className="t-body b-18 text-deepsea-500">{t}</span>
        </li>))}
    </ol>
  </div>
);

/** Job detail (Figma "Job Detail • Desktop"): banner, deep sea position details (12 Nov: no burgundy), then responsibilities / requirements / offer. */
export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const role = roles.find((x) => x.slug === slug);
  if (!role) notFound();
  const r = roleDetail(role);
  const apply = `/contact?role=${r.slug}`;
  return (
    <main>
      <Navbar />
      <section className="mt-[76px] flex flex-col items-center gap-6 bg-limestone-50 px-[var(--gutter)] py-12 lg:py-20 text-center text-deepsea-500">
        <Breadcrumb parent="Careers" href="/careers" current={r.title} />
        {/* 12 Nov review: the site's heading face in Deep Sea (as the listing heroes), not black Immortel */}
        <RevealText as="h1" text={r.title} onLoad delay={0.15} className="t-heading capitalize hd-56" />
        <RevealText text={r.lede} onLoad delay={0.3} className="t-body b-18 text-limestone-800" />
      </section>
      <section className="flex flex-col gap-16 bg-deepsea-500 py-12 text-white container-x lg:py-20">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="flex max-w-[460px] flex-col gap-6">
            <RevealText as="h2" text="Position details" className="t-heading hd-48" />
            <p className="t-body b-16 text-white/80">{r.body}</p>
          </div>
          <Button label="Apply For This Role" href={apply} variant="outline-light" className="self-start lg:self-auto" />
        </div>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-6 md:gap-x-6 lg:grid-cols-4">
          {r.facts.map(([k, v]) => (
            // two by two below lg, phones included (9 Nov); one row from lg. 15 Nov: no rules, an icon above each fact
            <div key={k} className="flex min-w-0 flex-col gap-1 md:gap-3">
              {FACT_ICON[k] && <Icon name={FACT_ICON[k]} size={28} className="mb-2 text-limestone-500 max-md:mb-1 max-md:h-6! max-md:w-6!" />}
              <dt className="t-heading hd-20 max-md:text-[16px]! max-md:leading-6!">{k}</dt><dd className="t-body b-16 text-white/80 max-md:text-[14px]! max-md:leading-5!">{v}</dd>
            </div>))}
        </dl>
      </section>
      <section className="flex flex-col gap-20 bg-limestone-50 py-12 container-x lg:py-20">
        {r.responsibilities && <Numbered title="Responsibilities" items={r.responsibilities} />}
        {r.requirements && <Numbered title="Requirements" items={r.requirements} />}
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-0">
          <RevealText as="h2" text="What we offer" className="t-heading hd-32 text-deepsea-500 lg:w-[480px] lg:flex-none" />
          <div className="flex flex-col items-start gap-8"><p className="t-body b-18 text-deepsea-500/70">{offer}</p><Button label="Apply For This Role" href={apply} variant="outline" /></div>
        </div>
      </section>
      <Cta />
      <Footer />
    </main>
  );
}
