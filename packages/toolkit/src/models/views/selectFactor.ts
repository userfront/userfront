import passwordConfig from "./password";
import { AuthMachineConfig } from "../types";
import { factorConfig } from "../config/utils";

const selectFactorConfig: AuthMachineConfig = {
  id: "selectFactor",
  initial: "showForm",
  entry: ["clearError", "setupView", "enableBack"],
  states: {
    // Bring over the Password state nodes, and override the showForm
    // node to add SelectFactor events to it.
    ...passwordConfig.states!,
    showForm: {
      on: {
        // Bring over the Password events
        ...passwordConfig.states!.showForm.on,
        // When the user selects a factor, proceed to that factor's view.
        selectFactor: [
          ...Object.values(factorConfig).map((factor) => ({
            target: `#${factor.name}`,
            cond: factor.testIs,
          })),
          // This should be exhaustive; if we fall through to here without
          // matching a factor, that means the user selected a factor we don't have a view for.

          // Duplicates, should never be reached.
          // Only here to help out the XState visualizer.
          // Uncomment if using the visualizer.

          // {
          //   target: "#emailLink",
          //   cond: "isEmailLink",
          // },
          // {
          //   target: "#emailCode",
          //   cond: "isEmailCode",
          // },
          // {
          //   target: "#smsCode",
          //   cond: "isSmsCode",
          // },
          // {
          //   target: "#password",
          //   cond: "isPassword",
          // },
          // {
          //   target: "#totpCode",
          //   cond: "isTotp",
          // },
          // {
          //   target: "#ssoProvider",
          //   cond: "isSsoProvider",
          // },

          // If we get here, it's an unhandled condition, show an error
          {
            target: "#unhandledError",
          },
        ],
      },
    },
    // If we signed up with a password, no second factor is required, and
    // we didn't redirect, show the top-level "finished" state
    showPasswordSet: {
      always: "#finish",
    },
  },
};

export default selectFactorConfig;
