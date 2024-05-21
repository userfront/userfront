/**
 * Acceptable HTTP methods for the API
 */
export type Method =
  | "GET"
  | "POST"
  | "DELETE"
  | "PUT";

/**
 * Override request options
 */
export interface RequestInitOverrides {
  method?: Method;
  debug?: boolean;
}

export type FetchUrl = Parameters<typeof fetch>[0];

export type FetchOptions = Omit<RequestInit, keyof RequestInitOverrides> & RequestInitOverrides;

export type Fetcher = (url: FetchUrl, options?: FetchOptions) => Promise<Response>;

export type JsonFetcher = <R extends unknown>(url: FetchUrl, options?: FetchOptions) => Promise<R>;

export type Mode = "live" | "test";

export interface User<M extends Mode = "test", I extends string = string> {
  mode: M;
  userId: I;
}

export interface Tenant<M extends Mode = "test", I extends string = string> {
  mode: M;
  tenantId: I;
}
