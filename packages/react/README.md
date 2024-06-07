<p align="center">
  <a href="https://userfront.com">
    <img src="https://raw.githubusercontent.com/userfront/userfront/main/logo.png" width="160">
  </a>
</p>

# React SDK

The Userfront React SDK is a fast and easy way to use Userfront in your JavaScript or TypeScript React application.

For Node.js support on the server, see [@userfront/node](https://www.npmjs.com/package/@userfront/node).

For Next.js support on the server and client, see [@userfront/next](https://www.npmjs.com/package/@userfront/next).

## Requirements

- React v18 or later

## Installation

```sh
npm install @userfront/react
# or
yarn add @userfront/react
# or
pnpm add @userfront/react
```

Add the `UserfrontProvider` with your desired `tenantId` to the root layout of your application.

```javascript
import { UserfrontProvider } from "@userfront/react";

function Layout({ children }) {
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

## Usage

### Hook

Use the `useUserfront()` hook to access [Userfront core](https://www.npmjs.com/package/@userfront/core) and the current client auth state.

```javascript
import { useUserfront } from "@userfront/react";

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
import { LoginForm } from "@userfront/react";

export default function Component() {
  return <LoginForm />;
}
```

The available components are `LoginForm`, `SignupForm`, `PasswordResetForm` and `LogoutButton`.
