import IconButton from "../../components/IconButton";
import {
  argTypesForVariables,
  argsForVariables,
  stripVariablesFromArgs,
} from "../../../.storybook/decorators/css-variables";
import FixedWidth from "../utils/FixedWidth";
import makePseudoStory from "../utils/pseudo";

const cssVariables = [
  "--userfront-button-icon-size",
  "--userfront-text-color",
  "--userfront-secondary-color",
  "--userfront-secondary-color-text",
  "--userfront-secondary-button-border",
  "--userfront-secondary-button-border-color",
  "--userfront-border-radius",
  "--userfront-secondary-color-active",
  "--userfront-secondary-button-border-active",
  "--userfront-secondary-button-border-active-color",
  "--userfront-secondary-button-box-shadow-active",
  "--userfront-secondary-color-focus",
  "--userfront-secondary-button-border-focus",
  "--userfront-secondary-button-border-focus-color",
  "--userfront-button-hover-transform",
  "--userfront-spacing",
  "--userfront-button-padding",
  "--userfront-button-font-size",
  "--userfront-font-family",
  "--userfront-em-size",
];

const factorForName = {
  Apple: {
    channel: "email",
    strategy: "apple",
  },
  Azure: {
    channel: "email",
    strategy: "azure",
  },
  Facebook: {
    channel: "email",
    strategy: "facebook",
  },
  Github: {
    channel: "email",
    strategy: "github",
  },
  Google: {
    channel: "email",
    strategy: "google",
  },
  LinkedIn: {
    channel: "email",
    strategy: "linkedin",
  },
  Twitter: {
    channel: "email",
    strategy: "twitter",
  },
  Okta: {
    channel: "email",
    strategy: "okta",
  },
  "Username and password": {
    channel: "email",
    strategy: "password",
  },
  "Email link (passwordless)": {
    channel: "email",
    strategy: "link",
  },
  "Authenticator app or device (TOTP)": {
    channel: "authenticator",
    strategy: "totp",
  },
  "SMS verification code": {
    channel: "sms",
    strategy: "verificationCode",
  },
  "Email verification code": {
    channel: "email",
    strategy: "verificationCode",
  },
};

export default {
  title: "Components/Icon button",
  component: IconButton,
  argTypes: {
    factor: {
      name: "Factor or provider",
      description: "The factor or SSO provider to show with this icon button",
      control: {
        type: "radio",
      },
      options: [
        "Apple",
        "Azure",
        "Facebook",
        "Github",
        "Google",
        "LinkedIn",
        "Twitter",
        "Okta",
        "Username and password",
        "Email link (passwordless)",
        "Authenticator app or device (TOTP)",
        "SMS verification code",
        "Email verification code",
      ],
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
  delete newArgs.width;
  const factor = factorForName[args.factor];
  newArgs.factor = factor;
  return (
    <FixedWidth width={args.width}>
      <IconButton {...stripVariablesFromArgs(newArgs)} />
    </FixedWidth>
  );
};

export const Default = Template.bind({});
Default.args = {
  factor: "Apple",
  width: 400,
  ...argsForVariables(cssVariables),
};

export const Hover = makePseudoStory(Default, "hover");
export const Focus = makePseudoStory(Default, "focus");
