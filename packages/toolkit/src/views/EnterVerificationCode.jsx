import { useState } from "react";
import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";
import ErrorMessage from "../components/ErrorMessage";
import Input from "../components/Input";

/**
 * A view prompting the user to enter the verification code they received by email or SMS.
 *
 * @param {object} props
 * @param {object} error - a Userfront error to display
 * @param {function} onEvent
 */
const EnterVerificationCode = ({ onEvent, error }) => {
  const [verificationCodeError, setVerificationCodeError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const verificationCode = event.target.elements.verificationCode.value;

    // Enforce presence of verificationCode
    setVerificationCodeError(!verificationCode);
    if (!verificationCode) return;

    onEvent({
      type: "submit",
      verificationCode,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="userfront-form">
      <div className="userfront-form-row">
        <Input.VerificationCode showError={verificationCodeError} />
      </div>
      <ErrorMessage error={error} />
      <div className="userfront-button-row">
        <BackButton onEvent={onEvent} />
        <SubmitButton />
      </div>
    </form>
  );
};

export default EnterVerificationCode;
