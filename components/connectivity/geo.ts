import { feature, merge } from "topojson-client";
import { geoArea, geoBounds, geoCentroid, geoDistance } from "d3-geo";
import type { Feature, Geometry, MultiPolygon, Polygon } from "geojson";
import type { GeometryCollection, GeometryObject, Topology } from "topojson-specification";
import world from "@/lib/geo/world.json";

/**
 * The map data for the interactive Connectivity map (16 Nov): Natural Earth 1:50m countries
 * (scripts/build-world.mjs), each with the city its route is drawn to and its distance from Alam Al Roum.
 */

/**
 * Alam Al Roum (16 Nov): 12 km east of Marsa Matrouh city centre (31.3543 N, 27.2373 E), the distance the developer's
 * and the listing sites agree on (no coordinates are published), just inland of the coast there (Natural Earth 1:10m
 * coastline at 31.313 N). To replace with the masterplan's own coordinates when Qatari Diar gives them.
 */
export const AAR: [number, number] = [27.364, 31.309];
const EARTH_KM = 6371.0088;
export const kmBetween = (a: [number, number], b: [number, number]) => geoDistance(a, b) * EARTH_KM;
/** 2,960 km: to the nearest 10 km (the city points are good to a few km). */
export const fmtKm = (km: number) => `${(Math.round(km / 10) * 10).toLocaleString("en-US")} km`;

/** Natural Earth's short names, written out. */
const NAMES: Record<string, string> = {
  "United States of America": "United States", "Dem. Rep. Congo": "DR Congo", "Central African Rep.": "Central African Republic",
  "Bosnia and Herz.": "Bosnia and Herzegovina", "Dominican Rep.": "Dominican Republic", "Eq. Guinea": "Equatorial Guinea",
  "S. Sudan": "South Sudan", Macedonia: "North Macedonia", eSwatini: "Eswatini", "Solomon Is.": "Solomon Islands",
  "Falkland Is.": "Falkland Islands", "Faeroe Is.": "Faroe Islands", "Marshall Is.": "Marshall Islands", "Cook Is.": "Cook Islands",
  "St. Vin. and Gren.": "St Vincent and the Grenadines", "St. Kitts and Nevis": "St Kitts and Nevis", "Antigua and Barb.": "Antigua and Barbuda",
  "São Tomé and Principe": "São Tomé and Príncipe", "Turks and Caicos Is.": "Turks and Caicos Islands", "Cayman Is.": "Cayman Islands",
  "British Virgin Is.": "British Virgin Islands", "U.S. Virgin Is.": "US Virgin Islands", "N. Mariana Is.": "Northern Mariana Islands",
  "Pitcairn Is.": "Pitcairn Islands", "Wallis and Futuna Is.": "Wallis and Futuna", "Fr. Polynesia": "French Polynesia",
  "St. Pierre and Miquelon": "Saint Pierre and Miquelon", "St-Martin": "Saint Martin", "St-Barthélemy": "Saint Barthélemy",
  Turkey: "Türkiye", Vatican: "Vatican City", "Saint Lucia": "Saint Lucia", "Cabo Verde": "Cabo Verde",
};
/** Parts drawn with their country: one shape, one name. */
const PART_OF: Record<string, string> = { Somaliland: "Somalia", "N. Cyprus": "Cyprus", "Åland": "Finland" };
/** Land drawn on the map that takes no hover or click (disputed or uninhabited). */
const INERT = new Set(["W. Sahara", "Siachen Glacier", "Fr. S. Antarctic Lands", "Heard I. and McDonald Is.", "Br. Indian Ocean Ter.",
  "S. Geo. and the Is.", "Ashmore and Cartier Is.", "Indian Ocean Ter."]);
/**
 * Where each country's route runs to: its capital (the map names the country, never the city; the card says "to the
 * capital"). Israel and Palestine have none here: their routes run to the middle of the country (left to the client).
 */
