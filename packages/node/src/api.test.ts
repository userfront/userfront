import { describe, expect, it } from "vitest";
import api, { getTenant, getUser } from "./api";
import {
  apiConfig as config,
  demoTenantId,
  mockUserUuid,
  mockTenantId,
  mode,
} from "./test-utils";

describe("API", () => {
  // The client requests are intercepted by MSW
  describe("client", () => {
    it("has all of the methods", () => {
      expect(api).toBeDefined();
      expect(Object.keys(api).length).toBe(8);
      expect(Object.keys(api)).toStrictEqual([
        "mode",
        "tenantId",
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "getTenant",
        "getUser",
      ]);
    });

    it("getTenant", async () => {
      expect(api.getTenant).toBeDefined();
      expect(api.getTenant).toBeInstanceOf(Function);
      expect(api.getTenant()).toBeInstanceOf(Promise);

      const tenant = await api.getTenant.bind(config)(demoTenantId);
      expect(tenant.type).toBe("basic");
      expect(tenant.mode).toBe(mode);
      expect(tenant.tenantId).toBe(demoTenantId);
      expect(tenant.name).toBe("Demo Workspace");
    });

    it("getUser", async () => {
      expect(api.getUser).toBeDefined();
      expect(api.getUser).toBeInstanceOf(Function);
      expect(api.getUser("")).toBeInstanceOf(Promise);

      const user = await api.getUser.bind(config)(mockUserUuid);
      expect(user.uuid).toBe(mockUserUuid);
    });
  });

  // FIXME: For some reason, the methods are not intercepted by MSW
  describe("methods", () => {
    it("getTenant", () => {
      expect(getTenant).toBeDefined();
      expect(getTenant).toBeInstanceOf(Function);
      expect(getTenant()).toBeInstanceOf(Promise);
    });

    it("getUser", () => {
      expect(getUser).toBeDefined();
      expect(getUser).toBeInstanceOf(Function);
      expect(getUser("")).toBeInstanceOf(Promise);
    });
  });
});
