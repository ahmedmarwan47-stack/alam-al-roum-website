/**
 * Every masterplan on the site is a view of one master image, in "plan units": the master is 1512 × 839 units
 * whatever its pixel size, and every pin (here, in lib/content.ts for Home and lib/communities.ts for the
 * communities) is placed in those units. A view is the box of the master it shows; MasterplanMap places the pins
 * inside it, so a crop can change without touching a pin.
 *
 *   Home, About            the whole master (fullPlan)
 *   Communities listing    the built-up city, community pins only (planViews.communities)
 *   /communities/<slug>    that district's own crop (planViews[slug]) with the places inside it (districtPins[slug])
 *
 * The crops are cut by scripts/masterplan-crops.py, which also writes lib/masterplan-crops.json (the boxes and the
 * image paths). To swap in a new master: replace public/images/photo/masterplan-aerial.webp and re-run that script
 * (instructions at its top). Places that appear on the client's
 * USP board (cityPlaces, the gates, and the same places on the community pages) use the board's projected positions;
 * the other community-page amenities are still placeholders read off the render.
 */
import crops from "./masterplan-crops.json";
import { communities } from "./communities";

export type PlanView = { src: string; x: number; y: number; w: number; h: number };
/** A pin: centre in plan units; `side` forces its label left or right of the pin (default: whichever side fits). */
/** `n` is the number drawn in the pin (default: its place in the list); `kind: "gate"` draws it as a gate. */
export type PlanPin = { title: string; body: string; x: number; y: number; photo: string; href?: string; side?: "left" | "right"; n?: number; kind?: "gate" };

export const PLAN = crops.plan;
export const fullPlan: PlanView = { src: crops.master, x: 0, y: 0, w: PLAN.w, h: PLAN.h };
export const planViews = crops.crops as Record<string, PlanView>;

const ph = (f: string) => `/images/photo/${f}.webp`;
const GATE = { body: "One of the city's seven gates, staffed around the clock.", photo: "/images/sustainability/c4-large.webp" };
/** The seven gates, numbered and placed as on the client's board (see cityPlaces). */
const GATES: PlanPin[] = ([[1122, 97], [864, 118], [723, 156], [612, 204], [454, 253], [287, 321], [377, 392]] as const)
  .map(([x, y], i) => ({ n: i + 1, kind: "gate" as const, title: `Gate ${i + 1}`, ...GATE, x, y }));
const gate = (n: number, extra: Partial<PlanPin> = {}) => ({ ...GATES[n - 1], ...extra });
const TOWN = { title: "Town centre", body: "Shops, cafés and squares on the commercial boulevard.", photo: "/images/communities/town-centre.webp", href: "/communities/town-centre" };

/** Communities listing: one pin per community, nothing else (each opens its card, Explore goes to its page). */
export const communityPins: PlanPin[] = communities.map((c) => ({ title: c.name, body: c.line, x: c.pin.x, y: c.pin.y, photo: c.pinPhoto, href: `/communities/${c.slug}` }));

/**
 * About: the client's "Project Masterplan USP's" board, numbered as on the board: twelve highlights (some marked in
 * more than one place) and the seven gates. Positions are not read by eye: the board's pin centres were projected
 * onto this render through two fitted homographies (board -> SOM top-down plan by 744 SIFT matches, under 3 px;
 * plan -> this aerial by 28 lagoon centroids, median 2.8 px on the 2400 px render), then scaled to plan units.
 */
const USP = (n: number, title: string, body: string, photo: string, href: string | undefined, ...at: [number, number][]): PlanPin[] =>
  at.map(([x, y]) => ({ n, title, body, photo, href, x, y }));