const CITY: Record<string, [string, number, number]> = {
  Zimbabwe: ["Harare", 31.05, -17.83], Zambia: ["Lusaka", 28.28, -15.42], Yemen: ["Sanaa", 44.21, 15.35], Vietnam: ["Hanoi", 105.85, 21.03],
  Venezuela: ["Caracas", -66.9, 10.49], Vatican: ["Vatican City", 12.45, 41.9], Vanuatu: ["Port Vila", 168.32, -17.73],
  Uzbekistan: ["Tashkent", 69.24, 41.31], Uruguay: ["Montevideo", -56.16, -34.9], Micronesia: ["Palikir", 158.16, 6.92],
  "Marshall Is.": ["Majuro", 171.38, 7.09], "N. Mariana Is.": ["Saipan", 145.75, 15.18], "U.S. Virgin Is.": ["Charlotte Amalie", -64.93, 18.34],
  Guam: ["Hagåtña", 144.75, 13.47], "American Samoa": ["Pago Pago", -170.7, -14.28], "Puerto Rico": ["San Juan", -66.11, 18.47],
  "United States of America": ["Washington, D.C.", -77.04, 38.91], "Saint Helena": ["Jamestown", -5.72, -15.92],
  "Pitcairn Is.": ["Adamstown", -130.1, -25.07], Anguilla: ["The Valley", -63.05, 18.22], "Falkland Is.": ["Stanley", -57.85, -51.69],
  "Cayman Is.": ["George Town", -81.38, 19.29], Bermuda: ["Hamilton", -64.78, 32.29], "British Virgin Is.": ["Road Town", -64.62, 18.43],
  "Turks and Caicos Is.": ["Cockburn Town", -71.14, 21.46], Montserrat: ["Brades", -62.21, 16.79], Jersey: ["St Helier", -2.11, 49.19],
  Guernsey: ["St Peter Port", -2.54, 49.46], "Isle of Man": ["Douglas", -4.48, 54.15], "United Kingdom": ["London", -0.13, 51.51],
  "United Arab Emirates": ["Abu Dhabi", 54.3773, 24.4539], Ukraine: ["Kyiv", 30.52, 50.45], Turkmenistan: ["Ashgabat", 58.38, 37.95],
  Turkey: ["Ankara", 32.85, 39.93], Tunisia: ["Tunis", 10.18, 36.81], "Trinidad and Tobago": ["Port of Spain", -61.52, 10.66],
  Tonga: ["Nukuʻalofa", -175.2, -21.14], Togo: ["Lomé", 1.23, 6.13], "Timor-Leste": ["Dili", 125.57, -8.56], Thailand: ["Bangkok", 100.5, 13.76],
  Tanzania: ["Dodoma", 35.74, -6.17], Tajikistan: ["Dushanbe", 68.78, 38.56], Taiwan: ["Taipei", 121.56, 25.03], Syria: ["Damascus", 36.29, 33.51],
  Switzerland: ["Bern", 7.45, 46.95], Sweden: ["Stockholm", 18.07, 59.33], eSwatini: ["Mbabane", 31.14, -26.31], Suriname: ["Paramaribo", -55.2, 5.85],
  "S. Sudan": ["Juba", 31.58, 4.85], Sudan: ["Khartoum", 32.53, 15.5], "Sri Lanka": ["Colombo", 79.86, 6.93], Spain: ["Madrid", -3.7, 40.42],
  "South Korea": ["Seoul", 126.98, 37.57], "South Africa": ["Pretoria", 28.19, -25.75], Somalia: ["Mogadishu", 45.32, 2.05],
  "Solomon Is.": ["Honiara", 159.97, -9.43], Slovakia: ["Bratislava", 17.11, 48.15], Slovenia: ["Ljubljana", 14.51, 46.06],
  Singapore: ["Singapore", 103.82, 1.35], "Sierra Leone": ["Freetown", -13.23, 8.48], Seychelles: ["Victoria", 55.45, -4.62],
  Serbia: ["Belgrade", 20.46, 44.79], Senegal: ["Dakar", -17.44, 14.69], "Saudi Arabia": ["Riyadh", 46.72, 24.71],
  "São Tomé and Principe": ["São Tomé", 6.73, 0.34], "San Marino": ["San Marino", 12.45, 43.94], Samoa: ["Apia", -171.77, -13.83],
  "St. Vin. and Gren.": ["Kingstown", -61.23, 13.16], "Saint Lucia": ["Castries", -60.99, 14.01], "St. Kitts and Nevis": ["Basseterre", -62.72, 17.3],
  Rwanda: ["Kigali", 30.06, -1.94], Russia: ["Moscow", 37.62, 55.76], Romania: ["Bucharest", 26.1, 44.43], Qatar: ["Doha", 51.53, 25.29],
  Portugal: ["Lisbon", -9.14, 38.72], Poland: ["Warsaw", 21.01, 52.23], Philippines: ["Manila", 120.98, 14.6], Peru: ["Lima", -77.04, -12.05],
  Paraguay: ["Asunción", -57.58, -25.26], "Papua New Guinea": ["Port Moresby", 147.18, -9.44], Panama: ["Panama City", -79.52, 8.98],
  Palau: ["Ngerulmud", 134.62, 7.5], Pakistan: ["Islamabad", 73.05, 33.68], Oman: ["Muscat", 58.41, 23.59], Norway: ["Oslo", 10.75, 59.91],
  "North Korea": ["Pyongyang", 125.75, 39.03], Nigeria: ["Abuja", 7.49, 9.06], Niger: ["Niamey", 2.11, 13.51], Nicaragua: ["Managua", -86.25, 12.13],
  "New Zealand": ["Wellington", 174.78, -41.29], Niue: ["Alofi", -169.92, -19.06], "Cook Is.": ["Avarua", -159.78, -21.21],
  Netherlands: ["Amsterdam", 4.9, 52.37], Aruba: ["Oranjestad", -70.03, 12.52], "Curaçao": ["Willemstad", -68.93, 12.11],
  Nepal: ["Kathmandu", 85.32, 27.72], Nauru: ["Yaren", 166.92, -0.55], Namibia: ["Windhoek", 17.08, -22.56], Mozambique: ["Maputo", 32.57, -25.97],
  Morocco: ["Rabat", -6.84, 34.02], Montenegro: ["Podgorica", 19.26, 42.44], Mongolia: ["Ulaanbaatar", 106.91, 47.89],
  Moldova: ["Chișinău", 28.86, 47.01], Monaco: ["Monaco", 7.42, 43.74], Mexico: ["Mexico City", -99.13, 19.43], Mauritius: ["Port Louis", 57.5, -20.16],
  Mauritania: ["Nouakchott", -15.98, 18.08], Malta: ["Valletta", 14.51, 35.9], Mali: ["Bamako", -8.0, 12.64], Maldives: ["Malé", 73.51, 4.18],
  Malaysia: ["Kuala Lumpur", 101.69, 3.14], Malawi: ["Lilongwe", 33.79, -13.96], Madagascar: ["Antananarivo", 47.52, -18.88],
  Macedonia: ["Skopje", 21.43, 42.0], Luxembourg: ["Luxembourg", 6.13, 49.61], Lithuania: ["Vilnius", 25.28, 54.69],
  Liechtenstein: ["Vaduz", 9.52, 47.14], Libya: ["Tripoli", 13.19, 32.89], Liberia: ["Monrovia", -10.8, 6.3], Lesotho: ["Maseru", 27.48, -29.31],
  Lebanon: ["Beirut", 35.5, 33.89], Latvia: ["Riga", 24.11, 56.95], Laos: ["Vientiane", 102.63, 17.97], Kyrgyzstan: ["Bishkek", 74.59, 42.87],
  Kuwait: ["Kuwait City", 47.98, 29.38], Kosovo: ["Pristina", 21.17, 42.66], Kiribati: ["Tarawa", 173.03, 1.45], Kenya: ["Nairobi", 36.82, -1.29],
  Kazakhstan: ["Astana", 71.45, 51.17], Jordan: ["Amman", 35.93, 31.95], Japan: ["Tokyo", 139.69, 35.69], Jamaica: ["Kingston", -76.79, 18.02],
  Italy: ["Rome", 12.5, 41.9], Ireland: ["Dublin", -6.26, 53.35], Iraq: ["Baghdad", 44.37, 33.31], Iran: ["Tehran", 51.39, 35.69],
  Indonesia: ["Jakarta", 106.85, -6.21], India: ["New Delhi", 77.21, 28.61], Iceland: ["Reykjavík", -21.94, 64.15], Hungary: ["Budapest", 19.04, 47.5],
  Honduras: ["Tegucigalpa", -87.21, 14.07], Haiti: ["Port-au-Prince", -72.34, 18.54], Guyana: ["Georgetown", -58.16, 6.8],
  "Guinea-Bissau": ["Bissau", -15.6, 11.86], Guinea: ["Conakry", -13.68, 9.64], Guatemala: ["Guatemala City", -90.51, 14.63],
  Grenada: ["St George's", -61.75, 12.06], Greece: ["Athens", 23.73, 37.98], Ghana: ["Accra", -0.19, 5.6], Germany: ["Berlin", 13.4, 52.52],
  Georgia: ["Tbilisi", 44.79, 41.72], Gambia: ["Banjul", -16.58, 13.45], Gabon: ["Libreville", 9.45, 0.39], France: ["Paris", 2.35, 48.86],
  "St. Pierre and Miquelon": ["Saint-Pierre", -56.18, 46.78], "Wallis and Futuna Is.": ["Mata-Utu", -176.17, -13.28],
  "St-Martin": ["Marigot", -63.08, 18.07], "St-Barthélemy": ["Gustavia", -62.85, 17.9], "Fr. Polynesia": ["Papeete", -149.57, -17.54],
  "New Caledonia": ["Nouméa", 166.46, -22.26], Finland: ["Helsinki", 24.94, 60.17], Fiji: ["Suva", 178.44, -18.14],
  Ethiopia: ["Addis Ababa", 38.75, 9.03], Estonia: ["Tallinn", 24.75, 59.44], Eritrea: ["Asmara", 38.93, 15.32], "Eq. Guinea": ["Malabo", 8.78, 3.75],
  "El Salvador": ["San Salvador", -89.19, 13.69], Egypt: ["Cairo", 31.24, 30.04], Ecuador: ["Quito", -78.47, -0.18],
  "Dominican Rep.": ["Santo Domingo", -69.93, 18.49], Dominica: ["Roseau", -61.39, 15.3], Djibouti: ["Djibouti", 43.15, 11.59],
  Greenland: ["Nuuk", -51.72, 64.18], "Faeroe Is.": ["Tórshavn", -6.77, 62.01], Denmark: ["Copenhagen", 12.57, 55.68], Czechia: ["Prague", 14.42, 50.08],
  Cyprus: ["Nicosia", 33.38, 35.19], Cuba: ["Havana", -82.37, 23.11], Croatia: ["Zagreb", 15.98, 45.81], "Côte d'Ivoire": ["Yamoussoukro", -5.28, 6.83],
  "Costa Rica": ["San José", -84.09, 9.93], "Dem. Rep. Congo": ["Kinshasa", 15.27, -4.44], Congo: ["Brazzaville", 15.24, -4.26],
  Comoros: ["Moroni", 43.26, -11.7], Colombia: ["Bogotá", -74.07, 4.71], China: ["Beijing", 116.41, 39.9], Macao: ["Macau", 113.54, 22.2],
  "Hong Kong": ["Hong Kong", 114.17, 22.32], Chile: ["Santiago", -70.67, -33.45], Chad: ["N'Djamena", 15.04, 12.13],
  "Central African Rep.": ["Bangui", 18.56, 4.39], "Cabo Verde": ["Praia", -23.51, 14.93], Canada: ["Ottawa", -75.7, 45.42],
  Cameroon: ["Yaoundé", 11.52, 3.85], Cambodia: ["Phnom Penh", 104.92, 11.56], Myanmar: ["Naypyidaw", 96.13, 19.76], Burundi: ["Gitega", 29.93, -3.43],
  "Burkina Faso": ["Ouagadougou", -1.53, 12.37], Bulgaria: ["Sofia", 23.32, 42.7], Brunei: ["Bandar Seri Begawan", 114.94, 4.9],
  Brazil: ["Brasília", -47.88, -15.79], Botswana: ["Gaborone", 25.91, -24.65], "Bosnia and Herz.": ["Sarajevo", 18.41, 43.86],
  Bolivia: ["La Paz", -68.15, -16.5], Bhutan: ["Thimphu", 89.64, 27.47], Benin: ["Porto-Novo", 2.63, 6.5], Belize: ["Belmopan", -88.77, 17.25],
  Belgium: ["Brussels", 4.35, 50.85], Belarus: ["Minsk", 27.56, 53.9], Barbados: ["Bridgetown", -59.62, 13.1], Bangladesh: ["Dhaka", 90.41, 23.81],
  Bahrain: ["Manama", 50.59, 26.23], Bahamas: ["Nassau", -77.34, 25.05], Azerbaijan: ["Baku", 49.87, 40.41], Austria: ["Vienna", 16.37, 48.21],
  Australia: ["Canberra", 149.13, -35.28], "Norfolk Island": ["Kingston", 167.95, -29.06], Armenia: ["Yerevan", 44.51, 40.18],
  Argentina: ["Buenos Aires", -58.38, -34.6], "Antigua and Barb.": ["St John's", -61.85, 17.12], Angola: ["Luanda", 13.23, -8.84],
  Andorra: ["Andorra la Vella", 1.52, 42.51], Algeria: ["Algiers", 3.06, 36.75], Albania: ["Tirana", 19.82, 41.33], Afghanistan: ["Kabul", 69.21, 34.56],
  "Sint Maarten": ["Philipsburg", -63.05, 18.03],
};
/**
 * Flight time, ESTIMATED from the distance for every country (16 Nov, owner's call; real schedule data, if wanted, is
 * for the back end to supply): 30 min for take-off, climb and landing, plus the straight-line distance at a cruising
 * 800 km/h, to the nearest 5 min. Real flights run longer where there is no direct route.
 */
