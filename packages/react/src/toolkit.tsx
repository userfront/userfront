import * as React from "react";
import {
  LoginForm as LoginFormPrimitive,
  LogoutButton as LogoutButtonPrimitive,
  PasswordResetForm as PasswordResetFormPrimitive,
  SignupForm as SignupFormPrimitive,
} from "@userfront/toolkit/react";

const isServer = typeof window === "undefined";

/**
 * Signup Form
 */
type SignupFormProps = React.ComponentProps<typeof SignupFormPrimitive>;

const SignupForm = React.forwardRef<
  React.ElementRef<typeof SignupFormPrimitive>,
  SignupFormProps
>((props, ref) => {
  if (isServer) {
    return null;
  }

  return <SignupFormPrimitive ref={ref} {...props} />;
});

SignupForm.displayName = "UserfrontSignupForm";

/**
 * Login Form
 */
type LoginFormProps = React.ComponentProps<typeof LoginFormPrimitive>;

const LoginForm = React.forwardRef<
  React.ElementRef<typeof LoginFormPrimitive>,
  LoginFormProps
>((props, ref) => {
  if (isServer) {
    return null;
  }

  return <LoginFormPrimitive ref={ref} {...props} />;
});

LoginForm.displayName = "UserfrontLoginForm";

/**
 * Password Reset Form
 */
type PasswordResetFormProps = React.ComponentProps<
  typeof PasswordResetFormPrimitive
>;

const PasswordResetForm = React.forwardRef<
  React.ElementRef<typeof PasswordResetFormPrimitive>,
  PasswordResetFormProps
>((props, ref) => {
  if (isServer) {
    return null;
  }

  return <PasswordResetFormPrimitive ref={ref} {...props} />;
});

PasswordResetForm.displayName = "UserfrontPasswordResetForm";

/**
 * Password Reset Form
 */
type LogoutButtonProps = React.ComponentProps<typeof LogoutButtonPrimitive>;

const LogoutButton = React.forwardRef<
  React.ElementRef<typeof LogoutButtonPrimitive>,
  LogoutButtonProps
>((props, ref) => {
  if (isServer) {
    return null;
  }

  return <LogoutButtonPrimitive ref={ref} {...props} />;
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
