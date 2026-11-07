import { ask, noDashes, parseJson } from "@/lib/ai";

type Draft = { id: string; title: string; appliesWhen: string; requirement: string; inputsNeeded: string[]; quote: string };

const EXAMPLE: Draft[] = [
  {
    id: "slc-owner-occupancy",
    title: "Owner lives on the property",
    appliesWhen: "The owner wants to rent an internal accessory unit.",
    requirement: "The owner must live on the property to rent the unit, unless an exception in the section applies.",
    inputsNeeded: ["Owner lives on site", "Exception that applies"],
    quote: "[Verbatim sentence from the pasted section]",
  },
  {
    id: "slc-one-unit",
    title: "One accessory unit per property",
    appliesWhen: "Any lot with a single-family home.",
    requirement: "Only one accessory dwelling unit is allowed on the property.",
    inputsNeeded: ["Existing second unit"],
    quote: "[Verbatim sentence from the pasted section]",
  },
  {
    id: "slc-parking",
    title: "Parking for the unit",
    appliesWhen: "Adding an internal accessory unit.",
    requirement: "[Parking requirement exactly as the section states it]",
    inputsNeeded: ["Parking available"],
    quote: "[Verbatim sentence from the pasted section]",
  },
];

const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();
const str = (v: unknown) => (typeof v === "string" ? v : "");

export async function POST(req: Request): Promise<Response> {
  let body: { sectionLabel?: unknown; sourceUrl?: unknown; text?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Send JSON." }, { status: 400 });
  }
  const text = str(body.text);
  const section = str(body.sectionLabel);
  if (!text.trim()) return Response.json({ error: "Paste real ordinance text first." }, { status: 400 });

  const prompt = `You turn city ordinance text into draft screening rules for a basement apartment checker. Use ONLY the text below. Do not invent requirements, numbers or exceptions. Each rule must include "quote": one sentence copied exactly, word for word, from the text that supports it. If the text contains no rules, reply with [].

Section: ${section}

Text:
"""
${text.slice(0, 12000)}
"""

Reply with only a JSON array of objects of this shape:
{"id":"short-kebab-id","title":"short plain title","appliesWhen":"one sentence","requirement":"one plain sentence","inputsNeeded":["short strings"],"quote":"exact sentence from the text"}
Use plain sentences and no dashes as punctuation.`;

  const reply = await ask(prompt, { maxTokens: 2000 });
  const list = parseJson<unknown[]>(reply);
  if (!Array.isArray(list)) return Response.json({ drafts: EXAMPLE, generatedBy: "example", dropped: 0 });

  const hay = norm(text);
  const kept = list.filter((d): d is Record<string, unknown> => {
    if (!d || typeof d !== "object") return false;
    const o = d as Record<string, unknown>;
    return typeof o.title === "string" && typeof o.quote === "string" && o.quote.trim().length > 0 && hay.includes(norm(o.quote));
  });
  const drafts: Draft[] = kept.map((d, i) => ({
    id: noDashes(str(d.id)) || `rule-${i + 1}`,
    title: noDashes(str(d.title)),
    appliesWhen: noDashes(str(d.appliesWhen)),
    requirement: noDashes(str(d.requirement)),
    inputsNeeded: Array.isArray(d.inputsNeeded) ? d.inputsNeeded.filter((x): x is string => typeof x === "string").map(noDashes).filter(Boolean) : [],
    quote: str(d.quote).trim(),
  }));
  return Response.json({ drafts, generatedBy: "ai", dropped: list.length - drafts.length });
}

/** Claude calls can take longer than the default serverless limit. */
export const maxDuration = 30;
