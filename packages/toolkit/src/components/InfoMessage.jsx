/**
 * An informational message, with some formatting and appropriate ARIA role.
 * Should only be used for messages that appear as a result of user action.
 *
 * @param {object} props
 * @param {string} props.message - message to display
 * @returns
 */
const InfoMessage = ({ message }) => {
  const classes = ["userfront-info-message"];
  const hasMessage = !!message;
  if (hasMessage) {
    classes.push("userfront-has-info-message");
  }
  return (
    <div className={classes.join(" ")} role="alert">
      {hasMessage && (
        <span className="userfront-info-message-text">{message}</span>
      )}
    </div>
  );
};

export default InfoMessage;
