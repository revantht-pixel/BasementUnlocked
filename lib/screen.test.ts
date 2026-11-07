import { describe, expect, it } from "vitest";
import { PROPERTIES } from "./data";
import { screen } from "./screen";
import { DEFAULT_ANSWERS, type Answers } from "./types";

const property = PROPERTIES[0];
const run = (patch: Partial<Answers> = {}) => screen(property, { ...DEFAULT_ANSWERS, ...patch });

describe("screen()", () => {
  it("default answers need more information", () => {
    const r = run();
    expect(r.outcome).toBe("more_info_needed");
    expect(r.unknownCount).toBeGreaterThanOrEqual(2);
  });

  it("owner on site and parking raise met checks and lower unknowns", () => {
    const base = run();
    const better = run({ ownerLivesOnSite: "yes", parkingAvailable: "yes" });
    expect(better.metCount).toBeGreaterThan(base.metCount);
    expect(better.unknownCount).toBeLessThan(base.unknownCount);
  });

  it("owner not living on site needs attention", () => {
    expect(run({ ownerLivesOnSite: "no" }).outcome).toBe("needs_attention");
  });

  it("an unknown answer never produces not_met for that rule", () => {
    const r = run({ dwellingType: "unknown", existingSecondUnit: "unknown", ownerLivesOnSite: "unknown", rentalLength: "unknown", parkingAvailable: "unknown", bedrooms: "unknown" });
    for (const id of ["dwelling", "one-unit", "owner-occupancy", "rental-length", "parking"]) {
      const res = r.results.find((x) => x.ruleId === id);
      expect(res, id).toBeDefined();
      expect(res?.status, id).not.toBe("not_met");
    }
  });

  it("other dwelling types are outside scope", () => {
    expect(run({ dwellingType: "other" }).outcome).toBe("outside_scope");
  });

  it("returns 9 results each with a source", () => {
    const r = run();
    expect(r.results).toHaveLength(9);
    for (const res of r.results) expect(res.sourceIds.length).toBeGreaterThanOrEqual(1);
  });
});
