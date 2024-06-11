import { beforeEach, describe, expect, it, vi } from "vitest";
import { UserfrontClient } from "./userfront";
import {
  demoTenantId,
  mockLiveAdminApiKey,
  mockLiveReadOnlyApiKey,
  mockTenantId,
  mode,
} from "./test-utils";

vi.stubEnv("NODE_ENV", "production");

describe("UserfrontClient", () => {
  let Userfront: UserfrontClient;

  beforeEach(() => {
    Userfront = new UserfrontClient({
      apiKey: mockLiveAdminApiKey,
      tenantId: mockTenantId,
    });
  });

  it("throws an error when no api key is provided", () => {
    expect(() => new UserfrontClient()).toThrowError(
      "A valid Userfront admin API key is required",
    );
  });

  it("throws an error when an invalid api key is provided", () => {
    expect(
      () =>
        new UserfrontClient({
          apiKey: "invalid-api-key",
        }),
    ).toThrowError("A valid Userfront admin API key is required");
  });

  it("throws an error when a read-only api key is provided", () => {
    expect(
      () =>
        new UserfrontClient({
          apiKey: mockLiveReadOnlyApiKey,
        }),
    ).toThrowError("A valid Userfront admin API key is required");
  });

  it("throws an error when no workspace ID is provided", () => {
    expect(
      () =>
        new UserfrontClient({
          apiKey: mockLiveAdminApiKey,
        }),
    ).toThrowError("A valid Userfront workspace ID is required");
  });

  it("throws an error when an invalid workspace ID is provided", () => {
    expect(
      () =>
        new UserfrontClient({
          apiKey: mockLiveAdminApiKey,
          tenantId: "invalid-workspace-id",
        }),
    ).toThrowError("A valid Userfront workspace ID is required");
  });

  it("throws an error when an invalid API version is provided", () => {
    expect(
      () =>
        new UserfrontClient({
          apiKey: mockLiveAdminApiKey,
          tenantId: mockTenantId,
          version: "a1",
        }),
    ).toThrowError("A valid Userfront API version is required");
  });

  it("throws an error when window is defined", () => {
    // Define window
    // @ts-expect-error TS2571: Object is of type unknown
    (global as unknown).window = {};

    expect(
      () =>
        new UserfrontClient({
          apiKey: mockLiveAdminApiKey,
          tenantId: mockTenantId,
        }),
    ).toThrowError("The Userfront Node SDK is not supported in the browser");

    // Restore window to undefined
    // @ts-expect-error TS2571: Object is of type unknown
    (global as unknown).window = undefined;
  });

  it("has the correct properties", () => {
    expect(Userfront).toHaveProperty("getTenant");
    expect(typeof Userfront.getTenant).toBe("function");

    expect(Userfront).toHaveProperty("getUser");
    expect(typeof Userfront.getUser).toBe("function");
  });

  it("makes a request with a different baseUrl", async () => {
    Userfront = new UserfrontClient({
      apiKey: mockLiveAdminApiKey,
      tenantId: mockTenantId,
      baseUrl: "https://api.example.com",
    });

    const workspace = await Userfront.getTenant();
    expect(workspace.name).toBe("Different baseUrl");
  });

  it("makes a request without a version", async () => {
    Userfront = new UserfrontClient({
      apiKey: mockLiveAdminApiKey,
      tenantId: mockTenantId,
      baseUrl: "https://api.example.com",
      version: "",
    });

    const workspace = await Userfront.getTenant();
    expect(workspace.name).toBe("No version");
  });

  it("makes a request with a different version", async () => {
    Userfront = new UserfrontClient({
      apiKey: mockLiveAdminApiKey,
      tenantId: mockTenantId,
      baseUrl: "https://api.example.com",
      version: "v1",
    });

    const workspace = await Userfront.getTenant();
    expect(workspace.name).toBe("Version 1");
  });

  it("makes the correct request for getTenant", async () => {
    const getTenant = Userfront.getTenant;
    expect(getTenant()).toBeInstanceOf(Promise);
    const tenant = await getTenant(demoTenantId);
    expect(tenant.type).toBe("basic");
    expect(tenant.mode).toBe(mode);
    expect(tenant.tenantId).toBe(demoTenantId);
    expect(tenant.name).toBe("Demo Workspace");
  });
});
