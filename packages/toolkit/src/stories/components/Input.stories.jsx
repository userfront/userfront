import Input from "../../components/Input";
import {
  argTypesForVariables,
  argsForVariables,
  stripVariablesFromArgs,
} from "../../../.storybook/decorators/css-variables";
import FixedWidth from "../utils/FixedWidth";
import makePseudoStory from "../utils/pseudo";

const cssVariables = [
  "--userfront-input-text-color",
  "--userfront-input-background-color",
  "--userfront-input-border",
  "--userfront-input-font-size",
  "--userfront-input-background-color-active",
  "--userfront-input-border-active",
  "--userfront-input-border-focus",
  "--userfront-input-border-error",
  "--userfront-placeholder-color",
  "--userfront-placeholder-color-active",
  "--userfront-label-alignment",
  "--userfront-border-radius",
  "--userfront-spacing",
  "--userfront-font-family",
  "--userfront-em-size",
];

export default {
  title: "Components/Input",
  component: Input,
  argTypes: {
    labelText: {
      name: "Label text content",
      type: { name: "string", required: false },
      description: "Text content of the input's label. Label omitted if blank.",
      control: {
        type: "text",
      },
    },
    placeholder: {
      name: "Placeholder text content",
      type: { name: "string", required: false },
      description: "Text content of the input's placeholder.",
      control: {
        type: "text",
      },
    },
    type: {
      name: "Input type",
      type: { name: "string", required: false },
      description: 'Input type, i.e. <input type="text" />',
      control: {
        type: "text",
      },
    },
    width: {
      name: "Width of container",
      type: { name: "number", required: false },
      description:
        "Components fill their container by default. To simulate a fixed-width container, set the width here, in px, or set to 0 to unset the container width.",
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
  delete newArgs.labelText;
  if (args.labelText) {
    return (
      <FixedWidth width={args.width}>
        <div className="userfront-form">
          <div className="userfront-form-row">
            <label>{args.labelText}</label>
            <Input {...stripVariablesFromArgs(newArgs)} />
          </div>
        </div>
      </FixedWidth>
    );
  }
  return (
    <FixedWidth width={args.width}>
      <Input {...stripVariablesFromArgs(newArgs)} />
    </FixedWidth>
  );
};

export const Text = Template.bind({});
Text.args = {
  labelText: "",
  placeholder: "username",
  type: "text",
  width: 400,
  ...argsForVariables(cssVariables),
};

export const Hover = makePseudoStory(Text, "hover");
export const Focus = makePseudoStory(Text, "focus");

export const WithLabel = Template.bind({});
WithLabel.args = {
  labelText: "Choose a username",
  placeholder: "username",
  type: "text",
  width: 400,
  ...argsForVariables(cssVariables),
};
WithLabel.storyName = "With label";

export const HoverWithLabel = makePseudoStory(WithLabel, "hover");
export const FocusWithLabel = makePseudoStory(WithLabel, "focus");

export const Email = Template.bind({});
Email.args = {
  labelText: "",
  placeholder: "user@example.com",
  type: "email",
  width: 400,
  ...argsForVariables(cssVariables),
};

export const Password = Template.bind({});
Password.args = {
  labelText: "",
  placeholder: "password",
  type: "password",
  width: 400,
  ...argsForVariables(cssVariables),
};

export const PhoneNumber = Template.bind({});
PhoneNumber.args = {
  labelText: "",
  placeholder: "(555) 555-1234",
  type: "tel",
  width: 400,
  ...argsForVariables(cssVariables),
};
PhoneNumber.storyName = "Phone number";
