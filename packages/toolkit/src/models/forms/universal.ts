import { createMachine, assign } from "xstate";

import {
  AuthContext,
  SelectFactorEvent,
  Loading,
  AuthMachineConfig,
  View,
  AuthMachineEvent,
} from "../types";

import {
  callUserfront,
  callUserfrontSync,
  getUserfrontProperty,
} from "../../services/userfront";
import {
  createOnlyFactorCondition,
  matchFactor,
  factorConfig,
  missingFlowError,
  unhandledError,
} from "../config/utils";
import passwordConfig from "../views/password";
import selectFactorConfig from "../views/selectFactor";
import totpCodeConfig from "../views/totpCode";
import setUpTotpConfig from "../views/setUpTotp";
import smsCodeConfig from "../views/smsCode";
import emailCodeConfig from "../views/emailCode";
import emailLinkConfig from "../views/emailLink";
import setNewPasswordConfig from "../views/setNewPassword";
import {
  hasLinkQueryParams,
  hasNoActiveFactor,
  isLocalMode,
  isLocalModeWithoutFlow,
  isLoggedIn,
  isLoggedInOrHasLinkCredentials,
  isMissingFlow,
  isMissingFlowFromServer,
  isMissingTenantId,
  isPasswordReset,
  isSecondFactor,
  isSetup,
  isSsoProvider,
  passwordsMatch,
  secondFactorRequired,
  secondFactorRequiredFromView,
} from "../config/guards";
import {
  setActiveFactor,
  resumeIfNeeded,
  setFlowFromUserfrontApi,
  setEmail,
  setPassword,
  setPhoneNumber,
  setTenantIdIfPresent,
  setTotpCode,
  setUseBackupCode,
  setQrCode,
  redirectIfLoggedIn,
  redirectOnLoad,
  setCode,
  setErrorFromApiError,
  clearError,
  setErrorForPasswordMismatch,
  setShowEmailOrUsernameIfFirstFactor,
  markAsSecondFactor,
  setAllowedSecondFactors,
  setAllowedSecondFactorsFromView,
  storeFactorResponse,
  disableBack,
  enableBack,
  setupView,
  readQueryParams,
  markQueryParamsInvalid,
  setResentMessage,
  clearResentMessage,
  setFirstFactorAction,
  setSecondFactorAction,
  setPasswordForReset,
} from "../config/actions";

// UNIVERSAL FORM MACHINE CONFIG
// The universal form can act as a signup, login, or password reset form
// (Password reset includes both requesting a reset email and setting a new password)