export const estFlightMin = (km: number) => Math.round((30 + (km / 800) * 60) / 5) * 5;
/** Drive time within Egypt, ESTIMATED the same way: the straight line × 1.2 for the road's bends, at 90 km/h. */
export const estDriveMin = (km: number) => Math.round(((km * 1.2) / 90) * 60 / 5) * 5;
/** "≈ 4 h 35 min" */
export const fmtFlight = (min: number) => `≈ ${Math.floor(min / 60) ? `${Math.floor(min / 60)} h ` : ""}${min % 60 ? `${min % 60} min` : ""}`.trim();
/** The six markets pinned on the map, by country. */
export const PICKS = ["Qatar", "Italy", "United Arab Emirates", "Saudi Arabia", "United Kingdom", "France"];
/**
 * The rest of the Gulf, pinned like the six markets (18 Nov review, Omnia #76: show that the Gulf countries can be
 * clicked). Kept apart from PICKS, which also frames the map's opening view.
 */
export const GULF = ["Kuwait", "Bahrain", "Oman"];
/** every country with a named pin */
export const PINNED = [...PICKS, ...GULF];
/** Pin names that would not fit written out. */
const SHORT: Record<string, string> = { "United Arab Emirates": "UAE", "United Kingdom": "UK" };

/**
 * Egypt's cities, shown when Egypt is chosen or zoomed into: [name, lon, lat, side of the pin its name sits on].
 * The six main travel hubs, spread across the country so their pins and names never crowd (16 Nov: fewer cities; El
 * Alamein, Siwa, Port Said and Ain Sokhna dropped, Marsa Matrouh and Ras El Hekma sit on top of Alam Al Roum). City
 * centres to about 0.01° (1 km), each checked to fall inside Egypt's outline on the map (Hurghada sits on its coast).
 */
