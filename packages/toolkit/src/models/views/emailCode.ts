import { AuthMachineConfig, EmailCodeContext } from "../types";
import { callUserfront } from "../../services/userfront";
import { hasValue } from "../config/utils";

const emailCodeConfig: AuthMachineConfig = {
  id: "emailCode",
  initial: "showForm",
  entry: ["clearError", "setupView"],
  states: {
    // Show the form to enter an email address
    showForm: {
      on: {
        // When the user submits, store the email locally and proceed to send it with the Userfront API
        submit: {
          actions: "setEmail",
          target: "send",
        },
        // When the user presses the back button, go back to the preceding factor selection screen
        back: {
          actions: "clearError",
          target: "#backToFactors",
        },
      },
    },
    // Send the code email via the Userfront API
    send: {
      // Clear any error that's being displayed
      entry: "clearError",
      invoke: {
        // Set method, email, and possibly name and username as arguments for the call
        src: (context) => {
          const arg: Record<string, string> = {
            channel: "email",
            email: context.user.email,
          };
          if (hasValue(context.user.name)) {
            arg.name = context.user.name;
          }
          if (hasValue(context.user.username)) {
            arg.username = context.user.username;
          }
          return callUserfront({
            method: "sendVerificationCode",
            args: [arg],
          });
        },
        // On failure, set the error message and return to the entry form
        onError: {
          actions: "setErrorFromApiError",
          target: "showForm",
        },
        // On success, ask the user to enter the verification code
        onDone: {
          target: "showCodeForm",
        },
      },
    },
    // Show the form asking the user to enter the verification code
    showCodeForm: {
      on: {
        // On submit, store and then verify the code
        submit: {
          actions: "setCode",
          target: "verifyCode",
        },
        // The user can ask to resend the code to the same email address
        resend: "send",
        // The user can go back to the email entry screen to use a different email address
        back: {
          actions: "clearError",
          target: "showForm",
        },
      },
    },
    // Check the verification code via the Userfront API
    verifyCode: {
      // Clear any error that's being displayed
      entry: "clearError",
      invoke: {
        // Set the arguments and call the Userfront API method to check the verification code
        src: (context) =>
          callUserfront({
            // Always call Userfront.login when verifying a code.
            // Userfront.signup sends another code instead.
            method: "login",
            args: [
              {
                method: "verificationCode",
                channel: "email",
                email: context.user.email,
                verificationCode: (<EmailCodeContext>context).view
                  .verificationCode,
                redirect: context.config.redirect,
              },
            ],
          }),
        // On error, show the error message on the code entry form
        onError: {
          actions: "setErrorFromApiError",
          target: "showCodeForm",
        },
        onDone: [
          // If we need to enter a second factor, proceed to that step
          {
            actions: "setAllowedSecondFactors",
            target: "#beginSecondFactor",
            cond: "secondFactorRequired",
          },
          // Otherwise, we're signed in, redirect.
          // Show the "verified" view in case redirect fails.
          {
            actions: "redirectIfLoggedIn",
            target: "showCodeVerified",
          },
        ],
      },
    },
    // Show a "verified" view, so we have something to show if there's nowhere to redirect to
    showCodeVerified: {
      type: "final",
    },
  },
};

export default emailCodeConfig;
