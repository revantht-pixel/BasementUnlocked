import { ask, noDashes } from "@/lib/ai";
import type { ScreeningReport } from "@/lib/types";

const WORDS = { met: "MET", unknown: "ASK THE CITY", not_met: "NEEDS ATTENTION", not_applicable: "DOES NOT APPLY" } as const;

function promptFor(report: ScreeningReport, q: string): string {
  const lines = report.results.map((d) => `[${d.n}] ${d.title}: ${WORDS[d.status]}. ${d.explanation}`).join("\n");
  return (
    "You explain a basement-apartment screening result to a Salt Lake City homeowner.\n" +
    "Rules: use ONLY the checks below. Cite the check numbers you rely on in square brackets, like [7]. " +
    "Never say the unit is approved, legal or allowed overall. If the checks do not answer the question, say the city must confirm. " +
    "Plain English, at most 90 words, no lists, no dashes.\n\nChecks:\n" +
    lines +
    "\n\nQuestion: " +
    q
  );
}

function valid(text: string): boolean {
  const cites = [...text.matchAll(/\[(\d+)\]/g)].map((m) => Number(m[1]));
  if (!cites.some((n) => n >= 1 && n <= 9)) return false;
  return !/\b(approved|guaranteed)\b/i.test(text);
}

function template(report: ScreeningReport): string {
  const open = report.results.filter((r) => r.status === "unknown" || r.status === "not_met").slice(0, 3);
  if (!open.length) {
    return "Your checks do not show anything the city needs to confirm beyond the usual inspection. Check [9] covers the building permit and inspections, and the city decides the final answer.";
  }
  const parts = open.map((r) => `${r.title.toLowerCase()} [${r.n}]`);
  const list = parts.length === 1 ? parts[0] : parts.slice(0, -1).join(", ") + " and " + parts[parts.length - 1];
  return `Your question touches on what the checks leave open: ${list}. Your checks do not settle these, so the city must confirm them. The email in your plan asks the city about each one.`;
}

export async function POST(req: Request) {
  let body: { report?: ScreeningReport; question?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const report = body.report;
  const question = (body.question ?? "").toString().trim().slice(0, 500);
  if (!report || !Array.isArray(report.results) || !question) {
    return Response.json({ error: "Missing report or question" }, { status: 400 });
  }
  const text = await ask(promptFor(report, question), { maxTokens: 350 });
  if (text && valid(text)) return Response.json({ answer: noDashes(text.trim()), generatedBy: "ai" });
  return Response.json({ answer: noDashes(template(report)), generatedBy: "template" });
}

/** Claude calls can take longer than the default serverless limit. */
export const maxDuration = 30;
