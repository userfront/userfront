import { assign, send, actions } from "xstate";
const choose = actions.choose;
import {
  UserfrontApiErrorEvent,
  AuthContext,
  View,
  SelectFactorEvent,
  CommonFormData,
  EmailSubmitEvent,
  EmailCodeContext,
  SmsCodeContext,
  CodeSubmitEvent,
  PasswordContext,
  PasswordSubmitEvent,
  PhoneNumberSubmitEvent,
  TotpCodeContext,
  UserfrontApiFetchQrCodeEvent,
  TotpCodeSubmitEvent,
  UserfrontApiFactorResponseEvent,
  UserfrontApiGetTenantIdEvent,
  UserfrontApiFetchFlowEvent,
  UseBackupCodeEvent,
  Factor,
  EmailLinkContext,
  FactorAction,
  SetNewPasswordContext,
  SetNewPasswordSubmitEvent,
} from "../types";
import { getTargetForFactor, factorConfig, hasValue } from "./utils";
// @ts-ignore
import { callUserfront } from "../../services/userfront";

// Clear the current error message, if any
export const clearError = assign({ error: undefined });

// Set the error message from a Userfront API error
export const setErrorFromApiError = assign({
  error: (context, event: UserfrontApiErrorEvent) => event.data,
});

// Create & set the error message for a password mismatch (password !== confirmPassword)
export const setErrorForPasswordMismatch = assign({
  error: {
    statusCode: 0,
    message: "The passwords don't match. Please re-enter your password.",
    error: {
      type: "password_mismatch_error",
    },
  },
});

// Disable back actions
export const disableBack = assign({
  allowBack: false,
});

// Enable back actions
export const enableBack = assign({
  allowBack: true,
});

// Safely read a query param.
function getQueryAttr(attrName: string): string {
  if (
    typeof window !== "object" ||
    typeof window.location !== "object" ||
    !window.location.href ||
    window.location.href.indexOf(`${attrName}=`) < 0
  ) {
    return "";
  }
  return decodeURIComponent(
    window.location.href.split(`${attrName}=`)[1].split("&")[0]
  );
}

// Transfer the uuid and token query params to context, if present
export const readQueryParams = assign((context: AuthContext<View>) => {
  // If query has been marked invalid, don't reset it to valid
  if (context.query?.isValid === false) {
    return {};
  }
  const uuid = getQueryAttr("uuid");
  const token = getQueryAttr("token");
  const linkType = getQueryAttr("type");
  return {
    query: {
      uuid,
      token,
      linkType,
      isValid: true,
    },
  };
});

// Clear out query params, for example if they turn out to be invalid
export const markQueryParamsInvalid = assign(() => {
  return {
    query: {
      isValid: false,
    },
  };
});

// Set up the view for the selected factor
export const setupView = (
  context: AuthContext<View>,
  event: SelectFactorEvent
) => {
  const target = getTargetForFactor(event.factor) as keyof typeof factorConfig;

  // If we're not on a factor, we must be on factor selection,
  // which extends the Password context

  if (!target) {
    return assign({
      view: {
        password: "",
      },
    });
  }

  // Set up the view for this factor
  if (factorConfig[target]) {
    const factorView = factorConfig[target].viewContext;
    return assign({
      view: factorView,
    });
  }
  // We're on an unrecognized factor, so can't set anything except the base view
  return assign({
    view: {} as CommonFormData,
  });
};

// Store the user's email (and possibly name and username too)
export const setEmail = assign({
  user: (context, event: EmailSubmitEvent) => ({
    email: event.email,
    name: event.name,
    username: event.username,
  }),
});

// Store the verification code so we can send it
export const setCode = assign(
  (
    context: Pick<EmailCodeContext | SmsCodeContext, "view">,
    event: CodeSubmitEvent
  ) => ({
    view: {
      ...context.view,
      verificationCode: event.verificationCode,
    },
  })
);

// Store the user's password (and at least one of email, name, username) so we can send it
export const setPassword = assign(
  (context: PasswordContext, event: PasswordSubmitEvent) => ({
    user: {
      email: event.email,
      name: event.name,
      username: event.username,
      emailOrUsername: event.emailOrUsername,
    },
    view: {
      ...context.view,
      password: event.password,
    },
  })
);

export const setPasswordForReset = assign(
  (context: SetNewPasswordContext, event: SetNewPasswordSubmitEvent) => ({
    view: {
      ...context.view,
      password: event.password,
      confirmPassword: event.confirmPassword,
      existingPassword: event.existingPassword,
    },
  })
);

// Store the user's phone number so we can send it
export const setPhoneNumber = assign(
  (context: SmsCodeContext, event: PhoneNumberSubmitEvent) => ({
    view: {
      ...context.view,
      phoneNumber: event.phoneNumber,
    },
  })
);

// Store the TOTP setup QR code we received from the server, so we can display it
export const setQrCode = assign(
  (context: TotpCodeContext, event: UserfrontApiFetchQrCodeEvent) => ({
    view: {
      ...context.view,
      qrCode: event.data.qrCode,
      backupCodes: event.data.backupCodes,
    },
  })
);

// Store the TOTP code the user entered, so we can send it
export const setTotpCode = assign(
  (context: TotpCodeContext, event: TotpCodeSubmitEvent) => ({
    view: {
      ...context.view,
      totpCode: event.totpCode ?? "",
      backupCode: event.backupCode ?? "",
      emailOrUsername: event.emailOrUsername ?? "",
    },
  })
);

