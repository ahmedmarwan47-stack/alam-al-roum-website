import type { Metadata } from "next";
import { haas, immortel } from "./fonts";
import SmoothScroll from "@/components/SmoothScroll";
import BlurInOut from "@/components/BlurInOut";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alam Al Roum — A coastline restored to a circle",
  description: "A year-round city on Egypt's Mediterranean North Coast, by Qatari Diar.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${haas.variable} ${immortel.variable}`} suppressHydrationWarning>
      {/* marks a scripted page before first paint, so text that blurs in starts hidden instead of flashing */}
      <head><script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} /></head>
      <body>
        <SmoothScroll />
        {children}
        <BlurInOut />
      </body>
    </html>
  );
}
