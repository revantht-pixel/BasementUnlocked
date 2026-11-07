import { describe, expect, it } from "vitest";
import { normalizeStreet } from "./lookup";

describe("normalizeStreet", () => {
  it("matches the county format for a plain address", () => {
    expect(normalizeStreet("1216 E Driggs Ave")).toBe("1216 E DRIGGS AVE");
  });

  it("expands words and drops city, state and zip", () => {
    expect(normalizeStreet("1216 East Driggs Avenue, Salt Lake City, UT 84106")).toBe("1216 E DRIGGS AVE");
  });

  it("handles numbered streets and punctuation", () => {
    expect(normalizeStreet("382 east 11th avenue")).toBe("382 E 11TH AVE");
    expect(normalizeStreet("1300 S. 1100 E.")).toBe("1300 S 1100 E");
  });

  it("drops unit information", () => {
    expect(normalizeStreet("535 N E St Apt 2")).toBe("535 N E ST");
  });
});
