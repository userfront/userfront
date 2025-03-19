import { callUserfront } from "../../services/userfront";
import { hasValue } from "../config/utils";
import {
  AuthContext,
  AuthMachineConfig,
  AuthMachineEvent,
  TotpCodeContext,
  TotpCodeSubmitEvent,
} from "../types";

// TOTP Authenticator setup state machine config
const setUpTotpConfig: AuthMachineConfig = {
  id: "setUpTotp",
  initial: "getQrCode",
  entry: ["clearError", "setupView"],
  states: {
    // First we need to get the QR code from the Userfront API,
    // so we can show it
    getQrCode: {
      invoke: {
        // @ts-ignore
        src: () => callUserfront({ method: "store.user.getTotp" }),
        // If there's a problem getting the QR code, show an error message
        onError: {
          actions: "setErrorFromApiError",
          target: "showErrorMessage",
        },
        // Once we have the QR code, show the form
        onDone: {
          actions: "setQrCode",
          target: "showQrCode",
        },
      },
    },
    // Show the form with QR code + field to verify it works
    showQrCode: {
      on: {
        // Store the TOTP code the user entered so we can verify it
        submit: {
          actions: "setTotpCode",
          target: "confirmTotpCode",
        },
        // Go back to the factor selection view
        back: {
          actions: "clearError",
          target: "#backToFactors",
        },
      },
    },
    // Confirm the TOTP setup is correct by using a TOTP code
    confirmTotpCode: {
      entry: "clearError",
      invoke: {
        // Set the code and call the API method
        src: (context: AuthContext<any>, event: AuthMachineEvent) => {
          const arg: Record<string, any> = {
            method: "totp",
          };

          if (hasValue((<TotpCodeSubmitEvent>event).totpCode)) {
            arg.totpCode = (<TotpCodeSubmitEvent>event).totpCode;
          }

          // API only requires email/emailOrUsername when logging in via first factor
          if (!context.isSecondFactor) {
            if (hasValue(context.user.email)) {
              arg.email = context.user.email;
            } else if (hasValue(context.user.emailOrUsername)) {
              arg.emailOrUsername = context.user.emailOrUsername;
            }
          }

          // Don't redirect after TOTP setup so backup codes can be shown
          arg.redirect = false;

          return callUserfront({
            // Should ALWAYS be Userfront.login here
            method: "login",
            args: [arg],
          });
        },
        // On error, show the error message and return to the form
        onError: {
          actions: "setErrorFromApiError",
          target: "showQrCode",
        },

        // When verified, show the backup codes so the user can record them
        onDone: {
          actions: "storeFactorResponse",
          target: "showBackupCodes",
        },
      },
    },
    // Show the user's backup codes once TOTP setup succeeds
    showBackupCodes: {
      on: {
        // Proceed to the second factor if required,
        // otherwise show a message
        finish: [
          {
            actions: "setAllowedSecondFactorsFromView",
            target: "#beginSecondFactor",
            cond: "secondFactorRequiredFromView",
          },
          // We're signed in.
          // Instruct CoreJS to redirect as appropriate here
          // Show the "verified" view in case we don't redirect.
          {
            actions: "redirectIfLoggedIn",
            target: "showTotpSetupComplete",
          },
        ],
      },
    },
    // Show an error message — only if there's a problem getting the QR code
    showErrorMessage: {
      on: {
        retry: "getQrCode",
        back: {
          actions: "clearError",
          target: "#backToFactors",
        },
      },
    },
    // Show a confirmation screen, in case we don't redirect.
    showTotpSetupComplete: {
      type: "final",
    },
  },
};

export default setUpTotpConfig;
