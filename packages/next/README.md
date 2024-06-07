<p align="center">
  <a href="https://userfront.com">
    <img src="https://github.com/userfront/userfront/logo.png" width="160">
  </a>
</p>

# Next SDK

The Userfront Next SDK is a fast and easy way interact with the Userfront API from your Next.js application. Fetch and manage Userfront resources, build impressive server or client components, and experience full-fledged transformational auth without the complexity.

**NOTE:** This library is designed for Next.js applications only. Do not use this library with any other framework. This library is a combination of [@userfront/node](https://www.npmjs.com/package/@userfront/node) for support on the server and [@userfront/react](https://www.npmjs.com/package/@userfront/react) for support on the client.

## Requirements

- Next.js v14 or later

## Installation

```sh
npm install @userfront/next
# or
yarn add @userfront/next
# or
pnpm add @userfront/next
```

Add the `UserfrontProvider` with your desired `tenantId` to the root layout (`app/layout.tsx`).

```javascript
import { UserfrontProvider } from "@userfront/next/client";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserfrontProvider tenantId="...">
          {children}
        </UserfrontProvider>
      </body>
    </html>
  );
}
```

### Provider Options

| Option           | Default | Description                                                                                                                                                                   |
| ---------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tenantId`       | string  | The tenant identifier, this can be found in workspace [Tenants](https://userfront.com/dashboard/tenants) on the Userfront dashboard.                                          |
| `loginUrl`       | string  | Redirect URL for unauthenticated visitors that need to login, the default is `/login`.                                                                                        |
| `loginRedirect`  | string  | Redirect URL after login, `false` to disable. When `undefined`, uses the path configured to the workspace [paths & routing settings](https://userfront.com/dashboard/paths).  |
| `signupRedirect` | string  | Redirect URL after signup, `false` to disable. When `undefined`, uses the path configured to the workspace [paths & routing settings](https://userfront.com/dashboard/paths). |
| `logoutRedirect` | string  | Redirect URL after logout, `false` to disable. When `undefined`, uses the path configured to the workspace [paths & routing settings](https://userfront.com/dashboard/paths). |
| `requireAuth`    | boolean | When `true`, unauthenticated visitors will be redirected to the `loginUrl`.                                                                                                   |

## Client

Use `@userfront/next/client` with client React components. These files or functions should have the `"use client";` directive.

### Hook

Use the `useUserfront()` hook to access [Userfront core](https://www.npmjs.com/package/@userfront/core) and the current client auth state.

```javascript
import { useUserfront } from "@userfront/next/client";

export default function Component() {
  const { user, isLoading } = useUserfront();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>Hello, {user.email}</div>;
}
```

In addition to core and the `UserfrontProvider` properties, these are also available for use:

| Property          | Type    | Description                                                             |
| ----------------- | ------- | ----------------------------------------------------------------------- |
| `isAuthenticated` | boolean | Whether or not the current visitor is signed into a valid user account. |
| `isLoading`       | boolean | Whether or not Userfront has loaded and initialized.                    |

### Toolkit

[Userfront toolkit](https://www.npmjs.com/package/@userfront/toolkit) components are included in this package. Import and use them without any necessary additional props:

```javascript
import { LoginForm } from "@userfront/next/client";

export default function Component() {
  return <LoginForm />;
}
```

The available components are `LoginForm`, `SignupForm`, `PasswordResetForm` and `LogoutButton`.

## Server

Use `@userfront/next/server` on the server. These files or functions should have the `"use server";` directive.

### Environment Methods

Define these environment variables in your `.env` or however they are configured in your application:

```
USERFRONT_API_KEY="..."
USERFRONT_WORKSPACE_ID="..."
```

The SDK will use these variables when they are defined.

```javascript
"use server";

import { getWorkspace } from "@userfront/next/server";

// Get a user by uuid
const tenant = await getTenant("...");
```

### Using the Node Client

You may choose to instantiate the Node client instead, for example, when your secrets are retrieved asynchronously, if you're using a context, or if you prefer the greater abstraction. There are other debugging and error handling benefits as well.

```javascript
"use server";

import { UserfrontClient } from "@userfront/next/server";

const Userfront = new UserfrontClient({
  apiKey: "...",
  workspaceId: "...",
});

// Get a tenant by id
const tenant = await Userfront.getTenant("...");
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
import { UserfrontFetcherError } from "@userfront/next/server";

try {
  const user = await Userfront.getTenant("...");
} catch (error) {
  if (error instanceof UserfrontFetcherError) {
    // Handle the error
  }
}
```
