/**
 * Userfront Fetcher
 *
 * Used in the Userfront Client, wraps fetch with
 * better error handling and cURL debug logging.
 */
import fetchToCurl from "./fetch-to-curl";
import type { FetchOptions, FetchUrl, Method } from "./types";

/**
 * Generic Userfront Error Response
 */
interface UserfrontErrorResponse {
  statusCode: number;
  error: {
    type: string;
  };
  message: string;
}

/**
 * Options for the Userfront Fetcher Error
 */
interface UserfrontFetcherErrorOptions {
  message: string;
  code: number;
  response?: Response;
  data?: UserfrontErrorResponse;
  /**
   * Debug mode will include the response in the error
   */
  debug?: boolean;
}

/**
 * The Userfront Fetcher Error Class is thrown when response is not 2xx
 */
class UserfrontFetcherError extends Error {
  code: UserfrontFetcherErrorOptions["code"];
  message: UserfrontFetcherErrorOptions["message"];
  response?: UserfrontFetcherErrorOptions["response"];
  data?: UserfrontFetcherErrorOptions["data"];

  constructor({
    code,
    message,
    response,
    data,
    debug,
  }: UserfrontFetcherErrorOptions) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message);

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = `UserfrontFetcherError`;
    this.message = message;
    this.code = code;
    this.data = data;

    if (debug) {
      this.response = response;
    }
  }
}

async function fetcher(
  url: FetchUrl,
  { body, debug, ...init }: FetchOptions,
): Promise<Response> {
  const options = {
    /**
     * The credentials read-only property of the Request
     * interface indicates whether the user agent should
     * send cookies from the other domain in the case of
     * cross-origin requests.
     * @link https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
     */
    credentials: "include" as const,
    ...init,
    body: !!body ? JSON.stringify(body) : undefined,
  };

  if (debug) {
    console.log("UserfrontFetcher:", fetchToCurl(String(url), options));
  }

  const res = await fetch(url, options);

  // response.ok is true when res.status is 2xx
  // https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
  if (res.ok) {
    return res;
  }

  let data: UserfrontErrorResponse | undefined;

  try {
    // Attempt to parse the response body as JSON
    data = (await res?.json()) as UserfrontErrorResponse;
  } catch (error) {
    // Silence the error, likely no body to parse
    void error;
  }

  // Throw a custom error with the response when status is not 2xx
  throw new UserfrontFetcherError({
    message: data?.message ?? res.statusText,
    code: data?.statusCode ?? res.status,
    response: res,
    data,
    debug,
  });
}

export default fetcher;

export {
  type UserfrontErrorResponse,
  type UserfrontFetcherErrorOptions,
  UserfrontFetcherError,
  type Method,
  type FetchUrl,
  type FetchOptions,
};
