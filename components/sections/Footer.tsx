import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import RevealText from "@/components/reveal/RevealText";
import { footer as F } from "@/lib/content";
import { routes } from "@/lib/routes";

const Col = ({ title, items }: { title: string; items: string[] }) => (
  <div className="flex flex-col gap-6"><span className="t-label l-14">{title}</span>{items.map((i) => <a key={i} href={routes[i] ?? "#"} className="t-text x-16 hover:opacity-60">{i}</a>)}</div>
);

const contactHref = (icon: string, t: string) =>
  icon === "call" ? `tel:${t}` : icon === "whatsapp" ? `https://wa.me/${t.replace(/\D/g, "")}` : icon === "mail-01" ? `mailto:${t}` : routes[t] ?? "#";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-limestone-50 text-deepsea-500">
      <video className="absolute inset-x-0 bottom-0 top-[185px] h-[calc(100%-185px)] w-full object-cover" src={F.video} autoPlay muted loop playsInline />
      <div className="relative flex flex-col pt-10 container-x">
        <div className="flex flex-col justify-between gap-8 py-10 lg:flex-row lg:items-center">
          <div className="flex flex-col gap-2"><RevealText text={F.newsTitle} className="t-text x-28" /><span className="t-text x-16">{F.newsBody}</span></div>
          <div className="flex w-full max-w-[453px] flex-col gap-3">
            <form className="flex h-16 items-center gap-2 rounded-lg border border-limestone-600 bg-limestone-100 py-2 pl-5 pr-2">
              <input type="email" placeholder={F.placeholder} className="flex-1 bg-transparent t-text x-16 text-deepsea-500 outline-none placeholder:text-limestone-800" />
              <Button label={F.subscribe} variant="primary" />
            </form>
            <span className="t-text x-12">{F.consent}</span>
          </div>
        </div>
        <div className="h-px bg-limestone-600" />
        <div className="flex flex-col justify-between gap-10 pt-[50px] lg:flex-row">
          <div className="flex flex-col gap-6">
            <p className="t-text x-28">{F.address.map((l) => <span key={l} className="block">{l}</span>)}</p>
            <span className="t-label l-12">{F.live}</span>
            <div className="flex gap-[6px] t-text x-16">{F.legal.map((l) => <a key={l} href="#">{l}</a>)}</div>
          </div>
          <div className="flex gap-[120px]">
            <Col title="Discover" items={F.discover} /><Col title="More" items={F.more} />
            <div className="flex flex-col gap-6"><span className="t-label l-14">Contact</span>
              {F.contact.map(([ic, t]) => <a key={t} href={contactHref(ic, t)} className="flex items-center gap-2 t-text x-16">{ic && <Icon name={ic} size={18} />}{t}</a>)}
              <div className="flex gap-2">{["whatsapp", "facebook-01", "instagram", "tiktok"].map((i) => <a key={i} href="#"><Icon name={i} size={20} /></a>)}</div>
            </div>
          </div>
        </div>
        <div className="flex items-end justify-between pt-[200px] pb-2">
          <span className="t-body b-12 text-limestone-950">{F.credit}</span>
          <div className="flex flex-col items-end gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/qatari-diar.png" alt="Qatari Diar" width={64} height={64} />
            <span className="t-body b-12 text-limestone-950">{F.copyright}</span>
          </div>
        </div>
        <div className="h-px bg-deepsea-600" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/wordmark.svg" alt="Alam Al Roum" className="w-full pb-16 pt-6" />
      </div>
    </footer>
  );
}
