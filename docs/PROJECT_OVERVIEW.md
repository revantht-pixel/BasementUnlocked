# Basement Unlock

**Is your basement a home waiting to happen?**

Basement Unlock tells a Salt Lake City homeowner, in about 60 seconds, whether their basement can legally become a rental apartment. It shows which rules they already meet, what's still unknown, what the unit could rent for, and gives them a ready-to-send email to the city.

> Utah legalized basement homes in 2021. We built the first tool that tells you, honestly, whether yours can be one.

Built for **Crimson Hacks 2026** (theme: State of Utah).

---

## The problem

- Utah needs roughly **27,900 new housing units a year** to keep up with growth (2023 legislative audit), and cost of living is Utahns' top concern.
- Many Utah homes already have a finished or half-finished basement that could house someone.
- Since **2021**, Utah law (Utah Code 10-21-303) has made an internal accessory dwelling unit, such as a basement apartment, a **permitted use** in residential zones. Salt Lake City loosened its ADU ordinance in **2023**.
- Almost nobody uses these rules, because a homeowner can't answer four questions on their own:
  1. **Does my property qualify?** State law, city rules and personal circumstances all interact.
  2. **What's still unknown?** Owner occupancy, parking, egress windows and permits are unclear.
  3. **Is it worth it?** Nobody shows what the unit could rent for.
  4. **What do I do next?** Permit, inspection and rental steps are spread across city pages.

**Meet Dana** (fictional demo persona): a retired teacher in Sugar House with an empty finished basement and rising property taxes. She'd consider renting it out, but doesn't know where to start.

---

## The solution

One address becomes one honest screening result.

1. **Enter an address.** The app checks that the parcel is really inside Salt Lake City and pulls its public property records.
2. **Answer a few questions.** Every question has an "I don't know" option.
3. **Read the result.** Each rule check shows whether it's met, where every fact came from, and a link to the exact ordinance.
4. **Get your plan.** An AI-written plain-English summary and a ready-to-send email to Salt Lake City Planning.

### Core principle: rules decide, AI explains

Legal outcomes come only from reviewed rules written from the actual law. The AI turns finished results into plain English and an email. It can't add a claim, and it can't change an outcome.

### Signature: honesty you can see

Every fact carries a colored **source chip**:

| Chip | Meaning |
| --- | --- |
| Public record | From county parcel or city zoning data, with the date it was retrieved |
| You told us | The homeowner's own answer |
| AI observed | A photo-coach observation; never changes a rule outcome |
| Ask the city | Unknown or not yet reviewed; the city must confirm |

Unknowns stay unknown. They never turn into an approval or a denial.

---

## Main features

| Feature | What it does |
| --- | --- |
| **Address check with a city-boundary test** | Confirms the parcel is actually inside Salt Lake City, not just using a "Salt Lake City" mailing address |
| **Property facts** | Lot size, year built, building area, property type and zone from public records, each with a source chip |
| **Short questionnaire** | Dwelling type, existing second unit, owner living on site, rental length, parking, planned bedrooms |
| **Rules engine** | Checks each reviewed state and city rule and returns met, not met, unknown or not applicable, with the reason and the ordinance link |
| **Clear overall outcome** | One of: Outside what we cover · A requirement needs attention · More information needed · Checked conditions met. It never says "approved" |
| **"What we don't know" counter** | For example, "3 of 9 checks need the city" |
| **Live answer flip** | Change an answer (such as "Will you live in the main house?") and watch only the affected check update |
| **House cross-section drawing** | The basement fills with light as checks pass; unknowns show hatched, failures show as a gap |
| **Rent range** | HUD Fair Market Rent for the area and bedroom count, clearly labeled as an estimate |
| **AI plan and city email** | A plain-English summary plus a ready-to-send email to Salt Lake City Planning; every sentence is tied to a rule check |
| **Works offline** | Three verified saved properties, cached rent data and a template email keep the demo running if Wi-Fi fails |
| **Photo coach (stretch)** | Upload a basement-window photo; AI lists what's visible, what can't be judged and what to measure. It never certifies anything |

---

## Scope

**In scope tonight:** Salt Lake City, detached single-family homes, long-term internal basement rentals.

**Not in scope tonight:** other cities, detached backyard cottages, payback and renovation cost estimates, accounts, contractor and tenant marketplaces. Anything outside scope gets an honest message, never a guessed answer.

---

## How it works

