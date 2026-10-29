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
import { pageGallery } from "@/lib/content";
import { experiences } from "@/lib/experiences";
import { eventTile, eventsPage } from "@/lib/listings";
import { experienceCommunity } from "@/lib/experience-community";

const m = (f: string) => `/images/marina/${f}.jpg`;
const h = (f: string) => `/images/hotels/${f}.jpg`;
const ex = (f: string) => `/images/experiences/${f}.jpg`;
const ph = (f: string) => `/images/photo/${f}.jpg`;
const EYEBROW = "Lifestyle & Experiences";

/**
 * Every experience page has the same sections, in the same order (app/experiences/[slug]/page.tsx): hero, overview,
 * what's here (Landmarks), the community, life in the community, gallery, events, the other experiences, CTA.
 * Hotels adds its hotel directory (list + drawer, Figma 10921:10489) after what's here.
 */
export type ExperienceDetail = {
  slug: string; hero: SingleHeroData; overview: OverviewData;
  highlights: LandmarksData; hotels?: HotelsData; gallery: GalleryData; events: EventsHereData;
};

const marina: ExperienceDetail = {
  slug: "marina",
  hero: { eyebrow: EYEBROW, name: "The Marina", line: "Where the city meets the sea: international and local marinas, a waterfront promenade, and homes that open straight onto the water.", photo: m("hero"), alt: "Two spritz glasses on sunlit water",
    facts: [["2", "Marinas, international and local"], ["22 km", "Water frontage, incl. lagoons"], ["24/7", "Waterfront promenade"]] },
  overview: { tag: "Overview", title: "Life on the water",
    body: "The marina district brings together boating, hospitality, dining, retail and public life within a vibrant waterfront setting that serves as a focal point for residents and visitors alike.",
    photo: "/images/photo/ui-lighthouse-marina.jpg", alt: "The lighthouse over the marina at sunset",
    points: [["Life on the quay", "Cafés, restaurants and boutiques line the berths from morning to late evening. The quay is where the city meets, for coffee, a long lunch or a sunset walk."], ["Boating at the door", "Berths in the international and local marinas sit a short walk from home, with services, sailing schools and charters for every kind of boat."],
      ["Events on the water", "Regattas, markets and music on the promenade run through the year, so there is always something happening on the waterfront, in every season."]] },
  highlights: { title: "Landmarks and leisure", body: "Four reasons the marina is the city's meeting point, from the water to the promenade.",
    rows: [
      ["International & local marinas", "Berths for visiting yachts and residents' boats."],
      ["Private residential docking", "Homes that open straight onto the water."],
      ["Waterfront promenade", "A walkable edge lined with cafés and shade."],
      ["Events & culture", "Regattas, markets and evenings on the quay."],
    ].map(([title, body], k) => ({ title, body, large: m(`h${k + 1}-large`), inset: m(`h${k + 1}-inset`) })) },
  gallery: pageGallery("Marina", [ex("marina"), ph("ui-g-boardwalk"), m("h2-large"), ph("ui-g-table"), ph("ui-v-pavilion-dusk"), ph("ui-g-music")]),
  // the marina's own events (location, date and link from the event pages; the golf and sculpture cards were not at the marina)
  events: { tag: "At the marina", title: ["Events at", "the marina"], items: [
    eventTile("Marina regatta weekend", m("ev-regatta")),
    eventTile("Waterfront food market", m("ev-market")),
    eventTile("Coastal 10K run"),
    eventTile("Music by the sea"),
  ] },
};

