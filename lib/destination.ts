/** Destination copy, taken from the Figma UI Design page (Destination • Desktop, 10921:7791). */
const d = (f: string) => `/images/destination/${f}`;
const ph = (f: string) => `/images/photo/${f}.jpg`;

export const destHero = {
  pre: "Destination",
  title: [{ t: "Arrive by" }, { t: "Land, Sea, Air", i: true }, { t: "And the open land", br: true }],
  body: "On Egypt’s North Coast, 14 km from Marsa Matrouh and within five hours of Europe and the Gulf, Alam Al Roum sits where turquoise water meets open land.",
  photo: d("hero-arrival.jpg"), alt: "A traveller arriving with a suitcase",
};

export const inTown = {
  tag: "In town", title: "Transportation",
  body: "A multi-layered transportation network connects destinations efficiently while prioritising accessibility, sustainability and ease of movement.",
  mask: d("coin-mask.svg"),
  modes: [
    { tag: "Connected", title: "The Loop", body: "A continuous route linking every district, the marina and the town centres.", photo: d("loop-aerial.jpg") },
    { tag: "Low impact", title: "Sustainable solutions", body: "Water taxis link the lagoon districts to the marina, alongside cycling routes and shaded walks.", photo: ph("ui-lagoon-clear") },
    { tag: "Planned ahead", title: "Smart mobility", body: "Movement around the city is planned from day one, so every home, beach and town centre stays close.", photo: ph("ui-g-boardwalk") },
  ],
};

export const waterStrategy = {
  tag: "Environment", title: [{ t: "A city shaped by" }, { t: "Water", i: true }],
  body: "A comprehensive water network manages resources across the destination, supporting the landscape and public spaces while enhancing environmental performance.",
  facts: [
    ["7.2 km", "Mediterranean shoreline"], ["22 km", "Total water frontage, incl. lagoons"],
    ["Swimmable lagoons", "Clear, calm water for every age"], ["Canal promenade", "A waterside walk through the city"],
    ["Marina basin", "Berths at the head of the central axis"], ["Ecological water systems", "Recycled water for every landscape"],
  ],
  cta: "Explore sustainability", href: "/sustainability",
  video: "/video/destination-shore-loop.mp4", poster: d("shore.jpg"),
};

export const history = {
  romans: { title: ["Since", "the", "Romans"], photo: d("romans-mosaic.jpg"), flower: d("bougainvillea.png"),
    side: { title: "A Year-Around City", body: "A place of permanence, rooted in the history of a coastline that once guided sailors home." } },
  coast: { title: "The coast that guided the Romans", photo: d("coast-guided.jpg") },
  photo: d("terracotta-photo.jpg"),
  // stops on the 1218 × 273 coastline drawing (Figma 11134:16026)
  line: { svg: d("history-coastline.svg"), stop: d("history-stop.svg"), todayDot: d("history-stop-today.svg"), mark: d("history-mark.svg"),
    caption: "Alam Al Roum: over three thousand years on this coast",
    stops: [
      { date: "C. 1270 BC", text: "Ramesses II builds a fortress at Zawiyet Umm el-Rakham", x: 85, y: 161.5, label: "above" as const, ly: 59.5 },
      { date: "331 BC", text: "Alexander the Great passes through Paraetonium on his way to Siwa", x: 305, y: 188, label: "below" as const, ly: 205.4 },
      { date: "31 BC", text: "Mark Antony retreats to Paraetonium after Actium", x: 500, y: 136, label: "above" as const, ly: 22 },
      { date: "Legend", text: "Cleopatra’s Bath, a rock pool on the Matrouh shore", x: 710, y: 146, label: "above" as const, ly: 66 },
      { date: "1942", text: "The Battle of El Alamein, a turning point in North Africa", x: 910, y: 77.5, label: "above" as const, ly: 0 },
    ],
    today: { date: "Today", text: "Alam Al Roum", x: 1150, y: 150 } },
};

export const archSea = {
  video: "/video/destination-arch-sky.mp4", webm: "/video/destination-arch-sky.webm", poster: d("arch-sky-poster.jpg"),
  /** the same film with a keyframe every 4 frames, for scroll-scrubbing */
  scrub: "/video/destination-arch-sky-scrub.mp4",
  clouds: d("clouds-top.png"),
};

export const destFaq = {
  title: "FAQs", body: "How sustainability works in Alam Al Roum, in practice.", cta: "Read All FAQs", href: "/faq",
  items: [
    ["Is the city certified?", "Certification targets are being set with the masterplan partners and will be shared per phase."],
    ["How is water used?", "Lagoons, landscape and buildings share one managed network, with natural filtration."],
    ["Can residents take part?", "Yes. Community programmes cover planting, beach care and shared mobility."],
    ["How do you protect the shoreline?", "The coast is designed to adapt over generations, with protected habitats and setbacks."],
    ["How do people move around?", "The Loop links every district, the marina and the town centres, with water taxis across the lagoons."],
  ] as [string, string][],
};
