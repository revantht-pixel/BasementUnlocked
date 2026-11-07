import propertiesFile from "@/data/properties.json";
import { DEFAULT_ANSWERS, type Answers, type Property } from "./types";

export const PROPERTIES = propertiesFile as Property[];

export function getProperty(id: string): Property | undefined {
  return PROPERTIES.find((p) => p.id === id);
}

/** Answers live in the URL query so Back, refresh and deep links reproduce the same result. */
export const ANSWER_KEYS = ["dwellingType", "existingSecondUnit", "ownerLivesOnSite", "rentalLength", "parkingAvailable", "bedrooms"] as const;

export function parseAnswers(params: Record<string, string | string[] | undefined>): Answers {
  const pick = (k: string): string | undefined => {
    const v = params[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const tri = (v: string | undefined, d: Answers["ownerLivesOnSite"]) => (v === "yes" || v === "no" || v === "unknown" ? v : d);
  const dw = pick("dwellingType");
  const rl = pick("rentalLength");
  const bd = pick("bedrooms");
  return {
    dwellingType: dw === "house" || dw === "other" || dw === "unknown" ? dw : DEFAULT_ANSWERS.dwellingType,
    existingSecondUnit: tri(pick("existingSecondUnit"), DEFAULT_ANSWERS.existingSecondUnit),
    ownerLivesOnSite: tri(pick("ownerLivesOnSite"), DEFAULT_ANSWERS.ownerLivesOnSite),
    rentalLength: rl === "long" || rl === "short" || rl === "unknown" ? rl : DEFAULT_ANSWERS.rentalLength,
    parkingAvailable: tri(pick("parkingAvailable"), DEFAULT_ANSWERS.parkingAvailable),
    bedrooms: bd === "0" || bd === "1" || bd === "2" || bd === "unknown" ? bd : DEFAULT_ANSWERS.bedrooms,
  };
}

export function answersToQuery(a: Answers): string {
  return new URLSearchParams(a as unknown as Record<string, string>).toString();
}
