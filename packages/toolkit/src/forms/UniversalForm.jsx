"use client";

import EnterEmail from "../views/EnterEmail";
import EnterPhone from "../views/EnterPhone";
import EnterVerificationCode from "../views/EnterVerificationCode";
import SelectFactor from "../views/SelectFactor";
import EnterTotpCode from "../views/EnterTotpCode";
import SetUpTotp from "../views/SetUpTotp";
import TotpErrorMessage from "../views/TotpErrorMessage";
import SetUpTotpSuccess from "../views/SetUpTotpSuccess";
import LogInWithPassword from "../views/LogInWithPassword";
import SecuredByUserfront from "../components/SecuredByUserfront";
import Message from "../views/Message";
import GeneralErrorMessage from "../views/GeneralErrorMessage";
import Success from "../views/Success";
import EmailLinkSent from "../views/EmailLinkSent";
import Placeholder from "../views/Placeholder";
import AlreadyLoggedIn from "../views/AlreadyLoggedIn";
import SetNewPassword from "../views/SetNewPassword";
import SetNewPasswordSuccess from "../views/SetNewPasswordSuccess";
import { log } from "../services/logging";
import { useState } from "react";
import { useSizeClass } from "../utils/hooks";
import SignUpWithPassword from "../views/SignUpWithPassword";
import { isLoggedInAndInvalidLinkCredentials } from "../models/config/guards";

// TODO DEV-484: expand on string handling and localization, extract to
// a separate JSON file, add capability for client to pass in its own
// locale file.
const strings = {
  login: {
    title: "Log in",
    done: "Logged in",

    secondFactor: {
      setup: {
        title: "Set up a second factor",
      },
      use: {
        title: "Log in",
      },
    },

    // strategies
    email: {
      link: {
        title: "Email me a link",
        checkEmail: "Check your email",
      },
      code: {
        title: "Email me a code",
        checkEmail: "Check your email",
        enterCode: "Enter your verification code",
      },
    },
    sms: {
      code: {
        title: "Text me a code",
        enterCode: "Enter your verification code",
      },
    },
    totp: {
      use: {
        title: "Enter your six-digit code",
        backupCode: "Enter a backup code",
        success: {
          title: "Verified",
        },
      },
      setup: {
        title: "Set up two-factor authentication",
        backupCode: "Save your backup codes",
        success: {
          title: "Added authenticator to your account",
        },
      },
    },
  },
  signup: {
    title: "Sign up",
    done: "Signed up",

    secondFactor: {
      setup: {
        title: "Sign up",
      },
    },

    // strategies
    email: {
      link: {
        title: "Email me a link",
        checkEmail: "Check your email",
      },
      code: {
        title: "Email me a code",
        checkEmail: "Check your email",
        enterCode: "Enter your verification code",
      },
    },
    sms: {
      code: {
        title: "Text me a code",
        enterCode: "Enter your verification code",
      },
    },
    totp: {
      setup: {
        title: "Set up two-factor authentication",
        success: {
          title: "Signed up",
        },
      },
    },
  },
  reset: {
    title: "Reset your password",
    requestResetTitle: "Reset your password",
    setNewPasswordTitle: "Set a new password",
    done: "Password reset",

    secondFactor: {
      setup: {
        title: "Set up a second factor",
      },
      use: {
        title: "Enter your second factor",
      },
    },

    // strategies
    email: {
      link: {
        title: "Reset your password",
        checkEmail: "Check your email",
      },
    },

    totp: {
      use: {
        title: "Enter your six-digit authenticator code",
        backupCode: "Enter a backup code",
        success: {
          title: "Your password was reset",
        },
      },
    },

    sms: {
      code: {
        title: "Text me a code",
        enterCode: "Enter your verification code",
      },
    },
  },
  general: {
    disabled: "Authentication is disabled",
    redirecting: "Redirecting...",
    unhandledError: "Oops, something went wrong",
    verified: "Verified",
    welcome: "Welcome",
  },
};

