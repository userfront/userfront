import {
  argsForVariables,
  argTypesForVariables,
} from "../../../.storybook/decorators/css-variables";
import EmailLinkSent from "../../views/EmailLinkSent";
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

export default {
  title: "Views/Links and codes/Email link sent",
  component: EmailLinkSent,
  argTypes: {
    email: {
      name: "Email address",
      type: { name: "string", required: true },
      description: "The email address the link was sent to.",
      control: "text",
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

export const Default = (args, { style }) => {
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
          <EmailLinkSent user={{ email: args.email }} onEvent={() => {}} />
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
        <EmailLinkSent user={{ email: args.email }} onEvent={() => {}} />
      </ViewContainer>
    </FixedWidth>
  );
};
Default.args = {
  email: "email@example.com",
  size: "userfront-medium",
  width: 0,
  ...argsForVariables(cssVariables),
};
Default.storyName = "Email link sent";
