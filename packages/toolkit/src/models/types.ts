import { MachineConfig } from "xstate";
// TYPES

// A factor, per the Userfront API
export type Factor = {
  channel: string;
  strategy: string;
  isConfiguredByUser?: boolean;
};

// An auth flow, per the Userfront API
export type Flow = {
  firstFactors: Factor[];
};

// An error object as returned by the Userfront API
export type FormError = {
  statusCode?: number | string;
  message: string;
  error: {
    type: string;
  };
};

// Types of form in the toolkit
export type FormType = "signup" | "login" | "reset";
export type SignOnFormType = "signup" | "login";

// Designates whether we are intended to set up or use factors at this time
export type FactorAction = "setup" | "use";

// Configuration data for the form - intended to be set either by the caller
// or during initial setup steps of the form, then fixed afterward.
export interface FormConfig {
  type: FormType;
  tenantId?: string;
  baseUrl?: string;
  flow?: Flow;
  mode?: string;
  // Is this in compact mode i.e. hide password behind a button
  compact: boolean;
  locale: string;
  // Should we fetch the tenant's default flow from the server,
  // even if a flow was provided inline?
  shouldFetchFlow: boolean;
  // Destination to redirect to if user is logged in, or false to disable redirect.
  redirect?: string | boolean;
  // If true, redirect to the after-login path if the user is already logged in on page load.
  redirectOnLoad?: boolean;
}

// Data about the user
export interface UserData {
  email: string;
  name?: string;
  username?: string;
  phoneNumber?: string;
  emailOrUsername?: string;
}

// TYPES FOR FACTORS

// Data common to forms for all factors
export interface CommonFormData { }

export interface EmailLink extends CommonFormData {
  type: "emailLink";
  message: string;
}

export interface EmailCode extends CommonFormData {
  type: "emailCode";
  verificationCode: string;
}

export interface SmsCode extends CommonFormData {
  type: "smsCode";
  phoneNumber: string;
  verificationCode: string;
}

export interface Password extends CommonFormData {
  type: "password";
  password: string;
}

export interface TotpCode extends CommonFormData {
  type: "totp";
  showEmailOrUsername: boolean;
  emailOrUsername?: string;
  totpCode: string;

  // Data for login
  backupCode?: string;
  useBackupCode?: boolean;

  // Data for signup
  qrCode?: string;
  backupCodes?: string[];
  allowedSecondFactors?: Factor[];
  isMfaRequired?: boolean;
}

export interface ResetPassword extends CommonFormData {
  type: "resetPassword";
}

// Factor selection needs to extend Password because
// the Password view could be inlined
export interface FirstFactors extends Password {
  compact: boolean;
}

export interface SecondFactors extends Password {
  compact: boolean;
}

export interface Message extends CommonFormData {
  type: "message";
  message: string;
}

export interface Loading extends CommonFormData {
  type: "loading";
}

export interface RequestPasswordReset extends CommonFormData {
  type: "requestPasswordReset";
  message: string;
}

export interface SetNewPassword extends CommonFormData {
  type: "password";
  password: string;
  existingPassword?: string;
}

// A utility type that encompasses all factors.
export type View =
  | EmailLink
  | EmailCode
  | SmsCode
  | Password
  | TotpCode
  | ResetPassword
  | FirstFactors
  | SecondFactors
  | Message
  | Loading;

export type Query = {
  token?: string;
  uuid?: string;
  linkType?: string;
  isValid?: boolean;
};

// The full context for the signup form state machine,
// with view data parameterized by the type of view we're
// currently on.
export interface AuthContext<ViewType> {
  // User data
  user: UserData;

  // Form config - fixed form state
  config: FormConfig;

  // View-specific data
  view: ViewType;

  // Transitory form state
  action: FactorAction;
  isSecondFactor: boolean;
  activeFactor?: Factor;
  allowedSecondFactors?: Factor[];
  allowBack: boolean;

  // Query params present, to be filled at start
  query: Query;

  // Current error (if any)
  error?: FormError;
}

// Utility type aliases for each view's context
export type AnyAuthContext = AuthContext<CommonFormData>;
export type EmailLinkContext = AuthContext<EmailLink>;
export type EmailCodeContext = AuthContext<EmailCode>;
export type SmsCodeContext = AuthContext<SmsCode>;
export type PasswordContext = AuthContext<Password>;
export type TotpCodeContext = AuthContext<TotpCode>;
export type FirstFactorsContext = AuthContext<FirstFactors>;
export type SecondFactorsContext = AuthContext<SecondFactors>;
export type LoadingContext = AuthContext<Loading>;
export type SetNewPasswordContext = AuthContext<SetNewPassword>;

// EVENT TYPES

// GENERAL SHARED EVENTS

export type BackEvent = {
  type: "back";
};

export type FinishEvent = {
  type: "finish";
};

export type ResendEvent = {
  type: "resend";
};

export type RetryEvent = {
  type: "retry";
};

// USERFRONT API EVENTS
// TODO: it would be best to use types from @userfront/core here

export type UserfrontApiDoneEvent = {
  type: "done";
  data: Object;
};

export type UserfrontApiFetchQrCodeEvent = {
  type: "done";
  data: {
    qrCode: string;
    backupCodes: string[];
  };
};

export type UserfrontApiGetTenantIdEvent = {
  type: "done";
  data: {
    tenantId?: string;
  };
};

export type UserfrontApiFetchFlowEvent = {
  type: "done";
  data: {
    authentication: Flow;
    mode: "live" | "test";
  };
};

export type UserfrontApiFactorResponseEvent = {
  type: "done";
  data: {
    isMfaRequired: boolean;
    authentication: {
      firstFactor: Factor;
      secondFactors: Factor[];
    };
  };
};

export type UserfrontApiErrorEvent = {
  type: "error";
  data: {
    error: FormError;
  };
};

// VIEW-SPECIFIC EVENTS

export type EmailSubmitEvent = {
  type: "submit";
  email: string;
  name?: string;
  username?: string;
};

export type CodeSubmitEvent = {
  type: "submit";
  verificationCode: string;
};

export type PasswordSubmitEvent = {
  type: "submit";
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
  username?: string;
  emailOrUsername?: string;
};

export type PhoneNumberSubmitEvent = {
  type: "submit";
  phoneNumber: string;
};

export type TotpCodeSubmitEvent = {
  type: "submit";
  totpCode?: string;
  backupCode?: string;
  emailOrUsername?: string;
};

export type UseBackupCodeEvent = {
  type: "useBackupCode";
  useBackupCode: boolean;
};

export type SelectFactorEvent = {
  type: "selectFactor";
  factor: Factor;
  isSecondFactor: boolean;
};

export type SetNewPasswordSubmitEvent = {
  type: "setNewPassword";
  password: string;
  confirmPassword: string;
  existingPassword?: string;
};

// All events used in the signup machine
export type AuthMachineEvent =
  | BackEvent
  | FinishEvent
  | ResendEvent
  | RetryEvent
  | UserfrontApiDoneEvent
  | UserfrontApiErrorEvent
  | EmailSubmitEvent
  | CodeSubmitEvent
  | PasswordSubmitEvent
  | PhoneNumberSubmitEvent
  | TotpCodeSubmitEvent
  | UseBackupCodeEvent
  | SelectFactorEvent
  | SetNewPasswordSubmitEvent;

// The full type of the signup machine's config
export type AuthMachineConfig = MachineConfig<
  AuthContext<View>,
  any,
  AuthMachineEvent
>;
