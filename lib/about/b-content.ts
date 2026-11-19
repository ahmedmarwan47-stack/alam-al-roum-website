/** Copy for The Story (on Destination since 19 Nov), the About timeline, Nearby and the visa FAQ, from the Figma UI Design page. */
const img = (f: string) => `/images/about/${f}`;

/**
 * The Story — Figma "Motion Study · The Story (dome + scattered words)" (10673:8318).
 * Photo positions are in the 1512 × 1024 motion-study frame.
 */
export const story = {
  history: {
    photo: img("b-story-history.webp"),
    label: "The Story · History",
    line: "This Shoreline Guided Sailors Home",
    accent: "For Two Thousand Years.",
    // 15 Nov: the sticky chapters set every chapter the same way (a Haas title, then a paragraph), so this one gains a body
    body: "Ships crossing the Mediterranean steered by this headland long before there was a city here. The name Alam Al Roum keeps that memory, and the coast becomes a landmark again: a place people come home to.",
  },
  // UI / Motion Study · The Story (11027:19127), as placed on About (11027:19600): copy and photos from the instance.
  // The headline blurs in as one block (the site's text entrance); its words no longer fly in from scattered spots.
  culture: {
    word: "Architecture",
    lines: ["Built In Limestone,", "Open To The Sea,", "Made To Be Lived In."],
    body: "The Experience Center is the first part of the city to stand: limestone walls, shaded courtyards and rooms that open onto the sea, built to be lived in every month of the year.",
    photos: [
      { src: img("b-story-table.webp"), alt: "A woman in a white dress walking barefoot on stone", x: 60, y: 300, w: 300, h: 400 },
      { src: img("b-story-craft.webp"), alt: "A man in a linen shirt aboard a boat", x: 1152, y: 200, w: 300, h: 400 },
      { src: img("b-story-music.webp"), alt: "A woman at the bow of a sailboat", x: 1092, y: 640, w: 360, h: 200 },
    ],
  },
  greatness: {
    photo: img("b-story-sea.webp"),
    word: "The Sea",
    line: "Greatness Is What Remains",
    accent: "",
    body: "Great cities are not measured by their launch but by what they still mean a century later. Alam Al Roum is built on that standard: permanence, scale, and craft.",
  },
};

/**
 * Timeline · Qatari Diar since 2005 (Figma 11705:10710, 19 Nov): five milestones, opening on the first (2005).
 * Figma writes out only 2025 (its line and the signing photo); 2026 and 2030 keep the phase-one lines and photos they had,
 * and 2005 and 2006 are drafts from the Qatari Diar figures used on this page. PLACEHOLDER photos on 2005 and 2006
 * (two of the old phase-one milestone photos) until the real ones arrive.
 */
export const milestones = {
  tag: "Timeline",
  title: "Qatari Diar since 2005",
  body: "From its founding by the Qatar Investment Authority to the first residents of Alam Al Roum.",
  items: [
    { year: "2005", title: "Qatari Diar is founded", photo: img("b-ms-lagoons.webp"),   // placeholder
      body: "The Qatar Investment Authority establishes Qatari Diar to create and deliver real estate to the highest international standards." },
    { year: "2006", title: "First investment in Egypt", photo: img("b-ms-neighbourhoods.webp"),   // placeholder
      body: "Qatari Diar invests in Egypt for the first time: the start of a USD 3.1 billion portfolio across more than 40 million sqm." },
    { year: "2025", title: "Twenty years, a new coast", photo: img("b-ms-agreement.webp"),
      body: "Two decades on, with 41 investment projects in 15 countries, Qatari Diar signs the agreement for Alam Al Roum: 4,902 feddan of Mediterranean coast." },
    { year: "2026", title: "Masterplan and phase one", photo: img("b-ms-construction.webp"),
      body: "The masterplan is set and phase one breaks ground along the 7.2 km shoreline, as the first district takes shape." },
    { year: "2030", title: "First residents", photo: img("b-ms-residents.webp"),
      body: "Handover to the clients begins. The first residents arrive, and Alam Al Roum opens its doors as a living city by the sea." },
  ],
};

/**
 * Nearby — "UI / Coastline drawing (Nearby)" (10979:17194). Pins in frame coords (1512 × 1024);
 * `at` is where the drawing coastline reaches the pin (fraction of its half, measured from Alam Al Roum),
 * `tick` the leader length from the pin up to its label. Distances from the factsheet.
 */
export const nearby = {
  map: img("b-nearby-map.webp"),
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
