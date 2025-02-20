import {
  Factor,
  AuthContext,
  TotpCodeContext,
  Password,
  PasswordSubmitEvent,
  UserfrontApiFactorResponseEvent,
  UserfrontApiErrorEvent,
  View,
  UserfrontApiFetchFlowEvent,
} from "../types";
import { isMissing } from "./utils";
import { getUserfrontPropertySync } from "../../services/userfront";

// GUARDS / PREDICATES

const ssoStrategies = [
  "apple",
  "azure",
  "google",
  "github",
  "twitter",
  "facebook",
  "linkedin",
  "okta",
];

// Is this factor an SSO provider?
export const isSsoProvider = (factor: Factor) =>
  factor.channel === "email" && ssoStrategies.includes(factor.strategy);

// Is a second factor required to complete the signup or login?
export const secondFactorRequired = (
  context: AuthContext<any>,
  event: UserfrontApiFactorResponseEvent
) => {
  return !!event.data?.isMfaRequired;
};

// Same as above, but check against the view context,
// for views that don't proceed directly from API call
// to second factor selection
export const secondFactorRequiredFromView = (context: TotpCodeContext) => {
  return context.view.isMfaRequired;
};

export const isSecondFactor = (context: AuthContext<View>) => {
  return context.isSecondFactor;
};

// Do the "password" and "confirm password" fields match?
// (One of the few validations done locally.)
export const passwordsMatch = (
  context: AuthContext<Password>,
  event: PasswordSubmitEvent
) => {
  if (context.action === "use") {
    return true;
  }
  return event.password === event.confirmPassword;
};

// Guard that always succeeds, for guards that aren't relevant in a certain context
export const alwaysSucceed = () => true;

// Is the tenantId absent?
export const isMissingTenantId = (context: AuthContext<any>) =>
  isMissing(context.config.tenantId);

// Are we in local mode (shouldFetchFlow = false) without a flow set locally?
// This is an error state.
export const isLocalModeWithoutFlow = (context: AuthContext<any>) => {
  return !context.config.shouldFetchFlow && context.config.flow == null;
};

// Is the auth flow absent from the context?
export const isMissingFlow = (context: AuthContext<any>) => {
  return context.config.flow == null;
};

// Given an event that may contain the flow from the server,
// is there a flow from the server OR a flow set locally?
export const isMissingFlowFromServer = (
  context: AuthContext<any>,
  event: UserfrontApiFetchFlowEvent
) => {
  const firstFactors = event.data?.authentication?.firstFactors;
  if (!Array.isArray(firstFactors) || firstFactors.length === 0) {
    return isMissingFlow(context);
  }
  return false;
};

// Is the form in local mode (shouldFetchFlow = false)?
export const isLocalMode = (context: AuthContext<any>) => {
  return !context.config.shouldFetchFlow;
};

// Is there currently no factor selected for the form?
export const hasNoActiveFactor = (context: AuthContext<any>) =>
  context.activeFactor == null;

// Are we returning to the signup/login form after clicking a passwordless email link?
// If so, we need to check if a second factor is required to log in.
export const hasLinkQueryParams = (context: AuthContext<any>) => {
  // TODO better off in userfront-core?
  return !!(context.query?.token && context.query?.uuid);
};

export const isLoggedIn = () => {
  // TypeScript doesn't recognize that this is Userfront.tokens which is an object
  // @ts-ignore
  return !!getUserfrontPropertySync("tokens")?.accessToken;
};

export const isLoggedInOrHasLinkCredentials = (context: AuthContext<any>) => {
  return isLoggedIn() || hasLinkQueryParams(context);
};

export const isLoggedInAndInvalidLinkCredentials = (
  context: AuthContext<any>
) => {
  const validQueryParams =
    hasLinkQueryParams(context) && context.query?.isValid;
  return isLoggedIn() && !validQueryParams;
};

export const isPasswordReset = (context: AuthContext<any>) => {
  return context.config.type === "reset";
};

export const isSetup = (context: AuthContext<any>) => {
  return context.action === "setup";
};
