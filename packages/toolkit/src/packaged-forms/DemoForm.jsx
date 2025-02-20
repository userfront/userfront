// "Unbound" forms: the signup and login forms without a model to drive their behavior
import { default as UnboundUniversalForm } from "../forms/UniversalForm";

// Factories for creating models to pair with the unbound forms
import {
  default as createUniversalFormModel,
  defaultAuthContext as defaultUniversalFormContext,
} from "../models/forms/universal";

import { useMockUserfront } from "../utils/mockUserfront.js";

import { useMachine } from "@xstate/react";
import { useEffect } from "react";

const context = {
  ...defaultUniversalFormContext,
};

const SignupFormModel = createUniversalFormModel(context);

const defaultDemoAuthFlow = {
  firstFactors: [
    { channel: "email", strategy: "google" },
    { channel: "email", strategy: "apple" },
    { channel: "email", strategy: "link" },
    { channel: "email", strategy: "password" },
  ],
};

/**
 * A demo authentication form that does not interact with the Userfront API
 *
 * @param {string=} props.type - "signup", "login", "passwordReset"
 * @param {object=} props.authFlow - authentication flow to use in the demo form
 * @param {object=} props.theme - theme information: color scheme, font, sizing, options
 * @param {string=} props.theme.colors.light - light color to use when deriving color scheme
 * @param {string=} props.theme.colors.dark - dark color to use when deriving color scheme
 * @param {object=} props.theme.colors - theme colors
 * @param {string=} props.theme.colors.accent - accent color to use when deriving color scheme (optional)
 * @param {string=} props.theme.colors.lightBackground - background color for light mode (optional)
 * @param {string=} props.theme.colors.darkBackground - background color for dark mode (optional)
 * @param {string=} props.theme.fontFamily - CSS font family to use for the form
 * @param {object=} props.theme.extras - additional options to modify the form's appearance
 * @param {boolean=} props.theme.extras.rounded - make form elements appear more rounded generally
 * @param {boolean=} props.theme.extras.squared - make form elements appear more squared-off generally
 * @param {boolean=} props.theme.extras.gradientButtons - add an interactive gradient to buttons
 * @param {boolean=} props.theme.extras.dottedOutline - use a dotted outline with some padding around active elements,
 *   rather than a solid outline that is flush with the outside of the element
 * @param {boolean=} props.theme.extras.raisedButtons - use old-school 3D-looking buttons
 * @param {boolean=} props.theme.extras.hideSecuredMessage - hide the "secured by Userfront" message
 */
const DemoForm = ({
  type,
  theme,
  authFlow = defaultDemoAuthFlow,
  mode = "live",
}) => {
  context.config.type = type;

  const mockUserfront = useMockUserfront({ authFlow, mode });

  const machine = SignupFormModel;
  const machineOptions = {};
  const [state, send] = useMachine(machine, machineOptions);

  useEffect(() => {
    mockUserfront.attachToWindow();
  }, []);

  const handleEvent = (event) => {
    send(event);
  };

  return (
    <UnboundUniversalForm
      state={state}
      onEvent={handleEvent}
      theme={theme}
      isDemo
      demoMode={mode}
    />
  );
};

export default DemoForm;
