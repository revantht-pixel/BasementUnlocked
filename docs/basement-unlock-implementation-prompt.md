# Prompt 2: Implement Basement Unlock

Copy everything below the line into a coding AI (Claude Code, Cursor, Codex). Attach the UI design document from Prompt 1 as `docs/ui-design.md` first. Start only after hacking begins at 5:30 PM: the hackathon rules say no code from before tonight.

---

You are implementing **Basement Unlock** for a 6-hour hackathon. The demo must run live at 11:30 PM, so reliability beats features. Read `docs/ui-design.md` (the UI design document) first and follow its tokens, pages, components, copy and states exactly. Where this prompt and the design doc disagree on behavior or data, this prompt wins; on visuals, the design doc wins.

## What the app does

A Salt Lake City homeowner enters an address. The app confirms the parcel, asks a short questionnaire, evaluates reviewed rules for an internal basement apartment, and shows a result: an overall outcome, every rule check with its source, a count of unknowns, a HUD rent range, and an AI-written summary plus email to Salt Lake City Planning.

**Non-negotiable principle: rules decide, AI explains.** Rule outcomes come only from the deterministic rules engine. The AI only rewrites finished results into plain English and can't add or change a claim.

## Stack

- Next.js (App Router) with TypeScript (strict), Tailwind CSS, Phosphor icons (`@phosphor-icons/react`, Light weight), Space Grotesk (headlines) and Manrope (body) via `next/font/google`, colour tokens exactly as in the design doc (teal-black background, ice-mint `#6EE7C8` accent, amber `#FFB547` only for the house's light), the house scene from `assets/house-cutaway.svg` as a React component, Motion (`motion/react`) for the load sequence and the basement-light transition (respect `useReducedMotion`). Dark theme only, per the design doc. The house drawing and callouts are hand-built SVG components because they are the product's data visualization.
- No database, no auth. Data, rules and sources live in versioned JSON in `data/`.
- Server-only modules for the screening logic and API keys. Keys come from `.env.local`: `UGRC_API_KEY`, `HUD_API_TOKEN`, `ANTHROPIC_API_KEY`. Never expose them to the client.
- AI: Anthropic TypeScript SDK, Messages API, model `claude-sonnet-5-5` for speed. Ask for JSON output that matches a schema and validate it with Zod.
- Validation: Zod for every API input and output.

## Routes (state lives in the URL)

| Route | Page |
| --- | --- |
| `/` | Address entry, saved demo properties, data-mode badge |
| `/property/[propertyId]` | Property confirmation with source chips, or an out-of-scope message |
| `/check/[propertyId]?step=n&...answers` | Questionnaire, one question per step on mobile, all on one page on desktop |
| `/result/[propertyId]?...answers` | Outcome, house cross-section, unknown counter, checks, rent range, answer switcher |
| `/plan/[propertyId]?...answers` | AI summary and city email, copy, mail link, print |
| `/photo/[propertyId]` | Photo coach for the basement egress window |
| `/rules` | Rules review: AI drafts rules from ordinance text, a person approves |
| `/sources` | All sources and how the provenance glyphs work |

Encode answers as query params (for example `occ=yes&rent=long&park=unknown`) so Back, refresh and deep links reproduce the same result. Add a `loading.tsx` per route that fetches data.

## API route handlers

| Endpoint | Behavior |
| --- | --- |
| `GET /api/lookup?address=` | UGRC geocode → point-in-polygon against UGRC municipal boundaries (Salt Lake City only) → query `Parcels_SaltLake_LIR` and the city zoning layer → return `Property` or `{ scope: "outside", reason }`. Never trust `PARCEL_CITY` for jurisdiction (it is often the mailing city). Timeout 6 s, then return `{ scope: "unavailable" }` so the UI offers saved properties |
| `GET /api/properties` | Return the saved verified properties from `data/properties.json` |
| `POST /api/screen` | Validate `{ propertyId or property, answers }`, run the rules engine, attach the rent range, return `ScreeningReport` |
| `POST /api/explain` | Input: a `ScreeningReport`. Output: `{ summary: Sentence[], email: { subject, body: Sentence[] } }` where each `Sentence` has `text` and `ruleIds: string[]` (non-empty). Drop any sentence whose `ruleIds` don't exist in the report. On failure or timeout (8 s), return a template email built from the checks, with `generatedBy: "template"` |
| `POST /api/ask` | Input: `{ report: ScreeningReport, question: string }`. Output: `{ answer: string, ruleIds: string[] }`, at most 90 words, citing check numbers like [7]. Reject (re-ask once, then show a fallback) if it cites no rule ID, cites an unknown one, or uses the words "approved" or "allowed" about the overall project. Stream the text to the UI |
| `POST /api/photo-guide` | One image → `{ visible: string[], cannotJudge: string[], measureNext: string[], concerns: string[] }`, every item tagged `ai_observation`. Strip any line that states a measurement or a compliance verdict. Never changes a rule outcome |
| `POST /api/rules/draft` (reviewer tool) | Input: `{ sectionLabel, sourceUrl, text }`. Output: draft rules `{ id, title, appliesWhen, requirement, inputsNeeded[], quote }[]`. Drop any draft whose `quote` is not found verbatim in `text`. Drafts are saved with `"reviewed": false`; only a person's Approve sets `"reviewed": true`, records the reviewer and date, and lets the rule decide results |

Parcel fields to use from `Parcels_SaltLake_LIR`: `PARCEL_ID`, `PARCEL_ADD`, `PROP_CLASS`, `PROP_TYPE`, `BUILT_YR`, `BLDG_SQFT`, `BLDG_SQFT_INFO`, `PARCEL_ACRES`, `HOUSE_CNT` (more than 1 suggests an existing second unit; surface as a hint and still ask). Query by point with `outFields` limited to these and `f=json`.

HUD rent: Fair Market Rents API with a bearer token, for the Salt Lake City area and the planned bedroom count. Cache the response in `data/hud-cache.json` and fall back to it.

## Types (put in `lib/types.ts`)

```ts
type Provenance = "public_record" | "owner_answer" | "ai_observation" | "city_must_confirm";

type Fact<T> = { value: T | null; provenance: Provenance; sourceId?: string; retrievedAt?: string };

type Property = {
  id: string; address: string; parcelId: string;
  jurisdiction: Fact<"Salt Lake City">; zone: Fact<string>;
  lotAcres: Fact<number>; builtYear: Fact<number>; buildingSqft: Fact<number>;
  propertyClass: Fact<string>; houseCount: Fact<number>;
  dataMode: "live" | "saved";
};

type Answer = "yes" | "no" | "unknown";
type Answers = {
  dwellingType: "detached_single_family" | "other" | "unknown";
  existingSecondUnit: Answer; ownerLivesOnSite: Answer;
  rentalLength: "30_days_or_more" | "under_30_days" | "unknown";
  parkingAvailable: Answer; bedrooms: 0 | 1 | 2 | null;
};

type CheckStatus = "met" | "not_met" | "unknown" | "not_applicable";
type RuleResult = {
  ruleId: string; title: string; status: CheckStatus;
  inputs: { label: string; fact: Fact<unknown> }[];
  explanation: string; sourceIds: string[]; nextAction?: string;
};

type Outcome = "outside_scope" | "needs_attention" | "more_info_needed" | "conditions_met";
type ScreeningReport = {
  outcome: Outcome; results: RuleResult[]; unknownCount: number; totalChecks: number;
  nextActions: string[]; rent: RentEstimate | null; sources: Source[]; ruleVersion: string;
};
type RentEstimate = { bedrooms: number; low: number; high: number; area: string; fiscalYear: string; sourceUrl: string };
type Source = { id: string; title: string; section?: string; url: string; retrievedAt: string; reviewedRuleVersion: string };
```

## Rules engine (`lib/rules/`)

- Rules are data in `data/rules.json`: id, title, the inputs they read, the condition, a message for each status, source IDs and next action. The rules owner fills in the Salt Lake City text from ordinance 21A.40.200 and Utah Code 10-21-303. Ship with clearly marked placeholder rules that evaluate to `unknown` until reviewed (`"reviewed": false` forces `unknown` with provenance `city_must_confirm`).
- Pure function: `screen(property, answers, rules) → ScreeningReport`. No I/O, fully unit-tested.
- Overall outcome precedence: `outside_scope` (dwelling not detached single-family, or outside SLC) → `needs_attention` (any `not_met`) → `more_info_needed` (any `unknown`) → `conditions_met`. Always keep every individual result.
- Missing values never become zero, false or favorable. An `unknown` answer yields an `unknown` check, never `not_met`.
- Do not apply the state's 6,000 sq ft lot rule in Salt Lake City unless the reviewed rules say the city adopted it.

## Saved demo data

- `data/properties.json`: three real Salt Lake City properties the data owner verifies tonight (parcel, jurisdiction, zoning provenance, retrieval date). Leave clearly marked placeholders until then.
- The app must fully work with Wi-Fi off using saved properties, the HUD cache and the template email. The data-mode badge shows "Saved data" with the date.

## Where AI is used (four places, none of them decide a result)

1. **Plan writer** (`/api/explain`): turns the finished report into a plain-English summary and the email to Salt Lake City Planning. Every sentence carries rule IDs.
2. **Ask about your result** (`/api/ask`): answers homeowner questions from the report only, citing check numbers.
3. **Photo coach** (`/api/photo-guide`): Claude vision on a basement-window photo. Lists what is visible, what a photo can't tell, and what to measure. Never gives a verdict or invents dimensions.
4. **Rules review** (`/api/rules/draft`): drafts rules from pasted ordinance text with verbatim quotes, for a person to approve. This is how the product grows to new cities.

Common guardrails: the model only sees structured data you pass in; validate outputs with Zod; drop unsupported claims; on any failure or timeout show a template fallback so the demo never breaks. Label every AI output with the AI observed glyph and "It cannot change a result."

## UI build order (follow the design doc for visuals)

1. Tokens in `tailwind.config.ts` and `app/globals.css` as CSS variables, plus the font.
2. Core components: SourceChip, FactRow, CheckItem (citation disclosure), OutcomeHeadline, UnknownCounter (`role="status"` with full sentence text), RentRangeCard, ScopeMessage, DataModeBadge, StepIndicator, QuestionCard (radio group with "I don't know"), ErrorSummary.
3. Pages in route order, saved properties first. Live lookup only after the full flow works.
4. HouseSection SVG: basement lit for met, hatched for unknown, outlined gap for not met.
5. AnswerSwitcher on the result page: changing an answer updates the URL, re-screens, animates only the changed check (about 250 ms) and announces the new counter. With `prefers-reduced-motion`, no animation.
6. Plan page with `/api/explain`, copy confirmation ("Email copied"), `mailto:` link, print stylesheet.
7. Photo coach last, only if everything else is done.

## Quality bar

- WCAG AA contrast, visible focus ring in the `action` color, keyboard reachable everything, 44 px minimum targets, visible labels, no hover-only information, chips always show icon and text.
- Responsive at 375, 768, 1024 and 1440 px; no horizontal scroll. Result page body at least 18 px for projector demos.
- No emoji icons, no all-caps labels, no gradients, no arrows in button text.
- Every error says what happened and what to do next.

## Tests and acceptance checks

Write Vitest unit tests for the rules engine and run them. Done means all of these pass:

- [ ] Each saved property shows parcel, jurisdiction and zoning with source chips and dates
- [ ] An address outside Salt Lake City shows the scope message, never another property
- [ ] Changing `ownerLivesOnSite` changes only the checks that read it, and the counter updates
- [ ] `unknown` answers never produce `not_met` or `conditions_met`
- [ ] Every rule result links to a source with a rule version
- [ ] Every AI sentence maps to an existing rule ID; with the AI key removed, the template email appears
- [ ] Ask about your result cites check numbers and never calls the project approved
- [ ] Rules review drops any draft whose quote is not verbatim; unapproved drafts never affect a result
- [ ] The app runs with Wi-Fi off in saved-data mode
- [ ] `npm run build` succeeds and the app restarts cleanly
- [ ] The full demo path (home → property → questions → result → flip → plan) takes under 2:45

## Working style

- Work in small commits in the order above. After each step, run the app and check the page at 375 px and 1440 px.
- If a live data source is blocked for more than 15 minutes, stop and use saved data.
- List every open question or placeholder in `TODO.md` instead of guessing legal content.
- Add a `README.md` with setup, environment variables, data sources with attribution, and the demo script.
