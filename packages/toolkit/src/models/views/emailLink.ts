import { AuthMachineConfig, SignOnFormType } from "../types";
import { callUserfront } from "../../services/userfront";
import { hasValue } from "../config/utils";

const emailLinkConfig: AuthMachineConfig = {
  id: "emailLink",
  initial: "showForm",
  entry: ["clearError", "setupView"],
  states: {
    // Show the form to enter an email
    showForm: {
      on: {
        // When the user submits, store the email locally and proceed to send the request
        submit: {
          actions: "setEmail",
          target: "send",
        },
        // When the user presses the back button, go back to the prior (first, second) factor selection view
        back: {
          actions: "clearError",
          target: "#backToFactors",
        },
      },
    },
    // Request to send the email link to the given email,
    // and report success or failure.
    send: {
      // If there's currently an error message, clear it - don't show stale errors!
      entry: "clearError",
      // Call the Userfront API login/signup with passwordless method
      invoke: {
        // Set the method and email, and name and/or username if present, as arguments
        src: (context) => {
          // Could be sending a login or reset link
          // Reset link
          if (context.config.type === "reset") {
            return callUserfront({
              method: "sendResetLink",
              args: [context.user.email],
            });
          }
          // Login link
          const arg: Record<string, string | boolean | undefined> = {
            method: "passwordless",
            email: context.user.email,
            redirect: context.config.redirect,
          };
          if (hasValue(context.user.name)) {
            arg.name = context.user.name;
          }
          if (hasValue(context.user.username)) {
            arg.username = context.user.username;
          }
          return callUserfront({
            method: <SignOnFormType>context.config.type,
            args: [arg],
          });
        },
        // On failure, store the error and return to the email entry screen so we can try again
        onError: {
          actions: "setErrorFromApiError",
          target: "showForm",
        },
        // On success, show that the email was sent
        onDone: {
          target: "showEmailSent",
        },
      },
    },
    // The email was successfully sent, show a message
    showEmailSent: {
      on: {
        // The user asks to resend the email to the same address
        resend: "resend",
        // The user presses the back button (i.e. to correct their email and send)
        back: "showForm",
      },
    },
    // Resend the link to the given email.
    // Identical to "send", but needs to be a different state
    // so we can show the "email sent" view while the resend is happening.
    resend: {
      // If there's currently an error message, clear it - don't show stale errors!
      entry: ["clearError", "clearResentMessage"],
      // Call the Userfront API login/signup with passwordless method
      invoke: {
        // Set the method and email, and name and/or username if present, as arguments
        src: (context) => {
          const arg: Record<string, string | boolean | undefined> = {
            method: "passwordless",
            email: context.user.email,
            redirect: context.config.redirect,
          };
          if (hasValue(context.user.name)) {
            arg.name = context.user.name;
          }
          if (hasValue(context.user.username)) {
            arg.username = context.user.username;
          }
          return callUserfront({
            method: <SignOnFormType>context.config.type,
            args: [arg],
          });
        },
        // On failure, store the error and return to the email entry screen so we can try again
        onError: {
          actions: "setErrorFromApiError",
          target: "showForm",
        },
        // On success, show that the email was resent
        onDone: {
          actions: "setResentMessage",
          target: "showEmailSent",
        },
      },
    },
  },
};

export default emailLinkConfig;
