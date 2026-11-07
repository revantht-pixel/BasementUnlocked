# Prompt 1: UI design document for Basement Unlock

Copy everything below the line into a design-capable AI. It produces the UI design document that Prompt 2 implements.

---

You are the lead product designer for **Basement Unlock**, a web app built at a 6-hour hackathon (Crimson Hacks 2026, theme "State of Utah"). Write a complete **UI design document** that a developer can build from without asking questions. Do not write code.

## Product context

- **What it does:** A Salt Lake City homeowner enters an address and, in about 60 seconds, learns which basement-apartment (internal accessory dwelling unit) rules they already meet, what is still unknown, what the unit could rent for, and gets a ready-to-send email to Salt Lake City Planning.
- **Core principle:** Rules decide, AI explains. Legal outcomes come from reviewed rules. AI only writes plain-English summaries from finished results and never changes an outcome.
- **Honesty is the signature.** Every fact shows where it came from. Unknowns stay unknown and never turn into an approval or a denial.
- **Primary user:** Dana (fictional persona), a retired teacher in Sugar House, Salt Lake City. Empty finished basement, rising property taxes, not technical, may have low vision. Uses a laptop; sometimes a phone.
- **Secondary audience:** Hackathon judges watching a 3-minute live demo on a projector and a 60-second demo at a table.
- **Scope tonight:** Salt Lake City only, detached single-family homes, long-term internal basement rentals. Anything else gets an honest "outside what we cover" message, never a substitute property.
- **Stack the developer will use:** Next.js (App Router), TypeScript, Tailwind CSS, Lucide icons.

## The four kinds of evidence (provenance)

Every fact and rule input carries exactly one provenance. Show it as a drafting-legend glyph plus a text label (never color alone): Public record = solid ink square, You told us = ringed dot, AI observed = diamond outline, Ask the city = hatched square.

| Provenance | Chip label | Meaning |
| --- | --- | --- |
| `public_record` | Public record | County parcel or city zoning data, with retrieval date |
| `owner_answer` | You told us | The homeowner's questionnaire answer |
| `ai_observation` | AI observed | Photo coach observation; can never change a rule outcome |
| `city_must_confirm` | Ask the city | Unknown or unreviewed; the city must confirm |

## Rule check statuses and overall outcomes

- Each check: `met`, `not_met`, `unknown`, `not_applicable`.
- Overall outcome (exactly one): **Outside what we cover**, **A requirement needs attention**, **More information needed**, **Checked conditions met**. Even "Checked conditions met" still lists permit and physical-review steps; it is never "Approved."

## Design direction (already decided; refine, don't replace)

This direction came from the ui-ux-pro-max design-system search, the frontend-design anti-template review and the design-taste-frontend anti-slop rules. It replaced a first draft that read as generic. Keep it unless you find a concrete accessibility problem, and say why if you change anything. The live reference is the Basement Unlock UI design canvas.

- **Concept: Salt Lake City at night, teal and ice.** The Wasatch Range as layered dark teal silhouettes under faint stars, and a house shown as a shaded isometric cutaway: solid house above ground, earth sliced open to show a furnished basement apartment glowing warm amber. The amber basement is the only warm thing on screen, so the eye goes straight to it. The more checks pass, the brighter the basement. High contrast, calm.
- **The one bold element:** on the result page, a large **isometric night cutaway of the house** (reference: `assets/house-cutaway.svg`) with numbered callouts (1 to 9) pointing at the part of the house each check is about: city-limit sign, lawn and zone, gable, the bed, a person in a main-floor window for owner occupancy, the stairs for rental length, the car on the driveway for parking, the lot dimension line, and the basement egress window. Met = ice-mint marker, ask the city = mist-blue hatched marker, needs attention = coral dashed. The basement's brightness tracks the share of checks met; unknown checks overlay a faint hatch; needs-attention adds a coral dashed outline.
- **Typeface:** Space Grotesk for headlines and big numbers, Manrope for body and interface text (both Google Fonts). Hero 62 to 66 px, Space Grotesk 600, letter-spacing -0.04em, line-height 0.98. Body Manrope 18 px 400, line-height 1.55. Big numbers in Space Grotesk 300 to 500 with tight tracking. Sentence case only.
- **Shape and depth:** "double-bezel" glass panels (an outer 28 px-radius shell with a 6 px hairline tray, an inner 22 px-radius core with a 1 px top highlight). Pill buttons with a nested circular arrow icon. A floating pill header detached from the top edge. Generous spacing (96 to 120 px between sections).
- **Motion:** one load sequence (headline, subtext, main panel fade up from a slight blur), the basement lights switching on in the hero, and the live answer flip easing the light over 700 ms with cubic-bezier(0.32, 0.72, 0, 1). Everything respects prefers-reduced-motion.
- **Palette (tokens, one accent only):**

| Token | Hex | Use |
| --- | --- | --- |
| `night` | #061416 to #0A1D20 | Page background gradient (teal black) |
| `ridge` | #0B1D20, #0F2428, #14292E | Mountain silhouettes, back to front |
| `line` | #2C4A4F, #5C7D82 | Drawing lines, key outlines |
| `text` | #E8F4F2 | Headings |
| `text-2` | #A9C0BE | Body text |
| `text-3` | #86A09D | Small and secondary text |
| `ice` | #6EE7C8 | The one UI accent: primary buttons (dark text #052520 on it), met marks, selected states, focus ring |
| `window` | #FFB547 | Light only: the lit basement, house windows and the logo's basement. Never used for buttons or text |
| `mist` | #9DB4D8 | Ask the city marks |
| `coral` | #FF7A6B | Needs attention only |
| `glass` | white at 3 to 5% with 7% hairlines | Panels |

