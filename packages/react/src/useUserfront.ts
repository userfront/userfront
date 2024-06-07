import * as React from "react";
import { useIsomorphicLayoutEffect, useToggle } from "react-use";
import Userfront from "@userfront/toolkit/react";
// Fix for error TS2742: The inferred type of 'useUserfrontContext' cannot be named without a reference to '@userfront/core'. This is likely not portable. A type annotation is necessary.
import type * as _Userfront from "@userfront/core";

type UserfrontInstance = Required<typeof Userfront>;

interface UserfrontOptions {
  /**
   * Tenant ID from Userfront (**required**)
   */
  tenantId: string;
  /**
   * Loading skeleton component
   */
  skeleton?: React.ReactNode | null;
  /**
   * Redirect URL for unauthenticated visitors that need to login
   * @default "/login"
   */
  loginUrl?: string;
  /**
   * Redirect URL after login, set to `false` to disable.
   * When `undefined`, use the path configured to the workspace
   * [paths & routing settings](https://userfront.com/dashboard/paths)
   */
  loginRedirect?: string | boolean;
  /**
   * Redirect URL after signup, set to `false` to disable.
   * When `undefined`, use the path configured to the workspace
   * [paths & routing settings](https://userfront.com/dashboard/paths)
   */
  signupRedirect?: string | boolean;
  /**
   * Redirect URL after logout, set to `false` to disable.
   * When `undefined`, use the path configured to the workspace
   * [paths & routing settings](https://userfront.com/dashboard/paths)
   */
  logoutRedirect?: string | boolean;
  /**
   * Require authentication - unauthorized will redirect to `loginUrl` and authorized users will be redirected to `loginRedirect`
   * @default true
   */
  requireAuth?: boolean;
}

// Internal hook
export function useUserfront({
  tenantId,
  skeleton = null,
  loginUrl = "/login",
  loginRedirect,
  signupRedirect,
  logoutRedirect,
  requireAuth = true,
}: UserfrontOptions) {
  const [userfront, setUserfront] =
    React.useState<UserfrontInstance>(Userfront);
  const [isLoading, setLoading] = useToggle(true);
  const [isAuthenticated, setAuthenticated] = useToggle(false);

  // Initialize Userfront
  useIsomorphicLayoutEffect(() => {
    if (!tenantId) return;

    (async () => {
      await Userfront.init(tenantId);

      // Update the Userfront state
      setUserfront(Userfront);
      // Userfront is ready
      setLoading(false);
    })().catch(console.error);
  }, [tenantId]);

  // Update the authenticated state
  useIsomorphicLayoutEffect(() => {
    if (!userfront.user) return;

    if (userfront.user.email) {
      setAuthenticated(true);
    }
  }, [userfront.user]);

  return {
    tenantId,
    isAuthenticated,
    isLoading,
    skeleton,
    loginUrl,
    loginRedirect,
    signupRedirect,
    logoutRedirect,
    requireAuth,
    ...userfront,
  };
}
