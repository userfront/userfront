/**
 * Userfront API Client
 *
 * Generic communication between servers
 */
import { DELETE, GET, POST, PUT } from "./http";
import type { Mode, Tenant, User } from "./types";
import { isProduction, USERFRONT_TENANT_ID } from "./env";

const config = {
  mode: isProduction ? "live" : ("test" as Mode),
  workspaceId: USERFRONT_TENANT_ID,
  GET: GET,
  POST: POST,
  PUT: PUT,
  DELETE: DELETE,
};

const api = {
  ...config,
  getWorkspace: async function <T extends string>() {
    return this.GET<Tenant<typeof this.mode, T>>(
      `/tenants/${this.workspaceId}`,
    );
  },
  getTenant: async function <T extends string>(id: T) {
    return this.GET<Tenant<typeof this.mode, T>>(`/tenants/${id}`);
  },
  getUser: async function <T extends string>(uuid: T) {
    return this.GET<User<typeof this.mode, T>>(`/users/${uuid}`);
  },
};

export default api;

/**
 * Get a specific tenant by id or the current workspace
 */
export const getWorkspace = api.getWorkspace.bind(config);

/**
 * Get a specific tenant by id or the current workspace
 */
export const getTenant = api.getTenant.bind(config);

/**
 * Get a specific user by id
 */
export const getUser = api.getUser.bind(config);
