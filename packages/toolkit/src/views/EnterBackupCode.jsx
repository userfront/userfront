import { useState } from "react";
import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";
import ErrorMessage from "../components/ErrorMessage";
import Input from "../components/Input";

/**
 * View prompting user to enter a TOTP backup code.
 * @param {object} props
 * @param {boolean} props.allowBack - if true, show a Back button
 * @param {object} error - a Userfront error to display
 * @param {function} onEvent
 */
const EnterBackupCode = ({ onEvent, allowBack, error }) => {
  const [backupCodeError, setBackupCodeError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const backupCode = event.target.elements.backupCode.value;
    // Enforce presence of backupCode
    setBackupCodeError(!backupCode);
    if (!backupCode) return;

    // TODO @Ryan there is no submit information in this one
  };

  return (
    <form onSubmit={handleSubmit} className="userfront-form">
      <div className="userfront-form-row">
        <Input.BackupCode showError={backupCodeError} />
      </div>
      <ErrorMessage error={error} />
      <div className="userfront-button-row">
        {allowBack && <BackButton onEvent={onEvent} />}
        <SubmitButton />
      </div>
    </form>
  );
};

export default EnterBackupCode;
