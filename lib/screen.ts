import rulesFile from "@/data/rules.json";
import sourcesFile from "@/data/sources.json";
import type {
  Answers,
  CheckStatus,
  Outcome,
  Property,
  RentEstimate,
  RuleInput,
  RuleResult,
  ScreeningReport,
  SourceRef,
} from "./types";

type RuleDef = (typeof rulesFile.rules)[number];

const SOURCES = sourcesFile as SourceRef[];
const RESIDENTIAL_ZONE = /^(R-|SR-|FR-|RMF-|RO)/i;

type Eval = { status: CheckStatus; inputs: RuleInput[] };

const owner = (label: string, text: string): RuleInput => ({ label, text, provenance: "owner_answer" });
const record = (label: string, text: string): RuleInput => ({ label, text, provenance: "public_record" });
const city = (label: string, text: string): RuleInput => ({ label, text, provenance: "city_must_confirm" });

const evaluators: Record<string, (p: Property, a: Answers) => Eval> = {
  "in-city": (p) => {
    const v = p.jurisdiction.value;
    if (!v) return { status: "unknown", inputs: [city("City", "Not confirmed")] };
    return { status: v === "Salt Lake City" ? "met" : "not_met", inputs: [record("City", v)] };
  },
  zone: (p) => {
    const z = p.zone.value;
    if (!z) return { status: "unknown", inputs: [city("Zone", "Not read")] };
    return { status: RESIDENTIAL_ZONE.test(z) ? "met" : "not_met", inputs: [record("Zone", z)] };
  },
  dwelling: (p, a) => {
    const inputs: RuleInput[] = [];
    if (p.propertyClass.value) inputs.push(record("Property type", p.propertyClass.value));
    if (a.dwellingType === "house") return { status: "met", inputs: [owner("Home", "Detached house"), ...inputs] };
    if (a.dwellingType === "other") return { status: "not_met", inputs: [owner("Home", "Duplex, townhome or other"), ...inputs] };
    return { status: "unknown", inputs: [owner("Home", "I don't know"), ...inputs] };
  },
  "one-unit": (p, a) => {
    const units = p.houseCount.value;
    const inputs: RuleInput[] = [];
    if (units !== null) inputs.push(record("Units on record", String(units)));
    if (a.existingSecondUnit === "unknown") return { status: "unknown", inputs: [owner("Second unit", "I don't know"), ...inputs] };
    if (a.existingSecondUnit === "yes") return { status: "not_met", inputs: [owner("Second unit", "Yes"), ...inputs] };
    if (units !== null && units > 1) return { status: "unknown", inputs: [owner("Second unit", "No"), ...inputs] };
    return { status: "met", inputs: [owner("Second unit", "None"), ...inputs] };
  },
  "owner-occupancy": (_p, a) => {
    if (a.ownerLivesOnSite === "yes") return { status: "met", inputs: [owner("Live on site", "Yes")] };
    if (a.ownerLivesOnSite === "no") return { status: "not_met", inputs: [owner("Live on site", "No"), city("Exceptions", "Ask the city")] };
    return { status: "unknown", inputs: [owner("Live on site", "I don't know"), city("Exceptions", "Ask the city")] };
  },
  "rental-length": (_p, a) => {
    if (a.rentalLength === "long") return { status: "met", inputs: [owner("Rental length", "30 days or more")] };
    if (a.rentalLength === "short") return { status: "not_met", inputs: [owner("Rental length", "Under 30 days")] };
    return { status: "unknown", inputs: [owner("Rental length", "I don't know")] };
  },
  parking: (_p, a) => {
    if (a.parkingAvailable === "yes") return { status: "met", inputs: [owner("Room for one more car", "Yes")] };
    if (a.parkingAvailable === "no") return { status: "not_met", inputs: [owner("Room for one more car", "No"), city("Rule", "Ask the city")] };
    return { status: "unknown", inputs: [owner("Room for one more car", "I don't know"), city("Rule", "Ask the city")] };
  },
  "lot-size": (p) => {
    const acres = p.lotAcres.value;
    return { status: "not_applicable", inputs: acres === null ? [] : [record("Lot", `${acres} acres`)] };
  },
  "building-codes": () => ({ status: "unknown", inputs: [city("Inspection", "Building permit")] }),
};

export function sourceById(id: string): SourceRef | undefined {
  return SOURCES.find((s) => s.id === id);
}

export function screen(property: Property, answers: Answers, rent: RentEstimate | null = null): ScreeningReport {
  const results: RuleResult[] = (rulesFile.rules as RuleDef[]).map((rule) => {
    const run = evaluators[rule.id];
    const { status, inputs } = run(property, answers);
    const explain = rule.explain as Record<CheckStatus, string>;
    return {
      ruleId: rule.id,
      n: rule.n,
      title: rule.title,
      status,
      inputs,
      explanation: explain[status],
      sourceIds: rule.sourceIds,
      nextAction: "nextAction" in rule ? (rule as { nextAction?: string }).nextAction : undefined,
    };
  });

  const count = (s: CheckStatus) => results.filter((r) => r.status === s).length;
  const metCount = count("met");
  const notMetCount = count("not_met");
  const unknownCount = count("unknown");

  const outside =
    results.find((r) => r.ruleId === "in-city")?.status === "not_met" ||
    results.find((r) => r.ruleId === "dwelling")?.status === "not_met";

  let outcome: Outcome = "conditions_met";
  let outcomeTitle = "Checked conditions met";
  if (outside) {
    outcome = "outside_scope";
    outcomeTitle = "Outside what we cover";
  } else if (notMetCount > 0) {
    outcome = "needs_attention";
    outcomeTitle = "A requirement needs attention";
  } else if (unknownCount > 0) {
    outcome = "more_info_needed";
    outcomeTitle = "More information needed";
  }

  const outcomeLine =
    outcome === "outside_scope"
      ? "This property or home type is outside what we have reviewed, so we won't guess."
      : `${metCount} checks met, ${unknownCount} for the city to confirm` +
        (notMetCount > 0 ? `, and ${notMetCount} needs attention.` : ". Nothing so far rules your basement out.");

  const usedIds = new Set(results.flatMap((r) => r.sourceIds));
  const sources = SOURCES.filter((s) => usedIds.has(s.id));

  return {
    outcome,
    outcomeTitle,
    outcomeLine,
    results,
    unknownCount,
    metCount,
    notMetCount,
    totalChecks: results.length,
    rent,
    sources,
    ruleVersion: rulesFile.version,
  };
}
