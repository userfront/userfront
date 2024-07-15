/**
 * Userfront Client
 */
// Fix for error TS9006: Declaration emit for this file requires using private name 'StaticEventEmitterOptions' from module '"events"'. An explicit type annotation may unblock declaration emit.
import { EventEmitter } from "node:events";

import fetcher from "./fetcher";
import {
  USERFRONT_API_KEY,
  USERFRONT_API_URL,
  USERFRONT_API_VERSION,
  USERFRONT_TENANT_ID,
} from "./env";
import { isDebug, isProduction } from "../../utils";
import type { Mode } from "./types";
import api from "./api";
import http from "./http";

interface UserfrontClientOptions {
  /**
   * The secret admin API key, from [Authentication / API Keys](https://userfront.com/dashboard/api-keys)
   * in the Userfront dashboard
   * @default process.env.USERFRONT_API_KEY
   */
  apiKey: string;
  /**
   * The API URL to use for requests, in case you're using a proxy or custom domain
   * @default "https://api.userfront.com"
   */
  baseUrl: string;
  /**
   * The API version to use, empty string will remove the version from requests
   * @default "v0"
   */
  version: string;
  /**
   * The parent workspace ID, this can be found on the [Userfront dashboard](https://userfront.com/dashboard)
   * @default process.env.USERFRONT_TENANT_ID
   */
  tenantId: string;
  /**
   * The mode to use - defaults to `live` when `process.env.NODE_ENV` is `production`, otherwise `test`.
   * To enable `live` mode, visit [Live Domains](https://userfront.com/dashboard/domains) in the Userfront dashboard.
   */
  mode: Mode;
  /**
   * The origin to use for requests, in case you're using a proxy or custom domain
   */
  origin: string;
  /**
   * Debug mode will log a cURL per request, disabled when `process.env.NODE_ENV` is `production`.
   */
  debug: boolean;
}

/**
 * Create a custom API event-emitting instance with specific options.
 * Uses the `UserfrontFetcher` to handle requests and responses.
 */
class UserfrontClient extends EventEmitter {
  /**
   * Get a specific tenant by id
   */
  public getTenant: (typeof api)["getTenant"];
  /**
   * Get a specific user by id
   */
  public getUser: (typeof api)["getUser"];
  private readonly apiKey: UserfrontClientOptions["apiKey"];
  private readonly baseUrl: UserfrontClientOptions["baseUrl"];
  private readonly version: UserfrontClientOptions["version"];
  private readonly tenantId: UserfrontClientOptions["tenantId"];
  private readonly mode: UserfrontClientOptions["mode"];
  private readonly origin?: UserfrontClientOptions["origin"];
  private readonly isDebug: UserfrontClientOptions["debug"];

  constructor(options?: Partial<UserfrontClientOptions>) {
    super();

    this.baseUrl = options?.baseUrl ?? USERFRONT_API_URL;
    this.version = options?.version ?? USERFRONT_API_VERSION;

    this.apiKey = options?.apiKey ?? USERFRONT_API_KEY;
    this.tenantId = options?.tenantId ?? USERFRONT_TENANT_ID;

    this.mode = options?.mode ?? (isProduction ? "live" : "test");
    this.isDebug = options?.debug ?? isDebug;

    // Confirm the configuration and environments are valid
    this.init();

    // Custom fetch for the HTTP client
    const fetchConfig = {
      apiKey: this.apiKey,
      baseUrl: this.baseUrl,
      version: this.version,
      fetch: (...args: Parameters<typeof fetcher>) =>
        fetcher(args[0], {
          ...args[1],
          debug: this.isDebug,
        }),
    };

    // Bind the custom fetch to the HTTP client fetcher
    const fetcherConfig = {
      fetchJson: http.fetchJson.bind({
        fetcher: http.fetcher.bind(fetchConfig),
      }),
    };

    // Bind the custom fetcher to the HTTP client
    const httpConfig = {
      tenantId: this.tenantId,
      mode: this.mode,
      GET: http.GET.bind(fetcherConfig),
      POST: http.POST.bind(fetcherConfig),
      PUT: http.PUT.bind(fetcherConfig),
      DELETE: http.DELETE.bind(fetcherConfig),
    };

    // Bind the API client calls to the HTTP configuration
    // (Next.js) Warning: Cannot bind "this" of a Server Action. Pass null or undefined as the first argument to .bind().
    this.getTenant = api.getTenant.bind(httpConfig);
    this.getUser = api.getUser.bind(httpConfig);
  }

  /**
   * Initialize the Userfront SDK, this will throw errors
   * when the required options are missing or invalid.
   */
  private init() {
    // @ts-expect-error TS2304: Cannot find name window
    if (typeof window !== "undefined") {
      throw new Error("The Userfront Node SDK is not supported in the browser");
    }
    if (!this.apiKey || !this.apiKey.match(/^uf_(live|test)_admin_/g)) {
      throw new Error("A valid Userfront admin API key is required");
    }
    if (!this.tenantId || this.tenantId.length > 8) {
      throw new Error("A valid Userfront workspace ID is required");
    }
    if (
      this.version &&
      (this.version.length > 2 || !this.version.startsWith("v"))
    ) {
      throw new Error("A valid Userfront API version is required");
    }
    if (this.isDebug && isProduction) {
      throw new Error("Debug mode is not permitted in production");
    }
  }
}

export { UserfrontClient, type UserfrontClientOptions };
