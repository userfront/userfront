import BaseInput from "./BaseInput";

export default function EmailOrUsernameInput({
  label = "Email address or username",
  placeholder,
  showError,
  errorMessage = "Please enter your email or username",
}) {
  return (
    <BaseInput
      label={label}
      type="text"
      name="emailOrUsername"
      placeholder={placeholder}
      showError={showError}
      errorMessage={errorMessage}
    />
  );
}
