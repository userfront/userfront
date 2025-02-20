import ContinueButton from "../../components/ContinueButton";
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
  title: "Components/Continue button",
  component: ContinueButton,
  argTypes: {
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
  delete newArgs.width;
  return (
    <FixedWidth width={args.width}>
      <ContinueButton {...stripVariablesFromArgs(args)} />
    </FixedWidth>
  );
};

export const Default = Template.bind({});
Default.args = { width: 400, ...argsForVariables(cssVariables) };

export const Hover = makePseudoStory(Default, "hover");
export const Focus = makePseudoStory(Default, "focus");
