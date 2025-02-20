/**
 * Displays an error message given a Userfront error.
 * Displays nothing if no error is passed, so can be safely included
 * regardless of whether there's an error.
 * If the error lacks a message, gives an "unknown error" message.
 *
 * @param {object} props
 * @param {object} props.error - the error returned from Userfront
 * @returns
 */
const ErrorMessage = ({ error }) => {
  const classes = ["userfront-error"];
  const hasError = !!error;

  if (hasError) {
    classes.push("userfront-has-error");
  }
  const message =
    error?.message || "An unknown error has occurred. Please try again later.";
  return (
    <div className={classes.join(" ")} role="alert">
      {hasError && <span className="userfront-error-text">{message}</span>}
    </div>
  );
};

export default ErrorMessage;
