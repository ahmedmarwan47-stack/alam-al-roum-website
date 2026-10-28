/**
 * Neighbourhood detail pages (Figma "Neighbourhood Detail • Desktop", 10921:9807).
 * Beachfront is fully designed in Figma; the other five communities use the same template,
 * filled from their community card (no unit types or facilities until those are designed).
 */
import type { SingleHeroData } from "@/components/sections/SingleHero";
import type { OverviewData } from "@/components/sections/Overview";
import type { LandmarksData } from "@/components/sections/Landmarks";
import type { HotelsData } from "@/components/sections/HotelsList";
import type { GalleryData } from "@/components/sections/Gallery";
import { pageGallery } from "@/lib/content";
import { communities } from "@/lib/communities";

const n = (f: string) => `/images/neighbourhood/${f}.jpg`;
const cm = (f: string) => `/images/communities/${f}.jpg`;
const ph = (f: string) => `/images/photo/${f}.jpg`;

export type Neighbourhood = {
  slug: string; hero: SingleHeroData; overview: OverviewData; units?: HotelsData; facilities?: LandmarksData;
  masterplan: { title: string; body: string }; gallery: GalleryData;
};

const beachfront: Neighbourhood = {
  slug: "beachfront",
  hero: { eyebrow: "Neighbourhood · Shoreline", name: "Beachfront", line: "Homes along the open shoreline, on 7.2 kilometres of Mediterranean sand, with private beach clubs and nothing between you and the horizon.", photo: n("hero-beachfront"), alt: "The beachfront shoreline",
    facts: [["7.2 km", "Private shoreline"], ["3 min", "Walk to the beach"], ["3", "Unit types"]] },
  overview: { tag: "Overview · Shoreline", title: "The sea is the first thing you see",
    body: "Beachfront communities hold the edge of the city. Homes face the Mediterranean with nothing between you and the horizon. Low-rise architecture, sunlit terraces, and direct beach access define the district.",
    facts: [["1.4M sqm", "Beach area along the city's shore"], ["Direct", "Beach access from the district"], ["4", "Residents' clubs, from the beach club to the kids' club"]] },
  // drawer copy follows the Figma unit drawer (11128:14826), with each unit's figures from its card
  units: { tag: "Residences", title: "Unit types", body: "Three ways to live on the shore. Each with its own floor plans, specifications, and brochure.",
    cols: "sm:grid-cols-3", bodyWidth: 560, kind: "unit", extra: [n("f1-inset")],
    items: [
      { name: "Beach villa", type: "4 beds · From 420 m² · Private pool · Sea view", photo: n("unit-villa"), card: { w: 456, h: 684 },
        body: "A four-bedroom villa with a private pool facing the sea, set along the beachfront promenade.",
        specs: [["bed", "Bedrooms", "4 bedrooms"], ["ruler", "Built-up area", "From 420 m²"], ["terrace", "Outdoor", "Private pool · Sea view"], ["location-01", "Neighbourhood", "Beachfront communities"]] },
      { name: "Shoreline townhouse", type: "3 beds · From 260 m² · Roof terrace · Garden", photo: n("unit-townhouse"), card: { w: 456, h: 684 },
        body: "A three-bedroom townhouse with a roof terrace and garden, a short walk from the sand.",
        specs: [["bed", "Bedrooms", "3 bedrooms"], ["ruler", "Built-up area", "From 260 m²"], ["terrace", "Outdoor", "Roof terrace · Garden"], ["location-01", "Neighbourhood", "Beachfront communities"]] },
      { name: "Terrace apartment", type: "2 beds · From 140 m² · Sea-facing terrace", photo: n("unit-apartment"), card: { w: 456, h: 684 },
        body: "A two-bedroom apartment with a sea-facing terrace above the promenade.",
        specs: [["bed", "Bedrooms", "2 bedrooms"], ["ruler", "Built-up area", "From 140 m²"], ["terrace", "Outdoor", "Sea-facing terrace"], ["location-01", "Neighbourhood", "Beachfront communities"]] },
    ] },
  facilities: { title: "Landmarks and leisure",
    body: "Daily life is walkable. Beach club, clubhouse, spa and kids' club, plus a retail village, mosque, water-taxi stop and 24/7 security.",
    rows: [
      ["Beach club", "Private cabanas and a pool on the sand"], ["Clubhouse", "Lounge, dining, and residents' events"],
      ["Fitness and spa", "Gym, studios, and treatment rooms"], ["Kids' club", "Supervised play and a splash park"],
    ].map(([title, body], k) => ({ title, body, large: n(`f${k + 1}-large`), inset: n(`f${k + 1}-inset`) })) },
  masterplan: { title: "Beachfront on the masterplan", body: "On the open shoreline, minutes from the marina and the town centre." },
  gallery: pageGallery("Beachfront", [cm("beachfront"), n("unit-villa"), n("unit-townhouse"), n("unit-apartment"), ph("ui-g-coast"), ph("ui-v-lounger"), ph("ui-sea-wide")]),
};