export const cityPlaces: PlanPin[] = [
  ...USP(1, "18-hole golf course", "A championship course by the sea, green all year.", "/images/experiences/golf.webp", "/experiences/golf", [1306, 175]),
  ...USP(2, "Vibrant town centres", "Walkable centres with shops, cafés and squares.", "/images/communities/town-centre.webp", "/communities/town-centre", [1133, 193], [551, 350]),
  ...USP(3, "Open-sea lagoon & promenade", "22 km of lagoon open to the Mediterranean, with a promenade along it.", ph("ui-lagoon-clear"), "/communities/lagoon", [1001, 223]),
  ...USP(4, "Commercial boulevard", "The city's main street, from the expo centre down to the marina.", "/images/experiences/dining.webp", "/experiences/retail-dining", [801, 267]),
  ...USP(5, "International & local marina", "370 berths, with a local harbour and 120 dry-stack berths.", "/images/marina/ev-regatta.webp", "/experiences/marina", [947, 391]),
  ...USP(6, "7 km beach & promenade", "Open Mediterranean sand along the whole coast.", ph("ui-g-beach"), "/experiences/beach", [1223, 342], [749, 487]),
  ...USP(7, "Neighbourhood swimmable lagoons", "Calm, clear water a short walk from home.", "/images/sustainability/c2-large.webp", "/communities/lagoon", [574, 278], [895, 187], [1042, 148]),
  ...USP(8, "Freezone", "A business free zone on the city's inland edge, by the highway.", ph("ui-expcenter-day"), undefined, [755, 166]),
  ...USP(9, "Polo & equestrian club", "Stables, arenas and a polo field on the open land.", "/images/experiences/hero.webp", undefined, [800, 144]),
  ...USP(10, "Events center", "An iconic venue for concerts, shows and celebrations.", ph("ui-v-pavilion-dusk"), "/events", [1022, 391]),
  ...USP(11, "Expo center", "An international expo and convention centre.", ph("ui-expcenter-facade"), undefined, [762, 226]),
  ...USP(12, "Postgraduate university campus", "A postgraduate campus at the city's eastern edge.", ph("ui-expcenter-lobby"), undefined, [399, 272]),
  ...GATES,
];

