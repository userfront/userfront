import { describe, expect, it } from "vitest";
import api, { getTenant, getUser, getWorkspace } from "./api";
import {
  apiConfig as config,
  demoWorkspaceId,
  mockUserUuid,
  mockWorkspaceId,
  mode,
} from "./test-utils";

describe("API", () => {
  // The client requests are intercepted by MSW
  describe("client", () => {
    it("has all of the methods", () => {
      expect(api).toBeDefined();
      expect(Object.keys(api).length).toBe(9);
      expect(Object.keys(api)).toStrictEqual([
        "mode",
        "workspaceId",
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "getWorkspace",
        "getTenant",
        "getUser",
      ]);
    });

    it("getWorkspace", async () => {
      expect(api.getWorkspace).toBeDefined();
      expect(api.getWorkspace).toBeInstanceOf(Function);
      expect(api.getWorkspace()).toBeInstanceOf(Promise);

      const workspace = await api.getWorkspace.bind(config)();
      expect(workspace.type).toBe("basic");
      expect(workspace.mode).toBe(mode);
      expect(workspace.tenantId).toBe(mockWorkspaceId);
      expect(workspace.name).toBe("Mock Workspace");
    });

    it("getTenant", async () => {
      expect(api.getTenant).toBeDefined();
      expect(api.getTenant).toBeInstanceOf(Function);
      expect(api.getTenant("")).toBeInstanceOf(Promise);

      const tenant = await api.getTenant.bind(config)(demoWorkspaceId);
      expect(tenant.type).toBe("basic");
      expect(tenant.mode).toBe(mode);
      expect(tenant.tenantId).toBe(demoWorkspaceId);
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
    it("getWorkspace", () => {
      expect(getWorkspace).toBeDefined();
      expect(getWorkspace).toBeInstanceOf(Function);
      expect(getWorkspace()).toBeInstanceOf(Promise);
    });

    it("getTenant", () => {
      expect(getTenant).toBeDefined();
      expect(getTenant).toBeInstanceOf(Function);
      expect(getTenant("")).toBeInstanceOf(Promise);
    });

    it("getUser", () => {
      expect(getUser).toBeDefined();
      expect(getUser).toBeInstanceOf(Function);
      expect(getUser("")).toBeInstanceOf(Promise);
    });
  });
});
