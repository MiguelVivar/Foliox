#!/usr/bin/env node
// One-off generator: reads the simple-icons npm package (a devDependency,
// never imported by app code) and emits a slim static JSON catalog of
// { label, slug, hex } for every brand. Re-run manually after
// `npm update simple-icons` to pick up new/renamed brands.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import * as simpleIcons from "simple-icons";

const icons = Object.values(simpleIcons).filter(
  (v) => v && typeof v === "object" && typeof v.title === "string",
);

const catalog = icons
  .map((icon) => ({
    label: icon.title,
    slug: icon.slug,
    hex: icon.hex,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

const outPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "lib",
  "techCatalogData.json",
);

writeFileSync(outPath, JSON.stringify(catalog), "utf8");
console.log(`Wrote ${catalog.length} entries to ${outPath}`);
