"use client";
import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { sayHello } from "@/lib/contact";

const F = sayHello.form;
const line = "flex flex-col gap-3 border-b border-white/30 pb-4";
const label = "t-label l-12 uppercase text-white";
const input = "w-full bg-transparent t-text x-20 text-white outline-none placeholder:text-white/80";

/**
 * "Send us a message" (Figma 11134:15413): a frosted panel of dark underline fields. There is no form backend yet,
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
  return (
    <form onSubmit={send} className="flex w-full flex-col gap-10 rounded-[30px] bg-[rgba(10,10,10,0.4)] p-5 backdrop-blur-[16px] sm:p-7 lg:w-[588px] lg:flex-none">
      <span className="t-label capitalize text-white d-32 leading-[1.25]">{F.title}</span>
      <div className="flex flex-col gap-7">
        <label className={line}><span className={label}>{F.fields.name[0]}</span><input name="name" required autoComplete="name" placeholder={F.fields.name[1]} className={input} /></label>
        <label className={line}><span className={label}>{F.fields.email[0]}</span><input name="email" type="email" required autoComplete="email" placeholder={F.fields.email[1]} className={input} /></label>
        <label className={line}><span className={label}>{F.fields.phone[0]}</span><input name="phone" type="tel" autoComplete="tel" defaultValue={F.fields.phone[1]} className={input} /></label>
        <label className={line}><span className={label}>{F.fields.interest[0]}</span>
          <span className="relative flex items-center">
            <select value={interest} onChange={(e) => setInterest(e.target.value)} className={`${input} cursor-pointer appearance-none pr-8`}>
              {F.interests.map((i) => <option key={i} className="text-black">{i}</option>)}
            </select>
            <Icon name="arrow-down-01-sharp" size={20} className="pointer-events-none absolute right-0 text-white" />
          </span>
        </label>
        <label className={line}><span className={label}>{F.fields.message[0]}</span>
          <textarea name="message" rows={4} placeholder={F.fields.message[1]} defaultValue={role ? `I would like to apply for the ${role.replace(/-/g, " ")} role.` : ""} className={`${input} h-24 resize-none`} />
        </label>
      </div>
      <Button label={F.send} submit className="self-start" />
    </form>
  );
}
