/**
 * Copy of fetch-to-curl <https://www.npmjs.com/package/fetch-to-curl>
 * @see https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.headers.html
 */
export type HeadersInit = Headers | string[][] | Record<string, string>;

export type Method =
  | "GET"
  | "POST"
  | "DELETE"
  | "PATCH"
  | "PUT"
  | "HEAD"
  | "OPTIONS";

export interface FetchOptions {
  url?: string;
  method?: Method | string;
  headers?: HeadersInit;
  body?: any;
  [rest: string]: any;
}

/**
 * see https://fetch.spec.whatwg.org/#methods
 *
 * @export
 * @param {any} options
 * @returns {string}
 */
export const generateMethod = (options: any) => {
  const type: Record<Method, string> = {
    GET: " -X GET",
    POST: " -X POST",
    PUT: " -X PUT",
    PATCH: " -X PATCH",
    DELETE: " -X DELETE",
    HEAD: " -X HEAD",
    OPTIONS: " -X OPTIONS",
  };
  const method = options.method;
  if (!method) return "";
  return type[method.toUpperCase() as Method] || "";
};

/**
 * @export
 * @param {any} val
 * @returns true if the envirtonment supports Headers and val is of instance Headers
 */
export const isInstanceOfHeaders = (val: HeadersInit) => {
  if (typeof Headers !== "function") {
    /**
     * Environment does not support the Headers constructor
     * old internet explorer?
     */
    return false;
  }
  return val instanceof Headers;
};

/**
 * @typedef {Object} HeaderParams
 * @property {Boolean} isEncode - A flag which is set to true if the request should set the --compressed flag
 * @property {String} params - The header params as string
 */

const getHeaderString = (name: string, val: string) =>
  ` -H "${name}: ${`${val}`.replace(/(\\|")/g, "\\$1")}"`;

/**
 * @export
 * @param {object={}} options
 * @param {object|Headers} options.headers
 * @returns {HeaderParams} An Object with the header info
 */
export const generateHeader = (options: RequestInit = {}) => {
  const { headers } = options;
  let isEncode = false;
  let headerParam = "";
  if (headers instanceof Headers) {
    headers.forEach((val: string, name: string) => {
      if (name.toLocaleLowerCase() !== "content-length") {
        headerParam += getHeaderString(name, val);
      }
      if (name.toLocaleLowerCase() === "accept-encoding") {
        isEncode = true;
      }
    });
  } else if (headers) {
    Object.keys(headers).map((name) => {
      if (name.toLocaleLowerCase() !== "content-length") {
        headerParam += getHeaderString(name, (headers as any)[name]);
      }
      if (name.toLocaleLowerCase() === "accept-encoding") {
        isEncode = true;
      }
    });
  }
  return {
    params: headerParam,
    isEncode,
  };
};

/**
 * @export
 * @param {Object} body
 * @returns {string}
 */
export function escapeBody(body: unknown) {
  if (typeof body !== "string") return body;
  return body.replace(/'/g, `'\\''`);
}

/**
 * @export
 * @param {Object} body
 * @returns {string}
 */
export function generateBody(body: unknown) {
  if (!body) return "";
  if (typeof body === "object") {
    return ` --data-binary '${escapeBody(JSON.stringify(body))}'`;
  }
  return ` --data-binary '${escapeBody(body)}'`;
}

/**
 * @export
 * @param {boolean} isEncode
 * @return {string}
 */
export function generateCompress(isEncode: boolean) {
  return isEncode ? " --compressed" : "";
}

/**
 * @export
 * @param {string|object} requestInfo
 * @param {object={}} requestInit
 */
export const fetchToCurl = (
  requestInfo: string | FetchOptions,
  requestInit?: RequestInit,
) => {
  let url, options;
  /**
   * initialization with an empty object is done here to
   * keep everything backwards compatible to 0.4.0 and below
   */
  if (typeof requestInfo === "string" || requestInfo instanceof URL) {
    url = requestInfo;
    options = requestInit ?? {};
  } else {
    url = (requestInfo ?? {}).url;
    options = requestInfo ?? {};
  }
  const { body } = options;
  const headers = generateHeader(options);
  return `curl '${url}'${generateMethod(options)}${
    headers.params || ""
  }${generateBody(body)}${generateCompress(headers.isEncode)}`;
};

export default fetchToCurl;