/** Each community's own photos for its gallery carousel (pageGallery adds the shared pool after them). */
const shots: Record<string, string[]> = {
  lagoon: [cm("pin-lagoon"), "/images/hotels/lagoon-retreat.jpg", "/images/sustainability/c2-large.jpg", ph("ui-v-ripples"), ph("ui-v-turq")],
  "marina-boulevard": [cm("pin-marina"), "/images/marina/ev-regatta.jpg", ph("ui-g-table"), "/images/marina/ev-market.jpg", ph("ui-v-pavilion-dusk")],
  resort: [cm("pin-resort"), "/images/hotels/beachfront-resort.jpg", ph("ui-g-interior"), "/images/hotels/lighthouse-hotel.jpg", ph("ui-g-pool")],
  golf: [cm("pin-golf"), "/images/experiences/golf.jpg", "/images/hotels/golf-spa.jpg", ph("ui-g-terraces")],
  "town-centre": ["/images/hotels/town-centre-suites.jpg", "/images/experiences/dining.jpg", ph("ui-expcenter-court"), ph("ui-g-music"), ph("ui-g-colonnade")],
};

/**
 * The hero line and the Overview of the communities built from their card: a line of two or three even lines
 * (client edit 28 Oct, hero balance) and an Overview with a statement and three facts, all from the site and the
 * factsheet (22 km of lagoon frontage, 850K sqm swimmable lagoons, 370 marina berths, 980K sqm golf course,
 * 3,500+ hotel rooms).
 */
const detail: Record<string, { line: string; overview: OverviewData }> = {
  lagoon: { line: "Districts woven through 22 kilometres of waterfront and lagoons, with water taxis to the marina and boats passing your door.",
    overview: { tag: "Overview · Waterways", title: "Boats pass your door",
      body: "Homes open onto calm water, with swimmable lagoons woven through the neighbourhoods and water taxis across to the marina.",
      facts: [["22 km", "Waterfront and lagoons"], ["850K sqm", "Swimmable lagoons"], ["Water taxis", "From the lagoons to the marina"]] } },
  "marina-boulevard": { line: "An international marina and promenade, the social centre of the city, where boating, dining and public life meet on the water.",
    overview: { tag: "Overview · Waterfront", title: "The social heart of the city",
      body: "The marina brings together boating, hospitality, dining, retail and public life on one waterfront, for residents and visitors alike.",
      facts: [["370", "Berths in the international marina"], ["2", "Marinas, international and local"], ["24/7", "Waterfront promenade"]] } },
  resort: { line: "Hotels and residences share the same streets, with international brands and boutique hospitality along the coast. Service is permanent here.",
    overview: { tag: "Overview · Hospitality", title: "Service is permanent here",
      body: "Hotels and residences share the same streets, so hotel service is part of daily life, in every season, not only in summer.",
      facts: [["3,500+", "Hotel rooms planned"], ["International", "Brands and boutique hotels"], ["Year-round", "Open in every season"]] } },
  golf: { line: "Homes framed by an 18-hole championship course by the sea: 980,000 square metres of greens, green all year.",
    overview: { tag: "Overview · Greens", title: "Eighteen holes by the sea, green all year",
      body: "Homes are framed by the fairways of a championship course by the Mediterranean, in a city built to be lived in all year.",
      facts: [["18", "Holes, championship course"], ["980K sqm", "Golf course area"], ["Year-round", "Green in every season"]] } },
  "town-centre": { line: "Homes above shops and cafés on the commercial boulevard, with dining, retail and waterfront tables all within a short walk.",
    overview: { tag: "Overview · Town centre", title: "Everything within a short walk",
      body: "Homes sit above shops and cafés on the commercial boulevard, in town centres planned so daily life is a short walk away.",
      facts: [["Boulevard", "The city's commercial street"], ["Walkable", "Shops and cafés below the homes"], ["Waterfront", "Tables on the marina quay"]] } },
};

const fromCard = (slug: string): Neighbourhood => {
  const c = communities.find((x) => x.slug === slug)!;
  const short = c.name.replace(/ (communities|neighbourhoods|districts|community|quarter)$/i, "");
  return {
    slug,
    hero: { eyebrow: "Neighbourhood", name: short, line: detail[slug]?.line ?? c.line, photo: c.photo, alt: c.name },
    overview: detail[slug]?.overview ?? { tag: "Overview", title: c.name, body: c.body },
    masterplan: { title: `${short} on the masterplan`, body: c.line },
    gallery: pageGallery(short, shots[slug]),
  };
};

export const neighbourhoods: Neighbourhood[] = communities.map((c) => (c.slug === "beachfront" ? beachfront : fromCard(c.slug)));
