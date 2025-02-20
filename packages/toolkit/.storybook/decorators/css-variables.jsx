import styles from "../../src/themes/dynamic.css?inline";

const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(styles);

const createInitialCssVariables = (ruleList) => {
  const rules = [...ruleList].filter((rule) => rule.type === 1);
  const seenVars = new Set();
  const variables = {};
  for (const rule of rules) {
    for (const prop of rule.style) {
      if (prop.startsWith("--") && !seenVars.has(prop)) {
        variables[prop] = rule.style.getPropertyValue(prop);
      }
    }
  }
  return variables;
};

export const initialCssVariables = createInitialCssVariables(
  styleSheet.cssRules
);

export const withCssVariables = (Story, options) => {
  const { args, parameters } = options;
  const cssVariables = { ...initialCssVariables };
  Object.keys(initialCssVariables).forEach((name) => {
    if (args[name]) {
      cssVariables[name] = args[name];
    }
  });

  if (parameters.passStyle) {
    return (
      <div
        className="userfront-toolkit userfront-element userfront-test-background"
        style={cssVariables}
      >
        <Story style={cssVariables} />
      </div>
    );
  }

  return (
    <div
      className="userfront-toolkit userfront-element userfront-test-background"
      style={cssVariables}
    >
      <Story />
    </div>
  );
};

export const controlForVariable = (name) => {
  // Color picker for color variables that start off defined in the default theme
  const initial = initialCssVariables[name];
  if (initial) {
    if (name.includes("color") && !initial.includes("var(")) {
      return {
        control: {
          type: "color",
        },
      };
    }
  }
  return {
    control: {
      type: "text",
    },
  };
};

export const argTypesForVariables = (variables) => {
  const argTypes = {};
  variables.forEach(
    (variable) => (argTypes[variable] = controlForVariable(variable))
  );
  return argTypes;
};

export const argsForVariables = (variables) => {
  const args = {};
  variables.forEach((variable) => {
    if (initialCssVariables[variable]) {
      args[variable] = initialCssVariables[variable];
    }
  });
  return args;
};

export const stripVariablesFromArgs = (args) => {
  const newArgs = {};
  for (const argName in args) {
    if (argName in initialCssVariables) {
      continue;
    }
    newArgs[argName] = args[argName];
  }
  return newArgs;
};