// Options: provide the guards and actions for the state machine as
// a separate object, so we can override them as needed for testing.
export const defaultOptions = {
  guards: {
    // Predicates for first factors:
    // Does the flow have multiple first factors?
    hasMultipleFirstFactors: (context: AuthContext<any>, event: any) => {
      const firstFactors = context.config.flow?.firstFactors ?? [];
      return firstFactors.length > 1;
    },
    hasNoFirstFactors: (context: AuthContext<any>) => {
      const firstFactors = context.config.flow?.firstFactors ?? [];
      return firstFactors.length === 0;
    },
    // Is the flow only one factor? One predicate per factor type.
    // If there's only one allowed factor, allows us to skip the select screen
    // and proceed directly to that factor.
    hasOnlyEmailLinkFirstFactor: createOnlyFactorCondition({
      channel: "email",
      strategy: "link",
    }),
    hasOnlyEmailCodeFirstFactor: createOnlyFactorCondition({
      channel: "email",
      strategy: "verificationCode",
    }),
    hasOnlySmsCodeFirstFactor: createOnlyFactorCondition({
      channel: "sms",
      strategy: "verificationCode",
    }),
    hasOnlyPasswordFirstFactor: createOnlyFactorCondition({
      channel: "email",
      strategy: "password",
    }),
    hasOnlyTotpFirstFactor: createOnlyFactorCondition({
      channel: "authenticator",
      strategy: "totp",
    }),
    hasOnlySsoFirstFactor: (context: AuthContext<any>) => {
      const factor = context.config.flow?.firstFactors[0];
      if (!factor) {
        return false;
      }
      return isSsoProvider(factor);
    },

    // Predicates for second factors
    // Identical to the first factor predicates
    hasMultipleSecondFactors: (context: AuthContext<any>, event: any) => {
      return (context.allowedSecondFactors?.length ?? 0) > 1;
    },
    // Is the flow only one factor? One predicate per factor type.
    // If there's only one allowed factor, allows us to skip the select screen
    // and proceed directly to that factor.
    hasOnlyEmailLinkSecondFactor: createOnlyFactorCondition({
      channel: "email",
      strategy: "link",
      secondFactor: true,
    }),
    hasOnlyEmailCodeSecondFactor: createOnlyFactorCondition({
      channel: "email",
      strategy: "verificationCode",
      secondFactor: true,
    }),
    hasOnlySmsCodeSecondFactor: createOnlyFactorCondition({
      channel: "sms",
      strategy: "verificationCode",
      secondFactor: true,
    }),
    hasOnlyPasswordSecondFactor: createOnlyFactorCondition({
      channel: "email",
      strategy: "password",
      secondFactor: true,
    }),
    hasOnlyTotpSecondFactor: createOnlyFactorCondition({
      channel: "authenticator",
      strategy: "totp",
      secondFactor: true,
    }),
    hasOnlySsoSecondFactor: (context: AuthContext<any>) => {
      const factor = context.allowedSecondFactors?.[0];
      if (!factor) {
        return false;
      }
      return isSsoProvider(factor);
    },

    // Predicates for matching factors
    isEmailLink: (_1: any, event: SelectFactorEvent) => {
      return matchFactor(event.factor, factorConfig.emailLink);
    },
    isEmailCode: (_1: any, event: SelectFactorEvent) => {
      return matchFactor(event.factor, factorConfig.emailCode);
    },
    isSmsCode: (_1: any, event: SelectFactorEvent) => {
      return matchFactor(event.factor, factorConfig.smsCode);
    },
    isPassword: (_1: any, event: SelectFactorEvent) => {
      return matchFactor(event.factor, factorConfig.password);
    },
    isTotp: (_1: any, event: SelectFactorEvent) => {
      return matchFactor(event.factor, factorConfig.totp);
    },
    isSsoProvider: (_1: any, event: SelectFactorEvent) => {
      return isSsoProvider(event.factor);
    },

    hasLinkQueryParams,
    hasNoActiveFactor,
    isLocalMode,
    isLocalModeWithoutFlow,
    isLoggedIn,
    isLoggedInOrHasLinkCredentials,
    isMissingFlow,
    isMissingFlowFromServer,
    isMissingTenantId,
    isPasswordReset,
    isSecondFactor,
    isSetup,
    passwordsMatch,
    secondFactorRequired,
    secondFactorRequiredFromView,
  },
  actions: {
    clearError,
    clearResentMessage,
    disableBack,
    enableBack,
    markAsSecondFactor,
    markQueryParamsInvalid,
    readQueryParams,
    redirectIfLoggedIn,
    redirectOnLoad,
    resumeIfNeeded,
    setActiveFactor,
    setAllowedSecondFactors,
    setAllowedSecondFactorsFromView,
    setCode,
    setEmail,
    setErrorForPasswordMismatch,
    setErrorFromApiError,
    setFirstFactorAction,
    setFlowFromUserfrontApi,
    setPassword,
    setPasswordForReset,
    setPhoneNumber,
    setQrCode,
    setResentMessage,
    setSecondFactorAction,
    setShowEmailOrUsernameIfFirstFactor,
    setTenantIdIfPresent,
    setTotpCode,
    setupView,
    setUseBackupCode,
    storeFactorResponse,
  },
};

export const defaultAuthContext = {
  user: {
    email: "",
  },
  config: {
    flow: null,
    tenantId: null,
    shouldFetchFlow: true,
    mode: "live",
    compact: false,
    locale: "en-US",
    type: "login",
    action: "use",
  },
  view: {} as Loading,
  isSecondFactor: false,
};

