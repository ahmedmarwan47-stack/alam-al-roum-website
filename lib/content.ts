/** Home copy, taken from the Figma UI Design page (Home • Desktop). */
const ph = (f: string) => `/images/photo/${f}.jpg`;

export const nav = { menu: "MENU", cta: "Register interest" };

export const hero = {
  photo: ph("ui-hero-sea"),
  /** Figma hero video: the open-sea drone shot from the Experience Centre film (2.3–3.7 s), slowed 2× and ping-ponged into a seamless loop. */
  video: "/video/hero-sea.mp4", poster: "/images/photo/hero-sea-poster.jpg",
  title: [{ t: "A coastline restored" }, { t: "to a", br: true }, { t: "Circle", i: true }],
  body: "7.2 kilometres of shoreline, a restored lighthouse, and a city built for those who return. On Egypt's North Coast, by Qatari Diar.",
  cta: "Register interest", proof: "Backed by Qatari Diar",
};

export const grandeur = {
  tag: "GRANDEUR RESTORED",
  title: "A year-round city, not a seasonal resort",
  body: "Alam Al Roum is built for those who return. A place of permanence, rooted in the history of a coastline that once guided sailors home.",
  // Positions from Figma (section 1512 × 1080): x, y, w, h
  images: [
    { src: ph("ui-expcenter-facade"), x: 150, y: 110, w: 210, h: 270 },
    { src: ph("ui-v-lounge"), x: 990, y: 80, w: 240, h: 230 },
    { src: ph("ui-g-pool"), x: 1240, y: 470, w: 180, h: 180 },
    { src: ph("ui-v-lounger"), x: 110, y: 520, w: 160, h: 160 },
    { src: ph("ui-expcenter-court"), x: 260, y: 800, w: 230, h: 200 },
    { src: ph("ui-g-colonnade"), x: 1010, y: 790, w: 210, h: 210 },
  ],
  stats: [
    { label: "INVESTMENT", value: "$29.7Bn", note: "Total investment in the city", x: 395, y: 190, w: 249 },
    { label: "LAGOONS", value: "22 km", note: "Seawater-connected lagoons", x: 1250, y: 210, w: 216 },
    { label: "TO THE AIRPORT", value: "Minutes", note: "Ras El Hekma International", x: 590, y: 860, w: 210 },
    { label: "FLIGHT RADIUS", value: "2–5 hrs", note: "From Europe and the GCC", x: 1250, y: 730, w: 200 },
  ],
  chips: [
    { label: "Year-round · 365 days", x: 1170, y: 410, dark: true },
    { label: "Since the Romans", x: 150, y: 720, dark: false },
  ],
};

export const lighthouse = { title: [{ t: "The lighthouse still" }, { t: "marks the way home", br: true }], cta: "About Us" };

export const communities = {
  tag: "Featured communities", title: "Places to call home", cta: "View All Communities",
  items: [
    { name: "Beachfront community", line: "Shoreline · 7.2 km of Mediterranean sand", photo: ph("ui-g-beach") },
    { name: "Lagoon neighbourhood", line: "Waterways · 22 km of waterfront and lagoons", photo: ph("ui-lagoon-clear") },
    { name: "Marina boulevard", line: "Waterfront · The social heart of the city", photo: ph("ui-g-boardwalk") },
    { name: "Golf community", line: "Greens · An 18-hole course by the sea", photo: ph("ui-g-terraces") },
  ],
};

export const masterplan = {
  tag: "Masterplan", title: "A city shaped by water",
  body: "The masterplan extends from the Mediterranean inward, creating a seamless relationship between land and water.",
  image: ph("masterplan-aerial"),
  // Pin centres on the 1512 × 839 image
  pins: [
    { title: "Beachfront communities", body: "Homes set along 7.2 km of Mediterranean sand, with private beach clubs.", x: 1081, y: 293, photo: ph("ui-g-beach") },
    { title: "Lagoon neighbourhoods", body: "Districts woven through 22 km of waterfront and lagoons, with water taxis to the marina.", x: 643, y: 316, photo: ph("ui-lagoon-clear") },
    { title: "Marina boulevard", body: "An international marina and promenade, the social centre of the city.", x: 975, y: 361, photo: ph("ui-g-boardwalk") },
    { title: "Resort districts", body: "Hotels and residences share the same streets. Service is permanent here.", x: 544, y: 437, photo: ph("ui-g-interior") },
    { title: "Golf community", body: "Homes framed by an 18-hole championship course, green all year.", x: 1247, y: 89, photo: ph("ui-g-terraces") },
  ],
};

