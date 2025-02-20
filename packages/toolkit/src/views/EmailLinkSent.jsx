import BackButton from "../components/BackButton";
import RetryButton from "../components/RetryButton";
import InfoMessage from "../components/InfoMessage";

/**
 * View confirming that a link was sent to the user's email.
 * @param {object} props
 * @param {object} props.user
 * @param {string} props.user.email - the email a link was sent to
 * @param {string} message - info message to display on later user action, i.e. "email resent"
 * @param {function} onEvent
 * @returns
 */
const EmailLinkSent = ({ onEvent, user, message }) => {
  const onResend = () => {
    onEvent({
      type: "resend",
    });
  };
  return (
    <div>
      <p>A link has been sent to {user.email}.</p>
      <InfoMessage message={message} />
      <div className="userfront-button-row">
        <BackButton onEvent={onEvent} />
        <RetryButton onClick={onResend}>Resend</RetryButton>
      </div>
    </div>
  );
};

export default EmailLinkSent;
