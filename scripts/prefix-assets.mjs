// After a GitHub Pages export: prefix root-relative asset paths written as plain strings in the code
// ("/images/…", `/seq/…`, url(/icons/…)) with the Pages base path. Next already prefixes its own files and links.
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import path from "node:path";

const BASE = "/alam-al-roum-website", OUT = "out";
const DIRS = ["images", "video", "icons", "models", "seq"];
const re = new RegExp(`([\\s"'\`(=,])/(${DIRS.join("|")})/`, "g");
let files = 0, hits = 0;
const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) { if (!DIRS.includes(f) || dir !== OUT) walk(p); continue; }
    if (!/\.(html|js|css|txt|json)$/.test(f)) continue;
    const src = readFileSync(p, "utf8");
    const out = src.replace(re, (_, pre, d) => { hits++; return `${pre}${BASE}/${d}/`; });
    if (out !== src) { writeFileSync(p, out); files++; }
  }
};
walk(OUT);
console.log(`prefix-assets: ${hits} paths in ${files} files`);
