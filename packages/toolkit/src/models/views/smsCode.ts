// State machine config for the "text me a code" view

import { AuthMachineConfig, SmsCodeContext } from "../types";
import { callUserfront } from "../../services/userfront";
import { hasValue } from "../config/utils";

// Virtually identical to the "email me a code" machine above - see that one for more details
const smsCodeConfig: AuthMachineConfig = {
  id: "smsCode",
  initial: "showForm",
  entry: ["clearError", "setupView"],
  states: {
    // Show the form to enter a phone number
    showForm: {
      on: {
        // When the user submits, store the phone number locally and proceed to send it with the Userfront API
        submit: {
          actions: "setPhoneNumber",
          target: "send",
        },
        // When the user presses the back button, go back to the preceding factor selection screen
        back: {
          actions: "clearError",
          target: "#backToFactors",
        },
      },
    },
    // Send the code SMS via the Userfront API
    send: {
      // Clear any error that's being displayed
      entry: "clearError",
      invoke: {
        src: (context) => {
          // Set method, phoneNumber, and possibly name and username as arguments for the call
          const arg: Record<string, string> = {
            channel: "sms",
            phoneNumber: (<SmsCodeContext>context).view.phoneNumber,
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
        // The user can ask to resend the code to the same phone number
        resend: "send",
        // The user can go back to the entry screen to use a different phone number
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
                channel: "sms",
                phoneNumber: (<SmsCodeContext>context).view.phoneNumber,
                verificationCode: (<SmsCodeContext>context).view
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
          // Otherwise, we're signed in.
          // Core JS redirects as appropriate here.
          // Show the "verified" view in case we don't redirect.
          {
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

export default smsCodeConfig;