export const waysToLive = {
  tag: "Experiences & Lifestyle", title: "Ways to live",
  body: "A single city holds many different mornings. Each experience is part of daily life here, not a weekend escape.",
  rows: [
    ["Beach", "7.2 kilometres of Mediterranean shore and swimmable lagoons.", "ui-g-beach"],
    ["Marina", "The social heart of the city: boating, dining and public life on the water.", "ui-g-boardwalk"],
    ["Golf", "An 18-hole championship course by the sea, green all year.", "ui-g-terraces"],
    ["Sports", "Courts, cycling routes and the open sea for an active life.", "ui-lagoon-clear"],
    ["Retail & Dining", "Walkable town centres, commercial boulevard and waterfront tables.", "ui-g-table"],
    ["Hotels", "International brands and boutique hospitality across the coast.", "ui-g-interior"],
    ["Wellness", "Wellness and longevity by the sea: spa, coastal trails and yoga.", "ui-g-pool"],
    ["Education", "Schools and a dedicated learning hub for families who stay.", "ui-expcenter-lobby"],
    ["Culture", "Arts, performance and community events all year round.", "ui-g-music"],
  ].map(([title, body, p]) => ({ title, body, photo: ph(p) })),
};

export const connectivity = {
  tag: "Destination & Connectivity", title: "A city connected by land, sea, and air",
  body: "The city moves at its own pace, yet the world remains close. Six capitals sit within a five-hour flight, and the coastal road, two airports and a marina link it to the rest of Egypt.",
  listLabel: "Connected to Egypt",
  items: [
    ["International Coastal Road", "Direct access from Cairo and the wider Egyptian network.", "road-01"],
    ["Ras El Hekma Airport", "The nearest international gateway, minutes away.", "airplane-01"],
    ["Marsa Matrouh International Airport", "Established regional air access.", "airplane-01"],
    ["Future High-Speed Rail", "Integration into the national rail network under development.", "train-01"],
    ["Integrated Marina", "International yachting access connecting the Mediterranean network.", "sailboat-offshore"],
  ].map(([title, body, icon]) => ({ title, body, icon })),
  visa: { label: "Visiting Egypt", points: [["On Arrival", "Many nationalities get a visa on arrival, or apply online for an e-visa."], ["6 Months", "Minimum passport validity from your arrival date."]] },
  cta: "Explore The Destination",
};

export const scale = {
  photo: ph("ui-expcenter-day"),
  title: "Twenty years of building across twenty countries",
  body: "Backed by the Qatar Investment Authority, Qatari Diar delivers landmark destinations across 20 countries, with a portfolio exceeding USD 35 billion and over two decades of investment in Egypt.",
  stats: [["50+", "Projects"], ["20+", "Cities Worldwide"]],
};

export const landmarks = {
  title: "Landmarks and leisure",
  body: "Around the lighthouse, the city opens onto the water, its history and the open sea. Four places to begin.",
  rows: [
    ["Marina promenade", "Restaurants, boutiques and berths along the boulevard.", "ui-g-boardwalk", "ui-g-table"],
    ["Roman archaeological trail", "A walking route through the site's history.", "ui-g-colonnade", "ui-v-sculpture"],
    ["Beach clubs", "7.2 kilometres of open Mediterranean shore.", "ui-g-beach", "ui-v-lounger"],
    ["Championship golf", "Eighteen holes set against the sea.", "ui-g-coast", "ui-g-pool"],
    ["Lagoon walk", "A promenade along the swimmable lagoons.", "ui-lagoon-clear", "ui-v-ripples"],
  ].map(([title, body, a, b]) => ({ title, body, large: ph(a), inset: ph(b) })),
};

