import { describe, expect, it } from "vitest";
import * as env from "./env";

describe("env", () => {
  it("exports all of the correct constants", () => {
    expect(env).toBeDefined();
    expect(Object.keys(env).length).toBe(7);
    expect(Object.keys(env)).toStrictEqual([
      "isDevelopment",
      "isProduction",
      "isDebug",
      "USERFRONT_API_KEY",
      "USERFRONT_API_URL",
      "USERFRONT_API_VERSION",
      "USERFRONT_WORKSPACE_ID",
    ]);
    expect(env.isDevelopment).toBe(true);
    expect(env.isProduction).toBe(false);
    expect(env.isDebug).toBe(true);
  });
});
