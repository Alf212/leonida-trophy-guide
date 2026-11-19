// Leonida Trophy Guide — hand-in program for the make.fun gta6-trophy-guide-01 bounty.
// The guide itself is the static app in ./app (index.html + style.css + app.js +
// data/trophies.json). It needs no build step and loads nothing from the network.
// This program only packages it: copy app/ and screenshots/ into the output
// directory, then write dossier.json with the vendored make.fun library so the
// sealed scorer can compare it byte for byte with its own rebuild.
// Run locally with:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Fresh output folders for the two payloads the dossier describes.
mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// Dossier caps, identical to the starter so the gate sees the same limits:
// 160 KiB of source text, at most 4 screenshots of at most 256 KiB each,
// at most 993 app entries and 48 MiB of app files.
const dossierJson = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outputDir, 'dossier.json'), dossierJson);
