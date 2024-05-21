import {describe, test, expect} from "vitest";

import {UserfrontClient} from "./userfront";

describe("userfront", () => {
  describe("client", () => {

    test("throws an error when no api key is provided", () => {
      process.env.USERFRONT_API_KEY = "";

      expect(() => new UserfrontClient()).toThrowError("A valid Userfront admin API key is required");
    });
  });
})
