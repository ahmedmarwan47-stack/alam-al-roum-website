/** Careers copy, from Figma "Careers • Desktop" (10921:9335 / 9339) and "Job Detail • Desktop" (10921:10078–10101). */
export const careersHero = {
  title: "Open Careers",
  // Figma's hero body repeated the Media Center line; this one is the careers page's own (its three departments)
  body: "Join the teams building a permanent city on the Mediterranean, from masterplanning and construction to operations.",
};

export const departments = ["All roles", "Masterplanning", "Construction", "Operations"] as const;

export type Role = {
  slug: string; dept: string; title: string; body: string; location: string; type: string; mode: string;
  lede?: string; region?: string; posted?: string; responsibilities?: string[]; requirements?: string[];
};

export const roles: Role[] = [
  { slug: "senior-urban-planner", dept: "Masterplanning", title: "Senior urban planner", location: "Cairo", type: "Full-time", mode: "On site",
    body: "You will shape districts measured in square kilometers. The work requires patience and a steady hand. Experience with coastal infrastructure is essential." },
  { slug: "infrastructure-director", dept: "Masterplanning", title: "Infrastructure director", location: "North coast", type: "Full-time", mode: "On site",
    body: "You will oversee the bones of the city. Roads, utilities, and marine works must be built to last a century. This is not a seasonal posting." },
  { slug: "landscape-architect", dept: "Masterplanning", title: "Landscape architect", location: "Cairo", type: "Full-time", mode: "On site",
    body: "You will work with limestone, sea wind, and native planting. The goal is a landscape that belongs to the coast, not one imposed upon it." },
  { slug: "marine-works-engineer", dept: "Construction", title: "Marine works engineer", location: "North coast", type: "Full-time", mode: "On site",
    body: "You will build the marina and the lagoon edges. The sea is the client here. Respect it and the work will stand.",
    lede: "You will build the marina and the lagoon edges. The sea is the client here.", region: "North Coast, Egypt", posted: "3 September 2026",
    responsibilities: ["Lead design review of breakwaters, quay walls, and lagoon edges", "Supervise marine contractors on site", "Coordinate with environmental and coastal consultants"],
    requirements: ["8+ years in marine or coastal engineering", "Degree in civil or marine engineering", "Arabic and English"] },
  { slug: "project-controls-lead", dept: "Construction", title: "Project controls lead", location: "Cairo", type: "Full-time", mode: "On site",
    body: "You will keep the schedule honest. A city of this scale demands rigor without panic. Calm competence is the requirement." },
];

export const offer = "Competitive package, on-site housing, and the chance to build a city meant to last a century.";

const egypt = (l: string) => (l === "Cairo" ? "Cairo, Egypt" : "North Coast, Egypt");
/** Detail view of a role; roles without a written brief fall back to their card copy. */
export const roleDetail = (r: Role) => ({
  ...r,
  lede: r.lede ?? r.body.split(". ").slice(0, 1).join("") + ".",
  facts: [["Location", r.region ?? egypt(r.location)], ["Department", r.dept], ["Type", `${r.type} · ${r.mode.replace("On site", "On-site")}`], ...(r.posted ? [["Posted", r.posted]] : [])],
});