export const events = {
  tag: "Events", title: "Alam Al Roum Events", cta: "View all",
  upcoming: [
    ["Golf", "Wed 10 Feb 2027", "Coastal open championship", "ui-v-pavilion-dusk"],
    ["Culture", "Fri 12 Feb 2027", "Seaside sculpture unveiling", "ui-v-sculpture"],
    ["Retail & Dining", "Thu 11 Feb 2027", "Waterfront food market", "ui-g-table"],
    ["Culture", "Sat 20 Feb 2027", "Music by the sea", "ui-g-music"],
  ],
  past: [
    ["Visit", "Aug 2026", "Prime Minister's site visit", "ui-pm-visit"],
    ["Opening", "Sep 2026", "Experience Center opening", "ui-expcenter-facade"],
    ["Hospitality", "Sep 2026", "An evening at the Experience Center", "ui-expcenter-dusk"],
    ["Lifestyle", "Sep 2026", "Inside the Experience Center lounge", "ui-v-lounge"],
  ],
};

export const gallery = {
  tag: "Gallery", title: [{ t: "Alam Al Roum" }, { t: "In shots", br: true }],
  rows: [
    ["ui-sea-1", "ui-sea-3", "ui-sea-5", "ui-sea-7", "ui-sea-9", "ui-lagoon-clear", "ui-v-ripples"],
    ["ui-v-water", "ui-v-turq", "ui-v-horizon", "ui-sea-6", "ui-sea-wide", "ui-g-beach", "ui-g-coast"],
    ["ui-expcenter-facade", "ui-expcenter-court", "ui-g-pool", "ui-expcenter-lounge", "ui-v-lounge", "ui-v-pavilion-dusk", "ui-g-boardwalk"],
  ].map((r) => r.map(ph)),
};

export const news = {
  tag: "News & Blogs", title: "Media Center", body: "Updates from Alam Al Roum and its progress", cta: "View all",
  items: [
    ["News", "3 min read", "Phase one construction begins on the coast", "ui-pm-visit"],
    ["Blog", "5 min read", "Lighthouse that guided the romans", "ui-g-boardwalk"],
    ["News", "4 min read", "Drawing a city from the coastline", "ui-g-coast"],
  ].map(([tag, read, title, p]) => ({ tag, read, title, photo: ph(p) })),
};

export const faq = {
  title: "FAQs", body: "Direct answers about the city, the investment, and the life that awaits at Alam Al Roum.", cta: "Read All FAQs",
  items: [
    ["What is Alam Al Roum?", "Alam Al Roum is a year-round coastal city on Egypt's North Coast. It spans 20.58 million square meters with a 7.2 kilometer shoreline. It is built for permanence, not for a season."],
    ["Who is developing it?", "Qatari Diar, backed by the Qatar Investment Authority, with landmark destinations across 20 countries."],
    ["Is it a resort?", "No. It is a year-round city, not a seasonal resort: homes, hotels, schools and a town centre that stay open all year."],
    ["What is the timeline?", "Phase one construction has begun on the coast. Follow the Media Center for each milestone."],
    ["Can I visit?", "Register your interest and the team will arrange a visit to the Experience Center."],
  ],
};

export const cta = {
  title: [{ t: "Live" }, { t: "Greatness", i: true }],
  body: "Be among the first to receive news of residences, districts, and the city's progress", cta: "Register interest",
  video: "/video/cta-portal.mp4",
};

export const footer = {
  newsTitle: "Be The First To Know", newsBody: "Sign up for exclusive news, events, and offers straight to your inbox.",
  placeholder: "Your Email Here", subscribe: "Subscribe", consent: "By subscribing, you accept our Privacy Policy.",
  address: ["Alam Al Roum", "Qatari Diar Egypt", "North Coast, Egypt"], live: "SEA 24°C  ·  SUNSET 18:42",
  legal: ["Privacy Policy", "Terms & Conditions", "Cookie Settings"],
  discover: ["Home", "About", "Destination", "Experiences", "Communities", "Sustainability"],
  more: ["Media Center", "Events", "Careers", "FAQs"],
  contact: [["", "Contact Us"], ["call", "16922"], ["whatsapp", "+20 120 001 6922"], ["mail-01", "info@alamalroumegypt.com"]],
  credit: "Design and Development by MitchDesigns", copyright: "© 2026 Alam Al Roum, a Qatari Diar development ·  All rights reserved",
  video: "/video/footer-lagoon.mp4",
};
