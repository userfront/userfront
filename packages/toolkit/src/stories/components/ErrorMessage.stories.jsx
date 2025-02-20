import ErrorMessage from "../../components/ErrorMessage";
import {
  argTypesForVariables,
  argsForVariables,
  stripVariablesFromArgs,
} from "../../../.storybook/decorators/css-variables";
import FixedWidth from "../utils/FixedWidth";

const cssVariables = [
  "--userfront-spacing",
  "--userfront-border-radius",
  "--userfront-error-color",
  "--userfront-error-background-color",
  "--userfront-error-border-color",
  "--userfront-font-family",
  "--userfront-alignment",
  "--userfront-em-size",
];

export default {
  title: "Components/ErrorMessage",
  component: ErrorMessage,
  argTypes: {
    message: {
      name: "Error message",
      type: { name: "string", required: false },
      description:
        "Text content of the error message. If omitted, a generic 'unknown error' is shown.",
      control: {
        type: "text",
      },
    },
    width: {
      name: "Width of container",
      type: { name: "number", required: false },
      description:
        "This component fills its container by default. To simulate a fixed-width container, set the width here, in px, or set to 0 to unset the container width.",
      control: {
        type: "number",
      },
    },
    ...argTypesForVariables(cssVariables),
  },
};

const Template = (args) => {
  const newArgs = { ...args };
  delete newArgs.width;
  const error = {
    message: args.message,
  };
  newArgs.error = error;
  delete newArgs.message;
  return (
    <FixedWidth width={args.width}>
      <ErrorMessage {...stripVariablesFromArgs(newArgs)} />
    </FixedWidth>
  );
};

export const Default = Template.bind({});
Default.args = {
  message:
    "The verification code you entered is not correct. Please re-enter your code, or try a different method.",
  width: 400,
  ...argsForVariables(cssVariables),
};

export const NoErrorText = Template.bind({});
NoErrorText.args = {
  message: "",
  width: 400,
  ...argsForVariables(cssVariables),
};
NoErrorText.storyName = "With unknown error";
