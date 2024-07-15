import { describe, expect, it, vi } from "vitest";
import * as env from "./env";
import { afterEach, beforeEach } from "node:test";

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

  describe('build utils', () => {
    afterEach(() => {
      vi.unstubAllEnvs();
    })

    it('length', async () => {
      const utils = await import('../../utils')
      expect(Object.keys(utils).length).toBe(3);
      expect(Object.keys(utils)).toStrictEqual([
        "isProduction",
        "isDevelopment",
        "isDebug",
      ]);
    })

    it('prod', async () => {
      vi.resetModules()
      vi.stubEnv('NODE_ENV', 'production')
      const utils = await import('../../utils')
      expect(utils.isProduction).toBe(true);
      expect(utils.isDevelopment).toBe(false);
      expect(utils.isDebug).toBe(false);
    })

    it('dev', async () => {
      vi.resetModules()
      vi.stubEnv('NODE_ENV', 'development')
      const utils = await import('../../utils')
      expect(utils.isDevelopment).toBe(true);
      expect(utils.isProduction).toBe(false);
      expect(utils.isDebug).toBe(true);
    })

    it('other', async () => {
      vi.resetModules()
      vi.stubEnv('NODE_ENV', 'test')
      const utils = await import('../../utils')
      expect(utils.isDevelopment).toBe(true);
      expect(utils.isProduction).toBe(false);
      expect(utils.isDebug).toBe(true);
    })

    it('debug', async () => {
      vi.resetModules()
      vi.stubEnv('DEBUG', 'true')
      vi.stubEnv('NODE_ENV', 'production')
      const utils = await import('../../utils')
      expect(utils.isDevelopment).toBe(false);
      expect(utils.isProduction).toBe(true);
      expect(utils.isDebug).toBe(true);
    })

  })
});
