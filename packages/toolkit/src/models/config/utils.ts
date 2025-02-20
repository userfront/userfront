// CONSTANTS

import { isSsoProvider } from "./guards";
import { Factor } from "../types";

// List of all possible factors with:
// channel, strategy
// name = name of their node in the state machine
// testIs = predicate that returns true if another factor is equivalent to this one
// testOnlyFirst = predicate that returns true if this is the only first factor
// testOnlySecond = predicate that returns true if this is the only second factor
export const factorConfig = {
  emailLink: {
    channel: "email",
    strategy: "link",
    name: "emailLink",
    testIs: "isEmailLink",
    testOnlyFirst: "hasOnlyEmailLinkFirstFactor",
    testOnlySecond: "hasOnlyEmailLinkSecondFactor",
    viewContext: {
      type: "emailLink",
      message: "",
    },
  },
  emailCode: {
    channel: "email",
    strategy: "verificationCode",
    name: "emailCode",
    testIs: "isEmailCode",
    testOnlyFirst: "hasOnlyEmailCodeFirstFactor",
    testOnlySecond: "hasOnlyEmailCodeSecondFactor",
    viewContext: {
      type: "emailCode",
      code: "",
    },
  },
  smsCode: {
    channel: "sms",
    strategy: "verificationCode",
    name: "smsCode",
    testIs: "isSmsCode",
    testOnlyFirst: "hasOnlySmsCodeFirstFactor",
    testOnlySecond: "hasOnlySmsCodeSecondFactor",
    viewContext: {
      type: "smsCode",
      phoneNumber: "",
      code: "",
    },
  },
  password: {
    channel: "email",
    strategy: "password",
    name: "password",
    testIs: "isPassword",
    testOnlyFirst: "hasOnlyPasswordFirstFactor",
    testOnlySecond: "hasOnlyPasswordSecondFactor",
    viewContext: {
      type: "password",
      password: "",
    },
  },
  totp: {
    channel: "authenticator",
    strategy: "totp",
    name: "totpCode",
    testIs: "isTotp",
    testOnlyFirst: "hasOnlyTotpFirstFactor",
    testOnlySecond: "hasOnlyTotpSecondFactor",
    viewContext: {
      type: "totp",
      totpCode: "",
      showEmailOrUsername: false,

      // Properties for TOTP login
      useBackupCode: false,
      backupCode: "",

      // Properties for TOTP setup
      qrCode: "",
      backupCodes: [],
      isMfaRequired: false,
      allowedSecondFactors: [],
    },
  },
  ssoProvider: {
    channel: "email",
    // No strategy, since this represents several different strategies
    strategy: "",
    name: "ssoProvider",
    testIs: "isSsoProvider",
    testOnlyFirst: "hasOnlySsoProviderFirstFactor",
    testOnlySecond: "hasOnlySsoProviderSecondFactor",
    viewContext: {},
  },
};

// UTILITY FUNCTIONS

// Create a guard/predicate that checks if the given factor
// is the only possible factor. Checks first or second factor.
export const createOnlyFactorCondition = ({
  channel,
  strategy,
  secondFactor,
}: any) => {
  const factor = { channel, strategy };
  return (context: any) => {
    let onlyFactor;
    if (secondFactor) {
      onlyFactor = context.allowedSecondFactors?.[0];
    } else {
      onlyFactor = context.config.flow?.firstFactors[0];
    }
    return (
      onlyFactor.channel === factor.channel &&
      onlyFactor.strategy === factor.strategy
    );
  };
};

// Return true if a string is missing or empty.
export const isMissing = (str: any) => {
  return typeof str !== "string" || str.length === 0;
};

// Return true if a strong has any value.
export const hasValue = (str: any): str is string => {
  return typeof str === "string" && str.length > 0;
};

// Check to see if two factors are equivalent.
export const matchFactor = (a: Factor, b: Factor) => {
  return a.channel === b.channel && a.strategy === b.strategy;
};

// Get the correct target string for the given factor
export const getTargetForFactor = (factor: Factor) => {
  if (!factor) {
    return "";
  }
  if (isSsoProvider(factor)) {
    return "ssoProvider";
  }
  let target: keyof typeof factorConfig;
  for (target in factorConfig) {
    if (matchFactor(factor, factorConfig[target])) {
      return target;
    }
  }
  return "";
};

// Create an error object for the case where there's no auth flow
export const missingFlowError = (message: string) => ({
  statusCode: 0,
  message,
  error: {
    type: "missing_flow_error",
  },
});

// An unhandled error object
export const unhandledError = {
  statusCode: 0,
  message: "UNHANDLED ERROR",
  error: {
    type: "unhandled_error",
  },
};
