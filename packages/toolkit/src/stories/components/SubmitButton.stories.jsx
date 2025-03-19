import SubmitButton from "../../components/SubmitButton";
import {
  argTypesForVariables,
  argsForVariables,
  stripVariablesFromArgs,
} from "../../../.storybook/decorators/css-variables";
import FixedWidth from "../utils/FixedWidth";
import makePseudoStory from "../utils/pseudo";

const cssVariables = [
  "--userfront-primary-color",
  "--userfront-primary-color-text",
  "--userfront-primary-button-border",
  "--userfront-primary-button-border-color",
  "--userfront-border-radius",
  "--userfront-primary-color-active",
  "--userfront-primary-button-border-active",
  "--userfront-primary-button-border-active-color",
  "--userfront-primary-button-box-shadow-active",
  "--userfront-primary-color-focus",
  "--userfront-primary-button-border-focus",
  "--userfront-primary-button-border-focus-color",
  "--userfront-button-hover-transform",
  "--userfront-spacing",
  "--userfront-button-padding",
  "--userfront-button-font-size",
  "--userfront-font-family",
  "--userfront-em-size",
];

export default {
  title: "Components/Submit button",
  component: SubmitButton,
  argTypes: {
    text: {
      name: "Text content",
      type: { name: "string", required: false },
      description:
        "Text content of the submit button. Omit to use the default value.",
      control: {
        type: "text",
      },
    },
    width: {
      name: "Width of container",
      type: { name: "number", required: false },
      description:
        "Buttons fill their container by default. To simulate a fixed-width container, set the width here, in px, or set to 0 to unset the container width.",
      control: {
        type: "number",
      },
    },
    ...argTypesForVariables(cssVariables),
  },
};

const Template = (args) => {
  const newArgs = { ...args };
  delete newArgs.text;
  delete newArgs.width;
  if (args.text) {
    return (
      <FixedWidth width={args.width}>
        <SubmitButton {...stripVariablesFromArgs(newArgs)}>
          {args.text}
        </SubmitButton>
      </FixedWidth>
    );
  }
  return (
    <FixedWidth width={args.width}>
      <SubmitButton {...stripVariablesFromArgs(newArgs)} />
    </FixedWidth>
  );
};

export const Default = Template.bind({});
Default.args = { text: "", width: 400, ...argsForVariables(cssVariables) };

export const CustomText = Template.bind({});
CustomText.args = {
  text: "Custom text",
  width: 400,
  ...argsForVariables(cssVariables),
};
CustomText.storyName = "With custom text";

export const Hover = makePseudoStory(Default, "hover");
export const Focus = makePseudoStory(Default, "focus");
