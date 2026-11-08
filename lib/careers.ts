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
    body: "You will shape districts measured in square kilometres. The work requires patience and a steady hand. Experience with coastal infrastructure is essential.",
    lede: "You will shape districts measured in square kilometres, from the first sketch to the plot.", posted: "18 September 2026",
    responsibilities: ["Lead the district masterplans from concept to detailed plot layouts", "Set the street, block and public-space guidelines each district is built to",
      "Coordinate with infrastructure, landscape and marine teams so the plans hold together on the coast"],
    requirements: ["10+ years in urban planning, with large mixed-use or new-city work", "Degree in urban planning or architecture; a master's is preferred",
      "Experience with coastal infrastructure", "Arabic and English"] },
  { slug: "infrastructure-director", dept: "Masterplanning", title: "Infrastructure director", location: "North coast", type: "Full-time", mode: "On site",
    body: "You will oversee the bones of the city. Roads, utilities, and marine works must be built to last a century. This is not a seasonal posting.",
    lede: "You will oversee the bones of the city: roads, utilities and marine works built to last a century.", posted: "10 September 2026",
    responsibilities: ["Own the delivery of roads, utilities and marine works across phase one", "Set the design standards and review every infrastructure package",
      "Lead the contractors and consultants on site, and report on cost, time and quality"],
    requirements: ["15+ years in infrastructure delivery, including senior leadership", "Degree in civil engineering; chartered status is preferred",
      "Experience with coastal and marine projects", "Arabic and English"] },
  { slug: "landscape-architect", dept: "Masterplanning", title: "Landscape architect", location: "Cairo", type: "Full-time", mode: "On site",
    body: "You will work with limestone, sea wind, and native planting. The goal is a landscape that belongs to the coast, not one imposed upon it.",
    lede: "You will work with limestone, sea wind and native planting to make a landscape that belongs to the coast.", posted: "24 September 2026",
    responsibilities: ["Design the parks, promenades and streetscapes of the first districts", "Select native, drought-tolerant planting and plan for low water use",
      "Work with the planners and engineers on levels, drainage and shade"],
    requirements: ["7+ years in landscape architecture, with coastal or arid-climate work", "Degree in landscape architecture",
      "A portfolio of built public landscapes", "Arabic and English"] },
  { slug: "marine-works-engineer", dept: "Construction", title: "Marine works engineer", location: "North coast", type: "Full-time", mode: "On site",
    body: "You will build the marina and the lagoon edges. The sea is the client here. Respect it and the work will stand.",
    lede: "You will build the marina and the lagoon edges. The sea is the client here.", region: "North Coast, Egypt", posted: "3 September 2026",
    responsibilities: ["Lead design review of breakwaters, quay walls, and lagoon edges", "Supervise marine contractors on site", "Coordinate with environmental and coastal consultants"],
    requirements: ["8+ years in marine or coastal engineering", "Degree in civil or marine engineering", "Arabic and English"] },
  { slug: "project-controls-lead", dept: "Construction", title: "Project controls lead", location: "Cairo", type: "Full-time", mode: "On site",
    body: "You will keep the schedule honest. A city of this scale demands rigor without panic. Calm competence is the requirement.",
    lede: "You will keep the schedule honest. A city of this scale demands rigor without panic.", posted: "1 October 2026",
    responsibilities: ["Build and keep the master schedule and the cost plan for phase one", "Track progress, cost and risk across every contractor, and flag issues early",
      "Prepare the monthly reports for the project leadership"],
    requirements: ["8+ years in project controls on large construction programmes", "Degree in engineering, quantity surveying or construction management",
      "Primavera P6 and cost-control tools", "Arabic and English"] },
];

export const offer = "Competitive package, on-site housing, and the chance to build a city meant to last a century.";

const egypt = (l: string) => (l === "Cairo" ? "Cairo, Egypt" : "North Coast, Egypt");
/** Detail view of a role; roles without a written brief fall back to their card copy. */
export const roleDetail = (r: Role) => ({
  ...r,
  lede: r.lede ?? r.body.split(". ").slice(0, 1).join("") + ".",
  facts: [["Location", r.region ?? egypt(r.location)], ["Department", r.dept], ["Type", `${r.type} · ${r.mode.replace("On site", "On-site")}`], ...(r.posted ? [["Posted", r.posted]] : [])],
});
