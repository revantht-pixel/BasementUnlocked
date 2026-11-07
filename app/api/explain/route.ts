import { ask, noDashes, parseJson } from "@/lib/ai";
import { buildTemplatePlan } from "@/lib/plan";
import type { CitedSentence, ScreeningReport } from "@/lib/types";

const WORDS = { met: "met", unknown: "ask the city", not_met: "needs attention", not_applicable: "doesn't apply" } as const;

function clean(list: unknown): CitedSentence[] {
  if (!Array.isArray(list)) return [];
  const out: CitedSentence[] = [];
  for (const s of list as Partial<CitedSentence>[]) {
    if (!s || typeof s.text !== "string" || !s.text.trim()) continue;
    if (!Array.isArray(s.checks) || s.checks.length === 0) continue;
    if (!s.checks.every((n) => Number.isInteger(n) && n >= 1 && n <= 9)) continue;
    if (/\b(approved|guaranteed)\b/i.test(s.text)) continue;
    out.push({ text: noDashes(s.text), checks: s.checks });
  }
  return out;
}

export async function POST(req: Request) {
  let body: { report?: ScreeningReport };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const report = body.report;
  if (!report || !Array.isArray(report.results)) return Response.json({ error: "Missing report" }, { status: 400 });

  const lines = report.results.map((c) => `${c.n}. ${c.title}: ${WORDS[c.status]}`).join("\n");
  const prompt =
    "You are writing for a Salt Lake City homeowner who is screening a basement apartment (an internal accessory dwelling unit). Use ONLY these 9 checks. Do not add facts, laws, numbers or names that are not listed.\n\nChecks:\n" +
    lines +
    '\n\nRules:\n- Never say the unit is approved, allowed for sure, or legal. Rules decide; you only explain.\n- For every check with status "ask the city" or "needs attention", the email must ask the city a clear question about it.\n- Keep these placeholders exactly as written: [Street address], [Parcel ID].\n- Plain, friendly sentences under 30 words. Do not use dashes as punctuation.\n- Every sentence lists the check numbers it is based on.\n\nReply with only JSON of this shape:\n{"summary":[{"text":"...","checks":[1,2]}],"email":[{"text":"...","checks":[7]}]}\nsummary: 3 to 5 sentences. email: 3 to 6 sentences, the body only, with no greeting and no sign-off.';

  const raw = await ask(prompt, { maxTokens: 900 });
  const parsed = parseJson<{ summary?: unknown; email?: unknown }>(raw);
  const summary = clean(parsed?.summary);
  const email = clean(parsed?.email);
  if (summary.length >= 1 && email.length >= 2) return Response.json({ summary, email, generatedBy: "ai" });

  const t = buildTemplatePlan(report);
  return Response.json({ summary: t.summary.map((s) => ({ ...s, text: noDashes(s.text) })), email: t.email.map((s) => ({ ...s, text: noDashes(s.text) })), generatedBy: "template" });
}

/** Claude calls can take longer than the default serverless limit. */
export const maxDuration = 30;
