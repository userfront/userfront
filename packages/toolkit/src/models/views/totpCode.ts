import { callUserfront } from "../../services/userfront";
import { AuthMachineConfig, TotpCodeContext } from "../types";

// TOTP Authenticator state machine config
const totpCodeConfig: AuthMachineConfig = {
  id: "useTotpCode",
  initial: "showForm",
  // If this is the first factor, the user needs to provide an email or username.
  // If it's the second factor, we already have that info.
  entry: ["clearError", "setupView", "setShowEmailOrUsernameIfFirstFactor"],
  states: {
    // Show the TOTP code entry form
    showForm: {
      on: {
        // Send the TOTP code on submit
        submit: {
          actions: "setTotpCode",
          target: "send",
        },
        // Go to the backup code entry view
        useBackupCode: {
          actions: "setUseBackupCode",
        },
        // Go back to the factor selection view
        back: {
          actions: "clearError",
          target: "#backToFactors",
        },
      },
    },
    // Send the login request with the Userfront API
    send: {
      entry: "clearError",
      invoke: {
        // Set totpCode or backupCode and possibly emailOrUsername as arguments and call the method
        src: (_context) => {
          const context = <TotpCodeContext>_context;
          const arg: Record<string, any> = {
            method: "totp",
            redirect: context.config.redirect,
          };
          if (context.view.useBackupCode) {
            arg.backupCode = <string>context.view.backupCode;
          } else {
            arg.totpCode = context.view.totpCode;
          }
          if (context.view.emailOrUsername) {
            arg.emailOrUsername = context.view.emailOrUsername;
          } else if (context.user.email) {
            arg.emailOrUsername = context.user.email;
          } else if (context.user.username) {
            arg.emailOrUsername = context.user.username;
          } else if (context.user.emailOrUsername) {
            arg.emailOrUsername = context.user.emailOrUsername;
          }
          return callUserfront({
            // Method is ALWAYS login for TOTP code
            method: "login",
            args: [arg],
          });
        },
        // On error, store the error and return to the form
        onError: {
          actions: "setErrorFromApiError",
          target: "showForm",
        },

        onDone: [
          // On success, proceed to second factor if required
          {
            actions: "setAllowedSecondFactors",
            target: "#beginSecondFactor",
            cond: "secondFactorRequired",
          },
          // Otherwise, we're signed in.
          // Core JS redirects as appropriate here.
          // Show the "verified" view in case we don't redirect.
          {
            target: "showTotpSuccess",
          },
        ],
      },
    },
    sendBackupCode: {
      entry: "clearError",
      invoke: {
        // Set backupCode and possibly emailOrUsername as arguments and call the method
        src: (_context) => {
          const context = <TotpCodeContext>_context;
          const arg: Record<string, any> = {
            method: "totp",
            backupCode: <string>context.view.backupCode,
            redirect: context.config.redirect,
          };
          if (context.view.emailOrUsername) {
            arg.emailOrUsername = context.view.emailOrUsername;
          } else if (context.user.email) {
            arg.emailOrUsername = context.user.email;
          } else if (context.user.username) {
            arg.emailOrUsername = context.user.username;
          } else if (context.user.emailOrUsername) {
            arg.emailOrUsername = context.user.emailOrUsername;
          }
          return callUserfront({
            // Method is ALWAYS login for TOTP code
            method: "login",
            args: [arg],
          });
        },
        // On error, store the error and return to the form
        onError: {
          actions: "setErrorFromApiError",
          target: "showForm",
        },
        onDone: [
          // On success, proceed to second factor if required
          {
            actions: "setAllowedSecondFactors",
            target: "#beginSecondFactor",
            cond: "secondFactorRequired",
          },
          // Otherwise, we're signed in.
          // Core JS redirects as appropriate here.
          // Show the "verified" view in case we don't redirect.
          {
            target: "showTotpSuccess",
          },
        ],
      },
    },
    // Show a confirmation view, in case we don't redirect
    showTotpSuccess: {
      type: "final",
    },
  },
};

export default totpCodeConfig;
