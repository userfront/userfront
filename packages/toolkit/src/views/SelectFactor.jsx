import IconButton from "../components/IconButton";
import SignUpWithPassword from "./SignUpWithPassword";
import LogInWithPassword from "./LogInWithPassword";
import Divider from "../components/Divider";
import ErrorMessage from "../components/ErrorMessage";
import { log } from "../services/logging";

const keyFor = (factor) => `${factor.channel}-${factor.strategy}`;

/**
 * A view prompting the user to select a factor. May also include the
 * password view inline.
 *
 * @param {object} props
 * @param {object} props.flow - the auth flow in use
 * @param {boolean} props.isCompact - if true, show a "Username and password" button to
 *   open the password view. If false, show the password view inline. Default false.
 * @param {array} props.allowedSecondFactors - which second factors are allowed, if this is the second factor.
 * @param {boolean} props.isSecondFactor - if true, use allowedSecondFactors. If false, use flow.firstFactors.
 * @param {boolean} props.isLogin - if true, this is a login form; if false, this is a signup form. Default false.
 * @param {object} error - a Userfront error to display
 * @param {function} onEvent
 */
const SelectFactor = ({
  flow,
  isCompact = false,
  onEvent,
  allowedSecondFactors,
  isSecondFactor = false,
  isLogin = false,
  error,
}) => {
  const _onEvent = onEvent || ((evt) => log("event", evt));
  const factors = isSecondFactor ? allowedSecondFactors : flow.firstFactors;
  const displayItems = [];

  const handleSelectFactor = (factor) => {
    _onEvent({
      factor,
      type: "selectFactor",
    });
  };

  let showingPassword = false;

  const PasswordForm = isLogin ? LogInWithPassword : SignUpWithPassword;

  // Build list of buttons for factors,
  // with password button if in compact view,
  // or password entry if in default view
  for (let i = 0; i < factors.length; i++) {
    const factor = factors[i];
    if (factor.strategy !== "password") {
      displayItems.push(
        <IconButton
          factor={factor}
          onClick={() => handleSelectFactor(factor)}
          key={keyFor(factor)}
        />
      );
    } else if (isCompact) {
      displayItems.push(
        <IconButton
          factor={factor}
          onClick={() => handleSelectFactor(factor)}
          key={keyFor(factor)}
        />
      );
    } else {
      showingPassword = true;
      // Put dividers before and after, as appropriate
      if (i !== 0) {
        displayItems.push(<Divider text="OR" key="before_password" />);
      }
      displayItems.push(
        <PasswordForm
          key={keyFor(factor)}
          onEvent={_onEvent}
          allowBack={false}
          error={error}
        />
      );
      if (i < factors.length - 1) {
        displayItems.push(<Divider text="OR" key="after_password" />);
      }
    }
  }

  return (
    <>
      {displayItems}
      {!showingPassword && <ErrorMessage error={error} />}
    </>
  );
};

export default SelectFactor;
