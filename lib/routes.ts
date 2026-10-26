/** Page routes by their menu / footer label. */
export const routes: Record<string, string> = {
  Home: "/", About: "/about", Destination: "/destination", Experiences: "/experiences", Communities: "/communities",
  Sustainability: "/sustainability", "Media Center": "/media-center", Events: "/events", Careers: "/careers", FAQs: "/faq",
  "Contact Us": "/contact",
};

export const slugify = (s: string) => s.toLowerCase().replace(/&/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
