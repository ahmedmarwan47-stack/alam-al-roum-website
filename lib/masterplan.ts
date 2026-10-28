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
 * image paths). To swap in a new master: replace public/images/photo/masterplan-aerial.jpg and re-run that script
 * (instructions at its top). Pin positions below are placeholders read off the current render and the factsheet's
 * numbered masterplan (AAR fact sheet, p. 8); confirm them against the client's final plan.
 */
import crops from "./masterplan-crops.json";
import { communities } from "./communities";

export type PlanView = { src: string; x: number; y: number; w: number; h: number };
/** A pin: centre in plan units; `side` forces its label left or right of the pin (default: whichever side fits). */
export type PlanPin = { title: string; body: string; x: number; y: number; photo: string; href?: string; side?: "left" | "right" };

export const PLAN = crops.plan;
export const fullPlan: PlanView = { src: crops.master, x: 0, y: 0, w: PLAN.w, h: PLAN.h };
export const planViews = crops.crops as Record<string, PlanView>;

const ph = (f: string) => `/images/photo/${f}.jpg`;
const GATE = { body: "One of the city's seven gates, staffed around the clock.", photo: "/images/sustainability/c4-large.jpg" };
const TOWN = { title: "Town centre", body: "Shops, cafés and squares on the commercial boulevard.", photo: "/images/communities/town-centre.jpg", href: "/communities/town-centre" };

/** Communities listing: one pin per community, nothing else (each opens its card, Explore goes to its page). */
export const communityPins: PlanPin[] = communities.map((c) => ({ title: c.name, body: c.line, x: c.pin.x, y: c.pin.y, photo: c.pinPhoto, href: `/communities/${c.slug}` }));

/** About: the whole city, with the eleven places numbered on the factsheet's masterplan (positions mapped from it). */
export const cityPlaces: PlanPin[] = [
  { title: "18-hole golf course", body: "A championship course by the sea, green all year.", x: 1276, y: 175, photo: "/images/experiences/golf.jpg", href: "/experiences/golf" },
  { title: "Vibrant town centres", body: "Walkable centres with shops, cafés and squares.", x: 1138, y: 186, photo: "/images/communities/town-centre.jpg", href: "/communities/town-centre" },
  { title: "Open-sea lagoon & promenade", body: "22 km of lagoon open to the Mediterranean, with a promenade along it.", x: 1004, y: 224, photo: ph("ui-lagoon-clear"), href: "/communities/lagoon" },
  { title: "Commercial boulevard", body: "The city's main street, from the expo centre down to the marina.", x: 815, y: 280, photo: "/images/experiences/dining.jpg", href: "/experiences/retail-dining" },
  { title: "International & local marina", body: "370 berths, with a local harbour and 120 dry-stack berths.", x: 975, y: 409, photo: "/images/marina/ev-regatta.jpg", href: "/experiences/marina" },
  { title: "7 km beach & promenade", body: "Open Mediterranean sand along the whole coast.", x: 748, y: 482, photo: ph("ui-g-beach"), href: "/experiences/beach" },
  { title: "Neighbourhood swimmable lagoons", body: "Calm, clear water a short walk from home.", x: 565, y: 287, photo: "/images/sustainability/c2-large.jpg", href: "/communities/lagoon" },
  { title: "Freezone", body: "A business free zone at the city's northern edge.", x: 741, y: 166, photo: ph("ui-expcenter-day") },
  { title: "Polo & equestrian club", body: "Stables, arenas and a polo field on the open land.", x: 803, y: 129, photo: "/images/experiences/hero.jpg" },
  { title: "Events center", body: "An iconic venue for concerts, shows and celebrations.", x: 1040, y: 399, photo: ph("ui-v-pavilion-dusk"), href: "/events" },
  { title: "Expo center", body: "An international expo and convention centre.", x: 778, y: 219, photo: ph("ui-expcenter-facade") },
];

