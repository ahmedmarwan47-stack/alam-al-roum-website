/** Events and Media Center copy, from the Figma frames "Events • Desktop" (10921:8974) and "Media Center • Desktop" (10921:9167). */
import { events as homeEvents } from "@/lib/content";

const ev = (f: string) => `/images/events/${f}.jpg`;
const md = (f: string) => `/images/media/${f}.jpg`;

export type ListCard = { tag: string; meta: string; title: string; photo: string; href: string; slug?: string };

export const eventsPage = {
  title: "Alam Al Roum Events",
  body: "A calendar of culture, sport, and conversation. These are the moments that build a year-round community.",
  tabs: ["Upcoming", "Past"] as const,
  upcoming: [
    ["Education", "Tue 09 Feb 2027", "Roman coast symposium", "symposium"],
    ["Golf", "Wed 10 Feb 2027", "Coastal open championship", "golf-open"],
    ["Retail & Dining", "Thu 11 Feb 2027", "Waterfront food market", "food-market"],
    ["Culture", "Fri 12 Feb 2027", "Seaside sculpture unveiling", "sculpture"],
    ["Sports", "Wed 10 Feb 2027", "Coastal 10K run", "golf-open"],
    ["Hotels", "Thu 11 Feb 2027", "Grand hotel opening gala", "hotel-gala"],
    ["Marina", "Sat 13 Feb 2027", "Marina regatta weekend", "regatta"],
    ["Beach", "Wed 10 Feb 2027", "Full moon beach festival", "beach-festival"],
    ["Wellness", "Thu 11 Feb 2027", "Coastal wellness retreat", "wellness-retreat"],
  ].map(([tag, meta, title, p]) => ({ tag, meta, title, photo: ev(p), href: "/contact" })) as ListCard[],
  past: homeEvents.past.map(([tag, meta, title, p]) => ({ tag, meta, title, photo: `/images/photo/${p}.jpg`, href: "/media-center" })) as ListCard[],
};

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const story = (tag: string, read: string, title: string, p: string): ListCard =>
  ({ tag, meta: read, title, photo: md(p), slug: slugify(title), href: `/media-center/${slugify(title)}` });

export const mediaPage = {
  title: "Media Center",
  body: "A record of progress, announcements, and the ideas shaping a permanent city on the Mediterranean. Here is the narrative as it is written.",
  tabs: ["Blog", "News"] as const,
  news: [
    story("Milestone", "2 min read", "Phase 1 construction begins August 2026", "m04"),
    story("Partnership", "3 min read", "Agreement signed for a new coastal city", "m05"),
    story("Progress", "4 min read", "Masterplan unveiled with SOM", "m06"),
    story("Technology", "7 min read", "Advanced robotics deployed for construction", "m10"),
    story("Health", "5 min read", "Smart healthcare facilities established", "m11"),
    story("Education", "4 min read", "Innovative learning environments created", "m12"),
  ],
  features: [
    story("Heritage", "6 min read", "The lighthouse that guided Rome home", "m01"),
    story("Design", "4 min read", "Building with limestone and light", "m02"),
    story("Living", "5 min read", "A city that does not close", "m03"),
    story("Innovation", "5 min read", "Smart infrastructure integration begins", "m07"),
    story("Sustainability", "6 min read", "Green energy initiatives launched", "m08"),
    story("Community", "3 min read", "Public spaces and cultural centers planned", "m09"),
  ],
};
/** The Blog tab lists all twelve stories in the Figma order (three features, three news, then alternating threes); News filters to the news. */
const [F, N] = [mediaPage.features, mediaPage.news];
export const mediaBlog = [...F.slice(0, 3), ...N.slice(0, 3), ...F.slice(3), ...N.slice(3)];

export const stories = [...mediaPage.news, ...mediaPage.features];

type Block = { h?: string; p?: string; list?: string[]; img?: string; caption?: string };
export type Article = { slug: string; tag: string; date: string; title: string; sub: string; byline: [string, string]; hero: string; takeaways?: string[]; body: Block[] };

/** The written story (Figma "Article Detail • Desktop": header 10921:10139, body 10921:10164). */
const phaseOne: Article = {
  slug: stories[0].slug!, tag: "Construction", date: "Sun 9 Aug 2026",
  title: "Phase one construction begins on the coast",
  sub: "The first foundations are laid as the city moves from plan to permanence.",
  byline: ["Alam Al Roum Newsroom", "9 August 2026"], hero: md("m04"),
  takeaways: ["Phase one construction started in August 2026.", "First handovers are planned for 2030.", "Phase one covers the beachfront and first lagoon districts."],
  body: [
    { img: md("m05") },
    { p: "Qatari Diar and the Egyptian government have marked the start of phase one at Alam Al Roum, a 20.58 million square metre city on Egypt's North Coast. Site works began in August 2026 along the western edge of the bay." },
    { p: "The milestone moves the project from masterplan to ground. Over the coming months, roads, utilities and the first lagoon basins will take shape, laying the foundations for homes that will welcome their first residents in 2030." },
    { h: "What phase one includes" },
    { p: "Phase one focuses on the beachfront, where the city meets its 7.2 kilometre shoreline. It brings together the first neighbourhoods, the infrastructure that serves them, and the public spaces that will make the coast feel lived in from day one." },
    { list: ["Beachfront homes and the first lagoon districts", "Core roads, utilities and the coastal promenade", "The first swimmable lagoons", "A town centre with everyday retail and dining"] },
    { img: md("m04"), caption: "Illustrative coastal imagery from the brand collection." },
    { h: "What happens next" },
    { p: "Infrastructure and lagoon works continue through 2027, followed by the marina and the 18-hole golf course by the sea in 2028. The first neighbourhoods are planned to near completion in 2029, with handovers beginning in 2030." },
    { p: "Registered buyers will be the first to hear about new launches, site visits and progress updates. To register your interest, use the form on this site or call 16922." },
  ],
};

/** Only the phase-one story is written in Figma; the others open on their card copy until their text exists. */
export const articleFor = (slug: string): Article | undefined => {
  if (slug === phaseOne.slug) return phaseOne;
  const s = stories.find((x) => x.slug === slug);
  return s && { slug, tag: s.tag, date: s.meta, title: s.title, sub: "", byline: ["Alam Al Roum Newsroom", ""], hero: s.photo, body: [] };
};

export const related = { title: "Keep reading", body: "More from the Media Center.", cta: "View All", items: mediaPage.features.slice(0, 3) };