// Map a state node to component, title, and props
const componentForStep = (state) => {
  let step = "";
  if (typeof state.value === "object") {
    const key = Object.keys(state.value)[0];
    const val = state.value[key];
    step = `${key}.${val}`;
  } else {
    step = state.value;
  }

  const canShowFlow = state.context.config.flow?.firstFactors;
  const type = state.context.config.type;
  const action = state.context.action;

  const PasswordViewForType =
    type === "login" ? LogInWithPassword : SignUpWithPassword;

  switch (step) {
    case "init":
    case "getGlobalTenantId":
    case "initUserfront":
    case "initFlow":
    case "initForm":
    case "beginFlow":
    case "showPreviewAndFetchFlow":
    case "showPlaceholderAndFetchFlow":
    case "initPasswordReset":
      if (canShowFlow) {
        return {
          title: strings[type].title,
          Component: SelectFactor,
          props: {
            isPlaceholder: !!state.context.config.flow,
            isCompact: state.context.config.compact,
            loadingFactor: state.context.activeFactor,
            flow: state.context.config.flow,
            isSecondFactor: false,
            tenantId: state.context.tenantId,
            isLogin: type === "login",
          },
        };
      } else {
        return {
          Component: Placeholder,
        };
      }
    case "handleLoginWithLink":
      return {
        Component: Placeholder,
      };
    case "noFirstFactors":
    case "disabled":
      return {
        title: strings.general.disabled,
        Component: GeneralErrorMessage,
        props: {
          message: "Please contact an administrator for assistance",
        },
      };
    case "selectFirstFactor.showForm":
      return {
        title: strings[type].title,
        Component: SelectFactor,
        props: {
          isCompact: state.context.config.compact,
          flow: state.context.config.flow,
          isSecondFactor: false,
          tenantId: state.context.tenantId,
          isLogin: type === "login",
        },
      };
    case "selectFirstFactor.send":
      return {
        title: strings[type].title,
        Component: SelectFactor,
        props: {
          // isCompact should always be false here
          isCompact: state.context.config.compact,
          flow: state.context.config.flow,
          isSecondFactor: false,
          tenantId: state.context.tenantId,
          submittingPassword: true,
          isLogin: type === "login",
        },
      };

    // SelectFactor flow for second factor,
    // with password possibly inlined
    case "beginSecondFactor":
    case "selectSecondFactor.showForm":
      return {
        title: strings[type].secondFactor[action].title,
        Component: SelectFactor,
        props: {
          isCompact: state.context.config.compact,
          flow: state.context.config.flow,
          isSecondFactor: true,
          allowedSecondFactors: state.context.allowedSecondFactors,
          tenantId: state.context.tenantId,
        },
      };
    case "selectSecondFactor.send":
      return {
        title: strings[type].secondFactor[action].title,
        Component: SelectFactor,
        props: {
          // isCompact should always be false here
          isCompact: state.context.config.compact,
          flow: state.context.config.flow,
          isSecondFactor: true,
          allowedSecondFactors: state.context.allowedSecondFactors,
          tenantId: state.context.tenantId,
          submittingPassword: true,
        },
      };

    // SSO provider flow, shouldn't be reached
    case "ssoProvider":
      // We should have already redirected to the relevant SSO provider
      return {
        title: strings.general.redirecting,
        Component: Message,
        props: {
          text: "",
        },
      };

    // EmailLink flow
    case "emailLink.showForm":
      return {
        title: strings[type].email.link.title,
        Component: EnterEmail,
        props: {
          errorMessage: state.context.errorMessage,
        },
      };
    case "emailLink.send":
      return {
        title: strings[type].email.link.title,
        Component: EnterEmail,
        props: {
          isLoading: true,
        },
      };
    case "emailLink.showEmailSent":
      return {
        title: strings[type].email.link.checkEmail,
        Component: EmailLinkSent,
        props: {
          message: state.context.view.message,
        },
      };
    case "emailLink.resend":
      return {
        title: strings[type].email.link.checkEmail,
        Component: EmailLinkSent,
        props: {
          message: state.context.view.message,
        },
      };

    // EmailCode flow
    case "emailCode.showForm":
      return {
        title: strings[type].email.code.title,
        Component: EnterEmail,
        props: {},
      };
    case "emailCode.send":
      return {
        title: strings[type].email.code.title,
        Component: EnterEmail,
        props: {
          isLoading: true,
        },
      };
    case "emailCode.showCodeForm":
      return {
        title: strings[type].email.code.enterCode,
        Component: EnterVerificationCode,
        props: {},
      };
    case "emailCode.verifyCode":
      return {
        title: strings[type].email.code.enterCode,
        Component: EnterVerificationCode,
        props: {
          isLoading: true,
        },
      };
    case "emailCode.showCodeVerified":
      return {
        title: strings.general.verified,
        Component: Success,
        props: {},
      };

    // SmsCode flow
    case "smsCode.showForm":
      return {
        title: strings[type].sms.code.title,
        Component: EnterPhone,
        props: {},
      };
    case "smsCode.send":
      return {
        title: strings[type].sms.code.title,
        Component: EnterPhone,
        props: {
          isLoading: true,
        },
      };
    case "smsCode.showCodeForm":
      return {
        title: strings[type].sms.code.enterCode,
        Component: EnterVerificationCode,
        props: {},
      };
    case "smsCode.verifyCode":
      return {
        title: strings[type].sms.code.enterCode,
        Component: EnterVerificationCode,
        props: {
          isLoading: true,
        },
      };
    case "smsCode.showCodeVerified":
      return {
        title: strings.general.verified,
        Component: Success,
        props: {},
      };

    // Password flow (alone, not inline)
    case "password.showForm":
      return {
        title: strings[type].title,
        Component: PasswordViewForType,
        props: {},
      };
    case "password.send":
      return {
        title: strings[type].title,
        Component: PasswordViewForType,
        props: {
          isLoading: true,
        },
      };
    case "password.showPasswordSet":
      return {
        title: strings[type].done,
        Component: Success,
      };

    // TOTP flow
    case "useTotpCode.showForm": {
      const useBackupCode = state.context.view.useBackupCode;
      const title = useBackupCode
        ? strings[type].totp[action].backupCode
        : strings[type].totp[action].title;
      return {
        title,
        Component: EnterTotpCode,
        props: {
          errorMessage: state.context.errorMessage,
          useBackupCode,
          showEmailOrUsername: state.context.view.showEmailOrUsername,
        },
      };
    }
    case "useTotpCode.send": {
      const useBackupCode = state.context.view.useBackupCode;
      const title = useBackupCode
        ? strings[type].totp[action].backupCode
        : strings[type].totp[action].title;
      return {
        title,
        Component: EnterTotpCode,
        props: {
          isLoading: true,
          useBackupCode,
          showEmailOrUsername: state.context.view.showEmailOrUsername,
        },
      };
    }
    case "useTotpCode.showTotpSuccess":
      return {
        title: strings[type].totp[action].success.title,
        Component: Success,
        props: {},
      };

    // SetUpTotp flow
    case "setUpTotp.getQrCode":
      return {
        title: strings[type].totp[action].title,
        Component: SetUpTotp,
        props: {
          qrCode: state.context.view.qrCode || "",
        },
      };
    case "setUpTotp.showQrCode":
      return {
        title: strings[type].totp[action].title,
        Component: SetUpTotp,
        props: {
          qrCode: state.context.view.qrCode || "",
        },
      };
    case "setUpTotp.confirmTotpCode":
      return {
        title: strings[type].totp[action].title,
        Component: SetUpTotp,
        props: {
          qrCode: state.context.view.qrCode || "",
        },
      };
    case "setUpTotp.showBackupCodes":
      return {
        title: strings[type].totp[action].backupCode,
        Component: SetUpTotpSuccess,
        props: {
          backupCodes: state.context.view.backupCodes || [],
        },
      };
    case "setUpTotp.showTotpSetupComplete":
      return {
        title: strings[type].totp[action].success.title,
        Component: Success,
        props: {},
      };
    // Show a standalone error message if we fail to fetch the QR code
    case "setUpTotp.showErrorMessage":
      return {
        title: strings.general.unhandledError,
        Component: TotpErrorMessage,
        props: {},
      };

    // Top-level error messages
    case "missingFlowInDevModeError":
    case "missingFlowInLocalModeError":
    case "missingFlowFromServerError":
    case "unhandledError":
      return {
        title: strings.general.unhandledError,
        Component: GeneralErrorMessage,
        props: {},
      };

    // Top-level "signed up" confirmation, in case we don't redirect
    case "finish":
      return {
        title: strings[type].done,
        Component: Success,
        props: {},
      };

    // Set new password
    case "setNewPassword.showForm":
      return {
        title: strings.reset.setNewPasswordTitle,
        Component: SetNewPassword,
        props: {
          requireExistingPassword: isLoggedInAndInvalidLinkCredentials(
            state.context
          ),
        },
      };

    case "setNewPassword.send":
      return {
        title: strings.reset.setNewPasswordTitle,
        Component: SetNewPassword,
        props: {
          requireExistingPassword: isLoggedInAndInvalidLinkCredentials(
            state.context
          ),
          isLoading: true,
        },
      };

    case "setNewPassword.showNewPasswordSet":
      return {
        title: strings.reset.done,
        Component: SetNewPasswordSuccess,
      };

    // Already logged in - for forms on pages without redirect-on-load
    case "alreadyLoggedIn":
    case "initRefreshTokens":
    case "refreshTokens":
      return {
        title: strings.general.welcome,
        Component: AlreadyLoggedIn,
      };

    // Shouldn't get here.
    default:
      return {
        title: strings.general.unhandledError,
        Component: GeneralErrorMessage,
        props: {},
      };
  }
};

