import * as React from "react";

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
import { useUserfront } from "./useUserfront";

type UserfrontHookArgs = Parameters<typeof useUserfront>[0];
type UserfrontContextType = ReturnType<typeof useUserfront>;

const UserfrontContext = React.createContext<UserfrontContextType | null>(null);

interface UserfrontProviderProps extends UserfrontHookArgs {
  children?: React.ReactNode;
}

/**
 * Context Provider
 */
function UserfrontProvider({ children, tenantId }: UserfrontProviderProps) {
  const value = useUserfront({ tenantId });

  return (
    <UserfrontContext.Provider value={value}>
      {children}
    </UserfrontContext.Provider>
  );
}

/**
 * External hook
 */
function useUserfrontContext() {
  const context = React.useContext(UserfrontContext);

  if (!context) {
    throw new Error("useUserfront must be used within an UserfrontProvider");
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
  useUserfrontContext as useUserfront,
  UserfrontProvider,
  type UserfrontProviderProps,
  type UserfrontContextType,
};
