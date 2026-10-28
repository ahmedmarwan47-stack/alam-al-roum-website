/** Events and Media Center copy, from the Figma frames "Events • Desktop" (10921:8974) and "Media Center • Desktop" (10921:9167). */
import { events as homeEvents } from "@/lib/content";
import { writtenEvents, writtenStories, type Written } from "@/lib/articles";

const ev = (f: string) => `/images/events/${f}.jpg`;
const md = (f: string) => `/images/media/${f}.jpg`;

export type ListCard = { tag: string; meta: string; title: string; photo: string; href: string; slug?: string };

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
/** An event card reads its location and date from the event's own page (lib/articles.ts), so the two always agree. */
const eventCard = (title: string, photo: string): ListCard => {
  const w = writtenEvents[title];
  return { tag: w.tag, meta: w.date, title, photo, slug: slugify(title), href: `/events/${slugify(title)}` };
};

export const eventsPage = {
  title: "Alam Al Roum Events",
  body: "A calendar of culture, sport, and conversation. These are the moments that build a year-round community.",
  tabs: ["Upcoming", "Past"] as const,
  upcoming: [
    ["Roman coast symposium", ev("symposium")],
    ["Coastal open championship", ev("golf-open")],
    ["Waterfront food market", ev("food-market")],
    ["Seaside sculpture unveiling", ev("sculpture")],
    ["Coastal 10K run", ev("coastal-run")],
    ["Grand hotel opening gala", ev("hotel-gala")],
    ["Marina regatta weekend", ev("regatta")],
    ["Full moon beach festival", ev("beach-festival")],
    ["Coastal wellness retreat", ev("wellness-retreat")],
    ["Music by the sea", "/images/photo/ui-g-music.jpg"],
  ].map(([title, photo]) => eventCard(title, photo)),
  past: homeEvents.past.map(([, , title, p]) => eventCard(title, `/images/photo/${p}.jpg`)),
};

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

export type Article = Omit<Written, "takeaways"> & { slug: string; takeaways?: string[] };

/** Every story is written in lib/articles.ts (the phase-one story is Figma's); a story without one shows its card. */
export const articleFor = (slug: string): Article | undefined => {
  const s = stories.find((x) => x.slug === slug);
  const w = s && writtenStories[s.title];
  if (w) return { slug, ...w };
  return s && { slug, tag: s.tag, date: s.meta, title: s.title, sub: "", hero: s.photo, body: [] };
};

/** Event pages (no Figma frame of their own): the article template with the event's details in the summary panel. */
export const allEvents = [...eventsPage.upcoming, ...eventsPage.past];
/** An event card for the experience pages' "Events at …" band, from the same event data (`photo` overrides the listing's). */
export const eventTile = (title: string, photo?: string) => {
  const e = allEvents.find((x) => x.title === title)!;
  return { location: e.tag, date: e.meta, title, photo: photo ?? e.photo, href: e.href };
};
export const eventFor = (slug: string): (Article & { past: boolean }) | undefined => {
  const e = allEvents.find((x) => x.slug === slug); const w: Written | undefined = e && writtenEvents[e.title];
  return e && w && { slug, ...w, past: eventsPage.past.includes(e) };
};

export const related = { title: "Keep reading", body: "More from the Media Center.", cta: "View All", items: mediaPage.features.slice(0, 3) };
