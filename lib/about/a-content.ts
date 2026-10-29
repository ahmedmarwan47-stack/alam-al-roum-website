/** Copy, assets and Figma geometry for the About page's Manifesto, Life in Bloom, Coastal Facts and Coin Reveal. */

/** UI / Headline / Accent (10979:18256) */
export const manifesto = {
  // two even lines (client edit 28 Oct): "The coast you remember / lived in all year round"
  line1: "The coast", accent: "you remember", line2: "lived in all year round",
  body: "Four seasons of sea, light and life. Alam Al Roum is built to be lived in all year, not visited for a summer.",
  image: "/images/about/a-sea.jpg",
};

/** UI / Section / Botanical Frame (10979:18297). The About instance overrides the copy to the line kept in `alt`. */
export const bloom = {
  // the About instance's copy (Figma 10921:8196); the component's own line is kept in `alt`
  title: "A city, not a resort",
  body: "“We are not building a summer destination. We are restoring a permanent city on a coast that has always been a landmark.”",
  alt: { title: "Life in bloom", body: "Shaded courtyards, olive trees and bougainvillea: the gardens are planted for the coast, green in every season." },
  image: "/images/about/a-botanical.jpg",
};

/**
 * The masterplan in numbers: the four figures Coastal Facts used to reveal at the end of its pin, now a static section
 * of their own in the slot the Qatari Diar numbers held on About (Home keeps the animated Qatari Diar stage).
 */
export const cityNumbers = {
  tag: "In numbers",
  title: "The scale of the masterplan",
  items: [
    { value: "20.58M", label: "sqm total land area" },
    { value: "4,902", label: "feddan masterplan area" },
    { value: "7.2 km", label: "Mediterranean shoreline" },
    { value: "22 km", label: "total water frontage incl. lagoons" },
  ],
};

/** UI / Section / Split Merge (10979:18325) */
export const facts = {
  title: "A fully integrated coastal city",   // set as "A Fully Integrated / Coastal City"
  body: "Developed by Qatari Diar, Alam Al Roum brings together residential, hospitality, commercial, cultural and recreational destinations within a future-ready urban environment designed to evolve.",
  image: "/images/about/a-courtyard.jpg",
  /** Two windows (L, R) onto one picture (I), as [x, y, w, h] on the 1512 × 1024 frame. Split → Merged → Full. */
  states: {
    split: { l: [180, 380, 440, 560], r: [892, 104, 440, 560], il: [101, 330, 1038, 661], ir: [373, 54, 1038, 661] },
    merged: { l: [316, 232, 440, 560], r: [756, 232, 440, 560], il: [290, 215, 933, 594], ir: [290, 215, 933, 594] },
    full: { l: [0, 0, 756, 1024], r: [756, 0, 756, 1024], il: [0, 0, 1512, 1024], ir: [0, 0, 1512, 1024] },
  },
};

/** UI / Section / Landmark Reveal (10979:18395) */
export const coin = {
  // the display word under the coin, one entry per line (set in capitals): what lies behind the name Alam Al Roum,
  // "the landmark of the Romans"; it replaced "GRANDEUR", a word the audience didn't know
  word: ["Behind", "the name"],
  title: "A landmark restored",
  body: "Long before the first stone was laid, this coast was a landmark for those crossing the sea. The lighthouse stands again, not as a monument but as a signal. A city built for permanence, not for seasons.",
  points: [
    { title: "Roman roots", body: "This shoreline guided sailors home for two thousand years." },
    { title: "Living legacy", body: "A city designed for generations, not for a single summer." },
  ],
  caption: "Once a beacon for Roman ships, soon the city’s point of arrival.",
  // Higgsfield sky-fall v2 (the marina lighthouse film used in Figma 11012:16013): clouds → crescent marina → the tower.
  // Played as the /seq/skyfall frame sequence (every 2nd frame of /video/grandeur-skyfall-v2.mp4, kept as its source).
  poster: "/images/photo/grandeur-skyfall-v2-poster.jpg",
  render: "/images/about/a-coin.webp",
  mask: "/images/about/a-coin-mask.svg",
};