const hotelsBase: Omit<ExperienceDetail, "highlights"> = {
  slug: "hotels",
  hero: { eyebrow: EYEBROW, name: "Hotels", line: "Stay close to the open Mediterranean, from beachfront resorts to serviced suites in the town centre, in every season.", photo: h("hero"), alt: "A hotel terrace by the sea",
    facts: [["3,500+", "Hotel rooms planned"], ["5", "Hotels across the city"], ["4", "Ways to stay"]] },
  overview: { tag: "Overview", title: "A place to stay, every season",
    body: "From beachfront resorts to serviced suites in the town centre, every district has its own way to stay.",
    photo: "/images/experiences/hotels-pool.jpg", alt: "A hotel pool by the sea",
    points: [["Beachfront resorts", "Resorts on the open shore, with the sand at the door, pools facing the sea and restaurants that stay open late through the summer evenings."], ["Lagoon boutiques", "Smaller hotels on calm water, each with its own character, quiet decks and rooms that open straight onto the lagoon."],
      ["Town centre suites", "Serviced suites above the boulevard, open all year, with the shops, cafés and the marina all within a short walk."]] },
  hotels: { tag: "Hotels", title: "International brands and boutique hospitality",
    body: "Each hotel has its own address on the coast, from the open beachfront to the lagoon and the head of the marina.",
    // drawer copy: The Beachfront Resort is the Figma drawer (11128:14825); the others follow it from their card line
    items: [
      { name: "The Beachfront Resort", type: "5-star resort · Beachfront", photo: h("beachfront-resort"), card: { w: 492, h: 615 },
        body: "A resort on the open shore with direct beach access, pools and a spa, steps from the promenade.",
        specs: [["sparkles", "Category", "5-star resort"], ["bed", "Rooms", "220 rooms & suites"], ["pin-location-01", "Location", "Beachfront district"], ["pool", "Facilities", "Spa · Pools · Beach club"]] },
      { name: "Marina Hotel", type: "Lifestyle hotel · Marina district", photo: h("marina-hotel"), card: { w: 380, h: 475 },
        body: "A lifestyle hotel on the marina promenade, with dining over the berths and the boulevard at the door.",
        specs: [["sparkles", "Category", "Lifestyle hotel"], ["pin-location-01", "Location", "Marina district"]] },
      { name: "Lagoon Retreat", type: "Boutique hotel · Lagoon communities", photo: h("lagoon-retreat"), card: { w: 496, h: 744 },
        body: "A boutique hotel on the swimmable lagoons, with water taxis to the marina.",
        specs: [["sparkles", "Category", "Boutique hotel"], ["pin-location-01", "Location", "Lagoon communities"]] },
      { name: "Golf & Spa Hotel", type: "Resort & spa · Golf community", photo: h("golf-spa"), card: { w: 496, h: 620 },
        body: "A resort and spa framed by the championship course, green all year.",
        specs: [["sparkles", "Category", "Resort & spa"], ["pin-location-01", "Location", "Golf community"]] },
      { name: "Town Centre Suites", type: "Serviced residences · Town centre", photo: h("town-centre-suites"), card: { w: 380, h: 475 },
        body: "Serviced residences above the town centre, a short walk from shops and cafés.",
        specs: [["sparkles", "Category", "Serviced residences"], ["pin-location-01", "Location", "Town centre"]] },
      { name: "Lighthouse Hotel", type: "Boutique hotel · Head of the marina", photo: h("lighthouse-hotel"), card: { w: 492, h: 744 },
        body: "A boutique hotel at the head of the marina, beside the lighthouse.",
        specs: [["sparkles", "Category", "Boutique hotel"], ["pin-location-01", "Location", "Head of the marina"]] },
    ] },
  gallery: pageGallery("Hotel", [ph("ui-g-interior"), ph("ui-v-lounger"), ph("ui-g-pool"), ph("ui-expcenter-lounge"), ph("ui-v-lounge"), ph("ui-g-colonnade")]),
  events: { tag: "At the hotels", title: ["Events at", "the hotels"], items: [
    { location: "The Beachfront Resort", date: "Sat 6 Mar 2027", title: "Sunrise yoga on the beach", photo: h("ev-yoga") },
    { location: "Marina Hotel", date: "Fri 12 Mar 2027", title: "Chef's table by the water", photo: h("ev-chef") },
    { location: "Lagoon Retreat", date: "Thu 18 Mar 2027", title: "Lagoon jazz evening", photo: h("ev-jazz") },
    { location: "The Beachfront Resort", date: "Sat 27 Mar 2027", title: "Sandcastle festival", photo: h("ev-sandcastle") },
  ] },
};
// what's here on Hotels: the six hotels as rows (their photos), ahead of the full directory with its drawers
const hotels: ExperienceDetail = { ...hotelsBase, highlights: {
  title: "Where to stay", body: hotelsBase.hotels!.body,
  rows: hotelsBase.hotels!.items.map((x) => ({ title: x.name, body: x.type, large: x.photo, inset: x.photo })) } };


