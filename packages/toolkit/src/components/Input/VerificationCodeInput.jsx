import BaseInput from "./BaseInput";

export default function VerificationCodeInput({
  label = "Enter your code",
  placeholder,
  showError,
  errorMessage = "Please enter your verification code",
}) {
  return (
    <BaseInput
      label={label}
      type="tel"
      name="verificationCode"
      placeholder={placeholder}
      showError={showError}
      errorMessage={errorMessage}
    />
  );
}
