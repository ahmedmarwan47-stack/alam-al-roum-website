"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { sayHello } from "@/lib/contact";

const F = sayHello.form;
// 18 Nov: the site's form style (as the Home lead form and the community form, RegisterForm.tsx LeadForm)
const line = "flex min-w-0 flex-col gap-1 border-b border-deepsea-500/30 pb-2";
const label = "t-label l-12 text-deepsea-500";
const input = "w-full bg-transparent t-text x-16 text-deepsea-500 outline-none placeholder:text-deepsea-500/60";

/**
 * "Send us a message" (Figma 11134:15413), in the site's form style since 18 Nov: the light glass card of the Home and
 * community forms (deep sea underline fields, 20 px rhythm; 90 % Limestone here, over the darker photo), one field a row (as the community form). There is no form backend yet,
 * so sending opens the visitor's mail app with the message addressed to the sales inbox. `?role=` prefills a job application.
 */
export default function ContactForm() {
  const role = useSearchParams().get("role");
  const [interest, setInterest] = useState(role ? "Careers" : F.interests[0]);
  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const body = [`Name: ${d.get("name")}`, `Email: ${d.get("email")}`, `Phone: ${d.get("phone")}`, "", `${d.get("message")}`].join("\n");
    window.location.href = `mailto:${sayHello.email}?subject=${encodeURIComponent(`${interest} — website enquiry`)}&body=${encodeURIComponent(body)}`;
  };
  // tell NoOrphans this late-loading (Suspense) part has hydrated, so it may now tie its text
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => { form.current?.closest("[data-hydrate-late]")?.setAttribute("data-hydrated", ""); }, []);
  return (
    <form ref={form} onSubmit={send} className="flex w-full flex-col gap-5 rounded-lg border border-white/50 bg-[rgb(251_250_248/.9)] p-5 shadow-[0_16px_48px_-16px_rgb(1_15_26/.25)] backdrop-blur-[10px] lg:w-[588px] lg:flex-none">
      <span className="t-heading text-deepsea-950 d-32 [line-height:round(nearest,1.25em,4px)]">{F.title}</span>
      <div className="grid gap-5">
        <label className={line}><span className={label}>{F.fields.name[0]}</span><input name="name" required autoComplete="name" placeholder={F.fields.name[1]} className={input} /></label>
        <label className={line}><span className={label}>{F.fields.email[0]}</span><input name="email" type="email" required autoComplete="email" placeholder={F.fields.email[1]} className={input} /></label>
        <label className={line}><span className={label}>{F.fields.phone[0]}</span><input name="phone" type="tel" autoComplete="tel" defaultValue={F.fields.phone[1]} className={input} /></label>
        <label className={line}><span className={label}>{F.fields.interest[0]}</span>
          <span className="relative flex items-center">
            <select value={interest} onChange={(e) => setInterest(e.target.value)} className={`${input} cursor-pointer appearance-none pr-8`}>
              {F.interests.map((i) => <option key={i}>{i}</option>)}
            </select>
            <Icon name="arrow-down-01-sharp" size={20} className="pointer-events-none absolute right-0 text-deepsea-500" />
          </span>
        </label>
        <label className={line}><span className={label}>{F.fields.message[0]}</span>
          <textarea name="message" rows={4} placeholder={F.fields.message[1]} defaultValue={role ? `I would like to apply for the ${role.replace(/-/g, " ")} role.` : ""} className={`${input} h-[108px] resize-none`} />
        </label>
      </div>
      <Button label={F.send} submit variant="primary" className="self-start" />
    </form>
  );
}
