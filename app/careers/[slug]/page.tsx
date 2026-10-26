import { notFound } from "next/navigation";
import Navbar from "@/components/sections/Navbar";
import Button from "@/components/ui/Button";
import RevealText from "@/components/reveal/RevealText";
import Cta from "@/components/sections/Cta";
import Footer from "@/components/sections/Footer";
import { offer, roleDetail, roles } from "@/lib/careers";

export const dynamicParams = false;
export const generateStaticParams = () => roles.map((r) => ({ slug: r.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = roles.find((x) => x.slug === slug);
  return { title: r ? `${r.title} — Careers — Alam Al Roum` : "Careers — Alam Al Roum" };
}

const Numbered = ({ title, items }: { title: string; items: string[] }) => (
  <div className="flex flex-col gap-6 lg:flex-row lg:gap-0">
    <RevealText as="h2" text={title} className="t-heading hd-32 text-black lg:w-[480px] lg:flex-none" />
    <ol className="flex flex-1 flex-col">
      {items.map((t, k) => (
        <li key={t} className="flex items-baseline gap-5 border-b border-black/10 py-4 first:pt-0 last:border-0">
          <span className="t-label l-12 text-black/60">{String(k + 1).padStart(2, "0")}</span>
          <span className="t-body b-18 text-black">{t}</span>
        </li>))}
    </ol>
  </div>
);

/** Job detail (Figma "Job Detail • Desktop"): banner, terracotta position details, then responsibilities / requirements / offer. */
export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const role = roles.find((x) => x.slug === slug);
  if (!role) notFound();
  const r = roleDetail(role);
  const apply = `/contact?role=${r.slug}`;
  return (
    <main>
      <Navbar />
      <section className="mt-[76px] flex flex-col items-center gap-6 bg-white px-[var(--gutter)] py-[60px] text-center text-black">
        <span className="t-label l-12 text-black/60">Careers</span>
        <RevealText as="h1" text={r.title} onLoad delay={0.15} className="t-body capitalize [font-size:clamp(44px,4.5vw,68px)] leading-[1]" />
        <RevealText text={r.lede} onLoad delay={0.3} className="t-body b-18 text-black/70" />
      </section>
      <section className="flex flex-col gap-16 bg-terracotta-500 py-20 text-white container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="flex max-w-[460px] flex-col gap-6">
            <RevealText as="h2" text="Position details" className="t-heading hd-48" />
            <p className="t-body b-16 text-white/80">{r.body}</p>
          </div>
          <Button label="Apply For This Role" href={apply} variant="light" className="self-start lg:self-auto" />
        </div>
        <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {r.facts.map(([k, v]) => (
            <div key={k} className="flex flex-col gap-3 border-t border-white/40 pt-6">
              <dt className="t-heading hd-20">{k}</dt><dd className="t-body b-16 text-white/80">{v}</dd>
            </div>))}
        </dl>
      </section>
      <section className="flex flex-col gap-20 bg-limestone-50 py-20 container-x">
        {r.responsibilities && <Numbered title="Responsibilities" items={r.responsibilities} />}
        {r.requirements && <Numbered title="Requirements" items={r.requirements} />}
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-0">
          <RevealText as="h2" text="What we offer" className="t-heading hd-32 text-black lg:w-[480px] lg:flex-none" />
          <div className="flex flex-col items-start gap-8"><p className="t-body b-18 text-black/70">{offer}</p><Button label="Apply For This Role" href={apply} /></div>
        </div>
      </section>
      <Cta />
      <Footer />
    </main>
  );
}
