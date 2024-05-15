/**
 * React wrappers for Userfront toolkit components
 */
import * as React from "react";
import {
  LoginForm as LoginFormPrimitive,
  LogoutButton as LogoutButtonPrimitive,
  PasswordResetForm as PasswordResetFormPrimitive,
  SignupForm as SignupFormPrimitive,
} from "@userfront/toolkit/react";
import { useUserfront } from "./index";

const isServer = typeof window === "undefined";

interface ToolkitProps {
  compact?: boolean;
}

/**
 * Signup Form
 */
type SignupFormProps = ToolkitProps;

const SignupForm = React.forwardRef<
  React.ElementRef<typeof SignupFormPrimitive>,
  SignupFormProps
>((props, ref) => {
  const {
    tenantId,
    isLoading,
    skeleton,
    signupRedirect,
    loginRedirect,
    requireAuth,
  } = useUserfront();

  if (isServer) {
    return null;
  }

  if (isLoading) {
    return skeleton;
  }

  return (
    <SignupFormPrimitive
      ref={ref}
      {...props}
      tenantId={tenantId}
      redirect={signupRedirect}
      {...(requireAuth && { redirectOnLoadIfLoggedIn: loginRedirect })}
    />
  );
});

SignupForm.displayName = "UserfrontSignupForm";

/**
 * Login Form
 */
type LoginFormProps = ToolkitProps;

const LoginForm = React.forwardRef<
  React.ElementRef<typeof LoginFormPrimitive>,
  LoginFormProps
>((props, ref) => {
  const { tenantId, isLoading, skeleton, loginRedirect, requireAuth } =
    useUserfront();

  if (isServer) {
    return null;
  }

  if (isLoading) {
    return skeleton;
  }

  return (
    <LoginFormPrimitive
      ref={ref}
      {...props}
      tenantId={tenantId}
      redirect={loginRedirect}
      {...(requireAuth && { redirectOnLoadIfLoggedIn: loginRedirect })}
    />
  );
});

LoginForm.displayName = "UserfrontLoginForm";

/**
 * Password Reset Form
 */
type PasswordResetFormProps = ToolkitProps;

const PasswordResetForm = React.forwardRef<
  React.ElementRef<typeof PasswordResetFormPrimitive>,
  PasswordResetFormProps
>((props, ref) => {
  const { tenantId, isLoading, skeleton, loginRedirect, requireAuth } =
    useUserfront();

  if (isServer) {
    return null;
  }

  if (isLoading) {
    return skeleton;
  }

  return (
    <PasswordResetFormPrimitive
      ref={ref}
      {...props}
      tenantId={tenantId}
      redirect={loginRedirect}
      {...(requireAuth && { redirectOnLoadIfLoggedIn: loginRedirect })}
    />
  );
});

PasswordResetForm.displayName = "UserfrontPasswordResetForm";

/**
 * Password Reset Form
 */
type LogoutButtonProps = ToolkitProps;

const LogoutButton = React.forwardRef<
  React.ElementRef<typeof LogoutButtonPrimitive>,
  LogoutButtonProps
>((props, ref) => {
  const { tenantId, isLoading, skeleton, logoutRedirect } = useUserfront();

  if (isServer) {
    return null;
  }

  if (isLoading) {
    return skeleton;
  }

  return (
    <LogoutButtonPrimitive
      ref={ref}
      {...props}
      tenantId={tenantId}
      redirect={logoutRedirect}
    />
  );
});

LogoutButton.displayName = "UserfrontLogoutButton";

export {
  SignupForm,
  type SignupFormProps,
  LoginForm,
  type LoginFormProps,
  PasswordResetForm,
  type PasswordResetFormProps,
  LogoutButton,
  type LogoutButtonProps,
  type ToolkitProps,
};
