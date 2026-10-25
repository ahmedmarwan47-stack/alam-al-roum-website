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
  blog: [
    story("Heritage", "6 min read", "The lighthouse that guided Rome home", "m01"),
    story("Design", "4 min read", "Building with limestone and light", "m02"),
    story("Living", "5 min read", "A city that does not close", "m03"),
    story("Innovation", "5 min read", "Smart infrastructure integration begins", "m07"),
    story("Sustainability", "6 min read", "Green energy initiatives launched", "m08"),
    story("Community", "3 min read", "Public spaces and cultural centers planned", "m09"),
  ],
  news: [
    story("Milestone", "2 min read", "Phase 1 construction begins August 2026", "m04"),
    story("Partnership", "3 min read", "Agreement signed for a new coastal city", "m05"),
    story("Progress", "4 min read", "Masterplan unveiled with SOM", "m06"),
    story("Technology", "7 min read", "Advanced robotics deployed for construction", "m10"),
    story("Health", "5 min read", "Smart healthcare facilities established", "m11"),
    story("Education", "4 min read", "Innovative learning environments created", "m12"),
  ],
};
