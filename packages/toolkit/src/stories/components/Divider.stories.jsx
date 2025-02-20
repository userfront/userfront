import Divider from "../../components/Divider";
import {
  argTypesForVariables,
  argsForVariables,
  stripVariablesFromArgs,
} from "../../../.storybook/decorators/css-variables";
import FixedWidth from "../utils/FixedWidth";

const cssVariables = [
  "--userfront-divider-color",
  "--userfront-spacing",
  "--userfront-text-color",
  "--userfront-em-size",
];

export default {
  title: "Components/Divider",
  component: Divider,
  argTypes: {
    text: {
      name: "Text content",
      type: { name: "string", required: false },
      description: "Text content of the divider, if any.",
      control: {
        type: "text",
      },
    },
    width: {
      name: "Width of container",
      type: { name: "number", required: false },
      description:
        "Dividers fill their container by default. To simulate a fixed-width container, set the width here, in px, or set to 0 to unset the container width.",
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
      <Divider {...stripVariablesFromArgs(args)} />
    </FixedWidth>
  );
};

export const WithoutText = Template.bind({});
WithoutText.args = { text: "", width: 400, ...argsForVariables(cssVariables) };
WithoutText.storyName = "Without text";

export const WithText = Template.bind({});
WithText.args = { text: "or", width: 400, ...argsForVariables(cssVariables) };
WithText.storyName = "With text";
