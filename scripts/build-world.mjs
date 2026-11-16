// Builds lib/geo/world.json, the country shapes for the interactive Connectivity map (components/connectivity), from Natural Earth
// 1:50m admin-0 countries (world-atlas, public domain): simplified so the file stays small, Antarctica dropped.
// Countries smaller than 3° across keep every point (Bahrain, Malta, Singapore… would otherwise collapse to nothing),
// and so does Egypt (KEEP).
// Run: node scripts/build-world.mjs [share of points kept, default 0.15]
import { readFileSync, writeFileSync } from "node:fs";
import { presimplify, simplify, quantile } from "topojson-simplify";
import { feature, quantize } from "topojson-client";
import { geoBounds } from "d3-geo";

const topo = JSON.parse(readFileSync("node_modules/world-atlas/countries-50m.json", "utf8"));
const q = Number(process.argv[2] ?? 0.15);
const pre = presimplify(topo);
const geoms = pre.objects.countries.geometries;
/**
 * Countries drawn at full 1:50m detail: Egypt, where the map zooms in to show its cities (a simplified coast puts
 * Alexandria at sea), and those whose coastal capital the simplified coast would leave offshore (checked 16 Nov).
 */
const KEEP = new Set(["Egypt", "United Arab Emirates", "Denmark", "Lebanon", "Senegal", "Liberia", "Sierra Leone", "Guinea-Bissau", "Uruguay"]);
const arcsOf = (a, out = new Set()) => { for (const x of a) { if (Array.isArray(x)) arcsOf(x, out); else out.add(x < 0 ? ~x : x); } return out; };
for (const g of geoms) {
  const [[x0, y0], [x1, y1]] = geoBounds(feature(topo, g));
  if ((Math.max(x1 - x0, y1 - y0) < 3 || KEEP.has(g.properties.name)) && g.arcs) for (const i of arcsOf(g.arcs)) for (const p of pre.arcs[i]) p[2] = Infinity;
}
const out = simplify(pre, quantile(pre, q));
out.objects.countries.geometries = out.objects.countries.geometries.filter((g) => g.properties.name !== "Antarctica");
delete out.objects.land;
// strip the per-point weights presimplify added, then quantize again (delta-encoded integers: a quarter of the size)
out.arcs = out.arcs.map((a) => a.map((p) => [p[0], p[1]]));
const small = quantize(out, 1e5);
const json = JSON.stringify(small);
writeFileSync("lib/geo/world.json", json);
console.log(`world.json: ${(json.length / 1024).toFixed(0)} KB, ${small.objects.countries.geometries.length} countries`);
