/** Communities copy, from the Figma UI Design page (List Neighbourhoods/Communities • Desktop, 10921:7384). */
const c = (f: string) => `/images/communities/${f}.jpg`;

export const comHero = {
  pre: "Communities",
  title: [{ t: "One light" }, { t: "With the city", i: true }, { t: "Year after year", br: true }],
  body: "The lighthouse stood here first. Everything else was planned in relation to it.",
  photo: c("hero"), alt: "A family on a hillside by the sea",
};

export const comSection = {
  tag: "Communities", title: "Six ways to live", body: "Each district has its own character. All share the sea.",
  toggle: ["Map", "Grid"] as const, masterplan: c("masterplan"),
};

/**
 * The six communities. `pin` is the hotspot centre on the 1512 × 839 masterplan (the town centre has no pin);
 * `card` is the grid card size from Figma (the grid is a staggered three-column flow).
 */
export const communities = [
  { slug: "beachfront", name: "Beachfront communities", line: "Homes set along 7.2 km of Mediterranean sand, with private beach clubs.",
    body: "Homes set along 7.2 kilometres of Mediterranean sand. The water is the first thing you see.", photo: c("beachfront"), pinPhoto: c("pin-beachfront"), pin: { x: 1081, y: 293 }, card: { w: 492, h: 615 } },
  { slug: "lagoon", name: "Lagoon neighbourhoods", line: "Districts woven through 22 km of waterfront and lagoons, with water taxis to the marina.",
    body: "Districts woven through 22 kilometres of waterfront and lagoons. Boats pass your door.", photo: c("lagoon"), pinPhoto: c("pin-lagoon"), pin: { x: 643, y: 316 }, card: { w: 380, h: 475 } },
  { slug: "marina-boulevard", name: "Marina boulevard", line: "An international marina and promenade, the social centre of the city.",
    body: "An international marina and promenade. The social centre of the city.", photo: c("marina"), pinPhoto: c("pin-marina"), pin: { x: 975, y: 361 }, card: { w: 496, h: 744 } },
  { slug: "resort", name: "Resort districts", line: "Hotels and residences share the same streets. Service is permanent here.",
    body: "Hotels and residences share the same streets. Service is permanent here.", photo: c("resort"), pinPhoto: c("pin-resort"), pin: { x: 544, y: 437 }, card: { w: 496, h: 620 } },
  { slug: "golf", name: "Golf community", line: "Homes framed by an 18-hole championship course, green all year.",
    body: "Homes framed by an 18-hole championship course. Green all year.", photo: c("golf"), pinPhoto: c("pin-golf"), pin: { x: 1247, y: 89 }, card: { w: 380, h: 475 } },
  { slug: "town-centre", name: "Town centre quarter", line: "Homes above shops and cafés on the commercial boulevard.",
    body: "Homes above shops and cafés on the commercial boulevard. Everything within a short walk.", photo: c("town-centre"), pinPhoto: c("town-centre"), pin: null, card: { w: 492, h: 744 } },
];