```
Address ──▶ UGRC geocoder ──▶ City boundary check ──▶ Parcel + zoning data ──▶ Rules engine ──▶ Result
                                   │ outside SLC                                   ▲    │
                                   ▼                                               │    ▼
                             Scope message                         Owner answers ──┘  AI writer ──▶ Summary + email
HUD Fair Market Rents ───────────────────────────────────────────────────────────────────────────▶ Rent range
```

### Tech stack

| Layer | Choice |
| --- | --- |
| App | Next.js (App Router), TypeScript, Tailwind CSS |
| Rules and data | Versioned JSON files; no database or accounts |
| Geocoding | UGRC (Utah Geospatial Resource Center) geocoding API |
| Jurisdiction | UGRC municipal boundaries |
| Parcels | Salt Lake County parcel records (`Parcels_SaltLake_LIR`) |
| Zoning | Salt Lake City zoning layer |
| Rent | HUD Fair Market Rents API |
| AI | Claude, for the summary, the city email and the photo coach |

---

## Why it can win

| Judging criterion | How Basement Unlock delivers |
| --- | --- |
| **It works** | Live lookup with a saved-data fallback; runs with Wi-Fi off |
| **It's useful** | Homeowners learn what they meet, what's unknown and what they could earn, and leave with an email to send |
| **It's well built** | Rules traced to the law, a real jurisdiction check, a source for every fact, unknowns preserved |
| **It's clear** | One persona, three screens, one live flip, under 3 minutes |

**Prize targets:** Best Overall Hack, Best Technical Build, Best Design, Best Use of AI.

**What makes it different:** existing ADU tools (such as Symbium and ADUscale) are California-only or generic national lookups focused on backyard cottages. None checks Utah's basement-apartment rules, and none tells you what it doesn't know.

---

## 3-minute demo

1. **Hook:** "Utah needs about 28,000 homes a year. In 2021 the state made basement apartments legal. Most owners still don't know if theirs qualifies."
2. **Dana's address:** parcel facts appear with Public record chips, and the city is confirmed.
3. **Four questions:** You told us chips fill in.
4. **The flip:** change "Will you live in the main house?" and the owner-occupancy check updates, with its ordinance citation.
5. **What we don't know:** the unknown counter and the Ask the city items.
6. **What it could earn:** the HUD rent range.
7. **The plan:** AI writes the email to Salt Lake City Planning.
8. **Close:** "Utah legalized basement homes in 2021. We built the first tool that tells you, honestly, whether yours can be one."

---

## Roadmap

1. **More cities:** review each Wasatch Front ordinance into rules, with AI drafting and a person approving.
2. **Cost and payback:** local contractor quotes for egress windows and finishing.
3. **Tenant matching:** screened renters, such as University of Utah students and staff.
4. **City partnerships:** a version planning departments use to pre-screen applications.

---

## Important notes

- Basement Unlock is a **screening tool, not legal advice**. Every result links to its source and sends anything uncertain to the city.
- Salt Lake City rule text must be confirmed against ordinance 21A.40.200 before the demo.
- All project code is written during the hackathon, per the event rules.

## Files in this folder

| File | Purpose |
| --- | --- |
| `PROJECT_OVERVIEW.md` | This overview |
| `basement-unlock-ui-design-prompt.md` | Prompt for an AI to produce the UI design document |
| `basement-unlock-implementation-prompt.md` | Prompt for an AI to build the app from that design document |

Full proposal: [Basement Unlock proposal doc](https://claude.ai/artifact/8jLSWZkn1qDngiV4xRSAFY)

## Sources

- [Utah Code 10-21-303, internal accessory dwelling units](https://le.utah.gov/xcode/Title10/Chapter21/C10-21-S303_2025110620251206.html)
- [Salt Lake City ADU ordinance, 21A.40.200](https://codelibrary.amlegal.com/codes/saltlakecityut/latest/saltlakecity_ut/0-0-0-68737)
- [Axios: SLC ADU reforms and owner occupancy (2023)](https://www.axios.com/local/salt-lake-city/2023/03/28/apartment-salt-lake-city-council-owner-occupancy)
- [Salt Lake County parcel service (UGRC)](https://services1.arcgis.com/99lidPhWCzftIe9K/ArcGIS/rest/services/Parcels_SaltLake_LIR/FeatureServer/0)
- [HUD Fair Market Rents](https://www.huduser.gov/portal/datasets/fmr.html)
- [Utah Foundation: top concerns of Utahns](https://www.utahfoundation.org/news/priced-out-and-fed-up-cost-of-living-and-government-dysfunction-are-utahns-top-concerns/)
