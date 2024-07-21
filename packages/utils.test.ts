import { describe, expect, it, vi } from "vitest";
import { afterEach } from "node:test";

describe("env build utils", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  })


  it('length', async () => {
    const utils = await import('./utils')
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
    const utils = await import('./utils')
    expect(utils.isProduction).toBe(true);
    expect(utils.isDevelopment).toBe(false);
    expect(utils.isDebug).toBe(false);
  })

  it('dev', async () => {
    vi.resetModules()
    vi.stubEnv('NODE_ENV', 'development')
    const utils = await import('./utils')
    expect(utils.isDevelopment).toBe(true);
    expect(utils.isProduction).toBe(false);
    expect(utils.isDebug).toBe(true);
  })

  it('other', async () => {
    vi.resetModules()
    vi.stubEnv('NODE_ENV', 'test')
    const utils = await import('./utils')
    expect(utils.isDevelopment).toBe(true);
    expect(utils.isProduction).toBe(false);
    expect(utils.isDebug).toBe(true);
  })

  it('debug', async () => {
    vi.resetModules()
    vi.stubEnv('DEBUG', 'true')
    vi.stubEnv('NODE_ENV', 'production')
    const utils = await import('./utils')
    expect(utils.isDevelopment).toBe(false);
    expect(utils.isProduction).toBe(true);
    expect(utils.isDebug).toBe(true);
  })
});
