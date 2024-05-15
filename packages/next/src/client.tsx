"use client";

import dynamic from "next/dynamic";

import {
  type SignupFormProps,
  type LoginFormProps,
  type PasswordResetFormProps,
  type LogoutButtonProps,
  type UserfrontContextType,
  UserfrontProvider,
  type UserfrontProviderProps,
  useUserfront,
} from "@userfront/react";

const SignupForm = dynamic<SignupFormProps>(
  () => import("@userfront/react").then((module) => module.SignupForm),
  {
    ssr: false,
  },
);

const LoginForm = dynamic<LoginFormProps>(
  () => import("@userfront/react").then((module) => module.LoginForm),
  {
    ssr: false,
  },
);

const PasswordResetForm = dynamic<PasswordResetFormProps>(
  () => import("@userfront/react").then((module) => module.PasswordResetForm),
  {
    ssr: false,
  },
);

const LogoutButton = dynamic<LogoutButtonProps>(
  () => import("@userfront/react").then((module) => module.LogoutButton),
  {
    ssr: false,
  },
);

export {
  type UserfrontContextType,
  UserfrontProvider,
  type UserfrontProviderProps,
  useUserfront,
  SignupForm,
  type SignupFormProps,
  LoginForm,
  type LoginFormProps,
  PasswordResetForm,
  type PasswordResetFormProps,
  LogoutButton,
  type LogoutButtonProps,
};
