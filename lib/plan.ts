import type { CitedSentence, ScreeningReport } from "./types";

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** Question the city email asks for one check that is unknown or not met. */
const QUESTIONS: Record<string, string> = {
  "in-city": "Could you confirm that this parcel is inside Salt Lake City limits?",
  zone: "Could you confirm that the zone at this address allows an internal accessory dwelling unit?",
  dwelling: "Could you confirm whether this type of home can have an internal accessory dwelling unit?",
  "one-unit": "Could you confirm whether another accessory unit exists on this property?",
  "owner-occupancy": "Could you confirm the owner occupancy rule and whether an exception fits my situation?",
  "rental-length": "Could you confirm which rental lengths are allowed for this kind of unit?",
  parking: "Could you confirm whether the unit needs one additional on-site parking space at this address?",
  "building-codes": "What building permit and inspections are required for the egress window, fire safety and ceiling height?",
};

export function buildTemplatePlan(report: ScreeningReport): { summary: CitedSentence[]; email: CitedSentence[] } {
  const r = report.results;
  const nums = (f: (x: (typeof r)[number]) => boolean) => r.filter(f).map((x) => x.n);
  const met = nums((x) => x.status === "met");
  const open = r.filter((x) => x.status === "unknown" || x.status === "not_met");
  const notMet = r.filter((x) => x.status === "not_met");

  const summary: CitedSentence[] = [];
  if (met.length) {
    summary.push({ text: `${met.length} of your ${report.totalChecks} checks are met so far.`, checks: met });
  }
  if (notMet.length) {
    summary.push({
      text: `${notMet.length === 1 ? "One check needs" : `${notMet.length} checks need`} attention: ${notMet.map((x) => lower(x.title)).join(", ")}.`,
      checks: notMet.map((x) => x.n),
    });
  }
  const unknown = r.filter((x) => x.status === "unknown");
  if (unknown.length) {
    summary.push({
      text: `The city needs to confirm ${unknown.length === 1 ? "one thing" : `${unknown.length} things`}: ${unknown.map((x) => lower(x.title)).join(", ")}.`,
      checks: unknown.map((x) => x.n),
    });
  }
  const na = nums((x) => x.status === "not_applicable");
  if (na.length) summary.push({ text: "Some checks do not apply to your home, so they are not a concern.", checks: na });
  if (!summary.length) summary.push({ text: "Your checks are listed by number.", checks: [1] });

  const email: CitedSentence[] = [
    {
      text: "I own the home at [Street address] and I am considering a basement apartment for long-term rental.",
      checks: [1, 3],
    },
  ];
  for (const x of open) {
    email.push({ text: QUESTIONS[x.ruleId] ?? `Could you confirm the requirement for: ${lower(x.title)}?`, checks: [x.n] });
  }
  if (!open.length) {
    email.push({ text: "Could you confirm that there is nothing else I should check before I apply?", checks: [9] });
  }
  return { summary, email };
}

/** Plain text email without keynote numbers, for copy and mailto. */
export function emailToPlainText(email: CitedSentence[], address: string): string {
  return `Hello,\n\n${email.map((s) => s.text.replace(/\[Street address\]/g, address)).join("\n\n")}\n\nThank you,\n[Your name]`;
}
