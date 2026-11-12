/** Communities copy, from the Figma UI Design page (List Neighbourhoods/Communities • Desktop, 10921:7384). */
/** Each community has one photo everywhere (Home, this list, the map pins, the menu, More communities): its own page's
 *  hero photo (lib/neighbourhoods.ts), so the picture someone taps is the one they land on. */
const c = (f: string) => `/images/communities/${f}.webp`;
const ph = (f: string) => `/images/photo/${f}.webp`;
export const communityPhoto = {
  beachfront: ph("ui-g-beach"), lagoon: ph("ui-lagoon-clear"), "marina-boulevard": ph("ui-g-boardwalk"),
  resort: ph("ui-v-lounge"), golf: "/images/experiences/gen/golf-course.webp", "town-centre": ph("ui-expcenter-day"),
} as const;

export const comHero = {
  pre: "Communities",
  title: [{ t: "One light" }, { t: "With the city", i: true }, { t: "since the first stone", br: true }],
  body: "The lighthouse stood here first. Every district, from the beachfront to the golf greens, was planned in relation to it.",
  photo: c("hero"), alt: "A family on a hillside by the sea",
};

export const comSection = {
  tag: "Communities", title: "Six ways to live", body: "Each district has its own character. All share the sea.",
  toggle: ["Map", "Grid"] as const,
};

/**
 * The six communities. `pin` is the hotspot centre in masterplan plan units (1512 × 839, see lib/masterplan.ts);
 * `card` is the grid card size from Figma (the grid is a staggered three-column flow).
 */
export const communities = [
  { slug: "beachfront", name: "Beachfront community", line: "Homes set along 7.2 km of Mediterranean sand, with private beach clubs.",
    body: "Homes set along 7.2 kilometres of Mediterranean sand. The water is the first thing you see.", photo: communityPhoto.beachfront, pinPhoto: communityPhoto.beachfront, pin: { x: 1081, y: 293 }, card: { w: 492, h: 615 } },
  { slug: "lagoon", name: "Lagoon neighbourhood", line: "Districts woven through 22 km of waterfront and lagoons, with water taxis to the marina.",
    body: "Districts woven through 22 kilometres of waterfront and lagoons. Boats pass your door.", photo: communityPhoto.lagoon, pinPhoto: communityPhoto.lagoon, pin: { x: 643, y: 316 }, card: { w: 380, h: 475 } },
  { slug: "marina-boulevard", name: "Marina boulevard", line: "An international marina and promenade, the social centre of the city.",
    body: "An international marina and promenade. The social centre of the city.", photo: communityPhoto["marina-boulevard"], pinPhoto: communityPhoto["marina-boulevard"], pin: { x: 975, y: 361 }, card: { w: 496, h: 744 } },
  { slug: "resort", name: "Resort district", line: "Hotels and residences share the same streets. Service is permanent here.",
    body: "Hotels and residences share the same streets. Service is permanent here.", photo: communityPhoto.resort, pinPhoto: communityPhoto.resort, pin: { x: 544, y: 437 }, card: { w: 496, h: 620 } },
  { slug: "golf", name: "Golf community", line: "Homes framed by an 18-hole championship course, green all year.",
    body: "Homes framed by an 18-hole championship course. Green all year.", photo: communityPhoto.golf, pinPhoto: communityPhoto.golf, pin: { x: 1250, y: 165 }, card: { w: 380, h: 475 } },
  { slug: "town-centre", name: "Town centre quarter", line: "Homes above shops and cafés on the commercial boulevard.",
    body: "Homes above shops and cafés on the commercial boulevard. Everything within a short walk.", photo: communityPhoto["town-centre"], pinPhoto: communityPhoto["town-centre"], pin: { x: 805, y: 262 }, card: { w: 492, h: 744 } },
];
