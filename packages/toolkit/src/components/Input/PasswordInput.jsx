import BaseInput from "./BaseInput";

/**
 * An <input> with toggle to show / hide the password
 *
 * @param {object} props
 * @returns
 */
export default function PasswordInput({
  label = "Choose a password",
  showError,
  errorMessage = "Please enter your password",
  ...props
}) {
  return (
    <BaseInput
      isPassword
      name="password"
      aria-describedby="userfront-password-rules"
      showError={showError}
      errorMessage={errorMessage}
      label={label}
      {...props}
    />
  );
}
