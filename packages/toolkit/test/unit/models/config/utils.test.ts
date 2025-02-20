import { describe, it, expect } from "vitest";
import { getTargetForFactor, factorConfig } from "@/models/config/utils";

describe("models/utils.ts", () => {
  describe("getTargetForFactor", () => {
    const ssoProviders = [
      "apple",
      "azure",
      "facebook",
      "github",
      "google",
      "linkedin",
      "twitter",
      "okta",
    ];
    ssoProviders.forEach((provider) => {
      it(`should return ssoProvider for ${provider}`, () => {
        const factor = {
          channel: "email",
          strategy: provider,
        };
        const expected = "ssoProvider";
        const actual = getTargetForFactor(factor);
        expect(actual).toEqual(expected);
      });
    });
    Object.entries(factorConfig).forEach(([key, factorData]) => {
      if (key === "ssoProvider") {
        return;
      }
      it(`should return ${key} for the matching factor`, () => {
        const factor = {
          channel: factorData.channel,
          strategy: factorData.strategy,
        };
        const expected = key;
        const actual = getTargetForFactor(factor);
        expect(actual).toEqual(expected);
      });
    });
    it("should return an empty string if there is no matching factor", () => {
      const factor = {
        channel: "test",
        strategy: "factor",
      };
      const expected = "";
      const actual = getTargetForFactor(factor);
      expect(actual).toEqual(expected);
    });
  });
});
