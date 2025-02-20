import BaseInput from "./BaseInput";

export default function EmailInput({
  label = "Email address",
  placeholder,
  showError,
  errorMessage = "Please enter your email address",
}) {
  return (
    <BaseInput
      label={label}
      type="email"
      name="email"
      placeholder={placeholder}
      showError={showError}
      errorMessage={errorMessage}
    />
  );
}
