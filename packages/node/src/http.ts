/**
 * Userfront HTTP Client
 *
 * A simple wrapper around fetch for API requests.
 * Adds the necessary headers, metohds and parses responses as JSON.
 * Only accepts GET, POST, PUT, and PATCH.
 */
import {
  USERFRONT_API_KEY,
  USERFRONT_API_URL,
  USERFRONT_API_VERSION,
} from "./env";
import { FetchOptions, FetchUrl, JsonFetcher } from "./types";

const fetcher = {
  apiKey: USERFRONT_API_KEY,
  baseUrl: USERFRONT_API_URL,
  version: USERFRONT_API_VERSION,
  fetch,
  fetcher: function (url: FetchUrl, options: FetchOptions) {
    const apiKey = this.apiKey;

    return this.fetch(
      `${this.baseUrl}${this.version ? `/${this.version}` : ""}${url}`,
      {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: `Bearer ${apiKey}`,
          // TODO: Replace with the actual package version
          "X-Userfront-Node": "v1.0.0",
        },
      },
    );
  },
  fetchJson: async function <R extends unknown>(
    url: FetchUrl,
    options?: FetchOptions,
  ) {
    const data = await this.fetcher(url, {
      ...options,
      headers: {
        ...options?.headers,
        "Content-Type": "application/json",
      },
    });

    return data.json() as Promise<R>;
  },
};

const http = {
  fetcher: fetcher.fetcher,
  fetchJson: fetcher.fetchJson,
  GET: function <R extends unknown>(url: FetchUrl, options?: FetchOptions) {
    return this.fetchJson<R>(url, {
      ...options,
      method: "GET",
    });
  },
  POST: function <R extends unknown>(url: FetchUrl, options?: FetchOptions) {
    return this.fetchJson<R>(url, {
      ...options,
      method: "POST",
    });
  },
  PUT: function <R extends unknown>(url: FetchUrl, options?: FetchOptions) {
    return this.fetchJson<R>(url, {
      ...options,
      method: "PUT",
    });
  },
  DELETE: function <R extends unknown>(url: FetchUrl, options?: FetchOptions) {
    return this.fetchJson<R>(url, {
      ...options,
      method: "DELETE",
    });
  },
};

export default http;

export const GET: JsonFetcher = http.GET.bind(fetcher);
export const POST: JsonFetcher = http.POST.bind(fetcher);
export const PUT: JsonFetcher = http.PUT.bind(fetcher);
export const DELETE: JsonFetcher = http.DELETE.bind(fetcher);