const EG_CITIES: [string, number, number, "l" | "r" | "t" | "b"][] = [
  ["Cairo", 31.2357, 30.0444, "r"], ["Alexandria", 29.9187, 31.2001, "r"], ["Sharm El Sheikh", 34.3299, 27.9158, "t"],
  ["Hurghada", 33.8116, 27.2579, "r"], ["Luxor", 32.6396, 25.6872, "r"], ["Aswan", 32.8998, 24.0889, "r"],
];

/** A place on the map: a country (its shape, its route to the capital) or one of Egypt's cities. */
export type Place = {
  key: string;              // Natural Earth name for a country, "eg:<city>" for a city (stable id)
  name: string;             // display name: always the country's for a country
  short?: string;           // the pin's name, where the full one would not fit
  kind: "country" | "city";
  country?: string;         // a city's country
  shape?: Feature<Geometry>;
  capital: boolean;         // a country's route runs to its capital (false: to its middle)
  to: [number, number];     // [lon, lat] the route runs from
  km: number;
  flightMin: number;        // estimated (estFlightMin); the back end may replace it with real data
  driveMin?: number;        // cities: estimated (estDriveMin)
  side?: "l" | "r" | "t" | "b";
  note?: string;
  small: boolean;           // too small to hit at the default zoom: gets a dot of its own
  inert: boolean;
  home: boolean;            // Egypt
};
/** @deprecated name kept for the components: a Place */
export type Country = Place;

