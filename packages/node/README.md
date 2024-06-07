<p align="center">
  <a href="https://userfront.com">
    <img src="https://github.com/userfront/userfront/logo.png" width="160">
  </a>
</p>

# Node.js SDK

The Userfront Node.js SDK is a fast and easy way to interact with the Userfront API from your Node.js application. Built on top of [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), this library is designed to be a light and type-safe way for you to manage your Userfront resources.

**IMPORTANT:** This library is designed for server-side Node.js applications only, such as [Express](https://expressjs.com/), [tRPC](https://trpc.io/), or [Hapi](https://hapi.dev/) servers. Do not use this library on a browser or frontend framework.

For React support in the browser, see [@userfront/react](https://www.npmjs.com/package/@userfront/react).

For Next.js support on the server and client, see [@userfront/next](https://www.npmjs.com/package/@userfront/next).

## Requirements

- Node.js v18 or later

## Installation

```sh
npm install @userfront/node
# or
yarn add @userfront/node
# or
pnpm add @userfront/node
```

## Usage

### Environment Methods

Define these environment variables in your `.env` or however they are configured in your application:

```
USERFRONT_API_KEY="..."
USERFRONT_WORKSPACE_ID="..."
```

The SDK will use these variables when they are defined.

```javascript
import { getWorkspace } from "@userfront/node";

// Get a user by uuid
const tenant = await getTenant("...");
```

### Instantiate the Client

You may choose to instantiate the client instead, for example, when your secrets are retrieved asynchronously, if you're using a context, or if you prefer the greater abstraction.
There are other debugging and error handling benefits as well.

```javascript
import { UserfrontClient } from "@userfront/node";

const Userfront = new UserfrontClient({
  apiKey: "...",
  workspaceId: "...",
});

// Get a tenant by id
const tenant = await Userfront.getTenant("...");
```

#### Debugging

With the client, an additional cURL logger will be enabled by default in development environments.

```sh
curl 'https://api.userfront.com/v0/tenants/{tenantId}' -X GET -H "Content-Type: application/json" -H "Authorization: Bearer uf_live_admin_wn9mwypn_59f60f53fa7cc018d8f93deceb0cc8e3" -H "X-Userfront-Node: v1.0.0"
```

Disable this by setting `debug` to `false` in the client options.

```javascript
const Userfront = new UserfrontClient({
  debug: false,
});
```

#### Error Handling

Responses that are not 2xx will throw a `UserfrontFetcherError`. Catch them to handle Userfront errors appropriately.

```javascript
import { UserfrontFetcherError } from "@userfront/node";

try {
  const user = await Userfront.getTenant("...");
} catch (error) {
  if (error instanceof UserfrontFetcherError) {
    // Handle the error
  }
}
```

#### Client Options

| Option        | Default                                       | Description                                                                                                                                                                                             |
| ------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apiKey`      | `USERFRONT_API_KEY`                           | The secret admin API key, from [Authentication / API Keys](https://userfront.com/dashboard/api-keys) in the Userfront dashboard.                                                                        |
| `baseUrl`     | `'https://api.userfront.com'`                 | The API URL to use for requests, in case you're using a proxy or custom domain.                                                                                                                         |
| `version`     | `'v0'`                                        | The API version to use, an empty string will remove the version from requests.                                                                                                                          |
| `workspaceId` | `USERFRONT_WORKSPACE_ID`                      | The parent workspace ID, this can be found on the [Userfront dashboard](https://userfront.com/dashboard).                                                                                               |
| `mode`        | `NODE_ENV === 'production' ? 'live' : 'test'` | The mode to use, `live` when `process.env.NODE_ENV` is `production`, otherwise `test`. To enable `live` mode, visit [Live Domains](https://userfront.com/dashboard/domains) in the Userfront dashboard. |
| `origin`      | `undefined`                                   | The origin header for requests, this may be required in some cases.                                                                                                                                     |
| `debug`       | `NODE_ENV !== 'production'`                   | Log a cURL per request, disabled when `process.env.NODE_ENV` is `production`.                                                                                                                           |
