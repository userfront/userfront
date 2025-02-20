import { useState } from "react";
import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";
import ErrorMessage from "../components/ErrorMessage";
import Input from "../components/Input";

/**
 * View to allow a user to sign up with a username/email and password
 *
 * @param {object} props
 * @param {boolean} props.collectUsername - if true, show a field for the user's username. Default false.
 * @param {boolean} props.requirePasswordConfirmation - if true, show a second password input,
 *  and require the passwords to match. Default false.
 * @param {boolean} props.allowBack - if true, show a Back button
 * @param {object} error - a Userfront error to display
 * @param {function} onEvent
 */
const SignUpWithPassword = ({
  onEvent,
  allowBack,
  collectUsername = false,
  requirePasswordConfirmation = false,
  error,
}) => {
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const elements = event.target.elements;

    // Enforce presence of email & password
    setEmailError(!elements.email.value);
    setPasswordError(!elements.password.value);
    if (!elements.email.value || !elements.password.value) return;

    // If password confirmation is not required, put the password in that field so validation passes
    const confirmPassword = requirePasswordConfirmation
      ? elements.confirmPassword.value
      : elements.password.value;
    if (onEvent) {
      const event = {
        type: "submit",
        email: elements.email.value,
        password: elements.password.value,
        confirmPassword,
      };
      if (collectUsername) {
        event.username = elements.username.value;
      }
      onEvent(event);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="userfront-form">
      {collectUsername && (
        <div className="userfront-form-row">
          <label htmlFor="username">Username</label>
          <input
            className="userfront-input"
            type="text"
            name="username"
          ></input>
        </div>
      )}
      <div className="userfront-form-row">
        <Input.Email label="Email address" showError={emailError} />
      </div>
      <div className="userfront-form-row">
        <Input.Password label="Choose a password" showError={passwordError} />
        <span
          className="userfront-secondary-text"
          id="userfront-password-rules"
        >
          At least 16 characters OR at least 8 characters including a number and
          a letter.
        </span>
      </div>
      {requirePasswordConfirmation && (
        <div className="userfront-form-row">
          <label htmlFor="confirmPassword">Confirm your password</label>
          <input
            className="userfront-input"
            type="password"
            name="confirmPassword"
          ></input>
        </div>
      )}
      <ErrorMessage error={error} />
      <div className="userfront-button-row">
        {allowBack && <BackButton onEvent={onEvent} />}
        <SubmitButton />
      </div>
    </form>
  );
};

export default SignUpWithPassword;
