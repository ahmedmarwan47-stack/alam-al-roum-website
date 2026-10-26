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
import { gallery } from "@/lib/content";
import { communities } from "@/lib/communities";

const n = (f: string) => `/images/neighbourhood/${f}.jpg`;

export type Neighbourhood = {
  slug: string; hero: SingleHeroData; overview: OverviewData; units?: HotelsData; facilities?: LandmarksData;
  masterplan: { title: string; body: string }; gallery: GalleryData;
};

const beachfront: Neighbourhood = {
  slug: "beachfront",
  hero: { eyebrow: "Neighbourhood · Shoreline", name: "Beachfront", line: "Homes along the open shoreline.", photo: n("hero-beachfront"), alt: "The beachfront shoreline",
    facts: [["7.2 km", "Private shoreline"], ["3 min", "Walk to the beach"], ["3", "Unit types"]] },
  overview: { tag: "Overview · Shoreline", title: "The sea is the first thing you see",
    body: "Beachfront communities hold the edge of the city. Homes face the Mediterranean with nothing between you and the horizon. Low-rise architecture, sunlit terraces, and direct beach access define the district." },
  // drawer copy follows the Figma unit drawer (11128:14826), with each unit's figures from its card
  units: { tag: "Residences", title: "Unit types", body: "Three ways to live on the shore. Each with its own floor plans, specifications, and brochure.",
    cols: "lg:grid-cols-3", bodyWidth: 560, kind: "unit", extra: [n("f1-inset")],
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
  gallery: { ...gallery, title: [{ t: "Beachfront" }, { t: "shots", br: true }] },
};

const fromCard = (slug: string): Neighbourhood => {
  const c = communities.find((x) => x.slug === slug)!;
  const short = c.name.replace(/ (communities|neighbourhoods|districts|community|quarter)$/i, "");
  return {
    slug,
    hero: { eyebrow: "Neighbourhood", name: short, line: c.line, photo: c.photo, alt: c.name },
    overview: { tag: "Overview", title: c.name, body: c.body },
    masterplan: { title: `${short} on the masterplan`, body: c.line },
    gallery: { ...gallery, title: [{ t: short }, { t: "shots", br: true }] },
  };
};

export const neighbourhoods: Neighbourhood[] = communities.map((c) => (c.slug === "beachfront" ? beachfront : fromCard(c.slug)));
