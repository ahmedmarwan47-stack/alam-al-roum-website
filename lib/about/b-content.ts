/** About copy for The Story, Milestones, Nearby and the visa FAQ, taken from the Figma UI Design page (About • Desktop). */
const img = (f: string) => `/images/about/${f}`;

/**
 * The Story — Figma "Motion Study · The Story (dome + scattered words)" (10673:8318).
 * Positions are in the 1512 × 1024 motion-study frame; `scatter` is where each headline word floats in
 * state 3 "Culture Covers" before it gathers into the headline in state 4.
 */
export const story = {
  history: {
    photo: img("b-story-history.jpg"),
    label: "The Story · History",
    line: "This Shoreline Guided Sailors Home",
    accent: "For Two Thousand Years.",
  },
  // "A place taking shape" (UI / Motion Study · The Story, 11027:19127): the Experience Centre, in their real photos
  culture: {
    word: "Architecture",
    // headline lines, each word with its state-3 scatter position (frame x, y)
    lines: [
      [{ t: "Built In", x: 140, y: 250 }, { t: "Limestone,", x: 1080, y: 180 }],
      [{ t: "Open To", x: 260, y: 560 }, { t: "The Sea,", x: 980, y: 520 }],
      [{ t: "Made To Be", x: 180, y: 840 }, { t: "Lived In.", x: 1060, y: 820 }],
    ],
    body: "The Experience Centre is the first part of the city to stand: limestone walls, shaded courtyards and rooms that open onto the sea, built to be lived in every month of the year.",
    photos: [
      { src: img("b-place-lounge.jpg"), alt: "The Experience Centre lounge, sea paintings above white sofas", x: 60, y: 300, w: 300, h: 400 },
      { src: img("b-place-courtyard.jpg"), alt: "The Experience Centre courtyard with its stone sculpture and reflecting pool", x: 1152, y: 200, w: 300, h: 400 },
      { src: img("b-place-lobby.jpg"), alt: "The Experience Centre lobby, glazed onto the sea", x: 1092, y: 640, w: 360, h: 200 },
    ],
  },
  greatness: {
    photo: img("b-story-greatness.jpg"),
    word: "Greatness",
    line: "Greatness Is What",
    accent: "Remains",
    body: "Great cities are not measured by their launch but by what they still mean a century later. Alam Al Roum is built on that standard: permanence, scale, and craft.",
  },
};

/** Milestones — About frame 10921:8293, six "UI / Milestone" instances (10979:18569) with their swapped photos. */
export const milestones = {
  tag: "Timeline",
  title: "Phase one from agreement to handover",
  body: "The first phase is underway. Construction begins in 2026 and the first residents arrive in 2030.",
  items: [
    { year: "2025", title: "Agreement signed", photo: img("b-ms-agreement.jpg"),
      body: "Qatari Diar and the Government of Egypt sign the agreement to develop 4,902 feddan of Mediterranean coast." },
    { year: "2026", title: "Construction launches", photo: img("b-ms-construction.jpg"),
      body: "Phase one begins and breaks ground. Site works begin along the 7.2 km shoreline as the first district takes shape." },
    { year: "2027", title: "Lagoons & infrastructure", photo: img("b-ms-lagoons.jpg"),
      body: "Roads, utilities and the swimmable lagoons advance, linking every district to the coast and the airport." },
    { year: "2028", title: "Marina & golf", photo: img("b-ms-marina.jpg"),
      body: "The marina basin and the 18-hole championship golf course take shape along the sea, ready for first play." },
    { year: "2029", title: "First neighbourhoods", photo: img("b-ms-neighbourhoods.jpg"),
      body: "The first residential neighbourhoods near completion, with the town centre and beachfront opening nearby." },
    { year: "2030", title: "First residents", photo: img("b-ms-residents.jpg"),
      body: "Handover to the clients begins. The first residents arrive, and Alam Al Roum opens its doors as a living city by the sea." },
  ],
};

/**
 * Nearby — "UI / Coastline drawing (Nearby)" (10979:17194). Pins in frame coords (1512 × 1024);
 * `at` is where the drawing coastline reaches the pin (fraction of its half, measured from Alam Al Roum),
 * `tick` the leader length from the pin up to its label. Distances from the factsheet.
 */
export const nearby = {
  map: img("b-nearby-map.jpg"),
  coinPair: img("b-coin-pair.svg"),
  tag: "Nearby",
  title: "Close To The Whole Coast",
  sea: "Mediterranean Sea",
  origin: { x: 140.7, y: 292, name: "Alam Al Roum", note: "You are here" },
  places: [
    { name: "Marsa Matrouh", km: "14 km", x: 91.9, y: 279, tick: 72, side: "west", at: 0.374 },
    { name: "Almaza", km: "20 km", x: 223.5, y: 343, tick: 40, side: "east", at: 0.066 },
    { name: "Ras El Hekma", km: "40 km", x: 292.1, y: 332.6, tick: 112, side: "east", at: 0.111 },
    { name: "Marassi", km: "140 km", x: 578.4, y: 420.4, tick: 60, side: "east", at: 0.32 },
    { name: "Alamein", km: "170 km", x: 650.5, y: 468.2, tick: 150, side: "east", at: 0.375 },
    { name: "Alexandria", km: "280 km", x: 953, y: 333.6, tick: 60, side: "east", at: 0.593 },
    { name: "Cairo", km: "380 km", x: 1378.8, y: 772.3, tick: 44, side: "road", at: 1 },
  ],
  /** The desert road, Alamein → Cairo (Figma "Road to Cairo"), and its reveal box. */
  road: { x1: 650.5, y1: 468.2, x2: 1378.8, y2: 772.3, box: { x: 641, y: 466, w: 748, h: 316 } },
  /** How far the east coast has drawn at the end of Figma steps 2 "Neighbours" and 3 "The coast" (x = 332, 691). */
  steps: [0.161, 0.403],
} as const;

/** Visa FAQ — About frame 10921:8429 (all five answers are in Figma). */
export const visaFaq = {
  title: [{ t: "Coming To" }, { t: "Alam Al Roum?", br: true }],
  body: "What to know about visas before you travel.",
  cta: "Read All FAQs",
  items: [
    ["Do I need a visa to visit Egypt?", "Many nationalities can get a visa on arrival or apply online for an e-visa before travelling."],
    ["How long must my passport be valid?", "At least six months from the date you arrive in Egypt."],
    ["What kind of tourist visa will I get?", "Tourist visas are usually single or multiple entry, valid for up to 30 days."],
    ["Can property owners stay longer?", "Foreign property owners in Egypt may apply for a renewable residency permit."],
    ["Where can I check my requirements?", "Requirements vary by nationality. Check with the nearest Egyptian embassy or our team before you travel."],
  ] as [string, string][],
};
