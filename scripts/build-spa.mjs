#!/usr/bin/env node
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(process.cwd());
const distDir = join(root, "dist");
const manifestPath = join(distDir, ".vite", "manifest.json");
const base = process.env.VITE_BASE_PATH || "/";
const normalizedBase = base.endsWith("/") ? base : `${base}/`;

console.log(`▶ Building SPA with base=\"${normalizedBase}\"`);
execSync("vite build --config vite.spa.config.ts", {
  stdio: "inherit",
  env: { ...process.env, VITE_BASE_PATH: normalizedBase },
});

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const entry = manifest["src/spa-entry.tsx"];

if (!entry?.file) {
  console.error("✖ Impossible de trouver l'entrée SPA dans le manifest");
  process.exit(1);
}

const entryJs = `${normalizedBase}${entry.file}`;
const entryCss = (entry.css || []).map((file) => `${normalizedBase}${file}`);

const html = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Simulateur Achat vs Location — 10 villes françaises</title>
    <meta name="description" content="Comparez l'achat et la location de votre résidence principale dans les 10 plus grandes villes françaises." />
${entryCss.map((href) => `    <link rel="stylesheet" href="${href}" />`).join("\n")}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${entryJs}"></script>
  </body>
</html>
`;

writeFileSync(join(distDir, "index.html"), html);
console.log(`✓ Wrote SPA index.html (entry: ${entry.file})`);
console.log("✅ SPA build complete → dist/");