/** Each community page: the places inside its crop (gates, beach access, lagoons, parks, squares), in plan units. */
export const districtPins: Record<string, PlanPin[]> = {
  beachfront: [
    { title: "Beach & promenade", body: "7.2 km of open sand, with a shaded promenade along its length.", x: 1205, y: 333, photo: ph("ui-g-beach"), href: "/experiences/beach" },
    { title: "Beach club", body: "Private cabanas and a pool on the sand.", x: 1290, y: 296, photo: ph("ui-v-lounger") },
    { title: "Clubhouse", body: "Lounge, dining and residents' events.", x: 1231, y: 265, photo: ph("ui-expcenter-lounge") },
    { title: "Kids' club & splash park", body: "Supervised play and a splash park.", x: 1110, y: 262, photo: "/images/experiences/sports.jpg" },
    { title: "Retail village & mosque", body: "Everyday shops, cafés and a mosque, a short walk from home.", x: 1058, y: 302, photo: ph("ui-g-table") },
    { title: "Water-taxi stop", body: "Boats along the lagoon canal to the marina.", x: 1203, y: 214, photo: "/images/hotels/lagoon-retreat.jpg" },
    { title: "East gate", ...GATE, x: 1330, y: 152 },
  ],
  lagoon: [
    { title: "Swimmable lagoon", body: "Clear, calm water with sandy edges, steps from home.", x: 627, y: 311, photo: "/images/sustainability/c2-large.jpg" },
    { title: "West lagoon", body: "A second swimmable lagoon at the district's western edge.", x: 450, y: 322, photo: ph("ui-lagoon-clear") },
    { title: "Lagoon park", body: "Shaded lawns and play areas along the water.", x: 560, y: 333, photo: "/images/sustainability/c1-large.jpg" },
    { title: "Open-sea lagoon", body: "Part of the 22 km lagoon that opens to the Mediterranean.", x: 652, y: 384, photo: ph("ui-v-turq") },
    { title: "Water-taxi stop", body: "Boats to the marina and the town centres.", x: 741, y: 388, photo: "/images/hotels/lagoon-retreat.jpg" },
    { ...TOWN, x: 757, y: 230 },
    { title: "North gate", ...GATE, x: 525, y: 238 },
  ],
  "marina-boulevard": [
    { title: "International marina", body: "370 berths for visiting yachts and residents' boats.", x: 1005, y: 398, photo: "/images/marina/ev-regatta.jpg", href: "/experiences/marina" },
    { title: "Local marina & dry stack", body: "A local harbour with 120 dry-stack berths.", x: 930, y: 435, photo: "/images/experiences/marina.jpg", side: "left" },
    { title: "The lighthouse", body: "The city's landmark, at the head of the marina.", x: 953, y: 382, photo: ph("ui-g-boardwalk"), side: "left" },
    { title: "Events center", body: "An iconic venue on the marina's breakwater.", x: 1045, y: 418, photo: ph("ui-v-pavilion-dusk"), href: "/events" },
    { title: "Town square", body: "The main square, at the head of the marina.", x: 962, y: 330, photo: ph("ui-expcenter-court") },
    { title: "Commercial boulevard", body: "Shops, cafés and offices on the city's main street.", x: 823, y: 313, photo: ph("ui-g-table"), href: "/experiences/retail-dining" },
    { title: "East beach", body: "Sand on the open shore beside the marina.", x: 1120, y: 340, photo: ph("ui-g-beach"), href: "/experiences/beach", side: "left" },
  ],
  resort: [
    { title: "Resort hotel", body: "A resort on the open shore, with pools and a spa.", x: 500, y: 507, photo: "/images/hotels/beachfront-resort.jpg", href: "/experiences/hotels" },
    { title: "Lagoon-island homes", body: "Residences on the island inside the lagoon's loop.", x: 620, y: 440, photo: ph("ui-g-terraces") },
    { title: "Open-sea lagoon", body: "The lagoon winds around the district to the sea.", x: 545, y: 474, photo: ph("ui-v-turq") },
    { title: "Lagoon inlet", body: "Where the lagoon meets the sea, between two breakwaters.", x: 678, y: 535, photo: ph("ui-g-coast") },
    { title: "Beach & promenade", body: "Open sand along the district's southern edge.", x: 757, y: 491, photo: ph("ui-g-beach"), href: "/experiences/beach" },
    { title: "Boutique hotel", body: "A boutique hotel between the beach and the boulevard.", x: 843, y: 436, photo: "/images/hotels/lighthouse-hotel.jpg", href: "/experiences/hotels", side: "left" },
    { title: "West gate", ...GATE, x: 396, y: 482 },
  ],
  golf: [
    { title: "18-hole championship course", body: "A championship course by the sea, green all year.", x: 1290, y: 172, photo: "/images/experiences/golf.jpg", href: "/experiences/golf" },
    { title: "Golf clubhouse", body: "Dining, a pro shop and a terrace over the 18th green.", x: 1238, y: 153, photo: "/images/hotels/golf-spa.jpg", side: "left" },
    { title: "Fairway homes", body: "Villas set along the fairways.", x: 1134, y: 117, photo: ph("ui-g-terraces") },
    { title: "Lagoon promenade", body: "A waterside walk along the open-sea lagoon.", x: 1197, y: 218, photo: ph("ui-lagoon-clear") },
    { ...TOWN, x: 1120, y: 186, side: "left" },
    { title: "Beach", body: "The open shore at the lagoon's mouth.", x: 1398, y: 212, photo: ph("ui-g-beach"), href: "/experiences/beach", side: "left" },
    { title: "North gate", ...GATE, x: 1360, y: 104, side: "left" },
  ],
  "town-centre": [
    { title: "Commercial boulevard", body: "Homes above shops and cafés on the city's main street.", x: 801, y: 270, photo: "/images/experiences/dining.jpg", href: "/experiences/retail-dining" },
    { title: "Expo center", body: "An international expo and convention centre.", x: 757, y: 230, photo: ph("ui-expcenter-day") },
    { title: "Boulevard basin", body: "A water square at the heart of the boulevard.", x: 829, y: 296, photo: ph("ui-v-ripples") },
    { title: "Town square", body: "The main square, at the head of the marina.", x: 925, y: 336, photo: ph("ui-expcenter-court") },
    { title: "Lagoon promenade", body: "A waterside walk along the open-sea lagoon.", x: 935, y: 266, photo: ph("ui-lagoon-clear") },
    { title: "Marina", body: "The international marina and the lighthouse.", x: 990, y: 398, photo: "/images/experiences/marina.jpg", href: "/communities/marina-boulevard", side: "left" },
    { title: "North gate", ...GATE, x: 690, y: 190 },
  ],
};
