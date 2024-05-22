import http from "./http";
import type { Mode } from "./types";
import mockWorkspace from "./mocks/tenants-mock1234-GET.json";
import demoWorkspace from "./mocks/tenants-demo1234-GET.json";
import mockUser from "./mocks/user-GET.json";

export const mode: Mode = "test";
export const mockLiveAdminApiKey =
  "uf_live_admin_mock1234_605d88c3346e464d92dad6d8a370f4dd";
export const mockLiveReadOnlyApiKey =
  "uf_live_readonly_mock1234_605d88c3346e464d92dad6d8a370f4dd";
export const mockWorkspaceId = mockWorkspace.tenantId;
export const demoWorkspaceId = demoWorkspace.tenantId;
export const mockUserUuid = mockUser.uuid;

export const httpConfig = {
  mode,
  workspaceId: mockWorkspaceId,
  fetchJson: http.fetchJson.bind({
    fetcher: http.fetcher.bind({
      apiKey: "",
      baseUrl: "https://api.userfront.com",
      version: "v0",
      fetch: (...args: Parameters<typeof fetch>) => fetch(...args),
    }),
  }),
};

export const apiConfig = {
  mode,
  workspaceId: mockWorkspaceId,
  GET: http.GET.bind(httpConfig),
  POST: http.POST.bind(httpConfig),
  PUT: http.PUT.bind(httpConfig),
  DELETE: http.DELETE.bind(httpConfig),
};
