/**
 * Userfront API Client
 *
 * Generic communication between servers
 */
import { DELETE, GET, POST, PUT } from "./http";
import type { Mode, Tenant, User } from "./types";
import { USERFRONT_TENANT_ID } from "./env";
import { isProduction } from "../../utils";

const config = {
  mode: isProduction ? "live" : ("test" as Mode),
  tenantId: USERFRONT_TENANT_ID,
  GET: GET,
  POST: POST,
  PUT: PUT,
  DELETE: DELETE,
};

const api = {
  ...config,
  getTenant: async function <T extends string>(id?: T) {
    return this.GET<Tenant<typeof this.mode, T>>(
      `/tenants/${id ? id : this.tenantId}`,
    );
  },
  getUser: async function <T extends string>(uuid: T) {
    return this.GET<User<typeof this.mode, T>>(`/users/${uuid}`);
  },
};

export default api;

/**
 * Get a specific tenant by id or the current tenant
 */
export const getTenant = api.getTenant.bind(config);

/**
 * Get a specific user by id
 */
export const getUser = api.getUser.bind(config);
