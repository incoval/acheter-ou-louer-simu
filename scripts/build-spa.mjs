#!/usr/bin/env node
import { execSync } from "node:child_process";

const base = process.env.VITE_BASE_PATH || "/";
const normalizedBase = base.endsWith("/") ? base : `${base}/`;

console.log(`▶ Building SPA with base=\"${normalizedBase}\"`);
execSync("vite build --config vite.spa.config.ts", {
  stdio: "inherit",
  env: { ...process.env, VITE_BASE_PATH: normalizedBase },
});
console.log("✅ SPA build complete → dist/");
