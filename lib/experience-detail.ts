/**
 * Experience detail pages. The Marina and Hotels pages follow their Figma frames
 * ("Experience Detail (template · Marina)" 10921:10415 and "Experience · Hotels (list + drawer)" 10921:10489);
 * the other seven experiences use the same template filled from their own card copy.
 */
import type { SingleHeroData } from "@/components/sections/SingleHero";
import type { OverviewData } from "@/components/sections/Overview";
import type { LandmarksData } from "@/components/sections/Landmarks";
import type { EventsHereData } from "@/components/sections/EventsHere";
import type { HotelsData } from "@/components/sections/HotelsList";
import type { GalleryData } from "@/components/sections/Gallery";
import { gallery } from "@/lib/content";
import { experiences } from "@/lib/experiences";

const m = (f: string) => `/images/marina/${f}.jpg`;
const h = (f: string) => `/images/hotels/${f}.jpg`;
const EYEBROW = "Lifestyle & Experiences";

export type ExperienceDetail = {
  slug: string; hero: SingleHeroData; overview: OverviewData;
  highlights?: LandmarksData; hotels?: HotelsData; gallery: GalleryData; events?: EventsHereData;
};

const marina: ExperienceDetail = {
  slug: "marina",
  hero: { eyebrow: EYEBROW, name: "The Marina", line: "Where the city meets the sea.", photo: m("hero"), alt: "Two spritz glasses on sunlit water",
    facts: [["2", "Marinas, international and local"], ["22 km", "Water frontage, incl. lagoons"], ["24/7", "Waterfront promenade"]] },
  overview: { tag: "Overview", title: "Life on the water",
    body: "The marina district brings together boating, hospitality, dining, retail and public life within a vibrant waterfront setting that serves as a focal point for residents and visitors alike." },
  highlights: { title: "Landmarks and leisure", body: "Four reasons the marina is the city's meeting point, from the water to the promenade.",
    rows: [
      ["International & local marinas", "Berths for visiting yachts and residents' boats."],
      ["Private residential docking", "Homes that open straight onto the water."],
      ["Waterfront promenade", "A walkable edge lined with cafés and shade."],
      ["Events & culture", "Regattas, markets and evenings on the quay."],
    ].map(([title, body], k) => ({ title, body, large: m(`h${k + 1}-large`), inset: m(`h${k + 1}-inset`) })) },
  gallery: { ...gallery, title: [{ t: "Marina" }, { t: "shots", br: true }] },
  events: { tag: "At the marina", title: ["Events at", "the marina"], items: [
    { cat: "Golf", date: "Wed 10 Feb 2027", title: "Coastal open championship", photo: m("ev-golf") },
    { cat: "Culture", date: "Thu 11 Feb 2027", title: "Seaside sculpture unveiling", photo: m("ev-sculpture") },
    { cat: "Retail & Dining", date: "Fri 12 Feb 2027", title: "Waterfront food market", photo: m("ev-market") },
    { cat: "Marina", date: "Sat 20 Feb 2027", title: "Marina regatta weekend", photo: m("ev-regatta") },
  ] },
};

const hotels: ExperienceDetail = {
  slug: "hotels",
  hero: { eyebrow: EYEBROW, name: "Hotels", line: "Stay close to the open Mediterranean.", photo: h("hero"), alt: "A hotel terrace by the sea",
    facts: [["3,500+", "Hotel rooms planned"], ["5", "Hotels across the city"], ["4", "Ways to stay"]] },
  overview: { tag: "Overview", title: "A place to stay, every season",
    body: "From beachfront resorts to serviced suites in the town centre, every district has its own way to stay." },
  hotels: { tag: "Hotels", title: "International brands and boutique hospitality",
    body: "Each hotel has its own address on the coast, from the open beachfront to the lagoon and the head of the marina.",
    items: [
      { name: "The Beachfront Resort", type: "5-star resort · Beachfront", photo: h("beachfront-resort"), card: { w: 492, h: 615 } },
      { name: "Marina Hotel", type: "Lifestyle hotel · Marina district", photo: h("marina-hotel"), card: { w: 380, h: 475 } },
      { name: "Lagoon Retreat", type: "Boutique hotel · Lagoon communities", photo: h("lagoon-retreat"), card: { w: 496, h: 744 } },
      { name: "Golf & Spa Hotel", type: "Resort & spa · Golf community", photo: h("golf-spa"), card: { w: 496, h: 620 } },
      { name: "Town Centre Suites", type: "Serviced residences · Town centre", photo: h("town-centre-suites"), card: { w: 380, h: 475 } },
      { name: "Lighthouse Hotel", type: "Boutique hotel · Head of the marina", photo: h("lighthouse-hotel"), card: { w: 492, h: 744 } },
    ] },
  gallery: { ...gallery, title: [{ t: "Hotels’" }, { t: "shots", br: true }] },
  events: { tag: "At the hotels", title: ["Events at", "the hotels"], items: [
    { cat: "Wellness", date: "Sat 6 Mar 2027", title: "Sunrise yoga on the beach", photo: h("ev-yoga") },
    { cat: "Retail & Dining", date: "Fri 12 Mar 2027", title: "Chef's table by the water", photo: h("ev-chef") },
    { cat: "Culture", date: "Thu 18 Mar 2027", title: "Lagoon jazz evening", photo: h("ev-jazz") },
    { cat: "Beach", date: "Sat 27 Mar 2027", title: "Sandcastle festival", photo: h("ev-sandcastle") },
  ] },
};

/** The other seven experiences: same template, filled from the experience card (title, note, photo, one-line description). */
const fromCard = (slug: string): ExperienceDetail => {
  const x = experiences.find((e) => e.slug === slug)!;
  return {
    slug,
    hero: { eyebrow: EYEBROW, name: x.title, line: x.note, photo: x.photo, alt: x.title },
    overview: { tag: "Overview", title: x.title, body: x.body },
    gallery: { ...gallery, title: [{ t: x.title }, { t: "shots", br: true }] },
  };
};

export const experienceDetails: ExperienceDetail[] = experiences.map((x) =>
  x.slug === "marina" ? marina : x.slug === "hotels" ? hotels : fromCard(x.slug));
