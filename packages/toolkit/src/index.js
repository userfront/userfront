/*
 * The Userfront CoreJS library is the default export
 * For ESM, we export everything else as named exports
 */
import Userfront from "@userfront/core";

/*
 * Fully functional Userfront forms
 * If you're using this library, these are probably what you're looking for!
 */
export { default as SignupForm } from "./packaged-forms/SignupForm";
export { default as LoginForm } from "./packaged-forms/LoginForm";
export { default as PasswordResetForm } from "./packaged-forms/PasswordResetForm";
export { default as LogoutButton } from "./components/LogoutButton";
export { default as DemoForm } from "./packaged-forms/DemoForm";
/*
 * CSS styles for the forms
 */
import "./themes/dynamic.css";

Userfront.build = (toolId) => {
  console.error(`Userfront.build(${toolId}) has been removed. Instead, import the component directly:
    import { SignupForm, LoginForm, PasswordResetForm, SetNewPasswordForm, LogoutButton } from "@userfront/toolkit/react"
  See https://userfront.com/dashboard/toolkit for more information about upgrading to the new toolkit.`);
};

/**
 * Override Userfront.init to pass toolkit userfrontSource param into it
 */
const UserfrontProxy = new Proxy(Userfront, {
  get(target, prop) {
    if (prop === "init") {
      return (tenantId, options = {}) => {
        Userfront.init(tenantId, {
          ...options,
          userfrontSource: "toolkit",
        });
      };
    }
    return target[prop];
  },
});

/*
 * Dev tools.
 * You probably only want these if you're developing this library.
 */

// "Unbound" forms: the signup and login forms without a model to drive their behavior
import { default as UnboundUniversalForm } from "./forms/UniversalForm";

// Factories for creating models to pair with the unbound forms
import {
  default as createUniversalFormModel,
  defaultAuthContext as defaultUniversalFormContext,
} from "./models/forms/universal";

// Function that allows overriding the Userfront singleton used by the forms with a custom object of your choice
import { overrideUserfrontSingleton } from "./services/userfront";
export const _devTools = {
  UnboundUniversalForm,
  createUniversalFormModel,
  defaultUniversalFormContext,
  overrideUserfrontSingleton,
};

export default UserfrontProxy;
