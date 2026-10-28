/**
 * The community around each experience (experience detail pages, client edit 28 Oct: "the pages look empty"):
 *   overview  — a fuller Overview with a row of key facts (pages built from their card only)
 *   here      — what's there, as numbered rows beside a photo (not on Marina and Hotels, which have Landmarks / the hotel list)
 *   community — the people around it: clubs, membership, the life it brings
 *   week      — life in the community: four parts of everyday life, each with a photo (no days or times)
 * Figures come from the factsheet (golf course 980K sqm, 370 + 120 berths, 1.4M sqm beach, 850K sqm swimmable lagoons,
 * 85 % open space, 22 km lagoon promenade) and the site; clubs, programmes and times are draft copy for the client to review.
 * Photos marked `brand` are from the brand book (docs/brand/imagery/4k) and need licence confirmation.
 */
import type { OverviewData } from "@/components/sections/Overview";
import type { CommunityData } from "@/components/experience/ExperienceCommunity";
import type { WeekData } from "@/components/experience/ExperienceWeek";

const x = (f: string) => `/images/experiences/${f}.jpg`;   // brand: the -<role> files are brand-book photos
const ph = (f: string) => `/images/photo/${f}.jpg`;
const md = (f: string) => `/images/media/${f}.jpg`;
const ev = (f: string) => `/images/events/${f}.jpg`;
/** Photos generated with Figma AI (28 Oct, client-approved) where no real photo fits; placeholders until shoots exist. */
const gen = (f: string) => `/images/experiences/gen/${f}.jpg`;

/** What's there: the rows (title, line) and one photo per row, shown with the shared Landmarks section. */
export type HereData = { tag: string; title: string; body: string; photo: string; alt: string; rows: [string, string][]; photos: string[] };

export type ExperienceCommunityData = { overview?: Partial<OverviewData>; here?: HereData; community: CommunityData; week: WeekData };

const WEEK = "Life in the community";

