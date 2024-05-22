/**
 * Acceptable HTTP methods for the API
 */
export type Method = "GET" | "POST" | "DELETE" | "PUT";

/**
 * Override request options
 */
export interface RequestInitOverrides {
  method?: Method;
  debug?: boolean;
}

export type FetchUrl = Parameters<typeof fetch>[0];
export type FetchOptions = Omit<RequestInit, keyof RequestInitOverrides> &
  RequestInitOverrides;
export type Fetcher = (
  url: FetchUrl,
  options?: FetchOptions,
) => Promise<Response>;
export type JsonFetcher = <R extends unknown>(
  url: FetchUrl,
  options?: FetchOptions,
) => Promise<R>;

export type Mode = "live" | "test";

export interface User<M extends Mode = "test", I extends string = string> {
  mode: M;
  userId: I;
  userUuid: string;
  username: string;
  email: string;
  name: string;
  image: string;
  phoneNumber: any;
  data: Data;
  locked: boolean;
  isMfaRequired: boolean;
  preferredFirstFactor: PreferredFirstFactor;
  preferredSecondFactor: PreferredSecondFactor;
  isEmailConfirmed: boolean;
  isPhoneNumberConfirmed: boolean;
  lastActiveAt: string;
  createdAt: string;
  updatedAt: string;
  tenant: UserTenant;
  authorization: Authorization;
  tenantId: string;
  isConfirmed: boolean;
  uuid: string;
  authentication: Authentication;
}

export interface Data {}

export interface PreferredFirstFactor {
  channel: string;
  strategy: string;
}

export interface PreferredSecondFactor {
  channel: string;
  strategy: string;
}

export interface UserTenant {
  tenantId: string;
  aliasId: any;
  name: string;
  image: string;
  loginRedirectPath: string;
  logoutRedirectPath: string;
}

export interface Authorization {}

export interface Authentication {
  firstFactors: FirstFactor[];
  secondFactors: any[];
}

export interface FirstFactor {
  channel: string;
  strategy: string;
}

export interface Tenant<M extends Mode = "test", I extends string = string> {
  uuid: string;
  aliasId: any;
  name: string;
  type: string;
  image: string;
  signupRedirectPath: string | null;
  loginRedirectPath: string;
  logoutRedirectPath: string;
  passwordResetPath: string;
  pkceLoginRedirectUri: string | null;
  userCreatedWebhookUrl: string | null;
  userUpdatedWebhookUrl: string | null;
  userDeletedWebhookUrl: string | null;
  tenantCreatedWebhookUrl: string | null;
  tenantUpdatedWebhookUrl: string | null;
  tenantDeletedWebhookUrl: string | null;
  verificationCodeSmsWebhookUrl: string | null;
  verificationCodeEmailWebhookUrl: string | null;
  linkEmailWebhookUrl: string | null;
  data: Data;
  details: Details;
  brand: Brand;
  providerOrder: any[];
  isPhoneNumberUnique: boolean;
  cookieOptionsSameSite: string;
  cookieOptionsPath: string;
  cookieOptionsSetDomain: boolean;
  allowNonHttpOnlyRefresh: boolean;
  accessTokenDuration: number;
  refreshTokenDuration: number;
  dataRetentionMonths: number;
  lastActiveAt: string;
  dataForParent: DataForParent;
  dataForParentSchema: any[];
  previousAuthService: any;
  creator: Creator;
  parent: Parent;
  children: Children;
  roles: Role[];
  hasActivatedLiveMode: boolean;
  mode: M;
  descendantCount: DescendantCount;
  tenantId: I;
}

export interface Data {}

export interface Details {}

export interface Brand {}

export interface DataForParent {
  activation: Activation;
}

export interface Activation {
  last_configured_auth_at: string;
  has_copied_api_key_live_mode: boolean;
  last_copied_api_key_live_mode_at: string;
}

export interface Creator {
  userId: number;
  name: string;
  username: string;
  email: string;
  image: string;
  lastActiveAt: string;
}

export interface Parent {
  tenantId: string;
  image: string;
  name: string;
  mode: string;
}

export interface Children {
  totalCount: number;
  totalPages: number;
  results: any[];
}

export interface Role {
  name: string;
}

export interface DescendantCount {
  descendants: number;
  children: number;
  basic: number;
  multiuser: number;
  enterprise: number;
}
