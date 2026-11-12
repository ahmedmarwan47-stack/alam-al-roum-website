/** FAQ page copy, from Figma "FAQ • Desktop" (hero 10921:9430, accordion 10921:9434). */
export const faqPage = {
  title: "Frequently Asked Questions",
  body: "Find clear answers about Alam Al Roum. We have gathered the questions most often asked by residents, investors, and visitors.",
  categories: ["All", "General", "Location & Access", "Homes & Investment", "Lifestyle", "Construction & Handover"] as const,
  items: [
    { cat: "General", q: "What is Alam Al Roum?", a: "Alam Al Roum is a year-round coastal city on Egypt's North Coast. It spans 20.58 million square meters with a 7.2 kilometer shoreline. It is built for permanence, not for a season." },
    { cat: "General", q: "Who is developing it?", a: "Qatari Diar, the real estate developer backed by the Qatar Investment Authority. It has 20 years in business, more than 50 projects in 20 countries and a portfolio exceeding USD 35 billion, including USD 7 billion invested in Egypt." },
    { cat: "General", q: "Is it a resort?", a: "No. It is a functioning city with homes, businesses, schools, and infrastructure. The masterplan supports life throughout the entire year." },
    { cat: "Location & Access", q: "Where is Alam Al Roum?", a: "On Egypt's North Coast, around a rare natural Mediterranean bay with 7.2 kilometers of shoreline." },
    { cat: "Location & Access", q: "How do I get there?", a: "Ras El Hekma Airport is minutes away, and the city sits within a two to five hour flight of Europe and the GCC." },
    { cat: "Location & Access", q: "Can I visit?", a: "Yes. The site is accessible from the North Coast road network. Contact our team to arrange a visit or to receive the latest updates." },
    { cat: "Homes & Investment", q: "How do I register my interest?", a: "Register through the form on this site or call 16922. Our team will contact you with launch details and available homes." },
    { cat: "Homes & Investment", q: "Is there a business or Free Zone?", a: "Yes. A Free Zone and business district, with commercial offices and an Expo centre, sits inside the city." },
    { cat: "Lifestyle", q: "What is there to do in the city?", a: "Swimmable lagoons, a marina, an 18-hole championship golf course by the sea, walkable town centres, wellness trails, and a calendar of cultural events." },
    { cat: "Construction & Handover", q: "What is the timeline?", a: "Phase 1 construction launched in August 2026. The first handovers begin in 2030. The city will be delivered in stages over the following years." },
    // Figma shows this one closed; its answer follows the timeline above
    { cat: "Construction & Handover", q: "When will the first homes be handed over?", a: "The first handovers begin in 2030, starting with phase one on the beachfront and the first lagoon districts." },
  ],
};