const UniversalForm = ({
  theme,
  state,
  isDemo = false,
  demoMode = "live",
  onEvent,
}) => {
  // Apply CSS classes based on the size of the form's container
  const [containerRef, setContainerRef] = useState();
  const sizeClass = useSizeClass(containerRef);

  // Get the view component, title text, and props corresponding to this state
  const { Component, props, title } = componentForStep(state);

  // Construct the default props that are passed to all views
  const defaultProps = {
    allowBack: state.context.allowBack,
    isSecondFactor: state.context.isSecondFactor,
    error: state.context.error,
    user: state.context.user,
    type: state.context.config.type,
  };

  // Build the theme

  // Define CSS variables
  const themeColors = theme?.colors;
  const style = {
    "--userfront-light-color": themeColors?.light || "#ffffff",
    "--userfront-dark-color": themeColors?.dark || "#5e72e4",
    "--userfront-accent-color": themeColors?.accent || "#13a0ff",
  };
  if (themeColors?.lightBackground) {
    style["--userfront-light-background-color"] = themeColors.lightBackground;
  }
  if (themeColors?.darkBackground) {
    style["--userfront-dark-background-color"] = themeColors.darkBackground;
  }
  if (theme?.fontFamily) {
    style["--userfront-font-family"] = theme.fontFamily;
  }

  // Classes for color schemes
  // For now, "light scheme only" is default, to match existing behavior.
  // In a future iteration "auto scheme" should be made default
  let colorSchemeClass = "userfront-light-scheme";
  if (theme?.colorScheme === "dark") {
    colorSchemeClass = "userfront-dark-scheme";
  }
  if (theme?.colorScheme === "auto") {
    colorSchemeClass = "userfront-auto-scheme";
  }

  // CSS variables for sizing
  if (theme?.size === "compact") {
    style["--userfront-em-size"] = "14px";
    style["--userfront-spacing"] = "0.5em";
  }
  if (theme?.size === "mini") {
    style["--userfront-em-size"] = "12px";
    style["--userfront-spacing"] = "0.5em";
    style["--userfront-container-width"] = "250px";
  }
  if (theme?.size === "spaced") {
    style["--userfront-em-size"] = "14px";
    style["--userfront-spacing"] = "20px";
  }
  if (theme?.size === "large") {
    style["--userfront-em-size"] = "20px";
    style["--userfront-spacing"] = "18px";
  }

  // Attach classes for theme customizations
  // TODO: syntax and terminology is flexible here
  const extrasClassMap = {
    gradientButtons: "userfront-gradient-buttons",
    hideSecuredMessage: "userfront-hide-branding",
    raisedButtons: "userfront-raised-buttons",
    dottedOutlines: "userfront-dotted-outlines",
  };
  const extras = theme?.extras || {};
  let customizationClasses = "";
  Object.entries(extras)
    .filter(([key, val]) => Boolean(val))
    .forEach(([key]) => {
      if (key in extrasClassMap) {
        customizationClasses += ` ${extrasClassMap[key]}`;
      } else {
        customizationClasses += ` userfront-${key}`;
      }
    });
  customizationClasses = customizationClasses.trim();

  return (
    <div
      ref={setContainerRef}
      className={`userfront-toolkit userfront-container ${sizeClass} ${colorSchemeClass} ${customizationClasses}`}
      style={style}
    >
      <h2>{title}</h2>
      <Component onEvent={onEvent} {...defaultProps} {...props} />
      <div>
        <SecuredByUserfront
          mode={isDemo ? demoMode : state.context.config?.mode}
        />
      </div>
    </div>
  );
};

export default UniversalForm;