export const setUseBackupCode = assign(
  (context: TotpCodeContext, event: UseBackupCodeEvent) => ({
    view: {
      ...context.view,
      useBackupCode: event.useBackupCode,
    },
  })
);

// For the TOTP code entry, if it's the first factor, we need to gather
// the user's emailOrUsername. If it's the second factor, we already have it from the first factor.
export const setShowEmailOrUsernameIfFirstFactor = (
  context: TotpCodeContext
) => {
  return assign({
    view: {
      ...context.view,
      showEmailOrUsername: !context.isSecondFactor,
    },
  });
};

// For TOTP code on signup, if it's the first factor, we don't proceed directly to the second factor
// on success, because we need to show the user their backup codes first. In this case, store the
// response so we can use it afterward.
export const storeFactorResponse = assign(
  (context: TotpCodeContext, event: UserfrontApiFactorResponseEvent) => ({
    view: {
      ...context.view,
      isMfaRequired: event.data?.isMfaRequired,
      allowedSecondFactors: event.data?.authentication?.secondFactors || [],
    },
  })
);

// Store the allowed second factors, from the response to a successful first factor login.
export const setAllowedSecondFactors = assign(
  (context: AuthContext<any>, event: UserfrontApiFactorResponseEvent) => {
    return {
      allowedSecondFactors: event.data.authentication.secondFactors,
    };
  }
);

// Same as above, but set from context.view instead of event.data
// for views that don't proceed directly from the API request to
// the second factor selection (i.e. TOTP code as first factor)
export const setAllowedSecondFactorsFromView = assign(
  (context: TotpCodeContext) => ({
    allowedSecondFactors: context.view.allowedSecondFactors,
  })
);

// Mark that the form should be showing & working with second factors
export const markAsSecondFactor = assign({
  isSecondFactor: true,
});

// Redirect to the afterLoginPath etc. after signed in, just an alias for the Userfront API method
export const redirectIfLoggedIn = (context: AuthContext<any>) => {
  if (context.config.redirect !== false) {
    callUserfront({
      method: "redirectIfLoggedIn",
      args: [
        {
          redirect: context.config?.redirect,
        },
      ],
    });
  }
};

// Redirect to the afterLoginPath if the user is already logged in when the form loads, if redirectOnLoad = true
export const redirectOnLoad = (context: AuthContext<any>) => {
  if (context.config.redirectOnLoad) {
    callUserfront({
      method: "redirectIfLoggedIn",
      args: [
        {
          redirect: context.config?.redirect,
        },
      ],
    });
  }
};

// Set the tenantId based on what was returned from the Userfront API, or set shouldFetchFlow = false if
// there is no tenantId set in the local Userfront SDK instance
export const setTenantIdIfPresent = assign(
  (context: AuthContext<any>, event: UserfrontApiGetTenantIdEvent) => {
    if (hasValue(event.data)) {
      return {
        config: {
          ...context.config,
          tenantId: event.data,
        },
      };
    } else {
      return {
        config: {
          ...context.config,
          shouldFetchFlow: false,
        },
      };
    }
  }
);

// Set the auth flow based on what was returned from the Userfront API
export const setFlowFromUserfrontApi = assign(
  (context: AuthContext<any>, event: UserfrontApiFetchFlowEvent) => {
    if (!event.data) {
      console.warn(
        `Userfront toolkit: received no data from Userfront.setMode. This is likely a problem on Userfront's side.`
      );
      return {};
    }
    return {
      config: {
        ...context.config,
        mode: event.data.mode,
        flow: event.data.authentication,
      },
    };
  }
);

// Once we've gotten the auth flow from the Userfront server,
// if we're in preview mode we need to set the auth flow in the context
// and then, if the user had already clicked a factor button, continue
// the flow if that factor is still available.
export const resumeIfNeeded = choose([
  {
    cond: (context: AuthContext<any>) => !!context.activeFactor,
    actions: [
      send((context: AuthContext<any>) => ({
        type: getTargetForFactor(<Factor>context.activeFactor),
      })),
    ],
  },
]);

// Set the active factor, the factor that we're currently viewing.
// This is really just for the specific case when we're in "preview mode"
// (a local auth flow was provided, and we were told to fetch the flow from the server)
// and the user clicks a factor, so we can proceed to that factor when
// the flow has been fetched.
export const setActiveFactor = assign(
  (context: AuthContext<any>, event: SelectFactorEvent) => ({
    config: {
      ...context.config,
      activeFactor: event.factor,
    },
  })
);

// Set a message to confirm that an email was resent.
export const setResentMessage = assign((context: EmailLinkContext) => ({
  view: {
    ...context.view,
    message: "Email resent.",
  },
}));

// Clear any message confirming that an email was resent.
export const clearResentMessage = assign((context: EmailLinkContext) => ({
  view: {
    ...context.view,
    message: "",
  },
}));

export const setFirstFactorAction = assign((context: AuthContext<View>) => ({
  action: <FactorAction>(context.config.type === "login" ? "use" : "setup"),
}));

export const setSecondFactorAction = assign((context: AuthContext<View>) => {
  const hasExistingSecondFactors = context.allowedSecondFactors?.some(
    (factor) => factor.isConfiguredByUser
  );
  if (hasExistingSecondFactors) {
    return {
      action: <FactorAction>"use",
      allowedSecondFactors: context.allowedSecondFactors?.filter(
        (factor) => factor.isConfiguredByUser
      ),
    };
  } else {
    return {
      action: <FactorAction>"setup",
    };
  }
});
