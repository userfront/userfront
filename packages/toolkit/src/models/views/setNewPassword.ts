// State machine for the "set new password" view

import { AuthMachineConfig, SetNewPasswordContext } from "../types";
import { callUserfront } from "../../services/userfront";
import { hasValue } from "../config/utils";

const setNewPasswordConfig: AuthMachineConfig = {
  id: "setNewPassword",
  initial: "showForm",
  entry: ["clearError", "setupView"],
  states: {
    // Show the form
    showForm: {
      on: {
        submit: [
          // If password === confirmPassword, then submit the request to Userfront
          {
            actions: "setPasswordForReset",
            target: "send",
            cond: "passwordsMatch",
          },
          // If password !== confirmPassword, then show an error
          {
            actions: "setErrorForPasswordMismatch",
            target: "showForm",
          },
        ],
      },
    },
    // Send the password reset request with the Userfront API
    send: {
      entry: "clearError",
      invoke: {
        src: (context) => {
          const arg: Record<string, any> = {
            password: (<SetNewPasswordContext>context).view.password,
            redirect: context.config.redirect,
          };
          if (
            hasValue((<SetNewPasswordContext>context).view.existingPassword)
          ) {
            arg.existingPassword = (<SetNewPasswordContext>(
              context
            )).view.existingPassword;
          }
          return callUserfront({
            method: "updatePassword",
            args: [arg],
          });
        },
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
          // Otherwise, password is reset
          {
            target: "showNewPasswordSet",
          },
        ],
      },
    },
    // Show a confirmation view, in case we don't redirect
    showNewPasswordSet: {
      type: "final",
    },
  },
};

export default setNewPasswordConfig;
