/** Sustainability copy, from the Figma UI Design page (Sustainability • Desktop, 10921:10266). */
const s = (f: string) => `/images/sustainability/${f}`;

export const susHero = {
  eyebrow: "Our approach", name: "Sustainability", line: "Designed for a coast that lasts generations.",
  photo: s("hero.jpg"), alt: "A swimmer in clear lagoon water",
};

export const susOverview = {
  tag: "Our approach", title: "Embedded in every plan",
  body: "Sustainability is embedded into the planning of Alam Al Roum through climate-responsive design, nature-led infrastructure and long-term environmental stewardship. Every aspect of the destination is designed to balance human experience with ecological resilience.",
};

export const commitments = {
  title: "Six commitments",
  body: "Six commitments shape every district, street, shoreline and the sustainability of the city.",
  rows: [
    ["Biodiversity protection", "Native habitats and coastal ecology are protected and restored."],
    ["Water management", "A network that manages every drop, from lagoons to landscape."],
    ["Climate-responsive design", "Buildings and streets shaped for sun, shade and breeze."],
    ["Walkability", "Neighbourhoods planned so daily life is a short walk away."],
    ["Active mobility", "Cycling routes and promenades make moving part of living."],
    ["Coastal resilience", "A shoreline designed to adapt over generations."],
  ].map(([title, body], k) => ({ title, body, large: s(`c${k + 1}-large.jpg`), inset: s(`c${k + 1}-inset.jpg`) })),
};

export const waterTrack = {
  statement1: { tag: "Water strategy", text: "Lagoons to swim in, canals to walk along, a harbour to come home to.", accent: "A city shaped by water." },
  living: { photo: s("water-living.jpg"), title: ["Water you", "can live in"],
    features: [["Swimmable lagoons", "Calm, clean water for everyday swimming."], ["Canal promenade", "Walkable edges along the waterways."], ["Marina basin", "A sheltered harbour at the heart of the city."]] },
  statement2: { text: "Clean by nature.", accent: "Calm by design.", body: "The water system keeps the landscape, the lagoons and the public spaces working together.",
    cups: s("cups-clinking.png"), martini: s("cup-martini.png") },
  systems: { photo: s("water-systems.jpg"), title: ["Water that looks after itself"],
    features: [["Ecological water", "Natural filtration that keeps the lagoons healthy."], ["Greener landscape", "Water that supports the planting and public spaces."], ["Resilient community", "A system built to keep the city running well, season after season."]] },
};

export const susFaq = {
  title: "FAQs", body: "How sustainability works in Alam Al Roum, in practice.", cta: "Read All FAQs", href: "/faq",
  items: [
    ["Is the city certified?", "Certification targets are being set with the masterplan partners and will be shared per phase."],
    ["How is water used?", "Lagoons, landscape and buildings share one managed network, with natural filtration."],
    ["Can residents take part?", "Yes. Community programmes cover planting, beach care and shared mobility."],
    ["How do you protect the shoreline?", "The coast is designed to adapt over generations, with protected habitats and setbacks."],
    ["How do people move around?", "The Loop links every district, the marina and the town centres, with water taxis across the lagoons."],
  ] as [string, string][],
};
