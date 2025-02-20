/* 
  Manually adjusted .d.ts for index.js
  The auto-generated index.d.ts file does not pick up the CoreJS import,
  so this adds that import. The import paths in this file reflect the
  expected auto-generated paths and are not expected to be present
  relative to this file.

  During build, this is copied directly into the dist directory.
*/

export { default as SignupForm } from "./packaged-forms/SignupForm";
export { default as LoginForm } from "./packaged-forms/LoginForm";
export { default as PasswordResetForm } from "./packaged-forms/PasswordResetForm";
export { default as LogoutButton } from "./components/LogoutButton";
export namespace _devTools {
  export { UnboundUniversalForm };
  export { createUniversalFormModel };
  export { defaultUniversalFormContext };
  export { overrideUserfrontSingleton };
}
export default Userfront;
import { default as UnboundUniversalForm } from "./forms/UniversalForm";
import { default as createUniversalFormModel } from "./models/forms/universal";
import { defaultAuthContext as defaultUniversalFormContext } from "./models/forms/universal";
import { overrideUserfrontSingleton } from "./services/userfront";
import * as Userfront from "@userfront/core";
