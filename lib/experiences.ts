/** Experiences & Lifestyle copy, from the Figma UI Design page (Experiences & Lifestyle • Desktop, 10921:7596). */
const e = (f: string) => `/images/experiences/${f}.jpg`;

export const expHero = {
  pre: "Experiences & Lifestyle",
  title: [{ t: "Built for" }, { t: "The Long Return", i: true }, { t: "Year after year", br: true }],
  body: "Life here is measured in seasons, not weekends. It is a place you come back to because it was always yours.",
  photo: e("hero"), alt: "A family on a hillside at sunset",
};

export const track = {
  tag: "Lifestyle & Experiences",
  title: [{ t: "Ways to live" }, { t: "greatness", i: true }],
  body: "A diverse mix of residential, hospitality, cultural, recreational and wellness experiences creates an active and enriching environment that extends beyond traditional resort living.",
  cta: "Explore",
};

/** The nine experiences; `body` is the one-line description used on Home (Ways to live). */
export const experiences = [
  { slug: "beach", title: "Beach", note: "7.2 km of shore", photo: e("beach"), body: "7.2 kilometres of Mediterranean shore and swimmable lagoons." },
  { slug: "marina", title: "Marina", note: "International marina", photo: e("marina"), body: "The social heart of the city: boating, dining and public life on the water." },
  { slug: "golf", title: "Golf", note: "18 holes by the sea", photo: e("golf"), body: "An 18-hole championship course by the sea, green all year." },
  { slug: "sports", title: "Sports", note: "Courts, trails & open sea", photo: e("sports"), body: "Courts, cycling routes and the open sea for an active life." },
  { slug: "retail-dining", title: "Retail & Dining", note: "Waterfront town centres", photo: e("dining"), body: "Walkable town centres, commercial boulevard and waterfront tables." },
  { slug: "hotels", title: "Hotels", note: "International brands", photo: e("hotels"), body: "International brands and boutique hospitality across the coast." },
  { slug: "wellness", title: "Wellness", note: "Spa & coastal trails", photo: e("wellness"), body: "Wellness and longevity by the sea: spa, coastal trails and yoga." },
  { slug: "education", title: "Education", note: "Schools & learning hub", photo: e("education"), body: "Schools and a dedicated learning hub for families who stay." },
  { slug: "culture", title: "Culture", note: "Arts all year round", photo: e("culture"), body: "Arts, performance and community events all year round." },
];
