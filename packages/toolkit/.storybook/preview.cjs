import "../src/themes/dynamic.css";

import { withCssVariables } from "./decorators/css-variables"

import * as jest from "jest-mock";
window.jest = jest;

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    // matchers: {
    //   color: /(background|color)$/i,
    //   date: /Date$/,
    // },
  },
  backgrounds: {
    default: "default",
    values: [
      {
        name: "default",
        value: "#f8f9fa"
      }
    ]
  }
}

// export const globalTypes = {

// }

export const decorators = [ withCssVariables ]