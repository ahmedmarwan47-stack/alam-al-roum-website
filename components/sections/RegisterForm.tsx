"use client";
import type { FormEvent } from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { sayHello } from "@/lib/contact";

const UNIT_TYPES = ["Standalone Villa", "Townhouse", "Apartment"];
const line = "flex flex-col gap-3 border-b border-deepsea-500/20 pb-4 lg:gap-[clamp(6px,1.2svh,12px)] lg:pb-[clamp(8px,1.6svh,16px)]";
const label = "t-label l-12 uppercase text-deepsea-950";
const input = "w-full bg-transparent t-text x-20 text-deepsea-950 outline-none placeholder:text-deepsea-950/60";

/**
 * Register Interest panel on the neighbourhood CTA (Figma 11128:16183): a solid white card (8 px corners) over the
 * photo, Deep Sea underline fields and the Primary (Deep Sea) Submit (29 Oct review). Like the Contact form, sending opens the visitor's mail app.
 */
export default function RegisterForm({ about }: { about: string }) {
  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const body = [`Name: ${d.get("name")}`, `Email: ${d.get("email")}`, `Phone: ${d.get("phone")}`, `Unit type: ${d.get("unit")}`, "", `${d.get("message")}`].join("\n");
    window.location.href = `mailto:${sayHello.email}?subject=${encodeURIComponent(`Register interest — ${about}`)}&body=${encodeURIComponent(body)}`;
  };
  return (
    <form onSubmit={send} className="relative flex w-full max-w-[588px] flex-col gap-10 rounded-lg bg-white p-5 sm:p-7 lg:gap-[clamp(20px,4svh,40px)] lg:p-[clamp(20px,2.85svh,28px)]">
      <span className="t-label capitalize text-deepsea-950 d-32 leading-[1.25]">Register Interest</span>
      <div className="flex flex-col gap-7 lg:gap-[clamp(12px,2.85svh,28px)]">
        <label className={line}><span className={label}>Your name</span><input name="name" required autoComplete="name" placeholder="Your full name" className={input} /></label>
        <label className={line}><span className={label}>Email</span><input name="email" type="email" required autoComplete="email" placeholder="name@email.com" className={input} /></label>
        <label className={line}><span className={label}>Phone</span><input name="phone" type="tel" autoComplete="tel" defaultValue="+20" className={input} /></label>
        <label className={line}><span className={label}>Unit type</span>
          <span className="relative flex items-center">
            <select name="unit" className={`${input} cursor-pointer appearance-none pr-8`}>
              {UNIT_TYPES.map((u) => <option key={u}>{u}</option>)}
            </select>
            <Icon name="arrow-down-01-sharp" size={20} className="pointer-events-none absolute right-0 text-deepsea-950" />
          </span>
        </label>
        <label className={line}><span className={label}>Message</span>
          <textarea name="message" rows={4} placeholder="Homes, visits, investment…" className={`${input} h-24 resize-none lg:h-[clamp(44px,9.8svh,96px)]`} />
        </label>
      </div>
      <Button label="Submit" submit className="self-start" />
    </form>
  );
}
