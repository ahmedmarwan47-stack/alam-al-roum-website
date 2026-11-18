"use client";
import type { FormEvent, ReactNode } from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { sayHello } from "@/lib/contact";

const UNIT_TYPES = ["Standalone Villa", "Townhouse", "Apartment"];
// phones: 4 px from label to field, 12 px under it (inputs stay 16 px, so iOS does not zoom on focus)
const line = "flex flex-col gap-1 border-b border-deepsea-500/20 pb-3 lg:gap-[clamp(6px,1.2svh,12px)] lg:pb-[clamp(8px,1.6svh,16px)]";
const label = "t-label l-12 capitalize text-deepsea-950";
const input = "w-full bg-transparent t-text x-20 text-deepsea-950 outline-none placeholder:text-deepsea-950/60";

/**
 * Register Interest panel on the neighbourhood CTA (Figma 11128:16183): a solid white card (8 px corners) over the
 * photo, Deep Sea underline fields and the Primary (Deep Sea) Submit (29 Oct review). Like the Contact form, sending opens the visitor's mail app.
 */
/** Sends a filled form by opening the visitor's mail app (as the Contact form does), the subject naming where it came from. */
const sender = (about: string) => (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const d = new FormData(e.currentTarget);
  const body = [`Name: ${d.get("name")}`, `Email: ${d.get("email")}`, `Phone: ${d.get("phone")}`, `Unit type: ${d.get("unit")}`,
    ...(d.has("message") ? ["", `${d.get("message")}`] : [])].join("\n");
  window.location.href = `mailto:${sayHello.email}?subject=${encodeURIComponent(`Register interest — ${about}`)}&body=${encodeURIComponent(body)}`;
};

export default function RegisterForm({ about }: { about: string }) {
  const send = sender(about);
  return (
    <form onSubmit={send} className="relative flex w-full max-w-[588px] flex-col gap-8 rounded-lg bg-white p-5 shadow-[0_8px_32px_rgb(1_15_26/.08)] sm:p-7 lg:shadow-none lg:gap-[clamp(20px,4svh,40px)] lg:p-[clamp(20px,2.85svh,28px)]">
      <span className="t-heading text-deepsea-950 d-32 [line-height:round(nearest,1.25em,4px)]">Register Interest</span>
      <div className="flex flex-col gap-5 lg:gap-[clamp(12px,2.85svh,28px)]">
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
          <textarea name="message" rows={4} placeholder="Homes, visits, investment…" className={`${input} h-20 resize-none lg:h-[clamp(44px,9.8svh,96px)]`} />
        </label>
      </div>
      <Button label="Submit" submit variant="outline" className="self-start" />
    </form>
  );
}

/**
 * The lead form on Home's Live Greatness (18 Nov review, Omnia #77: register without leaving the page for Contact),
 * as in Figma "CTA / Live Greatness" (11694:7857, Register Interest Form 11694:7914; the compact version, 18 Nov:
 * 20 px padding and gaps, title 36): one card holding the section's
 * own title and line (`children`) above the fields, so the portal photo keeps the rest of the stage. Name and email,
 * phone and unit type two by two, the message across both, then Register Interest (Primary, 48). From lg a light
 * glass card (Limestone 50 at 74 %, 10 px background blur, a white hairline, a soft shadow), 520 px, centred in the
 * section's height at the left gutter; below lg a white card over the photo's foot, one field a row.
 */
/** `stacked` (community pages): one field a row at every size, rather than two by two. */
export function LeadForm({ about, children, stacked = false }: { about: string; children?: ReactNode; stacked?: boolean }) {
  const row = "flex min-w-0 flex-col gap-1 border-b border-deepsea-500/30 pb-2";
  const lab = "t-label l-12 text-deepsea-500";
  const field = "w-full bg-transparent t-text x-16 text-deepsea-500 outline-none placeholder:text-deepsea-500/60";
  return (
    <form onSubmit={sender(about)} className="flex w-full flex-col gap-5 rounded-lg bg-white p-5 shadow-[0_8px_32px_rgb(1_15_26/.08)] lg:w-[min(520px,44vw)] lg:border lg:border-white/50 lg:bg-[rgb(251_250_248/.74)] lg:backdrop-blur-[10px] lg:shadow-[0_16px_48px_-16px_rgb(1_15_26/.25)]">
      {children}
      <div className={`grid gap-5 ${stacked ? "" : "sm:grid-cols-2 sm:gap-x-6"}`}>
        <label className={row}><span className={lab}>Your name</span><input name="name" required autoComplete="name" placeholder="Your full name" className={field} /></label>
        <label className={row}><span className={lab}>Email</span><input name="email" type="email" required autoComplete="email" placeholder="name@email.com" className={field} /></label>
        <label className={row}><span className={lab}>Phone</span><input name="phone" type="tel" autoComplete="tel" defaultValue="+20" className={field} /></label>
        <label className={row}><span className={lab}>Unit type</span>
          <span className="relative flex items-center">
            <select name="unit" className={`${field} cursor-pointer appearance-none pr-7`}>
              {UNIT_TYPES.map((u) => <option key={u}>{u}</option>)}
            </select>
            <Icon name="arrow-down-01-sharp" size={20} className="pointer-events-none absolute right-0 text-deepsea-500" />
          </span>
        </label>
        <label className={`${row} ${stacked ? "" : "sm:col-span-2"}`}><span className={lab}>Message</span>
          <textarea name="message" rows={4} placeholder="Homes, visits, investment…" className={`${field} h-[108px] resize-none`} />
        </label>
      </div>
      <Button label="Register Interest" submit variant="primary" className="self-start" />
    </form>
  );
}
