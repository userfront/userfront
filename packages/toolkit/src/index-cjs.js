/*
 * The Userfront CoreJS library is the default export
 * For CJS/UMD, we attach everything else to the default export
 */
import UserfrontCore from "@userfront/core";

/*
 * Fully functional Userfront forms
 * If you're using this library, these are probably what you're looking for!
 */
import SignupForm from "./packaged-forms/SignupForm";
import LoginForm from "./packaged-forms/LoginForm";
import PasswordResetForm from "./packaged-forms/PasswordResetForm";
import LogoutButton from "./components/LogoutButton";
import DemoForm from "./packaged-forms/DemoForm";

UserfrontCore.SignupForm = SignupForm;
UserfrontCore.LoginForm = LoginForm;
UserfrontCore.PasswordResetForm = PasswordResetForm;
UserfrontCore.LogoutButton = LogoutButton;
UserfrontCore.DemoForm = DemoForm;

/*
 * CSS styles for the forms
 */
import "./themes/dynamic.css";

// TODO #9: add link to upgrade guide
UserfrontCore.build = (toolId) => {
  console.error(`Userfront.build(${toolId}) has been removed. Instead, import the component directly:
    import { SignupForm, LoginForm, PasswordResetForm, SetNewPasswordForm, LogoutButton } from "@userfront/react"
  See TODO DOCS LINK for more information about upgrading to the new toolkit.`);
};

/*
 * Dev tools.
 * You probably only want these if you're developing this library.
 */

// "Unbound" forms: the signup and login forms without a model to drive their behavior
import { default as UnboundUniversalForm } from "./forms/UniversalForm";

// Factories for creating models to pair with the unbound forms
import {
  default as createUniversalFormModel,
  defaultAuthContext as createUniversalFormContext,
} from "./models/forms/universal";

// Function that allows overriding the Userfront singleton used by the forms with a custom object of your choice
import { overrideUserfrontSingleton } from "./services/userfront";
const _devTools = {
  UnboundUniversalForm,
  createUniversalFormModel,
  createUniversalFormContext,
  overrideUserfrontSingleton,
};

UserfrontCore._devTools = _devTools;

export default UserfrontCore;