type Obj = GeometryCollection<{ name: string }>;
const topo = world as unknown as Topology<{ countries: Obj }>;
const geoms = topo.objects.countries.geometries as (GeometryObject<{ name: string }>)[];

/** The largest polygon's centre, for a route with no capital (geoCentroid of a whole MultiPolygon can fall in the sea). */
const middle = (f: Feature<Geometry>): [number, number] => {
  const g = f.geometry as Polygon | MultiPolygon;
  if (g.type !== "MultiPolygon") return geoCentroid(f) as [number, number];
  const parts = g.coordinates.map((c) => ({ type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: c } }) as Feature<Polygon>);
  return geoCentroid(parts.reduce((a, b) => (geoArea(b) > geoArea(a) ? b : a))) as [number, number];
};

/** Countries only (each with its shape). */
export const COUNTRIES: Place[] = (() => {
  const groups = new Map<string, typeof geoms>();
  const nameOf = (g: (typeof geoms)[number]) => (g.properties as { name: string }).name;
  for (const g of geoms) { const k = PART_OF[nameOf(g)] ?? nameOf(g); groups.set(k, [...(groups.get(k) ?? []), g]); }
  return [...groups].map(([key, gs]) => {
    const shape: Feature<Geometry> = gs.length > 1
      ? { type: "Feature", properties: { name: key }, geometry: merge(topo, gs as never) }
      : (feature(topo, gs[0] as never) as Feature<Geometry>);
    const c = CITY[key];
    const to: [number, number] = c ? [c[1], c[2]] : middle(shape);
    const [[x0, y0], [x1, y1]] = geoBounds(shape), km = kmBetween(AAR, to);
    return {
      key, name: NAMES[key] ?? key, short: SHORT[key], kind: "country" as const, shape, capital: !!c, to, km, flightMin: estFlightMin(km),
      small: Math.max(Math.abs(x1 - x0), y1 - y0) < 1.2 && !INERT.has(key), inert: INERT.has(key), home: key === "Egypt",
    };
  });
})();
/** Egypt's cities. */
export const CITIES: Place[] = EG_CITIES.map(([name, lon, lat, side]) => {
  const to: [number, number] = [lon, lat], km = kmBetween(AAR, to);
  return {
    key: `eg:${name}`, name, kind: "city" as const, country: "Egypt", capital: false, to, km, flightMin: estFlightMin(km), driveMin: estDriveMin(km), side,
    note: name === "Cairo" ? "440 km by the International Coastal Road" : undefined, small: false, inert: false, home: false,
  };
});
export const PLACES = [...COUNTRIES, ...CITIES];
export const byKey = new Map(PLACES.map((c) => [c.key, c]));
export const EGYPT = byKey.get("Egypt")!;
export const isEgypt = (key: string | null) => key === "Egypt" || !!key?.startsWith("eg:");

/** Seas, named quietly on the flat map. */
export const SEAS: { n: string; at: [number, number] }[] = [
  { n: "Mediterranean Sea", at: [18.5, 34.6] }, { n: "Red Sea", at: [38.2, 20.6] }, { n: "Arabian Gulf", at: [51.2, 27.6] },
  { n: "Black Sea", at: [34.5, 43.3] }, { n: "Atlantic Ocean", at: [-24, 32] }, { n: "Arabian Sea", at: [63, 16] }, { n: "Caspian Sea", at: [50.6, 41.8] },
];
