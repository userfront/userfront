import SecuredByUserfront from "../../components/SecuredByUserfront";
import {
  argTypesForVariables,
  argsForVariables,
} from "../../../.storybook/decorators/css-variables";
import FixedWidth from "../utils/FixedWidth";

const cssVariables = [
  "--userfront-secured-font-color",
  "--userfront-secured-font-size",
  "--userfront-spacing",
  "--userfront-font-family",
  "--userfront-alignment",
  "--userfront-em-size",
];

export default {
  title: "Components/Secured by Userfront",
  component: SecuredByUserfront,
  argTypes: argTypesForVariables(cssVariables),
};

export const Default = (args) => (
  <FixedWidth width={400}>
    <SecuredByUserfront />
  </FixedWidth>
);
Default.args = argsForVariables(cssVariables);
Default.storyName = "Secured by Userfront";
