import BaseInput from "./BaseInput";

export default function TotpCodeInput({
  label = "Six-digit code from your authenticator app or device",
  placeholder,
  showError,
  errorMessage = "Please enter your six-digit code",
}) {
  return (
    <BaseInput
      label={label}
      type="tel"
      name="totpCode"
      placeholder={placeholder}
      showError={showError}
      errorMessage={errorMessage}
    />
  );
}
