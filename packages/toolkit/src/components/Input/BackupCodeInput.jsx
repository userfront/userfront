import BaseInput from "./BaseInput";

export default function BackupCodeInput({
  label = "Backup code",
  placeholder,
  showError,
  errorMessage = "Please enter your backup code",
}) {
  return (
    <BaseInput
      label={label}
      type="tel"
      name="backupCode"
      placeholder={placeholder}
      showError={showError}
      errorMessage={errorMessage}
    />
  );
}
