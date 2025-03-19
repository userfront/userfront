import {
  argsForVariables,
  argTypesForVariables,
} from "../../../.storybook/decorators/css-variables";
import SelectFactor from "../../views/SelectFactor";
import FixedWidth from "../utils/FixedWidth";
import ViewContainer from "../utils/ViewContainer";

const cssVariables = [
  "--userfront-text-color",
  "--userfront-background-color",
  "--userfront-container-border-color",
  "--userfront-container-border",
  "--userfront-border-radius",
  "--userfront-container-box-shadow",
  "--userfront-spacing",
  "--userfront-container-margin",
  "--userfront-container-width",
  "--userfront-container-max-width",
  "--userfront-container-height",
  "--userfront-container-max-height",
  "--userfront-font-family",
  "--userfront-alignment",
  "--userfront-em-size",
];

const sizeClasses = {
  "userfront-tiny": "userfront-tiny",
  "userfront-small": "userfront-small",
  "userfront-medium": "userfront-medium",
  "userfront-large": "userfront-large",
};

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
  title: "Views/Select factor",
  component: SelectFactor,
  argTypes: {
    isCompact: {
      name: "Compact mode",
      description:
        "In compact mode, the username + password factor is a button leading to that view, rather than the view embedded in the form.",
      control: "boolean",
    },
    isLogin: {
      name: "Is this login?",
      description:
        "If true, shows the login password form; if false, shows the signup password form. No effect if in compact mode, or if password is not an allowed factor.",
      control: "boolean",
    },
    error: {
      name: "Error message",
      description: "If there is an error message, the view will show it.",
      control: "text",
    },
    factors: {
      name: "Factors to choose from",
      description:
        "Which factors are available to the user at this stage? Note that the factors can be in any order, but Storybook doesn't offer a reorderable list control.",
      control: "check",
      options: [
        "Apple",
        "Azure",
        "Facebook",
        "Github",
        "Google",
        "LinkedIn",
        "Twitter",
        "Okta",
        "Email link (passwordless)",
        "Authenticator app or device (TOTP)",
        "SMS verification code",
        "Email verification code",
        "Username and password",
      ],
    },
    size: {
      name: "Size",
      type: { name: "string", required: true },
      description:
        "Width breakpoints for the view. Select one to view the form at that breakpoint.",
      control: "radio",
      options: [
        "userfront-tiny",
        "userfront-small",
        "userfront-medium",
        "userfront-large",
      ],
      mapping: sizeClasses,
      labels: {
        "userfront-tiny": "Tiny (<= 250px)",
        "userfront-small": "Small (<= 350px)",
        "userfront-medium": "Medium (<= 500px)",
        "userfront-large": "Large (> 500px)",
      },
      if: { arg: "width", truthy: false },
    },
    width: {
      name: "Width of container",
      type: { name: "number", required: false },
      description:
        "Views fill their container by default. Set the container width, or 0 to fill the Storybook container. If set, disables the size option above.",
      control: "number",
    },

    ...argTypesForVariables(cssVariables),
  },
  parameters: {
    passStyle: true,
  },
};

const Template = (args, { style }) => {
  const error = args.error ? { message: args.error } : null;

  // To simplify, treat the factor list as a list of allowed second factors
  const allowedSecondFactors = args.factors.map((f) => factorForName[f]);
  if (args.width) {
    let sizeClass = "userfront-large";
    if (args.width <= 500) {
      sizeClass = "userfront-medium";
    }
    if (args.width <= 350) {
      sizeClass = "userfront-small";
    }
    if (args.width <= 250) {
      sizeClass = "userfront-tiny";
    }
    return (
      <FixedWidth width={args.width}>
        <ViewContainer style={style} sizeClass={sizeClass} title={args.title}>
          <SelectFactor
            isSecondFactor={true}
            allowedSecondFactors={allowedSecondFactors}
            isCompact={args.isCompact}
            isLogin={args.isLogin}
            error={error}
            onEvent={() => {}}
          />
        </ViewContainer>
      </FixedWidth>
    );
  }
  let width;
  switch (args.size) {
    case "userfront-large":
      width = 650;
      break;
    case "userfront-medium":
      width = 450;
      break;
    case "userfront-small":
      width = 300;
      break;
    case "userfront-tiny":
      width = 200;
      break;
  }
  return (
    <FixedWidth width={width}>
      <ViewContainer style={style} sizeClass={args.size} title={args.title}>
        <SelectFactor
          isSecondFactor={true}
          allowedSecondFactors={allowedSecondFactors}
          isCompact={args.isCompact}
          isLogin={args.isLogin}
          error={error}
          onEvent={() => {}}
        />
      </ViewContainer>
    </FixedWidth>
  );
};

export const Login = Template.bind({});
Login.args = {
  isCompact: false,
  isLogin: true,
  factors: [
    "Google",
    "Facebook",
    "Email link (passwordless)",
    "Username and password",
  ],
  error: "",
  size: "userfront-medium",
  width: 0,
  ...argsForVariables(cssVariables),
};

export const Signup = Template.bind({});
Signup.args = {
  isCompact: false,
  isLogin: false,
  factors: [
    "Google",
    "Facebook",
    "Email link (passwordless)",
    "Username and password",
  ],
  error: "",
  size: "userfront-medium",
  width: 0,
  ...argsForVariables(cssVariables),
};

export const WithError = Template.bind({});
WithError.args = {
  isCompact: false,
  isLogin: true,
  factors: [
    "Google",
    "Facebook",
    "Email link (passwordless)",
    "Username and password",
  ],
  error:
    "That password wasn't correct. Please try again or choose a different way to log in.",
  size: "userfront-medium",
  width: 0,
  ...argsForVariables(cssVariables),
};

export const Compact = Template.bind({});
Compact.args = {
  isCompact: true,
  isLogin: true,
  factors: [
    "Google",
    "Facebook",
    "Email link (passwordless)",
    "Username and password",
  ],
  error: "",
  size: "userfront-medium",
  width: 0,
  ...argsForVariables(cssVariables),
};

export const SecondFactors = Template.bind({});
SecondFactors.args = {
  isCompact: false,
  isLogin: true,
  factors: ["SMS verification code", "Authenticator app or device (TOTP)"],
  error: "",
  size: "userfront-medium",
  width: 0,
  ...argsForVariables(cssVariables),
};