/** Each experience's own photos for its gallery carousel (pageGallery adds the shared pool after them). */
const shots: Record<string, string[]> = {
  beach: [ph("ui-g-beach"), ph("ui-v-turq"), ph("ui-v-lounger"), ph("ui-sea-wide"), ph("ui-g-coast")],
  golf: [h("golf-spa"), ph("ui-g-terraces")],
  sports: ["/images/sustainability/c2-large.jpg", "/images/sustainability/c5-large.jpg", ph("ui-lagoon-clear")],
  "retail-dining": [ph("ui-g-table"), h("ev-chef"), ph("ui-g-boardwalk"), ph("ui-g-music")],
  wellness: [h("ev-yoga"), ph("ui-g-pool"), ph("ui-v-ripples")],
  education: [ph("ui-expcenter-lobby"), ph("ui-expcenter-court"), "/images/sustainability/c1-large.jpg"],
  culture: [ph("ui-g-music"), ph("ui-v-sculpture"), ph("ui-g-colonnade"), h("ev-jazz")],
};

/** Hero lines for the seven built from their card (client edit 28 Oct): two even lines from the card's own description and site facts. */
const heroLine: Record<string, string> = {
  beach: "7.2 kilometres of Mediterranean shore and 850,000 square metres of swimmable lagoons, with a promenade along the sand.",
  golf: "An 18-hole championship course by the sea, green all year, with homes framed by its fairways.",
  sports: "Courts, cycling routes and the open sea for an active life, with promenades that make moving part of living.",
  "retail-dining": "Walkable town centres, a commercial boulevard and waterfront tables, with shops and cafés below the homes.",
  wellness: "Wellness and longevity by the sea: a spa, coastal trails, and yoga on the beach at sunrise.",
  education: "Schools and a dedicated learning hub for families who stay, in a city built to be lived in all year.",
  culture: "Arts, performance and community events all year round, from regattas and markets to evenings on the quay.",
};

/** Each of the seven card-built experiences: the events closest to it first, then the next upcoming ones (four in all). */
const related: Record<string, { tag: string; title: [string, string]; first: string[] }> = {
  beach: { tag: "On the shore", title: ["Events on", "the shore"], first: ["Full moon beach festival", "Coastal 10K run", "Seaside sculpture unveiling"] },
  golf: { tag: "At the club", title: ["Events at", "the club"], first: ["Coastal open championship", "Grand hotel opening gala"] },
  sports: { tag: "On the move", title: ["Events in", "sport"], first: ["Coastal 10K run", "Marina regatta weekend", "Coastal open championship"] },
  "retail-dining": { tag: "Around the table", title: ["Events around", "the table"], first: ["Waterfront food market", "Music by the sea", "Grand hotel opening gala"] },
  wellness: { tag: "A slower pace", title: ["Events for", "body and mind"], first: ["Coastal wellness retreat", "Coastal 10K run", "Full moon beach festival"] },
  education: { tag: "Learning", title: ["Events for", "curious minds"], first: ["Roman coast symposium", "Seaside sculpture unveiling"] },
  culture: { tag: "In the calendar", title: ["Events in", "culture"], first: ["Seaside sculpture unveiling", "Music by the sea", "Roman coast symposium"] },
};
const eventsFor = (slug: string): EventsHereData => {
  const r = related[slug], titles = [...r.first, ...eventsPage.upcoming.map((e) => e.title)].filter((t, k, all) => all.indexOf(t) === k).slice(0, 4);
  return { tag: r.tag, title: r.title, items: titles.map((t) => eventTile(t)) };
};

/** The other seven experiences: same template, filled from the experience card and lib/experience-community.ts. */
const fromCard = (slug: string): ExperienceDetail => {
  const x = experiences.find((e) => e.slug === slug)!, here = experienceCommunity[slug].here!;
  return {
    slug,
    hero: { eyebrow: EYEBROW, name: x.title, line: heroLine[slug] ?? x.note, photo: x.photo, alt: x.title },
    overview: { tag: "Overview", title: x.title, body: x.body },
    highlights: { title: here.title, body: here.body,
      rows: here.rows.map(([title, body], k) => ({ title, body, large: here.photos[k], inset: here.photos[k] })) },
    gallery: pageGallery(x.title, shots[slug]),
    events: eventsFor(slug),
  };
};

export const experienceDetails: ExperienceDetail[] = experiences.map((x) =>
  x.slug === "marina" ? marina : x.slug === "hotels" ? hotels : fromCard(x.slug));