const universalMachineConfig: AuthMachineConfig = {
  schema: {
    context: {} as AuthContext<View>,
    events: {} as AuthMachineEvent,
  },
  id: "universal",
  predictableActionArguments: true,
  initial: "init",
  states: {
    // Go back to the previous factor selection screen.
    backToFactors: {
      id: "backToFactors",
      always: [
        {
          target: "selectSecondFactor",
          cond: "isSecondFactor",
        },
        {
          target: "selectFirstFactor",
        },
      ],
    },

    // Initial state
    // Start the loading process
    init: {
      always: [
        // If no tenant ID is provided inline or as a prop,
        // then get it from the global Userfront instance
        {
          target: "getGlobalTenantId",
          cond: "isMissingTenantId",
        },
        {
          target: "initUserfront",
        },
      ],
    },

    // Get the tenant ID from the global Userfront instance
    getGlobalTenantId: {
      invoke: {
        // @ts-ignore
        src: () => getUserfrontProperty("store.tenantId"),
        // Set the tenant ID if one was present, otherwise set isDevMode = true.
        // Then proceed to start the flow.
        onDone: [
          {
            target: "initFlow",
            actions: "setTenantIdIfPresent",
          },
        ],
        onError: [
          {
            target: "initFlow",
            actions: "setTenantIdIfPresent",
          },
        ],
      },
    },

    // If Userfront.init hasn't been called yet and we're given a tenant ID, call init
    initUserfront: {
      invoke: {
        // @ts-ignore
        src: async (context) => {
          // @ts-ignore
          callUserfrontSync({
            method: "init",
            args: [
              context.config.tenantId!,
              { options: { userfrontSource: "toolkit" } },
            ],
          });
          return context.config.tenantId;
        },

        // Proceed to initFlow no matter the result.
        // Userfront.init isn't expected to throw.
        onDone: [
          {
            target: "initFlow",
            actions: "setTenantIdIfPresent",
          },
        ],
        onError: [
          {
            target: "initFlow",
            actions: "setTenantIdIfPresent",
          },
        ],
      },
    },

    // Start form-specific initialization
    initFlow: {
      // If there are uuid and token query params, add them to the context
      entry: ["readQueryParams"],
      always: [
        // If this is a password reset form, proceed
        {
          target: "initPasswordReset",
          cond: "isPasswordReset",
        },
        // This is a signup or login form, do shared initialization

        // If there's already a user refresh their tokens, proceed.
        {
          target: "initRefreshTokens",
          cond: "isLoggedIn",
        },

        // If shouldFetchFlow = false but we don't have a flow, we can't proceed.
        // Report the error.
        {
          target: "missingFlowInLocalModeError",
          cond: "isLocalModeWithoutFlow",
        },

        // If shouldFetchFlow = true and we don't have a flow, then show a placeholder,
        // and fetch the flow from Userfront.
        {
          target: "showPlaceholderAndFetchFlow",
          cond: "isMissingFlow",
        },

        // If we have a flow and shouldFetchFlow = false, proceed to the form's first step.
        {
          target: "beginFlow",
          cond: "isLocalMode",
        },

        // If we have a flow and shouldFetchFlow = true, proceed to a preview of the first step;
        // the preview won't proceed to a specific factor.
        {
          target: "showPreviewAndFetchFlow",
        },
      ],
    },

    initRefreshTokens: {
      always: [
        // Try to use the query params if they exist
        {
          target: "handleLoginWithLink",
          cond: "hasLinkQueryParams",
        },
        // If no query params, proceed refreshing tokens
        {
          target: "refreshTokens",
        },
      ],
    },

    refreshTokens: {
      invoke: {
        // Update the tokens
        // @ts-ignore - TS doesn't infer all of the valid methods correctly
        src: () => callUserfront({ method: "refresh" }),

        onDone: {
          target: "alreadyLoggedIn",
        },
        onError: {
          target: "alreadyLoggedIn",
        },
      },
    },

    // This is a login or signup form, but we're already logged in.
    // Show a message, and redirect if config.redirectOnLoad !== false.
    alreadyLoggedIn: {
      entry: ["redirectOnLoad"],
      id: "alreadyLoggedIn",
      type: "final",
    },

    // Initialize the password reset flow -
    // Choose "set new password" if the user is logged in or link credentials are in query params,
    // "request password reset" otherwise.
    initPasswordReset: {
      invoke: {
        // Retrieve mode from userfront-core
        // @ts-ignore - TS doesn't infer all of the valid methods correctly
        src: () => callUserfront({ method: "setMode" }),

        // Recoverable; proceed without resetting mode
        onError: [
          {
            target: "setNewPassword",
            cond: "isLoggedInOrHasLinkCredentials",
          },
          // Request password reset = email link with a different title
          {
            target: "emailLink",
          },
        ],

        onDone: [
          {
            target: "setNewPassword",
            cond: "isLoggedInOrHasLinkCredentials",
            actions: "setFlowFromUserfrontApi",
          },
          // Request password reset = email link with a different title
          {
            target: "emailLink",
            actions: "setFlowFromUserfrontApi",
          },
        ],
      },
    },

    // Show and run the "set new password" flow
    setNewPassword: setNewPasswordConfig,

    // Show the placeholder while fetching the flow from Userfront servers.
    showPlaceholderAndFetchFlow: {
      invoke: {
        // Will retrieve mode & flow after userfront-core update
        // @ts-ignore - TS doesn't infer all of the valid methods correctly
        src: () => callUserfront({ method: "setMode" }),
        // On failure, report an error.
        onError: {
          target: "missingFlowFromServerError",
        },
        // On success, proceed to the first step
        onDone: [
          {
            target: "beginFlow",
            actions: "setFlowFromUserfrontApi",
          },
        ],
      },
    },

    // Show a partially functional preview based on the locally provided flow
    // while fetching the updated flow from Userfront servers
    showPreviewAndFetchFlow: {
      invoke: {
        // Will retrieve mode & flow after userfront-core update
        // @ts-ignore
        src: () => callUserfront({ method: "setMode" }),
        // Report errors.
        onError: {
          target: "missingFlowFromServerError",
        },
        // On success, if the user hasn't selected a factor, then proceed as normal.
        // If the user has selected a factor, proceed directly to that factor's view.
        onDone: [
          {
            target: "beginFlow",
            cond: "hasNoActiveFactor",
            actions: "setFlowFromUserfrontApi",
          },
          {
            actions: ["setFlowFromUserfrontApi", "resumeIfNeeded"],
          },
        ],
      },
      on: {
        // When the user selects a factor, store it so we can proceed to it after
        // the updated flow is fetched.
        selectFactor: {
          actions: "setActiveFactor",
        },
      },
    },

    // Report possible errors from initialization
    missingFlowInLocalModeError: {
      entry: assign({ error: missingFlowError("Missing flow in local mode") }),
    },
    missingFlowFromServerError: {
      entry: assign({ error: missingFlowError("Missing flow from server") }),
    },
    unhandledError: {
      id: "unhandledError",
      entry: assign({ error: unhandledError }),
    },

    // Start the signup or login flow
    beginFlow: {
      entry: [
        // At this point the Userfront singleton is fully initialized, so we should
        // try to redirect if the user is logged in and config.redirectOnLoad !== false.
        "redirectOnLoad",

        // Set the appropriate action for first factors for this form.
        // Login form = use
        // Signup form = setup
        "setFirstFactorAction",

        // Setup the view
        "setupView",
      ],
      always: [
        // If we're returning from a passwordless/email link or SSO first factor, attempt to use
        // the query params to proceed.
        {
          target: "handleLoginWithLink",
          cond: "hasLinkQueryParams",
        },
        // Handle no first factors
        {
          target: "noFirstFactors",
          cond: "hasNoFirstFactors",
        },
        // If there are multiple first factors, then show the factor selection view
        {
          actions: "enableBack",
          target: "selectFirstFactor",
          cond: "hasMultipleFirstFactors",
        },
        // If the only first factor(s) are SSO providers, then show the factor selection view,
        // since it doubles as a "use SSO provider" view
        {
          target: "selectFirstFactor",
          cond: "hasOnlySsoFirstFactor",
        },
        // If a factor other than SSO is the only first factor, proceed directly to its view.
        ...Object.values(factorConfig).map((factor) => ({
          actions: "disableBack",
          target: factor.name,
          cond: factor.testOnlyFirst,
        })),
        // NOTE: this should be exhaustive; if we fall through to here without finding a next step,
        // that means that the only first factor in the flow is one we don't recognize.

        // Duplicates, should never be reached.
        // Only here to help out the XState visualizer.
        // Uncomment if using the visualizer.

        // {
        //   actions: "disableBack",
        //   target: "emailLink",
        //   cond: "hasOnlyEmailLinkFirstFactor",
        // },
        // {
        //   actions: "disableBack",
        //   target: "emailCode",
        //   cond: "hasOnlyEmailCodeFirstFactor",
        // },
        // {
        //   actions: "disableBack",
        //   target: "smsCode",
        //   cond: "hasOnlySmsCodeFirstFactor",
        // },
        // {
        //   actions: "disableBack",
        //   target: "password",
        //   cond: "hasOnlyPasswordFirstFactor",
        // },
        // {
        //   actions: "disableBack",
        //   target: "totpCode",
        //   cond: "hasOnlyTotpFirstFactor",
        // },

        // Error: if we get this far, it's an unhandled situation
        {
          target: "unhandledError",
        },
      ],
    },

    // Show the disabled view if there are no first factors
    noFirstFactors: {
      id: "noFirstFactors",
      always: [
        {
          target: "disabled",
        },
      ],
    },

    // Show the disabled error view
    disabled: {
      id: "disabled",
      type: "final",
    },

    // Show the first factor selection view, non-compact
    // Parallel states for the Password view and the rest of the form
    selectFirstFactor: selectFactorConfig,
    // The various factors' nested machines
    emailLink: emailLinkConfig,
    emailCode: emailCodeConfig,
    smsCode: smsCodeConfig,
    password: passwordConfig,
    totpCode: {
      id: "totpCode",
      always: [
        {
          target: "setUpTotp",
          cond: "isSetup",
        },
        {
          target: "useTotpCode",
        },
      ],
    },
    useTotpCode: totpCodeConfig,
    setUpTotp: setUpTotpConfig,
    // Start an SSO provider login flow
    ssoProvider: {
      id: "ssoProvider",
      invoke: {
        src: (context: any, event: any) => {
          return callUserfront({
            method: "login",
            args: [
              {
                method: event.factor?.strategy,
                redirect: context.config?.redirect,
              },
            ],
          });
        },
        // At this point we should have already redirected to the SSO provider.
        // If the API call returned an error, report it. Otherwise, not much we can do here.
        onError: {
          target: "unhandledError",
        },
      },
    },

    // Handle an incoming login link, using its query parameters to continue the login flow
    handleLoginWithLink: {
      id: "handleLoginWithLink",
      invoke: {
        src: (context) => {
          return callUserfront({
            method: "login",
            args: [
              {
                method: "link",
                token: context.query.token,
                uuid: context.query.uuid,
                linkType: context.query.linkType,
                redirect: context.config?.redirect,
              },
            ],
          });
        },
        onDone: [
          // If we need to enter a second factor, proceed to that step
          // TODO NEW/CHANGE setAllowedSecondFactors -> set action too
          {
            actions: "setAllowedSecondFactors",
            target: "beginSecondFactor",
            cond: "secondFactorRequired",
          },
          // Otherwise, we're logged in
          {
            target: "finish",
          },
        ],
        onError: [
          // If logged in go to refresh tokens
          {
            target: "refreshTokens",
            cond: "isLoggedIn",
          },
          // If there was a problem logging in with the link token and uuid,
          // go back to first factor selection and show the error.
          // Mark the query params invalid, so we don't infinitely retry them.
          {
            actions: ["setErrorFromApiError", "markQueryParamsInvalid"],
            target: "beginFlow",
          },
        ],
      },
    },

    // Check to see if a second factor is needed, and if so, determine whether we are
    // using or setting up the second factor, then proceed to the appropriate view
    beginSecondFactor: {
      id: "beginSecondFactor",
      entry: ["setSecondFactorAction", "setupView"],
      always: [
        // If a second factor isn't needed, finish the flow.
        {
          target: "finish",
          cond: "isLoggedIn",
        },
        // These are identical to the first factor cases:
        // If there's multiple possible second factors, proceed to factor selection
        {
          actions: ["enableBack", "markAsSecondFactor"],
          target: "selectSecondFactor",
          cond: "hasMultipleSecondFactors",
        },
        // If there's only SSO providers as second factors (?!?), proceed to factor selection
        {
          actions: "markAsSecondFactor",
          target: "selectSecondFactor",
          cond: "hasOnlySsoSecondFactor",
        },
        // Otherwise, if there's only one second factor, show that factor's view
        ...Object.values(factorConfig).map((factor) => ({
          actions: ["disableBack", "markAsSecondFactor"],
          target: factor.name,
          cond: factor.testOnlySecond,
        })),

        // Duplicates, should never be reached.
        // Only here to help out the XState visualizer.
        // Uncomment if using the visualizer.

        // {
        //   actions: ["disableBack", "markAsSecondFactor"],
        //   target: "emailLink",
        //   cond: "hasOnlyEmailLinkSecondFactor",
        // },
        // {
        //   actions: ["disableBack", "markAsSecondFactor"],
        //   target: "emailCode",
        //   cond: "hasOnlyEmailCodeSecondFactor",
        // },
        // {
        //   actions: ["disableBack", "markAsSecondFactor"],
        //   target: "smsCode",
        //   cond: "hasOnlySmsCodeSecondFactor",
        // },
        // {
        //   actions: ["disableBack", "markAsSecondFactor"],
        //   target: "password",
        //   cond: "hasOnlyPasswordSecondFactor",
        // },
        // {
        //   actions: ["disableBack", "markAsSecondFactor"],
        //   target: "totpCode",
        //   cond: "hasOnlyTotpSecondFactor",
        // },

        // If we get here, it's an unhandled error
        {
          target: "unhandledError",
        },
      ],
    },
    selectSecondFactor: selectFactorConfig,
    // Finish the flow.
    // Show a confirmation view in case we don't redirect
    finish: {
      id: "finish",
      type: "final",
    },
  },
};

// Create a state machine for the universal auth form
const createUniversalMachine = (
  initialContext: AuthContext<View>,
  options: any = {}
) => {
  const machine = createMachine(universalMachineConfig, {
    ...defaultOptions,
    ...options,
  }).withContext(initialContext);
  return machine;
};

export default createUniversalMachine;
