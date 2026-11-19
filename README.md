# Leonida Trophy Guide — GTA VI Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Alf212/leonida-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Alf212/leonida-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI: every trophy with its official name, description and grade, an original guide in our own words with named, linked sources, ⚠ missable flags, a 6-stage roadmap to the platinum, and a checklist whose progress saves in the browser and exports/imports as JSON. Spoiler setting ON by default hides story trophy names until they are earned.

Bounty: [make.fun — gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01)

## Run it

Serve the app folder with any static file server and open it in a browser — it works fully offline:

```
python3 -m http.server 8321 --directory app
# then open http://localhost:8321
```

Or use the kit's helper from the repo root: `node serve.ts` (http://localhost:8080).

## Hand it in (maintainers)

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

This copies `app/` and `screenshots/` to `out/` and writes `out/dossier.json` via `vendor/makefun-frontend.ts`.
