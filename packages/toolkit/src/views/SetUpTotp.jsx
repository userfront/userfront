import { useState } from "react";
import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";
import ErrorMessage from "../components/ErrorMessage";
import Input from "../components/Input";

/**
 * View for the user to set up their TOTP authenticator.
 *
 * @param {object} props
 * @param {string} props.qrCode - QR code to display. Image URL or data-url.
 * @param {boolean} props.allowBack - if true, show a Back button
 * @param {object} error - a Userfront error to display
 * @param {function} onEvent
 */
const EnterTotpCode = ({ qrCode, onEvent, allowBack, error }) => {
  const [totpCodeError, setTotpCodeError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const totpCode = event.target.elements.totpCode.value;
    // Enforce presence of totpCode
    setTotpCodeError(!totpCode);
    if (!totpCode) return;

    onEvent({
      type: "submit",
      totpCode,
    });
  };

  return (
    <>
      <p>1. Scan this QR code with your authenticator app</p>
      <img src={qrCode} width="100px" height="100px" />
      <p>2. Enter the six-digit code below</p>
      <form onSubmit={handleSubmit} className="userfront-form">
        <div className="userfront-form-row">
          <Input.TotpCode label="Six-digit code" showError={totpCodeError} />
        </div>
        <ErrorMessage error={error} />
        <div className="userfront-button-row">
          {allowBack && <BackButton onEvent={onEvent} />}
          <SubmitButton />
        </div>
      </form>
    </>
  );
};

export default EnterTotpCode;
