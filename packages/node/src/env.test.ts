import { describe, expect, it } from "vitest";
import * as env from "./env";

describe("env", () => {
  it("exports all of the correct constants", () => {
    expect(env).toBeDefined();
    expect(Object.keys(env).length).toBe(4);
    expect(Object.keys(env)).toStrictEqual([
      "USERFRONT_API_KEY",
      "USERFRONT_API_URL",
      "USERFRONT_API_VERSION",
      "USERFRONT_TENANT_ID",
    ]);
  });
});