/** Each community page: the places inside its crop (gates, beach access, lagoons, parks, squares), in plan units. */
export const districtPins: Record<string, PlanPin[]> = {
  beachfront: [
    { title: "Beach & promenade", body: "7.2 km of open sand, with a shaded promenade along its length.", x: 1223, y: 342, photo: ph("ui-g-beach"), href: "/experiences/beach" },
    { title: "Beach club", body: "Private cabanas and a pool on the sand.", x: 1290, y: 296, photo: ph("ui-v-lounger") },
    { title: "Clubhouse", body: "Lounge, dining and residents' events.", x: 1231, y: 265, photo: ph("ui-expcenter-lounge") },
    { title: "Kids' club & splash park", body: "Supervised play and a splash park.", x: 1110, y: 262, photo: "/images/experiences/sports.webp" },
    { title: "Retail village & mosque", body: "Everyday shops, cafés and a mosque, a short walk from home.", x: 1058, y: 302, photo: ph("ui-g-table") },
    { title: "Water-taxi stop", body: "Boats along the lagoon canal to the marina.", x: 1203, y: 214, photo: "/images/hotels/lagoon-retreat.webp" },
  ],
  lagoon: [
    { title: "Swimmable lagoon", body: "Clear, calm water with sandy edges, steps from home.", x: 574, y: 278, photo: "/images/sustainability/c2-large.webp" },
    { title: "West lagoon", body: "A second swimmable lagoon at the district's western edge.", x: 450, y: 322, photo: ph("ui-lagoon-clear") },
    { title: "Lagoon park", body: "Shaded lawns and play areas along the water.", x: 600, y: 335, photo: "/images/sustainability/c1-large.webp" },
    { title: "Open-sea lagoon", body: "Part of the 22 km lagoon that opens to the Mediterranean.", x: 652, y: 384, photo: ph("ui-v-turq") },
    { title: "Water-taxi stop", body: "Boats to the marina and the town centres.", x: 741, y: 388, photo: "/images/hotels/lagoon-retreat.webp" },
    { ...TOWN, x: 551, y: 350 },
    gate(4),
    gate(5),
  ],
  "marina-boulevard": [
    { title: "International marina", body: "370 berths for visiting yachts and residents' boats.", x: 1005, y: 398, photo: "/images/marina/ev-regatta.webp", href: "/experiences/marina", side: "left" },
    { title: "Local marina & dry stack", body: "A local harbour with 120 dry-stack berths.", x: 930, y: 435, photo: "/images/experiences/marina.webp", side: "left" },
    { title: "The lighthouse", body: "The city's landmark, at the head of the marina.", x: 953, y: 382, photo: ph("ui-g-boardwalk"), side: "left" },
    { title: "Events center", body: "An iconic venue on the marina's breakwater.", x: 1022, y: 391, photo: ph("ui-v-pavilion-dusk"), href: "/events" },
    { title: "Town square", body: "The main square, at the head of the marina.", x: 962, y: 330, photo: ph("ui-expcenter-court") },
    { title: "Commercial boulevard", body: "Shops, cafés and offices on the city's main street.", x: 801, y: 267, photo: ph("ui-g-table"), href: "/experiences/retail-dining" },
    { title: "East beach", body: "Sand on the open shore beside the marina.", x: 1120, y: 340, photo: ph("ui-g-beach"), href: "/experiences/beach", side: "left" },
  ],
  resort: [
    { title: "Resort hotel", body: "A resort on the open shore, with pools and a spa.", x: 500, y: 507, photo: "/images/hotels/beachfront-resort.webp", href: "/experiences/hotels" },
    { title: "Lagoon-island homes", body: "Residences on the island inside the lagoon's loop.", x: 620, y: 440, photo: ph("ui-g-terraces") },
    { title: "Open-sea lagoon", body: "The lagoon winds around the district to the sea.", x: 545, y: 474, photo: ph("ui-v-turq") },
    { title: "Lagoon inlet", body: "Where the lagoon meets the sea, between two breakwaters.", x: 678, y: 535, photo: ph("ui-g-coast") },
    { title: "Beach & promenade", body: "Open sand along the district's southern edge.", x: 749, y: 487, photo: ph("ui-g-beach"), href: "/experiences/beach" },
    { title: "Boutique hotel", body: "A boutique hotel between the beach and the boulevard.", x: 843, y: 436, photo: "/images/hotels/lighthouse-hotel.webp", href: "/experiences/hotels", side: "left" },
  ],
  golf: [
    { title: "18-hole championship course", body: "A championship course by the sea, green all year.", x: 1306, y: 175, photo: "/images/experiences/golf.webp", href: "/experiences/golf" },
    { title: "Golf clubhouse", body: "Dining, a pro shop and a terrace over the 18th green.", x: 1238, y: 153, photo: "/images/hotels/golf-spa.webp", side: "left" },
    { title: "Fairway homes", body: "Villas set along the fairways.", x: 1134, y: 117, photo: ph("ui-g-terraces") },
    { title: "Lagoon promenade", body: "A waterside walk along the open-sea lagoon.", x: 1197, y: 218, photo: ph("ui-lagoon-clear") },
    { ...TOWN, x: 1133, y: 193, side: "left" },
    { title: "Beach", body: "The open shore at the lagoon's mouth.", x: 1398, y: 212, photo: ph("ui-g-beach"), href: "/experiences/beach", side: "left" },
    gate(1),
  ],
  "town-centre": [
    { title: "Commercial boulevard", body: "Homes above shops and cafés on the city's main street.", x: 801, y: 267, photo: "/images/experiences/dining.webp", href: "/experiences/retail-dining" },
    { title: "Expo center", body: "An international expo and convention centre.", x: 762, y: 226, photo: ph("ui-expcenter-day") },
    { title: "Boulevard basin", body: "A water square at the heart of the boulevard.", x: 829, y: 296, photo: ph("ui-v-ripples") },
    { title: "Town square", body: "The main square, at the head of the marina.", x: 925, y: 336, photo: ph("ui-expcenter-court") },
    { title: "Lagoon promenade", body: "A waterside walk along the open-sea lagoon.", x: 935, y: 266, photo: ph("ui-lagoon-clear") },
    { title: "Marina", body: "The international marina and the lighthouse.", x: 990, y: 398, photo: "/images/experiences/marina.webp", href: "/communities/marina-boulevard", side: "left" },
  ],
};
