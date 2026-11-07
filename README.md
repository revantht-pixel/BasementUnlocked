# Basement Unlock

**Is your basement a home waiting to happen?**

Basement Unlock tells a Salt Lake City homeowner, in about a minute, which basement-apartment rules they already meet, what is still unknown, what the unit could rent for, and gives them a ready-to-send email to the city.

Built for **Crimson Hacks 2026** (theme: State of Utah).

> Utah legalized basement homes in 2021. We built the first tool that tells you, honestly, whether yours can be one.

## How it works

1. **Enter an address** (or pick a saved example). The parcel is confirmed to be inside Salt Lake City.
2. **Answer six questions.** Every question has "I don't know". The house drawing reacts as you answer.
3. **Read the result.** Nine checks, each with its source, plus a counter of what the city must confirm and a HUD rent range.
4. **Get your plan.** An AI-written summary and an email to Salt Lake City Planning.

**Rules decide, AI explains.** Outcomes come from reviewed rules in `data/rules.json`, evaluated by the pure function in `lib/screen.ts`. AI never changes a result. It writes the summary and email (`/api/explain`), answers questions about a result (`/api/ask`), reads a basement window photo (`/api/photo-guide`) and drafts rules from ordinance text for a person to approve (`/api/rules/draft`). Every AI route validates its output and falls back to a template, so the app works with no API key.

## Run it

```bash
npm install
cp .env.example .env.local   # optional: add keys
npm run dev                   # http://localhost:3000
npm test                      # rules engine tests
npm run build
```

| Variable | Used for | Without it |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Summary, email, ask, photo coach, rules drafting | Template text, labelled as examples |
| `UGRC_API_KEY` | Live address lookup (best effort) | Saved properties only |
| `HUD_API_TOKEN` | Area rent range | Shows `[$X] to [$Y]` placeholders |

## Project layout

```
app/                 routes: / , /property/[id], /check/[id], /result/[id], /plan/[id], /photo/[id], /rules, /sources, /out-of-scope
app/api/             lookup, screen, explain, ask, photo-guide, rules/draft
components/          HouseScene (SVG), Header, ui (buttons, panels, glyphs), screen views
lib/screen.ts        the rules engine (pure, tested)
lib/ai.ts            Claude client with safe fallbacks
data/rules.json      rule text and sources (edit here)
data/properties.json saved demo properties (placeholders until verified)
data/sources.json    every source with its review level
assets/              house-cutaway.svg, the hero illustration
docs/                proposal, design and implementation prompts
```

## Data sources and attribution

- [Utah Code 10-21-303, internal accessory dwelling units](https://le.utah.gov/xcode/Title10/Chapter21/C10-21-S303_2025110620251206.html)
- [Salt Lake City ordinance 21A.40.200](https://codelibrary.amlegal.com/codes/saltlakecityut/latest/saltlakecity_ut/0-0-0-68737) and [ADU handbook](https://www.slcdocs.com/Planning/Guides/ADU_Handbook.pdf)
- [Salt Lake County parcel records via UGRC](https://services1.arcgis.com/99lidPhWCzftIe9K/ArcGIS/rest/services/Parcels_SaltLake_LIR/FeatureServer/0)
- [UGRC municipal boundaries](https://gis.utah.gov/products/sgid/boundaries/municipal/)
- [HUD Fair Market Rents](https://www.huduser.gov/portal/datasets/fmr.html)
- Next.js, React, Tailwind CSS, Zod, Vitest, the Anthropic SDK, Space Grotesk and Manrope (Google Fonts)

## Important

Basement Unlock is a screening tool, not legal advice. Every result links to its source and sends anything uncertain to the city. See `TODO.md` for what must be verified before presenting.

## Demo script (3 minutes)

1. Hook: Utah needs about 28,000 homes a year. In 2021 the state made basement apartments legal. Most owners still don't know if theirs qualifies.
2. Open `/`, pick **Sugar House**, confirm the property, answer the questions and watch the basement light up.
3. On the result, flip "Will you live in the main house?" and watch check 5, the counter and the drawing change.
4. Ask the AI a question, then open the plan and write the email.
5. Close: Utah legalized basement homes in 2021. We built the first tool that tells you, honestly, whether yours can be one.