Verify every text and background pair at 4.5:1 or better and report the ratios.

- **Avoid (these read as generated templates):** all-caps eyebrow labels, middle-dot meta strings, arrows appended to button text, monospace data labels, cream backgrounds with terracotta accents, purple or pink AI gradients, identical rounded cards with soft gray shadows everywhere, emoji as icons, fade-and-slide on every section.
- **Motion:** Only one orchestrated moment: when an answer changes, the affected check changes status (about 250 ms) and the basement light updates. Everything else is instant or a simple 150–200 ms state change. Respect `prefers-reduced-motion` by showing the final state immediately.
- **Copy voice:** Plain, active, sentence case, no legal jargon, no apologies, never says "approved." Buttons name the action ("Check this address", "Copy email"). Errors say what happened and what to do.

## What the document must contain

1. **Design summary:** one paragraph on the direction and why it fits Dana and the judges.
2. **Design tokens:** final color table with contrast ratios, type scale with sizes, line-heights and weights, spacing scale, radii (use at most two: small for chips, medium for panels), focus ring spec, breakpoints (375, 768, 1024, 1440).
3. **Information architecture:** every route with its purpose and how a user moves between them. Answers and the selected property live in the URL, so Back, refresh and deep links work.
4. **Page-by-page specs**, each with: purpose, ASCII wireframe at desktop and at 375 px, every section and element in order, final copy (real words, not lorem ipsum), and all states (default, loading, empty, error, out of scope, offline or saved-data mode). Pages:
   1. **Address entry (home):** headline, one-sentence promise, address field with SLC suggestions, "Check this address" button, small cross-section drawing, links to three saved demo properties, a single line of disclaimer, data-mode badge (Live data or Saved data with date).
   2. **Property confirmation:** address, parcel ID, "Inside Salt Lake City" boundary result, lot size, year built, building area, property type, zone, each with a source chip and retrieval date. "This is my property" and "Not my property" actions. Out-of-scope variant.
   3. **Questionnaire:** 4 to 6 questions (dwelling type, existing second unit, will the owner live in the main house, intended rental length, parking available, bedrooms planned). One question per screen on mobile, all on one page on desktop, with a "Step X of Y" indicator. Every question has an "I don't know" option. Visible labels, helper text, inline validation, focusable error summary.
   4. **Result:** outcome headline, large cross-section drawing, a "what we don't know" counter (for example "3 of 9 checks need the city", announced to screen readers with `role="status"`), the list of checks (status icon, title, one-line explanation, input facts with chips, expandable citation with ordinance section and link), the rent range card (HUD Fair Market Rent for the area and bedroom count, labeled as an estimate), a sticky "Change an answer" control so the live flip is easy to show on stage, and a "See your plan" button.
   5. **Your plan:** AI summary in plain English, a ready-to-send email to Salt Lake City Planning with every sentence linked to the check it came from, "Copy email", "Open in mail app", "Print one-page plan". A "Rules decide, AI explains" note. A fallback state when AI is unavailable (a template email built from the checks).
   6. **Photo coach (stretch):** upload one basement-window photo; show what is visible, what can't be judged, and which measurements to take, all with AI observed chips. Must state it does not certify anything.
   7. **Ask about your result (on the result page):** a question box with two suggested questions. AI answers in at most 90 words from the nine checks only, cites check numbers like [7], never says "approved", and says when the city must confirm.
   8. **Rules review (for the team's rules reviewer):** paste an ordinance section, AI drafts rules as cards (title, requirement, inputs needed, a verbatim quote from the pasted text), and a person approves or rejects each. Only approved rules ever decide a result. Drafts whose quote is not found word for word in the pasted text are dropped.
   9. **Sources and how it works:** a drawer or page listing every source (title, section, URL, retrieval date, rule version) and a short explanation of the four glyphs.
5. **Component inventory:** a table of every component (name, purpose, props, variants, states, accessibility notes). Include at least: AddressSearch, DataModeBadge, SourceChip, FactRow, BoundaryResult, ScopeMessage, StepIndicator, QuestionCard (radio group with "I don't know"), ErrorSummary, OutcomeHeadline, HouseSection (SVG with lit, hatched and gap states), UnknownCounter, CheckItem (with citation disclosure), RentRangeCard, AnswerSwitcher, EmailDraft, CopyButton with confirmation, PhotoCoach, SourceDrawer, Disclaimer, TitleBlock, Callout (numbered, styled by status), AskPanel, DraftRuleCard.
6. **Interaction spec for the hero moment:** exactly what happens, in order, when the "Will you live in the main house?" answer flips: which check changes, its animation, the counter update and its screen-reader announcement, and the drawing update.
7. **Accessibility checklist:** contrast, keyboard order, visible focus, 44 by 44 px targets, labels, status announcements, reduced motion, chips never rely on color alone, no hover-only information.
8. **Demo mode notes:** how the UI looks on a projector (minimum 18 px body on the result page), and the three saved properties as quick links.

Format the document in Markdown with headings for each part above. Keep wireframes in fenced code blocks. Be specific: real copy, real sizes, real states.
