/** Copy and assets for the About page's hero, Qatari Diar numbers, Who we are, Mission & values, Qatari Diar Egypt and
 *  the Coin Reveal (which now plays on Destination). */

/** About hero (Figma "Hero · Page (About)", 11705:10577, 19 Nov): the tag, the headline and Qatari Diar's own line. */
export const manifesto = {
  tag: "About Us",
  // two even lines (client edit 28 Oct): "The coast you remember / lived in all year round"
  line1: "The coast", accent: "you remember", line2: "lived in all year round",
  body: "Established in 2005 by the Qatar Investment Authority, Qatari Diar creates and delivers transformative real estate projects to the highest international standards, in Qatar and around the world.",
  image: "/images/about/a-hero-beach.webp",
  alt: "The beach at Alam Al Roum, with the city and the lighthouse towers behind it",
};

/** Qatari Diar in numbers (Figma 11705:12611; qataridiar.com/about-us, as of 2025). */
export const developerNumbers = {
  tag: "Developer Stats",
  title: "Qatari Diar in numbers",
  logo: "/images/qatari-diar.png",
  items: [
    { value: "20", label: "Years in business" },
    { value: "15", label: "Countries" },
    { value: "41", label: "Investment projects" },
    { value: "$39B", label: "Combined investment and assets under management" },
  ],
};

/** Who we are (Figma 11705:10599, was "A city, not a resort"): the copy, two small photos and one tall one. */
export const bloom = {
  title: "Who we are",
  body: "Qatari Diar was established in 2005 by the Qatar Investment Authority to support Qatar's growing economy and to coordinate the country's real estate development priorities. Today it develops and manages projects in 15 countries, led by Lusail, the flagship city launched in December 2005.",
  tall: { src: "/images/about/a-promenade.webp", alt: "The palm-lined promenade along the sea at sunset" },
  small: [
    { src: "/images/about/a-boulevard.webp", alt: "The central boulevard running from the lagoon to the sea" },
    { src: "/images/about/a-tower-palms.webp", alt: "The lighthouse towers framed by palms at the end of the promenade" },
  ],
};

/** Mission & values (Figma 11738:16356): mission and vision from qataridiar.com/about-us; the value lines are drafts. */
export const values = {
  tag: "Mission & values",
  title: [{ t: "Built to the" }, { t: "highest standards", br: true }],
  body: "Our mission is to create and deliver transformative real estate projects that embrace the highest international standards, for our stakeholders globally. Our vision: to be a regional market leader in quality lifestyles and innovation.",
  items: [
    { title: "Dedication", body: "Committed to every project for the long term, from the first plan to the last handover.",
      photo: "/images/about/a-town-square.webp", alt: "The town square, with its arcades and shaded lawn" },
    { title: "Integrity", body: "Honest, transparent dealings with partners, governments and the communities we build for.",
      photo: "/images/photo/masterplan-aerial.webp", alt: "Aerial view of the Alam Al Roum masterplan on the coast" },
    { title: "Accountability", body: "We own our commitments, to our stakeholders and to the places we create.",
      photo: "/images/about/a-boulevard.webp", alt: "The central boulevard running from the lagoon to the sea" },
    { title: "Respect", body: "For people, for heritage and for the landscape of every coast and city we work in.",
      photo: "/images/about/a-lagoon-terrace.webp", alt: "A terrace looking over the swimmable lagoon" },
  ],
};

/** Qatari Diar Egypt (Figma 11705:10609; qataridiar.com/egypt): the copper mark, copy, three figures and two photos. */
export const qdEgypt = {
  logo: "/images/about/qatari-diar-copper.png",
  tag: "Qatari Diar Egypt",
  title: "Investing in Egypt since 2006",
  body: "Qatari Diar has invested USD 3.1 billion in Egypt's real estate since 2006, across a portfolio of more than 40 million sqm. Alam Al Roum brings the company to the Mediterranean.",
  figures: [
    { value: "$3.1B", label: "invested since 2006" },
    { value: "40M+", label: "sqm of land" },
    { value: "4", label: "projects" },
  ],
  photos: [
    { src: "/images/about/a-lagoon-villas.webp", alt: "Villas on the islands of the lagoon" },
    { src: "/images/about/a-town-square.webp", alt: "The town square, with its arcades and shaded lawn" },
  ],
};

/** UI / Section / Landmark Reveal (10979:18395) */
export const coin = {
  // the display word under the coin, one entry per line (set in capitals): what lies behind the name Alam Al Roum,
  // "the landmark of the Romans"; it replaced "GRANDEUR", a word the audience didn't know
  word: ["Behind", "the name"],
  // 15 Nov: one line under the word, so the name is explained before the coin turns
  subtitle: "Alam Al Roum means \u201cthe landmark of the Romans\u201d: the name sailors gave this headland when its light guided them home.",
  title: "A landmark restored",
  body: "Long before the first stone was laid, this coast was a landmark for those crossing the sea. The lighthouse stands again, not as a monument but as a signal. A city built for permanence, not for seasons.",
  points: [
    { title: "Roman roots", body: "This shoreline guided sailors home for two thousand years." },
    { title: "Living legacy", body: "A city designed for generations, not for a single summer." },
  ],
  caption: "Once a beacon for Roman ships, soon the city’s point of arrival.",
  // Higgsfield sky-fall v2 (the marina lighthouse film used in Figma 11012:16013): clouds → crescent marina → the tower.
  // Played as the /seq/skyfall-30 frame sequence (/video/grandeur-skyfall-v2.mp4 at 30 fps, kept as its source).
  poster: "/images/photo/grandeur-skyfall-v2-poster.webp",
  render: "/images/about/a-coin.webp",
  mask: "/images/about/a-coin-mask.svg",
};
