import ContinueButton from "../components/ContinueButton";

/**
 * View to confirm that the TOTP factor was successfully set up,
 * and to display backup codes so the user can record them.
 *
 * @param {object} props
 * @param {array} props.backupCodes - array of strings
 * @param {function} onEvent
 */
const SetUpTotpSuccess = ({ backupCodes, onEvent }) => {
  const handleContinue = (event) => {
    event.preventDefault();
    onEvent({
      type: "finish",
    });
  };

  return (
    <>
      <p>
        These are your backup codes. Each of these codes can be used once to log
        in, in place of the code from your authenticator app or device. Write
        these codes down and store them in a safe place.
      </p>
      <ul>
        {backupCodes.map((code) => (
          <li key={code}>{code}</li>
        ))}
      </ul>
      <ContinueButton onClick={handleContinue}>Finish</ContinueButton>
    </>
  );
};

export default SetUpTotpSuccess;