export const experienceCommunity: Record<string, ExperienceCommunityData> = {
  beach: {
    overview: { title: "Seven kilometres of open shore",
      body: "The beach runs the full 7.2 kilometres of the city's Mediterranean edge, backed by a continuous promenade. Inland, open-to-sea and swimmable lagoons give calmer water for children and early swimmers, so the shore is part of daily life rather than a day out.",
      facts: [["7.2 km", "Mediterranean shoreline"], ["1.4M sqm", "Beach area"], ["850K sqm", "Swimmable lagoons"], ["22 km", "Lagoon promenade and beaches"]] },
    here: { tag: "On the shore", title: "What's on the beach", body: "Open sand, calm lagoons and a promenade that never leaves the water.",
      photo: ph("ui-g-beach"), alt: "Waves on the beach at sunset",
      rows: [
        ["Open beach", "Public sand along the full shoreline, with shade, showers and lifeguarded stretches."],
        ["Beach clubs", "Clubs for residents, with pools, cabanas and dining on the sand."],
        ["Swimmable lagoons", "Shallow, sheltered water inland for children and lap swimmers."],
        ["Beach promenade", "A 7 km walk and cycle path running from the marina along the coast."],
        ["Water sports", "Paddleboards, kayaks and dinghies from the watersports centres."],
      ],
      // one photo per row, for the shared Landmarks section (lib/experience-detail: what's here)
      photos: [ph("ui-g-beach"), ph("ui-v-lounger"), ph("ui-v-turq"), ph("ui-sea-wide"), x("sports-sailing")] },
    community: { tag: "The beach community", title: "A shore that belongs to the neighbourhoods",
      body: ["Beachfront communities open straight onto the sand, and every other neighbourhood is a short walk or ride away. The shore works as the city's front garden: morning swims, afternoon shade and evenings on the promenade.",
        "Residents' beach clubs give each community its own place by the sea, with family days, swim lessons and a calendar that carries on after summer."],
      photos: [x("beach-lagoon-deck"), ph("ui-v-parasol")], alt: ["A swimmer on a deck over clear lagoon water", "A striped parasol against the sky"],
      points: [["Swim school", "Lessons in the lagoons for every age"], ["Beach care", "Clean-ups and dune planting each season"], ["Family days", "Games, food and music on the sand"], ["Sunset sessions", "Evenings on the promenade all year"]] },
    week: { tag: "On the shore", title: WEEK, body: "The beach keeps its own rhythm, from the first swimmers at sunrise to music on the promenade at dusk.",
      items: [
        { title: "Morning swims", body: "Open-water swimmers meet at the beach clubs for guided swims along the shore. The lagoons give calmer water for lengths before work.", photo: x("sports-swim"), alt: "A swimmer in clear water" },
        { title: "Learning the water", body: "Swim schools teach children in the shallow, sheltered lagoons, grouped by age and ability, with lifeguards on every stretch.", photo: ph("ui-lagoon-clear"), alt: "Clear, shallow lagoon water" },
        { title: "Evenings on the promenade", body: "As the sun goes down the 7 km promenade fills with walkers and cyclists, and music and food carry on into the night.", photo: ph("ui-g-boardwalk"), alt: "The promenade at sunset" },
        { title: "Caring for the shore", body: "Residents join shore clean-ups and dune planting with the beach team, keeping the coast as clean as the day it opened.", photo: md("m05"), alt: "Sand ripples under clear water" },
      ] },
  },
  marina: {
    community: { tag: "The marina community", title: "A harbour with a crew",
      body: ["The marina is where the city meets: owners and crews, diners and walkers, early swimmers and late-evening strollers. Its 370 international berths and the local marina sit at the head of the central axis, beside the lighthouse.",
        "A yacht club and a sailing school are planned to give residents a way onto the water, whether they own a boat or not."],
      photos: [x("marina-sailing"), x("marina-dusk")], alt: ["Sailing on the open sea", "Evening on the deck of a yacht"],
      points: [["Yacht club", "Racing, cruising and social sailing"], ["Sailing school", "From first lessons to skipper"], ["Private docking", "Homes with their own moorings"], ["Dry rack", "120 places for smaller boats"]] },
    week: { tag: "At the marina", title: WEEK, body: "Boats leave in the morning, the quay fills at lunch, and the promenade is at its busiest after dark.",
      items: [
        { title: "Learning to sail", body: "Beginner and junior courses leave the local marina every morning, from first lessons in the bay to skipper certificates.", photo: ev("regatta"), alt: "A sailing boat on calm water" },
        { title: "Dinner on the quay", body: "Restaurants over the berths set their tables along the water, and the promenade is at its busiest after dark.", photo: x("dining-evening"), alt: "A terrace strung with lights in the evening" },
        { title: "Club racing", body: "Members race off the coast while the town follows from the promenade and the foot of the lighthouse.", photo: x("sports-sailing"), alt: "A yacht on turquoise water" },
        { title: "Life on the promenade", body: "Cafés, boutiques and a weekend market of local producers line the waterfront from morning to late evening.", photo: ev("food-market"), alt: "A drink served at a waterfront table" },
      ] },
  },
  golf: {
    overview: { title: "Eighteen holes by the sea",
      body: "The golf course covers 980,000 square metres along the coast, with the sea in view from much of the round. Homes of the golf community face the fairways, and the clubhouse is planned as a social centre for players and non-players alike.",
      facts: [["980K sqm", "Golf course area"], ["18", "Holes, by the sea"], ["1", "Clubhouse and golf academy"], ["Year-round", "Mild winters for play"]] },
    here: { tag: "At the club", title: "What's at the club", body: "A championship course, and everything a golf community needs around it.",
      photo: ph("ui-g-terraces"), alt: "Homes with terraces and bougainvillea above the sea",
      rows: [
        ["Championship course", "Eighteen holes laid out along the coast, playable in every season."],
        ["Clubhouse", "A terrace restaurant, a lounge and changing rooms overlooking the eighteenth green."],
        ["Golf academy", "Lessons, junior programmes and club fitting with resident professionals."],
        ["Practice facilities", "A driving range, a short-game area and putting greens, open from sunrise."],
        ["Golf & Spa Hotel", "A resort and spa framed by the course, for visiting players and guests."],
      ],
      // one photo per row, for the shared Landmarks section (lib/experience-detail: what's here)
      photos: [gen("golf-course"), ph("ui-g-terraces"), gen("golf-academy"), gen("golf-practice"), "/images/hotels/golf-spa.jpg"] },
    community: { tag: "The golf community", title: "A club, not only a course",
      body: ["Homes in the golf community are set along the fairways, so the course is part of the view and the daily walk. Membership is planned for residents, with access for hotel guests and visiting players.",
        "The clubhouse brings the community together beyond the game: breakfast on the terrace, monthly medals, and dinners that run late into the evening."],
      photos: [x("golf-clubhouse-terrace"), x("golf-clubhouse-bar")], alt: ["A shaded terrace restaurant by the sea", "Bar stools at the clubhouse"],
      points: [["Membership", "Planned for residents, families and juniors"], ["Competitions", "Monthly medals and seasonal championships"], ["Junior academy", "Coaching for young players every week"], ["Clubhouse life", "Dining, the lounge and events all year"]] },
    week: { tag: "At the club", title: WEEK, body: "Early tee times, coaching after school and a supper to close the week: the club runs on the same rhythm as the neighbourhood.",
      items: [
        { title: "Early rounds", body: "The first groups go out at sunrise and play the 18 holes before the heat of the day, then breakfast on the terrace.", photo: ev("golf-open"), alt: "A family on a grassy hill at golden hour" },
        { title: "The junior academy", body: "Coaching for young players on the range and the short-game area, with a path from first swings to club competitions.", photo: gen("golf-putting"), alt: "Two young players putting on a green by the sea" },
        { title: "Family days", body: "The clubhouse pool and lawns make the club a place for the whole family, not only for the players.", photo: ph("ui-g-pool"), alt: "A pool among olive trees" },
        { title: "Evenings at the club", body: "Members' dinners, prize-givings and quiet evenings in the lounge close the week at the clubhouse.", photo: ev("hotel-gala"), alt: "A cocktail on a marble bar" },
      ] },
  },
  sports: {
    overview: { title: "An active life, every season",
      body: "Sport is part of the city's layout rather than an add-on: courts and pitches within the neighbourhoods, cycling routes and promenades between them, and the open sea at the end of the street. The mild climate keeps the calendar running all year.",
      facts: [["22 km", "Lagoon promenades for running and cycling"], ["7.2 km", "Shoreline for swimming and sailing"], ["370", "International marina berths"], ["1", "Polo and equestrian club"]] },
    here: { tag: "Facilities", title: "Where the city plays", body: "From neighbourhood courts to the open water, sport is a short walk from home.",
      photo: x("sports-courts"), alt: "A tennis court above the sea",
      rows: [
        ["Courts", "Tennis and padel courts in every neighbourhood, floodlit for evening play."],
        ["Pitches and sports halls", "Football, basketball and multi-sport halls shared by clubs and schools."],
        ["Running and cycling routes", "Marked loops along the beach and lagoon promenades, linked by the Loop."],
        ["Water sports", "Sailing, kayaking, paddleboarding and open-water swimming from the marina and the beach."],
        ["Polo and equestrian club", "Stables, arenas and riding trails, one of the masterplan's anchors."],
        ["Outdoor fitness", "Gyms and fitness stations along the promenades."],
      ],
      // one photo per row, for the shared Landmarks section (lib/experience-detail: what's here)
      photos: [x("sports-courts"), gen("sports-pitches"), ph("ui-g-boardwalk"), x("sports-sailing"), gen("sports-polo"), gen("sports-fitness")] },
    community: { tag: "The sports community", title: "Clubs that keep the city moving",
      body: ["Sports clubs are planned around the neighbourhoods, so playing is as easy as walking to the court. Leagues and ladders give residents a reason to meet every week, and the schools share the same facilities.",
        "Running and cycling groups use the promenades at sunrise, and the marina's sailing school gives children a way onto the water."],
      photos: [x("sports-swim"), x("sports-sailing")], alt: ["A swimmer in clear water", "A yacht on turquoise water"],
      points: [["Tennis and padel", "Neighbourhood ladders and coaching"], ["Running club", "Group runs on the promenades"], ["Sailing school", "Lessons from the local marina"], ["Riding", "Lessons and hacks at the equestrian club"]] },
    week: { tag: "On the move", title: WEEK, body: "Something to join every day of the week, from first light on the promenade to matches under the floodlights.",
      items: [
        { title: "Running the promenade", body: "Group runs of 5 and 10 kilometres follow the beach promenade at first light, with routes for every pace.", photo: ev("coastal-run"), alt: "Runners on the coast" },
        { title: "Swim squads", body: "Coached open-water sessions at the beach and lengths in the sheltered lagoons, for juniors and adults.", photo: ph("ui-lagoon-clear"), alt: "Clear lagoon water" },
        { title: "On the water", body: "Sailing, paddleboarding and kayaking from the watersports centres and the local marina.", photo: x("marina-sailing"), alt: "Sailing on the open sea" },
        { title: "Junior sports", body: "Football, tennis, padel and sailing for children, taught by club coaches in the neighbourhoods.", photo: gen("sports-junior"), alt: "Children playing football on a grass pitch by the sea" },
      ] },
  },
  "retail-dining": {
    overview: { title: "Town centres made for walking",
      body: "Everyday shops, cafés and restaurants sit in walkable town centres, along a commercial boulevard and beside the water. Dining runs from the marina quay to the lagoon edge, so a good table is always close to home.",
      facts: [["Town centres", "Everyday shops a short walk from home"], ["Boulevard", "The city's commercial street"], ["Marina quay", "Dining over the water"], ["Year-round", "Open in every season"]] },
    here: { tag: "Where to go", title: "Shops and tables", body: "Daily needs close to home; the boulevard and the marina for an evening out.",
      photo: x("dining-evening"), alt: "A terrace strung with lights in the evening",
      rows: [
        ["Town centres", "Groceries, pharmacies, bakeries and cafés within each district."],
        ["Commercial boulevard", "Shops, showrooms and terraces along the city's main street."],
        ["Marina dining", "Restaurants and bars over the berths, from breakfast until late."],
        ["Waterfront cafés", "Cafés and kiosks along the beach and lagoon promenades."],
        ["Markets", "Weekly markets for local produce, crafts and food."],
      ],
      // one photo per row, for the shared Landmarks section (lib/experience-detail: what's here)
      photos: [md("m06"), ph("ui-lighthouse-aerial"), x("dining-evening"), ph("ui-g-interior"), md("m03")] },
    community: { tag: "The table", title: "Where neighbours meet",
      body: ["In a year-round city, the café and the market are where people get to know each other. Town centres are planned as squares as much as shopping streets, with shade, seating and room for events.",
        "Independent cafés and local producers sit alongside international brands, and the market calendar keeps the town centres busy beyond summer."],
      photos: [ph("ui-g-table"), x("dining-table")], alt: ["A long table set under the arches", "Friends sharing a drink"],
      points: [["Weekly market", "Local produce and makers"], ["Chef's tables", "Seasonal dinners with guest chefs"], ["Late opening", "Evenings on the boulevard and the quay"], ["Local makers", "Space for independent shops"]] },
    week: { tag: "Around the table", title: WEEK, body: "Bread in the morning, the market on Thursday, dinner on the quay: the town centres keep the week's rhythm.",
      items: [
        { title: "Mornings in town", body: "Bakeries and cafés open early under the town centres' arcades, before school and work.", photo: ph("ui-g-colonnade"), alt: "A shaded colonnade by the sea" },
        { title: "Market days", body: "Growers, bakers and cooks from across the coast set up along the marina promenade every week.", photo: ev("food-market"), alt: "A drink served at a market table" },
        { title: "Dinner on the quay", body: "Tables along the berths fill as the marina lights come on, with menus built on the day's catch.", photo: md("m09"), alt: "A dining terrace under arches" },
        { title: "Long lunches", body: "Slow, seasonal lunches on shaded terraces along the boulevard, in every season of the year.", photo: x("dining"), alt: "A table set for lunch" },
      ] },
  },
  hotels: {
    community: { tag: "Hospitality", title: "Service that stays all year",
      body: ["Hotels and residences share the same streets, so hospitality is part of the neighbourhood rather than set apart from it. Hotel restaurants, spas and beach clubs are planned to be open to residents as well as guests.",
        "With more than 3,500 rooms planned across the city, friends and family always have somewhere to stay close by, in every season."],
      photos: [x("hotels-pool"), x("hotels-suite")], alt: ["An infinity pool facing the sea", "A guest in a robe by the window"],
      points: [["Serviced residences", "Hotel service at home"], ["Spa and wellness", "Open to residents and guests"], ["Beach clubs", "Days on the sand with hotel service"], ["Dining", "Restaurants open to the city"]] },
    week: { tag: "At the hotels", title: WEEK, body: "The hotels' calendar is open to the neighbourhood, from yoga at sunrise to jazz by the lagoon.",
      items: [
        { title: "Mornings by the water", body: "Yoga on the sand and swims before breakfast are open to residents as well as hotel guests.", photo: ev("wellness-retreat"), alt: "Friends relaxing by the sea" },
        { title: "Long lunches", body: "Seasonal menus on the hotels' terraces, with the lagoons and the open sea on either side.", photo: ph("ui-g-table"), alt: "A long table under the arches" },
        { title: "The chef's table", body: "Guest chefs cook by the water through the year, in the hotels' restaurants and on the marina.", photo: md("m03"), alt: "A candlelit table at night" },
        { title: "Music after dinner", body: "Live music on the lagoon shore and in the hotel lounges, open to the whole neighbourhood.", photo: ph("ui-g-music"), alt: "Musicians playing in the evening" },
      ] },
  },
  wellness: {
    overview: { title: "Wellness and longevity by the sea",
      body: "Wellness here starts outdoors: a swim in the lagoon, a walk along the shore, a slower pace through the day. Spas, clinics and studios are planned within reach of every neighbourhood, with 85 % of the city kept as open space.",
      facts: [["85%", "Of the city kept as open space"], ["7.2 km", "Coastal walk along the shore"], ["850K sqm", "Swimmable lagoons"], ["Year-round", "A mild Mediterranean climate"]] },
    here: { tag: "Facilities", title: "Places to restore", body: "Water, shade and open space, with care close to home.",
      photo: ph("ui-g-pool"), alt: "A pool among olive trees",
      rows: [
        ["Spa", "Treatment rooms, hammam and thermal pools at the hotels, open to residents."],
        ["Coastal trails", "Walking and running routes along the shore and the lagoons."],
        ["Yoga and movement studios", "Daily classes indoors and on the beach at sunrise."],
        ["Lagoon swimming", "Calm, clear water for lap swimming and recovery."],
        ["Clinics", "Neighbourhood clinics for everyday and preventive care."],
      ],
      // one photo per row, for the shared Landmarks section (lib/experience-detail: what's here)
      photos: [ph("ui-g-pool"), ph("ui-sea-wide"), "/images/hotels/ev-yoga.jpg", ph("ui-v-turq"), gen("wellness-clinic")] },
    community: { tag: "The wellness community", title: "A slower pace, shared",
      body: ["Wellness at Alam Al Roum is designed into ordinary days: streets with shade, routes that invite walking, and water within reach of every home. Practitioners, clinics and studios work together, so care and prevention sit side by side.",
        "Morning classes on the beach, swimming groups in the lagoons and seasonal retreats give the community a rhythm that carries on after summer."],
      photos: [x("wellness-rest"), x("wellness-shore")], alt: ["Resting in a quiet room", "A wave running up the sand"],
      points: [["Morning movement", "Yoga and breathwork on the beach"], ["Swim groups", "Lagoon sessions for every level"], ["Seasonal retreats", "Days of rest, food and the sea"], ["Preventive care", "Clinics close to home"]] },
    week: { tag: "A slower pace", title: WEEK, body: "Movement in the morning, the water at midday, rest when the light goes.",
      items: [
        { title: "Sunrise movement", body: "Yoga and breathwork on the beach as the sun comes up over the sea, led by resident practitioners.", photo: md("m11"), alt: "Two women resting by the sea" },
        { title: "Lagoon swims", body: "Guided swims in calm, clear water for every level, from first strokes to long distances.", photo: ph("ui-lagoon-clear"), alt: "Clear lagoon water" },
        { title: "Coastal walks", body: "Unhurried walks along the shore and the promenade, with shade and water stops along the way.", photo: ph("ui-g-coast"), alt: "The coast seen from above" },
        { title: "Rest and treatments", body: "Spa rooms, thermal pools and quiet lounges, open to residents through the year.", photo: ph("ui-v-lounge"), alt: "A quiet lounge" },
      ] },
  },
  education: {
    overview: { title: "Schools for families who stay",
      body: "Nurseries and schools are planned within the neighbourhoods, so children can walk or cycle to class. A dedicated learning hub brings together after-school programmes, languages and the arts, and the coast's three thousand years of history give lessons a setting outside the classroom.",
      facts: [["1", "Dedicated learning hub"], ["3,000+ yrs", "Of history on this coast"], ["85%", "Open space to learn outdoors"], ["Walkable", "Schools within the neighbourhoods"]] },
    here: { tag: "Learning", title: "From nursery to the learning hub", body: "Every stage of learning, a short walk or ride from home.",
      photo: x("education-hub"), alt: "Arches and a stair in pale plaster",
      rows: [
        ["Nurseries", "Early years close to home, within each neighbourhood."],
        ["Schools", "Primary and secondary schools, planned with education partners."],
        ["Learning hub", "After-school clubs, languages, coding and the arts for every age."],
        ["Outdoor learning", "Lessons on the shore, by the lagoons and along the Roman trail."],
        ["Libraries and studios", "Quiet places to read, make and study."],
      ],
      // one photo per row, for the shared Landmarks section (lib/experience-detail: what's here)
      photos: [gen("education-nursery"), x("education-hub"), ph("ui-expcenter-lobby"), ph("ui-lagoon-clear"), md("m02")] },
    community: { tag: "The school community", title: "Learning as part of the neighbourhood",
      body: ["Schools are planned as part of the neighbourhoods they serve, with safe walking and cycling routes and shared sports facilities. Parents meet at the gate; children grow up knowing their streets.",
        "The learning hub stays open beyond school hours, with clubs, holiday programmes and courses for adults, so learning carries on through life in the city."],
      photos: [x("education-heritage"), x("education-nature")], alt: ["A carved Ionic capital", "The spiral of a fossil shell"],
      points: [["Safe routes", "Walking and cycling to school"], ["After-school clubs", "Sport, arts and languages"], ["Holiday programmes", "Camps on the shore and the lagoons"], ["Adult courses", "Languages, crafts and talks"]] },
    week: { tag: "School days", title: WEEK, body: "A school week that uses the whole city: the streets, the shore and the history on the doorstep.",
      items: [
        { title: "Walking to school", body: "Shaded, car-free routes let children walk and cycle to class from every neighbourhood.", photo: ph("ui-g-colonnade"), alt: "A shaded colonnade" },
        { title: "Studios and making", body: "After-school clubs in design, coding and craft at the learning hub, for every age.", photo: md("m10"), alt: "A vase on a spiral plaster stair" },
        { title: "Lessons by the shore", body: "Marine science and nature study by the lagoons and the beach, with the coast as the classroom.", photo: ph("ui-v-ripples"), alt: "Light on shallow water" },
        { title: "Family weekends", body: "Workshops for parents and children together, from the history of the coast to the night sky.", photo: md("m08"), alt: "A family on a hill at golden hour" },
      ] },
  },
  culture: {
    overview: { title: "A calendar for the whole year",
      body: "Culture fills the city in every season: talks and exhibitions, music on the promenade and festivals by the sea. An events centre and an international expo and convention centre anchor the calendar, and the coast's Roman past runs through it.",
      facts: [["Events Centre", "Concerts, shows and celebrations"], ["Expo Centre", "International expo and convention centre"], ["3,000+ yrs", "Of history on this coast"], ["Year-round", "Arts and events in every season"]] },
    here: { tag: "Venues", title: "Where culture happens", body: "Stages, galleries and a history you can walk.",
      photo: x("culture-fresco"), alt: "A fragment of a Roman fresco",
      rows: [
        ["Events Centre", "Concerts, performances and celebrations for the city and its visitors."],
        ["Expo and Convention Centre", "International exhibitions, conferences and trade events."],
        ["Roman archaeological trail", "A walking route through the site's history, linked to the promenade."],
        ["Public art", "Sculpture and installations along the beach and marina promenades."],
        ["Experience Center", "The first place to see the city, with talks and exhibitions through the year."],
      ],
      // one photo per row, for the shared Landmarks section (lib/experience-detail: what's here)
      photos: [gen("culture-events-centre"), ph("ui-expcenter-facade"), ph("ui-g-colonnade"), ph("ui-v-sculpture"), ph("ui-expcenter-court")] },
    community: { tag: "The cultural community", title: "A city that gathers",
      body: ["Culture here is made with the community, not only for it. Talks, workshops and open studios invite residents to take part, and the city's festivals draw on the history and the crafts of the coast.",
        "From the symposium on the Roman coast to music on the quay, the calendar is planned to keep the city lively in every season."],
      photos: [x("culture-music"), x("culture-studio")], alt: ["A record on a turntable", "A woman filming with a vintage camera"],
      points: [["Talks and symposia", "History, design and the coast"], ["Music", "Concerts on the quay and at the events centre"], ["Workshops", "Crafts, photography and the arts"], ["Festivals", "Seasonal celebrations by the sea"]] },
    week: { tag: "In the calendar", title: WEEK, body: "Talks, studios, music and a walk through history: a week of culture, close to home.",
      items: [
        { title: "Talks on the coast", body: "Historians and writers talk about three thousand years of the North Coast at the Experience Center.", photo: md("m12"), alt: "A carved Roman relief" },
        { title: "Open studios", body: "Artists and makers open their workshops to visitors through the year.", photo: md("m10"), alt: "A vase on a spiral plaster stair" },
        { title: "Music by the sea", body: "Live music on the marina quay as the sun sets, from local musicians to visiting ensembles.", photo: ph("ui-g-music"), alt: "Musicians playing in the evening" },
        { title: "The Roman trail", body: "Guided walks through the site's history, from the fortress of Ramesses II to the Roman port, ending by the sea.", photo: md("m01"), alt: "A fragment of a Roman mosaic" },
      ] },
  },
};
