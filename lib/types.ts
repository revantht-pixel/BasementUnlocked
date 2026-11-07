export type Provenance = "public_record" | "owner_answer" | "ai_observation" | "city_must_confirm";

export type Fact<T> = {
  value: T | null;
  provenance: Provenance;
  sourceId?: string;
  retrievedAt?: string;
};

export type Property = {
  id: string;
  address: string;
  parcelId: string;
  jurisdiction: Fact<string>;
  zone: Fact<string>;
  lotAcres: Fact<number>;
  builtYear: Fact<number>;
  buildingSqft: Fact<number>;
  propertyClass: Fact<string>;
  houseCount: Fact<number>;
  dataMode: "live" | "saved";
  /** True while the values are demo placeholders that a person has not yet verified. */
  placeholder?: boolean;
};

export type Tri = "yes" | "no" | "unknown";

export type Answers = {
  dwellingType: "house" | "other" | "unknown";
  existingSecondUnit: Tri;
  ownerLivesOnSite: Tri;
  rentalLength: "long" | "short" | "unknown";
  parkingAvailable: Tri;
  bedrooms: "0" | "1" | "2" | "unknown";
};

export const DEFAULT_ANSWERS: Answers = {
  dwellingType: "house",
  existingSecondUnit: "no",
  ownerLivesOnSite: "unknown",
  rentalLength: "long",
  parkingAvailable: "unknown",
  bedrooms: "1",
};

export type CheckStatus = "met" | "not_met" | "unknown" | "not_applicable";

export type SourceRef = {
  id: string;
  title: string;
  section?: string;
  url: string;
  /** "verified": a person read the primary text. "secondary": credible secondary source, confirm in the ordinance. */
  review: "verified" | "secondary";
  reviewedOn?: string;
};

export type RuleInput = { label: string; text: string; provenance: Provenance };

export type RuleResult = {
  ruleId: string;
  n: number;
  title: string;
  status: CheckStatus;
  inputs: RuleInput[];
  explanation: string;
  sourceIds: string[];
  nextAction?: string;
};

export type Outcome = "outside_scope" | "needs_attention" | "more_info_needed" | "conditions_met";

export type RentEstimate = {
  bedrooms: number;
  low: number;
  high: number;
  area: string;
  fiscalYear: string;
  sourceUrl: string;
};

export type ScreeningReport = {
  outcome: Outcome;
  outcomeTitle: string;
  outcomeLine: string;
  results: RuleResult[];
  unknownCount: number;
  metCount: number;
  notMetCount: number;
  totalChecks: number;
  rent: RentEstimate | null;
  sources: SourceRef[];
  ruleVersion: string;
};

/** One sentence written by AI with the check numbers it relies on. */
export type CitedSentence = { text: string; checks: number[] };
