/** Copy, assets and Figma geometry for the About page's Manifesto, Life in Bloom, Coastal Facts and Coin Reveal. */

/** UI / Headline / Accent (10979:18256) */
export const manifesto = {
  line1: "The coast", accent: "you remember", line2: "all year round",
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
  /**
   * Cut-outs (Figma UI / Section / Botanical Frame 10979:18297): scallop shells on the left, Ionic capital fragments
   * on the right. Per state, the centre in % of the 1512 × 1000 frame and the CSS rotation (Figma's rotation is
   * counter-clockwise, so the sign is flipped); `flip` mirrors the image as Figma does. Rest → Scrolled → Full.
   */
  cutouts: [
    { src: "/images/about/a-scallop.webp", flip: true, rest: [17.35, 19.99, -35], scrolled: [3.95, 9.94, -35], full: [-29.5, -50.37, -35] },
    { src: "/images/about/a-ionic.webp", flip: true, rest: [78.03, 16.22, 180], scrolled: [96.03, 7.2, 180], full: [111.03, -34.33, 180] },
    { src: "/images/about/a-scallop.webp", flip: false, rest: [16.93, 76.74, 25], scrolled: [4.51, 91.97, 25], full: [-29.83, 125.86, 25] },
    { src: "/images/about/a-ionic.webp", flip: true, rest: [78.04, 76.65, 180], scrolled: [96.03, 96.5, 180], full: [111.03, 117.67, 180] },
  ] as { src: string; flip: boolean; rest: number[]; scrolled: number[]; full: number[] }[],
};

/** UI / Section / Split Merge (10979:18325) */
export const facts = {
  title: "A fully integrated coastal city",   // set as "A Fully Integrated / Coastal City"
  body: "Developed by Qatari Diar, Alam Al Roum brings together residential, hospitality, commercial, cultural and recreational destinations within a future-ready urban environment designed to evolve.",
  image: "/images/about/a-courtyard.jpg",
  items: [
    { value: "20.58M", label: "sqm total land area" },
    { value: "4,902", label: "feddan masterplan area" },
    { value: "7.2 km", label: "Mediterranean shoreline" },
    { value: "22 km", label: "total water frontage incl. lagoons" },
  ],
  /** Two windows (L, R) onto one picture (I), as [x, y, w, h] on the 1512 × 1024 frame. Split → Merged → Full. */
  states: {
    split: { l: [180, 380, 440, 560], r: [892, 104, 440, 560], il: [101, 330, 1038, 661], ir: [373, 54, 1038, 661] },
    merged: { l: [316, 232, 440, 560], r: [756, 232, 440, 560], il: [290, 215, 933, 594], ir: [290, 215, 933, 594] },
    full: { l: [0, 0, 756, 1024], r: [756, 0, 756, 1024], il: [0, 0, 1512, 1024], ir: [0, 0, 1512, 1024] },
  },
};

/** UI / Section / Landmark Reveal (10979:18395) */
export const coin = {
  word: "GRANDEUR",
  title: "Grandeur restored",
  body: "Long before the first stone was laid, this coast was a landmark for those crossing the sea. The lighthouse stands again, not as a monument but as a signal. A city built for permanence, not for seasons.",
  points: [
    { title: "Roman roots", body: "This shoreline guided sailors home for two thousand years." },
    { title: "Living legacy", body: "A city designed for generations, not for a single summer." },
  ],
  caption: "Once a beacon for Roman ships, soon the city’s point of arrival.",
  // Higgsfield sky-fall v2 (the marina lighthouse film used in Figma 11012:16013): clouds → crescent marina → the tower
  video: "/video/grandeur-skyfall-v2.mp4",
  poster: "/images/photo/grandeur-skyfall-v2-poster.jpg",
  render: "/images/about/a-coin.webp",
  mask: "/images/about/a-coin-mask.svg",
};
