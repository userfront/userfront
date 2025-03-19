/**
 * React wrappers for Userfront toolkit components
 */
import { type ComponentProps, forwardRef, type ElementRef } from "react";
import {
  LoginForm as LoginFormPrimitive,
  LogoutButton as LogoutButtonPrimitive,
  PasswordResetForm as PasswordResetFormPrimitive,
  SignupForm as SignupFormPrimitive,
} from "@userfront/toolkit/react";
import { useUserfront } from "./index";

const isServer = typeof window === "undefined";

/**
 * Signup Form
 */
type SignupFormProps = ComponentProps<typeof SignupFormPrimitive>;

const SignupForm = forwardRef<
  ElementRef<typeof SignupFormPrimitive>,
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
      // ref={ref}
      {...props}
      tenantId={tenantId}
      // redirect={signupRedirect}
      {...(requireAuth && { redirectOnLoadIfLoggedIn: loginRedirect })}
    />
  );
});

SignupForm.displayName = "UserfrontSignupForm";

/**
 * Login Form
 */
type LoginFormProps = ComponentProps<typeof LoginFormPrimitive>;

const LoginForm = forwardRef<
  ElementRef<typeof LoginFormPrimitive>,
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
      // ref={ref}
      {...props}
      tenantId={tenantId}
      // redirect={loginRedirect}
      {...(requireAuth && { redirectOnLoadIfLoggedIn: loginRedirect })}
    />
  );
});

LoginForm.displayName = "UserfrontLoginForm";

/**
 * Password Reset Form
 */
type PasswordResetFormProps = ComponentProps<typeof PasswordResetFormPrimitive>;

const PasswordResetForm = forwardRef<
  ElementRef<typeof PasswordResetFormPrimitive>,
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
      // ref={ref}
      {...props}
      tenantId={tenantId}
      // redirect={loginRedirect}
      {...(requireAuth && { redirectOnLoadIfLoggedIn: loginRedirect })}
    />
  );
});

PasswordResetForm.displayName = "UserfrontPasswordResetForm";

/**
 * Password Reset Form
 */
type LogoutButtonProps = ComponentProps<typeof LogoutButtonPrimitive>;

const LogoutButton = forwardRef<
  ElementRef<typeof LogoutButtonPrimitive>,
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
      // ref={ref}
      {...props}
      // tenantId={tenantId}
      // redirect={logoutRedirect}
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
};
