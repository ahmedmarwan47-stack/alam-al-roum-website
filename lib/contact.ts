/** Contact copy, from Figma "Contact • Desktop": Say hello 10921:9490, Book a Call 10921:9540, Locations 10921:9743. */
export const sayHello = {
  title: "Let’s talk about what’s next",
  body: "Tell us what you’re looking for, and we’ll help you find the right next step at Alam Al Roum.",
  image: "/images/contact/contact-faded.jpg",
  email: "info@alamalroumegypt.com",
  rows: [
    [["call", "Hotline", "16922", "tel:16922"], ["whatsapp", "WhatsApp", "+20 120 001 6922", "https://wa.me/201200016922"], ["mail-01", "Email", "info@alamalroumegypt.com", "mailto:info@alamalroumegypt.com"]],
    [["building-03", "Sales Office", "Qatari Diar Egypt, New Cairo"], ["location-01", "Site Office", "Alam Al Roum, North Coast, Egypt"]],
  ] as [string, string, string, string?][][],
  form: {
    title: "Send us a message",
    fields: { name: ["Your name", "Your full name"], email: ["Email", "name@email.com"], phone: ["Phone", "+20"], interest: ["Interest"], message: ["Message", "Homes, visits, investment…"] },
    interests: ["Register interest", "Book a site visit", "Investment", "Careers", "Media"],
    send: "Send Message",
  },
};

export const bookCall = {
  tag: "Talk With The Team", title: "Schedule Consultation Call",
  host: "Ahmed Hassan", event: "Consultation Call", body: "A relaxed first conversation about your space, goals and budget.",
  meta: [["clock-01", "30m"], ["video-01", "Google Meet"], ["globe", "Africa/Cairo"]],
  year: 2026, month: 9, // October (0-based)
  open: [15, 16, 18, 19, 20, 21, 22, 25, 26, 27, 28, 29],
  initial: 15,
  times: ["10:00am", "11:00am", "12:30pm", "2:00pm", "3:30pm", "5:00pm", "6:30pm"],
  tz: "Times shown in Africa/Cairo (GMT+3)",
};

export const locations = {
  tag: "Find us", title: "Locations", map: "/images/contact/map.jpg",
  credit: "Sources: Esri, HERE, Garmin, USGS, Intermap, INCREMENT P, NRCan, Esri Japan, METI, Esri China (Hong Kong), Esri Korea, Esri (Thailand), NGCC, © OpenStreetMap contributors, and the GIS User Community",
  // pin anchors as % of the map image, measured on the Figma frame
  pins: [["North Coast", 19.3, 26.8], ["Cairo", 31.5, 37.8], ["Doha", 86.6, 74]] as [string, number, number][],
  offices: [
    { label: "Sales office", city: "Cairo", address: "Qatari Diar Egypt, New Cairo, Egypt", phone: "Phone to be confirmed" },
    { label: "Site office & visits", city: "North Coast", address: "Alam Al Roum site office, North Coast, Egypt", phone: "16922" },
    { label: "Headquarters", city: "Doha", address: "Qatari Diar, Lusail, Doha, Qatar", phone: "Phone to be confirmed" },
  ],
  hours: "Hours to be confirmed", directions: "Get directions",
};
