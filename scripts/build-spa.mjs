#!/usr/bin/env node
/**
 * Build the project as a static SPA for GitHub Pages.
 *
 * Strategy:
 * - Run a normal `vite build` (TanStack Start handles SSR build).
 * - Locate the client assets emitted by the build.
 * - Generate a static `dist/index.html` referencing those assets so
 *   GitHub Pages can serve a pure SPA (no SSR runtime needed).
 *
 * Base path is taken from VITE_BASE_PATH (e.g. "/my-repo/").
 */
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, cpSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(process.cwd());
const base = process.env.VITE_BASE_PATH || "/";
const normalizedBase = base.endsWith("/") ? base : base + "/";

console.log(`▶ Building SPA with base="${normalizedBase}"`);

// 1. Run the standard build
execSync("vite build", { stdio: "inherit", env: { ...process.env, VITE_BASE_PATH: normalizedBase } });

// 2. Find the client output directory.
//    TanStack Start typically emits client assets to `.output/public` or `dist/client`.
const candidates = [
  join(root, "dist", "client"),
  join(root, ".output", "public"),
  join(root, "dist"),
];
const clientDir = candidates.find((p) => {
  if (!existsSync(p)) return false;
  // Must contain at least one JS asset
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const s = statSync(full);
      if (s.isDirectory()) {
        if (walk(full)) return true;
      } else if (entry.endsWith(".js")) {
        return true;
      }
    }
    return false;
  };
  return walk(p);
});

if (!clientDir) {
  console.error("✖ Could not locate client build output. Looked in:", candidates);
  process.exit(1);
}
console.log(`✓ Client assets found at: ${clientDir}`);

// 3. Ensure final output is in dist/
const finalDist = join(root, "dist");
if (clientDir !== finalDist) {
  mkdirSync(finalDist, { recursive: true });
  cpSync(clientDir, finalDist, { recursive: true });
  console.log(`✓ Copied client assets to ${finalDist}`);
}

// 4. Locate the entry JS file (Vite emits hashed names in /assets)
const assetsDir = join(finalDist, "assets");
let entryJs = null;
let entryCss = null;
if (existsSync(assetsDir)) {
  const files = readdirSync(assetsDir);
  // Pick the largest .js as entry (heuristic) and first .css
  const jsFiles = files.filter((f) => f.endsWith(".js")).map((f) => ({ f, size: statSync(join(assetsDir, f)).size }));
  jsFiles.sort((a, b) => b.size - a.size);
  if (jsFiles[0]) entryJs = `assets/${jsFiles[0].f}`;
  const css = files.find((f) => f.endsWith(".css"));
  if (css) entryCss = `assets/${css}`;
}

// 5. Write a clean SPA index.html
const indexPath = join(finalDist, "index.html");
const html = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Simulateur Achat vs Location — 10 villes françaises</title>
    <meta name="description" content="Comparez l'achat et la location de votre résidence principale dans les 10 plus grandes villes françaises." />
${entryCss ? `    <link rel="stylesheet" href="${normalizedBase}${entryCss}" />\n` : ""}  </head>
  <body>
    <div id="root"></div>
${entryJs ? `    <script type="module" src="${normalizedBase}${entryJs}"></script>\n` : ""}  </body>
</html>
`;
writeFileSync(indexPath, html);
console.log(`✓ Wrote SPA index.html (entry: ${entryJs || "MISSING"})`);

console.log("✅ SPA build complete → dist/");
