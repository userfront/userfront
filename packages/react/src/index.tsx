import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  SignupForm,
  type SignupFormProps,
  LoginForm,
  type LoginFormProps,
  PasswordResetForm,
  type PasswordResetFormProps,
  LogoutButton,
  type LogoutButtonProps,
} from "./toolkit";
import { useIsomorphicLayoutEffect, useToggle } from "react-use";
import Userfront from "@userfront/toolkit/react";
// Fix for error TS2742: The inferred type of 'useUserfrontContext' cannot be named without a reference to '@userfront/core'. This is likely not portable. A type annotation is necessary.
import type * as _Userfront from "@userfront/core";

export type UserfrontInstance = Required<typeof Userfront>;

export interface UserfrontProviderProps {
  children?: ReactNode;
  /**
   * Tenant ID from Userfront (**required**)
   */
  tenantId: string;
  /**
   * Loading skeleton component
   */
  skeleton?: ReactNode | null;
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
  /**
   * Base URL for the Userfront API
   * If not set defaults to "https://api.userfront.com/v0/"
   */
  baseUrl?: string;
}

export type UserfrontContextType = UserfrontInstance &
  Omit<UserfrontProviderProps, "children"> & {
    isAuthenticated: boolean;
    isLoading: boolean;
  };

const UserfrontContext = createContext<UserfrontContextType | null>(null);

// Context Provider
export function UserfrontProvider({
  baseUrl,
  children,
  loginRedirect,
  loginUrl = "/login",
  logoutRedirect,
  requireAuth = true,
  signupRedirect,
  skeleton = null,
  tenantId,
}: UserfrontProviderProps) {
  const [userfront, setUserfront] = useState<UserfrontInstance>(Userfront);
  const [isLoading, setLoading] = useToggle(true);
  const [isAuthenticated, setAuthenticated] = useToggle(false);

  // Initialize Userfront
  useIsomorphicLayoutEffect(() => {
    if (!tenantId) return;

    (async () => {
      const opts = {
        baseUrl,
        userfrontSource: "userfront-react",
      };
      await Userfront.init(tenantId, opts);

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

  const value = useMemo(() => {
    return {
      tenantId,
      baseUrl,
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
  }, [
    isAuthenticated,
    isLoading,
    loginRedirect,
    loginUrl,
    logoutRedirect,
    requireAuth,
    signupRedirect,
    skeleton,
    tenantId,
    userfront,
    baseUrl
  ]);

  return (
    <UserfrontContext.Provider value={value}>
      {children}
    </UserfrontContext.Provider>
  );
}

// External hook
export function useUserfront() {
  const context = useContext(UserfrontContext);

  if (!context) {
    throw new Error("useUserfront must be used within a UserfrontProvider");
  }

  return context;
}

export {
  SignupForm,
  type SignupFormProps,
  LoginForm,
  type LoginFormProps,
  PasswordResetForm,
  type PasswordResetFormProps,
  LogoutButton,
  type LogoutButtonProps,
};
