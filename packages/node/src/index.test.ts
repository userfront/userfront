import { describe, expect, it } from "vitest";
import * as Userfront from "./index";
import { mockLiveAdminApiKey, mockWorkspaceId, mode } from "./test-utils";

describe("@userfront/node", () => {
  it("exports all of the correct modules", () => {
    expect(Userfront).toBeDefined();
    expect(Object.keys(Userfront).length).toBe(6);
    expect(Object.keys(Userfront)).toStrictEqual([
      "getWorkspace",
      "getTenant",
      "getUser",
      "api",
      "UserfrontFetcherError",
      "UserfrontClient",
    ]);
  });

  it("exports the API client", () => {
    expect(Userfront).toHaveProperty("api");
    expect(Userfront.api).toBeInstanceOf(Object);
    expect(Object.keys(Userfront.api).length).toBe(9);
    expect(Object.keys(Userfront.api)).toStrictEqual([
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
    // Assert client properties
    expect(Userfront.api).toHaveProperty("mode");
    expect(Userfront.api.mode).toBe(mode);
    expect(Userfront.api).toHaveProperty("workspaceId");
    expect(Userfront.api.workspaceId).toBeUndefined;
    // Assert GET
    expect(Userfront.api.GET).toBeInstanceOf(Function);
    expect(Userfront.api.GET("")).toBeInstanceOf(Promise);
    // Assert POST
    expect(Userfront.api.POST).toBeInstanceOf(Function);
    expect(Userfront.api.POST("")).toBeInstanceOf(Promise);
    // Assert PUT
    expect(Userfront.api.PUT).toBeInstanceOf(Function);
    expect(Userfront.api.PUT("")).toBeInstanceOf(Promise);
    // Assert DELETE
    expect(Userfront.api.DELETE).toBeInstanceOf(Function);
    expect(Userfront.api.DELETE("")).toBeInstanceOf(Promise);
    // Assert getWorkspace
    expect(Userfront.api.getWorkspace).toBeInstanceOf(Function);
    expect(Userfront.api.getWorkspace()).toBeInstanceOf(Promise);
    // Assert getTenant
    expect(Userfront.api.getTenant).toBeInstanceOf(Function);
    expect(Userfront.api.getTenant("")).toBeInstanceOf(Promise);
    // Assert getUser
    expect(Userfront.api.getUser).toBeInstanceOf(Function);
    expect(Userfront.api.getUser("")).toBeInstanceOf(Promise);
  });

  it("exports the API methods", () => {
    // Assert getWorkspace
    expect(Userfront).toHaveProperty("getWorkspace");
    expect(Userfront.getWorkspace).toBeInstanceOf(Function);
    expect(Userfront.getWorkspace()).toBeInstanceOf(Promise);
    // Assert getTenant
    expect(Userfront).toHaveProperty("getTenant");
    expect(Userfront.getTenant).toBeInstanceOf(Function);
    expect(Userfront.getTenant("")).toBeInstanceOf(Promise);
    // Assert getUser
    expect(Userfront).toHaveProperty("getUser");
    expect(Userfront.getUser).toBeInstanceOf(Function);
    expect(Userfront.getUser("")).toBeInstanceOf(Promise);
  });

  it("exports the UserfrontClient", () => {
    const client = new Userfront.UserfrontClient({
      apiKey: mockLiveAdminApiKey,
      workspaceId: mockWorkspaceId,
    });

    // Assert UserfrontClient
    expect(Userfront).toHaveProperty("UserfrontClient");
    expect(Userfront.UserfrontClient).toBeInstanceOf(Function);

    expect(client).toBeInstanceOf(Object);
    expect(Object.keys(client).length).toBe(13);
    expect(Object.keys(client)).toStrictEqual([
      "_events",
      "_eventsCount",
      "_maxListeners",
      "getWorkspace",
      "getTenant",
      "getUser",
      "apiKey",
      "baseUrl",
      "version",
      "workspaceId",
      "mode",
      "origin",
      "isDebug",
    ]);

    expect(client.getWorkspace).toBeInstanceOf(Function);
    expect(client.getWorkspace()).toBeInstanceOf(Promise);

    expect(client.getTenant).toBeInstanceOf(Function);
    expect(client.getTenant("")).toBeInstanceOf(Promise);

    expect(client.getUser).toBeInstanceOf(Function);
    expect(client.getUser("")).toBeInstanceOf(Promise);
  });
});
